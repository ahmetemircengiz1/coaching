import { NextRequest, NextResponse } from "next/server";
import { isSubdomainAvailable } from "@/lib/tenant";
import { checkRateLimitAsync, rateLimitResponse, getClientKey, PUBLIC_LIMIT } from "@/lib/rate-limit";

// Subdomain kullanılabilirliğini kontrol et
export async function GET(request: NextRequest) {
  // Rate limit — public endpoint, 30 req/min per IP
  const rl = await checkRateLimitAsync(getClientKey(request), PUBLIC_LIMIT);
  const blocked = rateLimitResponse(rl);
  if (blocked) return blocked;

  const { searchParams } = new URL(request.url);
  const subdomain = searchParams.get("subdomain");

  if (!subdomain) {
    return NextResponse.json(
      { error: "Subdomain parametresi gerekli" },
      { status: 400 }
    );
  }

  // Validasyon
  if (subdomain.length < 3 || subdomain.length > 30) {
    return NextResponse.json(
      { available: false, error: "Subdomain 3-30 karakter arası olmalı" },
      { status: 200 }
    );
  }

  if (!/^[a-z0-9-]+$/.test(subdomain)) {
    return NextResponse.json(
      {
        available: false,
        error: "Sadece küçük harf, rakam ve tire kullanılabilir",
      },
      { status: 200 }
    );
  }

  const available = await isSubdomainAvailable(subdomain);

  return NextResponse.json({ available });
}
