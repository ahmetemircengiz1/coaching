"use client";

import { useParams } from "next/navigation";

/**
 * Öğrenci doğrulama linkinin açtığı sekmenin indiği sayfa. Kayıt burada
 * TAMAMLANMAZ: kaydın başladığı sekme oturumu algılayıp hesabı tamamlar ve
 * panele geçer. O sekme kapatıldıysa buradaki butonla devam edilebilir
 * (complete sayfası hesabı idempotent şekilde tamamlar).
 */
export default function StudentVerifiedPage() {
  const params = useParams();
  const domain = params.domain as string;

  return (
    <div
      className="min-h-screen flex items-center justify-center px-4"
      style={{ backgroundColor: "#111111" }}
    >
      <div className="w-full max-w-md text-center space-y-6">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-emerald-500/10 border border-emerald-500/25">
          <svg className="h-8 w-8 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h1 className="text-2xl font-bold text-white">E-postan doğrulandı</h1>
        <p className="text-sm leading-relaxed text-white/60">
          Kayıt işlemine başladığın sekme otomatik olarak paneline geçti.
          <span className="text-white font-semibold"> Bu sekmeyi kapatabilirsin.</span>
        </p>
        <div className="space-y-3 pt-2">
          <button
            type="button"
            onClick={() => window.close()}
            className="w-full h-12 rounded-xl bg-white font-semibold text-black transition hover:bg-white/90"
          >
            Bu Sekmeyi Kapat
          </button>
          <a
            href={`/site/${domain}/auth/complete`}
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
