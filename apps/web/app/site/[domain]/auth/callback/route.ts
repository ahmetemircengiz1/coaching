import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";
import type { EmailOtpType } from "@supabase/supabase-js";

// Öğrenci e-posta doğrulama / şifre sıfırlama callback'i.
// E-posta şablonu `?token_hash=...&type=email&next=...` gönderir (verifyOtp,
// cihaz/tarayıcı bağımsız). Eski `?code=...` (PKCE) linkleri de desteklenir.
export async function GET(
  request: Request,
  { params }: { params: Promise<{ domain: string }> },
) {
  const { domain } = await params;
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");
  const tokenHash = searchParams.get("token_hash");
  const otpType = searchParams.get("type") as EmailOtpType | null;
  const nextRaw = searchParams.get("next") || `/site/${domain}/student`;

  // Open-redirect önlemek için sadece kendi path'lerimize izin ver
  const next =
    nextRaw.startsWith("/") && !nextRaw.startsWith("//")
      ? nextRaw
      : `/site/${domain}/student`;

  if (code || (tokenHash && otpType)) {
    const supabase = await createClient();
    const { error } = tokenHash && otpType
      ? await supabase.auth.verifyOtp({ type: otpType, token_hash: tokenHash })
      : await supabase.auth.exchangeCodeForSession(code!);
    if (!error) {
      return NextResponse.redirect(`${origin}${next}`);
    }
  }

  // Auth hatası - auth sayfasına geri yönlendir
  return NextResponse.redirect(
    `${origin}/site/${domain}/auth?error=auth_failed`,
  );
}
