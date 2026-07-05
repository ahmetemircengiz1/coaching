"use client";

import React from "react";
import { Instagram, Facebook, Youtube, Linkedin, Twitter, Music2 } from "lucide-react";
import type { LandingThemeContent } from "../../types";
import type { EliteGlobalStyles } from "../../elite-config";
import { scrollToCategory, scrollToTop } from "../navbar/nav-helpers";
import {
  getFooterMenuLinks,
  getContactItems,
  getSocialLinks,
  getLegalLinks,
  type SocialKey,
} from "./footer-helpers";

interface EliteProps {
  content: LandingThemeContent;
  config?: EliteGlobalStyles;
}

function SocialGlyph({ k }: { k: SocialKey }) {
  const cls = "h-[18px] w-[18px]";
  switch (k) {
    case "instagram":
      return <Instagram className={cls} />;
    case "facebook":
      return <Facebook className={cls} />;
    case "youtube":
      return <Youtube className={cls} />;
    case "linkedin":
      return <Linkedin className={cls} />;
    case "tiktok":
      return <Music2 className={cls} />;
    default:
      return <Twitter className={cls} />;
  }
}

/**
 * FooterAthlex — solda logo + açıklama + sosyal ikon kutuları, sağda üç
 * sütun (ana bağlantılar / diğer sayfalar / iletişim). Tüm linkler çalışır.
 * inspiredBy: https://athlex.framer.website/
 */
export function FooterAthlex({ content, config }: EliteProps) {
  const texts = content.landingTexts;
  // Footer örnek tasarımı koyu — site teması açık olsa da koyu kalır.
  const bg = "#0a0a0a";
  const brand = content.title || content.brandName || "Coach";
  const menu = getFooterMenuLinks(content);
  const contact = getContactItems(content);
  const social = getSocialLinks(content);
  const legal = getLegalLinks(content);
  const year = new Date().getFullYear();
  const tagline =
    texts?.footerTagline ||
    content.bio ||
    `${brand} ile güçlen, formda kal ve istikrarını koru.`;

  const go = (cat: string) => (cat === "__top__" ? scrollToTop() : scrollToCategory(cat));

  return (
    <section
      id="iletisim"
      data-contact-anchor
      className="px-6 pt-20 pb-10"
      style={{ backgroundColor: bg }}
    >
      <div className="mx-auto flex max-w-7xl flex-col gap-14 md:flex-row md:justify-between">
        {/* Marka */}
        <div className="md:max-w-sm">
          <span className="text-2xl font-extrabold uppercase tracking-tight text-white">
            {brand}
          </span>
          <p className="mt-5 max-w-xs text-sm leading-relaxed text-white/55">
            {tagline}
          </p>
          {social.length > 0 && (
            <div className="mt-7 flex flex-wrap gap-3">
              {social.map((s) => (
                <a
                  key={s.key}
                  href={s.url}
                  target="_blank"
                  rel="noreferrer"
                  aria-label={s.name}
                  className="flex h-10 w-10 items-center justify-center rounded-lg border border-white/12 text-white/70 transition-colors hover:border-white/30 hover:text-white"
                >
                  <SocialGlyph k={s.key} />
                </a>
              ))}
            </div>
          )}
        </div>

        {/* Sütunlar */}
        <div className="flex flex-1 flex-wrap gap-x-12 gap-y-10 md:justify-end">
          <div className="min-w-[150px]">
            <h3 className="mb-5 text-sm font-semibold text-white">Ana Bağlantılar</h3>
            <ul className="space-y-3 text-sm">
              {menu.map((m) => (
                <li key={m.label}>
                  <button
                    onClick={() => go(m.category)}
                    className="text-left text-white/55 transition-colors hover:text-white"
                  >
                    {m.label}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {legal.length > 0 && (
            <div className="min-w-[150px]">
              <h3 className="mb-5 text-sm font-semibold text-white">Diğer Sayfalar</h3>
              <ul className="space-y-3 text-sm">
                {legal.map((l) => (
                  <li key={l.href}>
                    <a
                      href={l.href}
                      className="text-white/55 transition-colors hover:text-white"
                    >
                      {l.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {contact.length > 0 && (
            <div className="min-w-[170px]">
              <h3 className="mb-5 text-sm font-semibold text-white">İletişim</h3>
              <ul className="space-y-3 text-sm">
                {contact.map((c) => (
                  <li key={c.kind}>
                    <a
                      href={c.href}
                      {...(c.external ? { target: "_blank", rel: "noreferrer" } : {})}
                      className="break-words text-white/55 transition-colors hover:text-white"
                    >
                      {c.value}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>

      <div className="mx-auto mt-16 max-w-7xl border-t border-white/10 pt-7 text-sm text-white/40">
        © {year} {brand}
      </div>
    </section>
  );
}
