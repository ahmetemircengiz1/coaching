"use client";

import React from "react";
import type { LandingThemeContent } from "../../types";
import type { EliteGlobalStyles } from "../../elite-config";
import { scrollToCategory, scrollToTop } from "../navbar/nav-helpers";
import { getFooterMenuLinks, getContactItems, getLegalLinks } from "./footer-helpers";

interface EliteProps {
  content: LandingThemeContent;
  config?: EliteGlobalStyles;
}

/**
 * FooterGymix — solda yaşam tarzı görseli, ortada büyük büyük-harf menü,
 * sağda dev iletişim değerleri; altta soluk dev marka filigranı.
 * inspiredBy: https://gymix.framer.website/
 */
export function FooterGymix({ content, config }: EliteProps) {
  const accent = config?.primaryColor || "#d2ff3a";
  // Footer örnek tasarımı koyu — site teması açık olsa da koyu kalır.
  const bg = "#161616";
  const brand = content.title || content.brandName || "Coach";
  const menu = getFooterMenuLinks(content);
  const contact = getContactItems(content);
  const legal = getLegalLinks(content);
  const year = new Date().getFullYear();

  const go = (cat: string) => (cat === "__top__" ? scrollToTop() : scrollToCategory(cat));

  return (
    <section
      id="iletisim"
      data-contact-anchor
      className="relative overflow-hidden px-6 pt-20"
      style={{ backgroundColor: bg }}
    >
      <div className="mx-auto grid max-w-7xl gap-12 pb-14 md:grid-cols-2 md:gap-16">
        {/* Önemli bağlantılar */}
        <div>
          <h3
            className="mb-8 text-sm font-bold uppercase tracking-[0.2em]"
            style={{ color: accent }}
          >
            Önemli Bağlantılar
          </h3>
          <ul className="space-y-5">
            {menu.map((m) => (
              <li key={m.label}>
                <button
                  onClick={() => go(m.category)}
                  className="text-2xl font-extrabold uppercase tracking-tight text-white/65 transition-colors hover:text-white sm:text-3xl"
                >
                  {m.label}
                </button>
              </li>
            ))}
          </ul>
        </div>

        {/* İletişim */}
        <div>
          <h3
            className="mb-8 text-sm font-bold uppercase tracking-[0.2em]"
            style={{ color: accent }}
          >
            İletişim
          </h3>
          <ul className="space-y-5">
            {contact.map((c) => (
              <li key={c.kind}>
                <a
                  href={c.href}
                  {...(c.external ? { target: "_blank", rel: "noreferrer" } : {})}
                  className="block break-words text-2xl font-extrabold uppercase tracking-tight text-white/85 transition-colors hover:text-white sm:text-3xl"
                >
                  {c.value}
                </a>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Dev marka filigranı */}
      <div className="select-none border-t border-white/10 pt-6">
        <span className="block overflow-hidden text-center text-[15vw] font-black uppercase leading-[0.8] tracking-tighter text-white/[0.05]">
          {brand}
        </span>
      </div>

      {/* Alt bar */}
      <div className="mx-auto flex max-w-7xl flex-col items-center gap-3 py-7 text-sm text-white/40 sm:flex-row sm:justify-between">
        <span>
          © {year} {brand}. Tüm hakları saklıdır.
        </span>
        {legal.length > 0 && (
          <div className="flex flex-wrap justify-center gap-x-5 gap-y-2">
            {legal.map((l) => (
              <a
                key={l.href}
                href={l.href}
                className="transition-colors hover:text-white/80"
              >
                {l.label}
              </a>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
