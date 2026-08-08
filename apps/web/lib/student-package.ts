/**
 * Öğrencinin paket penceresi (başlangıç → bitiş → kalan süre) için TEK doğruluk kaynağı.
 *
 * Kural: DB'deki `Student.endDate` doluysa o kazanır (koç elle düzenlemiş veya
 * paketi uzatmıştır). Boşsa paket süresinden hesaplanır — bu, alan yazılmaya
 * başlamadan önce kaydolmuş öğrenciler için geriye dönük uyumluluk sağlar.
 */

const DAY_MS = 24 * 60 * 60 * 1000;

/** Paketin son 14 günü "bitiyor" sayılır — koç yenileme konuşmasını burada başlatır. */
export const ENDING_SOON_DAYS = 14;

export type PackageState = "none" | "active" | "endingSoon" | "expired";

export interface PackageWindow {
  startDate: Date;
  /** Paket yoksa ve endDate de yoksa null. */
  endDate: Date | null;
  /** Bitişe kalan tam gün (geçmişse 0). */
  remainingDays: number;
  /** Kalan günün hafta karşılığı (yukarı yuvarlanır). */
  remainingWeeks: number;
  /** Toplam paket süresi (gün). endDate yoksa 0. */
  totalDays: number;
  /** 0-100 arası tamamlanma yüzdesi. endDate yoksa 0. */
  progressPct: number;
  state: PackageState;
}

/** Paket süresinin (hafta) bitiş tarihine çevrilmiş hali. */
export function addWeeks(from: Date, weeks: number): Date {
  const d = new Date(from);
  d.setDate(d.getDate() + weeks * 7);
  return d;
}

export function resolvePackageWindow(input: {
  startDate: Date | string;
  endDate?: Date | string | null;
  /** CoachPackage.duration — hafta cinsinden. Paket atanmamışsa null. */
  packageDurationWeeks?: number | null;
  /** Test edilebilirlik için; verilmezse şimdiki zaman. */
  now?: Date;
}): PackageWindow {
  const startDate = new Date(input.startDate);
  const now = input.now ?? new Date();

  const stored = input.endDate ? new Date(input.endDate) : null;
  const derived =
    input.packageDurationWeeks && input.packageDurationWeeks > 0
      ? addWeeks(startDate, input.packageDurationWeeks)
      : null;
  const endDate = stored ?? derived;

  if (!endDate) {
    return {
      startDate,
      endDate: null,
      remainingDays: 0,
      remainingWeeks: 0,
      totalDays: 0,
      progressPct: 0,
      state: "none",
    };
  }

  const remainingMs = endDate.getTime() - now.getTime();
  const remainingDays = Math.max(0, Math.ceil(remainingMs / DAY_MS));
  const totalDays = Math.max(1, Math.round((endDate.getTime() - startDate.getTime()) / DAY_MS));
  const elapsedDays = Math.min(totalDays, Math.max(0, Math.round((now.getTime() - startDate.getTime()) / DAY_MS)));

  return {
    startDate,
    endDate,
    remainingDays,
    remainingWeeks: Math.ceil(remainingDays / 7),
    totalDays,
    progressPct: Math.round((elapsedDays / totalDays) * 100),
    state: remainingMs <= 0 ? "expired" : remainingDays <= ENDING_SOON_DAYS ? "endingSoon" : "active",
  };
}

/** "12 gün kaldı" / "3 hafta kaldı" — kısa süreleri günle, uzunları haftayla anlatır. */
export function formatRemaining(w: PackageWindow): string {
  if (w.state === "none") return "-";
  if (w.state === "expired") return "Süresi doldu";
  if (w.remainingDays <= 21) return `${w.remainingDays} gün`;
  return `${w.remainingWeeks} hafta`;
}
