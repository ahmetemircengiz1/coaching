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
  email: string;
  authUrl: string;
  whatsappUrl: string;
  packages: LandingPackage[];
  transformations: LandingTransformation[];
  studentCount: number;
  transformationCount: number;
  programCount: number;
  // Kademe 2: Gelişmiş Kişiselleştirme
  landingConfig?: import("./config").LandingConfig | null;
  socialLinks?: import("./config").SocialLinks | null;
  headingFont?: string | null;
  bodyFont?: string | null;
}

export interface LandingThemeComponentProps {
  themeId: LandingThemeId;
  content: LandingThemeContent;
}
