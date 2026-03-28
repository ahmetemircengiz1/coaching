// Kademe 2: Landing Page Kişiselleştirme Konfigürasyonu

export type SectionId =
  | "hero"
  | "stats"
  | "transformations"
  | "packages"
  | "faq"
  | "contact";

export interface SectionConfig {
  id: SectionId;
  enabled: boolean;
  variant: number; // 1, 2, veya 3
}

export interface LandingConfig {
  sections: SectionConfig[];
}

export interface SocialLinks {
  instagram?: string;
  youtube?: string;
  tiktok?: string;
  twitter?: string;
  facebook?: string;
  linkedin?: string;
}

// Bölüm etiketleri (UI için)
export const SECTION_LABELS: Record<SectionId, string> = {
  hero: "Hero",
  stats: "İstatistikler",
  transformations: "Dönüşümler",
  packages: "Paketler",
  faq: "SSS",
  contact: "İletişim",
};

// Kapatılamayan bölümler
export const ALWAYS_ENABLED_SECTIONS: SectionId[] = ["hero", "packages"];

// Varsayılan bölüm sırası (landingConfig null ise kullanılır)
export const DEFAULT_SECTIONS: SectionConfig[] = [
  { id: "hero", enabled: true, variant: 1 },
  { id: "stats", enabled: true, variant: 1 },
  { id: "transformations", enabled: true, variant: 1 },
  { id: "packages", enabled: true, variant: 1 },
  { id: "faq", enabled: false, variant: 1 },
  { id: "contact", enabled: true, variant: 1 },
];

export const DEFAULT_LANDING_CONFIG: LandingConfig = {
  sections: DEFAULT_SECTIONS,
};

// Her bölüm için mevcut varyant sayısı
export const SECTION_VARIANT_COUNT: Record<SectionId, number> = {
  hero: 3,
  stats: 3,
  transformations: 3,
  packages: 3,
  faq: 2,
  contact: 3,
};

// Varyant etiketleri
export const VARIANT_LABELS: Record<SectionId, string[]> = {
  hero: ["Tema Varsayılan", "Ortalamalı Overlay", "Split Layout"],
  stats: ["Kartlar", "Tek Satır", "Minimal"],
  transformations: ["Carousel", "Grid", "Yatay Kaydırma"],
  packages: ["Kart Grid", "Karşılaştırma", "Liste"],
  faq: ["Accordion", "İki Sütun"],
  contact: ["Basit", "İletişim Formu", "CTA Banner"],
};

/**
 * landingConfig JSON'ını doğrula ve eksik bölümleri varsayılanla doldur
 */
export function resolveLandingConfig(raw: unknown): LandingConfig {
  if (!raw || typeof raw !== "object") {
    return DEFAULT_LANDING_CONFIG;
  }

  const config = raw as Record<string, unknown>;
  if (!Array.isArray(config.sections)) {
    return DEFAULT_LANDING_CONFIG;
  }

  const sections = config.sections as SectionConfig[];
  const sectionIds = new Set(sections.map((s) => s.id));

  // Eksik bölümleri ekle
  const merged = [...sections];
  for (const def of DEFAULT_SECTIONS) {
    if (!sectionIds.has(def.id)) {
      merged.push(def);
    }
  }

  // Geçersiz bölümleri filtrele
  const validIds = new Set<string>(DEFAULT_SECTIONS.map((s) => s.id));
  const filtered = merged.filter((s) => validIds.has(s.id));

  // Kapatılamayan bölümleri zorla aç
  for (const s of filtered) {
    if (ALWAYS_ENABLED_SECTIONS.includes(s.id)) {
      s.enabled = true;
    }
    // Varyant sınırla
    const maxVariant = SECTION_VARIANT_COUNT[s.id] || 1;
    if (s.variant < 1 || s.variant > maxVariant) {
      s.variant = 1;
    }
  }

  return { sections: filtered };
}

/**
 * socialLinks JSON'ını doğrula
 */
export function resolveSocialLinks(raw: unknown): SocialLinks | null {
  if (!raw || typeof raw !== "object") return null;
  const links = raw as Record<string, unknown>;
  const result: SocialLinks = {};
  const validKeys = ["instagram", "youtube", "tiktok", "twitter", "facebook", "linkedin"];

  for (const key of validKeys) {
    if (typeof links[key] === "string" && (links[key] as string).trim()) {
      (result as Record<string, string>)[key] = (links[key] as string).trim();
    }
  }

  return Object.keys(result).length > 0 ? result : null;
}
