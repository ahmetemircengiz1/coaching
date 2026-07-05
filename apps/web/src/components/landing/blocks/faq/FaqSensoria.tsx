"use client";

import React, { useState } from "react";
import type { LandingThemeContent } from "../../types";
import type { EliteGlobalStyles } from "../../elite-config";
import { Plus, Minus, HelpCircle } from "lucide-react";
import { resolveFaqs } from "./faq-data";

/**
 * FaqSensoria — sensoria esinli.
 *
 * Devasa iki tonlu sıkışık başlık. İki sütun: solda "Bize ulaşın" iletişim
 * kartı (ikon + açıklama + buton), sağda koyu akordeon maddeleri (+/− ikonlu),
 * ilk madde açık gelir.
 *
 * inspiredBy: https://sensoria.framer.website/
 */
interface Props {
  content: LandingThemeContent;
  config?: EliteGlobalStyles;
}

export function FaqSensoria({ content, config }: Props) {
  const faqs = resolveFaqs(content);
  const [open, setOpen] = useState<number | null>(0);

  const primary = config?.primaryColor || "#ffffff";
  const bg = config?.backgroundColor || "#0a0a0b";
  const text = config?.textColor || "#ffffff";
  const headingFont = 'var(--font-oswald), "Arial Narrow", sans-serif';
  const contactHref = content.whatsappNumber ? content.whatsappUrl : content.authUrl;
  const contactExternal = !!content.whatsappNumber;

  const title = content.landingTexts?.faqTitle || "Sıkça Sorulan Sorular";
  const parts = title.trim().split(/\s+/);
  const head = parts.length > 1 ? parts.slice(0, -1).join(" ") : title;
  const last = parts.length > 1 ? parts[parts.length - 1] : "";

  return (
    <section className="px-6 py-24 sm:py-32" style={{ backgroundColor: bg }}>
      <div className="mx-auto max-w-6xl">
        <h2
          className="font-extrabold uppercase"
          style={{ fontFamily: headingFont, fontSize: "clamp(2.4rem, 7vw, 6rem)", lineHeight: 0.94 }}
        >
          <span style={{ color: text }}>{head} </span>
          {last && <span style={{ color: `${text}59` }}>{last}</span>}
        </h2>

        <div className="mt-12 grid gap-6 lg:grid-cols-[0.66fr_1.34fr] lg:gap-8">
          {/* Sol: iletişim kartı */}
          <div
            className="flex flex-col rounded-2xl border p-7"
            style={{ background: `${text}07`, borderColor: `${text}14` }}
          >
            <span
              className="inline-flex h-11 w-11 items-center justify-center rounded-xl"
              style={{ background: `${text}12`, color: text }}
            >
              <HelpCircle className="h-5 w-5" />
            </span>
            <h3 className="mt-5 text-xl font-bold" style={{ color: text }}>
              Bize ulaşın
            </h3>
            <p className="mt-2 text-sm leading-relaxed" style={{ color: `${text}80` }}>
              Aklındaki her soru için ekibimiz kişisel olarak yardımcı olmaya
              hazır.
            </p>
            <a
              href={contactHref}
              target={contactExternal ? "_blank" : undefined}
              rel={contactExternal ? "noreferrer" : undefined}
              className="mt-6 inline-flex items-center justify-center rounded-full py-3.5 text-sm font-bold transition-transform hover:scale-[1.02]"
              style={{ background: "#ffffff", color: "#0a0a0a" }}
            >
              İletişime Geç
            </a>
          </div>

          {/* Sağ: akordeon */}
          <div className="flex flex-col gap-3">
            {faqs.map((f, i) => {
              const on = open === i;
              return (
                <div
                  key={i}
                  className="overflow-hidden rounded-2xl border"
                  style={{ background: `${text}07`, borderColor: `${text}14` }}
                >
                  <button
                    type="button"
                    onClick={() => setOpen(on ? null : i)}
                    className="flex w-full items-center justify-between gap-4 px-6 py-5 text-left"
                  >
                    <span className="text-base font-semibold sm:text-lg" style={{ color: text }}>
                      {f.q}
                    </span>
                    <span style={{ color: on ? primary : `${text}99` }}>
                      {on ? <Minus className="h-5 w-5" /> : <Plus className="h-5 w-5" />}
                    </span>
                  </button>
                  <div
                    className="grid transition-all duration-300 ease-out"
                    style={{ gridTemplateRows: on ? "1fr" : "0fr" }}
                  >
                    <div className="overflow-hidden">
                      <p className="px-6 pb-5 text-[15px] leading-relaxed" style={{ color: `${text}99` }}>
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
