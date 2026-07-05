"use client";

import React, { useState } from "react";
import type { LandingThemeContent } from "../../types";
import type { EliteGlobalStyles } from "../../elite-config";
import { ChevronDown, Dumbbell } from "lucide-react";
import { resolveFaqs } from "./faq-data";

/**
 * FaqFitFlow — fitflow esinli.
 *
 * İki sütun: solda büyük dikey görsel, sağda iki tonlu başlık + açıklama +
 * beyaz yuvarlak akordeon maddeleri (dairesel chevron butonu). Görsel koç
 * ayarlardan eklenir; eklenmezse şık bir varsayılan panel görünür.
 *
 * inspiredBy: https://fitflow-template.framer.website/
 */
interface Props {
  content: LandingThemeContent;
  config?: EliteGlobalStyles;
}

export function FaqFitFlow({ content, config }: Props) {
  const faqs = resolveFaqs(content);
  const [open, setOpen] = useState<number | null>(null);

  const primary = config?.primaryColor || "#f0568f";
  const bg = config?.backgroundColor || "#f3f3f5";
  const text = config?.textColor || "#15161a";
  const faqImage = content.landingTexts?.faqImage;
  const brand = content.brandName || content.title || "COACH";

  const title = content.landingTexts?.faqTitle || "Sorular? Cevaplar bizde.";
  const parts = title.trim().split(/\s+/);
  const half = Math.ceil(parts.length / 2);
  const line1 = parts.slice(0, half).join(" ");
  const line2 = parts.slice(half).join(" ");

  return (
    <section className="px-6 py-24 sm:py-32" style={{ backgroundColor: bg }}>
      <div className="mx-auto grid max-w-6xl gap-10 lg:grid-cols-2 lg:gap-16">
        {/* Sol: büyük görsel */}
        <div className="relative overflow-hidden rounded-3xl" style={{ aspectRatio: "4 / 5" }}>
          {faqImage ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={faqImage} alt="" className="absolute inset-0 h-full w-full object-cover" />
          ) : (
            <div
              className="flex h-full w-full flex-col items-center justify-center gap-4"
              style={{ background: `linear-gradient(160deg, ${primary}33, ${primary}0d)` }}
            >
              <Dumbbell className="h-24 w-24" style={{ color: `${primary}` }} strokeWidth={1.3} />
              <span className="text-xl font-bold" style={{ color: `${text}73` }}>
                {brand}
              </span>
            </div>
          )}
        </div>

        {/* Sağ: başlık + akordeon */}
        <div>
          <h2 className="font-bold" style={{ fontSize: "clamp(2.2rem, 4.5vw, 3.6rem)", lineHeight: 1.04 }}>
            <span style={{ color: text }}>{line1}</span>
            {line2 && (
              <>
                {" "}
                <span style={{ color: primary }}>{line2}</span>
              </>
            )}
          </h2>
          <p className="mt-4 max-w-md text-base leading-relaxed" style={{ color: `${text}99` }}>
            En çok merak edilen soruların yanıtlarını burada bulabilirsin.
          </p>

          <div className="mt-8 flex flex-col gap-3.5">
            {faqs.map((f, i) => {
              const on = open === i;
              return (
                <div key={i} className="overflow-hidden rounded-2xl" style={{ background: "#ffffff", boxShadow: "0 10px 30px -16px rgba(0,0,0,0.18)" }}>
                  <button
                    type="button"
                    onClick={() => setOpen(on ? null : i)}
                    className="flex w-full items-center justify-between gap-4 px-6 py-5 text-left"
                  >
                    <span className="text-base font-semibold" style={{ color: "#15161a" }}>
                      {f.q}
                    </span>
                    <span
                      className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-full transition-transform duration-300"
                      style={{ background: "#ececef", color: "#15161a", transform: on ? "rotate(180deg)" : "none" }}
                    >
                      <ChevronDown className="h-4 w-4" />
                    </span>
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
