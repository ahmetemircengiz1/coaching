"use server";

import { getCoachAuth } from "../actions";
import prisma from "@coach-os/database";
import { revalidatePath } from "next/cache";
import { PROGRAM_TEMPLATES, type ProgramTemplate } from "@/lib/data/program-templates";

// Program detayını getir
export async function getProgram(domain: string, programId: string) {
  const coach = await getCoachAuth(domain);

  const program = await prisma.program.findUnique({
    where: { id: programId },
    include: {
      workouts: {
        include: {
          exercises: {
            include: { exercise: true },
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
