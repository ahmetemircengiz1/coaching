import { notFound } from "next/navigation";
import { LandingThemeProvider } from "@/src/components/landing/LandingThemeProvider";
import { LandingRenderer } from "@/src/components/landing/LandingRenderer";
import { LandingSectionStyles } from "@/src/components/landing/section-styles";
import { LandingFooter } from "@/src/components/landing/shared/LandingFooter";
import { buildWhatsAppUrl } from "@/src/components/landing/helpers";
import type { LandingThemeContent } from "@/src/components/landing/types";
import { resolveLandingThemeId } from "@/src/theme/landingThemes";
import { resolveLandingConfig, resolveSocialLinks } from "@/src/components/landing/config";
import { getCachedLandingCoach } from "@/lib/coach-cache";

export default async function CoachLandingPage({
  params,
}: {
  params: Promise<{ domain: string }>;
}) {
  const { domain } = await params;
  const coach = await getCachedLandingCoach(domain);

  if (!coach) {
    notFound();
  }

  // Aşama 2: siteMode TEMPLATE|BUILDER. BUILDER → theme-elite (Section Builder),
  // TEMPLATE → seçili 1-6 arası şablon. siteMode değeri yoksa eski davranışa
  // (landingThemeId=7 ⇒ Elite) düşeriz, bu sayede geri uyumluluk korunur.
  const siteMode =
    (coach as unknown as { siteMode?: "TEMPLATE" | "BUILDER" | null }).siteMode ?? "TEMPLATE";
  const themeId =
    siteMode === "BUILDER"
      ? ("theme-elite" as const)
      : coach.landingThemeId
        ? resolveLandingThemeId(`theme-${coach.landingThemeId}`)
        : resolveLandingThemeId(coach.templateId);

  const socialLinks = coach.socialLinks ? resolveSocialLinks(coach.socialLinks) : null;
  const landingTexts = coach.landingTexts as import("@/src/components/landing/types").LandingTexts | null ?? null;

  const content: LandingThemeContent = {
    domain,
    brandName: coach.brandName,
    bio: coach.bio,
    logo: coach.logo,
    heroImage: coach.heroImageDesktopUrl ?? null,
    heroImageOriginalUrl: coach.heroImageOriginalUrl ?? null,
    heroImageDesktopUrl: coach.heroImageDesktopUrl ?? null,
    heroImageMobileUrl: coach.heroImageMobileUrl ?? null,
    heroImageBlurDataUrl: coach.heroImageBlurDataUrl ?? null,
    heroImageCutoutUrl: coach.heroImageCutoutUrl ?? null,
    heroFocalX: coach.heroFocalX ?? 50,
    heroFocalY: coach.heroFocalY ?? 35,
    heroMode: (coach.heroMode as "photo" | "logo") || "photo",
    heroVideoUrl: coach.heroVideoUrl ?? null,
    email: coach.email,
    authUrl: `/site/${domain}/auth`,
    whatsappUrl: buildWhatsAppUrl(coach.brandName, coach.whatsappNumber),
    whatsappNumber: coach.whatsappNumber ?? null,
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
      age: item.age,
      role: item.role,
      weightBefore: item.weightBefore,
      weightAfter: item.weightAfter,
      bodyFatBefore: item.bodyFatBefore,
      bodyFatAfter: item.bodyFatAfter,
      customStats: ((item as unknown as { customStats?: unknown }).customStats as
        | { label: string; value: string }[]
        | null
        | undefined) ?? null,
    })),
    testimonials: coach.testimonials.map((item) => ({
      id: item.id,
      clientName: item.clientName,
      role: item.role,
      quote: item.quote,
      rating: item.rating,
      avatar: item.avatar,
    })),
    studentCount: coach._count.students,
    transformationCount: coach.transformations.length,
    programCount: coach._count.programs,
    // Section Builder block kontratı (computed)
    title: coach.brandName,
    tagline: coach.bio || landingTexts?.heroSubtitle || undefined,
    instagramUrl: socialLinks?.instagram || undefined,
    facebookUrl: socialLinks?.facebook || undefined,
    tiktokUrl: socialLinks?.tiktok || undefined,
    youtubeUrl: socialLinks?.youtube || undefined,
    linkedinUrl: socialLinks?.linkedin || undefined,
    twitterUrl: socialLinks?.twitter || undefined,
    faqs: (coach as unknown as { landingFaqs?: import("@/src/components/landing/types").FaqItem[] | null }).landingFaqs ?? null,
    contactPhone: (coach as unknown as { contactPhone?: string | null }).contactPhone ?? null,
    businessAddress: (coach as unknown as { businessAddress?: string | null }).businessAddress ?? null,
    legalSlugs: (() => {
      const lt = (coach as unknown as { legalTexts?: Record<string, string> | null }).legalTexts;
      return lt && typeof lt === "object"
        ? Object.keys(lt).filter((k) => typeof lt[k] === "string" && lt[k].trim().length > 0)
        : [];
    })(),
    // Kademe 2: Gelişmiş Kişiselleştirme
    landingConfig: coach.landingConfig ? resolveLandingConfig(coach.landingConfig) : null,
    socialLinks,
    headingFont: coach.headingFont ?? null,
    bodyFont: coach.bodyFont ?? null,
    heroImageDark: coach.heroImageDark ?? null,
    landingTexts,
    eliteConfig: coach.eliteConfig as import("@/src/components/landing/elite-config").EliteLandingConfig | null ?? null,
  };

  return (
    <LandingThemeProvider
      themeId={themeId}
      headingFont={content.headingFont}
      bodyFont={content.bodyFont}
      extraFontIds={[
        (content.landingTexts as Record<string, string> | null)?.packagesTitleFont,
        (content.landingTexts as Record<string, string> | null)?.packagesCardFont,
      ]}
    >
      <LandingSectionStyles landingTexts={content.landingTexts as Record<string, string> | null} />
      <LandingRenderer themeId={themeId} content={content} />
      {themeId !== "theme-elite" && (
        <LandingFooter
          content={content}
          variant={themeId === "theme-3" || themeId === "theme-4" ? "light" : "dark"}
          contactPhone={content.contactPhone}
          businessAddress={content.businessAddress}
          availableLegalSlugs={content.legalSlugs}
        />
      )}
    </LandingThemeProvider>
  );
}
