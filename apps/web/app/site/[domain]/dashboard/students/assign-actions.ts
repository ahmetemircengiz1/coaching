"use server";

import { getCoachAuth } from "../actions";
import prisma from "@coach-os/database";
import { createNotification } from "@/lib/notifications";
import { revalidatePath } from "next/cache";

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

// Check-in'e geri bildirim yaz
export async function addCheckInFeedback(
  domain: string,
  checkInId: string,
  feedback: string
) {
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
    data: { coachFeedback: feedback },
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
    data,
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
  const coach = await getCoachAuth(domain);

  const student = await prisma.student.findUnique({ where: { id: studentId } });
  if (!student || student.coachId !== coach.id) {
    return { success: false, error: "Öğrenci bulunamadı" };
  }

  await prisma.student.update({
    where: { id: studentId },
    data: { coachNotes: notes },
  });

  revalidatePath(`/site/${domain}/dashboard/students/${studentId}`);
  return { success: true };
}

// Toplu mesaj gönder
export async function sendBulkMessage(
  domain: string,
  studentIds: string[],
  content: string
) {
  const coach = await getCoachAuth(domain);

  const students = await prisma.student.findMany({
    where: { id: { in: studentIds }, coachId: coach.id },
    select: { id: true },
  });

  if (students.length === 0) {
    return { success: false, error: "Öğrenci bulunamadı" };
  }

  await prisma.message.createMany({
    data: students.map((s) => ({
      studentId: s.id,
      senderId: coach.userId,
      senderRole: "coach" as const,
      content,
    })),
  });

  return { success: true, count: students.length };
}

// Coach mesaj gönder
export async function sendCoachMessage(
  domain: string,
  studentId: string,
  content: string
) {
  const coach = await getCoachAuth(domain);

  const student = await prisma.student.findUnique({ where: { id: studentId } });
  if (!student || student.coachId !== coach.id) {
    return { success: false, error: "Öğrenci bulunamadı" };
  }

  await prisma.message.create({
    data: {
      studentId,
      senderId: coach.userId,
      senderRole: "coach",
      content,
    },
  });

  return { success: true };
}
