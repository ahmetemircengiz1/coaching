export const DASHBOARD_THEME_IDS = [1, 2, 3, 4, 5] as const;

export type DashboardThemeId = (typeof DASHBOARD_THEME_IDS)[number];

export type LegacyDashboardTemplateId =
  | "dark-teal"
  | "dark-gold"
  | "light-gold"
  | "dark-orange"
  | "light-modern";

export interface DashboardThemeDefinition {
  id: DashboardThemeId;
  legacyTemplateId: LegacyDashboardTemplateId;
  name: string;
  previewImage: string;
  layoutType:
  | "profile-dark-teal"
  | "management-gold"
  | "profile-light-gold"
  | "profile-dark-gold"
  | "profile-light-modern";
  sidebarBg: string;
  sidebarBorder: string;
  sidebarText: string;
  sidebarTextMuted: string;
  sidebarHover: string;
  sidebarActive: string;
  sidebarActiveText: string;
  headerBg: string;
  headerBorder: string;
  mainBg: string;
  mainText: string;
  mainTextMuted: string;
  cardBg: string;
  cardBorder: string;
  accent: string;
  accentText: string;
  mobileBg: string;
  chartPrimary: string;
  chartSecondary: string;
  mode: "dark" | "light";
  // New style properties for distinctiveness
  cardRadius: string;
  cardShadow: string;
  glassEffect: boolean;
  glassBg: string;
}

const LEGACY_TO_ID: Record<LegacyDashboardTemplateId, DashboardThemeId> = {
  "dark-teal": 1,
  "dark-gold": 2,
  "light-gold": 3,
  "dark-orange": 4,
  "light-modern": 5,
};

const ID_TO_LEGACY: Record<DashboardThemeId, LegacyDashboardTemplateId> = {
  1: "dark-teal",
  2: "dark-gold",
  3: "light-gold",
  4: "dark-orange",
  5: "light-modern",
};

export const DASHBOARD_THEMES: Record<DashboardThemeId, DashboardThemeDefinition> = {
  1: {
    id: 1,
    legacyTemplateId: "dark-teal",
    name: "Midnight",
    previewImage: "/designs/dashboard/theme-1.png",
    layoutType: "profile-dark-teal",
    // Sleek flat dark mode
    sidebarBg: "#0B0E14",
    sidebarBorder: "rgba(255, 255, 255, 0.05)",
    sidebarText: "rgba(255, 255, 255, 0.8)",
    sidebarTextMuted: "rgba(255, 255, 255, 0.5)",
    sidebarHover: "rgba(255, 255, 255, 0.05)",
    sidebarActive: "rgba(91, 168, 191, 0.15)",
    sidebarActiveText: "#ffffff",
    headerBg: "#0B0E14",
    headerBorder: "rgba(255, 255, 255, 0.05)",
    mainBg: "#06080A",
    mainText: "#ffffff",
    mainTextMuted: "rgba(255, 255, 255, 0.6)",
    cardBg: "#0E1219",
    cardBorder: "rgba(255, 255, 255, 0.05)",
    accent: "#5BA8BF",
    accentText: "#ffffff",
    mobileBg: "#06080A",
    chartPrimary: "#5BA8BF",
    chartSecondary: "#306778",
    mode: "dark",
    cardRadius: "0.5rem",
    cardShadow: "none",
    glassEffect: false,
    glassBg: "transparent",
  },
  2: {
    id: 2,
    legacyTemplateId: "dark-gold",
    name: "Ember",
    previewImage: "/designs/dashboard/theme-2.png",
    layoutType: "management-gold",
    // Luxury dark gold with glows
    sidebarBg: "#0A0A0A",
    sidebarBorder: "rgba(212, 175, 55, 0.15)",
    sidebarText: "rgba(255, 255, 255, 0.85)",
    sidebarTextMuted: "rgba(255, 255, 255, 0.55)",
    sidebarHover: "rgba(212, 175, 55, 0.1)",
    sidebarActive: "rgba(212, 175, 55, 0.2)",
    sidebarActiveText: "#D4AF37",
    headerBg: "#0A0A0A",
    headerBorder: "rgba(212, 175, 55, 0.15)",
    mainBg: "#050505",
    mainText: "#ffffff",
    mainTextMuted: "rgba(255, 255, 255, 0.65)",
    cardBg: "#0D0D0D",
    cardBorder: "rgba(212, 175, 55, 0.2)",
    accent: "#CBA05B",
    accentText: "#000000",
    mobileBg: "#050505",
    chartPrimary: "#CBA05B",
    chartSecondary: "#8A6D3B",
    mode: "dark",
    cardRadius: "1rem",
    cardShadow: "0 8px 32px rgba(203, 160, 91, 0.08)",
    glassEffect: false,
    glassBg: "transparent",
  },
  3: {
    id: 3,
    legacyTemplateId: "light-gold",
    name: "Daylight",
    previewImage: "/designs/dashboard/theme-3.png",
    layoutType: "profile-light-gold",
    // Airy light mode, round corners, soft shadows
    sidebarBg: "#ffffff",
    sidebarBorder: "rgba(0, 0, 0, 0.06)",
    sidebarText: "#333333",
    sidebarTextMuted: "rgba(0, 0, 0, 0.5)",
    sidebarHover: "rgba(241, 188, 69, 0.1)",
    sidebarActive: "rgba(241, 188, 69, 0.15)",
    sidebarActiveText: "#000000",
    headerBg: "#ffffff",
    headerBorder: "rgba(0, 0, 0, 0.06)",
    mainBg: "#FAFAFA",
    mainText: "#1A1A1A",
    mainTextMuted: "rgba(0, 0, 0, 0.6)",
    cardBg: "#ffffff",
    cardBorder: "rgba(0, 0, 0, 0.04)",
    accent: "#F1BC45",
    accentText: "#ffffff",
    mobileBg: "#FAFAFA",
    chartPrimary: "#F1BC45",
    chartSecondary: "#E59E21",
    mode: "light",
    cardRadius: "1.5rem",
    cardShadow: "0 4px 24px rgba(0, 0, 0, 0.04), 0 1px 3px rgba(0,0,0,0.02)",
    glassEffect: false,
    glassBg: "transparent",
  },
  4: {
    id: 4,
    legacyTemplateId: "dark-orange",
    name: "Terracotta",
    previewImage: "/designs/dashboard/theme-4.png",
    layoutType: "profile-dark-gold",
    // Earthy warm dark, solid shapes
    sidebarBg: "#231B18",
    sidebarBorder: "rgba(199, 91, 57, 0.15)",
    sidebarText: "rgba(255, 255, 255, 0.8)",
    sidebarTextMuted: "rgba(255, 255, 255, 0.5)",
    sidebarHover: "rgba(199, 91, 57, 0.15)",
    sidebarActive: "rgba(199, 91, 57, 0.25)",
    sidebarActiveText: "#ffffff",
    headerBg: "#231B18",
    headerBorder: "rgba(199, 91, 57, 0.15)",
    mainBg: "#171210",
    mainText: "#ffffff",
    mainTextMuted: "rgba(255, 255, 255, 0.65)",
    cardBg: "#2C221F",
    cardBorder: "rgba(199, 91, 57, 0.2)",
    accent: "#C75B39",
    accentText: "#ffffff",
    mobileBg: "#171210",
    chartPrimary: "#C75B39",
    chartSecondary: "#8A3D25",
    mode: "dark",
    cardRadius: "0.25rem",
    cardShadow: "none",
    glassEffect: false,
    glassBg: "transparent",
  },
  5: {
    id: 5,
    legacyTemplateId: "light-modern",
    name: "Arctic",
    previewImage: "/designs/dashboard/theme-5.png",
    layoutType: "profile-light-modern",
    // Glassmorphic light/frost style
    sidebarBg: "rgba(255, 255, 255, 0.7)",
    sidebarBorder: "rgba(105, 168, 234, 0.2)",
    sidebarText: "#1A202C",
    sidebarTextMuted: "rgba(26, 32, 44, 0.6)",
    sidebarHover: "rgba(105, 168, 234, 0.1)",
    sidebarActive: "rgba(105, 168, 234, 0.2)",
    sidebarActiveText: "#2B6CB0",
    headerBg: "rgba(255, 255, 255, 0.7)",
    headerBorder: "rgba(105, 168, 234, 0.2)",
    mainBg: "#EDF2F7",
    mainText: "#1A202C",
    mainTextMuted: "rgba(26, 32, 44, 0.65)",
    cardBg: "rgba(255, 255, 255, 0.65)",
    cardBorder: "rgba(105, 168, 234, 0.3)",
    accent: "#4299E1",
    accentText: "#ffffff",
    mobileBg: "#EDF2F7",
    chartPrimary: "#4299E1",
    chartSecondary: "#2B6CB0",
    mode: "light",
    cardRadius: "1rem",
    cardShadow: "0 8px 32px rgba(31, 38, 135, 0.05)",
    glassEffect: true,
    glassBg: "rgba(255, 255, 255, 0.65)",
  },
};

export const DASHBOARD_THEME_LIST = DASHBOARD_THEME_IDS.map(
  (id) => DASHBOARD_THEMES[id]
);

export function isDashboardThemeId(value: number): value is DashboardThemeId {
  return DASHBOARD_THEME_IDS.includes(value as DashboardThemeId);
}

export function resolveDashboardThemeId(
  value: number | string | null | undefined
): DashboardThemeId {
  if (typeof value === "number" && isDashboardThemeId(value)) {
    return value;
  }

  if (typeof value === "string") {
    const asNumber = Number(value);
    if (!Number.isNaN(asNumber) && isDashboardThemeId(asNumber)) {
      return asNumber;
    }

    if (value in LEGACY_TO_ID) {
      return LEGACY_TO_ID[value as LegacyDashboardTemplateId];
    }
  }

  return 1;
}

export function toLegacyDashboardTemplateId(
  themeId: DashboardThemeId
): LegacyDashboardTemplateId {
  return ID_TO_LEGACY[themeId];
}

export function getDashboardTheme(
  value: number | string | null | undefined
): DashboardThemeDefinition {
  const resolvedId = resolveDashboardThemeId(value);
  return DASHBOARD_THEMES[resolvedId];
}
