import type { NextConfig } from "next";

// Content-Security-Policy — XSS/enjeksiyon sertleştirmesi.
// ŞİMDİLİK Report-Only: hiçbir şeyi ENGELLEMEZ, sadece ihlalleri tarayıcı
// konsoluna raporlar. Deploy sonrası konsol temizse `Content-Security-Policy`
// (Report-Only olmadan) anahtarına çevrilip ENFORCE edilmeli.
// Not: script-src/style-src 'unsafe-inline' içeriyor çünkü uygulama yoğun inline
// stil + Next bootstrap script'leri kullanıyor; nonce'a geçiş enforce aşamasında.
const cspDirectives = [
  "default-src 'self'",
  "script-src 'self' 'unsafe-inline' 'unsafe-eval' blob:",
  "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
  "img-src 'self' data: blob: https:",
  "font-src 'self' data: https://fonts.gstatic.com",
  "connect-src 'self' https://*.supabase.co wss://*.supabase.co",
  "media-src 'self' blob: https://*.supabase.co",
  "worker-src 'self' blob:",
  "frame-src 'self'",
  "object-src 'none'",
  "base-uri 'self'",
  "form-action 'self'",
  "frame-ancestors 'self'",
].join("; ");

const securityHeaders = [
  {
    key: "Content-Security-Policy-Report-Only",
    value: cspDirectives,
  },
  {
    key: "X-Frame-Options",
    value: "DENY",
  },
  {
    key: "X-Content-Type-Options",
    value: "nosniff",
  },
  {
    key: "Referrer-Policy",
    value: "strict-origin-when-cross-origin",
  },
  {
    key: "Permissions-Policy",
    value: "camera=(), microphone=(), geolocation=()",
  },
  {
    key: "X-DNS-Prefetch-Control",
    value: "on",
  },
  {
    // HTTPS zorla (Vercel zaten HTTPS sunar). Koç subdomain'lerini de kapsar.
    key: "Strict-Transport-Security",
    value: "max-age=31536000; includeSubDomains",
  },
];

const nextConfig: NextConfig = {
  poweredByHeader: false,
  experimental: {
    // Ziyaret edilen dinamik sayfaları client router cache'inde 30 sn tut:
    // dashboard'da geri/ileri ve menüden tekrar ziyaret sunucuya gitmeden anında açılır.
    // Mutasyonlar revalidatePath ile cache'i düşürdüğü için bayat veri riski yok.
    staleTimes: { dynamic: 30 },
  },
  transpilePackages: ["@coach-os/database", "@coach-os/shared"],
  serverExternalPackages: ["@imgly/background-removal-node", "sharp"],
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**.supabase.co",
      },
    ],
  },
  async headers() {
    return [
      {
        // Landing page preview: allow same-origin iframe
        source: "/site/:domain",
        headers: securityHeaders.map((h) =>
          h.key === "X-Frame-Options"
            ? { key: "X-Frame-Options", value: "SAMEORIGIN" }
            : h
        ),
      },
      {
        source: "/((?!site/[^/]+$).*)",
        headers: securityHeaders,
      },
    ];
  },
};

export default nextConfig;
