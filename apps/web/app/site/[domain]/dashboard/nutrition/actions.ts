"use server";

import { getCoachAuth } from "../actions";
import prisma, { Prisma } from "@coach-os/database";
import { revalidatePath } from "next/cache";
import { createNutritionPlanSchema, addMealSchema, updateMealSchema } from "@/lib/validation/schemas";

// Beslenme planları listesi (kütüphane: studentId null olan planlar)
export async function getNutritionPlans(domain: string) {
  const coach = await getCoachAuth(domain);

  const plans = await prisma.nutritionPlan.findMany({
    where: { coachId: coach.id, studentId: null },
    include: {
      meals: { orderBy: { orderIndex: "asc" } },
      _count: { select: { assignedPlans: true } },
      // #9: Kart üzerinde ilk 5 atanan öğrencinin önizlemesi
      assignedPlans: {
        where: { status: "active" },
        select: { student: { select: { id: true, name: true } } },
        take: 5,
        orderBy: { createdAt: "desc" },
      },
    },
    orderBy: { createdAt: "desc" },
  });

  return plans.map((p) => ({
    ...p,
    assignedCount: p._count.assignedPlans,
    assignedStudentsPreview: p.assignedPlans
      .filter((ap) => ap.student !== null)
      .map((ap) => ({ id: ap.student!.id, name: ap.student!.name })),
    createdAt: p.createdAt.toISOString(),
    startDate: p.startDate?.toISOString() || null,
  }));
}

// Tek bir beslenme planı detayı
export async function getNutritionPlan(domain: string, planId: string) {
  const coach = await getCoachAuth(domain);

  const plan = await prisma.nutritionPlan.findUnique({
    where: { id: planId },
    include: {
      meals: { orderBy: { orderIndex: "asc" } },
    },
  });

  if (!plan || plan.coachId !== coach.id) {
    return null;
  }

  return {
    ...plan,
    createdAt: plan.createdAt.toISOString(),
    startDate: plan.startDate?.toISOString() || null,
  };
}

// Beslenme planı oluştur (kütüphane planı)
export async function createNutritionPlan(
  domain: string,
  data: {
    name: string;
    targetCalories?: number;
    targetProtein?: number;
    targetCarbs?: number;
    targetFat?: number;
    coachNotes?: string;
    supplements?: { name: string; dosage: string; timing: string; notes?: string }[];
  }
) {
  const parsed = createNutritionPlanSchema.safeParse(data);
  if (!parsed.success) return { success: false, error: parsed.error.errors[0]?.message || "Geçersiz veri" };

  const coach = await getCoachAuth(domain);

  const plan = await prisma.nutritionPlan.create({
    data: {
      coachId: coach.id,
      studentId: null,
      name: data.name,
      targetCalories: data.targetCalories || null,
      targetProtein: data.targetProtein || null,
      targetCarbs: data.targetCarbs || null,
      targetFat: data.targetFat || null,
      coachNotes: data.coachNotes || null,
      supplements: data.supplements ?? Prisma.DbNull,
    },
  });

  revalidatePath(`/site/${domain}/dashboard/nutrition`);
  return { success: true, planId: plan.id };
}

// Beslenme planı güncelle
export async function updateNutritionPlan(
  domain: string,
  planId: string,
  data: {
    name: string;
    targetCalories?: number;
    targetProtein?: number;
    targetCarbs?: number;
    targetFat?: number;
    coachNotes?: string;
    supplements?: { name: string; dosage: string; timing: string; notes?: string }[];
  }
) {
  const parsed = createNutritionPlanSchema.safeParse(data);
  if (!parsed.success) return { success: false, error: parsed.error.errors[0]?.message || "Geçersiz veri" };

  const coach = await getCoachAuth(domain);

  const plan = await prisma.nutritionPlan.findUnique({
    where: { id: planId },
  });

  if (!plan || plan.coachId !== coach.id) {
    return { success: false, error: "Plan bulunamadı" };
  }

  await prisma.nutritionPlan.update({
    where: { id: planId },
    data: {
      name: data.name,
      targetCalories: data.targetCalories ?? null,
      targetProtein: data.targetProtein ?? null,
      targetCarbs: data.targetCarbs ?? null,
      targetFat: data.targetFat ?? null,
      coachNotes: data.coachNotes ?? null,
      supplements: data.supplements ?? Prisma.DbNull,
    },
  });

  revalidatePath(`/site/${domain}/dashboard`);
  return { success: true };
}

// Koç notlarını güncelle
export async function updatePlanNotes(
  domain: string,
  planId: string,
  coachNotes: string
) {
  const coach = await getCoachAuth(domain);

  const plan = await prisma.nutritionPlan.findUnique({
    where: { id: planId },
  });

  if (!plan || plan.coachId !== coach.id) {
    return { success: false, error: "Plan bulunamadı" };
  }

  await prisma.nutritionPlan.update({
    where: { id: planId },
    data: { coachNotes },
  });

  revalidatePath(`/site/${domain}/dashboard/nutrition`);
  return { success: true };
}

// Takviye listesini güncelle
export async function updatePlanSupplements(
  domain: string,
  planId: string,
  supplements: { name: string; dosage: string; timing: string; notes?: string }[]
) {
  const coach = await getCoachAuth(domain);

  const plan = await prisma.nutritionPlan.findUnique({
    where: { id: planId },
  });

  if (!plan || plan.coachId !== coach.id) {
    return { success: false, error: "Plan bulunamadı" };
  }

  await prisma.nutritionPlan.update({
    where: { id: planId },
    data: { supplements },
  });

  revalidatePath(`/site/${domain}/dashboard/nutrition`);
  return { success: true };
}

// Beslenme planı sil
export async function deleteNutritionPlan(domain: string, planId: string) {
  const coach = await getCoachAuth(domain);

  const plan = await prisma.nutritionPlan.findUnique({
    where: { id: planId },
  });

  if (!plan || plan.coachId !== coach.id) {
    return { success: false, error: "Plan bulunamadı" };
  }

  await prisma.nutritionPlan.delete({ where: { id: planId } });

  revalidatePath(`/site/${domain}/dashboard/nutrition`);
  return { success: true };
}

// Beslenme planı kopyala
export async function duplicateNutritionPlan(domain: string, planId: string) {
  const coach = await getCoachAuth(domain);

  const plan = await prisma.nutritionPlan.findUnique({
    where: { id: planId },
    include: { meals: { orderBy: { orderIndex: "asc" } } },
  });

  if (!plan || plan.coachId !== coach.id) {
    return { success: false, error: "Plan bulunamadı" };
  }

  const newPlan = await prisma.nutritionPlan.create({
    data: {
      coachId: coach.id,
      studentId: null,
      name: `${plan.name} (Kopya)`,
      targetCalories: plan.targetCalories,
      targetProtein: plan.targetProtein,
      targetCarbs: plan.targetCarbs,
      targetFat: plan.targetFat,
      coachNotes: plan.coachNotes,
      supplements: plan.supplements ?? Prisma.DbNull,
    },
  });

  for (const meal of plan.meals) {
    await prisma.meal.create({
      data: {
        nutritionPlanId: newPlan.id,
        name: meal.name,
        time: meal.time,
        foods: meal.foods as Prisma.InputJsonValue,
        orderIndex: meal.orderIndex,
      },
    });
  }

  revalidatePath(`/site/${domain}/dashboard/nutrition`);
  return { success: true, planId: newPlan.id };
}

// Öğün ekle
export async function addMeal(
  domain: string,
  planId: string,
  data: {
    name: string;
    time?: string;
    foods: { name: string; portion: string; calories: number; protein: number; carbs: number; fat: number; sugar?: number; fiber?: number }[];
  }
) {
  const parsed = addMealSchema.safeParse(data);
  if (!parsed.success) return { success: false, error: parsed.error.errors[0]?.message || "Geçersiz veri" };

  const coach = await getCoachAuth(domain);

  const plan = await prisma.nutritionPlan.findUnique({
    where: { id: planId },
    include: { meals: true },
  });

  if (!plan || plan.coachId !== coach.id) {
    return { success: false, error: "Plan bulunamadı" };
  }

  const orderIndex = plan.meals.length;

  await prisma.meal.create({
    data: {
      nutritionPlanId: planId,
      name: data.name,
      time: data.time || null,
      foods: data.foods,
      orderIndex,
    },
  });

  revalidatePath(`/site/${domain}/dashboard`);
  return { success: true };
}

// Öğün güncelle
export async function updateMeal(
  domain: string,
  mealId: string,
  data: {
    name: string;
    time?: string;
    foods: { name: string; portion: string; calories: number; protein: number; carbs: number; fat: number; sugar?: number; fiber?: number }[];
  }
) {
  const parsed = updateMealSchema.safeParse(data);
  if (!parsed.success) return { success: false, error: parsed.error.errors[0]?.message || "Geçersiz veri" };

  const coach = await getCoachAuth(domain);

  const meal = await prisma.meal.findUnique({
    where: { id: mealId },
    include: { nutritionPlan: { select: { coachId: true } } },
  });

  if (!meal || meal.nutritionPlan.coachId !== coach.id) {
    return { success: false, error: "Öğün bulunamadı" };
  }

  await prisma.meal.update({
    where: { id: mealId },
    data: {
      name: data.name,
      time: data.time || null,
      foods: data.foods,
    },
  });

  revalidatePath(`/site/${domain}/dashboard`);
  return { success: true };
}

// Öğün sil
export async function deleteMeal(domain: string, mealId: string) {
  const coach = await getCoachAuth(domain);

  const meal = await prisma.meal.findUnique({
    where: { id: mealId },
    include: { nutritionPlan: { select: { coachId: true } } },
  });

  if (!meal || meal.nutritionPlan.coachId !== coach.id) {
    return { success: false, error: "Öğün bulunamadı" };
  }

  await prisma.meal.delete({ where: { id: mealId } });

  revalidatePath(`/site/${domain}/dashboard`);
  return { success: true };
}

// ── Dosyadan beslenme planı içe aktarma ──

export interface ImportNutritionData {
  name: string;
  targetCalories?: number;
  targetProtein?: number;
  targetCarbs?: number;
  targetFat?: number;
  coachNotes?: string;
  supplements?: { name: string; dosage: string; timing: string; notes?: string }[];
  meals: {
    name: string;
    time?: string;
    foods: {
      name: string;
      portion: string;
      calories: number;
      protein: number;
      carbs: number;
      fat: number;
    }[];
  }[];
}

export async function importNutritionFromFile(domain: string, raw: string) {
  const coach = await getCoachAuth(domain);

  let data: ImportNutritionData;
  try {
    data = JSON.parse(raw);
  } catch {
    return { success: false, error: "Gecersiz JSON formati. Dosyanizi kontrol edin." };
  }

  if (!data.name || typeof data.name !== "string") {
    return { success: false, error: "Plan adi (name) zorunludur." };
  }
  if (!Array.isArray(data.meals) || data.meals.length === 0) {
    return { success: false, error: "En az bir ogun (meals) gereklidir." };
  }

  for (const meal of data.meals) {
    if (!meal.name || typeof meal.name !== "string") {
      return { success: false, error: "Her ogunun bir adi (name) olmalidir." };
    }
    if (!Array.isArray(meal.foods) || meal.foods.length === 0) {
      return { success: false, error: `"${meal.name}" icin en az bir besin (foods) gereklidir.` };
    }
    for (const food of meal.foods) {
      if (!food.name || !food.portion || typeof food.calories !== "number") {
        return { success: false, error: "Besin formati hatali: name, portion ve calories zorunludur." };
      }
    }
  }

  const plan = await prisma.nutritionPlan.create({
    data: {
      coachId: coach.id,
      studentId: null,
      name: data.name.trim().slice(0, 200),
      targetCalories: data.targetCalories || null,
      targetProtein: data.targetProtein || null,
      targetCarbs: data.targetCarbs || null,
      targetFat: data.targetFat || null,
      coachNotes: data.coachNotes?.trim().slice(0, 500) || null,
      supplements: data.supplements ?? Prisma.DbNull,
    },
  });

  for (let i = 0; i < data.meals.length; i++) {
    const meal = data.meals[i];
    await prisma.meal.create({
      data: {
        nutritionPlanId: plan.id,
        name: meal.name.trim().slice(0, 100),
        time: meal.time?.trim() || null,
        foods: meal.foods as unknown as Prisma.InputJsonValue,
        orderIndex: i + 1,
      },
    });
  }

  revalidatePath(`/site/${domain}/dashboard/nutrition`);
  return { success: true, planId: plan.id };
}

// Bir öğüne ait alternatif öğün metinlerini güncelle (replace-all).
// alternatives: ["Omlet + ekmek", "Yoğurtlu meyve bowl", ...]
export async function setMealAlternatives(
  domain: string,
  mealId: string,
  alternatives: string[]
) {
  const coach = await getCoachAuth(domain);

  const meal = await prisma.meal.findUnique({
    where: { id: mealId },
    include: { nutritionPlan: { select: { coachId: true } } },
  });

  if (!meal || meal.nutritionPlan.coachId !== coach.id) {
    return { success: false, error: "Öğün bulunamadı" };
  }

  const cleaned = alternatives
    .map((s) => s.trim())
    .filter((s) => s.length > 0)
    .slice(0, 10); // max 10 alternatif

  await prisma.meal.update({
    where: { id: mealId },
    data: {
      alternatives: cleaned.length > 0 ? (cleaned as unknown as Prisma.InputJsonValue) : Prisma.JsonNull,
    },
  });

  revalidatePath(`/site/${domain}/dashboard/nutrition`);
  return { success: true };
}
