"use client";

import React, { useState } from "react";
import type { LandingThemeContent } from "../../types";
import type { EliteGlobalStyles } from "../../elite-config";
import { Menu, X, ArrowRight } from "lucide-react";
import {
  getNavLinks,
  scrollToCategory,
  scrollToTop,
  getContactLinkProps,
  getAuthHref,
  useAdaptiveNavColor,
  useActiveCategory,
} from "./nav-helpers";

/**
 * NavbarGoalz — goalz esinli.
 *
 * Solda sıkışık (condensed) kalın marka wordmark'ı; sağ tarafta ise her biri
 * kendi yuvarlatılmış kutusunda duran kritik bölüm sekmeleri ve hemen yanında
 * "İletişim" + dolu "Giriş Yap" butonu kümelenir. Tüm kutular aynı boyut ve
 * şekli paylaşır. Şeffaf — yazı rengi altındaki bölüme göre otomatik
 * açık/koyu olur.
 *
 * inspiredBy: https://goalz-template.framer.website/
 */
interface NavProps {
  content: LandingThemeContent;
  config?: EliteGlobalStyles;
}

// Tüm kutuların paylaştığı ortak ölçü ve şekil — sıranın hizalı görünmesi için
const BOX =
  "rounded-2xl px-5 py-3 text-[12px] font-semibold uppercase tracking-[0.1em]";

export function NavbarGoalz({ content, config }: NavProps) {
  const [open, setOpen] = useState(false);
  const pal = useAdaptiveNavColor(config?.backgroundColor);
  const active = useActiveCategory();
  const links = getNavLinks(content);
  const contact = getContactLinkProps(content);
  const authHref = getAuthHref(content);
  const primary = config?.primaryColor || "#b9f178";
  const brand = content.brandName || content.title || "COACH";
  const condensed = 'var(--font-oswald), "Arial Narrow", sans-serif';

  const go = (cat: string) => {
    setOpen(false);
    scrollToCategory(cat);
  };

  return (
    <nav className="fixed inset-x-0 top-0 z-50">
      <div
        className="pointer-events-none absolute inset-x-0 top-0 h-24"
        style={{ background: pal.scrim }}
      />
      <div className="relative mx-auto flex h-[88px] max-w-7xl items-center justify-between px-5 sm:px-8">
        {/* Marka — solda, sıkışık kalın wordmark */}
        <button
          type="button"
          onClick={scrollToTop}
          className="text-[26px] font-bold uppercase leading-none"
          style={{ color: pal.text, fontFamily: condensed, letterSpacing: "0.01em" }}
        >
          {brand}
        </button>

        {/* Sağ küme: sekmeler + İletişim + Giriş Yap */}
        <div className="flex items-center gap-3">
          {/* Kutulu sekmeler (masaüstü) */}
          <div className="hidden items-center gap-2 md:flex">
            {links.map((l) => {
              const on = active === l.category;
              return (
                <button
                  key={l.category}
                  type="button"
                  onClick={() => go(l.category)}
                  className={`${BOX} border transition-colors`}
                  style={{
                    borderColor: on ? primary : pal.border,
                    background: pal.surface,
                    color: on ? primary : pal.text,
                  }}
                >
                  {l.label}
                </button>
              );
            })}
          </div>

          {/* İletişim + Giriş Yap (masaüstü) */}
          <div className="hidden items-center gap-2 md:flex">
            <a
              {...contact}
              className={`${BOX} border transition-colors`}
              style={{
                borderColor: pal.border,
                background: pal.surface,
                color: pal.text,
              }}
            >
              İletişim
            </a>
            <a
              href={authHref}
              className={`${BOX} inline-flex items-center gap-1.5 transition-transform hover:scale-105`}
              style={{ background: primary, color: "#0a0a0a" }}
            >
              Giriş Yap
              <ArrowRight className="h-3.5 w-3.5" />
            </a>
          </div>

          {/* Mobil tetikleyici */}
          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            aria-label="Menü"
            className="inline-flex h-10 w-10 items-center justify-center md:hidden"
            style={{ color: pal.text }}
          >
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {/* Mobil menü */}
      {open && (
        <div
          className="relative mx-5 mb-4 rounded-3xl border p-3 backdrop-blur-2xl md:hidden"
          style={{ background: pal.surfaceSolid, borderColor: pal.border }}
        >
          {links.map((l) => (
            <button
              key={l.category}
              type="button"
              onClick={() => go(l.category)}
              className="block w-full rounded-2xl px-4 py-2.5 text-left text-[13px] font-semibold uppercase tracking-[0.1em]"
              style={{ color: active === l.category ? primary : pal.text }}
            >
              {l.label}
            </button>
          ))}
          <a
            {...contact}
            className="mt-1 flex items-center justify-center rounded-2xl border px-5 py-3 text-[13px] font-semibold uppercase tracking-[0.1em]"
            style={{ borderColor: pal.border, color: pal.text }}
          >
            İletişim
          </a>
          <a
            href={authHref}
            className="mt-2 flex items-center justify-center gap-1.5 rounded-2xl px-5 py-3 text-[13px] font-semibold uppercase tracking-[0.1em]"
            style={{ background: primary, color: "#0a0a0a" }}
          >
            Giriş Yap
            <ArrowRight className="h-3.5 w-3.5" />
          </a>
        </div>
      )}
    </nav>
  );
}
