"use client";

import React, { useState } from "react";
import type { LandingThemeContent } from "../../types";
import type { EliteGlobalStyles } from "../../elite-config";
import { Dumbbell, HeartPulse, Apple, Plus } from "lucide-react";

/**
 * FeatureFlipCards — gymone esinli.
 * Büyük, sade görünen kartlar; üzerine tıklandığında açıklamalı hale genişler.
 * Tek seferde tek kart açık (tekrar tıklayınca kapanır). Kapalıyken bile dolu
 * görünmesi için kartlar uzun ve dev soluk numara filigranı taşır.
 *
 * inspiredBy: https://gymone.framer.website/
 */
export function FeatureFlipCards({
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

  const heading = texts?.systemTitle || "Özelliklerimiz";
  const sub = texts?.systemSubtitle || "Detayları görmek için kartlara dokun.";

  const cards = [
    {
      icon: Dumbbell,
      title: texts?.system1Title || "Antrenman Sistemi",
      desc:
        texts?.system1Description ||
        "Seviyene göre kademeli ilerleyen, ölçülebilir ve sürdürülebilir antrenman planı. Her hafta yenilenir.",
      image: (texts as Record<string, string | undefined> | undefined)?.system1Image,
    },
    {
      icon: HeartPulse,
      title: texts?.system2Title || "Kondisyon Takibi",
      desc:
        texts?.system2Description ||
        "Dayanıklılığını adım adım artıran, performansını düzenli ölçen ve raporlayan bir yaklaşım.",
      image: (texts as Record<string, string | undefined> | undefined)?.system2Image,
    },
    {
      icon: Apple,
      title: texts?.system3Title || "Beslenme Desteği",
      desc:
        texts?.system3Description ||
        "Hedeflerine uygun, pratik ve uygulanabilir beslenme rehberliği; günlük yaşamına kolayca oturur.",
      image: (texts as Record<string, string | undefined> | undefined)?.system3Image,
    },
  ];

  const [open, setOpen] = useState<number | null>(null);

  return (
    <section className="py-24 sm:py-32 px-6" style={{ backgroundColor: bg }}>
      <div className="max-w-6xl mx-auto">
        <div className="text-center max-w-xl mx-auto mb-14 sm:mb-16">
          <span
            className="text-xs font-bold uppercase tracking-[0.32em]"
            style={{ color: primary }}
          >
            Özellikler
          </span>
          <h2
            className="mt-4 font-black uppercase text-white"
            style={{ fontFamily: headingFont, fontSize: "clamp(2.25rem, 5vw, 4rem)", lineHeight: 1.03 }}
          >
            {heading}
          </h2>
          <p className="mt-4 text-white/55 leading-relaxed text-[15px] sm:text-base">{sub}</p>
        </div>

        <div className="grid sm:grid-cols-3 gap-5">
          {cards.map((c, i) => {
            const isOpen = open === i;
            const Icon = c.icon;
            return (
              <button
                key={i}
                type="button"
                onClick={() => setOpen(isOpen ? null : i)}
                aria-expanded={isOpen}
                className="group relative text-left rounded-[1.75rem] border p-8 sm:p-9 min-h-[300px] flex flex-col overflow-hidden transition-all duration-300"
                style={{
                  borderColor: isOpen ? primary : "rgba(255,255,255,0.1)",
                  backgroundColor: c.image
                    ? "#0a0a0a"
                    : isOpen
                    ? `${primary}12`
                    : "rgba(255,255,255,0.03)",
                }}
              >
                {/* Foto verilmişse kart arka planına otursun + okunabilirlik için koyu gradyan */}
                {c.image && (
                  <>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={c.image}
                      alt=""
                      className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-[1.04]"
                      style={{ opacity: isOpen ? 0.6 : 0.45 }}
                      aria-hidden
                    />
                    <div
                      className="absolute inset-0 pointer-events-none"
                      style={{
                        background:
                          "linear-gradient(180deg, rgba(0,0,0,0.25) 0%, rgba(0,0,0,0.55) 55%, rgba(0,0,0,0.85) 100%)",
                      }}
                    />
                  </>
                )}

                {/* Dev soluk numara filigranı */}
                <span
                  className="pointer-events-none absolute -bottom-6 -right-3 font-black leading-none select-none"
                  style={{
                    fontFamily: headingFont,
                    fontSize: "9rem",
                    color: c.image
                      ? "rgba(255,255,255,0.10)"
                      : isOpen
                      ? `${primary}26`
                      : "rgba(255,255,255,0.04)",
                  }}
                >
                  {String(i + 1).padStart(2, "0")}
                </span>

                <div className="relative flex items-start justify-between">
                  {/* İkon her zaman gösterilir — foto varken accent dolu rozet olarak overlay */}
                  <span
                    className="inline-flex w-16 h-16 rounded-2xl items-center justify-center transition-colors duration-300 backdrop-blur-sm"
                    style={{
                      background: c.image
                        ? isOpen
                          ? primary
                          : "rgba(0,0,0,0.55)"
                        : isOpen
                        ? primary
                        : `${primary}1f`,
                      border: c.image && !isOpen ? `1px solid ${primary}66` : undefined,
                    }}
                  >
                    <Icon
                      className="w-7 h-7"
                      style={{
                        color: c.image
                          ? isOpen
                            ? "#0a0a0a"
                            : primary
                          : isOpen
                          ? "#0a0a0a"
                          : primary,
                      }}
                      strokeWidth={1.85}
                    />
                  </span>
                  <span
                    className="inline-flex w-9 h-9 rounded-full items-center justify-center border transition-all duration-300 backdrop-blur-sm"
                    style={{
                      borderColor: isOpen ? primary : "rgba(255,255,255,0.35)",
                      backgroundColor: c.image ? "rgba(0,0,0,0.4)" : "transparent",
                      transform: isOpen ? "rotate(45deg)" : "none",
                    }}
                  >
                    <Plus
                      className="w-4 h-4"
                      style={{ color: isOpen ? primary : "rgba(255,255,255,0.75)" }}
                    />
                  </span>
                </div>

                <h3
                  className="relative mt-auto pt-8 text-2xl font-bold text-white drop-shadow"
                  style={{ fontFamily: headingFont }}
                >
                  {c.title}
                </h3>

                <div
                  className="relative grid transition-all duration-300 ease-out"
                  style={{ gridTemplateRows: isOpen ? "1fr" : "0fr" }}
                >
                  <div className="overflow-hidden">
                    <p className="pt-3 text-sm text-white/80 leading-relaxed">{c.desc}</p>
                  </div>
                </div>

                {!isOpen && (
                  <span className="relative pt-3 text-xs font-semibold uppercase tracking-wider text-white/55">
                    Detay için dokun
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>
    </section>
  );
}
