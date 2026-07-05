"use client";

import React, { useState } from "react";
import type { LandingThemeContent } from "../../types";
import type { EliteGlobalStyles } from "../../elite-config";
import { Plus, Minus } from "lucide-react";
import { resolveFaqs } from "./faq-data";

/**
 * FaqOutpace — outpace esinli.
 *
 * Ortalanmış tek sütun akordeon. Üstte "FAQ" rozeti + ağır sıkışık başlık.
 * Her madde koyu yuvarlak bir bar; sağda vurgu renkli kare +/− butonu.
 *
 * inspiredBy: https://outpace.framer.media/
 */
interface Props {
  content: LandingThemeContent;
  config?: EliteGlobalStyles;
}

export function FaqOutpace({ content, config }: Props) {
  const faqs = resolveFaqs(content);
  const [open, setOpen] = useState<number | null>(0);

  const primary = config?.primaryColor || "#d6f23a";
  const bg = config?.backgroundColor || "#0a0a0a";
  const text = config?.textColor || "#ffffff";
  const headingFont = 'var(--font-oswald), "Arial Narrow", sans-serif';
  const title = content.landingTexts?.faqTitle || "Sıkça Sorulan Sorular";

  return (
    <section className="px-6 py-24 sm:py-32" style={{ backgroundColor: bg }}>
      <div className="mx-auto max-w-3xl">
        <div className="mb-14 text-center">
          <span
            className="inline-flex items-center gap-1.5 rounded-full px-4 py-1.5 text-xs font-bold uppercase tracking-wider"
            style={{ background: `${text}12`, color: text }}
          >
            <span className="h-1.5 w-1.5 rotate-45" style={{ background: primary }} />
            FAQ
          </span>
          <h2
            className="mt-5 font-extrabold uppercase"
            style={{ color: text, fontFamily: headingFont, fontSize: "clamp(2.2rem, 5.5vw, 4.2rem)", lineHeight: 0.98 }}
          >
            {title}
          </h2>
        </div>

        <div className="flex flex-col gap-3">
          {faqs.map((f, i) => {
            const on = open === i;
            return (
              <div
                key={i}
                className="overflow-hidden rounded-2xl"
                style={{ background: `${text}0c` }}
              >
                <button
                  type="button"
                  onClick={() => setOpen(on ? null : i)}
                  className="flex w-full items-center justify-between gap-4 p-5 text-left"
                >
                  <span className="text-base font-semibold sm:text-lg" style={{ color: text }}>
                    {f.q}
                  </span>
                  <span
                    className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-lg"
                    style={{ background: primary, color: "#0a0a0a" }}
                  >
                    {on ? <Minus className="h-4 w-4" strokeWidth={3} /> : <Plus className="h-4 w-4" strokeWidth={3} />}
                  </span>
                </button>
                <div
                  className="grid transition-all duration-300 ease-out"
                  style={{ gridTemplateRows: on ? "1fr" : "0fr" }}
                >
                  <div className="overflow-hidden">
                    <p className="px-5 pb-5 text-[15px] leading-relaxed" style={{ color: `${text}99` }}>
                      {f.a}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
