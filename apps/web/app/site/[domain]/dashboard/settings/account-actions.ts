"use server";

import prisma from "@coach-os/database";
import { headers } from "next/headers";
import { getAuthUser } from "@/lib/supabase/server";
import { checkRateLimitAsync, getClientIp, AUTH_LIMIT } from "@/lib/rate-limit";
import { deleteAuthUsers, deleteStorageForUsers } from "@/lib/account-deletion";

/**
 * Koç üyeliğini kalıcı olarak sonlandırır:
 *  - Coach satırı (cascade ile site içeriği, paketler, programlar, planlar,
 *    öğrenciler ve tüm bağlı veriler)
 *  - Koçun ve öğrencilerinin storage dosyaları
 *  - Koçun ve öğrencilerinin auth hesapları (e-postalar dahil her şey silinir)
 *
 * GERİ ALINAMAZ. confirmText olarak "SİL" istenir (yanlışlıkla tetiklenmesin).
 */
export async function deleteCoachAccount(
  domain: string,
  confirmText: string
): Promise<{ success: true } | { error: string }> {
  const hdrs = await headers();
  const ip = getClientIp(hdrs);
  const rl = await checkRateLimitAsync(`account:delete:${ip}`, AUTH_LIMIT);
  if (!rl.success) {
    return { error: "Çok fazla deneme. Lütfen birkaç dakika bekleyin." };
  }

  if (confirmText.trim().toUpperCase() !== "SİL") {
    return { error: 'Onaylamak için kutuya "SİL" yazmalısın.' };
  }

  const user = await getAuthUser();
  if (!user) {
    return { error: "Oturum doğrulanamadı. Lütfen yeniden giriş yap." };
  }

  const coach = await prisma.coach.findUnique({
    where: { userId: user.id },
    select: { id: true, subdomain: true, customDomain: true, brandName: true },
  });
  if (!coach || (coach.subdomain !== domain && coach.customDomain !== domain)) {
    return { error: "Bu site için yetkin yok." };
  }

  const students = await prisma.student.findMany({
    where: { coachId: coach.id },
    select: { userId: true },
  });
  const studentUserIds = students.map((s) => s.userId);

  console.log(
    JSON.stringify({
      type: "ACCOUNT_DELETE_COACH",
      coachId: coach.id,
      subdomain: coach.subdomain,
      studentCount: studentUserIds.length,
    })
  );

  try {
    // 1) DB — Coach silinince cascade zinciri her şeyi götürür (öğrenciler dahil)
    await prisma.coach.delete({ where: { id: coach.id } });
  } catch (err) {
    console.error("[deleteCoachAccount] DB delete failed:", err);
    return { error: "Üyelik sonlandırılamadı. Lütfen tekrar deneyin." };
  }

  // 2) Storage + 3) Auth — DB gittiği için bu adımlar hata verse bile üyelik
  // fiilen kapanmıştır; hatalar loglanır.
  await deleteStorageForUsers([user.id, ...studentUserIds]);
  await deleteAuthUsers([...studentUserIds, user.id]);

  return { success: true };
}

/**
 * Öğrenci üyeliğini kalıcı olarak sonlandırır: Student satırı (cascade ile
 * check-in'ler, loglar, planlar), storage dosyaları ve auth hesabı.
 */
export async function deleteStudentAccount(
  domain: string,
  confirmText: string
): Promise<{ success: true } | { error: string }> {
  const hdrs = await headers();
  const ip = getClientIp(hdrs);
  const rl = await checkRateLimitAsync(`account:delete:${ip}`, AUTH_LIMIT);
  if (!rl.success) {
    return { error: "Çok fazla deneme. Lütfen birkaç dakika bekleyin." };
  }

  if (confirmText.trim().toUpperCase() !== "SİL") {
    return { error: 'Onaylamak için kutuya "SİL" yazmalısın.' };
  }

  const user = await getAuthUser();
  if (!user) {
    return { error: "Oturum doğrulanamadı. Lütfen yeniden giriş yap." };
  }

  const student = await prisma.student.findFirst({
    where: {
      userId: user.id,
      coach: { OR: [{ subdomain: domain }, { customDomain: domain }] },
    },
    select: { id: true },
  });
  if (!student) {
    return { error: "Bu site için öğrenci kaydın bulunamadı." };
  }

  console.log(
    JSON.stringify({ type: "ACCOUNT_DELETE_STUDENT", studentId: student.id, domain })
  );

  try {
    await prisma.student.delete({ where: { id: student.id } });
  } catch (err) {
    console.error("[deleteStudentAccount] DB delete failed:", err);
    return { error: "Üyelik sonlandırılamadı. Lütfen tekrar deneyin." };
  }

  await deleteStorageForUsers([user.id]);
  await deleteAuthUsers([user.id]);

  return { success: true };
}
