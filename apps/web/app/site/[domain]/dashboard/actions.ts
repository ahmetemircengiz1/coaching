"use server";

import { getAuthUser } from "@/lib/supabase/server";
import prisma, { Prisma } from "@coach-os/database";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { cache } from "react";
import { revalidateCoachCache } from "@/lib/coach-cache";
import {
  allowedThemeIds,
  resolvePlanId,
  toPlanSlug,
  validateThemeSelection,
  getLandingFeatures,
} from "@/src/lib/plan";
import { updateCoachSettingsSchema, updatePaymentSettingsSchema } from "@/lib/validation/schemas";
import {
  resolveLandingThemeId,
  toLegacyLandingTemplateId,
} from "@/src/theme/landingThemes";
import {
  resolveDashboardThemeId,
  toLegacyDashboardTemplateId,
} from "@/src/theme/dashboardThemes";

// Lightweight auth check - cached per request (same domain = same result)
const _getCoachAuth = cache(async (domain: string) => {
  const user = await getAuthUser();

  if (!user) {
    redirect(`/site/${domain}/auth`);
  }

  const coach = await prisma.coach.findUnique({
    where: { subdomain: domain },
    include: { package: true },
  });

  if (!coach) {
    redirect("/");
  }

  if (coach.userId !== user.id) {
    redirect(`/site/${domain}/auth`);
  }

  return coach;
});

export async function getCoachAuth(domain: string) {
  return _getCoachAuth(domain);
}

// Coach bilgilerini al ve yetki kontrolü yap (full data - only for dashboard home)
export async function getCoachDashboardData(domain: string) {
  const user = await getAuthUser();

  if (!user) {
    redirect(`/site/${domain}/auth`);
  }

  const coach = await prisma.coach.findUnique({
    where: { subdomain: domain },
    include: {
      package: { select: { maxStudents: true, name: true, tier: true } },
      students: {
        include: {
          checkIns: {
            orderBy: { date: "desc" },
            take: 1,
          },
          coachPackage: { select: { name: true } },
        },
      },
      _count: { select: { programs: true } },
      coachPackages: {
        where: { isActive: true },
        orderBy: { orderIndex: "asc" },
      },
    },
  });

  if (!coach) {
    redirect("/");
  }

  // Coach'un userId'si ile giriş yapan user eşleşiyor mu?
  if (coach.userId !== user.id) {
    redirect(`/site/${domain}/auth`);
  }

  return coach;
}

// Dashboard istatistikleri
export async function getDashboardStats(domain: string) {
  const coach = await getCoachDashboardData(domain);

  const activeStudents = coach.students.filter(
    (s) => s.status === "active"
  ).length;

  // Bu haftanın check-in'leri
  const weekStart = new Date();
  weekStart.setDate(weekStart.getDate() - weekStart.getDay());
  weekStart.setHours(0, 0, 0, 0);

  const [weeklyCheckIns, newCheckIns] = await Promise.all([
    prisma.weeklyCheckIn.count({
      where: {
        student: { coachId: coach.id },
        date: { gte: weekStart },
      },
    }),
    prisma.weeklyCheckIn.findMany({
      where: {
        student: { coachId: coach.id },
        coachViewedAt: null,
      },
      orderBy: { date: "desc" },
      take: 10,
      include: {
        student: {
          select: { name: true, id: true },
        },
      },
    }),
  ]);

  return {
    coach,
    stats: {
      activeStudents,
      maxStudents: coach.package.maxStudents,
      weeklyCheckIns,
    },
    newCheckIns: newCheckIns.map((c) => ({
      id: c.id,
      studentName: c.student.name,
      studentId: c.student.id,
      weekNumber: c.weekNumber,
      date: c.date.toISOString(),
      weight: c.weight ? Number(c.weight) : null,
    })),
    dashboardNote: coach.dashboardNote ?? "",
  };
}

// Ana sayfa yapışkan not kaydı
export async function updateDashboardNote(domain: string, note: string) {
  const coach = await getCoachAuth(domain);

  const trimmed = note.length > 5000 ? note.slice(0, 5000) : note;

  await prisma.coach.update({
    where: { id: coach.id },
    data: { dashboardNote: trimmed },
  });

  revalidatePath(`/site/${domain}/dashboard`);
  return { success: true as const };
}

// Öğrenci listesi
export async function getStudentsList(domain: string) {
  const coach = await getCoachAuth(domain);

  const [students, coachPackages] = await Promise.all([
    prisma.student.findMany({
      where: { coachId: coach.id },
      include: {
        coachPackage: { select: { name: true } },
        checkIns: {
          orderBy: { date: "desc" },
          take: 1,
          select: { compliance: true, date: true },
        },
        trainingPlans: {
          where: { status: "active" },
          take: 1,
          orderBy: { createdAt: "desc" },
          select: { program: { select: { name: true } } },
        },
      },
      orderBy: { createdAt: "desc" },
    }),
    prisma.coachPackage.findMany({
      where: { coachId: coach.id, isActive: true },
      orderBy: { orderIndex: "asc" },
      select: { id: true, name: true },
    }),
  ]);

  return {
    coach: { ...coach, coachPackages },
    students: students.map((s) => ({
      id: s.id,
      name: s.name,
      email: s.email,
      phone: s.phone,
      status: s.status,
      packageName: s.coachPackage?.name || "Paket atanmamış",
      compliance: s.checkIns[0]?.compliance || 0,
      lastCheckIn: s.checkIns[0]?.date.toISOString() || null,
      startDate: s.startDate.toISOString(),
      currentProgram: s.trainingPlans[0]?.program?.name || null,
      endDate: s.endDate?.toISOString() || null,
    })),
  };
}

// Program listesi
export async function getProgramsList(domain: string) {
  const coach = await getCoachAuth(domain);

  const programs = await prisma.program.findMany({
    where: { coachId: coach.id },
    include: {
      _count: {
        select: { trainingPlans: true },
      },
      // #9: Kart üzerinde ilk 5 atanan öğrencinin önizlemesi
      trainingPlans: {
        where: { status: "active" },
        select: { student: { select: { id: true, name: true } } },
        take: 5,
        orderBy: { createdAt: "desc" },
      },
    },
    orderBy: { createdAt: "desc" },
  });

  return {
    coach,
    programs: programs.map((p) => ({
      id: p.id,
      name: p.name,
      description: p.description || "",
      weeks: p.weeks,
      assignedStudents: p._count.trainingPlans,
      assignedStudentsPreview: p.trainingPlans.map((tp) => ({
        id: tp.student.id,
        name: tp.student.name,
      })),
    })),
  };
}

// Coach ayarları getir
export async function getCoachSettings(domain: string) {
  // Bypass cache — fresh query for settings
  const user = await getAuthUser();
  if (!user) redirect(`/site/${domain}/auth`);
  const coach = await prisma.coach.findUnique({
    where: { subdomain: domain },
    include: { package: true },
  });
  if (!coach || coach.userId !== user.id) redirect(`/site/${domain}/auth`);
  const planId = resolvePlanId(coach.plan || coach.package.tier);
  const landingThemeNumber =
    coach.landingThemeId ||
    Number(resolveLandingThemeId(coach.templateId).replace("theme-", ""));
  const dashboardThemeNumber = coach.dashboardThemeId
    ? resolveDashboardThemeId(coach.dashboardThemeId)
    : resolveDashboardThemeId(coach.dashboardTemplateId);
  const availableThemeSelection = allowedThemeIds(planId);

  return {
    id: coach.id,
    email: coach.email,
    brandName: coach.brandName,
    bio: coach.bio || "",
    primaryColor: coach.primaryColor,
    secondaryColor: coach.secondaryColor,
    heroImageOriginalUrl: coach.heroImageOriginalUrl || "",
    heroImageDesktopUrl: coach.heroImageDesktopUrl || "",
    heroImageMobileUrl: coach.heroImageMobileUrl || "",
    heroImageBlurDataUrl: coach.heroImageBlurDataUrl || "",
    heroImageCutoutUrl: coach.heroImageCutoutUrl || "",
    heroFocalX: coach.heroFocalX ?? 50,
    heroFocalY: coach.heroFocalY ?? 35,
    heroMode: coach.heroMode === "logo" ? "logo" : "photo",
    heroVideoUrl: coach.heroVideoUrl ?? null,
    templateId: resolveLandingThemeId(`theme-${landingThemeNumber}`),
    landingThemeId: landingThemeNumber,
    dashboardThemeId: dashboardThemeNumber,
    dashboardTemplateId: toLegacyDashboardTemplateId(dashboardThemeNumber),
    logo: coach.logo,
    subdomain: coach.subdomain,
    customDomain: coach.customDomain,
    sidebarPosition: coach.sidebarPosition || "left",
    iyzicoApiKey: coach.iyzicoApiKey ? "••••••••" : "",
    iyzicoSecretKey: coach.iyzicoSecretKey ? "••••••••" : "",
    stripeAccountId: coach.stripeAccountId || "",
    packageName: coach.package.name,
    packageTier: coach.package.tier,
    planId,
    plan: toPlanSlug(planId),
    maxStudents: coach.package.maxStudents,
    availableThemeIds: availableThemeSelection,
    availableLandingThemes: availableThemeSelection.map((themeId) => `theme-${themeId}`),
    availableDashboardThemes: availableThemeSelection,
    availableLandingTemplates: availableThemeSelection.map((themeId) => `theme-${themeId}`),
    availableDashboardTemplates: availableThemeSelection,
    // Kademe 2: Gelişmiş kişiselleştirme
    landingConfig: coach.landingConfig ?? null,
    eliteConfig: coach.eliteConfig ?? null,
    socialLinks: coach.socialLinks ?? null,
    headingFont: coach.headingFont ?? null,
    bodyFont: coach.bodyFont ?? null,
    heroImageDark: coach.heroImageDark ?? null,
    landingTexts: coach.landingTexts ?? null,
    landingFaqs:
      ((coach as unknown as {
        landingFaqs?: Array<{ id: string; question: string; answer: string }> | null;
      }).landingFaqs) ?? null,
    aboutText: coach.aboutText ?? null,
    whatsappNumber: coach.whatsappNumber ?? null,
    contactPhone: (coach as unknown as { contactPhone?: string | null }).contactPhone ?? null,
    businessAddress: (coach as unknown as { businessAddress?: string | null }).businessAddress ?? null,
    legalFullName: (coach as unknown as { legalFullName?: string | null }).legalFullName ?? null,
    taxId: (coach as unknown as { taxId?: string | null }).taxId ?? null,
    legalTexts: ((coach as unknown as { legalTexts?: Record<string, string> | null }).legalTexts) ?? null,
    landingFeatures: getLandingFeatures(planId),
    // Aşama 2: Site modu (TEMPLATE = 6 hazır şablon, BUILDER = Section Builder)
    siteMode: ((coach as unknown as { siteMode?: "TEMPLATE" | "BUILDER" }).siteMode) ?? "TEMPLATE",
  };
}

// Coach ayarları güncelle
export async function updateCoachSettings(
  domain: string,
  data: {
    brandName?: string;
    bio?: string;
    primaryColor?: string;
    secondaryColor?: string;
    heroImageOriginalUrl?: string | null;
    heroImageDesktopUrl?: string | null;
    heroImageMobileUrl?: string | null;
    heroImageBlurDataUrl?: string | null;
    heroImageCutoutUrl?: string | null;
    heroFocalX?: number;
    heroFocalY?: number;
    heroMode?: "photo" | "logo";
    heroVideoUrl?: string | null;
    themeId?: string;
    templateId?: string;
    landingThemeId?: number;
    dashboardThemeId?: number;
    dashboardTemplateId?: string;
    sidebarPosition?: string;
    // Kademe 2
    landingConfig?: Record<string, unknown> | null;
    eliteConfig?: Record<string, unknown> | null;
    socialLinks?: Record<string, unknown> | null;
    headingFont?: string | null;
    bodyFont?: string | null;
    heroImageDark?: boolean | null;
    landingTexts?: Record<string, unknown> | null;
    landingFaqs?: Array<{ id: string; question: string; answer: string }> | null;
    aboutText?: string | null;
    whatsappNumber?: string | null;
    contactPhone?: string | null;
    businessAddress?: string | null;
    legalFullName?: string | null;
    taxId?: string | null;
    legalTexts?: Record<string, string> | null;
    // Aşama 2
    siteMode?: "TEMPLATE" | "BUILDER";
  }
) {
  const parsed = updateCoachSettingsSchema.safeParse(data);
  if (!parsed.success) {
    return { success: false, error: parsed.error.errors[0]?.message || "Geçersiz veri" };
  }

  const coach = await getCoachAuth(domain);
  const planId = resolvePlanId(coach.plan || coach.package.tier);

  const requestedLandingThemeNumber = data.landingThemeId
    ? Number(data.landingThemeId)
    : data.themeId || data.templateId
      ? Number(resolveLandingThemeId(data.themeId || data.templateId).replace("theme-", ""))
      : undefined;

  if (
    typeof requestedLandingThemeNumber === "number" &&
    !validateThemeSelection(planId, requestedLandingThemeNumber)
  ) {
    return {
      success: false,
      error: "Selected landing theme is not allowed for your plan.",
    };
  }

  const requestedDashboardThemeNumber = data.dashboardThemeId
    ? Number(data.dashboardThemeId)
    : data.dashboardTemplateId
      ? resolveDashboardThemeId(data.dashboardTemplateId)
      : undefined;

  if (
    typeof requestedDashboardThemeNumber === "number" &&
    !validateThemeSelection(planId, requestedDashboardThemeNumber)
  ) {
    return {
      success: false,
      error: "Selected dashboard theme is not allowed for your plan.",
    };
  }

  // Kademe 2: Server-side plan validation
  const features = getLandingFeatures(planId);
  if (data.landingConfig && typeof data.landingConfig === "object") {
    const cfg = data.landingConfig as { sections?: Array<{ id: string; variant: number; enabled: boolean }> };
    if (Array.isArray(cfg.sections)) {
      for (const s of cfg.sections) {
        if (s.variant > features.maxVariant) s.variant = features.maxVariant;
        if (s.id === "faq" && !features.canEnableFAQ) s.enabled = false;
      }
    }
  }
  // Section Builder (eliteConfig): blockId varlık + plan tier + maxSections
  if (data.eliteConfig && typeof data.eliteConfig === "object") {
    const { getBlockMeta } = await import("@/src/components/landing/blocks/manifest-meta");
    const { getMaxBuilderSections, isBlockTierAllowed } = await import("@/src/lib/plan");
    const cfg = data.eliteConfig as { sections?: Array<{ id: string; category?: string; blockId?: string; enabled?: boolean; customColors?: unknown; animationType?: string }> };
    if (Array.isArray(cfg.sections)) {
      const filtered: typeof cfg.sections = [];
      const maxSections = getMaxBuilderSections(planId);
      for (const s of cfg.sections) {
        if (!s || typeof s !== "object" || !s.blockId) continue;
        const meta = getBlockMeta(String(s.blockId));
        if (!meta) {
          console.warn(`[Section Builder] Unknown blockId during save: ${s.blockId} — dropped`);
          continue;
        }
        if (!isBlockTierAllowed(planId, meta.planTier)) {
          console.warn(`[Section Builder] BlockId ${meta.id} requires ${meta.planTier}; coach plan does not allow — dropped`);
          continue;
        }
        // Canonical id'ye yönlendir (alias resolution)
        s.blockId = meta.id;
        s.category = meta.category;
        filtered.push(s);
        if (filtered.length >= maxSections) break;
      }
      cfg.sections = filtered;
    }
  }
  if (data.socialLinks && typeof data.socialLinks === "object") {
    const validKeys = ["instagram", "youtube", "tiktok", "twitter", "facebook", "linkedin"];
    const entries = Object.entries(data.socialLinks).filter(([k]) => validKeys.includes(k));
    if (entries.length > features.maxSocialLinks) {
      data.socialLinks = Object.fromEntries(entries.slice(0, features.maxSocialLinks));
    }
  }
  if (data.headingFont && !features.canSelectFonts) {
    data.headingFont = undefined;
  }
  if (data.bodyFont && !features.canSelectFonts) {
    data.bodyFont = undefined;
  }

  const nextHeroFocalX =
    typeof data.heroFocalX === "number"
      ? Math.min(100, Math.max(0, Math.round(data.heroFocalX)))
      : undefined;
  const nextHeroFocalY =
    typeof data.heroFocalY === "number"
      ? Math.min(100, Math.max(0, Math.round(data.heroFocalY)))
      : undefined;
  const nextHeroMode =
    data.heroMode === "logo" || data.heroMode === "photo"
      ? data.heroMode
      : undefined;

  const updateData = {
      brandName: data.brandName,
      bio: data.bio,
      primaryColor: data.primaryColor,
      secondaryColor: data.secondaryColor,
      ...(data.heroImageOriginalUrl !== undefined && {
        heroImageOriginalUrl: data.heroImageOriginalUrl || null,
      }),
      ...(data.heroImageDesktopUrl !== undefined && {
        heroImageDesktopUrl: data.heroImageDesktopUrl || null,
      }),
      ...(data.heroImageMobileUrl !== undefined && {
        heroImageMobileUrl: data.heroImageMobileUrl || null,
      }),
      ...(data.heroImageBlurDataUrl !== undefined && {
        heroImageBlurDataUrl: data.heroImageBlurDataUrl || null,
      }),
      ...(data.heroImageCutoutUrl !== undefined && {
        heroImageCutoutUrl: data.heroImageCutoutUrl || null,
      }),
      ...(typeof nextHeroFocalX === "number" && { heroFocalX: nextHeroFocalX }),
      ...(typeof nextHeroFocalY === "number" && { heroFocalY: nextHeroFocalY }),
      ...(nextHeroMode && { heroMode: nextHeroMode }),
      ...(data.heroVideoUrl !== undefined && {
        heroVideoUrl: data.heroVideoUrl || null,
      }),
      plan: toPlanSlug(planId),
      ...(typeof requestedLandingThemeNumber === "number" && {
        landingThemeId: requestedLandingThemeNumber,
        templateId: toLegacyLandingTemplateId(
          resolveLandingThemeId(`theme-${requestedLandingThemeNumber}`)
        ),
      }),
      ...(typeof requestedDashboardThemeNumber === "number" && {
        dashboardThemeId: requestedDashboardThemeNumber,
        dashboardTemplateId: toLegacyDashboardTemplateId(
          resolveDashboardThemeId(requestedDashboardThemeNumber)
        ),
      }),
      ...(data.sidebarPosition && ["left", "bottom", "right"].includes(data.sidebarPosition) && {
        sidebarPosition: data.sidebarPosition,
      }),
      // Kademe 2
      ...(data.landingConfig !== undefined && {
        landingConfig: data.landingConfig === null
          ? Prisma.JsonNull
          : (data.landingConfig as Prisma.InputJsonValue),
      }),
      ...(data.eliteConfig !== undefined && {
        eliteConfig: data.eliteConfig === null
          ? Prisma.JsonNull
          : (data.eliteConfig as Prisma.InputJsonValue),
      }),
      ...(data.socialLinks !== undefined && {
        socialLinks: data.socialLinks === null
          ? Prisma.JsonNull
          : (data.socialLinks as Prisma.InputJsonValue),
      }),
      ...(data.headingFont !== undefined && {
        headingFont: data.headingFont,
      }),
      ...(data.bodyFont !== undefined && {
        bodyFont: data.bodyFont,
      }),
      ...(data.heroImageDark !== undefined && {
        heroImageDark: data.heroImageDark,
      }),
      ...(data.landingTexts !== undefined && {
        landingTexts: data.landingTexts === null
          ? Prisma.JsonNull
          : (data.landingTexts as Prisma.InputJsonValue),
      }),
      ...(data.landingFaqs !== undefined && {
        landingFaqs: data.landingFaqs === null
          ? Prisma.JsonNull
          : (data.landingFaqs as unknown as Prisma.InputJsonValue),
      }),
      ...(data.aboutText !== undefined && {
        aboutText: data.aboutText?.trim().slice(0, 5000) || null,
      }),
      ...(data.whatsappNumber !== undefined && {
        whatsappNumber: data.whatsappNumber ? data.whatsappNumber.replace(/[^+\d]/g, "").slice(0, 20) : null,
      }),
      ...(data.contactPhone !== undefined && {
        contactPhone: data.contactPhone?.trim().slice(0, 30) || null,
      }),
      ...(data.businessAddress !== undefined && {
        businessAddress: data.businessAddress?.trim().slice(0, 500) || null,
      }),
      ...(data.legalFullName !== undefined && {
        legalFullName: data.legalFullName?.trim().slice(0, 150) || null,
      }),
      ...(data.taxId !== undefined && {
        taxId: data.taxId?.trim().slice(0, 30) || null,
      }),
      ...(data.legalTexts !== undefined && {
        legalTexts: data.legalTexts === null
          ? Prisma.JsonNull
          : (data.legalTexts as unknown as Prisma.InputJsonValue),
      }),
      // Aşama 2: siteMode — BUILDER yalnız Elite plana açık.
      // Plan dışındayken BUILDER seçilmek istenirse sessizce TEMPLATE'e çevrilir.
      ...(data.siteMode !== undefined && {
        siteMode:
          data.siteMode === "BUILDER" && planId !== "ELITE"
            ? "TEMPLATE"
            : data.siteMode,
      }),
  };

  await prisma.coach.update({
    where: { id: coach.id },
    data: updateData,
  });

  revalidatePath(`/site/${domain}/dashboard`);
  revalidatePath(`/site/${domain}`);
  revalidatePath(`/site/${domain}/hakkimizda`);
  await revalidateCoachCache(domain);
  return { success: true };
}

// Ödeme ayarları güncelle
export async function updatePaymentSettings(
  domain: string,
  data: {
    iyzicoApiKey?: string;
    iyzicoSecretKey?: string;
  }
) {
  const parsed = updatePaymentSettingsSchema.safeParse(data);
  if (!parsed.success) {
    return { success: false, error: parsed.error.errors[0]?.message || "Geçersiz veri" };
  }

  const coach = await getCoachAuth(domain);

  const updateData: Record<string, string> = {};
  if (data.iyzicoApiKey && data.iyzicoApiKey !== "••••••••") {
    updateData.iyzicoApiKey = data.iyzicoApiKey;
  }
  if (data.iyzicoSecretKey && data.iyzicoSecretKey !== "••••••••") {
    updateData.iyzicoSecretKey = data.iyzicoSecretKey;
  }

  if (Object.keys(updateData).length > 0) {
    await prisma.coach.update({
      where: { id: coach.id },
      data: updateData,
    });
  }

  revalidatePath(`/site/${domain}/dashboard`);
  return { success: true };
}

