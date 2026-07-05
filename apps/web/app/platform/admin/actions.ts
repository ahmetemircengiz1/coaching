"use server";

import { getAuthUser } from "@/lib/supabase/server";
import prisma from "@coach-os/database";
import { redirect } from "next/navigation";

/**
 * Admin allow-list: env variable ADMIN_EMAILS (comma-separated).
 * Falls back to user_metadata.role check for dev convenience.
 * In production, ALWAYS set ADMIN_EMAILS for security.
 */
const ADMIN_EMAILS = (process.env.ADMIN_EMAILS || "")
  .split(",")
  .map((e) => e.trim().toLowerCase())
  .filter(Boolean);

async function requireAdmin() {
  const user = await getAuthUser();
  if (!user) redirect("/platform/auth");

  const email = user.email?.toLowerCase() || "";

  // Primary check: env-based allow-list (tamper-proof)
  if (ADMIN_EMAILS.length > 0) {
    if (!ADMIN_EMAILS.includes(email)) {
      redirect("/platform/auth");
    }
    return user;
  }

  // Production'da ADMIN_EMAILS zorunlu — metadata fallback devre dışı
  if (process.env.NODE_ENV === "production") {
    console.error("[SECURITY] ADMIN_EMAILS env variable not set in production");
    redirect("/platform/auth");
  }

  // Fallback for dev only: user_metadata role check
  if (user.user_metadata?.role !== "admin") {
    redirect("/platform/auth");
  }
  return user;
}

function auditLog(action: string, adminEmail: string, details?: Record<string, unknown>) {
  console.log(JSON.stringify({
    type: "ADMIN_AUDIT",
    action,
    admin: adminEmail,
    timestamp: new Date().toISOString(),
    ...details,
  }));
}

// Dashboard istatistikleri
export async function getAdminDashboardStats() {
  await requireAdmin();

  const [
    totalCoaches,
    activeCoaches,
    totalStudents,
    activeStudents,
    totalPackages,
    coachesByTier,
    recentCoaches,
    recentPayments,
  ] = await Promise.all([
    prisma.coach.count(),
    prisma.coach.count({ where: { subscriptionStatus: "active" } }),
    prisma.student.count(),
    prisma.student.count({ where: { status: "active" } }),
    prisma.coachPackage.count({ where: { isActive: true } }),
    prisma.coach.groupBy({
      by: ["packageId"],
      _count: true,
    }),
    prisma.coach.findMany({
      orderBy: { createdAt: "desc" },
      take: 10,
      include: {
        package: { select: { name: true, tier: true } },
        _count: { select: { students: true } },
      },
    }),
    prisma.payment.findMany({
      where: { type: "saas_subscription", status: "completed" },
      orderBy: { createdAt: "desc" },
      take: 10,
    }),
  ]);

  // SaaS paketlerini al (tier bilgisi için)
  const saasPackages = await prisma.saasPackage.findMany({
    orderBy: { tier: "asc" },
  });

  // Tier bazlı koç dağılımı
  const tierDistribution = saasPackages.map((pkg) => {
    const group = coachesByTier.find((g) => g.packageId === pkg.id);
    return {
      packageId: pkg.id,
      packageName: pkg.name,
      tier: pkg.tier,
      count: group?._count || 0,
      price: Number(pkg.price),
      currency: pkg.currency,
    };
  });

  // Tahmini aylık gelir (aktif koç * paket fiyatı)
  const monthlyRevenue = tierDistribution.reduce(
    (sum, t) => sum + t.count * t.price,
    0
  );

  return {
    stats: {
      totalCoaches,
      activeCoaches,
      totalStudents,
      activeStudents,
      totalPackages,
      monthlyRevenue,
    },
    tierDistribution,
    recentCoaches: recentCoaches.map((c) => ({
      id: c.id,
      name: c.name,
      brandName: c.brandName,
      email: c.email,
      subdomain: c.subdomain,
      templateId: c.templateId,
      subscriptionStatus: c.subscriptionStatus,
      packageName: c.package.name,
      packageTier: c.package.tier,
      studentCount: c._count.students,
      createdAt: c.createdAt.toISOString(),
    })),
    recentPayments: recentPayments.map((p) => ({
      id: p.id,
      amount: Number(p.amount),
      currency: p.currency,
      status: p.status,
      provider: p.provider,
      createdAt: p.createdAt.toISOString(),
    })),
  };
}

// Tüm koçlar listesi
export async function getAdminCoachesList() {
  await requireAdmin();

  const coaches = await prisma.coach.findMany({
    orderBy: { createdAt: "desc" },
    include: {
      package: { select: { name: true, tier: true, maxStudents: true } },
      _count: {
        select: {
          students: true,
          coachPackages: true,
          programs: true,
          transformations: true,
        },
      },
    },
  });

  return coaches.map((c) => ({
    id: c.id,
    userId: c.userId,
    name: c.name,
    brandName: c.brandName,
    email: c.email,
    subdomain: c.subdomain,
    customDomain: c.customDomain,
    templateId: c.templateId,
    primaryColor: c.primaryColor,
    secondaryColor: c.secondaryColor,
    subscriptionStatus: c.subscriptionStatus,
    packageName: c.package.name,
    packageTier: c.package.tier,
    maxStudents: c.package.maxStudents,
    studentCount: c._count.students,
    packageCount: c._count.coachPackages,
    programCount: c._count.programs,
    transformationCount: c._count.transformations,
    createdAt: c.createdAt.toISOString(),
    updatedAt: c.updatedAt.toISOString(),
  }));
}

// Koç detay
export async function getAdminCoachDetail(coachId: string) {
  await requireAdmin();

  const coach = await prisma.coach.findUnique({
    where: { id: coachId },
    include: {
      package: true,
      students: {
        include: {
          coachPackage: { select: { name: true } },
        },
        orderBy: { createdAt: "desc" },
      },
      coachPackages: {
        orderBy: { orderIndex: "asc" },
      },
      _count: {
        select: {
          students: true,
          programs: true,
          transformations: true,
          exercises: true,
        },
      },
    },
  });

  if (!coach) return null;

  return {
    id: coach.id,
    userId: coach.userId,
    name: coach.name,
    brandName: coach.brandName,
    email: coach.email,
    bio: coach.bio,
    logo: coach.logo,
    subdomain: coach.subdomain,
    customDomain: coach.customDomain,
    templateId: coach.templateId,
    primaryColor: coach.primaryColor,
    secondaryColor: coach.secondaryColor,
    subscriptionStatus: coach.subscriptionStatus,
    package: {
      name: coach.package.name,
      tier: coach.package.tier,
      maxStudents: coach.package.maxStudents,
      price: Number(coach.package.price),
      currency: coach.package.currency,
    },
    counts: coach._count,
    students: coach.students.map((s) => ({
      id: s.id,
      name: s.name,
      email: s.email,
      status: s.status,
      packageName: s.coachPackage?.name || "-",
      startDate: s.startDate.toISOString(),
    })),
    coachPackages: coach.coachPackages.map((p) => ({
      id: p.id,
      name: p.name,
      price: Number(p.price),
      currency: p.currency,
      duration: p.duration,
      isActive: p.isActive,
    })),
    createdAt: coach.createdAt.toISOString(),
    updatedAt: coach.updatedAt.toISOString(),
  };
}

// Koç abonelik durumunu güncelle
export async function updateCoachSubscription(
  coachId: string,
  data: { subscriptionStatus?: string; packageId?: string }
) {
  const { updateSubscriptionSchema } = await import("@/lib/validation/schemas");
  const parsed = updateSubscriptionSchema.safeParse(data);
  if (!parsed.success) return { success: false, error: parsed.error.errors[0]?.message || "Geçersiz veri" };

  const admin = await requireAdmin();

  await prisma.coach.update({
    where: { id: coachId },
    data: parsed.data,
  });

  auditLog("UPDATE_COACH_SUBSCRIPTION", admin.email || "unknown", {
    coachId,
    changes: parsed.data,
  });

  return { success: true };
}

// Abonelik özet istatistikleri
export async function getAdminSubscriptionStats() {
  await requireAdmin();

  const saasPackages = await prisma.saasPackage.findMany({
    orderBy: { tier: "asc" },
    include: {
      _count: { select: { coaches: true } },
      coaches: {
        select: { subscriptionStatus: true },
      },
    },
  });

  const allCoaches = await prisma.coach.findMany({
    select: {
      id: true,
      name: true,
      brandName: true,
      email: true,
      subdomain: true,
      subscriptionStatus: true,
      createdAt: true,
      package: { select: { name: true, tier: true, price: true, currency: true } },
      _count: { select: { students: true } },
    },
    orderBy: { createdAt: "desc" },
  });

  return {
    packages: saasPackages.map((pkg) => ({
      id: pkg.id,
      name: pkg.name,
      tier: pkg.tier,
      price: Number(pkg.price),
      currency: pkg.currency,
      totalCoaches: pkg._count.coaches,
      activeCoaches: pkg.coaches.filter((c) => c.subscriptionStatus === "active").length,
      cancelledCoaches: pkg.coaches.filter((c) => c.subscriptionStatus === "cancelled").length,
    })),
    coaches: allCoaches.map((c) => ({
      id: c.id,
      name: c.name,
      brandName: c.brandName,
      email: c.email,
      subdomain: c.subdomain,
      subscriptionStatus: c.subscriptionStatus,
      packageName: c.package.name,
      packageTier: c.package.tier,
      packagePrice: Number(c.package.price),
      currency: c.package.currency,
      studentCount: c._count.students,
      createdAt: c.createdAt.toISOString(),
    })),
  };
}
