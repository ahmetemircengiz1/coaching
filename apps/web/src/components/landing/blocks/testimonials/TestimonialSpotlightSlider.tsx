"use client";

import React, { useState } from "react";
import type { LandingThemeContent } from "../../types";
import type { EliteGlobalStyles } from "../../elite-config";
import { ArrowLeft, ArrowRight } from "lucide-react";

/**
 * TestimonialSpotlightSlider — evotrack esinli.
 *
 * Solda sabit kalan başlık + açıklama ve gezinme okları; sağda danışan
 * fotoğrafı ile yorumu içeren kart. Oklarla danışanlar arasında geçilir,
 * kartın köşesinde sıra göstergesi (X/N) bulunur.
 *
 * inspiredBy: https://evotrack.framer.website/
 */
interface Props {
  content: LandingThemeContent;
  config?: EliteGlobalStyles;
}

export function TestimonialSpotlightSlider({ content, config }: Props) {
  const items = content.testimonials || [];
  const [idx, setIdx] = useState(0);
  if (items.length === 0) return null;

  const primary = config?.primaryColor || "#c8f135";
  const bg = config?.backgroundColor || "#f4f4f3";
  const text = config?.textColor || "#0d0d0f";

  const n = items.length;
  const t = items[idx % n];
  const go = (d: number) => setIdx((p) => (p + d + n) % n);

  const card = `${text}08`;
  const border = `${text}1a`;
  const title =
    content.landingTexts?.testimonialsTitle || "Sporcuların Güvendiği İsim";

  return (
    <section className="px-6 py-24 sm:py-32" style={{ backgroundColor: bg }}>
      <div className="mx-auto grid max-w-6xl items-center gap-12 md:grid-cols-2 md:gap-16">
        {/* Sol: sabit metin + oklar */}
        <div>
          <span
            className="inline-flex items-center gap-2 text-sm font-medium"
            style={{ color: `${text}99` }}
          >
            <span
              className="h-2 w-2 rounded-full"
              style={{ background: primary }}
            />
            Yorumlar
          </span>
          <h2
            className="mt-4 font-bold"
            style={{
              color: text,
              fontSize: "clamp(2rem, 4vw, 3.4rem)",
              lineHeight: 1.08,
            }}
          >
            {title}
          </h2>
          <p
            className="mt-4 max-w-md text-base leading-relaxed"
            style={{ color: `${text}80` }}
          >
            Hedeflerine ulaşan gerçek danışanlardan gerçek geri bildirimler.
          </p>
          {n > 1 && (
            <div className="mt-8 flex gap-3">
              <button
                type="button"
                onClick={() => go(-1)}
                aria-label="Önceki"
                className="inline-flex h-12 w-12 items-center justify-center rounded-full transition-transform hover:scale-105"
                style={{ background: primary, color: "#0a0a0a" }}
              >
                <ArrowLeft className="h-5 w-5" />
              </button>
              <button
                type="button"
                onClick={() => go(1)}
                aria-label="Sonraki"
                className="inline-flex h-12 w-12 items-center justify-center rounded-full transition-transform hover:scale-105"
                style={{ background: primary, color: "#0a0a0a" }}
              >
                <ArrowRight className="h-5 w-5" />
              </button>
            </div>
          )}
        </div>

        {/* Sağ: değişen kart */}
        <div
          className="overflow-hidden rounded-3xl border"
          style={{ background: card, borderColor: border }}
        >
          <div className="grid sm:grid-cols-[0.85fr_1fr]">
            {/* Fotoğraf */}
            <div
              className="relative"
              style={{ aspectRatio: "3 / 4", background: `${text}12` }}
            >
              {t.avatar ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={t.avatar}
                  alt={t.clientName}
                  className="absolute inset-0 h-full w-full object-cover"
                />
              ) : (
                <div
                  className="flex h-full w-full items-center justify-center text-7xl font-extrabold"
                  style={{ color: `${text}40` }}
                >
                  {t.clientName.charAt(0).toUpperCase()}
                </div>
              )}
            </div>
            {/* Metin */}
            <div className="flex flex-col p-7">
              <p
                className="text-lg leading-relaxed"
                style={{ color: `${text}cc` }}
              >
                &ldquo;{t.quote}&rdquo;
              </p>
              <div
                className="mt-auto flex items-end justify-between gap-4 border-t pt-5"
                style={{ borderColor: border }}
              >
                <div>
                  <p className="text-lg font-bold" style={{ color: text }}>
                    {t.clientName}
                  </p>
                  {t.role && (
                    <p className="text-sm" style={{ color: `${text}80` }}>
                      {t.role}
                    </p>
                  )}
                </div>
                <span className="text-sm" style={{ color: `${text}66` }}>
                  {(idx % n) + 1}/{n}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
