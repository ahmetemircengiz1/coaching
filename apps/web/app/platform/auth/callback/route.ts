import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import type { EmailOtpType } from "@supabase/supabase-js";

// Supabase email confirmation + password reset callback.
// E-posta şablonu `?token_hash=...&type=email&next=...` gönderir (verifyOtp,
// cihaz/tarayıcı bağımsız). Eski `?code=...` (PKCE) linkleri de desteklenir;
// o akış code-verifier çerezi gerektirdiğinden yalnızca aynı tarayıcıda çalışır.
export async function GET(request: NextRequest) {
  const { searchParams, origin } = request.nextUrl;
  const code = searchParams.get("code");
  const tokenHash = searchParams.get("token_hash");
  const otpType = searchParams.get("type") as EmailOtpType | null;
  const nextRaw = searchParams.get("next") || "/platform/onboarding";

  // Open-redirect önlemek için sadece kendi path'lerimize izin ver
  const next = nextRaw.startsWith("/") && !nextRaw.startsWith("//") ? nextRaw : "/platform/onboarding";

  if (!code && !(tokenHash && otpType)) {
    return NextResponse.redirect(`${origin}/platform/auth?error=invalid-link`);
  }

  const supabase = await createClient();

  const { error } = tokenHash && otpType
    ? await supabase.auth.verifyOtp({ type: otpType, token_hash: tokenHash })
    : await supabase.auth.exchangeCodeForSession(code!);

  if (error) {
    return NextResponse.redirect(`${origin}/platform/auth?error=confirmation-failed`);
  }

  return NextResponse.redirect(`${origin}${next}`);
}
