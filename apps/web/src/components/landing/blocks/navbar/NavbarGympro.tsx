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
 * NavbarGympro — gympro esinli.
 *
 * Tam genişlikte şeffaf bar: solda logo, ortada kritik bölüm sekmeleri (kutu
 * içinde değil, doğrudan sayfa üzerine yerleşmiş), sağda "İletişim" + dolu
 * köşeli "Giriş Yap" butonu. Aktif sekme vurgu rengiyle işaretlenir. Yazı
 * rengi altındaki bölüme göre otomatik açık/koyu olur.
 *
 * inspiredBy: https://gympro.framer.website/
 */
interface NavProps {
  content: LandingThemeContent;
  config?: EliteGlobalStyles;
}

export function NavbarGympro({ content, config }: NavProps) {
  const [open, setOpen] = useState(false);
  const pal = useAdaptiveNavColor(config?.backgroundColor);
  const active = useActiveCategory();
  const links = getNavLinks(content);
  const contact = getContactLinkProps(content);
  const authHref = getAuthHref(content);
  const primary = config?.primaryColor || "#f5d614";
  const brand = content.brandName || content.title || "COACH";

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
      <div className="relative mx-auto flex h-[78px] max-w-7xl items-center justify-between px-5 sm:px-8">
        {/* Marka */}
        <button
          type="button"
          onClick={scrollToTop}
          className="text-xl font-extrabold uppercase tracking-tight"
          style={{ color: pal.text }}
        >
          {brand}
        </button>

        {/* Sekmeler — kutusuz, doğrudan sayfa üzerinde */}
        <div className="hidden items-center gap-8 md:flex">
          {links.map((l) => (
            <button
              key={l.category}
              type="button"
              onClick={() => go(l.category)}
              className="text-[13px] font-bold uppercase tracking-wide transition-colors"
              style={{ color: active === l.category ? primary : pal.text }}
            >
              {l.label}
            </button>
          ))}
        </div>

        {/* İletişim + Giriş Yap + mobil */}
        <div className="flex items-center gap-4">
          <a
            {...contact}
            className="hidden text-[13px] font-bold uppercase tracking-wide transition-colors md:inline-flex"
            style={{ color: pal.text }}
          >
            İletişim
          </a>
          <a
            href={authHref}
            className="hidden items-center gap-2 px-6 py-3 text-[13px] font-extrabold uppercase tracking-wide transition-transform hover:scale-105 md:inline-flex"
            style={{ background: primary, color: "#0a0a0a" }}
          >
            Giriş Yap
            <ArrowRight className="h-4 w-4" />
          </a>
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
          className="relative border-t px-5 py-4 md:hidden"
          style={{ borderColor: pal.border, background: pal.surfaceSolid }}
        >
          {links.map((l) => (
            <button
              key={l.category}
              type="button"
              onClick={() => go(l.category)}
              className="block w-full py-2.5 text-left text-sm font-bold uppercase tracking-wide"
              style={{ color: active === l.category ? primary : pal.text }}
            >
              {l.label}
            </button>
          ))}
          <a
            {...contact}
            className="block w-full py-2.5 text-left text-sm font-bold uppercase tracking-wide"
            style={{ color: pal.text }}
          >
            İletişim
          </a>
          <a
            href={authHref}
            className="mt-3 flex items-center justify-center gap-2 px-6 py-3 text-sm font-extrabold uppercase tracking-wide"
            style={{ background: primary, color: "#0a0a0a" }}
          >
            Giriş Yap
            <ArrowRight className="h-4 w-4" />
          </a>
        </div>
      )}
    </nav>
  );
}
