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
 * NavbarTransform — transformfitness esinli.
 *
 * Tam genişlikte bar: solda eğik çizgili logo + marka, ortada kritik bölüm
 * sekmeleri, sağda İletişim ve paralelkenar (eğik) "Giriş Yap" butonu.
 *
 * Yazı/yüzey renkleri altındaki bölüme göre otomatik açık/koyu olur.
 *
 * inspiredBy: https://transformfitness.framer.website/
 */
interface NavProps {
  content: LandingThemeContent;
  config?: EliteGlobalStyles;
}

export function NavbarTransform({ content, config }: NavProps) {
  const [open, setOpen] = useState(false);
  const pal = useAdaptiveNavColor(config?.backgroundColor);
  const active = useActiveCategory();
  const links = getNavLinks(content);
  const contact = getContactLinkProps(content);
  const authHref = getAuthHref(content);
  const primary = config?.primaryColor || "#c5f135";
  const brand = content.brandName || content.title || "COACH";

  const go = (cat: string) => {
    setOpen(false);
    scrollToCategory(cat);
  };

  return (
    <nav
      className="fixed inset-x-0 top-0 z-50 border-b backdrop-blur-xl"
      style={{ background: pal.surface, borderColor: pal.border }}
    >
      <div className="mx-auto flex h-[72px] max-w-7xl items-center justify-between px-5 sm:px-8">
        {/* Logo */}
        <button
          type="button"
          onClick={scrollToTop}
          className="flex items-center gap-2.5"
        >
          <span className="flex gap-[3px]">
            {[0, 1, 2].map((i) => (
              <span
                key={i}
                className="block h-4 w-1.5 -skew-x-[20deg]"
                style={{ background: primary, opacity: 1 - i * 0.3 }}
              />
            ))}
          </span>
          <span
            className="text-lg font-extrabold uppercase tracking-tight"
            style={{ color: pal.text }}
          >
            {brand}
          </span>
        </button>

        {/* Sekmeler (masaüstü) */}
        <div className="hidden items-center gap-7 md:flex">
          {links.map((l) => (
            <button
              key={l.category}
              type="button"
              onClick={() => go(l.category)}
              className="text-[13px] font-semibold uppercase tracking-wide transition-colors"
              style={{ color: active === l.category ? pal.text : pal.textMuted }}
            >
              {l.label}
            </button>
          ))}
        </div>

        {/* İletişim + Giriş Yap + mobil tetikleyici */}
        <div className="flex items-center gap-4">
          <a
            {...contact}
            className="hidden text-[13px] font-semibold uppercase tracking-wide transition-colors md:inline-flex"
            style={{ color: pal.textMuted }}
          >
            İletişim
          </a>
          <a
            href={authHref}
            className="hidden -skew-x-[14deg] items-center px-6 py-2.5 text-[13px] font-extrabold uppercase tracking-wide transition-transform hover:scale-105 md:inline-flex"
            style={{ background: primary, color: "#0a0a0a" }}
          >
            <span className="skew-x-[14deg]">Giriş Yap</span>
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
          className="border-t px-5 py-4 md:hidden"
          style={{ borderColor: pal.border, background: pal.surfaceSolid }}
        >
          {links.map((l) => (
            <button
              key={l.category}
              type="button"
              onClick={() => go(l.category)}
              className="block w-full py-2.5 text-left text-sm font-semibold uppercase tracking-wide"
              style={{ color: active === l.category ? primary : pal.text }}
            >
              {l.label}
            </button>
          ))}
          <a
            {...contact}
            className="block w-full py-2.5 text-left text-sm font-semibold uppercase tracking-wide"
            style={{ color: pal.text }}
          >
            İletişim
          </a>
          <a
            href={authHref}
            className="mt-3 inline-flex w-full -skew-x-[14deg] justify-center px-6 py-3 text-sm font-extrabold uppercase tracking-wide"
            style={{ background: primary, color: "#0a0a0a" }}
          >
            <span className="skew-x-[14deg]">Giriş Yap</span>
          </a>
        </div>
      )}
    </nav>
  );
}
