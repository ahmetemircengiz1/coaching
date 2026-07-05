"use server";

import { z } from "zod";
import { getCoachAuth } from "../actions";
import prisma from "@coach-os/database";
import { createNotification } from "@/lib/notifications";
import { revalidatePath } from "next/cache";

// ─── Girdi doğrulama (saldırı yüzeyini daraltır + depolama suistimalini önler) ───
const feedbackSchema = z.string().max(5000);
const notesSchema = z.string().max(10000);
const measurementsSchema = z.object({
  weight: z.number().min(0).max(500).nullable().optional(),
  bodyFat: z.number().min(0).max(100).nullable().optional(),
  chest: z.number().min(0).max(300).nullable().optional(),
  waist: z.number().min(0).max(300).nullable().optional(),
  hips: z.number().min(0).max(300).nullable().optional(),
  arms: z.number().min(0).max(200).nullable().optional(),
  thighs: z.number().min(0).max(200).nullable().optional(),
});

// Öğrenciye program ata
export async function assignProgramToStudent(
  domain: string,
  studentId: string,
  programId: string
) {
  const coach = await getCoachAuth(domain);

  const student = await prisma.student.findUnique({ where: { id: studentId } });
  const program = await prisma.program.findUnique({ where: { id: programId } });

  if (!student || student.coachId !== coach.id) {
    return { success: false, error: "Öğrenci bulunamadı" };
  }
  if (!program || program.coachId !== coach.id) {
    return { success: false, error: "Program bulunamadı" };
  }

  // Mevcut aktif planı pasife al
  await prisma.trainingPlan.updateMany({
    where: { studentId, status: "active" },
    data: { status: "completed" },
  });

  await prisma.trainingPlan.create({
    data: {
      studentId,
      programId,
      name: program.name,
      status: "active",
      startDate: new Date(),
    },
  });

  // Öğrenciye bildirim
  await createNotification({
    recipientId: student.userId,
    type: "program_assigned",
    title: "Yeni Antrenman Programı",
    message: `Koçun sana "${program.name}" programını atadı.`,
    link: `/site/${domain}/student/training`,
  });

  revalidatePath(`/site/${domain}/dashboard/students/${studentId}`);
  return { success: true };
}

// Öğrenciye kütüphaneden beslenme planı ata (deep clone)
export async function assignNutritionPlanToStudent(
  domain: string,
  studentId: string,
  nutritionPlanId: string
) {
  const coach = await getCoachAuth(domain);

  // Öğrenci doğrula
  const student = await prisma.student.findUnique({ where: { id: studentId } });
  if (!student || student.coachId !== coach.id) {
    return { success: false, error: "Öğrenci bulunamadı" };
  }

  // Kaynak plan + öğünler
  const sourcePlan = await prisma.nutritionPlan.findUnique({
    where: { id: nutritionPlanId },
    include: { meals: { orderBy: { orderIndex: "asc" } } },
  });

  if (!sourcePlan || sourcePlan.coachId !== coach.id) {
    return { success: false, error: "Plan bulunamadı" };
  }

  // Mevcut aktif beslenme planlarını "completed" yap
  await prisma.nutritionPlan.updateMany({
    where: { studentId, status: "active" },
    data: { status: "completed" },
  });

  // Deep clone: plan + tüm öğünler
  await prisma.nutritionPlan.create({
    data: {
      coachId: coach.id,
      studentId,
      sourceNutritionPlanId: nutritionPlanId,
      name: sourcePlan.name,
      status: "active",
      startDate: new Date(),
      targetCalories: sourcePlan.targetCalories,
      targetProtein: sourcePlan.targetProtein,
      targetCarbs: sourcePlan.targetCarbs,
      targetFat: sourcePlan.targetFat,
      coachNotes: sourcePlan.coachNotes,
      supplements: sourcePlan.supplements ?? undefined,
      meals: {
        create: sourcePlan.meals.map((m) => ({
          name: m.name,
          time: m.time,
          foods: m.foods as object,
          orderIndex: m.orderIndex,
        })),
      },
    },
  });

  // Öğrenciye bildirim
  await createNotification({
    recipientId: student.userId,
    type: "nutrition_assigned",
    title: "Yeni Beslenme Planı",
    message: `Koçun sana "${sourcePlan.name}" beslenme planını atadı.`,
    link: `/site/${domain}/student/nutrition`,
  });

  revalidatePath(`/site/${domain}/dashboard/students/${studentId}`);
  revalidatePath(`/site/${domain}/dashboard/nutrition`);
  return { success: true };
}

// Toplu: birden fazla öğrenciye program ata
export async function assignProgramToStudents(
  domain: string,
  programId: string,
  studentIds: string[]
) {
  const coach = await getCoachAuth(domain);

  if (studentIds.length === 0) {
    return { success: false, error: "Öğrenci seçilmedi" };
  }
  if (studentIds.length > 500) {
    return { success: false, error: "Tek seferde en fazla 500 öğrenciye atama yapılabilir" };
  }

  const program = await prisma.program.findUnique({ where: { id: programId } });
  if (!program || program.coachId !== coach.id) {
    return { success: false, error: "Program bulunamadı" };
  }

  const students = await prisma.student.findMany({
    where: { id: { in: studentIds }, coachId: coach.id },
    select: { id: true, userId: true, name: true },
  });

  if (students.length === 0) {
    return { success: false, error: "Geçerli öğrenci bulunamadı" };
  }

  const validIds = students.map((s) => s.id);

  // Tüm seçili öğrencilerin aktif planlarını pasife al
  await prisma.trainingPlan.updateMany({
    where: { studentId: { in: validIds }, status: "active" },
    data: { status: "completed" },
  });

  // Yeni atamalar
  await prisma.trainingPlan.createMany({
    data: validIds.map((studentId) => ({
      studentId,
      programId,
      name: program.name,
      status: "active",
      startDate: new Date(),
    })),
  });

  // Bildirimleri sırayla yolla
  await Promise.all(
    students.map((s) =>
      createNotification({
        recipientId: s.userId,
        type: "program_assigned",
        title: "Yeni Antrenman Programı",
        message: `Koçun sana "${program.name}" programını atadı.`,
        link: `/site/${domain}/student/training`,
      })
    )
  );

  revalidatePath(`/site/${domain}/dashboard/programs`);
  revalidatePath(`/site/${domain}/dashboard/students`);
  return { success: true, count: students.length };
}

// Toplu: birden fazla öğrenciye beslenme planı ata (her birine deep clone)
export async function assignNutritionPlanToStudents(
  domain: string,
  nutritionPlanId: string,
  studentIds: string[]
) {
  const coach = await getCoachAuth(domain);

  if (studentIds.length === 0) {
    return { success: false, error: "Öğrenci seçilmedi" };
  }
  if (studentIds.length > 500) {
    return { success: false, error: "Tek seferde en fazla 500 öğrenciye atama yapılabilir" };
  }

  const sourcePlan = await prisma.nutritionPlan.findUnique({
    where: { id: nutritionPlanId },
    include: { meals: { orderBy: { orderIndex: "asc" } } },
  });

  if (!sourcePlan || sourcePlan.coachId !== coach.id) {
    return { success: false, error: "Plan bulunamadı" };
  }

  const students = await prisma.student.findMany({
    where: { id: { in: studentIds }, coachId: coach.id },
    select: { id: true, userId: true, name: true },
  });

  if (students.length === 0) {
    return { success: false, error: "Geçerli öğrenci bulunamadı" };
  }

  const validIds = students.map((s) => s.id);

  // Mevcut aktif planları pasife al
  await prisma.nutritionPlan.updateMany({
    where: { studentId: { in: validIds }, status: "active" },
    data: { status: "completed" },
  });

  // Her öğrenci için deep clone (createMany nested create desteklemediği için döngü)
  for (const student of students) {
    await prisma.nutritionPlan.create({
      data: {
        coachId: coach.id,
        studentId: student.id,
        sourceNutritionPlanId: nutritionPlanId,
        name: sourcePlan.name,
        status: "active",
        startDate: new Date(),
        targetCalories: sourcePlan.targetCalories,
        targetProtein: sourcePlan.targetProtein,
        targetCarbs: sourcePlan.targetCarbs,
        targetFat: sourcePlan.targetFat,
        coachNotes: sourcePlan.coachNotes,
        supplements: sourcePlan.supplements ?? undefined,
        meals: {
          create: sourcePlan.meals.map((m) => ({
            name: m.name,
            time: m.time,
            foods: m.foods as object,
            orderIndex: m.orderIndex,
          })),
        },
      },
    });
  }

  // Bildirimleri sırayla yolla
  await Promise.all(
    students.map((s) =>
      createNotification({
        recipientId: s.userId,
        type: "nutrition_assigned",
        title: "Yeni Beslenme Planı",
        message: `Koçun sana "${sourcePlan.name}" beslenme planını atadı.`,
        link: `/site/${domain}/student/nutrition`,
      })
    )
  );

  revalidatePath(`/site/${domain}/dashboard/nutrition`);
  revalidatePath(`/site/${domain}/dashboard/students`);
  return { success: true, count: students.length };
}

// Atama modal'ı için koçun öğrenci listesi (aktif planlarıyla beraber)
export async function getAssignableStudents(domain: string) {
  const coach = await getCoachAuth(domain);

  const students = await prisma.student.findMany({
    where: { coachId: coach.id, status: "active" },
    select: {
      id: true,
      name: true,
      trainingPlans: {
        where: { status: "active" },
        take: 1,
        select: { name: true },
      },
      nutritionPlans: {
        where: { status: "active" },
        take: 1,
        select: { name: true },
      },
    },
    orderBy: { name: "asc" },
  });

  return students.map((s) => ({
    id: s.id,
    name: s.name,
    activeProgramName: s.trainingPlans[0]?.name ?? null,
    activeNutritionName: s.nutritionPlans[0]?.name ?? null,
  }));
}

// Check-in'e geri bildirim yaz
export async function addCheckInFeedback(
  domain: string,
  checkInId: string,
  feedback: string
) {
  const fb = feedbackSchema.safeParse(feedback);
  if (!fb.success) return { success: false, error: "Geri bildirim çok uzun" };

  const coach = await getCoachAuth(domain);

  const checkIn = await prisma.weeklyCheckIn.findUnique({
    where: { id: checkInId },
    include: { student: { select: { coachId: true } } },
  });

  if (!checkIn || checkIn.student.coachId !== coach.id) {
    return { success: false, error: "Check-in bulunamadı" };
  }

  await prisma.weeklyCheckIn.update({
    where: { id: checkInId },
    data: { coachFeedback: fb.data },
  });

  revalidatePath(`/site/${domain}/dashboard/students`);
  return { success: true };
}

// Check-in ölçümlerini düzelt (koç)
export async function updateCheckInMeasurements(
  domain: string,
  checkInId: string,
  data: {
    weight?: number | null;
    bodyFat?: number | null;
    chest?: number | null;
    waist?: number | null;
    hips?: number | null;
    arms?: number | null;
    thighs?: number | null;
  }
) {
  const parsed = measurementsSchema.safeParse(data);
  if (!parsed.success) {
    return { success: false, error: parsed.error.errors[0]?.message || "Geçersiz ölçüm" };
  }

  const coach = await getCoachAuth(domain);

  const checkIn = await prisma.weeklyCheckIn.findUnique({
    where: { id: checkInId },
    include: { student: { select: { coachId: true } } },
  });

  if (!checkIn || checkIn.student.coachId !== coach.id) {
    return { success: false, error: "Check-in bulunamadı" };
  }

  await prisma.weeklyCheckIn.update({
    where: { id: checkInId },
    data: parsed.data,
  });

  revalidatePath(`/site/${domain}/dashboard/students`);
  return { success: true };
}

// Öğrenci notları güncelle
export async function updateStudentNotes(
  domain: string,
  studentId: string,
  notes: string
) {
  const n = notesSchema.safeParse(notes);
  if (!n.success) return { success: false, error: "Not çok uzun" };

  const coach = await getCoachAuth(domain);

  const student = await prisma.student.findUnique({ where: { id: studentId } });
  if (!student || student.coachId !== coach.id) {
    return { success: false, error: "Öğrenci bulunamadı" };
  }

  await prisma.student.update({
    where: { id: studentId },
    data: { coachNotes: n.data },
  });

  revalidatePath(`/site/${domain}/dashboard/students/${studentId}`);
  return { success: true };
}

