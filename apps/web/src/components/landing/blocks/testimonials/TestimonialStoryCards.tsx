"use client";

import React, { useEffect, useState } from "react";
import type { LandingThemeContent } from "../../types";
import type { EliteGlobalStyles } from "../../elite-config";
import { Quote, ChevronLeft, ChevronRight } from "lucide-react";

/**
 * TestimonialStoryCards — curtis esinli.
 *
 * Ortalanmış başlık (vurgu renkli ikinci satır) + yan yana danışan yorum
 * kartları. Her kart: alıntı ikonu, yorum metni, altta avatar + isim + rol.
 * Dairesel oklar ve nokta göstergesiyle gezilir.
 *
 * inspiredBy: https://curtis.framer.media/
 */
interface Props {
  content: LandingThemeContent;
  config?: EliteGlobalStyles;
}

export function TestimonialStoryCards({ content, config }: Props) {
  const items = content.testimonials || [];
  const [idx, setIdx] = useState(0);
  const [visible, setVisible] = useState(3);

  useEffect(() => {
    const calc = () =>
      setVisible(
        window.innerWidth < 768 ? 1 : window.innerWidth < 1100 ? 2 : 3
      );
    calc();
    window.addEventListener("resize", calc);
    return () => window.removeEventListener("resize", calc);
  }, []);

  if (items.length === 0) return null;

  const primary = config?.primaryColor || "#a3e635";
  const bg = config?.backgroundColor || "#0a0a0a";
  const text = config?.textColor || "#ffffff";

  const n = items.length;
  const maxIdx = Math.max(0, n - visible);
  const clamped = Math.min(idx, maxIdx);
  const go = (d: number) =>
    setIdx((p) => Math.max(0, Math.min(maxIdx, p + d)));

  const title =
    content.landingTexts?.testimonialsTitle || "Sonuçları Onlar Anlatıyor";
  const parts = title.trim().split(/\s+/);
  const head = parts.length > 2 ? parts.slice(0, -2).join(" ") : "";
  const accent = parts.length > 2 ? parts.slice(-2).join(" ") : title;

  return (
    <section className="px-6 py-24 sm:py-32" style={{ backgroundColor: bg }}>
      <div className="mx-auto max-w-6xl">
        {/* Başlık */}
        <div className="mx-auto mb-12 max-w-2xl text-center">
          <span
            className="inline-block rounded-full border px-4 py-1 text-xs font-semibold uppercase tracking-wider"
            style={{ borderColor: `${text}26`, color: `${text}cc` }}
          >
            Yorumlar
          </span>
          <h2
            className="mt-5 font-bold"
            style={{ fontSize: "clamp(2rem, 5vw, 3.4rem)", lineHeight: 1.06 }}
          >
            {head && <span style={{ color: text }}>{head} </span>}
            <span style={{ color: primary }}>{accent}</span>
          </h2>
        </div>

        {/* Carousel */}
        <div className="relative">
          <div className="overflow-hidden">
            <div
              className="flex transition-transform duration-500 ease-out"
              style={{ transform: `translateX(-${clamped * (100 / visible)}%)` }}
            >
              {items.map((t) => (
                <div
                  key={t.id}
                  className="shrink-0 px-3"
                  style={{ flexBasis: `${100 / visible}%` }}
                >
                  <div
                    className="flex h-full flex-col rounded-3xl border p-7"
                    style={{ background: `${text}08`, borderColor: `${text}12` }}
                  >
                    <Quote className="h-8 w-8" strokeWidth={0} fill={primary} />
                    <p
                      className="mt-4 flex-1 text-[15px] leading-relaxed"
                      style={{ color: `${text}b3` }}
                    >
                      {t.quote}
                    </p>
                    <div className="mt-8 flex items-center gap-3">
                      <div
                        className="flex h-11 w-11 shrink-0 items-center justify-center overflow-hidden rounded-full text-sm font-bold"
                        style={{ background: `${primary}26`, color: primary }}
                      >
                        {t.avatar ? (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img
                            src={t.avatar}
                            alt={t.clientName}
                            className="h-full w-full object-cover"
                          />
                        ) : (
                          t.clientName.charAt(0).toUpperCase()
                        )}
                      </div>
                      <div>
                        <p className="text-sm font-bold" style={{ color: text }}>
                          {t.clientName}
                        </p>
                        {t.role && (
                          <p className="text-xs" style={{ color: `${text}66` }}>
                            {t.role}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Oklar */}
          {n > visible && (
            <>
              <button
                type="button"
                onClick={() => go(-1)}
                aria-label="Önceki"
                className="absolute top-1/2 -left-2 z-10 inline-flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full backdrop-blur-md transition-transform hover:scale-105 sm:-left-5"
                style={{ background: `${text}1a`, color: text }}
              >
                <ChevronLeft className="h-5 w-5" />
              </button>
              <button
                type="button"
                onClick={() => go(1)}
                aria-label="Sonraki"
                className="absolute top-1/2 -right-2 z-10 inline-flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full backdrop-blur-md transition-transform hover:scale-105 sm:-right-5"
                style={{ background: `${text}1a`, color: text }}
              >
                <ChevronRight className="h-5 w-5" />
              </button>
            </>
          )}
        </div>

        {/* Noktalar */}
        {n > visible && (
          <div className="mt-9 flex justify-center gap-2">
            {Array.from({ length: maxIdx + 1 }).map((_, i) => (
              <button
                key={i}
                type="button"
                onClick={() => setIdx(i)}
                aria-label={`Sayfa ${i + 1}`}
                className="h-2 rounded-full transition-all"
                style={{
                  width: i === clamped ? 24 : 8,
                  background: i === clamped ? primary : `${text}33`,
                }}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
