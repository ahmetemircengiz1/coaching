/**
 * Antrenman programını düz metinden parse eder.
 *
 * Beklenen format:
 *   Hafta 1 - Pazartesi - Push Günü
 *   Bench Press 4x8-10 90sn
 *   Shoulder Press 3x10-12 60sn (yorum opsiyonel)
 *
 * Esneklik:
 * - Tire: "-", "–", "—" hepsi kabul.
 * - Gün adı: Pazartesi/Salı/Çarşamba/Perşembe/Cuma/Cumartesi/Pazar (büyük/küçük fark etmez).
 * - Dinlenme: "90sn", "1.5dk", "2dk", "60s", "1m30s" — saniyeye çevrilir.
 * - Not: parantez içinde, son alan.
 * - Plan adı için ilk satır "Plan: <ad>" veya "Program: <ad>" olabilir (opsiyonel).
 */

import type { ImportProgramData } from "@/app/site/[domain]/dashboard/programs/actions";

const DAY_MAP: Record<string, number> = {
  pazartesi: 1,
  salı: 2,
  sali: 2,
  çarşamba: 3,
  carsamba: 3,
  perşembe: 4,
  persembe: 4,
  cuma: 5,
  cumartesi: 6,
  pazar: 7,
};

const DASH = /\s*[-–—]\s*/;

export interface ProgramTextParseResult {
  ok: boolean;
  data?: ImportProgramData;
  error?: string;
  /** 1-indexed satır numarası (hata mesajında kullanılır) */
  line?: number;
  /** UI önizleme için işlenen workout sayısı */
  preview?: { workouts: number; exercises: number };
}

function normalizeKey(s: string): string {
  return s.trim().toLowerCase();
}

function parseDay(token: string): number | null {
  const key = normalizeKey(token);
  return DAY_MAP[key] ?? null;
}

/**
 * "90sn" → 90, "1.5dk" → 90, "2dk" → 120, "1dk30sn" → 90, "60s" → 60
 * "90" → 90 (sn varsayılır)
 * Çevrilemezse null.
 */
function parseRestSeconds(token: string): number | null {
  const s = token.toLowerCase().replace(/\s+/g, "").replace(",", ".");
  if (!s) return null;

  // "1dk30sn" formatı
  const compound = s.match(/^(\d+)\s*(?:dk|dak|min|m)(\d+)\s*(?:sn|s|sec)?$/);
  if (compound) {
    return Number(compound[1]) * 60 + Number(compound[2]);
  }

  // "1.5dk" / "2dk" / "1min"
  const min = s.match(/^(\d+(?:\.\d+)?)\s*(?:dk|dak|min|m)$/);
  if (min) return Math.round(Number(min[1]) * 60);

  // "90sn" / "60s" / "60sec"
  const sec = s.match(/^(\d+(?:\.\d+)?)\s*(?:sn|s|sec)?$/);
  if (sec) return Math.round(Number(sec[1]));

  return null;
}

/** Egzersiz satırını parse eder. Sondan başlayarak token sökerek esnek davranır. */
function parseExerciseLine(line: string):
  | { name: string; sets: number; reps: string; restSeconds?: number; notes?: string }
  | null {
  let work = line.trim();

  // 1) Not (parantez içi)
  let notes: string | undefined;
  const noteMatch = work.match(/\(([^)]*)\)\s*$/);
  if (noteMatch) {
    notes = noteMatch[1].trim() || undefined;
    work = work.slice(0, noteMatch.index).trim();
  }

  // 2) Dinlenme (son token, "90sn"/"1.5dk"/"1dk30sn")
  let restSeconds: number | undefined;
  const tokens = work.split(/\s+/);
  if (tokens.length >= 2) {
    const last = tokens[tokens.length - 1];
    const parsed = parseRestSeconds(last);
    if (parsed !== null && /[a-z]/i.test(last)) {
      // Sadece "dk/sn/min" eki varsa dinlenme olarak kabul et — saf sayıyı reps zannetme
      restSeconds = parsed;
      tokens.pop();
    }
  }

  // 3) Set × Reps — "Nx..." formatına uyan ilk token'ı bul.
  // Üç desen destekler:
  //   "4x8-10"      → tek token, reps "8-10"
  //   "3x amrap"    → iki token, reps "amrap"
  //   "3x 5/5/5"    → iki+ token, reps "5/5/5"
  if (tokens.length < 2) return null;
  let setRepsIdx = -1;
  let sets = 0;
  let inlineReps = "";
  for (let i = tokens.length - 1; i >= 1; i--) {
    const t = tokens[i];
    const m = t.match(/^(\d+)\s*[xX×](.*)$/);
    if (m) {
      const n = parseInt(m[1], 10);
      if (n >= 1 && n <= 50) {
        sets = n;
        inlineReps = (m[2] || "").trim();
        setRepsIdx = i;
        break;
      }
    }
  }
  if (setRepsIdx < 0 || !sets) return null;

  const reps = (inlineReps + " " + tokens.slice(setRepsIdx + 1).join(" ")).trim();
  if (!reps) return null;

  // 4) Geriye kalan = egzersiz adı
  const name = tokens.slice(0, setRepsIdx).join(" ").trim();
  if (!name) return null;

  return { name, sets, reps, restSeconds, notes };
}

/** Başlık satırı: "Hafta 1 - Pazartesi - Push Günü" */
function parseWorkoutHeader(line: string):
  | { weekNumber: number; dayOfWeek: number; name: string }
  | null {
  const parts = line.split(DASH).map((p) => p.trim()).filter(Boolean);
  if (parts.length < 3) return null;

  // "Hafta N" veya "N. Hafta"
  const weekMatch = parts[0].match(/(\d+)\s*\.?\s*hafta|hafta\s*(\d+)/i);
  if (!weekMatch) return null;
  const weekNumber = parseInt(weekMatch[1] || weekMatch[2], 10);
  if (!weekNumber || weekNumber < 1 || weekNumber > 52) return null;

  const dayOfWeek = parseDay(parts[1]);
  if (!dayOfWeek) return null;

  const name = parts.slice(2).join(" - ").trim();
  if (!name) return null;

  return { weekNumber, dayOfWeek, name };
}

/**
 * Plan adı için opsiyonel başlık satırı yakalar:
 *   "Plan: Push Pull Legs"
 *   "Program: Push Pull Legs"
 */
function parsePlanHeader(line: string): string | null {
  const m = line.match(/^\s*(?:plan|program)\s*:\s*(.+)$/i);
  if (!m) return null;
  return m[1].trim();
}

export interface ProgramTextParseInput {
  text: string;
  /** Dialog'dan gelen üst-bilgi (body'de override edebilir) */
  fallbackName?: string;
  fallbackWeeks?: number;
  fallbackDescription?: string;
}

export function parseProgramText(input: ProgramTextParseInput): ProgramTextParseResult {
  const lines = input.text.split(/\r?\n/);
  let planName = input.fallbackName?.trim() || "";
  const description = input.fallbackDescription?.trim() || "";

  type Workout = ImportProgramData["workouts"][number];
  const workouts: Workout[] = [];
  let current: Workout | null = null;
  let maxWeek = 0;

  for (let i = 0; i < lines.length; i++) {
    const raw = lines[i];
    const line = raw.trim();
    if (!line) {
      current = null;
      continue;
    }

    // Plan başlığı
    const planFromBody = parsePlanHeader(line);
    if (planFromBody) {
      planName = planFromBody;
      continue;
    }

    // Workout başlığı
    const header = parseWorkoutHeader(line);
    if (header) {
      current = {
        weekNumber: header.weekNumber,
        dayOfWeek: header.dayOfWeek,
        name: header.name,
        exercises: [],
      };
      workouts.push(current);
      if (header.weekNumber > maxWeek) maxWeek = header.weekNumber;
      continue;
    }

    // Egzersiz satırı — bir workout başlığının altında olmalı
    if (!current) {
      return {
        ok: false,
        error: `Egzersiz satırı için önce "Hafta X - Gün - Antrenman Adı" başlığı yazmalısın`,
        line: i + 1,
      };
    }
    const ex = parseExerciseLine(line);
    if (!ex) {
      return {
        ok: false,
        error: `Egzersiz satırı anlaşılamadı. Beklenen: "Egzersiz Adı 4x8-10 90sn (opsiyonel not)"`,
        line: i + 1,
      };
    }
    current.exercises.push(ex);
  }

  if (!planName) {
    return {
      ok: false,
      error: 'Plan adı eksik. Üstteki "Program adı" alanını doldur ya da metnin başına "Plan: <ad>" yaz.',
    };
  }
  if (workouts.length === 0) {
    return { ok: false, error: "Hiç antrenman bulunamadı. En az bir 'Hafta X - Gün - Antrenman Adı' başlığı gerekli." };
  }

  // Boş workout'ları reddet
  const empty = workouts.find((w) => w.exercises.length === 0);
  if (empty) {
    return {
      ok: false,
      error: `"Hafta ${empty.weekNumber} - ${empty.name}" için hiç egzersiz yok.`,
    };
  }

  const weeks = Math.max(maxWeek, input.fallbackWeeks ?? 1);
  const totalExercises = workouts.reduce((sum, w) => sum + w.exercises.length, 0);

  return {
    ok: true,
    data: {
      name: planName.slice(0, 200),
      description: description.slice(0, 500) || undefined,
      weeks,
      workouts,
    },
    preview: { workouts: workouts.length, exercises: totalExercises },
  };
}

export const PROGRAM_TEXT_EXAMPLE = `Plan: Push Pull Legs - 4 Hafta

Hafta 1 - Pazartesi - Push Günü
Bench Press 4x8-10 90sn
Shoulder Press 3x10-12 60sn (ısınma seti dahil)
Lateral Raise 3x12-15 45sn
Tricep Pushdown 3x12-15 45sn

Hafta 1 - Salı - Pull Günü
Barbell Row 4x8-10 90sn
Pull Up 3x amrap 90sn
Face Pull 3x15 45sn
Bicep Curl 3x12 45sn

Hafta 1 - Çarşamba - Leg Günü
Squat 4x6-8 2dk
Romanian Deadlift 3x10 90sn
Leg Press 3x12 90sn
Calf Raise 4x15 30sn`;
