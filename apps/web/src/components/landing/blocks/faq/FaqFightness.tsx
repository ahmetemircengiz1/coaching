"use client";

import React, { useState } from "react";
import type { LandingThemeContent } from "../../types";
import type { EliteGlobalStyles } from "../../elite-config";
import { ChevronDown, Dumbbell } from "lucide-react";
import { resolveFaqs } from "./faq-data";

/**
 * FaqFightness — fightness esinli.
 *
 * Devasa iki tonlu sıkışık başlık. İki sütun: solda görsel + altında açıklama
 * paragrafı, sağda beyaz yuvarlak akordeon maddeleri (chevron ikonlu).
 * Görsel koç ayarlardan eklenir; eklenmezse şık bir varsayılan panel görünür.
 *
 * inspiredBy: https://fightness.framer.website/
 */
interface Props {
  content: LandingThemeContent;
  config?: EliteGlobalStyles;
}

export function FaqFightness({ content, config }: Props) {
  const faqs = resolveFaqs(content);
  const [open, setOpen] = useState<number | null>(null);

  const primary = config?.primaryColor || "#2f49ff";
  const bg = config?.backgroundColor || "#2438e8";
  const text = config?.textColor || "#ffffff";
  const headingFont = 'var(--font-oswald), "Arial Narrow", sans-serif';
  const faqImage = content.landingTexts?.faqImage;
  const brand = content.brandName || content.title || "COACH";

  const title = content.landingTexts?.faqTitle || "Sıkça Sorulan Sorular";
  const parts = title.trim().split(/\s+/);
  const head = parts.length > 1 ? parts.slice(0, -1).join(" ") : title;
  const last = parts.length > 1 ? parts[parts.length - 1] : "";

  return (
    <section className="px-6 py-24 sm:py-28" style={{ backgroundColor: bg }}>
      <div className="mx-auto max-w-6xl">
        <h2
          className="font-extrabold uppercase"
          style={{ fontFamily: headingFont, fontSize: "clamp(2.6rem, 8vw, 6.5rem)", lineHeight: 0.92 }}
        >
          <span style={{ color: text }}>{head}</span>
          {last && (
            <>
              <br />
              <span style={{ color: `${text}33` }}>{last}</span>
            </>
          )}
        </h2>

        <div className="mt-12 grid gap-8 lg:grid-cols-2 lg:gap-12">
          {/* Sol: görsel + paragraf */}
          <div>
            <div
              className="relative overflow-hidden rounded-3xl"
              style={{ aspectRatio: "1 / 1" }}
            >
              {faqImage ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={faqImage} alt="" className="absolute inset-0 h-full w-full object-cover" />
              ) : (
                <div
                  className="flex h-full w-full flex-col items-center justify-center gap-4"
                  style={{ background: `linear-gradient(150deg, ${text}26, ${text}08)` }}
                >
                  <Dumbbell className="h-20 w-20" style={{ color: `${text}59` }} strokeWidth={1.4} />
                  <span
                    className="font-extrabold uppercase"
                    style={{ color: `${text}40`, fontFamily: headingFont, fontSize: "clamp(1.6rem, 4vw, 2.6rem)" }}
                  >
                    {brand}
                  </span>
                </div>
              )}
            </div>
            <p className="mt-6 text-base leading-relaxed" style={{ color: `${text}cc` }}>
              Yeni bir şeye başlamak her zaman soru işaretleriyle gelir. Bu
              cevaplar, yolculuğuna başlamadan önce en çok merak edilenleri
              netleştirmek için hazırlandı.
            </p>
          </div>

          {/* Sağ: beyaz akordeon */}
          <div className="flex flex-col gap-3.5">
            {faqs.map((f, i) => {
              const on = open === i;
              return (
                <div key={i} className="overflow-hidden rounded-2xl" style={{ background: "#ffffff" }}>
                  <button
                    type="button"
                    onClick={() => setOpen(on ? null : i)}
                    className="flex w-full items-center justify-between gap-4 px-6 py-5 text-left"
                  >
                    <span className="text-base font-semibold" style={{ color: "#15161a" }}>
                      {f.q}
                    </span>
                    <ChevronDown
                      className="h-5 w-5 shrink-0 transition-transform duration-300"
                      style={{ color: "#15161a", transform: on ? "rotate(180deg)" : "none" }}
                    />
                  </button>
                  <div
                    className="grid transition-all duration-300 ease-out"
                    style={{ gridTemplateRows: on ? "1fr" : "0fr" }}
                  >
                    <div className="overflow-hidden">
                      <p className="px-6 pb-5 text-[15px] leading-relaxed" style={{ color: "rgba(21,22,26,0.65)" }}>
                        {f.a}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
