import React from "react";
import type { LandingThemeContent } from "../../types";
import type { EliteGlobalStyles } from "../../elite-config";

/**
 * StatsMotivational — outpace esinli.
 * Tüm ekranı kaplayan sahne: üstte logo, ortada dev motive edici başlık,
 * altında dikey ayraçlı 3'lü istatistik satırı (accent renkli sayılar).
 *
 * Not: Motive edici başlık şu an sabit (landingTexts'te stats başlığı alanı yok);
 * ileride alan eklenirse `texts` üzerinden okunabilir.
 *
 * inspiredBy: https://outpace.framer.media/
 */
export function StatsMotivational({
  content,
  config,
}: {
  content: LandingThemeContent;
  config?: EliteGlobalStyles;
}) {
  const texts = content.landingTexts;
  const primary = config?.primaryColor || "#ccff00";
  const headingFont = 'var(--font-oswald), "Arial Narrow", sans-serif';

  const headline = "Hedeflerini Gerçek Sonuçlara Dönüştürüyoruz";

  const stats = [
    { value: texts?.stat1Value || "%92", label: texts?.stat1Label || "Hedefine Ulaştı" },
    { value: texts?.stat2Value || "650+", label: texts?.stat2Label || "Dönüşen Öğrenci" },
    { value: texts?.stat3Value || "10+", label: texts?.stat3Label || "Yıl Tecrübe" },
  ];

  return (
    <section className="relative min-h-[100svh] flex flex-col items-center justify-center bg-black px-6 py-24">
      {/* Üst aksan çizgisi */}
      <span
        className="mb-8 block h-1 w-12 rounded-full"
        style={{ background: primary }}
        aria-hidden
      />

      {/* Dev motive edici başlık */}
      <h2
        className="text-center font-black uppercase text-white max-w-4xl"
        style={{ fontFamily: headingFont, fontSize: "clamp(2.25rem, 5.5vw, 5rem)", lineHeight: 1.05 }}
      >
        {headline}
      </h2>

      {/* Dikey ayraçlı istatistik satırı */}
      <div className="mt-14 sm:mt-20 flex flex-col sm:flex-row items-center">
        {stats.map((s, i) => (
          <React.Fragment key={i}>
            {i > 0 && (
              <div className="hidden sm:block w-px h-16 bg-white/15 mx-10 lg:mx-16" aria-hidden />
            )}
            <div className="text-center px-4 py-4">
              <div
                className="font-black leading-none"
                style={{
                  fontSize: "clamp(2.5rem, 4.5vw, 4rem)",
                  color: primary,
                  fontFamily: headingFont,
                }}
              >
                {s.value}
              </div>
              <div className="mt-2 text-base text-white/70">{s.label}</div>
            </div>
          </React.Fragment>
        ))}
      </div>
    </section>
  );
}
