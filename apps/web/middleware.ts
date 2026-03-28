import { NextResponse, type NextRequest } from "next/server";
import { updateSession } from "@/lib/supabase/middleware";

export async function middleware(request: NextRequest) {
  // Supabase auth session'ı güncelle
  const response = await updateSession(request);

  const hostname = request.headers.get("host") || "localhost:3000";
  const pathname = request.nextUrl.pathname;

  // Static dosyaları ve API route'ları geç
  if (
    pathname.startsWith("/_next") ||
    pathname.startsWith("/api") ||
    pathname.includes(".") // static files (.ico, .png, etc.)
  ) {
    return response;
  }

  // /site/ ile başlayan path'leri doğrudan geçir (development preview)
  if (pathname.startsWith("/site/")) {
    return response;
  }

  // Ana platform domain'ini belirle
  const appDomain = process.env.NEXT_PUBLIC_APP_DOMAIN || "localhost:3000";
  const cleanHostname = hostname.replace(/:\d+$/, ""); // Port'u kaldır
  const cleanAppDomain = appDomain.replace(/:\d+$/, "");

  // Ana platform mı?
  const isPlatform =
    cleanHostname === cleanAppDomain ||
    cleanHostname === `www.${cleanAppDomain}` ||
    cleanHostname === "localhost";

  if (isPlatform) {
    // Zaten /platform/ ile başlıyorsa tekrar ekleme
    if (pathname.startsWith("/platform")) {
      return response;
    }
    // Ana SaaS platformu - (platform) route group'una yönlendir
    const url = request.nextUrl.clone();
    url.pathname = `/platform${pathname}`;
    return NextResponse.rewrite(url, {
      headers: response.headers,
    });
  }

  // Coach sitesi - subdomain veya custom domain
  // Subdomain'i çıkar
  let tenantSlug = "";

  if (cleanHostname.endsWith(`.${cleanAppDomain}`)) {
    tenantSlug = cleanHostname.replace(`.${cleanAppDomain}`, "");
  } else {
    // Custom domain - hostname'in kendisi slug olarak kullanılacak
    // Gerçek tenant resolution veritabanından yapılacak
    tenantSlug = cleanHostname;
  }

  if (tenantSlug) {
    const url = request.nextUrl.clone();
    url.pathname = `/site/${tenantSlug}${pathname}`;
    return NextResponse.rewrite(url, {
      headers: response.headers,
    });
  }

  return response;
}

export const config = {
  matcher: [
    /*
     * Aşağıdakiler hariç tüm route'ları eşleştir:
     * - _next/static (static dosyalar)
     * - _next/image (image optimization)
     * - favicon.ico (favicon)
     * - public dosyaları
     */
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
