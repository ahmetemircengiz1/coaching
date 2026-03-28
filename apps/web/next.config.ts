import type { NextConfig } from "next";

const securityHeaders = [
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
];

const nextConfig: NextConfig = {
  poweredByHeader: false,
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
