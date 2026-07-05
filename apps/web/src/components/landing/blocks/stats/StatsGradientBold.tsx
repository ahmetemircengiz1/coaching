import React from "react";
import type { LandingThemeContent } from "../../types";
import type { EliteGlobalStyles } from "../../elite-config";

/**
 * StatsGradientBold — fitflow esinli.
 * Dev tipografi + renkli gradient sayılar. Her sayı farklı bir gradient tonu
 * taşır ve gradient yumuşakça kayar. Arkada dev, soluk bir kelime.
 *
 * inspiredBy: https://fitflow-template.framer.website/
 */
export function StatsGradientBold({
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
    { value: texts?.stat2Value || "1.2K+", label: texts?.stat2Label || "Tamamlanan Seans" },
    { value: texts?.stat3Value || "%94", label: texts?.stat3Label || "Başarı Oranı" },
  ];

  // Her sütun için ayrı gradient tonu (fitflow'daki renkli his)
  const gradients = [
    "linear-gradient(120deg, #f472b6, #ec4899, #f472b6)",
    "linear-gradient(120deg, #c084fc, #a855f7, #c084fc)",
    "linear-gradient(120deg, #818cf8, #6366f1, #818cf8)",
  ];

  const bigWord = (content.brandName?.split(" ")[0] || "Ekip").toUpperCase();

  return (
    <section className="relative py-28 px-6 overflow-hidden" style={{ backgroundColor: bg }}>
      {/* Arkada dev soluk kelime */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none select-none">
        <span
          className="font-black uppercase text-white/[0.04] leading-none whitespace-nowrap"
          style={{ fontSize: "clamp(8rem, 22vw, 20rem)" }}
        >
          {bigWord}
        </span>
      </div>

      <div className="relative max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <span className="text-xs font-bold uppercase tracking-[0.25em] text-white/50">
            Rakamlarla Biz
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-12 sm:gap-8">
          {stats.map((s, i) => (
            <div key={i} className="text-center">
              <div
                className="font-black leading-none animate-[gradShift_7s_ease_infinite]"
                style={{
                  fontSize: "clamp(3.5rem, 7vw, 6.5rem)",
                  background: gradients[i % gradients.length],
                  backgroundSize: "200% 200%",
                  WebkitBackgroundClip: "text",
                  backgroundClip: "text",
                  color: "transparent",
                }}
              >
                {s.value}
              </div>
              <div className="mt-4 text-sm font-semibold uppercase tracking-[0.18em] text-white/55">
                {s.label}
              </div>
            </div>
          ))}
        </div>
      </div>

      <style>{`
        @keyframes gradShift {
          0%, 100% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
        }
        @media (prefers-reduced-motion: reduce) {
          [class*="animate-[gradShift"] { animation: none !important; }
        }
      `}</style>
    </section>
  );
}
