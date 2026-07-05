/**
 * Antrenman programını CSV'den parse eder.
 *
 * Beklenen sütunlar (sıra serbest; başlık satırı zorunlu):
 *   Hafta, Gün, Antrenman Adı, Egzersiz, Set, Tekrar, Dinlenme, Not
 *
 * Türkçe Excel ve Google Sheets ile uyumlu:
 * - UTF-8 BOM kabul
 * - Virgül veya noktalı virgül ayırıcı
 * - Tırnak içi metin
 */

import type { ImportProgramData } from "@/app/site/[domain]/dashboard/programs/actions";
import { parseCsv, toCsvRow } from "./csv-utils";

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
  "1": 1,
  "2": 2,
  "3": 3,
  "4": 4,
  "5": 5,
  "6": 6,
  "7": 7,
};

export interface ProgramCsvParseResult {
  ok: boolean;
  data?: ImportProgramData;
  error?: string;
  line?: number;
  preview?: { workouts: number; exercises: number };
}

export interface ProgramCsvParseInput {
  csv: string;
  name: string;
  weeks?: number;
  description?: string;
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

/** Başlık adından kanonik anahtar üret. "Dinlenme (sn)" → "dinlenme" */
function canonicalKey(header: string): string {
  const n = normalizeHeader(header);
  if (n.startsWith("hafta")) return "week";
  if (n.startsWith("gun")) return "day";
  if (n.startsWith("antrenman")) return "workout";
  if (n.startsWith("egzersiz") || n.startsWith("hareket")) return "exercise";
  if (n.startsWith("set")) return "sets";
  if (n.startsWith("tekrar") || n.startsWith("rep")) return "reps";
  if (n.startsWith("dinlenme") || n.startsWith("rest") || n.startsWith("mola")) return "rest";
  if (n.startsWith("not") || n.startsWith("aciklama")) return "notes";
  return n;
}

export function parseProgramCsv(input: ProgramCsvParseInput): ProgramCsvParseResult {
  const planName = input.name.trim();
  if (!planName) {
    return { ok: false, error: "Plan adı boş olamaz." };
  }

  const rows = parseCsv(input.csv);
  if (rows.length < 2) {
    return { ok: false, error: "CSV en az başlık + 1 satır içermeli." };
  }

  // İlk satır = başlıklar
  const headers = rows[0].map(canonicalKey);
  const idx = {
    week: headers.indexOf("week"),
    day: headers.indexOf("day"),
    workout: headers.indexOf("workout"),
    exercise: headers.indexOf("exercise"),
    sets: headers.indexOf("sets"),
    reps: headers.indexOf("reps"),
    rest: headers.indexOf("rest"),
    notes: headers.indexOf("notes"),
  };

  const required: (keyof typeof idx)[] = ["week", "day", "workout", "exercise", "sets", "reps"];
  for (const k of required) {
    if (idx[k] < 0) {
      return {
        ok: false,
        error: `Zorunlu sütun eksik: "${k === "week" ? "Hafta" : k === "day" ? "Gün" : k === "workout" ? "Antrenman Adı" : k === "exercise" ? "Egzersiz" : k === "sets" ? "Set" : "Tekrar"}"`,
      };
    }
  }

  // Group by (weekNumber, dayOfWeek, workoutName)
  type WorkoutMap = Map<string, ImportProgramData["workouts"][number]>;
  const map: WorkoutMap = new Map();
  let maxWeek = 0;

  for (let i = 1; i < rows.length; i++) {
    const row = rows[i];
    const lineNo = i + 1;
    const weekStr = (row[idx.week] || "").trim();
    const dayStr = (row[idx.day] || "").trim();
    const workoutName = (row[idx.workout] || "").trim();
    const exerciseName = (row[idx.exercise] || "").trim();
    const setsStr = (row[idx.sets] || "").trim();
    const repsStr = (row[idx.reps] || "").trim();
    const restStr = idx.rest >= 0 ? (row[idx.rest] || "").trim() : "";
    const notes = idx.notes >= 0 ? (row[idx.notes] || "").trim() : "";

    if (!weekStr && !exerciseName) continue;

    const week = parseInt(weekStr, 10);
    if (!week || week < 1 || week > 52) {
      return { ok: false, error: `Hafta sayısı geçersiz: "${weekStr}"`, line: lineNo };
    }
    const day = DAY_MAP[dayStr.toLowerCase()];
    if (!day) {
      return { ok: false, error: `Gün anlaşılamadı: "${dayStr}" (Pazartesi-Pazar veya 1-7)`, line: lineNo };
    }
    if (!workoutName) {
      return { ok: false, error: "Antrenman adı boş", line: lineNo };
    }
    if (!exerciseName) {
      return { ok: false, error: "Egzersiz adı boş", line: lineNo };
    }
    const sets = parseInt(setsStr, 10);
    if (!sets || sets < 1 || sets > 50) {
      return { ok: false, error: `Set sayısı geçersiz: "${setsStr}"`, line: lineNo };
    }
    if (!repsStr) {
      return { ok: false, error: "Tekrar boş", line: lineNo };
    }

    let restSeconds: number | undefined;
    if (restStr) {
      const n = parseInt(restStr.replace(/[^\d]/g, ""), 10);
      if (Number.isFinite(n) && n >= 0 && n <= 600) restSeconds = n;
    }

    const key = `${week}|${day}|${workoutName.toLowerCase()}`;
    let workout = map.get(key);
    if (!workout) {
      workout = { weekNumber: week, dayOfWeek: day, name: workoutName, exercises: [] };
      map.set(key, workout);
      if (week > maxWeek) maxWeek = week;
    }
    workout.exercises.push({
      name: exerciseName,
      sets,
      reps: repsStr,
      ...(restSeconds !== undefined ? { restSeconds } : {}),
      ...(notes ? { notes } : {}),
    });
  }

  const workouts = [...map.values()];
  if (workouts.length === 0) {
    return { ok: false, error: "Hiç antrenman bulunamadı (başlık dışında veri yok)." };
  }
  const totalExercises = workouts.reduce((sum, w) => sum + w.exercises.length, 0);

  return {
    ok: true,
    data: {
      name: planName.slice(0, 200),
      description: input.description?.trim().slice(0, 500) || undefined,
      weeks: Math.max(maxWeek, input.weeks ?? 1),
      workouts,
    },
    preview: { workouts: workouts.length, exercises: totalExercises },
  };
}

/** Koçun indireceği başlangıç template'i (3 örnek satır + boş 5 satır). */
export function buildProgramCsvTemplate(): string {
  const header = ["Hafta", "Gün", "Antrenman Adı", "Egzersiz", "Set", "Tekrar", "Dinlenme (sn)", "Not"];
  const examples = [
    [1, "Pazartesi", "Push Günü", "Bench Press", 4, "8-10", 90, ""],
    [1, "Pazartesi", "Push Günü", "Shoulder Press", 3, "10-12", 60, "Isınma seti dahil"],
    [1, "Pazartesi", "Push Günü", "Lateral Raise", 3, "12-15", 45, ""],
    [1, "Salı", "Pull Günü", "Barbell Row", 4, "8-10", 90, ""],
    [1, "Salı", "Pull Günü", "Pull Up", 3, "amrap", 90, ""],
    [1, "Çarşamba", "Leg Günü", "Squat", 4, "6-8", 120, ""],
    [1, "Çarşamba", "Leg Günü", "Romanian Deadlift", 3, "10", 90, ""],
  ];
  return [toCsvRow(header), ...examples.map((r) => toCsvRow(r))].join("\n");
}
