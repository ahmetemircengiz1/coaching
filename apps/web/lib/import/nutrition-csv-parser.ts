/**
 * Beslenme planını CSV'den parse eder.
 *
 * Beklenen sütunlar (sıra serbest; başlık satırı zorunlu):
 *   Öğün, Saat, Yiyecek, Porsiyon, Kalori, Protein, Karbonhidrat, Yağ
 *
 * Plan adı + hedef makro değerleri dialog'dan form ile gelir (CSV içinde değil).
 */

import type { ImportNutritionData } from "@/app/site/[domain]/dashboard/nutrition/actions";
import { parseCsv, toCsvRow } from "./csv-utils";

export interface NutritionCsvParseResult {
  ok: boolean;
  data?: ImportNutritionData;
  error?: string;
  line?: number;
  preview?: { meals: number; foods: number };
}

export interface NutritionCsvParseInput {
  csv: string;
  name: string;
  targetCalories?: number;
  targetProtein?: number;
  targetCarbs?: number;
  targetFat?: number;
  coachNotes?: string;
  supplements?: { name: string; dosage: string; timing: string }[];
}

function normalizeHeader(s: string): string {
  return s
    .trim()
    .toLowerCase()
    .replace(/[ığüşöçİĞÜŞÖÇ]/g, (ch) => {
      const map: Record<string, string> = {
        ı: "i",
        ğ: "g",
        ü: "u",
        ş: "s",
        ö: "o",
        ç: "c",
        İ: "i",
        Ğ: "g",
        Ü: "u",
        Ş: "s",
        Ö: "o",
        Ç: "c",
      };
      return map[ch] || ch;
    })
    .replace(/\s+/g, " ");
}

function canonicalKey(header: string): string {
  const n = normalizeHeader(header);
  if (n.startsWith("ogun") || n.startsWith("meal")) return "meal";
  if (n.startsWith("saat") || n.startsWith("time")) return "time";
  if (n.startsWith("yiyecek") || n.startsWith("besin") || n.startsWith("food")) return "food";
  if (n.startsWith("porsiyon") || n.startsWith("miktar") || n.startsWith("portion")) return "portion";
  if (n.startsWith("kalori") || n === "kcal" || n.startsWith("cal")) return "calories";
  if (n.startsWith("protein")) return "protein";
  if (n.startsWith("karbon") || n.startsWith("carb")) return "carbs";
  if (n.startsWith("yag") || n.startsWith("fat")) return "fat";
  return n;
}

function parseNum(s: string): number {
  if (!s) return 0;
  const n = Number(s.replace(",", "."));
  return Number.isFinite(n) && n >= 0 ? Math.round(n * 100) / 100 : 0;
}

export function parseNutritionCsv(input: NutritionCsvParseInput): NutritionCsvParseResult {
  const planName = input.name.trim();
  if (!planName) return { ok: false, error: "Plan adı boş olamaz." };

  const rows = parseCsv(input.csv);
  if (rows.length < 2) return { ok: false, error: "CSV en az başlık + 1 satır içermeli." };

  const headers = rows[0].map(canonicalKey);
  const idx = {
    meal: headers.indexOf("meal"),
    time: headers.indexOf("time"),
    food: headers.indexOf("food"),
    portion: headers.indexOf("portion"),
    calories: headers.indexOf("calories"),
    protein: headers.indexOf("protein"),
    carbs: headers.indexOf("carbs"),
    fat: headers.indexOf("fat"),
  };

  if (idx.meal < 0 || idx.food < 0 || idx.portion < 0) {
    return { ok: false, error: 'Zorunlu sütun eksik: "Öğün", "Yiyecek", "Porsiyon"' };
  }

  type Meal = ImportNutritionData["meals"][number];
  const map = new Map<string, Meal>();
  const order: string[] = [];

  for (let i = 1; i < rows.length; i++) {
    const row = rows[i];
    const lineNo = i + 1;
    const mealName = (row[idx.meal] || "").trim();
    const time = idx.time >= 0 ? (row[idx.time] || "").trim() : "";
    const foodName = (row[idx.food] || "").trim();
    const portion = (row[idx.portion] || "").trim();

    if (!mealName && !foodName) continue;
    if (!mealName) return { ok: false, error: "Öğün adı boş", line: lineNo };
    if (!foodName) return { ok: false, error: "Yiyecek adı boş", line: lineNo };
    if (!portion) return { ok: false, error: "Porsiyon boş", line: lineNo };

    const calories = idx.calories >= 0 ? parseNum(row[idx.calories] || "") : 0;
    const protein = idx.protein >= 0 ? parseNum(row[idx.protein] || "") : 0;
    const carbs = idx.carbs >= 0 ? parseNum(row[idx.carbs] || "") : 0;
    const fat = idx.fat >= 0 ? parseNum(row[idx.fat] || "") : 0;

    const key = mealName.toLowerCase();
    let meal = map.get(key);
    if (!meal) {
      meal = { name: mealName, time: time || undefined, foods: [] };
      map.set(key, meal);
      order.push(key);
    } else if (time && !meal.time) {
      meal.time = time;
    }
    meal.foods.push({ name: foodName, portion, calories, protein, carbs, fat });
  }

  const meals = order.map((k) => map.get(k)!);
  if (meals.length === 0) return { ok: false, error: "Hiç öğün bulunamadı (başlık dışında veri yok)." };

  const totalFoods = meals.reduce((sum, m) => sum + m.foods.length, 0);

  return {
    ok: true,
    data: {
      name: planName.slice(0, 200),
      targetCalories: input.targetCalories,
      targetProtein: input.targetProtein,
      targetCarbs: input.targetCarbs,
      targetFat: input.targetFat,
      coachNotes: input.coachNotes?.slice(0, 500),
      supplements: input.supplements && input.supplements.length > 0 ? input.supplements : undefined,
      meals,
    },
    preview: { meals: meals.length, foods: totalFoods },
  };
}

export function buildNutritionCsvTemplate(): string {
  const header = ["Öğün", "Saat", "Yiyecek", "Porsiyon", "Kalori", "Protein", "Karbonhidrat", "Yağ"];
  const examples = [
    ["Kahvaltı", "08:00", "Yulaf ezmesi", "80g", 300, 10, 54, 6],
    ["Kahvaltı", "08:00", "Yumurta", "3 adet", 210, 18, 1, 15],
    ["Kahvaltı", "08:00", "Süt", "200ml", 120, 7, 10, 5],
    ["Ara Öğün", "10:30", "Muz", "1 orta", 90, 1, 23, 0],
    ["Öğle Yemeği", "13:00", "Tavuk göğsü", "200g", 330, 62, 0, 7],
    ["Öğle Yemeği", "13:00", "Pirinç", "150g", 195, 4, 43, 0],
    ["Akşam Yemeği", "19:00", "Somon", "180g", 360, 36, 0, 22],
    ["Akşam Yemeği", "19:00", "Tatlı patates", "150g", 130, 2, 30, 0],
  ];
  return [toCsvRow(header), ...examples.map((r) => toCsvRow(r))].join("\n");
}
