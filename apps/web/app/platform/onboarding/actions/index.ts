"use server";

import { createClient } from "@/lib/supabase/server";
import prisma from "@coach-os/database";
import {
  resolvePlanId,
  toLandingThemeNumber,
  toPlanSlug,
  validateThemeSelection,
} from "@/src/lib/plan";
import {
  resolveLandingThemeId,
  toLegacyLandingTemplateId,
} from "@/src/theme/landingThemes";
import {
  resolveDashboardThemeId,
  toLegacyDashboardTemplateId,
} from "@/src/theme/dashboardThemes";

export async function checkSubdomain(subdomain: string) {
  const reserved = [
    "www",
    "app",
    "api",
    "admin",
    "dashboard",
    "mail",
    "ftp",
    "blog",
    "help",
    "support",
    "status",
    "demo",
  ];

  if (reserved.includes(subdomain.toLowerCase())) {
    return { available: false, error: "Bu subdomain kullanilamaz" };
  }

  const existing = await prisma.coach.findUnique({
    where: { subdomain },
  });

  return { available: !existing };
}

export async function createCoachSite(data: {
  brandName: string;
  subdomain: string;
  templateId?: string;
  themeId?: string;
  landingThemeId?: number;
  dashboardThemeId?: number;
  tier: number;
  logoUrl?: string;
}) {
  const supabase = await createClient();
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (!user || userError) {
    return { error: "Giris yapmaniz gerekiyor" };
  }

  const subdomainCheck = await checkSubdomain(data.subdomain);
  if (!subdomainCheck.available) {
    return { error: "Bu subdomain zaten kullaniliyor" };
  }

  const existingCoach = await prisma.coach.findFirst({
    where: {
      OR: [{ userId: user.id }, { email: user.email! }],
    },
  });

  if (existingCoach) {
    return { error: "Zaten bir siteniz var", subdomain: existingCoach.subdomain };
  }

  const saasPackage = await prisma.saasPackage.findFirst({
    where: { tier: data.tier },
  });

  if (!saasPackage) {
    return { error: "Sistem hatasi: Paket bulunamadi" };
  }

  if (
    typeof data.landingThemeId !== "number" ||
    typeof data.dashboardThemeId !== "number"
  ) {
    return {
      error: "Landing ve dashboard temasi secimi zorunludur.",
    };
  }

  const planId = resolvePlanId(data.tier);
  const selectedLandingThemeNumber = toLandingThemeNumber(
    `theme-${data.landingThemeId}`
  );
  const selectedDashboardThemeNumber = resolveDashboardThemeId(
    data.dashboardThemeId
  );

  if (!validateThemeSelection(planId, selectedLandingThemeNumber)) {
    return { error: "Sectiginiz landing temasi paketinize dahil degil." };
  }

  if (!validateThemeSelection(planId, selectedDashboardThemeNumber)) {
    return { error: "Sectiginiz dashboard temasi paketinize dahil degil." };
  }

  const selectedLandingThemeId = resolveLandingThemeId(
    `theme-${selectedLandingThemeNumber}`
  );

  const coach = await prisma.coach.create({
    data: {
      userId: user.id,
      email: user.email!,
      name: user.user_metadata?.name || data.brandName,
      brandName: data.brandName,
      subdomain: data.subdomain,
      plan: toPlanSlug(planId),
      landingThemeId: selectedLandingThemeNumber,
      dashboardThemeId: selectedDashboardThemeNumber,
      templateId: toLegacyLandingTemplateId(selectedLandingThemeId),
      dashboardTemplateId: toLegacyDashboardTemplateId(
        selectedDashboardThemeNumber
      ),
      logo: data.logoUrl || null,
      packageId: saasPackage.id,
      subscriptionStatus: "active",
    },
  });

  return { success: true, subdomain: coach.subdomain };
}
