import React from "react";
import type { LandingThemeContent } from "../../types";
import type { EliteGlobalStyles } from "../../elite-config";

/**
 * StatsSimpleCard — peakfitness esinli.
 * Sade, kapalı bir kart içinde 4'lü istatistik satırı; ince dikey ayraçlar.
 * "Daha sade bir tasarım isteyenler" için minimal seçenek.
 *
 * inspiredBy: https://peakfitness.framer.website/
 */
export function StatsSimpleCard({
  content,
  config,
}: {
  content: LandingThemeContent;
  config?: EliteGlobalStyles;
}) {
  const texts = content.landingTexts;
  const bg = config?.backgroundColor || "#0a0a0a";

  const stats = [
    { value: texts?.stat1Value || "500+", label: texts?.stat1Label || "Aktif Öğrenci" },
    { value: texts?.stat2Value || "1.200+", label: texts?.stat2Label || "Tamamlanan Seans" },
    { value: texts?.stat3Value || "%94", label: texts?.stat3Label || "Başarı Oranı" },
    {
      value: content.programCount > 0 ? `${content.programCount}` : "25+",
      label: "Program",
    },
  ];

  return (
    <section className="py-20 px-6" style={{ backgroundColor: bg }}>
      <div className="max-w-5xl mx-auto rounded-3xl border border-white/10 bg-white/[0.03] px-6 py-14 sm:py-16">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-y-10">
          {stats.map((s, i) => (
            <div
              key={i}
              className={i > 0 ? "text-center md:border-l border-white/10" : "text-center"}
            >
              <div className="text-4xl sm:text-5xl font-bold text-white">{s.value}</div>
              <div className="mt-2 text-xs sm:text-sm uppercase tracking-[0.15em] text-white/45">
                {s.label}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
