// Hakkımda bloklarının istatistiklerini opsiyonel hale getiren ortak mantık.
//
// Davranış:
// - aboutStatsHidden "1" ise hiç istatistik dönmez (koç bölümü tamamen kapatmış)
// - Koç en az bir istatistik alanı doldurduysa YALNIZ dolu olanlar döner
// - Hiçbir alan dolu değilse bloğun kendi default seti aynen döner
//   (yeni kurulan siteler boş görünmesin)

import type { LandingTexts } from "../../types";

export interface AboutStat {
  v: string;
  l: string;
}

export function resolveAboutStats(
  texts: LandingTexts | null | undefined,
  defaults: AboutStat[]
): AboutStat[] {
  if (texts?.aboutStatsHidden === "1") return [];
  const entered = [
    { v: texts?.aboutStat1Value?.trim(), l: texts?.aboutStat1Label?.trim() },
    { v: texts?.aboutStat2Value?.trim(), l: texts?.aboutStat2Label?.trim() },
    { v: texts?.aboutStat3Value?.trim(), l: texts?.aboutStat3Label?.trim() },
  ];
  const anyEntered = entered.some((s) => s.v || s.l);
  if (!anyEntered) return defaults;
  return entered
    .filter((s) => s.v || s.l)
    .map((s) => ({ v: s.v || "", l: s.l || "" }));
}
