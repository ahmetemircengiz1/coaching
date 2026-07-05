"use client";

import React, { useState } from "react";
import type { LandingThemeContent } from "../../types";
import type { EliteGlobalStyles } from "../../elite-config";
import { Menu, X } from "lucide-react";
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
 * NavbarDanzia — danzia esinli.
 *
 * Yüzen, geniş, yarı saydam buzlu cam bir çubuk. Solda renkli kalın marka,
 * ortada kritik bölüm sekmeleri, sağda "İletişim" + dolu pill "Giriş Yap".
 * Yüzey ve yazı renkleri altındaki bölüme göre otomatik açık/koyu olur.
 *
 * inspiredBy: https://danzia.framer.website/
 */
interface NavProps {
  content: LandingThemeContent;
  config?: EliteGlobalStyles;
}

export function NavbarDanzia({ content, config }: NavProps) {
  const [open, setOpen] = useState(false);
  const pal = useAdaptiveNavColor(config?.backgroundColor);
  const active = useActiveCategory();
  const links = getNavLinks(content);
  const contact = getContactLinkProps(content);
  const authHref = getAuthHref(content);
  const primary = config?.primaryColor || "#f2e612";
  const brand = content.brandName || content.title || "COACH";

  const go = (cat: string) => {
    setOpen(false);
    scrollToCategory(cat);
  };

  return (
    <div className="fixed inset-x-0 top-4 z-50 px-4">
      <nav
        className="mx-auto flex h-16 max-w-5xl items-center justify-between rounded-[28px] border pl-6 pr-3 backdrop-blur-2xl"
        style={{
          background: pal.surface,
          borderColor: pal.border,
          boxShadow: "0 16px 42px -20px rgba(0,0,0,0.5)",
        }}
      >
        {/* Marka */}
        <button
          type="button"
          onClick={scrollToTop}
          className="text-xl font-extrabold uppercase tracking-tight"
          style={{ color: primary }}
        >
          {brand}
        </button>

        {/* Sekmeler (masaüstü) */}
        <div className="hidden items-center gap-7 md:flex">
          {links.map((l) => (
            <button
              key={l.category}
              type="button"
              onClick={() => go(l.category)}
              className="text-sm font-semibold transition-colors"
              style={{ color: active === l.category ? pal.text : pal.textMuted }}
            >
              {l.label}
            </button>
          ))}
        </div>

        {/* İletişim + Giriş Yap + mobil */}
        <div className="flex items-center gap-2">
          <a
            {...contact}
            className="hidden text-sm font-semibold transition-colors md:inline-flex"
            style={{ color: pal.textMuted }}
          >
            İletişim
          </a>
          <a
            href={authHref}
            className="hidden items-center rounded-full px-6 py-2.5 text-sm font-bold transition-transform hover:scale-105 md:inline-flex"
            style={{ background: primary, color: "#0a0a0a" }}
          >
            Giriş Yap
          </a>
          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            aria-label="Menü"
            className="inline-flex h-10 w-10 items-center justify-center rounded-full md:hidden"
            style={{ color: pal.text }}
          >
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </nav>

      {/* Mobil menü — çubuğun altında ayrı yüzen kart */}
      {open && (
        <div
          className="mx-auto mt-2 max-w-5xl rounded-3xl border p-4 backdrop-blur-2xl md:hidden"
          style={{ background: pal.surfaceSolid, borderColor: pal.border }}
        >
          {links.map((l) => (
            <button
              key={l.category}
              type="button"
              onClick={() => go(l.category)}
              className="block w-full py-2.5 text-left text-sm font-semibold"
              style={{ color: active === l.category ? pal.text : pal.textMuted }}
            >
              {l.label}
            </button>
          ))}
          <a
            {...contact}
            className="block w-full py-2.5 text-left text-sm font-semibold"
            style={{ color: pal.text }}
          >
            İletişim
          </a>
          <a
            href={authHref}
            className="mt-3 flex items-center justify-center rounded-full px-6 py-3 text-sm font-bold"
            style={{ background: primary, color: "#0a0a0a" }}
          >
            Giriş Yap
          </a>
        </div>
      )}
    </div>
  );
}
