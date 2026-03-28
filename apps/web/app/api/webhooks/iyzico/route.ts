import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // TODO: iyzico webhook signature doğrulama
    // TODO: Ödeme durumunu güncelle
    // TODO: Abonelik yönetimi

    console.log("iyzico webhook received:", body);

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error("iyzico webhook error:", error);
    return NextResponse.json(
      { error: "Webhook processing failed" },
      { status: 500 }
    );
  }
}
