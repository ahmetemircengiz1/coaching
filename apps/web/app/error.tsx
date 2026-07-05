"use client";

import { useEffect } from "react";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Sentry kurulduğunda otomatik yakalanır (instrumentation-client/server).
    // Eski console.error bilinçli olarak korunuyor — runtime stderr için.
    console.error("Uygulama hatası:", error);
  }, [error]);

  return (
    <div className="min-h-screen bg-[#111111] text-white flex items-center justify-center px-6">
      <div className="text-center max-w-lg">
        <div className="text-6xl md:text-7xl font-heading font-bold tracking-tight mb-4 text-red-400/70">
          500
        </div>
        <h1 className="font-heading text-2xl md:text-3xl font-bold mb-3">
          Bir şeyler ters gitti
        </h1>
        <p className="text-white/60 mb-2 leading-relaxed">
          Hata kaydedildi, ekibimiz konuyu inceleyecek.
        </p>
        {error.digest && (
          <p className="text-xs text-white/40 mb-8 font-mono">
            Referans: {error.digest}
          </p>
        )}
        <button
          onClick={reset}
          className="rounded-full bg-[#ccff00] px-6 py-3 text-sm font-bold text-black hover:opacity-90 transition cursor-pointer"
        >
          Tekrar dene
        </button>
      </div>
    </div>
  );
}
