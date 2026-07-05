"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

const STORAGE_KEY = "coach-os-cookie-consent";

type Consent = "accepted" | "rejected";

export function CookieBanner() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (!stored) setVisible(true);
    } catch {
      // localStorage erişilemez durumdaysa (private mode) banner'ı hiç gösterme — riskli durum
    }
  }, []);

  const respond = (value: Consent) => {
    try {
      localStorage.setItem(STORAGE_KEY, value);
    } catch {
      // ignore
    }
    setVisible(false);
  };

  if (!visible) return null;

  return (
    <div
      role="dialog"
      aria-label="Çerez tercihleri"
      className="fixed bottom-4 left-4 right-4 z-[9999] md:left-auto md:right-6 md:bottom-6 md:max-w-md"
    >
      <div className="rounded-2xl border border-white/10 bg-[#1a1a2e]/95 p-4 shadow-2xl backdrop-blur-xl text-white">
        <p className="text-sm leading-relaxed">
          Bu site, hizmeti sunmak ve anonim analitik için çerez kullanır.
          Zorunlu çerezler her zaman aktiftir. Detay için{" "}
          <Link href="/privacy" className="underline text-[#ccff00]">
            Gizlilik Politikası
          </Link>
          .
        </p>
        <div className="mt-3 flex gap-2">
          <button
            type="button"
            onClick={() => respond("rejected")}
            className="flex-1 rounded-lg border border-white/15 px-3 py-2 text-xs font-medium text-white/80 hover:bg-white/5 transition"
          >
            Yalnız zorunlu
          </button>
          <button
            type="button"
            onClick={() => respond("accepted")}
            className="flex-1 rounded-lg bg-[#ccff00] px-3 py-2 text-xs font-bold text-black hover:opacity-90 transition"
          >
            Tümünü kabul et
          </button>
        </div>
      </div>
    </div>
  );
}

/**
 * Sayfada client tarafında kullanmak için yardımcı:
 * Kullanıcı analitik onayı verdi mi? GoogleAnalytics ve benzeri
 * opsiyonel bileşenler buna göre kendini yüklemeyi kontrol edebilir.
 */
export function hasAnalyticsConsent(): boolean {
  if (typeof window === "undefined") return false;
  try {
    return localStorage.getItem(STORAGE_KEY) === "accepted";
  } catch {
    return false;
  }
}
