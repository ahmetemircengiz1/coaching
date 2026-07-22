"use server";

import prisma from "@coach-os/database";
import { createAdminClient } from "@/lib/supabase/admin";
import { createClient, getAuthUser } from "@/lib/supabase/server";
import { headers } from "next/headers";
import { checkRateLimitAsync, AUTH_LIMIT, getClientIp } from "@/lib/rate-limit";
import { studentSignupSchema, guestSignupSchema } from "@/lib/validation/schemas";
import { mapResendEmailError } from "@/lib/auth-email-errors";
import { checkEmailDomain } from "@/lib/email-check";
import { createNotification } from "@/lib/notifications";

type SignupInput = {
  email: string;
  password: string;
  confirmPassword: string;
  name: string;
  phone?: string;
  code: string;
  /** Landing'de tıklanan paketin id'si — koç panelinde paket bilgisi olarak görünür */
  packageId?: string;
};

function getBaseUrl(hdrs: Headers): string {
  const envUrl = process.env.NEXT_PUBLIC_APP_URL;
  if (envUrl) return envUrl.replace(/\/$/, "");
  const host = hdrs.get("host") || "localhost:3002";
  const proto = hdrs.get("x-forwarded-proto") || (host.startsWith("localhost") ? "http" : "https");
  return `${proto}://${host}`;
}

export async function signUpStudentWithCode(
  domain: string,
  input: SignupInput
): Promise<
  { success: true; email: string; needsConfirmation: boolean } | { error: string }
> {
  // Rate limit (per IP)
  const hdrs = await headers();
  const ip = getClientIp(hdrs);
  const rl = await checkRateLimitAsync(`regcode:claim:${ip}`, AUTH_LIMIT);
  if (!rl.success) {
    return { error: "Çok fazla kayıt denemesi. Lütfen birkaç dakika sonra tekrar deneyin." };
  }

  const parsed = studentSignupSchema.safeParse(input);
  if (!parsed.success) {
    return { error: parsed.error.errors[0]?.message || "Geçersiz veri." };
  }
  const data = parsed.data;

  // E-posta alan adı gerçekten posta alabiliyor mu? (typo/temp-mail/MX kontrolü)
  const emailCheck = await checkEmailDomain(data.email);
  if (!emailCheck.ok) {
    return { error: emailCheck.error };
  }

  // Koçu bul
  const coach = await prisma.coach.findFirst({
    where: { OR: [{ subdomain: domain }, { customDomain: domain }] },
    select: { id: true, subdomain: true },
  });
  if (!coach) {
    return { error: "Koç sitesi bulunamadı." };
  }

  // Kodu doğrula
  const now = new Date();
  const codeRow = await prisma.coachRegistrationCode.findUnique({
    where: { code: data.code },
    select: {
      id: true,
      coachId: true,
      usedAt: true,
      revokedAt: true,
      expiresAt: true,
      coachPackageId: true,
    },
  });

  if (!codeRow || codeRow.coachId !== coach.id) {
    return { error: "Koç kodu geçersiz." };
  }
  if (codeRow.usedAt) {
    return { error: "Bu kod zaten kullanılmış. Koçunuzdan yeni bir kod isteyin." };
  }
  if (codeRow.revokedAt) {
    return { error: "Bu kod iptal edilmiş. Koçunuzdan yeni bir kod isteyin." };
  }
  if (codeRow.expiresAt && codeRow.expiresAt < now) {
    return { error: "Bu kodun süresi dolmuş. Koçunuzdan yeni bir kod isteyin." };
  }

  // Aynı email bu koçta zaten öğrenci mi?
  const emailLower = data.email.toLowerCase();
  const existing = await prisma.student.findFirst({
    where: { email: emailLower, coachId: coach.id },
    select: { id: true },
  });
  if (existing) {
    return { error: "Bu e-posta bu koçta zaten kayıtlı. Giriş yapmayı deneyin." };
  }

  // Tıklanan paket koça ait ve aktif mi? Geçersizse kayıt akışını bozmadan
  // sessizce yok sayılır (paket bilgisi opsiyonel bir zenginleştirmedir).
  let pendingPackageId: string | null = null;
  if (data.packageId) {
    const pkg = await prisma.coachPackage.findFirst({
      where: { id: data.packageId, coachId: coach.id, isActive: true },
      select: { id: true },
    });
    pendingPackageId = pkg?.id || null;
  }

  // Supabase auth kullanıcısı oluştur (anon signUp → e-posta doğrulama zorunlu).
  // Student satırı ve kodun tüketilmesi doğrulama SONRASINA (/auth/complete →
  // finalizeStudentSignup) ertelenir; kayıt bilgileri user_metadata'da taşınır.
  const supabase = await createClient();
  const baseUrl = getBaseUrl(hdrs);

  const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
    email: emailLower,
    password: data.password,
    options: {
      data: {
        name: data.name,
        role: "student",
        coach_domain: coach.subdomain,
        phone: data.phone || null,
        pending_reg_code: data.code,
        pending_package_id: pendingPackageId,
      },
      emailRedirectTo: `${baseUrl}/site/${domain}/auth/callback?next=/site/${domain}/auth/verified`,
    },
  });

  if (signUpError) {
    const msg = signUpError.message.toLowerCase();
    if (msg.includes("already") || msg.includes("registered")) {
      return { error: "Bu e-posta zaten kayıtlı. Giriş yapmayı veya şifre sıfırlamayı deneyin." };
    }
    console.error("[signUpStudentWithCode] signUp error:", signUpError.message);
    return { error: "Kayıt sırasında bir hata oluştu. Lütfen tekrar deneyin." };
  }

  // Email confirmation açıkken kayıtlı e-postayla signUp hata döndürmez;
  // identities'i boş sahte bir user döner (enumeration koruması). Bunu yakala.
  if (signUpData.user && !signUpData.session && (signUpData.user.identities?.length ?? 0) === 0) {
    return { error: "Bu e-posta zaten kayıtlı. Giriş yapmayı veya şifre sıfırlamayı deneyin." };
  }

  // Doğrulama açık → session dönmez; öğrenci e-postasındaki linke tıklayınca
  // callback → /auth/complete → finalizeStudentSignup zinciri kaydı tamamlar.
  if (!signUpData.session) {
    console.log(JSON.stringify({
      type: "STUDENT_SIGNUP_PENDING",
      coachId: coach.id,
      codeId: codeRow.id,
    }));
    return { success: true, email: emailLower, needsConfirmation: true };
  }

  // Doğrulama kapalıysa (autoconfirm) session hemen döner — kaydı şimdi tamamla.
  const finalized = await finalizeStudentSignup(domain);
  if ("error" in finalized) {
    return finalized;
  }
  return { success: true, email: emailLower, needsConfirmation: false };
}

// ─── E-posta doğrulaması sonrası (veya autoconfirm açıkken hemen) çağrılır ───
// Oturumdaki kullanıcının metadata'sındaki koç koduna göre Student satırını
// oluşturur ve kodu kullanıldı işaretler. Tekrar çağrılırsa idempotenttir.
export async function finalizeStudentSignup(
  domain: string
): Promise<{ success: true; studentId: string } | { error: string }> {
  const user = await getAuthUser();
  if (!user) {
    return { error: "Oturum doğrulanamadı. Lütfen giriş yapmayı deneyin." };
  }

  const coach = await prisma.coach.findFirst({
    where: { OR: [{ subdomain: domain }, { customDomain: domain }] },
    select: { id: true },
  });
  if (!coach) {
    return { error: "Koç sitesi bulunamadı." };
  }

  // Idempotent: kullanıcı zaten öğrenciyse başarı say
  const existing = await prisma.student.findUnique({
    where: { userId: user.id },
    select: { id: true, coachId: true },
  });
  if (existing) {
    if (existing.coachId === coach.id) {
      return { success: true, studentId: existing.id };
    }
    return { error: "Bu hesap başka bir koçun öğrencisi olarak kayıtlı." };
  }

  const meta = (user.user_metadata ?? {}) as Record<string, unknown>;
  if (meta.role !== "student") {
    return { error: "Bu hesap bir öğrenci kaydı değil." };
  }
  const code = typeof meta.pending_reg_code === "string" ? meta.pending_reg_code : "";
  if (!code) {
    return { error: "Kayıt kodu bulunamadı. Lütfen koçunuzla iletişime geçin." };
  }

  const now = new Date();
  const codeRow = await prisma.coachRegistrationCode.findUnique({
    where: { code },
    select: {
      id: true,
      coachId: true,
      usedAt: true,
      revokedAt: true,
      expiresAt: true,
      coachPackageId: true,
    },
  });

  if (!codeRow || codeRow.coachId !== coach.id) {
    return { error: "Koç kodu geçersiz. Koçunuzdan yeni bir kod isteyin." };
  }
  if (codeRow.usedAt) {
    return { error: "Bu kod bu arada başka biri tarafından kullanılmış. Koçunuzdan yeni bir kod isteyin." };
  }
  if (codeRow.revokedAt) {
    return { error: "Bu kod iptal edilmiş. Koçunuzdan yeni bir kod isteyin." };
  }
  if (codeRow.expiresAt && codeRow.expiresAt < now) {
    return { error: "Bu kodun süresi dolmuş. Koçunuzdan yeni bir kod isteyin." };
  }

  const name =
    typeof meta.name === "string" && meta.name.trim() ? meta.name.trim() : user.email || "Öğrenci";
  const phone = typeof meta.phone === "string" && meta.phone.trim() ? meta.phone.trim() : null;

  // Landing'de tıklanan paket — kod pakete bağlı değilse fallback olarak atanır.
  // Finalize anına kadar paket silinmiş/pasifleşmiş olabilir → tekrar doğrula.
  let clickedPackageId: string | null = null;
  const pendingPackageId =
    typeof meta.pending_package_id === "string" ? meta.pending_package_id : "";
  if (pendingPackageId) {
    const pkg = await prisma.coachPackage.findFirst({
      where: { id: pendingPackageId, coachId: coach.id, isActive: true },
      select: { id: true },
    });
    clickedPackageId = pkg?.id || null;
  }

  try {
    const student = await prisma.$transaction(async (tx) => {
      // Kodu tekrar verify et (race condition)
      const fresh = await tx.coachRegistrationCode.findUnique({
        where: { id: codeRow.id },
        select: { usedAt: true, revokedAt: true, expiresAt: true },
      });
      if (!fresh || fresh.usedAt || fresh.revokedAt || (fresh.expiresAt && fresh.expiresAt < new Date())) {
        throw new Error("code_race");
      }

      const created = await tx.student.create({
        data: {
          userId: user.id,
          email: (user.email || "").toLowerCase(),
          name,
          phone,
          coachId: coach.id,
          // Kod bir pakete bağlıysa koçun bilinçli ataması kazanır;
          // değilse öğrencinin landing'de tıkladığı paket atanır.
          coachPackageId: codeRow.coachPackageId || clickedPackageId,
          status: "active",
        },
        select: { id: true },
      });

      await tx.coachRegistrationCode.update({
        where: { id: codeRow.id },
        data: {
          usedAt: new Date(),
          usedByStudentId: created.id,
        },
      });

      return created;
    });

    console.log(JSON.stringify({
      type: "STUDENT_SIGNUP",
      coachId: coach.id,
      codeId: codeRow.id,
      userId: user.id,
      clickedPackageId,
    }));

    return { success: true, studentId: student.id };
  } catch (err) {
    if (err instanceof Error && err.message === "code_race") {
      return { error: "Kod az önce başka biri tarafından kullanıldı. Koçunuzdan yeni bir kod isteyin." };
    }
    console.error("[finalizeStudentSignup] Unexpected error:", err);
    return { error: "Hesap oluşturulamadı. Lütfen tekrar deneyin." };
  }
}

// ─── Onay e-postasını tekrar gönder ───
export async function resendStudentConfirmation(
  domain: string,
  email: string
): Promise<{ success: true } | { error: string; retryAfter?: number }> {
  const hdrs = await headers();
  const ip = getClientIp(hdrs);
  const rl = await checkRateLimitAsync(`regcode:resend:${ip}`, AUTH_LIMIT);
  if (!rl.success) {
    return { error: "Çok fazla istek. Lütfen birkaç dakika sonra tekrar deneyin." };
  }

  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) || email.length > 255) {
    return { error: "Geçerli bir e-posta girin." };
  }

  const supabase = await createClient();
  const baseUrl = getBaseUrl(hdrs);

  const { error } = await supabase.auth.resend({
    type: "signup",
    email: email.toLowerCase(),
    options: {
      emailRedirectTo: `${baseUrl}/site/${domain}/auth/callback?next=/site/${domain}/auth/verified`,
    },
  });

  if (error) {
    return mapResendEmailError(error);
  }
  return { success: true };
}

// ═══════════════════════════════════════════════════════════════════
// MİSAFİR KAYDI — kod gerektirmez; panel salt-okunur keşif modunda açılır.
// Misafirler Student tablosuna DEĞİL, ayrı Guest tablosuna yazılır ve koç
// panelinde lead listesi olarak (e-postalarıyla) görünür.
// ═══════════════════════════════════════════════════════════════════

type GuestSignupInput = {
  email: string;
  password: string;
  confirmPassword: string;
  name: string;
  phone?: string;
};

export async function signUpAsGuest(
  domain: string,
  input: GuestSignupInput
): Promise<
  { success: true; email: string; needsConfirmation: boolean } | { error: string }
> {
  const hdrs = await headers();
  const ip = getClientIp(hdrs);
  const rl = await checkRateLimitAsync(`guest:signup:${ip}`, AUTH_LIMIT);
  if (!rl.success) {
    return { error: "Çok fazla kayıt denemesi. Lütfen birkaç dakika sonra tekrar deneyin." };
  }

  const parsed = guestSignupSchema.safeParse(input);
  if (!parsed.success) {
    return { error: parsed.error.errors[0]?.message || "Geçersiz veri." };
  }
  const data = parsed.data;

  const emailCheck = await checkEmailDomain(data.email);
  if (!emailCheck.ok) {
    return { error: emailCheck.error };
  }

  const coach = await prisma.coach.findFirst({
    where: { OR: [{ subdomain: domain }, { customDomain: domain }] },
    select: { id: true, subdomain: true },
  });
  if (!coach) {
    return { error: "Koç sitesi bulunamadı." };
  }

  // Zaten kayıtlı öğrenciyse misafirliğe gerek yok
  const emailLower = data.email.toLowerCase();
  const existingStudent = await prisma.student.findFirst({
    where: { email: emailLower, coachId: coach.id },
    select: { id: true },
  });
  if (existingStudent) {
    return { error: "Bu e-posta bu koçta zaten öğrenci olarak kayıtlı. Giriş yapmayı deneyin." };
  }

  const supabase = await createClient();
  const baseUrl = getBaseUrl(hdrs);

  const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
    email: emailLower,
    password: data.password,
    options: {
      data: {
        name: data.name,
        role: "guest",
        coach_domain: coach.subdomain,
        phone: data.phone || null,
      },
      emailRedirectTo: `${baseUrl}/site/${domain}/auth/callback?next=/site/${domain}/auth/verified`,
    },
  });

  if (signUpError) {
    const msg = signUpError.message.toLowerCase();
    if (msg.includes("already") || msg.includes("registered")) {
      return { error: "Bu e-posta zaten kayıtlı. Giriş yapmayı veya şifre sıfırlamayı deneyin." };
    }
    console.error("[signUpAsGuest] signUp error:", signUpError.message);
    return { error: "Kayıt sırasında bir hata oluştu. Lütfen tekrar deneyin." };
  }

  // Enumeration koruması: kayıtlı e-postayla signUp identities'i boş user döner
  if (signUpData.user && !signUpData.session && (signUpData.user.identities?.length ?? 0) === 0) {
    return { error: "Bu e-posta zaten kayıtlı. Giriş yapmayı veya şifre sıfırlamayı deneyin." };
  }

  if (!signUpData.session) {
    console.log(JSON.stringify({ type: "GUEST_SIGNUP_PENDING", coachId: coach.id }));
    return { success: true, email: emailLower, needsConfirmation: true };
  }

  const finalized = await finalizeGuestSignup(domain);
  if ("error" in finalized) {
    return finalized;
  }
  return { success: true, email: emailLower, needsConfirmation: false };
}

// E-posta doğrulaması sonrası (veya autoconfirm ile hemen) Guest satırını yazar.
// Tekrar çağrılırsa idempotenttir; kullanıcı bu arada öğrenci olduysa da başarı sayar.
export async function finalizeGuestSignup(
  domain: string
): Promise<{ success: true; kind: "guest" | "student" } | { error: string }> {
  const user = await getAuthUser();
  if (!user) {
    return { error: "Oturum doğrulanamadı. Lütfen giriş yapmayı deneyin." };
  }

  const coach = await prisma.coach.findFirst({
    where: { OR: [{ subdomain: domain }, { customDomain: domain }] },
    select: { id: true, userId: true },
  });
  if (!coach) {
    return { error: "Koç sitesi bulunamadı." };
  }

  // Zaten öğrenciyse misafirlik gereksiz — tam panele gider
  const existingStudent = await prisma.student.findUnique({
    where: { userId: user.id },
    select: { id: true, coachId: true },
  });
  if (existingStudent) {
    if (existingStudent.coachId === coach.id) {
      return { success: true, kind: "student" };
    }
    return { error: "Bu hesap başka bir koçun öğrencisi olarak kayıtlı." };
  }

  // Idempotent: Guest satırı zaten varsa başarı
  const existingGuest = await prisma.guest.findUnique({
    where: { userId: user.id },
    select: { id: true, coachId: true },
  });
  if (existingGuest) {
    if (existingGuest.coachId === coach.id) {
      return { success: true, kind: "guest" };
    }
    return { error: "Bu hesap başka bir koçun sitesinde misafir olarak kayıtlı." };
  }

  const meta = (user.user_metadata ?? {}) as Record<string, unknown>;
  if (meta.role !== "guest") {
    return { error: "Bu hesap bir misafir kaydı değil." };
  }

  const name =
    typeof meta.name === "string" && meta.name.trim() ? meta.name.trim() : null;
  const phone = typeof meta.phone === "string" && meta.phone.trim() ? meta.phone.trim() : null;
  const emailLower = (user.email || "").toLowerCase();

  try {
    // Aynı e-posta bu koçta daha önce misafir olmuşsa (eski hesap silinmiş
    // olabilir) satırı yeni auth kullanıcısına bağla — @@unique([email, coachId])
    await prisma.guest.upsert({
      where: { email_coachId: { email: emailLower, coachId: coach.id } },
      create: {
        userId: user.id,
        email: emailLower,
        name,
        phone,
        coachId: coach.id,
      },
      update: { userId: user.id, name, phone, lastSeenAt: new Date() },
    });
  } catch (err) {
    console.error("[finalizeGuestSignup] guest yazılamadı:", err);
    return { error: "Kayıt tamamlanamadı. Lütfen tekrar deneyin." };
  }

  console.log(JSON.stringify({ type: "GUEST_SIGNUP", coachId: coach.id, userId: user.id }));

  // Koça haber ver — misafir e-postası lead olarak panelde görünür
  await createNotification({
    recipientId: coach.userId,
    type: "guest_signup",
    title: "Yeni misafir kaydı",
    message: `${name || emailLower} sitenizi misafir olarak keşfetmeye başladı.`,
    link: `/site/${domain}/dashboard/students`,
  }).catch((err) => console.error("[finalizeGuestSignup] bildirim yazılamadı:", err));

  return { success: true, kind: "guest" };
}

// Misafir panelindeki "kod gir" alanı: geçerli koç kodunu kullanınca misafir
// tam kayıtlı öğrenciye dönüşür (tüm özellikler açılır, koçun listesine geçer).
export async function redeemCodeAsGuest(
  domain: string,
  codeInput: string
): Promise<{ success: true } | { error: string }> {
  const hdrs = await headers();
  const ip = getClientIp(hdrs);
  const rl = await checkRateLimitAsync(`guest:redeem:${ip}`, AUTH_LIMIT);
  if (!rl.success) {
    return { error: "Çok fazla deneme. Lütfen birkaç dakika sonra tekrar deneyin." };
  }

  const code = (codeInput || "").trim().toUpperCase();
  if (code.length < 6 || code.length > 32) {
    return { error: "Koç kodu geçersiz." };
  }

  const user = await getAuthUser();
  if (!user) {
    return { error: "Oturum doğrulanamadı. Lütfen tekrar giriş yapın." };
  }

  const coach = await prisma.coach.findFirst({
    where: { OR: [{ subdomain: domain }, { customDomain: domain }] },
    select: { id: true, userId: true },
  });
  if (!coach) {
    return { error: "Koç sitesi bulunamadı." };
  }

  // Zaten öğrenci mi?
  const existingStudent = await prisma.student.findUnique({
    where: { userId: user.id },
    select: { id: true, coachId: true },
  });
  if (existingStudent) {
    if (existingStudent.coachId === coach.id) return { success: true };
    return { error: "Bu hesap başka bir koçun öğrencisi olarak kayıtlı." };
  }

  const guest = await prisma.guest.findUnique({
    where: { userId: user.id },
    select: { id: true, coachId: true, email: true, name: true, phone: true },
  });
  if (!guest || guest.coachId !== coach.id) {
    return { error: "Misafir kaydınız bulunamadı. Lütfen tekrar giriş yapın." };
  }

  const now = new Date();
  const codeRow = await prisma.coachRegistrationCode.findUnique({
    where: { code },
    select: { id: true, coachId: true, usedAt: true, revokedAt: true, expiresAt: true, coachPackageId: true },
  });

  if (!codeRow || codeRow.coachId !== coach.id) {
    return { error: "Koç kodu geçersiz. Koçunuzdan yeni bir kod isteyin." };
  }
  if (codeRow.usedAt) {
    return { error: "Bu kod zaten kullanılmış. Koçunuzdan yeni bir kod isteyin." };
  }
  if (codeRow.revokedAt) {
    return { error: "Bu kod iptal edilmiş. Koçunuzdan yeni bir kod isteyin." };
  }
  if (codeRow.expiresAt && codeRow.expiresAt < now) {
    return { error: "Bu kodun süresi dolmuş. Koçunuzdan yeni bir kod isteyin." };
  }

  try {
    const student = await prisma.$transaction(async (tx) => {
      // Race: kod bu arada kullanılmış olabilir
      const fresh = await tx.coachRegistrationCode.findUnique({
        where: { id: codeRow.id },
        select: { usedAt: true, revokedAt: true, expiresAt: true },
      });
      if (!fresh || fresh.usedAt || fresh.revokedAt || (fresh.expiresAt && fresh.expiresAt < new Date())) {
        throw new Error("code_race");
      }

      const created = await tx.student.create({
        data: {
          userId: user.id,
          email: guest.email,
          name: guest.name || guest.email,
          phone: guest.phone,
          coachId: coach.id,
          coachPackageId: codeRow.coachPackageId || null,
          status: "active",
        },
        select: { id: true },
      });

      await tx.coachRegistrationCode.update({
        where: { id: codeRow.id },
        data: { usedAt: new Date(), usedByStudentId: created.id },
      });

      await tx.guest.update({
        where: { id: guest.id },
        data: { convertedStudentId: created.id, convertedAt: new Date() },
      });

      return created;
    });

    console.log(JSON.stringify({
      type: "GUEST_CONVERTED",
      coachId: coach.id,
      userId: user.id,
      studentId: student.id,
    }));

    await createNotification({
      recipientId: coach.userId,
      type: "guest_converted",
      title: "Misafir öğrenciye dönüştü",
      message: `${guest.name || guest.email} kod kullanarak kayıtlı öğrencin oldu.`,
      link: `/site/${domain}/dashboard/students/${student.id}`,
    }).catch((err) => console.error("[redeemCodeAsGuest] bildirim yazılamadı:", err));

    return { success: true };
  } catch (err) {
    if (err instanceof Error && err.message === "code_race") {
      return { error: "Kod az önce başka biri tarafından kullanıldı. Koçunuzdan yeni bir kod isteyin." };
    }
    console.error("[redeemCodeAsGuest] Beklenmeyen hata:", err);
    return { error: "İşlem tamamlanamadı. Lütfen tekrar deneyin." };
  }
}

export async function requestPasswordReset(
  domain: string,
  email: string
): Promise<{ success: true } | { error: string }> {
  const hdrs = await headers();
  const ip = getClientIp(hdrs);
  const rl = await checkRateLimitAsync(`pwdreset:${ip}`, AUTH_LIMIT);
  if (!rl.success) {
    return { error: "Çok fazla istek. Lütfen birkaç dakika sonra tekrar deneyin." };
  }

  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) || email.length > 255) {
    return { error: "Geçerli bir e-posta girin." };
  }

  const host = hdrs.get("host") || "";
  // Host header doğrulama: yalnız geçerli hostname[:port] formatını kabul et.
  // Host header injection ile reset-link poisoning'i engeller. (Supabase ayrıca
  // redirectTo'yu kendi "Redirect URLs" allowlist'ine göre doğrular — ikinci kat.)
  if (!/^[a-zA-Z0-9.-]+(:\d{1,5})?$/.test(host)) {
    console.log(JSON.stringify({ type: "PWDRESET_BAD_HOST", host }));
    return { success: true }; // enumeration-safe: sessizce başarılı dön
  }
  const proto = hdrs.get("x-forwarded-proto") || (host.startsWith("localhost") ? "http" : "https");
  // Link callback üzerinden gider: e-posta şablonu token_hash eklerse
  // verifyOtp ile cihaz bağımsız çalışır, sonra reset sayfasına düşer.
  const redirectTo = `${proto}://${host}/site/${domain}/auth/callback?next=/site/${domain}/auth/reset-password`;

  const admin = createAdminClient();
  // Supabase anon client tarafı yok — admin üzerinden magic link üret
  const { error } = await admin.auth.resetPasswordForEmail(email.toLowerCase(), {
    redirectTo,
  });

  if (error) {
    // Enumeration önleme: her zaman success döndür
    console.log(JSON.stringify({ type: "PWDRESET_ERROR", message: error.message }));
  }

  return { success: true };
}

export async function updatePasswordAfterReset(
  newPassword: string
): Promise<{ success: true } | { error: string }> {
  if (!newPassword || newPassword.length < 8 || newPassword.length > 128) {
    return { error: "Şifre en az 8 karakter olmalı." };
  }

  const { createClient } = await import("@/lib/supabase/server");
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    return { error: "Oturum bulunamadı. Linki tekrar kullanın." };
  }

  const { error } = await supabase.auth.updateUser({ password: newPassword });
  if (error) {
    return { error: "Şifre güncellenemedi. Lütfen tekrar deneyin." };
  }

  return { success: true };
}
