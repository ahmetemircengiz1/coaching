import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";
import { headers } from "next/headers";
import { checkRateLimitAsync, PUBLIC_LIMIT } from "@/lib/rate-limit";

const STRIPE_WEBHOOK_SECRET = process.env.STRIPE_WEBHOOK_SECRET || "";

function verifyStripeSignature(payload: string, signatureHeader: string): boolean {
  if (!STRIPE_WEBHOOK_SECRET) return false;

  const parts = Object.fromEntries(
    signatureHeader.split(",").map((p) => {
      const [k, v] = p.split("=");
      return [k, v] as [string, string];
    }),
  );

  const timestamp = parts.t;
  const signature = parts.v1;
  if (!timestamp || !signature) return false;

  // Replay attack koruması: 5 dakikadan eski event'leri reddet
  const age = Math.abs(Date.now() / 1000 - Number(timestamp));
  if (age > 300) return false;

  const signedPayload = `${timestamp}.${payload}`;
  const expected = crypto
    .createHmac("sha256", STRIPE_WEBHOOK_SECRET)
    .update(signedPayload)
    .digest("hex");

  const a = Buffer.from(expected);
  const b = Buffer.from(signature);
  // timingSafeEqual farklı uzunlukta exception fırlatır → önce uzunluk kıyası
  if (a.length !== b.length) return false;
  return crypto.timingSafeEqual(a, b);
}

export async function POST(request: NextRequest) {
  try {
    // Rate limit
    const hdrs = await headers();
    const ip = hdrs.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";
    const rl = await checkRateLimitAsync(`webhook:stripe:${ip}`, PUBLIC_LIMIT);
    if (!rl.success) {
      return NextResponse.json({ error: "Too many requests" }, { status: 429 });
    }

    const rawBody = await request.text();

    // İmza doğrulama (Stripe entegrasyonu aktif olduğunda çalışacak)
    if (STRIPE_WEBHOOK_SECRET) {
      const signatureHeader = request.headers.get("stripe-signature") || "";
      if (!signatureHeader || !verifyStripeSignature(rawBody, signatureHeader)) {
        console.error("[stripe webhook] Signature verification failed");
        return NextResponse.json({ error: "Invalid signature" }, { status: 401 });
      }
    } else {
      // Ödeme sistemi henüz aktif değil — webhook'u sessizce kabul et
      return NextResponse.json({ received: true, status: "payment_not_configured" });
    }

    const event = JSON.parse(rawBody);
    const eventType = event?.type;

    // TODO: Ödeme sistemi aktif olduğunda burayı implement et
    // switch (eventType) {
    //   case "checkout.session.completed":
    //     // Ödeme başarılı — aboneliği aktifleştir
    //     break;
    //   case "invoice.payment_succeeded":
    //     // Abonelik yenileme başarılı
    //     break;
    //   case "invoice.payment_failed":
    //     // Abonelik yenileme başarısız
    //     break;
    //   case "customer.subscription.deleted":
    //     // Abonelik iptal
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
