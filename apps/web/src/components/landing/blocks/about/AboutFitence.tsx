"use client";

import React from "react";
import { Dumbbell, ArrowRight, Star } from "lucide-react";
import type { LandingThemeContent } from "../../types";
import type { EliteGlobalStyles } from "../../elite-config";
import { scrollToCategory } from "../navbar/nav-helpers";
import { resolveAboutStats } from "./about-helpers";

interface EliteProps {
  content: LandingThemeContent;
  config?: EliteGlobalStyles;
}

/**
 * AboutFitence — koyu zemin: ortalanmış etiket + dev başlık (ilk satır soluk,
 * devamı parlak beyaz). Altta 3 sütun: solda büyük portre, ortada 2 büyük
 * istatistik + bio + buton + sosyal kanıt, sağda ikincil portre.
 * inspiredBy: https://fitence.framer.website/
 */
export function AboutFitence({ content, config }: EliteProps) {
  const texts = content.landingTexts;
  const accent = config?.primaryColor || "#fb923c";
  const bg = "#0a0a0a";
  const eyebrow = texts?.aboutEyebrow || "Hakkımızda";
  const titleSoft = texts?.aboutTitle || "Fitness inşa eder —";
  const titleStrong =
    texts?.aboutTitleAccent || "Güven, Tutku & Ömür Boyu Sağlık.";
  const image = texts?.aboutImage;
  const image2 = texts?.aboutImage2;
  const stats = resolveAboutStats(texts, [
    { v: "15K+", l: "Tamamlanan antrenman seansı. Her gün gerçek koçluk, gerçek ilerleme." },
    { v: "98%", l: "Üyelerimiz destekleyici ortamımızı ve koçluk kalitemizi takdir ediyor." },
  ]);
  const ratingHidden = texts?.aboutRatingHidden === "1";
  const reviewText = texts?.aboutReviewText || "500+ üye yorumu";
  const bio =
    texts?.aboutBio1 ||
    "Fitness'ın sadece antrenmandan ibaret olmadığına; güven, tutku ve sağlık inşa etmek olduğuna inanıyoruz. Yolculuğuna başlamak ya da bir üst seviyeye taşımak isteyen herkesin yanındayız.";

  return (
    <section
      className="overflow-hidden px-6 pt-20 pb-20"
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

        <h2 className="mx-auto mt-5 max-w-5xl text-center text-3xl font-black uppercase leading-[1.05] tracking-tight sm:text-5xl md:text-6xl">
          <span className="text-white/35">{titleSoft}</span>
          <span className="block">{titleStrong}</span>
        </h2>

        <div className="mt-14 grid items-center gap-8 lg:grid-cols-[1fr_1.1fr_0.55fr]">
          {/* Sol büyük portre */}
          <div className="overflow-hidden rounded-2xl bg-white/5">
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
          <div className="space-y-7">
            {stats.map((s, i) => (
              <StatRow key={i} value={s.v} label={s.l} />
            ))}
            <p className="text-sm leading-relaxed text-white/70 sm:text-base">{bio}</p>
            <div className="flex flex-wrap items-center gap-5">
              <button
                onClick={() => scrollToCategory("packages")}
                className="group inline-flex items-center gap-3 rounded-full bg-white py-2.5 pl-5 pr-2 text-xs font-bold uppercase tracking-widest text-black transition-transform hover:scale-105"
              >
                Daha Fazlası
                <span className="flex h-8 w-8 items-center justify-center rounded-full bg-black text-white">
                  <ArrowRight className="h-4 w-4" />
                </span>
              </button>
              {!ratingHidden && (
                <div className="flex items-center gap-3">
                  <div className="flex -space-x-2">
                    <span className="h-8 w-8 rounded-full border-2 border-black bg-gradient-to-br from-rose-400 to-rose-200" />
                    <span className="h-8 w-8 rounded-full border-2 border-black bg-gradient-to-br from-amber-400 to-amber-200" />
                    <span className="h-8 w-8 rounded-full border-2 border-black bg-gradient-to-br from-emerald-400 to-emerald-200" />
                  </div>
                  <div className="flex flex-col">
                    <div className="flex text-amber-400">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <Star key={i} className="h-3 w-3 fill-current" />
                      ))}
                    </div>
                    <span className="text-xs text-white/60">{reviewText}</span>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Sağ küçük foto */}
          <div className="overflow-hidden rounded-2xl bg-white/5">
            {image2 ? (
              <img
                src={image2}
                alt=""
                className="aspect-[3/4] h-full w-full object-cover"
              />
            ) : (
              <div className="flex aspect-[3/4] items-center justify-center text-xs text-white/30">
                İkincil foto için Ayarlar → Hakkımda
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

function StatRow({ value, label }: { value: string; label: string }) {
  return (
    <div className="border-b border-white/15 pb-5">
      <div className="flex items-baseline justify-between gap-6">
        <span className="text-5xl font-extrabold sm:text-6xl">{value}</span>
        <p className="max-w-xs text-sm text-white/65 sm:text-base">{label}</p>
      </div>
    </div>
  );
}
