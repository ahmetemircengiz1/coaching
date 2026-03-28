import prisma from "@coach-os/database";
import { notFound } from "next/navigation";
import { LandingThemeProvider } from "@/src/components/landing/LandingThemeProvider";
import { LandingRenderer } from "@/src/components/landing/LandingRenderer";
import { buildWhatsAppUrl } from "@/src/components/landing/helpers";
import type { LandingThemeContent } from "@/src/components/landing/types";
import { resolveLandingThemeId } from "@/src/theme/landingThemes";
import { resolveLandingConfig, resolveSocialLinks } from "@/src/components/landing/config";

async function getCoachData(domain: string) {
  let coach = await prisma.coach.findUnique({
    where: { subdomain: domain },
    include: {
      coachPackages: {
        where: { isActive: true },
        orderBy: { orderIndex: "asc" },
      },
      transformations: {
        where: { isPublished: true },
        orderBy: { orderIndex: "asc" },
        take: 8,
      },
      _count: { select: { students: { where: { status: "active" } }, programs: true } },
    },
  });

  if (!coach) {
    coach = await prisma.coach.findUnique({
      where: { customDomain: domain },
      include: {
        coachPackages: {
          where: { isActive: true },
          orderBy: { orderIndex: "asc" },
        },
        transformations: {
          where: { isPublished: true },
          orderBy: { orderIndex: "asc" },
          take: 8,
        },
        _count: { select: { students: { where: { status: "active" } }, programs: true } },
      },
    });
  }

  return coach;
}

export default async function CoachLandingPage({
  params,
}: {
  params: Promise<{ domain: string }>;
}) {
  const { domain } = await params;
  const coach = await getCoachData(domain);

  if (!coach) {
    notFound();
  }

  const themeId = coach.landingThemeId
    ? resolveLandingThemeId(`theme-${coach.landingThemeId}`)
    : resolveLandingThemeId(coach.templateId);
  const content: LandingThemeContent = {
    domain,
    brandName: coach.brandName,
    bio: coach.bio,
    logo: coach.logo,
    heroImage: (coach as Record<string, unknown>).heroImageDesktopUrl as string | null ?? null,
    heroImageOriginalUrl: (coach as Record<string, unknown>).heroImageOriginalUrl as string | null ?? null,
    heroImageDesktopUrl: (coach as Record<string, unknown>).heroImageDesktopUrl as string | null ?? null,
    heroImageMobileUrl: (coach as Record<string, unknown>).heroImageMobileUrl as string | null ?? null,
    heroImageBlurDataUrl: (coach as Record<string, unknown>).heroImageBlurDataUrl as string | null ?? null,
    heroImageCutoutUrl: (coach as Record<string, unknown>).heroImageCutoutUrl as string | null ?? null,
    heroFocalX: ((coach as Record<string, unknown>).heroFocalX as number) ?? 50,
    heroFocalY: ((coach as Record<string, unknown>).heroFocalY as number) ?? 35,
    heroMode: ((coach as Record<string, unknown>).heroMode as "photo" | "logo") || "photo",
    email: coach.email,
    authUrl: `/site/${domain}/auth`,
    whatsappUrl: buildWhatsAppUrl(coach.brandName),
    packages: coach.coachPackages.map((pkg) => ({
      id: pkg.id,
      name: pkg.name,
      description: pkg.description,
      duration: pkg.duration,
      price: Number(pkg.price),
      currency: pkg.currency,
      features: Array.isArray(pkg.features) ? (pkg.features as string[]) : [],
    })),
    transformations: coach.transformations.map((item) => ({
      id: item.id,
      clientName: item.clientName,
      beforePhoto: item.beforePhoto,
      afterPhoto: item.afterPhoto,
      duration: item.duration,
      description: item.description,
    })),
    studentCount: coach._count.students,
    transformationCount: coach.transformations.length,
    programCount: coach._count.programs,
    // Kademe 2: Gelişmiş Kişiselleştirme
    landingConfig: coach.landingConfig ? resolveLandingConfig(coach.landingConfig) : null,
    socialLinks: coach.socialLinks ? resolveSocialLinks(coach.socialLinks) : null,
    headingFont: coach.headingFont ?? null,
    bodyFont: coach.bodyFont ?? null,
  };

  return (
    <LandingThemeProvider themeId={themeId} headingFont={content.headingFont} bodyFont={content.bodyFont}>
      <LandingRenderer themeId={themeId} content={content} />
    </LandingThemeProvider>
  );
}
