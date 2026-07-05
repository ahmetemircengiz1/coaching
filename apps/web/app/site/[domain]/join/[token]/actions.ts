"use server";

import { headers } from "next/headers";
import { createClient, getAuthUser } from "@/lib/supabase/server";
import prisma from "@coach-os/database";
import { checkRateLimitAsync, getClientIp, AUTH_LIMIT } from "@/lib/rate-limit";
import { claimInviteSchema } from "@/lib/validation/schemas";

function getBaseUrl(hdrs: Headers): string {
  const envUrl = process.env.NEXT_PUBLIC_APP_URL;
  if (envUrl) return envUrl.replace(/\/$/, "");
  const host = hdrs.get("host") || "localhost:3002";
  const proto = hdrs.get("x-forwarded-proto") || (host.startsWith("localhost") ? "http" : "https");
  return `${proto}://${host}`;
}

// ─── Davet linki ile kayıt ol ───
export async function claimStudentInvite(
  domain: string,
  token: string,
  formData: FormData
) {
  const hdrs = await headers();
  const ip = getClientIp(hdrs);
  const rl = await checkRateLimitAsync(`invite:claim:${ip}`, AUTH_LIMIT);
  if (!rl.success) {
    return { error: "Çok fazla deneme. Lütfen birkaç dakika bekleyin." };
  }

  const parsed = claimInviteSchema.safeParse({
    password: formData.get("password"),
    phone: formData.get("phone") || undefined,
  });

  if (!parsed.success) {
    return { error: parsed.error.errors[0]?.message || "Geçersiz veri." };
  }

  // Token'ı ve koçu doğrula
  const now = new Date();
  const invite = await prisma.studentInvite.findUnique({
    where: { token },
    include: {
      coach: { select: { id: true, subdomain: true } },
    },
  });

  if (!invite || invite.coach.subdomain !== domain) {
    return { error: "Bu davet linki geçerli değil." };
  }
  if (invite.claimedAt) {
    return { error: "Bu davet daha önce kullanılmış." };
  }
  if (invite.revokedAt) {
    return { error: "Bu davet iptal edilmiş." };
  }
  if (invite.expiresAt < now) {
    return { error: "Bu davetin süresi dolmuş. Koçunuzdan yeni bir link isteyin." };
  }

  const supabase = await createClient();
  const baseUrl = getBaseUrl(hdrs);
  const emailLower = invite.email.toLowerCase();

  const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
    email: emailLower,
    password: parsed.data.password,
    options: {
      data: {
        name: invite.name,
        role: "student",
        coach_domain: domain,
        invite_token: token,
      },
      emailRedirectTo: `${baseUrl}/site/${domain}/auth/callback?next=/site/${domain}/join/${token}/finalize`,
    },
  });

  if (signUpError) {
    const msg = signUpError.message.toLowerCase();
    if (msg.includes("already") || msg.includes("registered")) {
      return { error: "Bu e-posta zaten kayıtlı. Mevcut şifrenizle giriş yapın veya koçunuza bildirin." };
    }
    console.error("[claimStudentInvite] signUp error:", signUpError.message);
    return { error: "Kayıt sırasında bir hata oluştu. Lütfen tekrar deneyin." };
  }

  // Email confirmation gerekiyor mu?
  const needsConfirmation =
    !signUpData.session ||
    (signUpData.user && !signUpData.user.email_confirmed_at);

  if (needsConfirmation) {
    return { emailSent: true, email: emailLower };
  }

  // Email confirmation kapalıysa — hemen Student oluştur
  const result = await finalizeStudentInvite(domain, token, parsed.data.phone);
  return result;
}

// ─── Email onayı sonrası (veya confirm kapalıysa direkt) çağırılır ───
// Token geçerli + user oturum açmışsa Student satırını oluşturur, daveti claimed işaretler.
export async function finalizeStudentInvite(
  domain: string,
  token: string,
  phone?: string
): Promise<{ success: true; studentId: string } | { error: string }> {
  const user = await getAuthUser();
  if (!user) {
    return { error: "Oturum doğrulanamadı. Lütfen tekrar giriş yapmayı deneyin." };
  }

  const now = new Date();
  const invite = await prisma.studentInvite.findUnique({
    where: { token },
    include: { coach: { select: { id: true, subdomain: true } } },
  });

  if (!invite || invite.coach.subdomain !== domain) {
    return { error: "Bu davet linki geçerli değil." };
  }
  if (invite.claimedAt) {
    // Zaten claim edilmişse kullanıcı zaten student mu?
    const existing = await prisma.student.findUnique({
      where: { userId: user.id },
      select: { id: true, coachId: true },
    });
    if (existing && existing.coachId === invite.coach.id) {
      return { success: true, studentId: existing.id };
    }
    return { error: "Bu davet zaten kullanılmış." };
  }
  if (invite.revokedAt) {
    return { error: "Bu davet iptal edilmiş." };
  }
  if (invite.expiresAt < now) {
    return { error: "Bu davetin süresi dolmuş." };
  }

  // User email'i davet email'i ile eşleşmeli
  if ((user.email || "").toLowerCase() !== invite.email.toLowerCase()) {
    return { error: "Oturum açmış kullanıcı bu davetin e-postasıyla eşleşmiyor." };
  }

  // Bu user zaten bir Student ile mi bağlı?
  const existingStudent = await prisma.student.findUnique({
    where: { userId: user.id },
    select: { id: true, coachId: true },
  });

  if (existingStudent) {
    if (existingStudent.coachId === invite.coach.id) {
      // Aynı koç için zaten var — daveti claimed işaretle
      await prisma.studentInvite.update({
        where: { id: invite.id },
        data: { claimedAt: now, claimedStudentId: existingStudent.id },
      });
      return { success: true, studentId: existingStudent.id };
    }
    return { error: "Bu hesap başka bir koçun öğrencisi olarak kayıtlı." };
  }

  // Transaction: Student oluştur + invite claimed işaretle
  try {
    const student = await prisma.$transaction(async (tx) => {
      const newStudent = await tx.student.create({
        data: {
          userId: user.id,
          email: invite.email,
          name: invite.name,
          phone: phone || null,
          coachId: invite.coach.id,
          coachPackageId: invite.coachPackageId,
          status: "active",
        },
      });

      await tx.studentInvite.update({
        where: { id: invite.id },
        data: { claimedAt: now, claimedStudentId: newStudent.id },
      });

      return newStudent;
    });

    console.log(JSON.stringify({
      type: "INVITE_CLAIMED",
      coachId: invite.coach.id,
      inviteId: invite.id,
      studentId: student.id,
      email: invite.email,
    }));

    return { success: true, studentId: student.id };
  } catch (err) {
    console.error("[finalizeStudentInvite] Unexpected error:", err);
    return { error: "Kayıt tamamlanamadı. Lütfen tekrar deneyin." };
  }
}
