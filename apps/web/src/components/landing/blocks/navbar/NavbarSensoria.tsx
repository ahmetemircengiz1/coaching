"use client";

import React, { useState } from "react";
import type { LandingThemeContent } from "../../types";
import type { EliteGlobalStyles } from "../../elite-config";
import { X } from "lucide-react";
import {
  getNavLinks,
  scrollToCategory,
  scrollToTop,
  getContactLinkProps,
  getAuthHref,
  useAdaptiveNavColor,
  useActiveCategory,
  isLightColor,
} from "./nav-helpers";

/**
 * NavbarSensoria — sensoria esinli.
 *
 * Çok sade üst bar: solda marka, sağda menü tuşu. Menü tuşuna basılınca
 * neredeyse tüm sayfayı kaplayan bir overlay açılır: solda büyük serif kritik
 * bölüm sekmeleri, sağda "Giriş Yap" + "İletişim", altta destek e-postası.
 *
 * Üst bar şeffaf olduğu için yazı rengi altındaki bölüme göre otomatik
 * açık/koyu olur; overlay ise site temel rengine göre kendi paletini kullanır.
 *
 * inspiredBy: https://sensoria.framer.website/
 */
interface NavProps {
  content: LandingThemeContent;
  config?: EliteGlobalStyles;
}

export function NavbarSensoria({ content, config }: NavProps) {
  const [open, setOpen] = useState(false);
  const pal = useAdaptiveNavColor(config?.backgroundColor);
  const active = useActiveCategory();
  const links = getNavLinks(content);
  const contact = getContactLinkProps(content);
  const authHref = getAuthHref(content);
  const brand = content.brandName || content.title || "Coach";
  const serif = 'Georgia, "Times New Roman", serif';
  const primary = config?.primaryColor || "#ffffff";

  // Overlay, sayfayı tamamen kapatır — site temel rengine göre sabit palet
  const overlayLight = isLightColor(config?.backgroundColor || "#0a0a0a");
  const ovBg = overlayLight ? "#f4f4f3" : "#0a0a0b";
  const ovText = overlayLight ? "#0d0d0f" : "#ffffff";
  const ovMuted = overlayLight ? "rgba(13,13,15,0.55)" : "rgba(255,255,255,0.55)";
  const ovBorder = overlayLight ? "rgba(0,0,0,0.12)" : "rgba(255,255,255,0.14)";

  const go = (cat: string) => {
    setOpen(false);
    scrollToCategory(cat);
  };

  return (
    <>
      {/* Üst bar — şeffaf, sadece marka + menü */}
      <nav className="fixed inset-x-0 top-0 z-50">
        <div
          className="pointer-events-none absolute inset-x-0 top-0 h-24"
          style={{ background: pal.scrim }}
        />
        <div className="relative mx-auto flex h-20 max-w-[1500px] items-center justify-between px-6 lg:px-10">
          <button
            type="button"
            onClick={scrollToTop}
            className="text-2xl"
            style={{ color: pal.text, fontFamily: serif }}
          >
            {brand}
          </button>
          <button
            type="button"
            onClick={() => setOpen(true)}
            aria-label="Menüyü aç"
            className="inline-flex flex-col items-end gap-[6px] p-2"
          >
            <span className="block h-[2px] w-8" style={{ background: pal.text }} />
            <span className="block h-[2px] w-8" style={{ background: pal.text }} />
          </button>
        </div>
      </nav>

      {/* Tam ekran overlay menü */}
      {open && (
        <div
          className="fixed inset-0 z-[60] flex flex-col"
          style={{ background: ovBg }}
        >
          <div className="flex items-center justify-between px-6 py-6 lg:px-10">
            <span className="text-2xl" style={{ color: ovText, fontFamily: serif }}>
              {brand}
            </span>
            <button
              type="button"
              onClick={() => setOpen(false)}
              aria-label="Kapat"
              style={{ color: ovText }}
            >
              <X className="h-7 w-7" />
            </button>
          </div>

          <div className="flex flex-1 flex-col justify-center gap-10 px-6 lg:flex-row lg:items-center lg:justify-between lg:px-10">
            {/* Büyük kritik bölüm sekmeleri */}
            <nav className="flex flex-col gap-1">
              {links.map((l) => (
                <button
                  key={l.category}
                  type="button"
                  onClick={() => go(l.category)}
                  className="text-left font-medium transition-opacity hover:opacity-100"
                  style={{
                    color: active === l.category ? primary : ovText,
                    fontFamily: serif,
                    fontSize: "clamp(2.1rem, 6vw, 4rem)",
                    lineHeight: 1.12,
                    opacity: active === l.category ? 1 : 0.9,
                  }}
                >
                  {l.label}
                </button>
              ))}
            </nav>
            {/* Giriş Yap + İletişim */}
            <div className="flex flex-col gap-3">
              <a
                href={authHref}
                className="inline-flex w-fit items-center rounded-full px-8 py-4 text-sm font-bold transition-transform hover:scale-105"
                style={{ background: ovText, color: ovBg }}
              >
                Giriş Yap
              </a>
              <a
                {...contact}
                className="inline-flex w-fit items-center rounded-full border px-8 py-4 text-sm font-bold transition-colors"
                style={{ borderColor: ovBorder, color: ovText }}
              >
                İletişim
              </a>
            </div>
          </div>

          {/* Alt bilgi — destek */}
          <div
            className="border-t px-6 py-6 lg:px-10"
            style={{ borderColor: ovBorder }}
          >
            <p
              className="text-xs uppercase tracking-widest"
              style={{ color: ovMuted }}
            >
              Destek mi lazım?
            </p>
            <a
              href={`mailto:${content.email}`}
              className="text-lg font-medium"
              style={{ color: ovText }}
            >
              {content.email}
            </a>
          </div>
        </div>
      )}
    </>
  );
}
