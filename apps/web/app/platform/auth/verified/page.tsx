"use client";

import { Suspense } from "react";
import { useSearchParams } from "next/navigation";

/**
 * Doğrulama linkinin açtığı sekmenin indiği sayfa. Kurulum burada DEVAM ETMEZ:
 * kaydın başladığı sekme oturumu algılayıp otomatik olarak kuruluma geçer.
 * O sekme kapatıldıysa buradaki butonla devam edilebilir.
 */
export default function VerifiedPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-[#050505] text-white flex items-center justify-center">
          <div className="animate-pulse text-white/40">Yükleniyor...</div>
        </div>
      }
    >
      <VerifiedContent />
    </Suspense>
  );
}

function VerifiedContent() {
  const searchParams = useSearchParams();
  const tier = searchParams.get("tier");

  return (
    <div className="min-h-screen bg-[#050505] text-white flex items-center justify-center px-6">
      <div className="w-full max-w-md text-center space-y-6">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-[#3d6fd1]/15 border border-[#3d6fd1]/25">
          <svg className="h-8 w-8 text-[#3d6fd1]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h1 className="font-heading text-2xl font-bold">E-postan doğrulandı</h1>
        <p className="text-sm leading-relaxed text-white/60">
          Kayıt işlemine başladığın sekme otomatik olarak site kurulumuna geçti.
          <span className="text-white font-semibold"> Bu sekmeyi kapatabilirsin.</span>
        </p>
        <div className="space-y-3 pt-2">
          <button
            type="button"
            onClick={() => window.close()}
            className="w-full h-12 rounded-xl bg-[#3d6fd1] font-semibold text-white transition hover:bg-[#2f57b8]"
          >
            Bu Sekmeyi Kapat
          </button>
          <a
            href={`/platform/onboarding${tier ? `?tier=${tier}` : ""}`}
            className="block w-full h-12 leading-[48px] rounded-xl border border-white/15 bg-transparent text-sm font-semibold text-white/80 transition hover:bg-white/5"
          >
            O sekmeyi kapattıysan buradan devam et
          </a>
        </div>
        <p className="text-xs text-white/30">
          Tarayıcı sekmeyi otomatik kapatmaya izin vermezse elle kapatabilirsin.
        </p>
      </div>
    </div>
  );
}
