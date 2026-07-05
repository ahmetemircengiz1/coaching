"use client";

import React from "react";
import { Dumbbell, ArrowRight, Star } from "lucide-react";
import type { LandingThemeContent } from "../../types";
import type { EliteGlobalStyles } from "../../elite-config";
import { scrollToCategory } from "../navbar/nav-helpers";

interface EliteProps {
  content: LandingThemeContent;
  config?: EliteGlobalStyles;
}

/**
 * AboutGymix — koyu zemin, ortalanmış neon etiket + dev 3 satırlık başlık.
 * Altta 3 sütun: solda küçük foto, ortada büyük istatistik + bio + buton +
 * avatar/yıldız sosyal kanıt, sağda büyük portre.
 * inspiredBy: https://gymix.framer.website/
 */
export function AboutGymix({ content, config }: EliteProps) {
  const texts = content.landingTexts;
  const accent = config?.primaryColor || "#d2ff3a";
  const bg = "#0a0a0a";
  const eyebrow = texts?.aboutEyebrow || "Hakkımda";
  const heading =
    texts?.aboutTitle ||
    "Fitness sadece ağırlık kaldırmak değil — bu bir inşa.";
  const image = texts?.aboutImage;
  const image2 = texts?.aboutImage2;
  const stat1 = {
    v: texts?.aboutStat1Value || "15+",
    l: texts?.aboutStat1Label || "Profesyonel Tecrübe",
  };
  const bio1 =
    texts?.aboutBio1 ||
    "Gelişmiş antrenman teknikleri, kişiye özel programlar ve modern ekipmanı bir araya getirerek premium bir fitness deneyimi sunuyoruz. İster güç ister kondisyon hedefin olsun, sana özel rota seninle birlikte çizilir.";
  const bio2 =
    texts?.aboutBio2 ||
    "Sadece bedenleri değil, zihinleri de antrene ediyoruz. Odak üzerine kurulu bir fitness yolculuğunun içine adım at.";

  return (
    <section
      className="overflow-hidden px-6 pt-20 pb-24"
      style={{ backgroundColor: bg, color: "#fff" }}
    >
      <div className="mx-auto max-w-7xl">
        <div
          className="flex items-center justify-center gap-2 text-sm font-bold uppercase tracking-[0.3em]"
          style={{ color: accent }}
        >
          <Dumbbell className="h-4 w-4" />
          {eyebrow}
        </div>
        <h2 className="mx-auto mt-6 max-w-5xl whitespace-pre-line text-center text-4xl font-black uppercase leading-[1.05] tracking-tight sm:text-5xl md:text-6xl lg:text-7xl">
          {heading}
        </h2>

        <div className="mt-14 grid items-center gap-8 lg:grid-cols-[0.7fr_1fr_0.9fr]">
          {/* Sol foto */}
          <div className="overflow-hidden rounded-xl bg-white/5">
            {image ? (
              <img
                src={image}
                alt=""
                className="aspect-[3/4] h-full w-full object-cover"
              />
            ) : (
              <div className="flex aspect-[3/4] items-center justify-center text-xs text-white/30">
                Fotoğraf eklemek için Ayarlar → Hakkımda
              </div>
            )}
          </div>

          {/* Center */}
          <div>
            <div className="flex flex-wrap items-baseline gap-x-4 gap-y-2 border-b border-white/15 pb-5">
              <span className="text-5xl font-black sm:text-6xl">{stat1.v}</span>
              <span className="text-sm font-bold uppercase tracking-widest text-white/65">
                {stat1.l}
              </span>
            </div>
            <div className="mt-6 space-y-4 text-sm leading-relaxed text-white/65 sm:text-base">
              <p>{bio1}</p>
              <p>{bio2}</p>
            </div>
            <div className="mt-8 flex flex-wrap items-center gap-6">
              <button
                onClick={() => scrollToCategory("packages")}
                className="group inline-flex items-center gap-3 rounded-full py-2 pl-6 pr-2 text-xs font-bold uppercase tracking-widest text-black transition-transform hover:scale-105"
                style={{ backgroundColor: accent }}
              >
                {eyebrow}
                <span className="flex h-8 w-8 items-center justify-center rounded-full bg-black text-white">
                  <ArrowRight className="h-4 w-4" />
                </span>
              </button>
              <div className="flex items-center gap-3">
                <div className="flex -space-x-2">
                  <span className="h-8 w-8 rounded-full border-2 border-black bg-gradient-to-br from-rose-400 to-rose-200" />
                  <span className="h-8 w-8 rounded-full border-2 border-black bg-gradient-to-br from-amber-400 to-amber-200" />
                  <span className="h-8 w-8 rounded-full border-2 border-black bg-gradient-to-br from-emerald-400 to-emerald-200" />
                </div>
                <div className="flex flex-col">
                  <div className="flex" style={{ color: accent }}>
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star key={i} className="h-3 w-3 fill-current" />
                    ))}
                  </div>
                  <span className="text-xs text-white/60">(1k+ yorum)</span>
                </div>
              </div>
            </div>
          </div>

          {/* Sağ foto */}
          <div className="overflow-hidden rounded-xl bg-white/5">
            {image2 ? (
              <img
                src={image2}
                alt=""
                className="aspect-[4/5] h-full w-full object-cover"
              />
            ) : (
              <div className="flex aspect-[4/5] items-center justify-center text-xs text-white/30">
                İkincil foto için Ayarlar → Hakkımda
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
