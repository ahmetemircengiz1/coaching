"use client";

import React, { useState } from "react";
import type { LandingThemeContent } from "../../types";
import type { EliteGlobalStyles } from "../../elite-config";
import { Menu, X, ArrowUpRight } from "lucide-react";
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
 * NavbarFithu — fithu esinli.
 *
 * Ortada yüzen küçük bir pill: marka adı + menü tuşu yan yana. Menü tuşuna
 * basılınca pill aşağı doğru bir karta dönüşür; kritik bölüm sekmeleri ve
 * İletişim dikey listelenir, altta dashboard'a giriş için "Giriş Yap" butonu.
 *
 * Yazı/yüzey renkleri altındaki bölüme göre otomatik açık/koyu olur.
 *
 * inspiredBy: https://fithu.framer.website/
 */
interface NavProps {
  content: LandingThemeContent;
  config?: EliteGlobalStyles;
}

export function NavbarFithu({ content, config }: NavProps) {
  const [open, setOpen] = useState(false);
  const pal = useAdaptiveNavColor(config?.backgroundColor);
  const active = useActiveCategory();
  const links = getNavLinks(content);
  const contact = getContactLinkProps(content);
  const authHref = getAuthHref(content);
  const primary = config?.primaryColor || "#9ae66e";
  const brand = content.brandName || content.title || "COACH";

  const go = (cat: string) => {
    setOpen(false);
    scrollToCategory(cat);
  };

  return (
    <div className="fixed inset-x-0 top-4 z-50 flex justify-center px-4">
      <div
        className="w-full max-w-[420px] overflow-hidden rounded-[26px] border backdrop-blur-2xl transition-all duration-300"
        style={{
          background: pal.surfaceSolid,
          borderColor: pal.border,
          boxShadow: "0 20px 50px -22px rgba(0,0,0,0.55)",
        }}
      >
        {/* Üst satır: marka + menü/kapat */}
        <div className="flex items-center justify-between gap-4 px-5 py-3.5">
          <button
            type="button"
            onClick={scrollToTop}
            className="text-base font-semibold uppercase"
            style={{ color: pal.text, letterSpacing: "0.34em" }}
          >
            {brand}
          </button>
          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            aria-label={open ? "Menüyü kapat" : "Menüyü aç"}
            className="inline-flex h-9 w-9 items-center justify-center rounded-full transition-colors"
            style={{ color: pal.text, background: pal.border }}
          >
            {open ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
          </button>
        </div>

        {/* Açılır içerik — grid satır geçişiyle yumuşak yükseklik animasyonu */}
        <div
          className="grid transition-all duration-300 ease-out"
          style={{ gridTemplateRows: open ? "1fr" : "0fr" }}
        >
          <div className="overflow-hidden">
            <div className="px-3 pb-3">
              {links.map((l) => (
                <button
                  key={l.category}
                  type="button"
                  onClick={() => go(l.category)}
                  className="group flex w-full items-center justify-between border-t px-2 py-3 text-left"
                  style={{ borderColor: pal.border }}
                >
                  <span
                    className="text-[15px] font-medium"
                    style={{ color: active === l.category ? primary : pal.text }}
                  >
                    {l.label}
                  </span>
                  <ArrowUpRight
                    className="h-4 w-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                    style={{ color: pal.textMuted }}
                  />
                </button>
              ))}
              {/* İletişim */}
              <a
                {...contact}
                className="group flex w-full items-center justify-between border-t px-2 py-3"
                style={{ borderColor: pal.border }}
              >
                <span
                  className="text-[15px] font-medium"
                  style={{ color: pal.text }}
                >
                  İletişim
                </span>
                <ArrowUpRight
                  className="h-4 w-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                  style={{ color: pal.textMuted }}
                />
              </a>
              {/* Dashboard girişi */}
              <a
                href={authHref}
                className="mt-3 flex items-center justify-center rounded-2xl px-5 py-3 text-sm font-bold transition-transform hover:scale-[1.02]"
                style={{ background: primary, color: "#0a0a0a" }}
              >
                Giriş Yap
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
