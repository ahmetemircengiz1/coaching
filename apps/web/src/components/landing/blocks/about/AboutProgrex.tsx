"use client";

import React from "react";
import { Plus, Quote, ArrowUpRight } from "lucide-react";
import type { LandingThemeContent } from "../../types";
import type { EliteGlobalStyles } from "../../elite-config";
import { scrollToContactSection } from "../navbar/nav-helpers";

interface EliteProps {
  content: LandingThemeContent;
  config?: EliteGlobalStyles;
}

/**
 * AboutProgrex — açık zemin: üstte "+ Hakkımda" etiketi + başlık + sağda
 * alt başlık; altta solda tall koç fotoğrafı + sağda beyaz alıntı kartı
 * (alıntı + isim + iletişim butonu); en altta 3 beyaz istatistik kartı.
 * inspiredBy: https://progrex.framer.website/
 */
export function AboutProgrex({ content, config: _config }: EliteProps) {
  const texts = content.landingTexts;
  const bg = "#ededed";
  const brand = content.title || content.brandName || "Koç";
  const image =
    texts?.aboutImage ||
    content.heroImageDesktopUrl ||
    content.heroImageOriginalUrl ||
    null;
  const eyebrow = texts?.aboutEyebrow || "Hakkımda";
  const heading = texts?.aboutTitle || "Gerçek değişim için kuruldu";
  const subtitle =
    texts?.aboutBio2 ||
    "Güç antrenmanı, akıllı beslenme ve sorumluluk bilincini birleştirerek kalıcı sonuçlar üretmeyi seviyorum.";
  const quote =
    texts?.aboutBio1 ||
    "Bireylere güç kazandırmaya, vücut kompozisyonlarını iyileştirmeye ve net, yapılandırılmış bir yaklaşımla istikrarlı kalmalarına yardımcı oluyorum. Koçluğum; gerçek, sürdürülebilir sonuç isteyenler için tasarlandı.";
  const stats = [
    {
      v: texts?.aboutStat1Value || "120+",
      l: texts?.aboutStat1Label || "Eğittiğim Danışan",
    },
    {
      v: texts?.aboutStat2Value || "5+",
      l: texts?.aboutStat2Label || "Yıl Tecrübe",
    },
    {
      v: texts?.aboutStat3Value || "250+",
      l: texts?.aboutStat3Label || "Teslim Edilen Program",
    },
  ];

  return (
    <section
      className="px-6 py-20 sm:px-12"
      style={{ backgroundColor: bg, color: "#0a0a0a" }}
    >
      <div className="mx-auto max-w-7xl">
        <div className="flex items-center gap-1.5 text-sm font-semibold text-black/75">
          <Plus className="h-4 w-4" /> {eyebrow}
        </div>

        <div className="mt-3 grid gap-6 lg:grid-cols-[1fr_auto] lg:items-end">
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl">
            {heading}
          </h2>
          <p className="max-w-sm text-sm text-black/55 lg:text-right">
            {subtitle}
          </p>
        </div>

        <div className="mt-10 grid gap-6 lg:grid-cols-[0.85fr_1.4fr]">
          {/* Foto */}
          <div className="overflow-hidden rounded-xl bg-black/10">
            {image ? (
              <img
                src={image}
                alt={brand}
                className="h-full min-h-[420px] w-full object-cover"
              />
            ) : (
              <div className="flex min-h-[420px] items-center justify-center text-sm text-black/40">
                Fotoğraf eklemek için Ayarlar → Hakkımda
              </div>
            )}
          </div>

          {/* Alıntı kartı */}
          <div className="flex flex-col rounded-xl bg-white p-7 sm:p-9">
            <Quote className="h-7 w-7 text-black/25" />
            <p className="mt-4 text-lg leading-relaxed text-black/85 sm:text-xl">
              {quote}
            </p>
            <div className="mt-auto flex flex-wrap items-end justify-between gap-4 pt-8">
              <span className="text-sm font-semibold">{brand}</span>
              <button
                onClick={() => scrollToContactSection(content)}
                className="inline-flex items-center gap-2 rounded-md bg-black px-5 py-3 text-sm font-semibold text-white transition-colors hover:bg-black/85"
              >
                İletişime Geç
                <ArrowUpRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>

        {/* İstatistik kartları */}
        <div className="mt-6 grid gap-6 sm:grid-cols-3">
          {stats.map((s, i) => (
            <div key={i} className="rounded-xl bg-white p-7 sm:p-9">
              <div className="text-4xl font-bold sm:text-5xl">{s.v}</div>
              <div className="mt-2 text-sm text-black/55">{s.l}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
