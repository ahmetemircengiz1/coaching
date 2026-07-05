"use server";

import { createClient } from "@/lib/supabase/server";
import prisma, { Prisma } from "@coach-os/database";
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
import { createCoachSiteSchema } from "@/lib/validation/schemas";

// Platform + altyapı için rezerve edilmiş subdomain'ler.
// Yeni bir route eklediğinde buraya da ekle.
const RESERVED_SUBDOMAINS = new Set([
  // Altyapı
  "www", "app", "api", "cdn", "mail", "ftp", "smtp", "pop", "imap",
  "ns", "ns1", "ns2", "dns", "mx", "static", "assets", "media",
  // Platform rotaları
  "platform", "admin", "auth", "login", "signup", "register",
  "onboarding", "pricing", "dashboard", "settings", "account",
  // Marka/destek
  "coach", "coachos", "coach-os", "shred", "rep", "help", "support", "status",
  "docs", "blog", "news", "about", "contact", "press", "careers",
  "terms", "privacy", "legal", "security",
  // Test/geliştirme
  "test", "dev", "staging", "demo", "preview", "beta", "alpha",
  "localhost", "local", "example",
  // Kötü kullanım
  "root", "system", "webmaster", "postmaster", "hostmaster",
]);

function isReservedSubdomain(subdomain: string): boolean {
  return RESERVED_SUBDOMAINS.has(subdomain.toLowerCase());
}

export async function checkSubdomain(subdomain: string) {
  // Hızlı format kontrolü — Zod'un parçasını burada da yapalım
  if (typeof subdomain !== "string" || subdomain.length < 3 || subdomain.length > 32) {
    return { available: false, error: "Alan adı 3-32 karakter olmalı." };
  }
  if (!/^[a-z0-9][a-z0-9-]{1,30}[a-z0-9]$/.test(subdomain)) {
    return { available: false, error: "Sadece küçük harf, rakam ve tire (-) kullanın." };
  }
  if (isReservedSubdomain(subdomain)) {
    return { available: false, error: "Bu alan adı rezerve edilmiş." };
  }

  const existing = await prisma.coach.findUnique({
    where: { subdomain },
    select: { id: true },
  });

  return { available: !existing };
}

// Yeni koç için varsayılan başlangıç paketi (koç dashboard'dan düzenler)
function buildDefaultCoachPackage(coachId: string) {
  return {
    coachId,
    name: "Aylık Koçluk",
    description: "Kişiye özel program ve rehberlik. Bu paket örnek olarak oluşturuldu — içeriği ve fiyatı dashboard'dan düzenleyin.",
    duration: 4, // 4 hafta = 1 ay
    price: new Prisma.Decimal(2500),
    currency: "TRY",
    features: [
      "Kişiye özel antrenman programı",
      "Haftalık check-in ve geri bildirim",
      "Beslenme önerileri",
      "WhatsApp ile iletişim",
    ] as Prisma.InputJsonValue,
    isActive: false, // Koç inceleyip aktif etsin — yanlış fiyat yayına çıkmasın
    orderIndex: 0,
  };
}

// Hakkımızda için placeholder metin
function buildDefaultAboutText(brandName: string): string {
  return `Merhaba, ben ${brandName}. Sporla ve sağlıkla olan yolculuğunuzda size destek olmak için buradayım.\n\nYıllar içinde edindiğim deneyim ile her bireyin farklı hedeflere, farklı vücutlara ve farklı yaşam biçimlerine sahip olduğunu öğrendim. Bu yüzden kalıp programlar yerine size özel çözümler üretiyorum.\n\nBirlikte çalışmak isterseniz aşağıdaki paketleri inceleyebilir, dilerseniz doğrudan benimle iletişime geçebilirsiniz.`;
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
  // ─── 1. Zod validation ───
  const parsed = createCoachSiteSchema.safeParse({
    brandName: data.brandName,
    subdomain: data.subdomain,
    landingThemeId: data.landingThemeId,
    dashboardThemeId: data.dashboardThemeId,
    tier: data.tier,
    logoUrl: data.logoUrl,
  });

  if (!parsed.success) {
    return { error: parsed.error.errors[0]?.message || "Geçersiz veri." };
  }

  const input = parsed.data;

  // ─── 2. Reserved subdomain ───
  if (isReservedSubdomain(input.subdomain)) {
    return { error: "Bu alan adı rezerve edilmiş, lütfen başka bir tane seçin." };
  }

  // ─── 3. Auth ───
  const supabase = await createClient();
  const { data: authData, error: userError } = await supabase.auth.getUser();
  const user = authData.user;

  if (!user || userError) {
    return { error: "Oturum süreniz dolmuş. Lütfen tekrar giriş yapın." };
  }

  if (!user.email_confirmed_at) {
    return { error: "E-posta adresinizi doğrulamanız gerekiyor. Lütfen gelen kutunuzu kontrol edin." };
  }

  // ─── 4. Kullanıcı zaten koç mu? ───
  const existingCoach = await prisma.coach.findFirst({
    where: { OR: [{ userId: user.id }, { email: user.email! }] },
    select: { subdomain: true },
  });

  if (existingCoach) {
    return {
      error: "Zaten bir siteniz var, yönlendiriliyorsunuz...",
      subdomain: existingCoach.subdomain,
    };
  }

  // ─── 5. Paket kontrolü ───
  const saasPackage = await prisma.saasPackage.findFirst({
    where: { tier: input.tier },
    select: { id: true },
  });

  if (!saasPackage) {
    return { error: "Seçtiğiniz paket bulunamadı. Lütfen destek ile iletişime geçin." };
  }

  // ─── 6. Tema seçimi validation ───
  const planId = resolvePlanId(input.tier);
  const selectedLandingThemeNumber = toLandingThemeNumber(`theme-${input.landingThemeId}`);
  const selectedDashboardThemeNumber = resolveDashboardThemeId(input.dashboardThemeId);

  if (!validateThemeSelection(planId, selectedLandingThemeNumber)) {
    return { error: "Seçtiğiniz landing teması paketinize dahil değil." };
  }
  if (!validateThemeSelection(planId, selectedDashboardThemeNumber)) {
    return { error: "Seçtiğiniz dashboard teması paketinize dahil değil." };
  }

  const selectedLandingThemeId = resolveLandingThemeId(`theme-${selectedLandingThemeNumber}`);

  // ─── 7. Transaction: Coach + Default Package ───
  try {
    const coach = await prisma.$transaction(async (tx) => {
      const newCoach = await tx.coach.create({
        data: {
          userId: user.id,
          email: user.email!,
          name: user.user_metadata?.name || input.brandName,
          brandName: input.brandName,
          subdomain: input.subdomain,
          plan: toPlanSlug(planId),
          landingThemeId: selectedLandingThemeNumber,
          dashboardThemeId: selectedDashboardThemeNumber,
          templateId: toLegacyLandingTemplateId(selectedLandingThemeId),
          dashboardTemplateId: toLegacyDashboardTemplateId(selectedDashboardThemeNumber),
          logo: input.logoUrl || null,
          packageId: saasPackage.id,
          subscriptionStatus: "active",
          aboutText: buildDefaultAboutText(input.brandName),
        },
      });

      await tx.coachPackage.create({
        data: buildDefaultCoachPackage(newCoach.id),
      });

      return newCoach;
    });

    console.log(JSON.stringify({
      type: "COACH_CREATED",
      coachId: coach.id,
      subdomain: coach.subdomain,
      plan: planId,
      tier: input.tier,
      timestamp: new Date().toISOString(),
    }));

    return { success: true, subdomain: coach.subdomain };
  } catch (err) {
    // ─── 8. Race condition: unique constraint violation ───
    if (err instanceof Prisma.PrismaClientKnownRequestError && err.code === "P2002") {
      const target = (err.meta?.target as string[] | undefined)?.join(",") || "";
      if (target.includes("subdomain")) {
        return { error: "Bu alan adı az önce başka biri tarafından alındı. Lütfen farklı bir tane seçin." };
      }
      if (target.includes("email") || target.includes("userId")) {
        return { error: "Bu hesap için zaten bir site kayıtlı." };
      }
    }
    console.error("[createCoachSite] Unexpected error:", err);
    return { error: "Site oluşturulurken bir hata oluştu. Lütfen tekrar deneyin." };
  }
}
