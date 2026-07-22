import type { LandingThemeId } from "@/src/theme/landingThemes";

export interface LandingPackage {
  id: string;
  name: string;
  description: string;
  duration: number;
  price: number;
  currency: string;
  features: string[];
}

export interface LandingTransformation {
  id: string;
  clientName: string;
  beforePhoto: string;
  afterPhoto: string;
  duration: string | null;
  description: string | null;
  // Faz 2: Dönüşüm blokları için opsiyonel ölçüm bilgileri
  age?: string | null;
  role?: string | null;
  weightBefore?: string | null;
  weightAfter?: string | null;
  bodyFatBefore?: string | null;
  bodyFatAfter?: string | null;
  // Faz 2.5: Koçun istediği özel istatistikler (Squat 1RM, Yürüyüş hızı vb.)
  customStats?: { label: string; value: string }[] | null;
}

export interface LandingTestimonial {
  id: string;
  clientName: string;
  role: string | null;
  quote: string;
  rating: number | null;
  avatar: string | null;
}

export interface FaqItem {
  id: string;
  question: string;
  answer: string;
}

export type TextEffect = "none" | "neon" | "glow" | "shadow" | "outline";
export type TextAlign = "left" | "center" | "right";

export interface LandingTexts {
  // Hero
  heroHeadline?: string;
  heroSubtitle?: string;
  ctaPrimaryText?: string;
  ctaSecondaryText?: string;
  // Hero styling
  heroTextColor?: string;
  heroSubtitleColor?: string;
  heroTextEffect?: TextEffect;
  heroTextAlign?: TextAlign;
  // Hero Advanced Positioning (PowerPoint style)
  heroTextPositionMode?: "flex" | "absolute";
  heroTextPosX?: number;
  heroTextPosY?: number;
  heroTextScale?: number;
  heroSubtitleScale?: number;
  heroHeadlineBgColor?: string;
  heroSubtitleBgColor?: string;
  heroTextWeight?: string;
  /** Hero CTA hedefleri — "auth" | "packages" | "about" | "contact" (boş = blok varsayılanı) */
  ctaPrimaryTarget?: string;
  ctaSecondaryTarget?: string;
  /** Hero güven rozeti (Sinema İtalik / Big Display) — değer + etiket, "1" = gizli */
  heroTrustValue?: string;
  heroTrustLabel?: string;
  heroRatingValue?: string;
  heroTrustHidden?: string;
  // Stats
  stat1Label?: string;
  stat2Label?: string;
  stat3Label?: string;
  stat1Value?: string;
  stat2Value?: string;
  stat3Value?: string;
  // Transformations
  transformationsTitle?: string;
  // Testimonials
  testimonialsTitle?: string;
  // System (How it works)
  systemTitle?: string;
  systemSubtitle?: string;
  system1Title?: string;
  system1Description?: string;
  system2Title?: string;
  system2Description?: string;
  system3Title?: string;
  system3Description?: string;
  // Packages
  packagesTitle?: string;
  packagesSubtitle?: string;
  packagesTitleFont?: string;
  packagesCardFont?: string;
  // FAQ
  faqTitle?: string;
  /** FAQ bölümü için opsiyonel görsel — bazı FAQ tasarımları yanında foto gösterir */
  faqImage?: string;
  // CTA (final çağrı bölümü)
  ctaHeadline?: string;
  ctaSubtitle?: string;
  ctaEyebrow?: string;
  /** CTA bölümü için opsiyonel arkaplan görseli — yüklenmezse gradyan default */
  ctaImage?: string;
  // Footer
  footerTagline?: string;
  /** Footer üst bölümündeki büyük başlık (bazı footer tasarımları gösterir) */
  footerHeadline?: string;
  /** Çalışma saatleri — satır satır girilir (Peak footer tasarımı gösterir) */
  footerBusinessHours?: string;
  // About / Hakkımda
  aboutTitle?: string;
  aboutTitleAccent?: string;
  aboutBio1?: string;
  aboutBio2?: string;
  aboutRole?: string;
  /** "Hakkımda" üst etiketi (Curtis/Gymix/Fitence/Progrex tasarımları gösterir) */
  aboutEyebrow?: string;
  /** Ana koç fotoğrafı (tüm Hakkımda tasarımları kullanır) */
  aboutImage?: string;
  /** İkincil görsel — Curtis lokasyon kartı / Gymix & Fitence ikinci portre */
  aboutImage2?: string;
  /** Hakkımda istatistikleri (3 adet) — Fightness/Progrex/Fitence/Gymix bunları gösterir */
  aboutStat1Value?: string;
  aboutStat1Label?: string;
  aboutStat2Value?: string;
  aboutStat2Label?: string;
  aboutStat3Value?: string;
  aboutStat3Label?: string;
  /** Curtis Hakkımda rozet kartları (sertifika, ünvan vb.) */
  aboutBadge1Title?: string;
  aboutBadge1Subtitle?: string;
  aboutBadge2Title?: string;
  aboutBadge2Subtitle?: string;
  /** "1" ise Hakkımda istatistikleri hiç gösterilmez */
  aboutStatsHidden?: string;
  /** Gymix/Fitence sosyal kanıt satırı — metin + "1" = satır gizli */
  aboutReviewText?: string;
  aboutRatingHidden?: string;
}

export function getTextEffectStyle(effect?: TextEffect, color?: string): React.CSSProperties {
  const c = color || "#ffffff";
  switch (effect) {
    case "neon":
      return { textShadow: `0 0 7px ${c}, 0 0 20px ${c}, 0 0 42px ${c}, 0 0 80px ${c}` };
    case "glow":
      return { textShadow: `0 0 20px rgba(255,255,255,0.6), 0 0 40px rgba(255,255,255,0.3), 0 0 80px rgba(255,255,255,0.15)` };
    case "shadow":
      return { textShadow: `0 4px 30px rgba(0,0,0,0.8), 0 0 60px rgba(0,0,0,0.5)` };
    case "outline":
      return { WebkitTextStroke: `1px ${c}`, color: "transparent" };
    default:
      return { textShadow: `0 2px 20px rgba(0,0,0,0.7)` };
  }
}

export interface LandingThemeContent {
  domain: string;
  brandName: string;
  bio: string | null;
  logo: string | null;
  heroImage: string | null;
  heroImageOriginalUrl?: string | null;
  heroImageDesktopUrl?: string | null;
  heroImageMobileUrl?: string | null;
  heroImageBlurDataUrl?: string | null;
  heroImageCutoutUrl?: string | null;
  heroFocalY?: number | null;
  heroFocalX?: number | null;
  heroMode?: "photo" | "logo" | null;
  heroImageDark?: boolean | null;
  // Faz 2: Yeni hero blokları için opsiyonel video desteği.
  // null ise blok foto'ya, foto yoksa default fallback'e düşer.
  heroVideoUrl?: string | null;
  email: string;
  authUrl: string;
  whatsappUrl: string;
  whatsappNumber?: string | null;
  packages: LandingPackage[];
  transformations: LandingTransformation[];
  testimonials: LandingTestimonial[];
  studentCount: number;
  transformationCount: number;
  programCount: number;
  // Section Builder block kontratı: bu alanları her blok güvenli şekilde okuyabilir.
  // Server-side page.tsx içinde brandName/bio/socialLinks vb. değerlerden türetilirler.
  title?: string;
  tagline?: string;
  instagramUrl?: string;
  facebookUrl?: string;
  tiktokUrl?: string;
  youtubeUrl?: string;
  linkedinUrl?: string;
  twitterUrl?: string;
  faqs?: FaqItem[] | null;
  // İletişim & Yasal (Footer için)
  contactPhone?: string | null;
  businessAddress?: string | null;
  legalSlugs?: string[];
  // Kademe 2: Gelişmiş Kişiselleştirme
  landingConfig?: import("./config").LandingConfig | null;
  socialLinks?: import("./config").SocialLinks | null;
  headingFont?: string | null;
  bodyFont?: string | null;
  landingTexts?: LandingTexts | null;
  // Kademe 3: Sınırsız Özelleştirme (Elite / Ecosystem Paketi)
  eliteConfig?: import("./elite-config").EliteLandingConfig | null;
}

export interface LandingThemeComponentProps {
  themeId: LandingThemeId;
  content: LandingThemeContent;
}
