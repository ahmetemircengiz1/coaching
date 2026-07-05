"use server";

import prismaClient from "@coach-os/database";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import { getCoachAuth } from "../actions";
import { createNotification } from "@/lib/notifications";
import { signPhotoUrls } from "@/lib/supabase/signed-url";
import { parseOrError } from "@/lib/validation/schemas";
import type { MealLogWindow, MealLogDay, MealEntryDTO, MealType } from "@/app/site/[domain]/student/nutrition/meal-log-actions";

const prisma = prismaClient;

const coachCommentSchema = z
  .string()
  .max(1000, "Yorum en fazla 1000 karakter olabilir")
  .trim()
  .nullable();

/** Koç bir öğrencisinin son N günlük yemek log'unu okur (read-only).
 *  Ownership doğrulaması: student.coachId === coach.id. */
export async function getStudentMealLogForCoach(
  domain: string,
  studentId: string,
  daysBack: number = 30
): Promise<MealLogWindow> {
  const coach = await getCoachAuth(domain);

  const student = await prismaClient.student.findUnique({
    where: { id: studentId },
    select: { id: true, coachId: true },
  });

  if (!student || student.coachId !== coach.id) {
    return { windowStart: "", windowEnd: "", days: [] };
  }

  const today = new Date();
  today.setUTCHours(0, 0, 0, 0);

  const windowStart = new Date(today);
  windowStart.setUTCDate(windowStart.getUTCDate() - daysBack + 1);

  const rows = await prisma.mealEntry.findMany({
    where: {
      studentId: student.id,
      date: { gte: windowStart, lte: today },
    },
    orderBy: [{ date: "desc" }, { createdAt: "desc" }],
  });

  // Private bucket — foto referanslarını süreli signed URL'e çevir
  const signed = await signPhotoUrls(rows.map((r) => r.photoUrl));

  const byDate = new Map<string, MealEntryDTO[]>();
  for (let i = 0; i < rows.length; i++) {
    const r = rows[i];
    const dateStr = formatIsoDate(r.date);
    const arr = byDate.get(dateStr) || [];
    arr.push({
      id: r.id,
      date: dateStr,
      mealType: r.mealType as MealType,
      photoUrl: signed[i] ?? r.photoUrl,
      note: r.note,
      coachComment: r.coachComment,
      eatenAt: r.eatenAt ? r.eatenAt.toISOString() : null,
      createdAt: r.createdAt.toISOString(),
    });
    byDate.set(dateStr, arr);
  }

  const days: MealLogDay[] = [];
  for (let d = 0; d < daysBack; d++) {
    const dayDate = new Date(today);
    dayDate.setUTCDate(dayDate.getUTCDate() - d);
    const iso = formatIsoDate(dayDate);
    const entries = byDate.get(iso) || [];
    // Sadece dolu günleri koç paneline gösterelim — boş günler gürültü
    if (entries.length > 0) {
      days.push({ date: iso, entries });
    }
  }

  return {
    windowStart: formatIsoDate(windowStart),
    windowEnd: formatIsoDate(today),
    days,
  };
}

function formatIsoDate(d: Date): string {
  const y = d.getUTCFullYear();
  const m = String(d.getUTCMonth() + 1).padStart(2, "0");
  const day = String(d.getUTCDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

const MEAL_TYPE_LABELS_TR: Record<string, string> = {
  breakfast: "kahvaltı",
  lunch: "öğle",
  dinner: "akşam",
  snack: "ara öğün",
};

/** Koç bir öğün foto'suna yorum ekler/güncelliyor. Boş string → silme. */
export async function addMealComment(
  domain: string,
  entryId: string,
  comment: string | null
): Promise<{ success: boolean; error?: string }> {
  const result = parseOrError(coachCommentSchema, comment);
  if ("error" in result) return { success: false, error: result.error };

  const coach = await getCoachAuth(domain);
  const cleanComment = result.data && result.data.trim().length > 0 ? result.data.trim() : null;

  // Ownership: entry'nin öğrencisi bu koça mı ait?
  const entry = await prisma.mealEntry.findUnique({
    where: { id: entryId },
    include: { student: { select: { id: true, userId: true, name: true, coachId: true } } },
  });

  if (!entry || entry.student.coachId !== coach.id) {
    return { success: false, error: "Yetkisiz" };
  }

  const previousComment = entry.coachComment;

  await prisma.mealEntry.update({
    where: { id: entryId },
    data: { coachComment: cleanComment },
  });

  // Yeni yorum eklendi (öncesi boş, şimdi dolu) → öğrenciye bildir
  if (cleanComment && !previousComment) {
    const mealLabel = MEAL_TYPE_LABELS_TR[entry.mealType] || "öğün";
    await createNotification({
      recipientId: entry.student.userId,
      type: "feedback",
      title: "Koçundan yeni yorum",
      message: `${mealLabel} fotoğrafına bir yorum bıraktı: "${truncate(cleanComment, 80)}"`,
      link: `/site/${domain}/student/nutrition/log`,
    });
  }

  revalidatePath(`/site/${domain}/dashboard/students/${entry.student.id}`);

  return { success: true };
}

function truncate(s: string, n: number): string {
  if (s.length <= n) return s;
  return s.slice(0, n - 1) + "…";
}
