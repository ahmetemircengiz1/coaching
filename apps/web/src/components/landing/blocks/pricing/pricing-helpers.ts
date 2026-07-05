// Paket (pricing) blokları için ortak yardımcılar.
//
// Tüm paket blokları koçun ayarlar sayfasından girdiği `content.packages`
// verisini kullanır; CTA butonları öğrencinin kayıt olup paketi satın aldığı
// auth sayfasına yönlendirir.

import type { LandingThemeContent, LandingPackage } from "../../types";

const SYMBOLS: Record<string, string> = {
  TRY: "₺",
  USD: "$",
  EUR: "€",
  GBP: "£",
};

/** Fiyatı görüntü parçalarına ayırır (tutar + sembol + sembol konumu). */
export function priceParts(pkg: LandingPackage): {
  amount: string;
  symbol: string;
  before: boolean;
} {
  const symbol = SYMBOLS[pkg.currency] || pkg.currency || "₺";
  const before = symbol === "$" || symbol === "€" || symbol === "£";
  const amount = Number.isFinite(pkg.price)
    ? pkg.price.toLocaleString("tr-TR")
    : String(pkg.price);
  return { amount, symbol, before };
}

/** CTA hedefi: öğrencinin kayıt olup paketi satın aldığı auth sayfası. */
export function packageHref(
  content: LandingThemeContent,
  pkg: LandingPackage
): string {
  const base = content.authUrl || "#";
  return `${base}?package=${encodeURIComponent(pkg.id)}`;
}

/** Vurgulanacak (popüler) kart indeksi — 3+ pakette orta, 2 pakette ikinci. */
export function highlightIndex(n: number): number {
  if (n >= 3) return Math.floor(n / 2);
  if (n === 2) return 1;
  return -1;
}

/** Paket süresi etiketi ("3 aylık" vb.) — aylık/yıllık toggle değil, paketin kendi süresi. */
export function durationLabel(pkg: LandingPackage): string {
  return pkg.duration > 0 ? `${pkg.duration} aylık paket` : "";
}
