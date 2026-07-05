// Yeni nesil Modüler Web Mimarı "Elite" altyapısı için konfigürasyon tipleri
export type EliteSectionCategory =
  | "navbar"
  | "hero"
  | "stats"
  | "features"
  | "howItWorks"
  | "transformations"
  | "testimonials"
  | "packages"
  | "faq"
  | "cta"
  | "about"
  | "footer";

export type AnimationType = "none" | "fade-in" | "slide-up" | "slide-right" | "zoom-in";

export type SectionSpacing = "compact" | "normal" | "comfortable" | "spacious";
export type SectionBgStyle = "default" | "tinted" | "gradient" | "image";

export interface EliteSectionConfig {
  id: string; // Her bölüme özel eşsiz bir id (sürükle bırak vb. işlemler için gerekebilir)
  category: EliteSectionCategory;
  enabled: boolean;
  blockId: string; // Örn: "hero-cinematic" veya "feature-image-bento"
  customColors?: {
    enabled: boolean;
    backgroundColor: string;
    textColor: string;
    primaryColor: string;
  };
  animationType?: AnimationType;
  /** Bu bölüm için üst+alt iç boşluk override (default: blok kendi padding'ini kullanır) */
  spacing?: SectionSpacing;
  /** Bu bölüm için arkaplan stili (gradient, image overlay vb.) */
  background?: {
    style: SectionBgStyle;
    /** gradient için: tinted/gradient stillerinde kullanılır */
    gradientFrom?: string;
    gradientTo?: string;
    gradientAngle?: number;
    /** image stilinde URL */
    imageUrl?: string;
    /** image üzerine overlay opacity (0-1) */
    overlayOpacity?: number;
  };
  /**
   * Bu bölüm için global landingTexts üzerine yazılacak alanlar.
   * Renderer effectiveContent.landingTexts = { ...landingTexts, ...overrides } olarak uygular.
   * Bütün kategoriler kendi schema field'larını yazabilir; bilinmeyen key'ler bloklar tarafından
   * sessizce ignore edilir, böylece ileride yeni alan eklemek geriye dönük uyumlu.
   */
  contentOverrides?: Record<string, string | undefined>;
}

export interface EliteGlobalStyles {
  primaryColor: string; // Örn: #ccff00
  backgroundColor: string; // Örn: #000000
  textColor: string;
  fontFamilyHeading: string;
  fontFamilyBody: string;
  borderRadius: "none" | "sm" | "md" | "lg" | "full";
}

export interface EliteLandingConfig {
  sections: EliteSectionConfig[];
  globalStyles?: EliteGlobalStyles;
}

// Yeni oluşturulacak bir sitenin varsayılan Elite Config'i
// blockId'ler manifest.ts'te kayıtlı olanlardan seçilmiştir.
export const DEFAULT_ELITE_CONFIG: EliteLandingConfig = {
  sections: [
    { id: "nav-1", category: "navbar", enabled: true, blockId: "navbar-gympro" },
    { id: "hero-1", category: "hero", enabled: true, blockId: "hero-cinematic" },
    { id: "about-1", category: "about", enabled: true, blockId: "about-fightness" },
    { id: "stats-1", category: "stats", enabled: true, blockId: "stats-gradient-bold" },
    { id: "how-1", category: "howItWorks", enabled: true, blockId: "how-numbered-list" },
    { id: "trans-1", category: "transformations", enabled: true, blockId: "transformations-cinematic-strip" },
    { id: "test-1", category: "testimonials", enabled: true, blockId: "testimonial-dual-marquee" },
    { id: "pack-1", category: "packages", enabled: true, blockId: "pricing-sportix" },
    { id: "faq-1", category: "faq", enabled: true, blockId: "faq-outpace" },
    { id: "cta-1", category: "cta", enabled: true, blockId: "cta-curtis" },
    { id: "foot-1", category: "footer", enabled: true, blockId: "footer-gymix" },
  ],
  globalStyles: {
    primaryColor: "#ccff00",
    backgroundColor: "#050505",
    textColor: "#ffffff",
    fontFamilyHeading: "Inter, sans-serif",
    fontFamilyBody: "Inter, sans-serif",
    borderRadius: "md",
  },
};
