import { type DashboardThemeId } from "@/src/theme/dashboardThemes";
import {
  LANDING_THEME_IDS,
  type LandingThemeId,
  type LegacyLandingTemplateId,
} from "@/src/theme/landingThemes";

export type PlanId = "STARTER" | "PRO" | "ELITE";
export type PlanSlug = "starter" | "pro" | "elite";

export type PlanLike =
  | PlanId
  | PlanSlug
  | number
  | string
  | null
  | undefined
  | {
    tier?: number | null;
    name?: string | null;
    plan?: string | null;
  };

const THEME_ACCESS: Record<PlanId, number[]> = {
  STARTER: [1, 6],
  PRO: [1, 2, 3, 6],
  ELITE: [1, 2, 3, 4, 5, 6],
};

function normalizePlanName(value: string): string {
  return value
    .trim()
    .toLowerCase()
    .replace(/[^\p{L}\p{N}]+/gu, "");
}

function planFromTier(tier: number): PlanId {
  if (tier >= 3) {
    return "ELITE";
  }

  if (tier === 2) {
    return "PRO";
  }

  return "STARTER";
}

export function resolvePlanId(plan: PlanLike): PlanId {
  if (typeof plan === "number" && Number.isFinite(plan)) {
    return planFromTier(plan);
  }

  if (typeof plan === "string") {
    const normalized = normalizePlanName(plan);
    if (normalized === "elite" || normalized === "premium") {
      return "ELITE";
    }

    if (normalized === "pro" || normalized === "profesyonel") {
      return "PRO";
    }

    if (normalized === "starter" || normalized === "baslangic") {
      return "STARTER";
    }

    const asNumber = Number(plan);
    if (!Number.isNaN(asNumber)) {
      return planFromTier(asNumber);
    }
  }

  if (plan && typeof plan === "object") {
    if (typeof plan.tier === "number") {
      return planFromTier(plan.tier);
    }

    if (typeof plan.plan === "string") {
      return resolvePlanId(plan.plan);
    }

    if (typeof plan.name === "string") {
      return resolvePlanId(plan.name);
    }
  }

  return "STARTER";
}

export function toPlanSlug(plan: PlanLike): PlanSlug {
  const planId = resolvePlanId(plan);
  if (planId === "ELITE") {
    return "elite";
  }

  if (planId === "PRO") {
    return "pro";
  }

  return "starter";
}

export function allowedThemeIds(plan: PlanLike): number[] {
  return [...THEME_ACCESS[resolvePlanId(plan)]];
}

export function validateThemeSelection(plan: PlanLike, themeId: number): boolean {
  return allowedThemeIds(plan).includes(themeId);
}

function toLandingThemeId(themeId: number): LandingThemeId {
  const safeThemeId = Math.max(1, Math.min(6, themeId));
  return `theme-${safeThemeId}` as LandingThemeId;
}

export function toLandingThemeNumber(
  themeId: LandingThemeId | LegacyLandingTemplateId | string | null | undefined
): number {
  if (!themeId) {
    return 1;
  }

  if (themeId.startsWith("theme-")) {
    const parsed = Number(themeId.replace("theme-", ""));
    return Number.isNaN(parsed) ? 1 : Math.max(1, Math.min(6, parsed));
  }

  switch (themeId) {
    case "modern-teal":
      return 2;
    case "fresh-light":
      return 3;
    case "clean-red":
      return 4;
    case "sport-dark":
      return 5;
    case "dynamic-scroll":
      return 6;
    case "classic-dark":
    default:
      return 1;
  }
}

export function allowedLandingThemes(plan: PlanLike): LandingThemeId[] {
  return allowedThemeIds(plan).map((themeId) => toLandingThemeId(themeId));
}

export function isLandingThemeAllowed(
  plan: PlanLike,
  themeId: LandingThemeId
): boolean {
  return allowedLandingThemes(plan).includes(themeId);
}

export function allowedDashboardThemes(plan: PlanLike): DashboardThemeId[] {
  return allowedThemeIds(plan) as DashboardThemeId[];
}

export function isDashboardThemeAllowed(
  plan: PlanLike,
  dashboardThemeId: DashboardThemeId
): boolean {
  return allowedDashboardThemes(plan).includes(dashboardThemeId);
}

export function isKnownLandingThemeId(value: string): value is LandingThemeId {
  return LANDING_THEME_IDS.includes(value as LandingThemeId);
}

// --- Kademe 2: Landing page kisisellestirme feature flags ---

export interface LandingFeatures {
  canReorderSections: boolean;
  canToggleSections: boolean;
  maxVariant: number; // 1, 2, or 3
  canSelectFonts: boolean;
  maxSocialLinks: number; // 3 or 6
  canEnableFAQ: boolean;
}

const LANDING_FEATURES: Record<PlanId, LandingFeatures> = {
  STARTER: {
    canReorderSections: false,
    canToggleSections: false,
    maxVariant: 1,
    canSelectFonts: false,
    maxSocialLinks: 3,
    canEnableFAQ: false,
  },
  PRO: {
    canReorderSections: true,
    canToggleSections: true,
    maxVariant: 2,
    canSelectFonts: true,
    maxSocialLinks: 6,
    canEnableFAQ: true,
  },
  ELITE: {
    canReorderSections: true,
    canToggleSections: true,
    maxVariant: 3,
    canSelectFonts: true,
    maxSocialLinks: 6,
    canEnableFAQ: true,
  },
};

export function getLandingFeatures(plan: PlanLike): LandingFeatures {
  return LANDING_FEATURES[resolvePlanId(plan)];
}
