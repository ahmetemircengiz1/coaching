"use server";

import { getCoachAuth } from "../actions";
import prisma from "@coach-os/database";
import { revalidatePath } from "next/cache";
import { PROGRAM_TEMPLATES, type ProgramTemplate } from "@/lib/data/program-templates";
import { createProgramSchema, addWorkoutSchema, addExerciseToWorkoutSchema, updateWorkoutExerciseSchema } from "@/lib/validation/schemas";

// Program detayını getir
export async function getProgram(domain: string, programId: string) {
  const coach = await getCoachAuth(domain);

  const program = await prisma.program.findUnique({
    where: { id: programId },
    include: {
      workouts: {
        include: {
          exercises: {
            include: {
              exercise: true,
              alternatives: {
                include: {
                  alternativeExercise: { select: { id: true, name: true, category: true } },
                },
                orderBy: { orderIndex: "asc" },
              },
            },
            orderBy: { orderIndex: "asc" },
          },
        },
        orderBy: [{ weekNumber: "asc" }, { dayOfWeek: "asc" }],
      },
      _count: { select: { trainingPlans: true } },
    },
  });

  if (!program || program.coachId !== coach.id) {
    return null;
  }

  return program;
}

// Program oluştur
export async function createProgram(
  domain: string,
  data: { name: string; description?: string; weeks: number }
) {
  const parsed = createProgramSchema.safeParse(data);
  if (!parsed.success) return { success: false, error: parsed.error.errors[0]?.message || "Geçersiz veri" };

  const coach = await getCoachAuth(domain);

  const program = await prisma.program.create({
    data: {
      coachId: coach.id,
      name: data.name,
      description: data.description || null,
      weeks: data.weeks,
      isTemplate: true,
    },
  });

  revalidatePath(`/site/${domain}/dashboard`);
  return { success: true, programId: program.id };
}

// Program güncelle
export async function updateProgram(
  domain: string,
  programId: string,
  data: { name: string; description?: string; weeks: number }
) {
  const parsed = createProgramSchema.safeParse(data);
  if (!parsed.success) return { success: false, error: parsed.error.errors[0]?.message || "Geçersiz veri" };

  const coach = await getCoachAuth(domain);

  const program = await prisma.program.findUnique({
    where: { id: programId },
  });

  if (!program || program.coachId !== coach.id) {
    return { success: false, error: "Program bulunamadı" };
  }

  await prisma.program.update({
    where: { id: programId },
    data: {
      name: data.name,
      description: data.description || null,
      weeks: data.weeks,
    },
  });

  revalidatePath(`/site/${domain}/dashboard`);
  return { success: true };
}

// Program sil
export async function deleteProgram(domain: string, programId: string) {
  const coach = await getCoachAuth(domain);

  const program = await prisma.program.findUnique({
    where: { id: programId },
    include: { _count: { select: { trainingPlans: true } } },
  });

  if (!program || program.coachId !== coach.id) {
    return { success: false, error: "Program bulunamadı" };
  }

  if (program._count.trainingPlans > 0) {
    return {
      success: false,
      error: `Bu program ${program._count.trainingPlans} öğrenciye atanmış. Önce atamaları kaldırın.`,
    };
  }

  // Workout'ları ve exercise bağlantılarını da sil (cascade)
  await prisma.program.delete({ where: { id: programId } });

  revalidatePath(`/site/${domain}/dashboard`);
  return { success: true };
}

// Workout (antrenman günü) ekle
export async function addWorkout(
  domain: string,
  programId: string,
  data: { weekNumber: number; dayOfWeek: number; name: string }
) {
  const parsed = addWorkoutSchema.safeParse(data);
  if (!parsed.success) return { success: false, error: parsed.error.errors[0]?.message || "Geçersiz veri" };

  const coach = await getCoachAuth(domain);

  const program = await prisma.program.findUnique({
    where: { id: programId },
  });

  if (!program || program.coachId !== coach.id) {
    return { success: false, error: "Program bulunamadı" };
  }

  const workout = await prisma.programWorkout.create({
    data: {
      programId,
      weekNumber: data.weekNumber,
      dayOfWeek: data.dayOfWeek,
      name: data.name,
    },
  });

  revalidatePath(`/site/${domain}/dashboard`);
  return { success: true, workoutId: workout.id };
}

// Workout sil
export async function deleteWorkout(domain: string, workoutId: string) {
  const coach = await getCoachAuth(domain);

  const workout = await prisma.programWorkout.findUnique({
    where: { id: workoutId },
    include: { program: true },
  });

  if (!workout || workout.program.coachId !== coach.id) {
    return { success: false, error: "Antrenman bulunamadı" };
  }

  await prisma.programWorkout.delete({ where: { id: workoutId } });

  revalidatePath(`/site/${domain}/dashboard`);
  return { success: true };
}

// Workout'a egzersiz ekle
export async function addExerciseToWorkout(
  domain: string,
  workoutId: string,
  data: {
    exerciseId: string;
    sets: number;
    reps: string;
    restSeconds?: number;
    notes?: string;
  }
) {
  const parsed = addExerciseToWorkoutSchema.safeParse(data);
  if (!parsed.success) return { success: false, error: parsed.error.errors[0]?.message || "Geçersiz veri" };

  const coach = await getCoachAuth(domain);

  const workout = await prisma.programWorkout.findUnique({
    where: { id: workoutId },
    include: { program: true },
  });

  if (!workout || workout.program.coachId !== coach.id) {
    return { success: false, error: "Antrenman bulunamadı" };
  }

  // Sıralama indexi
  const lastExercise = await prisma.workoutExercise.findFirst({
    where: { workoutId },
    orderBy: { orderIndex: "desc" },
  });

  const orderIndex = (lastExercise?.orderIndex || 0) + 1;

  await prisma.workoutExercise.create({
    data: {
      workoutId,
      exerciseId: data.exerciseId,
      sets: data.sets,
      reps: data.reps,
      restSeconds: data.restSeconds || 60,
      orderIndex,
      notes: data.notes || null,
    },
  });

  revalidatePath(`/site/${domain}/dashboard`);
  return { success: true };
}

// Workout'tan egzersiz kaldır
export async function removeExerciseFromWorkout(
  domain: string,
  workoutExerciseId: string
) {
  const coach = await getCoachAuth(domain);

  const we = await prisma.workoutExercise.findUnique({
    where: { id: workoutExerciseId },
    include: { workout: { include: { program: true } } },
  });

  if (!we || we.workout.program.coachId !== coach.id) {
    return { success: false, error: "Egzersiz bulunamadı" };
  }

  await prisma.workoutExercise.delete({ where: { id: workoutExerciseId } });

  revalidatePath(`/site/${domain}/dashboard`);
  return { success: true };
}

// Workout egzersiz güncelle (set/tekrar/dinlenme)
export async function updateWorkoutExercise(
  domain: string,
  workoutExerciseId: string,
  data: { sets: number; reps: string; restSeconds?: number; notes?: string }
) {
  const parsed = updateWorkoutExerciseSchema.safeParse(data);
  if (!parsed.success) return { success: false, error: parsed.error.errors[0]?.message || "Geçersiz veri" };

  const coach = await getCoachAuth(domain);

  const we = await prisma.workoutExercise.findUnique({
    where: { id: workoutExerciseId },
    include: { workout: { include: { program: true } } },
  });

  if (!we || we.workout.program.coachId !== coach.id) {
    return { success: false, error: "Egzersiz bulunamadı" };
  }

  await prisma.workoutExercise.update({
    where: { id: workoutExerciseId },
    data: {
      sets: data.sets,
      reps: data.reps,
      restSeconds: data.restSeconds ?? we.restSeconds,
      notes: data.notes ?? we.notes,
    },
  });

  revalidatePath(`/site/${domain}/dashboard`);
  return { success: true };
}

// Egzersiz sırasını değiştir
export async function reorderWorkoutExercise(
  domain: string,
  workoutExerciseId: string,
  direction: "up" | "down"
) {
  const coach = await getCoachAuth(domain);

  const we = await prisma.workoutExercise.findUnique({
    where: { id: workoutExerciseId },
    include: { workout: { include: { program: true, exercises: { orderBy: { orderIndex: "asc" } } } } },
  });

  if (!we || we.workout.program.coachId !== coach.id) {
    return { success: false, error: "Egzersiz bulunamadı" };
  }

  const exercises = we.workout.exercises;
  const currentIndex = exercises.findIndex((e) => e.id === workoutExerciseId);
  const targetIndex = direction === "up" ? currentIndex - 1 : currentIndex + 1;

  if (targetIndex < 0 || targetIndex >= exercises.length) {
    return { success: false, error: "Taşınamaz" };
  }

  const current = exercises[currentIndex];
  const target = exercises[targetIndex];

  await prisma.$transaction([
    prisma.workoutExercise.update({
      where: { id: current.id },
      data: { orderIndex: target.orderIndex },
    }),
    prisma.workoutExercise.update({
      where: { id: target.id },
      data: { orderIndex: current.orderIndex },
    }),
  ]);

  revalidatePath(`/site/${domain}/dashboard`);
  return { success: true };
}

// Program kopyala
export async function duplicateProgram(domain: string, programId: string) {
  const coach = await getCoachAuth(domain);

  const program = await prisma.program.findUnique({
    where: { id: programId },
    include: {
      workouts: {
        include: {
          exercises: { orderBy: { orderIndex: "asc" } },
        },
      },
    },
  });

  if (!program || program.coachId !== coach.id) {
    return { success: false, error: "Program bulunamadı" };
  }

  const newProgram = await prisma.program.create({
    data: {
      coachId: coach.id,
      name: `${program.name} (Kopya)`,
      description: program.description,
      weeks: program.weeks,
      isTemplate: true,
    },
  });

  for (const workout of program.workouts) {
    const newWorkout = await prisma.programWorkout.create({
      data: {
        programId: newProgram.id,
        weekNumber: workout.weekNumber,
        dayOfWeek: workout.dayOfWeek,
        name: workout.name,
      },
    });

    for (const ex of workout.exercises) {
      await prisma.workoutExercise.create({
        data: {
          workoutId: newWorkout.id,
          exerciseId: ex.exerciseId,
          sets: ex.sets,
          reps: ex.reps,
          restSeconds: ex.restSeconds,
          orderIndex: ex.orderIndex,
          notes: ex.notes,
        },
      });
    }
  }

  revalidatePath(`/site/${domain}/dashboard`);
  return { success: true, programId: newProgram.id };
}

// Bir haftadaki tüm workout'ları (ve egzersizleri) hedef haftalara kopyala
// Hedef haftada aynı gün için workout varsa atla (üzerine yazmaz).
export async function cloneWeekTo(
  domain: string,
  programId: string,
  fromWeek: number,
  toWeeks: number[]
) {
  const coach = await getCoachAuth(domain);

  const program = await prisma.program.findUnique({
    where: { id: programId },
    include: {
      workouts: {
        include: {
          exercises: { orderBy: { orderIndex: "asc" } },
        },
      },
    },
  });

  if (!program || program.coachId !== coach.id) {
    return { success: false, error: "Program bulunamadı" };
  }

  const targets = toWeeks
    .filter((w) => w !== fromWeek && w >= 1 && w <= program.weeks);

  if (targets.length === 0) {
    return { success: false, error: "Hedef hafta seçilmedi" };
  }

  const sourceWorkouts = program.workouts.filter((w) => w.weekNumber === fromWeek);
  if (sourceWorkouts.length === 0) {
    return { success: false, error: "Kaynak hafta boş" };
  }

  let copiedCount = 0;
  let skippedCount = 0;

  for (const targetWeek of targets) {
    const existingDays = new Set(
      program.workouts
        .filter((w) => w.weekNumber === targetWeek)
        .map((w) => w.dayOfWeek)
    );

    for (const sw of sourceWorkouts) {
      if (existingDays.has(sw.dayOfWeek)) {
        skippedCount++;
        continue;
      }

      const newWorkout = await prisma.programWorkout.create({
        data: {
          programId,
          weekNumber: targetWeek,
          dayOfWeek: sw.dayOfWeek,
          name: sw.name,
        },
      });

      for (const ex of sw.exercises) {
        await prisma.workoutExercise.create({
          data: {
            workoutId: newWorkout.id,
            exerciseId: ex.exerciseId,
            sets: ex.sets,
            reps: ex.reps,
            restSeconds: ex.restSeconds,
            orderIndex: ex.orderIndex,
            notes: ex.notes,
          },
        });
      }
      copiedCount++;
    }
  }

  revalidatePath(`/site/${domain}/dashboard/programs/${programId}`);
  return {
    success: true,
    copiedCount,
    skippedCount,
    targetCount: targets.length,
  };
}

// Bir egzersizin alternatiflerini topluca güncelle (replace-all).
// alternativeExerciseIds[] = yeni alternatif listesi (sırayla).
export async function setExerciseAlternatives(
  domain: string,
  workoutExerciseId: string,
  alternativeExerciseIds: string[]
) {
  const coach = await getCoachAuth(domain);

  const we = await prisma.workoutExercise.findUnique({
    where: { id: workoutExerciseId },
    include: { workout: { include: { program: true } } },
  });

  if (!we || we.workout.program.coachId !== coach.id) {
    return { success: false, error: "Egzersiz bulunamadı" };
  }

  // Geçerli alternatif id'leri (kendi olmamalı)
  const validIds = alternativeExerciseIds.filter((id) => id !== we.exerciseId);

  // Var olan tüm alternatifleri sil, yenilerini ekle (tek transaction)
  await prisma.$transaction([
    prisma.workoutExerciseAlternative.deleteMany({
      where: { workoutExerciseId },
    }),
    ...(validIds.length > 0
      ? [
          prisma.workoutExerciseAlternative.createMany({
            data: validIds.map((alternativeExerciseId, idx) => ({
              workoutExerciseId,
              alternativeExerciseId,
              orderIndex: idx,
            })),
            skipDuplicates: true,
          }),
        ]
      : []),
  ]);

  revalidatePath(`/site/${domain}/dashboard/programs/${we.workout.programId}`);
  return { success: true };
}

// Koçun mevcut programlarını listele (wizard'da kopyalamak için)
export async function getCoachProgramsList(domain: string) {
  const coach = await getCoachAuth(domain);

  const programs = await prisma.program.findMany({
    where: { coachId: coach.id },
    select: {
      id: true,
      name: true,
      description: true,
      weeks: true,
      _count: { select: { workouts: true } },
    },
    orderBy: { createdAt: "desc" },
  });

  return programs.map((p) => ({
    id: p.id,
    name: p.name,
    description: p.description,
    weeks: p.weeks,
    workoutCount: p._count.workouts,
  }));
}

// Hazır şablon programı koçun kütüphanesine aktar
export async function importTemplateProgram(domain: string, templateId: string) {
  const coach = await getCoachAuth(domain);

  const template = PROGRAM_TEMPLATES.find((t) => t.id === templateId);
  if (!template) {
    return { success: false, error: "Şablon bulunamadı" };
  }

  // Sistem egzersizlerini isimleriyle bul (tüm egzersiz adlarını topla)
  const allExerciseNames = new Set<string>();
  for (const week of template.template) {
    for (const workout of week.workouts) {
      for (const ex of workout.exercises) {
        allExerciseNames.add(ex.exerciseName);
      }
    }
  }

  // Egzersizleri DB'den çek (sistem + koçun kendi egzersizleri)
  const exercises = await prisma.exercise.findMany({
    where: {
      name: { in: [...allExerciseNames] },
      OR: [{ isSystem: true }, { coachId: coach.id }],
    },
  });

  const exerciseMap = new Map(exercises.map((e) => [e.name, e.id]));

  // Programı oluştur
  const program = await prisma.program.create({
    data: {
      coachId: coach.id,
      name: template.name,
      description: template.description,
      weeks: template.weeks,
      isTemplate: true,
    },
  });

  // Her hafta + gün + egzersiz
  for (const week of template.template) {
    for (const workout of week.workouts) {
      const createdWorkout = await prisma.programWorkout.create({
        data: {
          programId: program.id,
          weekNumber: week.weekNumber,
          dayOfWeek: workout.dayOfWeek,
          name: workout.name,
        },
      });

      // Egzersizleri ekle
      for (let i = 0; i < workout.exercises.length; i++) {
        const ex = workout.exercises[i];
        const exerciseId = exerciseMap.get(ex.exerciseName);

        if (exerciseId) {
          await prisma.workoutExercise.create({
            data: {
              workoutId: createdWorkout.id,
              exerciseId,
              sets: ex.sets,
              reps: ex.reps,
              restSeconds: ex.restSeconds,
              orderIndex: i + 1,
            },
          });
        }
      }
    }
  }

  revalidatePath(`/site/${domain}/dashboard`);
  return { success: true, programId: program.id };
}

// ── Dosyadan program içe aktarma ──

export interface ImportProgramData {
  name: string;
  description?: string;
  weeks: number;
  workouts: {
    weekNumber: number;
    dayOfWeek: number;
    name: string;
    exercises: {
      name: string;
      sets: number;
      reps: string;
      restSeconds?: number;
      notes?: string;
    }[];
  }[];
}

export async function importProgramFromFile(domain: string, raw: string) {
  const coach = await getCoachAuth(domain);

  let data: ImportProgramData;
  try {
    data = JSON.parse(raw);
  } catch {
    return { success: false, error: "Gecersiz JSON formati. Dosyanizi kontrol edin." };
  }

  if (!data.name || typeof data.name !== "string") {
    return { success: false, error: "Program adi (name) zorunludur." };
  }
  if (!data.weeks || typeof data.weeks !== "number" || data.weeks < 1 || data.weeks > 52) {
    return { success: false, error: "Hafta sayisi (weeks) 1-52 arasi olmalidir." };
  }
  if (!Array.isArray(data.workouts) || data.workouts.length === 0) {
    return { success: false, error: "En az bir antrenman (workouts) gereklidir." };
  }

  for (const w of data.workouts) {
    if (!w.name || typeof w.weekNumber !== "number" || typeof w.dayOfWeek !== "number") {
      return { success: false, error: "Antrenman formati hatali: weekNumber, dayOfWeek ve name zorunludur." };
    }
    if (w.dayOfWeek < 1 || w.dayOfWeek > 7) {
      return { success: false, error: "dayOfWeek 1-7 arasi olmalidir (1=Pazartesi)." };
    }
    if (!Array.isArray(w.exercises)) {
      return { success: false, error: `"${w.name}" icin exercises dizisi gereklidir.` };
    }
    for (const ex of w.exercises) {
      if (!ex.name || typeof ex.sets !== "number" || !ex.reps) {
        return { success: false, error: "Egzersiz formati hatali: name, sets ve reps zorunludur." };
      }
    }
  }

  // Collect exercise names and find/create them
  const allNames = new Set<string>();
  for (const w of data.workouts) {
    for (const ex of w.exercises) {
      allNames.add(ex.name.trim());
    }
  }

  const existingExercises = await prisma.exercise.findMany({
    where: {
      name: { in: [...allNames] },
      OR: [{ isSystem: true }, { coachId: coach.id }],
    },
  });
  const exerciseMap = new Map(existingExercises.map((e) => [e.name, e.id]));

  for (const eName of allNames) {
    if (!exerciseMap.has(eName)) {
      const created = await prisma.exercise.create({
        data: { coachId: coach.id, name: eName, isSystem: false, category: "other" },
      });
      exerciseMap.set(eName, created.id);
    }
  }

  const program = await prisma.program.create({
    data: {
      coachId: coach.id,
      name: data.name.trim().slice(0, 200),
      description: data.description?.trim().slice(0, 500) || null,
      weeks: data.weeks,
      isTemplate: true,
    },
  });

  for (const w of data.workouts) {
    const workout = await prisma.programWorkout.create({
      data: {
        programId: program.id,
        weekNumber: w.weekNumber,
        dayOfWeek: w.dayOfWeek,
        name: w.name.trim().slice(0, 200),
      },
    });

    for (let i = 0; i < w.exercises.length; i++) {
      const ex = w.exercises[i];
      const exerciseId = exerciseMap.get(ex.name.trim());
      if (exerciseId) {
        await prisma.workoutExercise.create({
          data: {
            workoutId: workout.id,
            exerciseId,
            sets: ex.sets,
            reps: String(ex.reps),
            restSeconds: ex.restSeconds || 60,
            notes: ex.notes?.trim().slice(0, 200) || null,
            orderIndex: i + 1,
          },
        });
      }
    }
  }

  revalidatePath(`/site/${domain}/dashboard/programs`);
  return { success: true, programId: program.id };
}
