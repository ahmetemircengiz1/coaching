/**
 * Rate limiter.
 *
 * İki katman:
 *  1. In-memory sliding window (varsayılan) — sıfır bağımlılık, tek instance.
 *  2. Upstash Redis (dağıtık) — UPSTASH_REDIS_REST_URL + UPSTASH_REDIS_REST_TOKEN
 *     env'leri tanımlıysa otomatik devreye girer. Vercel serverless'ta her instance
 *     ayrı bellek kullandığı için brute-force koruması ancak dağıtık sayaçla doğru
 *     çalışır.
 *
 * Kullanım: güvenlik-kritik yollarda `await checkRateLimitAsync(...)` çağır.
 * `checkRateLimit` (senkron, in-memory) fallback olarak korunur.
 */

interface RateLimitEntry {
  count: number;
  resetAt: number;
}

const store = new Map<string, RateLimitEntry>();

// Periodically clean up expired entries to prevent memory leaks
const CLEANUP_INTERVAL = 60_000; // 1 minute
let cleanupTimer: ReturnType<typeof setInterval> | null = null;

function ensureCleanup() {
  if (cleanupTimer) return;
  cleanupTimer = setInterval(() => {
    const now = Date.now();
    for (const [key, entry] of store) {
      if (now >= entry.resetAt) {
        store.delete(key);
      }
    }
    // If store is empty, stop the timer
    if (store.size === 0 && cleanupTimer) {
      clearInterval(cleanupTimer);
      cleanupTimer = null;
    }
  }, CLEANUP_INTERVAL);
  // Prevent timer from keeping the process alive
  if (cleanupTimer && typeof cleanupTimer === "object" && "unref" in cleanupTimer) {
    cleanupTimer.unref();
  }
}

interface RateLimitConfig {
  /** Max requests allowed in the window */
  limit: number;
  /** Window duration in seconds */
  windowSeconds: number;
}

interface RateLimitResult {
  success: boolean;
  limit: number;
  remaining: number;
  resetAt: number;
}

/**
 * Check rate limit for a given key (e.g. IP address, user ID).
 * Returns { success, limit, remaining, resetAt }.
 */
export function checkRateLimit(
  key: string,
  config: RateLimitConfig,
): RateLimitResult {
  ensureCleanup();

  const now = Date.now();
  const entry = store.get(key);

  // Window expired or first request — reset
  if (!entry || now >= entry.resetAt) {
    const newEntry: RateLimitEntry = {
      count: 1,
      resetAt: now + config.windowSeconds * 1000,
    };
    store.set(key, newEntry);
    return {
      success: true,
      limit: config.limit,
      remaining: config.limit - 1,
      resetAt: newEntry.resetAt,
    };
  }

  // Within window
  if (entry.count < config.limit) {
    entry.count += 1;
    return {
      success: true,
      limit: config.limit,
      remaining: config.limit - entry.count,
      resetAt: entry.resetAt,
    };
  }

  // Rate limited
  return {
    success: false,
    limit: config.limit,
    remaining: 0,
    resetAt: entry.resetAt,
  };
}

// ── Dağıtık katman (Upstash Redis REST) ──

const UPSTASH_URL = process.env.UPSTASH_REDIS_REST_URL;
const UPSTASH_TOKEN = process.env.UPSTASH_REDIS_REST_TOKEN;

/** Upstash env'leri tanımlı mı? */
export function isDistributedRateLimitEnabled(): boolean {
  return Boolean(UPSTASH_URL && UPSTASH_TOKEN);
}

/**
 * Upstash REST pipeline ile fixed-window sayaç.
 * INCR + (ilk vuruşta) EXPIRE NX + TTL — tek round-trip.
 */
async function upstashCheck(
  key: string,
  config: RateLimitConfig,
): Promise<RateLimitResult> {
  const redisKey = `rl:${key}`;
  const res = await fetch(`${UPSTASH_URL}/pipeline`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${UPSTASH_TOKEN}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify([
      ["INCR", redisKey],
      ["EXPIRE", redisKey, config.windowSeconds, "NX"],
      ["TTL", redisKey],
    ]),
    // Rate limit kontrolü hızlı olmalı; takılırsa fallback'e düş.
    signal: AbortSignal.timeout(1500),
  });
  if (!res.ok) throw new Error(`upstash ${res.status}`);

  const data = (await res.json()) as { result: number }[];
  const count = data[0]?.result ?? 1;
  let ttl = data[2]?.result ?? config.windowSeconds;
  if (ttl < 0) ttl = config.windowSeconds; // -1/-2 güvencesi
  const resetAt = Date.now() + ttl * 1000;

  return {
    success: count <= config.limit,
    limit: config.limit,
    remaining: Math.max(0, config.limit - count),
    resetAt,
  };
}

/**
 * Rate limit kontrolü — Upstash tanımlıysa dağıtık, değilse in-memory.
 * Upstash erişilemezse (ağ hatası/timeout) in-memory'e düşer (fail-safe).
 */
export async function checkRateLimitAsync(
  key: string,
  config: RateLimitConfig,
): Promise<RateLimitResult> {
  if (isDistributedRateLimitEnabled()) {
    try {
      return await upstashCheck(key, config);
    } catch {
      // Upstash down/timeout → in-memory ile devam et (yine de sınırlı)
    }
  }
  return checkRateLimit(key, config);
}

/**
 * Apply rate limit headers and return 429 if exceeded.
 * Use in API route handlers.
 */
export function rateLimitResponse(result: RateLimitResult): Response | null {
  if (result.success) return null;

  const retryAfter = Math.ceil((result.resetAt - Date.now()) / 1000);
  return new Response(
    JSON.stringify({ error: "Çok fazla istek. Lütfen biraz bekleyin." }),
    {
      status: 429,
      headers: {
        "Content-Type": "application/json",
        "Retry-After": String(retryAfter),
        "X-RateLimit-Limit": String(result.limit),
        "X-RateLimit-Remaining": "0",
        "X-RateLimit-Reset": String(result.resetAt),
      },
    },
  );
}

/**
 * Extract client identifier from request.
 * Uses authenticated user ID if available, falls back to IP.
 */
export function getClientKey(request: Request, userId?: string | null): string {
  if (userId) return `user:${userId}`;
  const forwarded = request.headers.get("x-forwarded-for");
  const ip = forwarded?.split(",")[0]?.trim() || "unknown";
  return `ip:${ip}`;
}

/**
 * Extract client IP from Next.js headers() in Server Actions.
 * Call with: `const hdrs = await headers(); getClientIp(hdrs)`
 */
export function getClientIp(hdrs: Headers): string {
  const forwarded = hdrs.get("x-forwarded-for");
  return forwarded?.split(",")[0]?.trim() || "unknown";
}

// ── Preset configurations ──

/** Auth actions: login, register — strict to prevent brute force */
export const AUTH_LIMIT: RateLimitConfig = { limit: 10, windowSeconds: 300 };

/** File uploads — expensive operations */
export const UPLOAD_LIMIT: RateLimitConfig = { limit: 20, windowSeconds: 600 };

/** General API reads — moderate */
export const API_READ_LIMIT: RateLimitConfig = { limit: 60, windowSeconds: 60 };

/** Public endpoints (subdomain check etc.) — lenient but bounded */
export const PUBLIC_LIMIT: RateLimitConfig = { limit: 30, windowSeconds: 60 };

/** Server actions (settings save, CRUD) — moderate */
export const ACTION_LIMIT: RateLimitConfig = { limit: 40, windowSeconds: 60 };
