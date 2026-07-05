"use client";

import React from "react";
import type { LandingThemeContent } from "../../types";
import type { EliteGlobalStyles } from "../../elite-config";
import { scrollToCategory, scrollToTop } from "../navbar/nav-helpers";
import {
  getFooterMenuLinks,
  getContactItems,
  getSocialLinks,
  getLegalLinks,
} from "./footer-helpers";

interface EliteProps {
  content: LandingThemeContent;
  config?: EliteGlobalStyles;
}

/**
 * FooterYogus — üstte dev başlık + tanıtım, altta 4 sütunlu iletişim/menü.
 * Tüm bağlantılar çalışır: menü bölümlere kaydırır, iletişim kanalları
 * tel:/mailto:/WhatsApp/harita açar, sosyal linkler gerçek profillere gider.
 * inspiredBy: https://yogus.framer.website/
 */
export function FooterYogus({ content, config }: EliteProps) {
  const texts = content.landingTexts;
  // Footer örnek tasarımı koyu kahve — site teması açık olsa da koyu kalır.
  const bg = "#2a2017";
  const brand = content.title || content.brandName || "Coach";
  const menu = getFooterMenuLinks(content);
  const contact = getContactItems(content);
  const social = getSocialLinks(content);
  const legal = getLegalLinks(content);
  const year = new Date().getFullYear();

  const headline = texts?.footerHeadline || "Yerini bul, yolculuğa burada başla";
  const tagline =
    texts?.footerTagline ||
    content.bio ||
    `${brand} ile hedeflerine ulaşmak için doğru yerdesin.`;
  const phone = contact.find((c) => c.kind === "phone");

  const go = (cat: string) => (cat === "__top__" ? scrollToTop() : scrollToCategory(cat));

  return (
    <section
      id="iletisim"
      data-contact-anchor
      className="px-6 pt-20 pb-10"
      style={{ backgroundColor: bg, color: "#f3ede2" }}
    >
      <div className="mx-auto max-w-7xl">
        {/* Üst: başlık + tanıtım */}
        <div className="grid gap-10 pb-24 md:grid-cols-2 md:pb-40">
          <h2 className="max-w-xl text-4xl font-medium leading-[1.1] tracking-tight sm:text-5xl md:text-6xl">
            {headline}
          </h2>
          <div className="flex flex-col items-start gap-5 md:items-end md:text-right">
            <p className="max-w-sm text-lg leading-relaxed text-white/65">{tagline}</p>
            <a
              href={content.authUrl}
              className="border-b border-current pb-1 text-lg font-medium transition-opacity hover:opacity-70"
            >
              Hemen Katıl
            </a>
          </div>
        </div>

        {/* Sütunlar */}
        <div className="grid grid-cols-2 gap-x-8 gap-y-12 border-t border-white/15 pt-12 lg:grid-cols-4">
          <FooterCol title="Menü">
            {menu.map((m) => (
              <li key={m.label}>
                <button
                  onClick={() => go(m.category)}
                  className="text-left text-white/65 transition-colors hover:text-white"
                >
                  {m.label}
                </button>
              </li>
            ))}
          </FooterCol>

          {contact.length > 0 && (
            <FooterCol title="İletişim">
              {contact.map((c) => (
                <li key={c.kind}>
                  <a
                    href={c.href}
                    {...(c.external ? { target: "_blank", rel: "noreferrer" } : {})}
                    className="text-white/65 transition-colors hover:text-white"
                  >
                    {c.actionLabel}
                  </a>
                </li>
              ))}
            </FooterCol>
          )}

          {legal.length > 0 && (
            <FooterCol title="Keşfet">
              {legal.map((l) => (
                <li key={l.href}>
                  <a
                    href={l.href}
                    className="text-white/65 transition-colors hover:text-white"
                  >
                    {l.label}
                  </a>
                </li>
              ))}
            </FooterCol>
          )}

          {social.length > 0 && (
            <FooterCol title="Bizi Takip Et">
              {social.map((s) => (
                <li key={s.key}>
                  <a
                    href={s.url}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1.5 text-white/65 transition-colors hover:text-white"
                  >
                    {s.name} <span aria-hidden>↗</span>
                  </a>
                </li>
              ))}
            </FooterCol>
          )}
        </div>

        {/* Alt bar */}
        <div className="mt-16 flex flex-col gap-2 text-sm text-white/45 sm:flex-row sm:items-center sm:justify-between">
          <span>
            © {year}, {brand}
          </span>
          {phone && (
            <a href={phone.href} className="transition-colors hover:text-white/80">
              {phone.value}
            </a>
          )}
        </div>
      </div>
    </section>
  );
}

function FooterCol({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <h3 className="mb-6 text-base font-medium text-white/90">{title}</h3>
      <ul className="space-y-3.5 text-[15px]">{children}</ul>
    </div>
  );
}
