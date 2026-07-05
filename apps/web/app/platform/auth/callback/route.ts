import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

// Supabase email confirmation + password reset callback.
// Supabase gönderdiği e-postadaki linkte `?code=...&next=...` olur.
export async function GET(request: NextRequest) {
  const { searchParams, origin } = request.nextUrl;
  const code = searchParams.get("code");
  const nextRaw = searchParams.get("next") || "/platform/onboarding";

  // Open-redirect önlemek için sadece kendi path'lerimize izin ver
  const next = nextRaw.startsWith("/") && !nextRaw.startsWith("//") ? nextRaw : "/platform/onboarding";

  if (!code) {
    return NextResponse.redirect(`${origin}/platform/auth?error=invalid-link`);
  }

  const supabase = await createClient();
  const { error } = await supabase.auth.exchangeCodeForSession(code);

  if (error) {
    return NextResponse.redirect(`${origin}/platform/auth?error=confirmation-failed`);
  }

  return NextResponse.redirect(`${origin}${next}`);
}
