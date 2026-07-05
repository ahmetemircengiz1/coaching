import React from "react";
import type { LandingThemeContent } from "../../types";
import type { EliteGlobalStyles } from "../../elite-config";

/**
 * StatsFlowingStrip — rep-republic-gym esinli.
 * Yatay, yavaşça akan sonsuz şerit: istatistik kartları kesintisiz döner.
 * Saf CSS marquee — hover'da durur, reduced-motion'a saygılı. Foto yok.
 *
 * inspiredBy: https://rep-republic-gym.framer.website/
 */
export function StatsFlowingStrip({
  content,
  config,
}: {
  content: LandingThemeContent;
  config?: EliteGlobalStyles;
}) {
  const texts = content.landingTexts;
  const primary = config?.primaryColor || "#ccff00";
  const bg = config?.backgroundColor || "#0a0a0a";

  const stats = [
    { value: texts?.stat1Value || "500+", label: texts?.stat1Label || "Mutlu Öğrenci" },
    { value: texts?.stat2Value || "%94", label: texts?.stat2Label || "Başarı Oranı" },
    { value: texts?.stat3Value || "10+", label: texts?.stat3Label || "Yıl Tecrübe" },
  ];

  // Kesintisiz döngü: birim 4 kez tekrarlanır → translateX(-25%) ile tek birim kayar.
  const COPIES = 4;
  const items = Array.from({ length: COPIES }).flatMap(() => stats);

  return (
    <section className="py-16 sm:py-20 overflow-hidden" style={{ backgroundColor: bg }}>
      <div className="max-w-2xl mx-auto px-6 text-center mb-10">
        <span className="text-xs font-bold uppercase tracking-[0.28em]" style={{ color: primary }}>
          Rakamlarla Biz
        </span>
      </div>

      <div className="group relative flex">
        {/* Kenar fade — şeridin uçları yumuşar */}
        <div
          className="pointer-events-none absolute inset-y-0 left-0 w-16 sm:w-28 z-10"
          style={{ background: `linear-gradient(to right, ${bg}, transparent)` }}
        />
        <div
          className="pointer-events-none absolute inset-y-0 right-0 w-16 sm:w-28 z-10"
          style={{ background: `linear-gradient(to left, ${bg}, transparent)` }}
        />

        <div className="flex w-max animate-[stripFlow_32s_linear_infinite] group-hover:[animation-play-state:paused]">
          {items.map((s, i) => {
            // Accent deseni birim uzunluğuna göre periyodik → döngü kesintisiz
            const accent = i % stats.length === 1;
            return (
              <div
                key={i}
                className="mr-5 shrink-0 w-64 h-44 rounded-3xl border flex flex-col items-center justify-center"
                style={
                  accent
                    ? { background: primary, borderColor: primary }
                    : { background: "rgba(255,255,255,0.04)", borderColor: "rgba(255,255,255,0.1)" }
                }
              >
                <div
                  className="text-5xl lg:text-6xl font-black"
                  style={{ color: accent ? "#0a0a0a" : primary }}
                >
                  {s.value}
                </div>
                <div
                  className="mt-2 text-sm font-medium uppercase tracking-wide px-4 text-center"
                  style={{ color: accent ? "rgba(10,10,10,0.72)" : "rgba(255,255,255,0.55)" }}
                >
                  {s.label}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <style>{`
        @keyframes stripFlow {
          from { transform: translateX(0); }
          to { transform: translateX(-25%); }
        }
        @media (prefers-reduced-motion: reduce) {
          [class*="animate-[stripFlow"] { animation: none !important; }
        }
      `}</style>
    </section>
  );
}
