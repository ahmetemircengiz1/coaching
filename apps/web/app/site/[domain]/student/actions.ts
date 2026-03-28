"use server";

import { getAuthUser } from "@/lib/supabase/server";
import prisma from "@coach-os/database";
import { redirect } from "next/navigation";
import { createNotification } from "@/lib/notifications";

// Auth + Student kaydı al
export async function getStudentData(domain: string) {
  const user = await getAuthUser();

  if (!user) {
    redirect(`/site/${domain}/auth`);
  }

  const student = await prisma.student.findUnique({
    where: { userId: user.id },
    include: {
      coach: {
        select: { brandName: true, name: true, subdomain: true },
      },
      coachPackage: { select: { name: true, duration: true } },
    },
  });

  if (!student || student.coach.subdomain !== domain) {
    redirect(`/site/${domain}/auth`);
  }

  return student;
}

// Student dashboard verileri
export async function getStudentDashboard(domain: string) {
  const student = await getStudentData(domain);

  // Bağımsız sorguları paralel çalıştır
  const [trainingPlan, nutritionPlan, lastCheckIn, unreadMessages] =
    await Promise.all([
      // Aktif antrenman planı
      prisma.trainingPlan.findFirst({
        where: { studentId: student.id, status: "active" },
        include: {
          program: { select: { name: true } },
        },
      }),
      // Aktif beslenme planı
      prisma.nutritionPlan.findFirst({
        where: { studentId: student.id, status: "active" },
        orderBy: { createdAt: "desc" },
        select: {
          name: true,
          targetCalories: true,
          targetProtein: true,
          targetCarbs: true,
          targetFat: true,
        },
      }),
      // Son check-in
      prisma.weeklyCheckIn.findFirst({
        where: { studentId: student.id },
        orderBy: { date: "desc" },
        select: {
          weekNumber: true,
          date: true,
          compliance: true,
          weight: true,
          coachFeedback: true,
        },
      }),
      // Okunmamış mesajlar
      prisma.message.count({
        where: {
          studentId: student.id,
          senderRole: "coach",
          isRead: false,
        },
      }),
    ]);

  return {
    student: {
      id: student.id,
      name: student.name,
      coachName: student.coach.brandName,
      packageName: student.coachPackage?.name || null,
    },
    trainingPlan: trainingPlan
      ? { name: trainingPlan.program?.name || trainingPlan.name }
      : null,
    nutritionPlan,
    lastCheckIn: lastCheckIn
      ? {
          ...lastCheckIn,
          date: lastCheckIn.date.toISOString(),
          weight: lastCheckIn.weight ? Number(lastCheckIn.weight) : null,
        }
      : null,
    unreadMessages,
  };
}

// Antrenman programı
export async function getStudentTraining(domain: string) {
  const student = await getStudentData(domain);

  const trainingPlan = await prisma.trainingPlan.findFirst({
    where: { studentId: student.id, status: "active" },
    include: {
      program: {
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
        },
      },
    },
  });

  return { student, trainingPlan };
}

// Beslenme programı
export async function getStudentNutrition(domain: string) {
  const student = await getStudentData(domain);

  const nutritionPlan = await prisma.nutritionPlan.findFirst({
    where: { studentId: student.id, status: "active" },
    orderBy: { createdAt: "desc" },
    include: {
      meals: {
        orderBy: { orderIndex: "asc" },
      },
    },
  });

  return { student, nutritionPlan };
}

// Check-in gönder
export async function submitCheckIn(
  domain: string,
  data: {
    weight?: number;
    bodyFat?: number;
    chest?: number;
    waist?: number;
    hips?: number;
    arms?: number;
    thighs?: number;
    energyLevel?: number;
    sleepQuality?: number;
    stressLevel?: number;
    compliance?: number;
    notes?: string;
    photos?: string[];
  }
) {
  const student = await getStudentData(domain);

  // Son check-in'in hafta numarasını bul
  const lastCheckIn = await prisma.weeklyCheckIn.findFirst({
    where: { studentId: student.id },
    orderBy: { weekNumber: "desc" },
    select: { weekNumber: true },
  });

  const weekNumber = (lastCheckIn?.weekNumber || 0) + 1;

  const checkIn = await prisma.weeklyCheckIn.create({
    data: {
      studentId: student.id,
      weekNumber,
      weight: data.weight,
      bodyFat: data.bodyFat,
      chest: data.chest,
      waist: data.waist,
      hips: data.hips,
      arms: data.arms,
      thighs: data.thighs,
      energyLevel: data.energyLevel,
      sleepQuality: data.sleepQuality,
      stressLevel: data.stressLevel,
      compliance: data.compliance,
      notes: data.notes,
      photos: data.photos || [],
    },
  });

  // Kilo metriği de kaydet
  if (data.weight) {
    await prisma.metric.create({
      data: {
        studentId: student.id,
        type: "weight",
        name: "Kilo",
        value: data.weight,
        unit: "kg",
      },
    });
  }

  // Koça bildirim gönder
  const coach = await prisma.coach.findUnique({
    where: { id: student.coachId },
    select: { userId: true },
  });
  if (coach) {
    await createNotification({
      recipientId: coach.userId,
      type: "check_in",
      title: "Yeni Check-in",
      message: `${student.name} hafta ${weekNumber} check-in gönderdi.`,
      link: `/site/${domain}/dashboard/students/${student.id}`,
    });
  }

  return { success: true, weekNumber };
}

// İlerleme verileri
export async function getStudentProgress(domain: string) {
  const student = await getStudentData(domain);

  const checkIns = await prisma.weeklyCheckIn.findMany({
    where: { studentId: student.id },
    orderBy: { date: "asc" },
    select: {
      weekNumber: true,
      date: true,
      weight: true,
      bodyFat: true,
      chest: true,
      waist: true,
      hips: true,
      arms: true,
      thighs: true,
      energyLevel: true,
      sleepQuality: true,
      stressLevel: true,
      notes: true,
      compliance: true,
      frontPhoto: true,
      sidePhoto: true,
      backPhoto: true,
      photos: true,
    },
  });

  return {
    student,
    checkIns: checkIns.map((c) => ({
      ...c,
      date: c.date.toISOString(),
      weight: c.weight ? Number(c.weight) : null,
      bodyFat: c.bodyFat ? Number(c.bodyFat) : null,
      chest: c.chest ? Number(c.chest) : null,
      waist: c.waist ? Number(c.waist) : null,
      hips: c.hips ? Number(c.hips) : null,
      arms: c.arms ? Number(c.arms) : null,
      thighs: c.thighs ? Number(c.thighs) : null,
    })),
  };
}

// Plan geçmişi (training + nutrition)
export async function getStudentPlanHistory(domain: string) {
  const student = await getStudentData(domain);

  const [trainingPlans, nutritionPlans] = await Promise.all([
    prisma.trainingPlan.findMany({
      where: { studentId: student.id },
      orderBy: { createdAt: "desc" },
      select: {
        id: true,
        name: true,
        status: true,
        createdAt: true,
        program: {
          select: {
            name: true,
            weeks: true,
            workouts: {
              orderBy: [{ weekNumber: "asc" }, { dayOfWeek: "asc" }],
              select: {
                name: true,
                weekNumber: true,
                dayOfWeek: true,
                exercises: {
                  orderBy: { orderIndex: "asc" },
                  select: {
                    sets: true,
                    reps: true,
                    exercise: { select: { name: true, category: true } },
                  },
                },
              },
            },
          },
        },
      },
    }),
    prisma.nutritionPlan.findMany({
      where: { studentId: student.id },
      orderBy: { createdAt: "desc" },
      select: {
        id: true,
        name: true,
        targetCalories: true,
        targetProtein: true,
        targetCarbs: true,
        targetFat: true,
        createdAt: true,
        meals: {
          orderBy: { orderIndex: "asc" },
          select: { id: true, name: true, time: true, foods: true },
        },
      },
    }),
  ]);

  return {
    trainingPlans: trainingPlans.map((p) => ({
      ...p,
      programName: p.program?.name || null,
      programWeeks: p.program?.weeks || null,
      workouts: p.program?.workouts || [],
      createdAt: p.createdAt.toISOString(),
    })),
    nutritionPlans: nutritionPlans.map((p) => ({
      ...p,
      createdAt: p.createdAt.toISOString(),
    })),
  };
}

// Mesajlar
export async function getStudentMessages(domain: string) {
  const student = await getStudentData(domain);

  const messages = await prisma.message.findMany({
    where: { studentId: student.id },
    orderBy: { createdAt: "asc" },
    select: {
      id: true,
      senderId: true,
      senderRole: true,
      content: true,
      createdAt: true,
      isRead: true,
    },
  });

  // Okunmamış mesajları okundu olarak işaretle
  await prisma.message.updateMany({
    where: {
      studentId: student.id,
      senderRole: "coach",
      isRead: false,
    },
    data: { isRead: true },
  });

  return {
    student,
    messages: messages.map((m) => ({
      ...m,
      createdAt: m.createdAt.toISOString(),
    })),
  };
}

// Öğrenci ayarlarını getir
export async function getStudentSettings(domain: string) {
  const student = await getStudentData(domain);

  // Koçun planına göre kullanılabilir temalar
  const coach = await prisma.coach.findUnique({
    where: { id: student.coachId },
    include: { package: true },
  });

  // Tüm temalar kullanılabilir (öğrenci koçun planına bağlı)
  const tier = coach?.package?.tier || 1;
  let availableThemeIds = [1];
  if (tier >= 2) availableThemeIds = [1, 2];
  if (tier >= 3) availableThemeIds = [1, 2, 3, 4, 5];

  const defaultNotifPrefs = { programAssigned: true, feedbackReceived: true, messageReceived: true };
  const notificationPrefs = student.notificationPrefs
    ? { ...defaultNotifPrefs, ...(student.notificationPrefs as Record<string, boolean>) }
    : defaultNotifPrefs;

  return {
    dashboardThemeId: student.dashboardThemeId || 1,
    sidebarPosition: student.sidebarPosition || "bottom",
    availableThemeIds,
    notificationPrefs,
  };
}

// Öğrenci ayarlarını güncelle
export async function updateStudentSettings(
  domain: string,
  data: {
    dashboardThemeId?: number;
    sidebarPosition?: string;
    notificationPrefs?: { programAssigned?: boolean; feedbackReceived?: boolean; messageReceived?: boolean };
  }
) {
  const student = await getStudentData(domain);

  const updateData: Record<string, unknown> = {};
  if (typeof data.dashboardThemeId === "number" && data.dashboardThemeId >= 1 && data.dashboardThemeId <= 5) {
    updateData.dashboardThemeId = data.dashboardThemeId;
  }
  if (data.sidebarPosition && ["left", "bottom", "right"].includes(data.sidebarPosition)) {
    updateData.sidebarPosition = data.sidebarPosition;
  }
  if (data.notificationPrefs) {
    const current = (student.notificationPrefs as Record<string, boolean>) || {};
    updateData.notificationPrefs = { ...current, ...data.notificationPrefs };
  }

  if (Object.keys(updateData).length > 0) {
    await prisma.student.update({
      where: { id: student.id },
      data: updateData,
    });
  }

  return { success: true };
}

// Mesaj gönder
export async function sendMessage(domain: string, content: string) {
  const student = await getStudentData(domain);

  const message = await prisma.message.create({
    data: {
      studentId: student.id,
      senderId: student.userId,
      senderRole: "student",
      content,
    },
  });

  return { success: true, messageId: message.id };
}
