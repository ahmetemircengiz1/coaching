import type { MetadataRoute } from "next";
import prisma from "@coach-os/database";

const APP_URL = process.env.NEXT_PUBLIC_APP_URL || "https://localhost:3002";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const coaches = await prisma.coach.findMany({
    where: { subscriptionStatus: "active" },
    select: {
      subdomain: true,
      customDomain: true,
      updatedAt: true,
    },
  });

  const staticPages: MetadataRoute.Sitemap = [
    {
      url: APP_URL,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 1,
    },
    {
      url: `${APP_URL}/platform/pricing`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.9,
    },
    {
      url: `${APP_URL}/faq`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.6,
    },
    {
      url: `${APP_URL}/kvkk`,
      lastModified: new Date(),
      changeFrequency: "yearly",
      priority: 0.3,
    },
    {
      url: `${APP_URL}/terms`,
      lastModified: new Date(),
      changeFrequency: "yearly",
      priority: 0.3,
    },
    {
      url: `${APP_URL}/privacy`,
      lastModified: new Date(),
      changeFrequency: "yearly",
      priority: 0.3,
    },
  ];

  const coachPages: MetadataRoute.Sitemap = coaches.flatMap((coach) => {
    const baseUrl = coach.customDomain
      ? `https://${coach.customDomain}`
      : `${APP_URL}/site/${coach.subdomain}`;

    return [
      {
        url: baseUrl,
        lastModified: coach.updatedAt,
        changeFrequency: "weekly" as const,
        priority: 0.8,
      },
      {
        url: `${baseUrl}/hakkimizda`,
        lastModified: coach.updatedAt,
        changeFrequency: "monthly" as const,
        priority: 0.5,
      },
    ];
  });

  return [...staticPages, ...coachPages];
}
