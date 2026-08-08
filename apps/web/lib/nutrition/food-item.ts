import type { FoodData } from "@/lib/data/food-database";

/**
 * Meal.foods JSON'unun tek tip tanımı. Önceden üç ayrı dosyada kopyalanmıştı
 * (koç kütüphanesi, atanmış plan, öğrenci paneli) — düzenleme özelliği üçünde
 * de aynı şekilde çalışsın diye tek kaynağa taşındı.
 *
 * per100g alanları besin veritabanından gelir ve gramaj değişince makroları
 * yeniden hesaplamak için saklanır; elle eklenen besinlerde bulunmayabilir.
 */
export interface FoodItem {
  name: string;
  portion: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  sugar: number;
  fiber: number;
  grams?: number;
  caloriesPer100g?: number;
  proteinPer100g?: number;
  carbsPer100g?: number;
  fatPer100g?: number;
  sugarPer100g?: number;
  fiberPer100g?: number;
}

export interface MealTotals {
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  sugar: number;
}

/** Öğün adı seçenekleri — sihirbaz, kütüphane ve atanmış plan aynı listeyi kullanır. */
export const MEAL_NAME_OPTIONS = [
  "Kahvaltı",
  "Ara Öğün (Sabah)",
  "Öğle Yemeği",
  "Ara Öğün (Öğleden Sonra)",
  "Akşam Yemeği",
  "Gece Atıştırması",
  "Antrenman Öncesi",
  "Antrenman Sonrası",
] as const;

export function getMealTotals(foods: FoodItem[]): MealTotals {
  return foods.reduce<MealTotals>(
    (acc, f) => ({
      calories: acc.calories + (f.calories || 0),
      protein: acc.protein + (f.protein || 0),
      carbs: acc.carbs + (f.carbs || 0),
      fat: acc.fat + (f.fat || 0),
      sugar: acc.sugar + (f.sugar || 0),
    }),
    { calories: 0, protein: 0, carbs: 0, fat: 0, sugar: 0 }
  );
}

/** Besin veritabanı kaydını, porsiyonuna göre ölçeklenmiş FoodItem'a çevirir. */
export function foodDataToItem(food: FoodData): FoodItem {
  const ratio = food.portionGrams / 100;
  return {
    name: food.name,
    portion: `${food.portion} (${food.portionGrams}g)`,
    grams: food.portionGrams,
    calories: Math.round(food.calories * ratio),
    protein: Math.round(food.protein * ratio * 10) / 10,
    carbs: Math.round(food.carbs * ratio * 10) / 10,
    fat: Math.round(food.fat * ratio * 10) / 10,
    sugar: Math.round(food.sugar * ratio * 10) / 10,
    fiber: Math.round(food.fiber * ratio * 10) / 10,
    caloriesPer100g: food.calories,
    proteinPer100g: food.protein,
    carbsPer100g: food.carbs,
    fatPer100g: food.fat,
    sugarPer100g: food.sugar,
    fiberPer100g: food.fiber,
  };
}

/** Gramaj değişince makroları per100g değerlerinden yeniden hesaplar. */
export function withGrams(food: FoodItem, newGrams: number): FoodItem {
  const ratio = newGrams / 100;
  return {
    ...food,
    grams: newGrams,
    portion: `${newGrams}g`,
    calories: Math.round((food.caloriesPer100g ?? 0) * ratio),
    protein: Math.round((food.proteinPer100g ?? 0) * ratio * 10) / 10,
    carbs: Math.round((food.carbsPer100g ?? 0) * ratio * 10) / 10,
    fat: Math.round((food.fatPer100g ?? 0) * ratio * 10) / 10,
    sugar: Math.round((food.sugarPer100g ?? 0) * ratio * 10) / 10,
    fiber: Math.round((food.fiberPer100g ?? 0) * ratio * 10) / 10,
  };
}

export function updateFoodGrams(foods: FoodItem[], idx: number, newGrams: number): FoodItem[] {
  return foods.map((f, i) => (i === idx ? withGrams(f, newGrams) : f));
}

/** Bir satırı başka bir besinle değiştirir; gramaj korunur (koç "ürünü komple değiştir" ister). */
export function replaceFood(foods: FoodItem[], idx: number, food: FoodData): FoodItem[] {
  return foods.map((f, i) => {
    if (i !== idx) return f;
    const replacement = foodDataToItem(food);
    // Önceki gramaj biliniyorsa koru — koç 150g tavuğu 150g hindiyle değiştirmek ister
    return f.grams && replacement.caloriesPer100g != null
      ? withGrams(replacement, f.grams)
      : replacement;
  });
}

/** Prisma'dan gelen `unknown` JSON'u güvenle FoodItem[]'a çevirir. */
export function toFoodItems(value: unknown): FoodItem[] {
  return Array.isArray(value) ? (value as FoodItem[]) : [];
}

/** Server action'a gönderilecek sade gövde (per100g alanları da korunur). */
export function toFoodPayload(foods: FoodItem[]) {
  return foods.map((f) => ({
    name: f.name,
    portion: f.portion,
    calories: f.calories,
    protein: f.protein,
    carbs: f.carbs,
    fat: f.fat,
    sugar: f.sugar,
    fiber: f.fiber,
    grams: f.grams,
    caloriesPer100g: f.caloriesPer100g,
    proteinPer100g: f.proteinPer100g,
    carbsPer100g: f.carbsPer100g,
    fatPer100g: f.fatPer100g,
    sugarPer100g: f.sugarPer100g,
    fiberPer100g: f.fiberPer100g,
  }));
}
