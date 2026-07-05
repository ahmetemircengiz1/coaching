"use client";

import React, { useState } from "react";
import type { LandingThemeContent } from "../../types";
import type { EliteGlobalStyles } from "../../elite-config";

/**
 * HowTabbedSteps — progrex esinli.
 * Yan yana 3 sekme; sekmeye tıklayınca o adımın açıklaması içerik panelinde
 * belirir. (progrex'teki sol görselli kartlar isteğe göre eklenmedi —
 * yalnızca açıklama içeriği.)
 *
 * inspiredBy: https://progrex.framer.website/
 */
export function HowTabbedSteps({
  content,
  config,
}: {
  content: LandingThemeContent;
  config?: EliteGlobalStyles;
}) {
  const texts = content.landingTexts;
  const primary = config?.primaryColor || "#ccff00";
  const bg = config?.backgroundColor || "#0a0a0a";
  const headingFont = 'var(--font-oswald), "Arial Narrow", sans-serif';

  const heading = texts?.systemTitle || "Süreç Nasıl İşler";
  const sub = texts?.systemSubtitle || "Sekmelere dokun; her adımın nasıl işlediğini gör.";

  const t = texts as Record<string, string | undefined> | undefined;
  const steps = [
    {
      title: texts?.system1Title || "Değerlendirme",
      desc:
        texts?.system1Description ||
        "Mevcut formunu, alışkanlıklarını ve hedeflerini birlikte netleştiriyoruz. Her şey doğru bir başlangıç noktasıyla başlar.",
      image: t?.system1Image,
    },
    {
      title: texts?.system2Title || "Planlama",
      desc:
        texts?.system2Description ||
        "Sana özel, yaşam tarzına uyan bir antrenman ve beslenme planı kuruyoruz. Gerçekçi, esnek ve sürdürülebilir.",
      image: t?.system2Image,
    },
    {
      title: texts?.system3Title || "Uygulama ve Takip",
      desc:
        texts?.system3Description ||
        "Düzenli check-in'lerle ilerlemeni ölçüyor, planı sonuçlarına göre sürekli güncelliyoruz.",
      image: t?.system3Image,
    },
  ];

  const [active, setActive] = useState(0);

  return (
    <section className="py-24 sm:py-32 px-6" style={{ backgroundColor: bg }}>
      <div className="max-w-5xl mx-auto">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <span
            className="text-xs font-bold uppercase tracking-[0.32em]"
            style={{ color: primary }}
          >
            Nasıl Çalışır
          </span>
          <h2
            className="mt-4 font-black uppercase text-white"
            style={{ fontFamily: headingFont, fontSize: "clamp(2.25rem, 5vw, 4rem)", lineHeight: 1.04 }}
          >
            {heading}
          </h2>
          <p className="mt-4 text-white/55 leading-relaxed text-[15px] sm:text-base">{sub}</p>
        </div>

        {/* Sekme çubuğu */}
        <div className="grid sm:grid-cols-3 gap-3">
          {steps.map((s, i) => {
            const on = i === active;
            return (
              <button
                key={i}
                type="button"
                onClick={() => setActive(i)}
                className="rounded-2xl border px-5 py-4 text-left transition-all duration-300"
                style={{
                  borderColor: on ? primary : "rgba(255,255,255,0.12)",
                  backgroundColor: on ? `${primary}14` : "rgba(255,255,255,0.03)",
                }}
              >
                <span
                  className="text-xs font-bold uppercase tracking-[0.2em]"
                  style={{ color: on ? primary : "rgba(255,255,255,0.4)" }}
                >
                  Adım {String(i + 1).padStart(2, "0")}
                </span>
                <div
                  className="mt-1.5 text-lg font-bold text-white"
                  style={{ fontFamily: headingFont }}
                >
                  {s.title}
                </div>
              </button>
            );
          })}
        </div>

        {/* İçerik paneli — aktif adımın fotosu varsa bg'e otursun */}
        <div
          className="relative mt-4 rounded-[2rem] border border-white/10 p-9 sm:p-12 min-h-[280px] flex flex-col justify-center overflow-hidden"
          style={{
            backgroundColor: steps[active].image ? "#0a0a0a" : "rgba(255,255,255,0.03)",
          }}
        >
          {steps[active].image && (
            <>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                key={active}
                src={steps[active].image}
                alt=""
                className="absolute inset-0 w-full h-full object-cover animate-[howTabIn_0.4s_ease-out]"
                style={{ opacity: 0.5 }}
                aria-hidden
              />
              <div
                className="absolute inset-0 pointer-events-none"
                style={{
                  background:
                    "linear-gradient(90deg, rgba(0,0,0,0.85) 0%, rgba(0,0,0,0.55) 55%, rgba(0,0,0,0.25) 100%)",
                }}
              />
            </>
          )}
          <span
            className="pointer-events-none absolute -bottom-10 -right-4 font-black leading-none select-none"
            style={{
              fontFamily: headingFont,
              fontSize: "13rem",
              color: steps[active].image ? "rgba(255,255,255,0.10)" : `${primary}12`,
            }}
          >
            {String(active + 1).padStart(2, "0")}
          </span>
          <div key={active} className="relative animate-[howTabIn_0.4s_ease-out]">
            <span
              className="text-xs font-bold uppercase tracking-[0.32em]"
              style={{ color: primary }}
            >
              Adım {String(active + 1).padStart(2, "0")}
            </span>
            <h3
              className="mt-3 text-3xl sm:text-4xl font-bold text-white drop-shadow"
              style={{ fontFamily: headingFont }}
            >
              {steps[active].title}
            </h3>
            <p
              className={`mt-4 max-w-xl leading-relaxed text-[15px] sm:text-lg ${
                steps[active].image ? "text-white/85" : "text-white/60"
              }`}
            >
              {steps[active].desc}
            </p>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes howTabIn {
          from { opacity: 0; transform: translateY(14px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @media (prefers-reduced-motion: reduce) {
          [class*="animate-[howTabIn"] { animation: none !important; }
        }
      `}</style>
    </section>
  );
}
