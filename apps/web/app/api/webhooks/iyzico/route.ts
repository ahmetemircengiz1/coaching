import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";
import { headers } from "next/headers";
import { checkRateLimitAsync, getClientIp, PUBLIC_LIMIT } from "@/lib/rate-limit";

const IYZICO_SECRET_KEY = process.env.IYZICO_SECRET_KEY || "";

function verifyIyzicoSignature(payload: string, receivedSignature: string): boolean {
  if (!IYZICO_SECRET_KEY) return false;
  const computed = crypto
    .createHmac("sha1", IYZICO_SECRET_KEY)
    .update(payload)
    .digest("base64");
  const a = Buffer.from(computed);
  const b = Buffer.from(receivedSignature);
  // timingSafeEqual farklı uzunlukta exception fırlatır → önce uzunluk kıyası
  if (a.length !== b.length) return false;
  return crypto.timingSafeEqual(a, b);
}

export async function POST(request: NextRequest) {
  try {
    // Rate limit
    const hdrs = await headers();
    const ip = hdrs.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";
    const rl = await checkRateLimitAsync(`webhook:iyzico:${ip}`, PUBLIC_LIMIT);
    if (!rl.success) {
      return NextResponse.json({ error: "Too many requests" }, { status: 429 });
    }

    const rawBody = await request.text();

    // İmza doğrulama (iyzico entegrasyonu aktif olduğunda çalışacak)
    if (IYZICO_SECRET_KEY) {
      const signature = request.headers.get("x-iyz-signature") || "";
      if (!signature || !verifyIyzicoSignature(rawBody, signature)) {
        console.error("[iyzico webhook] Signature verification failed");
        return NextResponse.json({ error: "Invalid signature" }, { status: 401 });
      }
    } else {
      // Ödeme sistemi henüz aktif değil — webhook'u sessizce kabul et
      return NextResponse.json({ received: true, status: "payment_not_configured" });
    }

    const body = JSON.parse(rawBody);
    const eventType = body?.iyziEventType || body?.status;

    // TODO: Ödeme sistemi aktif olduğunda burayı implement et
    // switch (eventType) {
    //   case "CHECKOUT_FORM_AUTH":
    //     // Ödeme başarılı — aboneliği aktifleştir
    //     break;
    //   case "SUBSCRIPTION_ORDER_SUCCESS":
    //     // Abonelik yenileme başarılı
    //     break;
    //   case "SUBSCRIPTION_ORDER_FAILURE":
    //     // Abonelik yenileme başarısız — durumu güncelle
    //     break;
    // }

    return NextResponse.json({ received: true });
  } catch {
    return NextResponse.json(
      { error: "Webhook processing failed" },
      { status: 500 },
    );
  }
}
