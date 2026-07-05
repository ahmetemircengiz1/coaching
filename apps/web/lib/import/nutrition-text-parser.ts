/**
 * Beslenme planını düz metinden parse eder.
 *
 * Beklenen format:
 *   Plan: Bulk Beslenme Planı
 *   Hedef kalori: 2800
 *   Hedef protein: 180
 *   Hedef karbonhidrat: 350
 *   Hedef yağ: 80
 *   Not: Antrenman günleri karbonhidrat arttırılabilir
 *
 *   Takviye: Whey Protein - 30g - Antrenman sonrası
 *   Takviye: Multivitamin - 1 adet - Sabah
 *
 *   Öğün: Kahvaltı - 08:00
 *   Yulaf 80g 300kcal 10P 54K 6Y
 *   Yumurta 3 adet 210kcal 18P 1K 15Y
 *
 *   Öğün: Öğle Yemeği - 13:00
 *   Tavuk göğsü 200g 330kcal 62P 0K 7Y
 *
 * Esneklik:
 * - Tire: "-", "–", "—" hepsi kabul.
 * - Makro bilgisi opsiyonel — yazılmazsa 0 olur, koç sonra düzeltir.
 * - Yiyecek satırı en az ad+porsiyon olabilir: "Tavuk göğsü 200g"
 */

import type { ImportNutritionData } from "@/app/site/[domain]/dashboard/nutrition/actions";

const DASH = /\s*[-–—]\s*/;

export interface NutritionTextParseResult {
  ok: boolean;
  data?: ImportNutritionData;
  error?: string;
  line?: number;
  preview?: { meals: number; foods: number; supplements: number };
}

function parseNumber(s: string): number | null {
  const cleaned = s.replace(/[,]/g, ".").replace(/[^\d.]/g, "");
  if (!cleaned) return null;
  const n = Number(cleaned);
  return Number.isFinite(n) ? n : null;
}

function parsePlanLine(line: string): string | null {
  const m = line.match(/^\s*(?:plan|beslenme\s+plan[ıi])\s*:\s*(.+)$/i);
  return m ? m[1].trim() : null;
}

function parseTargetLine(line: string): { kind: "cal" | "p" | "c" | "f"; value: number } | null {
  const m = line.match(/^\s*hedef\s+(kalori|protein|karbon(?:hidrat)?|ya[ğg])\s*:\s*(.+)$/i);
  if (!m) return null;
  const value = parseNumber(m[2]);
  if (value === null) return null;
  const key = m[1].toLowerCase();
  if (key === "kalori") return { kind: "cal", value };
  if (key === "protein") return { kind: "p", value };
  if (key.startsWith("karbon")) return { kind: "c", value };
  if (key.startsWith("ya")) return { kind: "f", value };
  return null;
}

function parseNoteLine(line: string): string | null {
  const m = line.match(/^\s*not\s*:\s*(.+)$/i);
  return m ? m[1].trim() : null;
}

function parseSupplementLine(
  line: string,
): { name: string; dosage: string; timing: string } | null {
  const m = line.match(/^\s*(?:takviye|supplement)\s*:\s*(.+)$/i);
  if (!m) return null;
  const parts = m[1].split(DASH).map((p) => p.trim()).filter(Boolean);
  if (parts.length < 2) return null;
  return {
    name: parts[0],
    dosage: parts[1] || "",
    timing: parts.slice(2).join(" - ") || "",
  };
}

function parseMealHeader(line: string): { name: string; time?: string } | null {
  const m = line.match(/^\s*(?:öğün|ogun|meal)\s*:\s*(.+)$/i);
  if (!m) return null;
  const parts = m[1].split(DASH).map((p) => p.trim()).filter(Boolean);
  if (parts.length === 0) return null;
  return {
    name: parts[0],
    time: parts[1] || undefined,
  };
}

/**
 * Yiyecek satırı:
 *   "Tavuk göğsü 200g 330kcal 62P 0K 7Y"
 *   "Yulaf 80g"  (makro yok — hepsi 0)
 *
 * Algoritma:
 * - Sondan tokenları sök: 7Y → fat, 0K → carbs, 62P → protein, 330kcal → calories
 * - Tüm makro/kalori token'ları çekildikten sonra son token = porsiyon
 * - Geri kalan = isim
 */
function parseFoodLine(line: string):
  | { name: string; portion: string; calories: number; protein: number; carbs: number; fat: number }
  | null {
  const tokens = line.trim().split(/\s+/);
  if (tokens.length < 2) return null;

  let calories = 0;
  let protein = 0;
  let carbs = 0;
  let fat = 0;

  // Sondan tara — makro/kalori token'larını çıkar
  while (tokens.length > 2) {
    const last = tokens[tokens.length - 1];
    const macroMatch = last.match(/^(\d+(?:[.,]\d+)?)(kcal|cal|kkal|p|protein|k|karb|c|carb|y|yag|yağ|f|fat)$/i);
    if (!macroMatch) break;
    const val = parseNumber(macroMatch[1]) ?? 0;
    const suffix = macroMatch[2].toLowerCase();
    if (suffix === "kcal" || suffix === "cal" || suffix === "kkal") calories = val;
    else if (suffix === "p" || suffix === "protein") protein = val;
    else if (suffix === "k" || suffix === "karb" || suffix === "c" || suffix === "carb") carbs = val;
    else if (suffix === "y" || suffix === "yag" || suffix === "yağ" || suffix === "f" || suffix === "fat") fat = val;
    tokens.pop();
  }

  if (tokens.length < 2) return null;

  // Son token = porsiyon (örn "200g", "3 adet" — birden çok token olabilir aslında)
  // Porsiyon en az 1, en fazla 3 token olabilir. Basit yaklaşım: son 1 token = porsiyon, geri kalan = ad.
  // Daha esnek: porsiyonun rakamla başlaması beklenir.
  let portionStart = tokens.length - 1;
  while (portionStart > 0 && /^\d/.test(tokens[portionStart - 1])) portionStart--;
  // En az 1 token, en fazla 3 token porsiyon
  if (tokens.length - portionStart > 3) portionStart = tokens.length - 3;
  if (portionStart === 0) portionStart = tokens.length - 1; // güvenlik: en az 1 token ad olsun

  const portion = tokens.slice(portionStart).join(" ").trim();
  const name = tokens.slice(0, portionStart).join(" ").trim();
  if (!name || !portion) return null;

  return { name, portion, calories, protein, carbs, fat };
}

export interface NutritionTextParseInput {
  text: string;
  fallbackName?: string;
}

export function parseNutritionText(input: NutritionTextParseInput): NutritionTextParseResult {
  const lines = input.text.split(/\r?\n/);
  let planName = input.fallbackName?.trim() || "";
  let targetCalories: number | undefined;
  let targetProtein: number | undefined;
  let targetCarbs: number | undefined;
  let targetFat: number | undefined;
  let coachNotes: string | undefined;
  const supplements: NonNullable<ImportNutritionData["supplements"]> = [];
  const meals: ImportNutritionData["meals"] = [];
  let currentMeal: (typeof meals)[number] | null = null;

  for (let i = 0; i < lines.length; i++) {
    const raw = lines[i];
    const line = raw.trim();
    if (!line) {
      currentMeal = null;
      continue;
    }

    const planFromBody = parsePlanLine(line);
    if (planFromBody) {
      planName = planFromBody;
      continue;
    }

    const target = parseTargetLine(line);
    if (target) {
      if (target.kind === "cal") targetCalories = target.value;
      if (target.kind === "p") targetProtein = target.value;
      if (target.kind === "c") targetCarbs = target.value;
      if (target.kind === "f") targetFat = target.value;
      continue;
    }

    const note = parseNoteLine(line);
    if (note) {
      coachNotes = coachNotes ? `${coachNotes}\n${note}` : note;
      continue;
    }

    const sup = parseSupplementLine(line);
    if (sup) {
      supplements.push(sup);
      continue;
    }

    const mealHeader = parseMealHeader(line);
    if (mealHeader) {
      currentMeal = {
        name: mealHeader.name,
        time: mealHeader.time,
        foods: [],
      };
      meals.push(currentMeal);
      continue;
    }

    // Yiyecek satırı
    if (!currentMeal) {
      return {
        ok: false,
        error: 'Yiyecek satırı için önce "Öğün: <ad> - <saat>" başlığı yazmalısın',
        line: i + 1,
      };
    }
    const food = parseFoodLine(line);
    if (!food) {
      return {
        ok: false,
        error: 'Yiyecek satırı anlaşılamadı. Beklenen: "Yulaf 80g 300kcal 10P 54K 6Y" (makro opsiyonel)',
        line: i + 1,
      };
    }
    currentMeal.foods.push(food);
  }

  if (!planName) {
    return {
      ok: false,
      error: 'Plan adı eksik. Üstteki "Plan adı" alanını doldur ya da metnin başına "Plan: <ad>" yaz.',
    };
  }
  if (meals.length === 0) {
    return { ok: false, error: 'Hiç öğün bulunamadı. En az bir "Öğün: <ad>" başlığı gerekli.' };
  }
  const emptyMeal = meals.find((m) => m.foods.length === 0);
  if (emptyMeal) {
    return { ok: false, error: `"${emptyMeal.name}" için hiç yiyecek yok.` };
  }

  const totalFoods = meals.reduce((sum, m) => sum + m.foods.length, 0);

  return {
    ok: true,
    data: {
      name: planName.slice(0, 200),
      targetCalories,
      targetProtein,
      targetCarbs,
      targetFat,
      coachNotes: coachNotes?.slice(0, 500),
      supplements: supplements.length > 0 ? supplements : undefined,
      meals,
    },
    preview: { meals: meals.length, foods: totalFoods, supplements: supplements.length },
  };
}

export const NUTRITION_TEXT_EXAMPLE = `Plan: Bulk Beslenme Planı
Hedef kalori: 2800
Hedef protein: 180
Hedef karbonhidrat: 350
Hedef yağ: 80
Not: Antrenman günlerinde karbonhidrat arttırılabilir

Takviye: Whey Protein - 30g - Antrenman sonrası
Takviye: Multivitamin - 1 adet - Sabah

Öğün: Kahvaltı - 08:00
Yulaf 80g 300kcal 10P 54K 6Y
Yumurta 3 adet 210kcal 18P 1K 15Y

Öğün: Öğle Yemeği - 13:00
Tavuk göğsü 200g 330kcal 62P 0K 7Y
Pirinç 150g 195kcal 4P 43K 0Y

Öğün: Akşam Yemeği - 19:00
Somon 180g 360kcal 36P 0K 22Y
Tatlı patates 150g 130kcal 2P 30K 0Y`;
