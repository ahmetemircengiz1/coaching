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
  const cls = "h-4 w-4";
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

const DEFAULT_HOURS = [
  "Pazartesi – Cuma: 06:00 – 21:00",
  "Cumartesi: 08:00 – 18:00",
  "Pazar: 10:00 – 16:00",
];

/**
 * FooterPeak — solda marka + CTA + sayfa/yasal linkleri, sağda kenarlıklı
 * iletişim kartı (sosyal, e-posta, telefon, adres, çalışma saatleri).
 * inspiredBy: https://peakfitness.framer.website/
 */
export function FooterPeak({ content, config }: EliteProps) {
  const accent = config?.primaryColor || "#d2ff3a";
  // Footer örnek tasarımı koyu — site teması açık olsa da koyu kalır.
  const bg = "#0a0a0a";
  const brand = content.title || content.brandName || "Coach";
  const texts = content.landingTexts;
  const menu = getFooterMenuLinks(content);
  const contact = getContactItems(content);
  const social = getSocialLinks(content);
  const legal = getLegalLinks(content);
  const year = new Date().getFullYear();

  const tagline =
    texts?.footerTagline ||
    content.bio ||
    `${brand} olarak fitness yolculuğunun her adımında yanındayız.`;
  const email = contact.find((c) => c.kind === "email");
  const phone = contact.find((c) => c.kind === "phone");
  const address = contact.find((c) => c.kind === "address");
  const hours = (texts?.footerBusinessHours || DEFAULT_HOURS.join("\n"))
    .split("\n")
    .map((l) => l.trim())
    .filter(Boolean);

  const go = (cat: string) => (cat === "__top__" ? scrollToTop() : scrollToCategory(cat));

  return (
    <section
      id="iletisim"
      data-contact-anchor
      className="px-6 pt-20 pb-10"
      style={{ backgroundColor: bg }}
    >
      <div className="mx-auto grid max-w-7xl gap-12 lg:grid-cols-2 lg:gap-16">
        {/* Sol: marka */}
        <div>
          <span className="text-3xl font-black tracking-tight text-white">
            {brand}
          </span>
          <p className="mt-5 max-w-sm text-sm leading-relaxed text-white/60">
            {tagline}
          </p>
          <a
            href={content.authUrl}
            className="mt-7 inline-flex rounded-md px-7 py-3.5 text-sm font-bold text-black transition-transform hover:scale-[1.03]"
            style={{ backgroundColor: accent }}
          >
            Zirveye Ulaşalım
          </a>

          <div className="mt-12">
            <h3 className="mb-4 text-sm font-bold text-white">Sayfalar</h3>
            <div className="flex flex-wrap gap-x-6 gap-y-2 text-sm">
              {menu.map((m) => (
                <button
                  key={m.label}
                  onClick={() => go(m.category)}
                  className="text-white/55 transition-colors hover:text-white"
                >
                  {m.label}
                </button>
              ))}
            </div>
          </div>

          {legal.length > 0 && (
            <div className="mt-8">
              <h3 className="mb-4 text-sm font-bold text-white">Yasal</h3>
              <div className="flex flex-wrap gap-x-6 gap-y-2 text-sm">
                {legal.map((l) => (
                  <a
                    key={l.href}
                    href={l.href}
                    className="text-white/55 transition-colors hover:text-white"
                  >
                    {l.label}
                  </a>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Sağ: iletişim kartı */}
        <div className="rounded-2xl border border-white/15 p-7 sm:p-9">
          {social.length > 0 && (
            <div className="border-b border-white/12 pb-5">
              <h3 className="mb-3 text-sm font-bold text-white">Bizi Takip Edin</h3>
              <div className="flex flex-wrap gap-x-5 gap-y-2">
                {social.map((s) => (
                  <a
                    key={s.key}
                    href={s.url}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1.5 text-sm text-white/65 transition-colors hover:text-white"
                  >
                    <span style={{ color: accent }}>
                      <SocialGlyph k={s.key} />
                    </span>
                    {s.name}
                  </a>
                ))}
              </div>
            </div>
          )}

          {email && (
            <div className="border-b border-white/12 py-5">
              <h3 className="mb-1.5 text-sm font-bold text-white">E-posta</h3>
              <a
                href={email.href}
                className="break-words text-sm text-white/65 transition-colors hover:text-white"
              >
                {email.value}
              </a>
            </div>
          )}

          {phone && (
            <div className="border-b border-white/12 py-5">
              <h3 className="mb-1.5 text-sm font-bold text-white">Telefon</h3>
              <a
                href={phone.href}
                className="text-sm text-white/65 transition-colors hover:text-white"
              >
                {phone.value}
              </a>
            </div>
          )}

          {address && (
            <div className="border-b border-white/12 py-5">
              <h3 className="mb-1.5 text-sm font-bold text-white">Adres</h3>
              <a
                href={address.href}
                target="_blank"
                rel="noreferrer"
                className="whitespace-pre-line text-sm text-white/65 transition-colors hover:text-white"
              >
                {address.value}
              </a>
            </div>
          )}

          <div className="pt-5">
            <h3 className="mb-1.5 text-sm font-bold text-white">Çalışma Saatleri</h3>
            <ul className="space-y-1 text-sm text-white/65">
              {hours.map((h) => (
                <li key={h}>{h}</li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* Alt bar */}
      <div className="mx-auto mt-14 flex max-w-7xl flex-col gap-2 border-t border-white/10 pt-7 text-sm text-white/40 sm:flex-row sm:justify-between">
        <span>
          {brand} — fitness koçluğu
        </span>
        <span>© {year} Tüm hakları saklıdır.</span>
      </div>
    </section>
  );
}
