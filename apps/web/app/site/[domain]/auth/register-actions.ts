"use server";

import prisma from "@coach-os/database";
import { createAdminClient } from "@/lib/supabase/admin";
import { headers } from "next/headers";
import { checkRateLimitAsync, AUTH_LIMIT, getClientIp } from "@/lib/rate-limit";
import { studentSignupSchema } from "@/lib/validation/schemas";

type SignupInput = {
  email: string;
  password: string;
  confirmPassword: string;
  name: string;
  phone?: string;
  code: string;
};

export async function signUpStudentWithCode(
  domain: string,
  input: SignupInput
): Promise<{ success: true; email: string } | { error: string }> {
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

  // Supabase auth kullanıcısı oluştur (admin ile - email doğrulama atlanır)
  const admin = createAdminClient();
  const { data: userData, error: createErr } = await admin.auth.admin.createUser({
    email: emailLower,
    password: data.password,
    email_confirm: true,
    user_metadata: {
      name: data.name,
      role: "student",
      coach_domain: coach.subdomain,
    },
  });

  if (createErr || !userData.user) {
    // Email zaten Supabase'te var olabilir
    const message = createErr?.message || "";
    if (message.toLowerCase().includes("already") || message.toLowerCase().includes("registered")) {
      return { error: "Bu e-posta zaten kayıtlı. Giriş yapmayı veya şifre sıfırlamayı deneyin." };
    }
    return { error: "Kayıt sırasında bir hata oluştu. Lütfen tekrar deneyin." };
  }

  const authUserId = userData.user.id;

  // Transaction: Student oluştur + Kodu kullanıldı işaretle
  try {
    await prisma.$transaction(async (tx) => {
      // Kodu tekrar verify et (race condition)
      const fresh = await tx.coachRegistrationCode.findUnique({
        where: { id: codeRow.id },
        select: { usedAt: true, revokedAt: true, expiresAt: true },
      });
      if (!fresh || fresh.usedAt || fresh.revokedAt || (fresh.expiresAt && fresh.expiresAt < new Date())) {
        throw new Error("code_race");
      }

      const student = await tx.student.create({
        data: {
          userId: authUserId,
          email: emailLower,
          name: data.name,
          phone: data.phone || null,
          coachId: coach.id,
          coachPackageId: codeRow.coachPackageId || null,
          status: "active",
        },
        select: { id: true },
      });

      await tx.coachRegistrationCode.update({
        where: { id: codeRow.id },
        data: {
          usedAt: new Date(),
          usedByStudentId: student.id,
        },
      });
    });
  } catch (err) {
    // Rollback: auth kullanıcısını sil
    await admin.auth.admin.deleteUser(authUserId).catch(() => undefined);
    if (err instanceof Error && err.message === "code_race") {
      return { error: "Kod az önce başka biri tarafından kullanıldı. Koçunuzdan yeni bir kod isteyin." };
    }
    return { error: "Hesap oluşturulamadı. Lütfen tekrar deneyin." };
  }

  console.log(JSON.stringify({
    type: "STUDENT_SIGNUP",
    coachId: coach.id,
    codeId: codeRow.id,
    userId: authUserId,
  }));

  return { success: true, email: emailLower };
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
  const redirectTo = `${proto}://${host}/site/${domain}/auth/reset-password`;

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
