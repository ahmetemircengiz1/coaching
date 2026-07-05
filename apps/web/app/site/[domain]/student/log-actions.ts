"use server";

import { z } from "zod";
import prisma from "@coach-os/database";
import { revalidatePath } from "next/cache";
import { getStudentData } from "./actions";

// ─── Input doğrulama şemaları (saldırı yüzeyini daraltır) ───
const idSchema = z.string().min(1).max(40);
const alternativeUsedSchema = z.string().max(120).optional().nullable();

function todayDateOnly() {
  const d = new Date();
  d.setHours(0, 0, 0, 0);
  return d;
}

// ── Öğün completion ───────────────────────────────────────────────────────

export async function toggleMealCompletion(
  domain: string,
  mealId: string,
  alternativeUsed?: string | null
) {
  const idCheck = idSchema.safeParse(mealId);
  if (!idCheck.success) return { success: false, error: "Geçersiz öğün" };
  const altCheck = alternativeUsedSchema.safeParse(alternativeUsed);
  if (!altCheck.success) return { success: false, error: "Geçersiz alternatif" };

  const student = await getStudentData(domain);
  const date = todayDateOnly();

  // Bu öğünün öğrencinin aktif planına ait olduğunu doğrula
  const meal = await prisma.meal.findUnique({
    where: { id: mealId },
    include: {
      nutritionPlan: {
        select: { studentId: true, status: true },
      },
    },
  });

  if (!meal || meal.nutritionPlan.studentId !== student.id || meal.nutritionPlan.status !== "active") {
    return { success: false, error: "Bu öğünü loglayamazsın" };
  }

  const existing = await prisma.mealCompletion.findUnique({
    where: {
      studentId_mealId_date: {
        studentId: student.id,
        mealId,
        date,
      },
    },
  });

  if (existing) {
    if (alternativeUsed && existing.alternativeUsed !== alternativeUsed) {
      await prisma.mealCompletion.update({
        where: { id: existing.id },
        data: { alternativeUsed, completed: true },
      });
      revalidatePath(`/site/${domain}/student/nutrition`);
      return { success: true, completed: true };
    }
    await prisma.mealCompletion.delete({ where: { id: existing.id } });
    revalidatePath(`/site/${domain}/student/nutrition`);
    return { success: true, completed: false };
  }

  await prisma.mealCompletion.create({
    data: {
      studentId: student.id,
      mealId,
      date,
      completed: true,
      alternativeUsed: alternativeUsed || null,
    },
  });
  revalidatePath(`/site/${domain}/student/nutrition`);
  return { success: true, completed: true };
}
