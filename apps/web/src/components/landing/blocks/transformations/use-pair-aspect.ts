"use client";

import { useEffect, useState } from "react";

/**
 * Önce/sonra fotoğraf çiftinin gerçek en-boy oranını ölçer ve kutunun
 * alacağı ortak oranı döndürür. İki foto yan yana aynı yükseklikte durduğu
 * için uzun (dar) olana uyulur; daha geniş olan hafifçe kenarlardan kırpılır.
 * Aşırı uç oranlar layout'u bozmasın diye [0.42, 1.1] aralığına sıkıştırılır
 * (0.42 ≈ 9:21 dikey, 1.1 ≈ hafif yatay). Fotoğraflar yüklenene kadar
 * fallback oran kullanılır.
 */
export function usePairAspect(
  beforeSrc: string | null | undefined,
  afterSrc: string | null | undefined,
  fallback = 4 / 5
): number {
  const [ratio, setRatio] = useState<number | null>(null);

  useEffect(() => {
    let alive = true;
    setRatio(null);
    if (!beforeSrc || !afterSrc) return;

    const measure = (src: string) =>
      new Promise<number | null>((resolve) => {
        const img = new Image();
        img.onload = () =>
          resolve(img.naturalHeight > 0 ? img.naturalWidth / img.naturalHeight : null);
        img.onerror = () => resolve(null);
        img.src = src;
      });

    Promise.all([measure(beforeSrc), measure(afterSrc)]).then((vals) => {
      if (!alive) return;
      const ok = vals.filter((v): v is number => v != null && Number.isFinite(v) && v > 0);
      if (ok.length) setRatio(Math.min(...ok));
    });

    return () => {
      alive = false;
    };
  }, [beforeSrc, afterSrc]);

  if (ratio == null) return fallback;
  return Math.min(1.1, Math.max(0.42, ratio));
}
