import type { MetadataRoute } from "next";

const APP_URL = process.env.NEXT_PUBLIC_APP_URL || "https://localhost:3002";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/platform/", "/api/", "/site/*/dashboard/", "/site/*/student/"],
      },
    ],
    sitemap: `${APP_URL}/sitemap.xml`,
  };
}
