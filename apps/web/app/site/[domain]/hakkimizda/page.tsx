import prisma from "@coach-os/database";
import { notFound } from "next/navigation";
import { LandingThemeProvider } from "@/src/components/landing/LandingThemeProvider";
import { resolveLandingThemeId } from "@/src/theme/landingThemes";
import { buildWhatsAppUrl } from "@/src/components/landing/helpers";
import type { LandingThemeContent } from "@/src/components/landing/types";
import { AboutTheme1 } from "@/src/components/landing/about/AboutTheme1";
import { AboutTheme2 } from "@/src/components/landing/about/AboutTheme2";
import { AboutTheme3 } from "@/src/components/landing/about/AboutTheme3";
import { AboutTheme4 } from "@/src/components/landing/about/AboutTheme4";
import { AboutTheme5 } from "@/src/components/landing/about/AboutTheme5";
import { AboutTheme6 } from "@/src/components/landing/about/AboutTheme6";

async function getCoachAbout(domain: string) {
  const selectFields = {
    brandName: true,
    bio: true,
    aboutText: true,
    landingThemeId: true,
    templateId: true,
    headingFont: true,
    bodyFont: true,
    primaryColor: true,
    secondaryColor: true,
    email: true,
    whatsappNumber: true,
    logo: true,
  } as const;

  let coach = await prisma.coach.findUnique({
    where: { subdomain: domain },
    select: selectFields,
  });

  if (!coach) {
    coach = await prisma.coach.findUnique({
      where: { customDomain: domain },
      select: selectFields,
    });
  }

  return coach;
}

export default async function HakkimizdaPage({
  params,
}: {
  params: Promise<{ domain: string }>;
}) {
  const { domain } = await params;
  const coach = await getCoachAbout(domain);

  if (!coach) {
    notFound();
  }

  const themeId = coach.landingThemeId
    ? resolveLandingThemeId(`theme-${coach.landingThemeId}`)
    : resolveLandingThemeId(coach.templateId);

  const aboutContent = (coach as Record<string, unknown>).aboutText as string | null;
  const displayText = aboutContent || coach.bio || "";
  const paragraphs = displayText.split(/\n\s*\n/).map((p) => p.trim()).filter(Boolean);

  const content: LandingThemeContent = {
    domain,
    brandName: coach.brandName,
    bio: coach.bio,
    logo: coach.logo ?? null,
    heroImage: null,
    heroImageDesktopUrl: null,
    heroImageMobileUrl: null,
    heroImageBlurDataUrl: null,
    heroImageCutoutUrl: null,
    heroFocalX: 50,
    heroFocalY: 35,
    heroMode: "photo",
    email: coach.email,
    authUrl: `/site/${domain}/auth`,
    whatsappUrl: buildWhatsAppUrl(coach.brandName, coach.whatsappNumber),
    whatsappNumber: coach.whatsappNumber ?? null,
    packages: [],
    transformations: [],
    testimonials: [],
    studentCount: 0,
    transformationCount: 0,
    programCount: 0,
    landingConfig: null,
    socialLinks: null,
    headingFont: coach.headingFont ?? null,
    bodyFont: coach.bodyFont ?? null,
    heroImageDark: null,
    landingTexts: null,
  };

  const aboutProps = { content, paragraphs };

  const AboutComponent = {
    "theme-1": AboutTheme1,
    "theme-2": AboutTheme2,
    "theme-3": AboutTheme3,
    "theme-4": AboutTheme4,
    "theme-5": AboutTheme5,
    "theme-6": AboutTheme6,
    "theme-elite": AboutTheme1, // Elite tema için klasik 1 fallback (Section Builder'da about block ayrıca seçilir)
  }[themeId] ?? AboutTheme1;

  return (
    <LandingThemeProvider
      themeId={themeId}
      headingFont={coach.headingFont}
      bodyFont={coach.bodyFont}
    >
      <AboutComponent {...aboutProps} />
    </LandingThemeProvider>
  );
}
