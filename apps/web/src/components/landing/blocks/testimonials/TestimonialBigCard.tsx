"use client";

import React, { useState } from "react";
import type { LandingThemeContent } from "../../types";
import type { EliteGlobalStyles } from "../../elite-config";
import { Star, ChevronLeft, ChevronRight } from "lucide-react";

/**
 * TestimonialBigCard — outpace esinli.
 *
 * Ortalanmış büyük başlık + tek seferde bir büyük geniş kart gösteren
 * carousel. Kart: solda danışan fotoğrafı, sağda koyu panelde yıldız puanı,
 * büyük alıntı ve isim. Komşu kartlardan ince bir kesit görünür.
 *
 * inspiredBy: https://outpace.framer.media/
 */
interface Props {
  content: LandingThemeContent;
  config?: EliteGlobalStyles;
}

export function TestimonialBigCard({ content, config }: Props) {
  const items = content.testimonials || [];
  const [idx, setIdx] = useState(0);
  if (items.length === 0) return null;

  const primary = config?.primaryColor || "#d9f24a";
  const bg = config?.backgroundColor || "#f4f4f3";
  const text = config?.textColor || "#0d0d0f";
  const headingFont = 'var(--font-oswald), "Arial Narrow", sans-serif';

  const n = items.length;
  const go = (d: number) => setIdx((p) => (p + d + n) % n);

  return (
    <section className="overflow-hidden px-6 py-24 sm:py-32" style={{ backgroundColor: bg }}>
      <div className="mx-auto max-w-7xl">
        {/* Başlık */}
        <div className="mb-14 text-center">
          <span
            className="inline-flex items-center gap-1.5 rounded-full border px-4 py-1 text-xs font-semibold uppercase tracking-wider"
            style={{ borderColor: `${text}26`, color: `${text}cc` }}
          >
            <span className="h-1.5 w-1.5 rotate-45" style={{ background: primary }} />
            Yorumlar
          </span>
          <h2
            className="mt-4 font-extrabold uppercase"
            style={{
              color: text,
              fontFamily: headingFont,
              fontSize: "clamp(2.2rem, 5.5vw, 4.6rem)",
              lineHeight: 0.98,
            }}
          >
            {content.landingTexts?.testimonialsTitle || "Gerçek Sonuçlar"}
          </h2>
        </div>
      </div>

      {/* Kart şeridi */}
      <div className="mx-auto max-w-7xl">
        <div className="overflow-hidden">
          <div
            className="flex transition-transform duration-500 ease-out"
            style={{ transform: `translateX(calc(6% - ${idx * 88}%))` }}
          >
            {items.map((t) => {
              const stars = t.rating && t.rating > 0 ? t.rating : 5;
              return (
                <div key={t.id} className="shrink-0 px-2" style={{ flexBasis: "88%" }}>
                  <div
                    className="grid overflow-hidden rounded-3xl sm:grid-cols-[0.85fr_1fr]"
                    style={{ background: "#0e0e11", border: `1px solid ${text}1f` }}
                  >
                    {/* Fotoğraf */}
                    <div
                      className="relative min-h-[340px] sm:min-h-[560px]"
                      style={{ background: "#1a1a1d" }}
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
                          style={{ color: primary, fontFamily: headingFont }}
                        >
                          {t.clientName.charAt(0).toUpperCase()}
                        </div>
                      )}
                    </div>
                    {/* Koyu panel */}
                    <div className="flex flex-col justify-center p-8 sm:p-14">
                      <div className="flex gap-1.5">
                        {Array.from({ length: 5 }).map((_, i) => (
                          <Star
                            key={i}
                            className="h-7 w-7"
                            strokeWidth={0}
                            fill={i < stars ? primary : "#3a3a3e"}
                          />
                        ))}
                      </div>
                      <p
                        className="mt-7 font-bold uppercase"
                        style={{
                          color: "#ffffff",
                          fontFamily: headingFont,
                          fontSize: "clamp(1.5rem, 2.7vw, 2.9rem)",
                          lineHeight: 1.16,
                        }}
                      >
                        &ldquo;{t.quote}&rdquo;
                      </p>
                      <div className="mt-8">
                        <p className="text-lg font-bold" style={{ color: "#ffffff" }}>
                          {t.clientName}
                        </p>
                        {t.role && (
                          <p className="text-sm" style={{ color: "rgba(255,255,255,0.55)" }}>
                            {t.role}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Gezinme */}
        {n > 1 && (
          <div className="mt-10 flex items-center justify-center gap-5">
            <button
              type="button"
              onClick={() => go(-1)}
              aria-label="Önceki"
              className="inline-flex h-11 w-11 items-center justify-center rounded-full border transition-transform hover:scale-105"
              style={{ borderColor: `${text}33`, color: text }}
            >
              <ChevronLeft className="h-5 w-5" />
            </button>
            <div className="flex gap-2">
              {items.map((_, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => setIdx(i)}
                  aria-label={`Yorum ${i + 1}`}
                  className="h-2 rounded-full transition-all"
                  style={{
                    width: i === idx ? 24 : 8,
                    background: i === idx ? primary : `${text}33`,
                  }}
                />
              ))}
            </div>
            <button
              type="button"
              onClick={() => go(1)}
              aria-label="Sonraki"
              className="inline-flex h-11 w-11 items-center justify-center rounded-full border transition-transform hover:scale-105"
              style={{ borderColor: `${text}33`, color: text }}
            >
              <ChevronRight className="h-5 w-5" />
            </button>
          </div>
        )}
      </div>
    </section>
  );
}
