export const LANDING_THEME_IDS = [
  "theme-1",
  "theme-2",
  "theme-3",
  "theme-4",
  "theme-5",
  "theme-6",
] as const;

export type LandingThemeId = (typeof LANDING_THEME_IDS)[number];
export type LegacyLandingTemplateId =
  | "classic-dark"
  | "modern-teal"
  | "fresh-light"
  | "clean-red"
  | "sport-dark"
  | "dynamic-scroll";

export type LandingThemeTokens = Record<`--${string}`, string>;

export interface LandingThemeDefinition {
  id: LandingThemeId;
  legacyTemplateId: LegacyLandingTemplateId;
  name: string;
  description: string;
  previewImage: string;
  layoutType: "split-hero" | "card-hero" | "art-light" | "minimal-diagonal" | "neon-split";
  tokens: LandingThemeTokens;
}

const LEGACY_TO_THEME_ID: Record<LegacyLandingTemplateId, LandingThemeId> = {
  "classic-dark": "theme-1",
  "modern-teal": "theme-2",
  "fresh-light": "theme-3",
  "clean-red": "theme-4",
  "sport-dark": "theme-5",
  "dynamic-scroll": "theme-6",
};

const THEME_TO_LEGACY_ID: Record<LandingThemeId, LegacyLandingTemplateId> = {
  "theme-1": "classic-dark",
  "theme-2": "modern-teal",
  "theme-3": "fresh-light",
  "theme-4": "clean-red",
  "theme-5": "sport-dark",
  "theme-6": "dynamic-scroll",
};

const SHARED_TOKENS = {
  "--landing-radius-lg": "24px",
  "--landing-radius-md": "14px",
} satisfies LandingThemeTokens;

export const LANDING_THEMES: Record<LandingThemeId, LandingThemeDefinition> = {
  "theme-1": {
    id: "theme-1",
    legacyTemplateId: "classic-dark",
    name: "Midnight Gold",
    description: "Koyu lüks tema, altın aksan, serif başlıklar.",
    previewImage: "/designs/landing/theme-1.png",
    layoutType: "split-hero",
    tokens: {
      "--bg": "#0B0B0C",
      "--text": "#F5F3EE",
      "--muted": "rgba(245,243,238,0.72)",
      "--gold1": "#C9A24D",
      "--gold2": "#E6C27A",
      "--gold3": "#A8822E",
    },
  },
  "theme-2": {
    id: "theme-2",
    legacyTemplateId: "modern-teal",
    name: "Ocean Breeze",
    description: "Koyu lacivert, teal aksan, glassmorphism kartlar.",
    previewImage: "/designs/landing/theme-2.png",
    layoutType: "card-hero",
    tokens: {
      "--bg": "#0B1628",
      "--text": "#e8f0f8",
      "--muted": "rgba(196,212,232,0.65)",
      "--teal": "#3E8791",
    },
  },
  "theme-3": {
    id: "theme-3",
    legacyTemplateId: "fresh-light",
    name: "Fresh Mint",
    description: "Açık modern tema, mint ve altın aksan, enerjik.",
    previewImage: "/designs/landing/theme-3.png",
    layoutType: "art-light",
    tokens: {
      ...SHARED_TOKENS,
      "--landing-bg": "#f5f6fb",
      "--landing-text": "#262a33",
      "--landing-accent": "#ffbe10",
      "--landing-accent-strong": "#1eb7b4",
    },
  },
  "theme-4": {
    id: "theme-4",
    legacyTemplateId: "clean-red",
    name: "Warm Earth",
    description: "Sıcak minimal tema, terracotta aksan, editorial stil.",
    previewImage: "/designs/landing/theme-4.png",
    layoutType: "minimal-diagonal",
    tokens: {
      ...SHARED_TOKENS,
      "--landing-bg": "#FAF8F5",
      "--landing-text": "#3E2F28",
      "--landing-accent": "#C75B39",
      "--landing-font-display": "Georgia, 'Times New Roman', serif",
    },
  },
  "theme-5": {
    id: "theme-5",
    legacyTemplateId: "sport-dark",
    name: "Electric Night",
    description: "Neon spor tema, cesur tipografi, gradient efektler.",
    previewImage: "/designs/landing/theme-5.png",
    layoutType: "neon-split",
    tokens: {
      ...SHARED_TOKENS,
      "--landing-bg": "#0a0d14",
      "--landing-text": "#f4f7ff",
      "--landing-accent": "#2ec8d8",
      "--landing-accent-strong": "#c4df44",
    },
  },
  "theme-6": {
    id: "theme-6",
    legacyTemplateId: "dynamic-scroll",
    name: "Dynamic Flow",
    description: "Sinematik sabit arka plan değiştirme, glide efektleri.",
    previewImage: "/designs/landing/theme-6.png",
    layoutType: "split-hero",
    tokens: {
      ...SHARED_TOKENS,
      "--landing-bg": "#000000",
      "--landing-text": "#ffffff",
      "--landing-accent": "#ffffff",
      "--landing-accent-strong": "#000000",
    },
  },
};

export const LANDING_THEME_LIST = LANDING_THEME_IDS.map((id) => LANDING_THEMES[id]);

export function isLandingThemeId(value: string): value is LandingThemeId {
  return LANDING_THEME_IDS.includes(value as LandingThemeId);
}

export function resolveLandingThemeId(value: string | null | undefined): LandingThemeId {
  if (!value) {
    return "theme-1";
  }

  if (isLandingThemeId(value)) {
    return value;
  }

  if (value in LEGACY_TO_THEME_ID) {
    return LEGACY_TO_THEME_ID[value as LegacyLandingTemplateId];
  }

  return "theme-1";
}

export function toLegacyLandingTemplateId(themeId: LandingThemeId): LegacyLandingTemplateId {
  return THEME_TO_LEGACY_ID[themeId];
}

export function getLandingTheme(themeId: string | null | undefined): LandingThemeDefinition {
  const resolvedId = resolveLandingThemeId(themeId);
  return LANDING_THEMES[resolvedId];
}
