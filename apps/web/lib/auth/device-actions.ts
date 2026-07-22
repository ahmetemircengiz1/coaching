"use server";

/**
 * Cihaz tanıma + yeni cihaz uyarısı.
 *
 * Her başarılı girişten sonra çağrılır: httpOnly "shred_did" çerezindeki cihaz
 * UUID'si KnownDevice tablosuyla eşleştirilir. Kullanıcının daha önce hiç
 * görmediğimiz bir cihazından giriş yapıldıysa (ve bu ilk cihazı değilse)
 * hesap e-postasına güvenlik uyarısı gönderilir + panel bildirimi düşülür.
 * Çerez silinmiş/gizli pencere de "yeni cihaz" sayılır — e-posta metni bunu
 * "yeni cihaz veya tarayıcı" diye açıklar.
 */

import { cookies, headers } from "next/headers";
import { randomUUID } from "crypto";
import prisma from "@coach-os/database";
import { getAuthUser } from "@/lib/supabase/server";
import { sendMail, buildNewDeviceLoginEmail } from "@/lib/email/send";
import { createNotification } from "@/lib/notifications";
import { checkRateLimitAsync } from "@/lib/rate-limit";

const DEVICE_COOKIE = "shred_did";
const COOKIE_MAX_AGE = 60 * 60 * 24 * 365; // 1 yıl

/** User-agent'tan kısa, insan-okur özet çıkarır (tam UA e-postaya konmaz). */
function summarizeUserAgent(ua: string | null): string {
  if (!ua) return "Bilinmeyen tarayıcı";
  const browser = ua.includes("Edg/")
    ? "Edge"
    : ua.includes("OPR/") || ua.includes("Opera")
      ? "Opera"
      : ua.includes("Firefox/")
        ? "Firefox"
        : ua.includes("Chrome/")
          ? "Chrome"
          : ua.includes("Safari/")
            ? "Safari"
            : "Tarayıcı";
  const os = ua.includes("Windows")
    ? "Windows"
    : ua.includes("Android")
      ? "Android"
      : ua.includes("iPhone") || ua.includes("iPad")
        ? "iOS"
        : ua.includes("Mac OS")
          ? "macOS"
          : ua.includes("Linux")
            ? "Linux"
            : "";
  return os ? `${browser} · ${os}` : browser;
}

function getBaseUrl(hdrs: Headers): string {
  const envUrl = process.env.NEXT_PUBLIC_APP_URL;
  if (envUrl) return envUrl.replace(/\/$/, "");
  const host = hdrs.get("host") || "localhost:3002";
  const proto = hdrs.get("x-forwarded-proto") || (host.startsWith("localhost") ? "http" : "https");
  return `${proto}://${host}`;
}

export async function recordDeviceLogin(input: {
  /** Şifre sıfırlama için yönlendirilecek site içi yol (örn. /site/koc/auth) */
  authPath: string;
  /** E-postada gösterilecek marka adı (koç sitesi markası veya "Shred") */
  brandName?: string;
}): Promise<{ newDevice: boolean }> {
  const user = await getAuthUser();
  if (!user) return { newDevice: false };

  // Sadece site içi yol kabul et — e-postaya harici link enjekte edilemesin
  const authPath = /^\/[a-zA-Z0-9\-_/]*$/.test(input.authPath) ? input.authPath : "/";

  const cookieStore = await cookies();
  let deviceId = cookieStore.get(DEVICE_COOKIE)?.value || "";
  if (!/^[a-f0-9-]{36}$/i.test(deviceId)) {
    deviceId = randomUUID();
  }
  cookieStore.set(DEVICE_COOKIE, deviceId, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: COOKIE_MAX_AGE,
    path: "/",
  });

  const hdrs = await headers();
  const userAgent = (hdrs.get("user-agent") || "").slice(0, 255) || null;

  const existing = await prisma.knownDevice.findUnique({
    where: { userId_deviceId: { userId: user.id, deviceId } },
    select: { id: true },
  });
  if (existing) {
    await prisma.knownDevice.update({
      where: { id: existing.id },
      data: { lastSeenAt: new Date(), userAgent },
    });
    return { newDevice: false };
  }

  const otherDeviceCount = await prisma.knownDevice.count({ where: { userId: user.id } });
  await prisma.knownDevice.create({ data: { userId: user.id, deviceId, userAgent } });

  // Kullanıcının ilk cihazı (kayıt/ilk giriş) — uyarıya gerek yok
  if (otherDeviceCount === 0) return { newDevice: false };

  console.log(JSON.stringify({ type: "NEW_DEVICE_LOGIN", userId: user.id }));

  // Panel bildirimi (NotificationBell bağlanınca görünür; e-posta birincil kanal)
  await createNotification({
    recipientId: user.id,
    type: "security_alert",
    title: "Yeni cihazdan giriş",
    message: `Hesabına yeni bir cihaz veya tarayıcıdan giriş yapıldı (${summarizeUserAgent(userAgent)}). Sen değilsen hemen şifreni değiştir.`,
  }).catch((err) => console.error("[device] bildirim yazılamadı:", err));

  // E-posta uyarısı — kullanıcı başına saatte en fazla 2
  const rl = await checkRateLimitAsync(`device:mail:${user.id}`, { limit: 2, windowSeconds: 3600 });
  if (rl.success && user.email) {
    const mail = buildNewDeviceLoginEmail({
      brandName: input.brandName?.trim() || "Shred",
      browserSummary: summarizeUserAgent(userAgent),
      loginAt: new Date().toLocaleString("tr-TR", {
        timeZone: "Europe/Istanbul",
        dateStyle: "long",
        timeStyle: "short",
      }),
      resetLink: `${getBaseUrl(hdrs)}${authPath}`,
    });
    mail.to = user.email;
    await sendMail(mail);
  }

  return { newDevice: true };
}
