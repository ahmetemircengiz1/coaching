"use server";

import { getCoachAuth } from "../actions";
import prisma from "@coach-os/database";
import { revalidatePath } from "next/cache";

// Egzersiz listesi (koçun kendi + sistem egzersizleri)
export async function getExercises(domain: string) {
  const coach = await getCoachAuth(domain);

  const exercises = await prisma.exercise.findMany({
    where: {
      OR: [{ coachId: coach.id }, { isSystem: true }],
    },
    orderBy: [{ category: "asc" }, { name: "asc" }],
    include: {
      _count: { select: { workoutExercises: true } },
    },
  });

  return exercises;
}

// Egzersiz oluştur
export async function createExercise(
  domain: string,
  data: {
    name: string;
    category: string;
    description?: string;
    videoUrl?: string;
    imageUrl?: string;
  }
) {
  const coach = await getCoachAuth(domain);

  const exercise = await prisma.exercise.create({
    data: {
      coachId: coach.id,
      name: data.name,
      category: data.category,
      description: data.description || null,
      videoUrl: data.videoUrl || null,
      imageUrl: data.imageUrl || null,
      isSystem: false,
    },
  });

  revalidatePath(`/site/${domain}/dashboard`);
  return { success: true, exercise };
}

// Egzersiz güncelle (sadece koçun kendi egzersizleri)
export async function updateExercise(
  domain: string,
  exerciseId: string,
  data: {
    name: string;
    category: string;
    description?: string;
    videoUrl?: string;
    imageUrl?: string;
  }
) {
  const coach = await getCoachAuth(domain);

  const exercise = await prisma.exercise.findUnique({
    where: { id: exerciseId },
  });

  if (!exercise || exercise.coachId !== coach.id) {
    return { success: false, error: "Bu egzersizi düzenleme yetkiniz yok" };
  }

  if (exercise.isSystem) {
    return { success: false, error: "Sistem egzersizleri düzenlenemez" };
  }

  const updated = await prisma.exercise.update({
    where: { id: exerciseId },
    data: {
      name: data.name,
      category: data.category,
      description: data.description || null,
      videoUrl: data.videoUrl || null,
      imageUrl: data.imageUrl || null,
    },
  });

  revalidatePath(`/site/${domain}/dashboard`);
  return { success: true, exercise: updated };
}

// Egzersiz sil (sadece koçun kendi egzersizleri)
export async function deleteExercise(domain: string, exerciseId: string) {
  const coach = await getCoachAuth(domain);

  const exercise = await prisma.exercise.findUnique({
    where: { id: exerciseId },
    include: { _count: { select: { workoutExercises: true } } },
  });

  if (!exercise || exercise.coachId !== coach.id) {
    return { success: false, error: "Bu egzersizi silme yetkiniz yok" };
  }

  if (exercise.isSystem) {
    return { success: false, error: "Sistem egzersizleri silinemez" };
  }

  if (exercise._count.workoutExercises > 0) {
    return {
      success: false,
      error: `Bu egzersiz ${exercise._count.workoutExercises} antrenmanda kullanılıyor. Önce antrenmanlardan kaldırın.`,
    };
  }

  await prisma.exercise.delete({ where: { id: exerciseId } });

  revalidatePath(`/site/${domain}/dashboard`);
  return { success: true };
}

// Kategorileri getir (sistem + koç kategorileri)
export async function getExerciseCategories(domain: string) {
  const coach = await getCoachAuth(domain);

  const categories = await prisma.exercise.findMany({
    where: {
      OR: [{ coachId: coach.id }, { isSystem: true }],
    },
    select: { category: true },
    distinct: ["category"],
    orderBy: { category: "asc" },
  });

  return categories.map((c) => c.category);
}
