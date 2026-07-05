"use client";

import React, { useState } from "react";
import { ArrowUpRight } from "lucide-react";
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

type LinkRow =
  | { kind: "scroll"; label: string; target: string }
  | { kind: "link"; label: string; target: string };

/**
 * FooterJimMentor — solda iki menü sütunu, ortada bülten kutusu, sağda
 * dikey sosyal/iletişim satırları; altta adres + telif + marka.
 * inspiredBy: https://jimmentor.framer.website/
 */
export function FooterJimMentor({ content, config }: EliteProps) {
  const accent = config?.primaryColor || "#a3e635";
  // Footer örnek tasarımı koyu yeşil — site teması açık olsa da koyu kalır.
  const bg = "#0a2620";
  const brand = content.title || content.brandName || "Coach";
  const menu = getFooterMenuLinks(content);
  const contact = getContactItems(content);
  const social = getSocialLinks(content);
  const legal = getLegalLinks(content);
  const year = new Date().getFullYear();
  const address = contact.find((c) => c.kind === "address");

  const [email, setEmail] = useState("");

  const go = (cat: string) => (cat === "__top__" ? scrollToTop() : scrollToCategory(cat));

  // İki menü sütunu — bölüm linkleri + yasal sayfalar
  const allRows: LinkRow[] = [
    ...menu.map((m): LinkRow => ({ kind: "scroll", label: m.label, target: m.category })),
    ...legal.map((l): LinkRow => ({ kind: "link", label: l.label, target: l.href })),
  ];
  const mid = Math.ceil(allRows.length / 2);
  const colA = allRows.slice(0, mid);
  const colB = allRows.slice(mid);

  // Sağ sütun — WhatsApp + sosyal kanallar
  const wa = contact.find((c) => c.kind === "whatsapp");
  const channels: { name: string; href: string }[] = [
    ...(wa ? [{ name: "WhatsApp", href: wa.href }] : []),
    ...social.map((s) => ({ name: s.name, href: s.url })),
  ];

  const subscribe = () => {
    const v = email.trim();
    if (!v || !content.email) return;
    window.location.href = `mailto:${content.email}?subject=${encodeURIComponent(
      "Bülten aboneliği"
    )}&body=${encodeURIComponent(`Bülten listesine eklenmek istiyorum: ${v}`)}`;
  };

  const renderRow = (r: LinkRow) =>
    r.kind === "scroll" ? (
      <button
        onClick={() => go(r.target)}
        className="text-left text-lg font-extrabold uppercase tracking-tight text-white/70 transition-colors hover:text-white"
      >
        {r.label}
      </button>
    ) : (
      <a
        href={r.target}
        className="text-lg font-extrabold uppercase tracking-tight text-white/70 transition-colors hover:text-white"
      >
        {r.label}
      </a>
    );

  return (
    <section
      id="iletisim"
      data-contact-anchor
      className="px-6 pt-20 pb-10"
      style={{ backgroundColor: bg }}
    >
      <div className="mx-auto max-w-7xl">
        <div className="grid gap-px overflow-hidden border border-white/10 bg-white/10 lg:grid-cols-[1.3fr_1fr_0.9fr]">
          {/* İki menü sütunu */}
          <div
            className="grid grid-cols-2 gap-8 p-8"
            style={{ backgroundColor: bg }}
          >
            <ul className="space-y-5">
              {colA.map((r) => (
                <li key={r.label}>{renderRow(r)}</li>
              ))}
            </ul>
            <ul className="space-y-5">
              {colB.map((r) => (
                <li key={r.label}>{renderRow(r)}</li>
              ))}
            </ul>
          </div>

          {/* Bülten */}
          <div className="p-8" style={{ backgroundColor: bg }}>
            <h3 className="text-lg font-extrabold uppercase tracking-tight text-white">
              Fitness Güncellemelerine Kaydol
            </h3>
            <p className="mt-3 text-sm leading-relaxed text-white/55">
              Uzman ipuçları, antrenman planları ve sağlık içerikleriyle motive
              kal. E-postanı önemsiyoruz — spam yok, yalnız değerli güncellemeler.
            </p>
            <div className="mt-6 flex items-center gap-3 border-b border-white/25 pb-2">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && subscribe()}
                placeholder="E-postanı gir"
                className="w-full bg-transparent text-sm text-white placeholder:text-white/40 focus:outline-none"
              />
              <button
                onClick={subscribe}
                aria-label="Bültene kaydol"
                className="shrink-0 transition-transform hover:translate-x-0.5"
                style={{ color: accent }}
              >
                <ArrowUpRight className="h-5 w-5" />
              </button>
            </div>
          </div>

          {/* Sosyal kanallar */}
          <div className="flex flex-col" style={{ backgroundColor: bg }}>
            {channels.length > 0 ? (
              channels.map((ch) => (
                <a
                  key={ch.name}
                  href={ch.href}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center justify-between border-b border-white/10 px-8 py-5 transition-colors last:border-b-0 hover:bg-white/5"
                >
                  <span className="text-base font-extrabold uppercase tracking-tight text-white/85">
                    {ch.name}
                  </span>
                  <ArrowUpRight className="h-4 w-4" style={{ color: accent }} />
                </a>
              ))
            ) : (
              <div className="flex flex-1 items-center px-8 py-5 text-sm text-white/40">
                Sosyal medya hesapları yakında.
              </div>
            )}
          </div>
        </div>

        {/* Alt bar */}
        <div className="mt-10 grid gap-6 text-sm sm:grid-cols-3 sm:items-center">
          <div className="text-white/55">
            {address ? (
              <>
                <div className="mb-1 text-xs uppercase tracking-widest text-white/40">
                  Adres
                </div>
                <a
                  href={address.href}
                  target="_blank"
                  rel="noreferrer"
                  className="transition-colors hover:text-white"
                >
                  {address.value}
                </a>
              </>
            ) : (
              <span className="text-white/40">
                © {year} {brand}
              </span>
            )}
          </div>
          <div className="text-center text-white/45">
            © {brand} {year}. Tüm hakları saklıdır.
          </div>
          <div className="text-center sm:text-right">
            <span
              className="text-xl font-black uppercase tracking-tight"
              style={{ color: accent }}
            >
              {brand}
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}
