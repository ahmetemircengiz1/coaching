"use client";

import React, { useState } from "react";
import type { LandingThemeContent } from "../../types";
import type { EliteGlobalStyles } from "../../elite-config";
import { ArrowRight } from "lucide-react";
import { resolveFaqs } from "./faq-data";

/**
 * FaqYogava — yogava esinli.
 *
 * İki sütun: solda "FAQ" rozeti + başlık + CTA bağlantısı; sağda numaralı
 * (1, 2, 3…) kenarlıklı liste maddeleri, sağda ok ikonu. Maddeye tıklanınca
 * cevap açılır.
 *
 * inspiredBy: https://yogava.framer.website/
 */
interface Props {
  content: LandingThemeContent;
  config?: EliteGlobalStyles;
}

export function FaqYogava({ content, config }: Props) {
  const faqs = resolveFaqs(content);
  const [open, setOpen] = useState<number | null>(0);

  const primary = config?.primaryColor || "#ff5b29";
  const bg = config?.backgroundColor || "#f3efe6";
  const text = config?.textColor || "#1a1813";
  const line = `${text}2e`;
  const authHref = content.authUrl || "#";
  const title = content.landingTexts?.faqTitle || "Sorularına net cevaplar";

  return (
    <section className="px-6 py-24 sm:py-32" style={{ backgroundColor: bg }}>
      <div className="mx-auto grid max-w-6xl gap-12 lg:grid-cols-[0.82fr_1.18fr] lg:gap-16">
        {/* Sol: tanıtım */}
        <div>
          <span
            className="inline-block rounded-full border px-4 py-1.5 text-xs font-semibold uppercase tracking-wider"
            style={{ borderColor: line, color: text }}
          >
            FAQ
          </span>
          <h2
            className="mt-6 font-semibold"
            style={{ color: text, fontSize: "clamp(1.9rem, 3.4vw, 2.9rem)", lineHeight: 1.15 }}
          >
            {title}
          </h2>
          <a
            href={authHref}
            className="mt-8 inline-flex items-center gap-2 border-b pb-1 text-lg font-semibold transition-opacity hover:opacity-75"
            style={{ color: primary, borderColor: primary }}
          >
            Hemen Başla
            <ArrowRight className="h-5 w-5" />
          </a>
        </div>

        {/* Sağ: numaralı liste */}
        <div className="flex flex-col gap-3">
          {faqs.map((f, i) => {
            const on = open === i;
            return (
              <div
                key={i}
                className="overflow-hidden rounded-lg border"
                style={{ borderColor: line, background: on ? `${text}08` : "transparent" }}
              >
                <button
                  type="button"
                  onClick={() => setOpen(on ? null : i)}
                  className="flex w-full items-center gap-4 px-5 py-5 text-left"
                >
                  <span
                    className="text-lg font-bold tabular-nums"
                    style={{ color: primary }}
                  >
                    {i + 1}.
                  </span>
                  <span className="flex-1 text-base font-semibold sm:text-lg" style={{ color: text }}>
                    {f.q}
                  </span>
                  <ArrowRight
                    className="h-5 w-5 shrink-0 transition-transform duration-300"
                    style={{ color: text, transform: on ? "rotate(90deg)" : "none" }}
                  />
                </button>
                <div
                  className="grid transition-all duration-300 ease-out"
                  style={{ gridTemplateRows: on ? "1fr" : "0fr" }}
                >
                  <div className="overflow-hidden">
                    <p className="px-5 pb-5 pl-12 text-[15px] leading-relaxed" style={{ color: `${text}a6` }}>
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
