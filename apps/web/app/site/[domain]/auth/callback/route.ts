import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ domain: string }> },
) {
  const { domain } = await params;
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");
  const next = searchParams.get("next") || `/site/${domain}/student`;

  if (code) {
    const supabase = await createClient();
    const { error } = await supabase.auth.exchangeCodeForSession(code);
    if (!error) {
      return NextResponse.redirect(`${origin}${next}`);
    }
  }

  // Auth hatası - auth sayfasına geri yönlendir
  return NextResponse.redirect(
    `${origin}/site/${domain}/auth?error=auth_failed`,
  );
}
