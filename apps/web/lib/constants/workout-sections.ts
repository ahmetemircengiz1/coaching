/**
 * Antrenman gününün içindeki bölümler. Koçlardan gelen istek üzerine karın ve
 * kardiyo, ayrı programlar yerine günün içinde ayrı bloklar olarak duruyor:
 * koç Salı gününe hem ana antrenmanı hem 3 karın hareketini hem de 20 dk
 * kardiyoyu koyabiliyor; sadece kardiyodan oluşan bir gün de açabiliyor.
 *
 * DB'de String olarak saklanır (Prisma enum'u değil) — proje geneli bu deseni
 * kullanıyor ve ileride bölüm eklemek migration gerektirmiyor.
 */

export const WORKOUT_SECTIONS = ["MAIN", "CORE", "CARDIO"] as const;
export type WorkoutSection = (typeof WORKOUT_SECTIONS)[number];

export const SECTION_META: Record<WorkoutSection, { label: string; icon: string }> = {
  MAIN: { label: "Ana Antrenman", icon: "🏋️" },
  CORE: { label: "Karın", icon: "🔥" },
  CARDIO: { label: "Kardiyo", icon: "🏃" },
};

export const CARDIO_TYPES = ["LISS", "HIIT", "INTERVAL", "STEADY"] as const;
export type CardioType = (typeof CARDIO_TYPES)[number];

export const CARDIO_TYPE_LABELS: Record<CardioType, string> = {
  LISS: "LISS (düşük tempo, sürekli)",
  HIIT: "HIIT (yüksek yoğunluklu interval)",
  INTERVAL: "Interval",
  STEADY: "Sabit tempo",
};

/** Satır içinde gösterilen kısa hâl — uzun etiket listeyi taşırıyor. */
export const CARDIO_TYPE_SHORT: Record<CardioType, string> = {
  LISS: "LISS",
  HIIT: "HIIT",
  INTERVAL: "Interval",
  STEADY: "Sabit tempo",
};

export const INTENSITIES = ["LOW", "MEDIUM", "HIGH"] as const;
export type Intensity = (typeof INTENSITIES)[number];

export const INTENSITY_LABELS: Record<Intensity, string> = {
  LOW: "Düşük",
  MEDIUM: "Orta",
  HIGH: "Yüksek",
};

export function isWorkoutSection(value: unknown): value is WorkoutSection {
  return typeof value === "string" && (WORKOUT_SECTIONS as readonly string[]).includes(value);
}

export function toWorkoutSection(value: unknown): WorkoutSection {
  return isWorkoutSection(value) ? value : "MAIN";
}

/**
 * Egzersizin kütüphane kategorisinden bölüm önerir. Seed'deki kategoriler tam
 * olarak "Karın" ve "Kardio" — 33 hazır hareket birebir eşleşiyor.
 */
export function suggestSection(category: string | null | undefined): WorkoutSection {
  if (!category) return "MAIN";
  const c = category.toLocaleLowerCase("tr").replace(/ı/g, "i");
  if (c.includes("karin") || c.includes("core") || c.includes("abs")) return "CORE";
  if (c.includes("kardio") || c.includes("kardiyo") || c.includes("cardio")) return "CARDIO";
  return "MAIN";
}

/** "25 dk · LISS · Orta" — koç ve öğrenci ekranı aynı biçimi kullanır. */
export function formatCardio(input: {
  durationMinutes?: number | null;
  cardioType?: string | null;
  intensity?: string | null;
}): string {
  const parts: string[] = [];
  if (input.durationMinutes) parts.push(`${input.durationMinutes} dk`);
  if (input.cardioType && input.cardioType in CARDIO_TYPE_SHORT) {
    parts.push(CARDIO_TYPE_SHORT[input.cardioType as CardioType]);
  }
  if (input.intensity && input.intensity in INTENSITY_LABELS) {
    parts.push(INTENSITY_LABELS[input.intensity as Intensity]);
  }
  return parts.join(" · ") || "-";
}
