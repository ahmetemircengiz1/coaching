"use server";

import prismaClient from "@coach-os/database";
import { revalidatePath } from "next/cache";
import { getStudentData } from "../actions";
import { createNotification } from "@/lib/notifications";
import { getActivityFeatures } from "@/src/lib/plan";
import { signPhotoUrls } from "@/lib/supabase/signed-url";
import {
  mealEntryCreateSchema,
  mealEntryUpdateSchema,
  parseOrError,
} from "@/lib/validation/schemas";
import { z } from "zod";

export type MealType = "breakfast" | "lunch" | "dinner" | "snack";

export interface MealEntryDTO {
  id: string;
  date: string;        // YYYY-MM-DD
  mealType: MealType;
  photoUrl: string;
  note: string | null;
  coachComment: string | null;
  eatenAt: string | null; // ISO datetime
  createdAt: string;
}

export interface MealLogDay {
  date: string; // YYYY-MM-DD
  entries: MealEntryDTO[];
}

export interface MealLogWindow {
  windowStart: string;
  windowEnd: string;
  days: MealLogDay[];
}

const prisma = prismaClient;

type MealEntryRecord = {
  id: string;
  date: Date;
  mealType: string;
  photoUrl: string;
  note: string | null;
  coachComment: string | null;
  eatenAt: Date | null;
  createdAt: Date;
};

function rowToDto(r: MealEntryRecord, photoUrl: string): MealEntryDTO {
  return {
    id: r.id,
    date: formatIsoDate(r.date),
    mealType: r.mealType as MealType,
    photoUrl,
    note: r.note,
    coachComment: r.coachComment,
    eatenAt: r.eatenAt ? r.eatenAt.toISOString() : null,
    createdAt: r.createdAt.toISOString(),
  };
}

export async function addMealEntry(
  domain: string,
  input: {
    date: string;
    mealType: MealType;
    photoUrl: string;
    note?: string | null;
    eatenAt?: string | null;
  }
): Promise<{ success: boolean; entryId?: string; error?: string }> {
  const result = parseOrError(mealEntryCreateSchema, input);
  if ("error" in result) return { success: false, error: result.error };

  const student = await getStudentData(domain);
  const data = result.data;
  const dateObj = new Date(`${data.date}T00:00:00.000Z`);

  // Bu gün için bu öğrenciye ait önceden bir entry var mı? — bildirimi 1 kez at
  const existingTodayCount = await prisma.mealEntry.count({
    where: { studentId: student.id, date: dateObj },
  });

  // Plan-tabanlı günlük limit kontrolü
  const coachRecord = await prismaClient.coach.findUnique({
    where: { id: student.coachId },
    select: { package: { select: { tier: true } } },
  });
  const planFeatures = getActivityFeatures(coachRecord?.package?.tier ?? 1);
  if (existingTodayCount >= planFeatures.maxMealEntriesPerDay) {
    return {
      success: false,
      error: `Günlük öğün yükleme limitine ulaştın (${planFeatures.maxMealEntriesPerDay}/gün). Yarın devam edebilirsin.`,
    };
  }

  const created = await prisma.mealEntry.create({
    data: {
      studentId: student.id,
      date: dateObj,
      mealType: data.mealType,
      photoUrl: data.photoUrl,
      note: data.note?.trim() || null,
      eatenAt: data.eatenAt ? new Date(data.eatenAt) : null,
    },
  });

  // İlk öğün ise koça bildir (günde 1 kez)
  if (existingTodayCount === 0) {
    try {
      const coach = await prismaClient.coach.findUnique({
        where: { id: student.coachId },
        select: { userId: true, subdomain: true },
      });
      if (coach?.userId) {
        await createNotification({
          recipientId: coach.userId,
          type: "feedback",
          title: "Yeni yemek paylaşımı",
          message: `${student.name} bugün yemek paylaşmaya başladı.`,
          link: `/site/${coach.subdomain}/dashboard/students/${student.id}`,
        });
      }
    } catch (err) {
      // Bildirim hatası ana akışı durdurmasın
      console.error("[meal-log] notification failed:", err);
    }
  }

  revalidatePath(`/site/${domain}/student`);
  revalidatePath(`/site/${domain}/student/nutrition/log`);

  return { success: true, entryId: created.id };
}

export async function updateMealEntry(
  domain: string,
  entryId: string,
  input: { note?: string | null; photoUrl?: string }
): Promise<{ success: boolean; error?: string }> {
  const idResult = parseOrError(z.string().min(1).max(50), entryId);
  if ("error" in idResult) return { success: false, error: idResult.error };

  const result = parseOrError(mealEntryUpdateSchema, input);
  if ("error" in result) return { success: false, error: result.error };

  const student = await getStudentData(domain);

  // Ownership check
  const existing = await prisma.mealEntry.findUnique({
    where: { id: entryId },
    select: { id: true, studentId: true },
  });
  if (!existing || existing.studentId !== student.id) {
    return { success: false, error: "Yetkisiz" };
  }

  await prisma.mealEntry.update({
    where: { id: entryId },
    data: {
      ...(input.note !== undefined && { note: input.note?.trim() || null }),
      ...(input.photoUrl !== undefined && { photoUrl: input.photoUrl }),
    },
  });

  revalidatePath(`/site/${domain}/student`);
  revalidatePath(`/site/${domain}/student/nutrition/log`);

  return { success: true };
}

export async function deleteMealEntry(
  domain: string,
  entryId: string
): Promise<{ success: boolean; error?: string }> {
  const student = await getStudentData(domain);

  const existing = await prisma.mealEntry.findUnique({
    where: { id: entryId },
    select: { id: true, studentId: true },
  });
  if (!existing || existing.studentId !== student.id) {
    return { success: false, error: "Yetkisiz" };
  }

  await prisma.mealEntry.delete({ where: { id: entryId } });

  revalidatePath(`/site/${domain}/student`);
  revalidatePath(`/site/${domain}/student/nutrition/log`);

  return { success: true };
}

export async function getStudentMealLog(
  domain: string,
  daysBack: number = 30
): Promise<MealLogWindow> {
  const student = await getStudentData(domain);

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

  // Tarih bazlı grupla
  const byDate = new Map<string, MealEntryDTO[]>();
  for (let i = 0; i < rows.length; i++) {
    const r = rows[i];
    const dateStr = formatIsoDate(r.date);
    const arr = byDate.get(dateStr) || [];
    arr.push(rowToDto(r, signed[i] ?? r.photoUrl));
    byDate.set(dateStr, arr);
  }

  // Boş günleri de ekle (en yeniden eskiye)
  const days: MealLogDay[] = [];
  for (let d = 0; d < daysBack; d++) {
    const dayDate = new Date(today);
    dayDate.setUTCDate(dayDate.getUTCDate() - d);
    const iso = formatIsoDate(dayDate);
    days.push({ date: iso, entries: byDate.get(iso) || [] });
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
