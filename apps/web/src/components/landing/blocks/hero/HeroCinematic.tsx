"use client";

import React, { useId } from "react";
import type { LandingThemeContent } from "../../types";
import type { EliteGlobalStyles } from "../../elite-config";
import { getTextEffectStyle } from "../../types";
import { getCtaProps } from "../cta-helpers";

interface EliteHeroProps {
  content: LandingThemeContent;
  config?: EliteGlobalStyles;
}

export function HeroCinematic({ content, config }: EliteHeroProps) {
  const texts = content.landingTexts;
  const primary = config?.primaryColor || "#ffffff";
  const headlineColor = texts?.heroTextColor || "#ffffff";
  const effectStyle = getTextEffectStyle(texts?.heroTextEffect, headlineColor);
  
  const posX = texts?.heroTextPosX ?? 50;
  const posY = texts?.heroTextPosY ?? 50;
  const scale = texts?.heroTextScale ?? 1;
  const weight = texts?.heroTextWeight || "900";
  
  const heroImage = content.heroImageDesktopUrl || content.heroImageOriginalUrl || "https://images.unsplash.com/photo-1517836357463-d25dfeac3438?q=80&w=2070&auto=format&fit=crop";

  return (
    <section className="relative min-h-[100svh] overflow-hidden bg-black flex items-center justify-center">
      {/* Cinematic Background */}
      <div 
        className="absolute inset-0 z-0 bg-cover bg-center transition-transform duration-[20s] ease-linear scale-110 hover:scale-100"
        style={{ backgroundImage: `url(${heroImage})` }}
      >
        {/* Cinematic Filters: Heavy Vignette and Contrast */}
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-black/80" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_30%,rgba(0,0,0,0.8)_100%)]" />
        {/* Grain effect */}
        <div className="absolute inset-0 bg-[url('/noise.png')] opacity-10 mix-blend-overlay" />
      </div>

      <div 
        className="relative z-10 w-full max-w-7xl px-6 flex flex-col items-center text-center mix-blend-lighten"
        style={{ transform: `scale(${scale})` }}
      >
        <span className="text-sm font-bold tracking-[0.5em] text-white/50 uppercase mb-4" style={{ color: primary }}>
          A Cinematic Journey
        </span>
        <h1 
          className="text-7xl md:text-9xl tracking-tighter leading-[0.8] mb-8 font-serif uppercase" 
          style={{ color: headlineColor, fontWeight: weight, ...effectStyle }}
        >
          {texts?.heroHeadline || "UNBREAKABLE"}
        </h1>

        <a
          {...getCtaProps(content, texts?.ctaPrimaryTarget, "auth")}
          className="mt-8 px-12 py-4 bg-transparent border border-white/30 text-white font-medium uppercase tracking-widest text-sm hover:bg-white hover:text-black transition-colors"
        >
          {texts?.ctaPrimaryText || "Efsanevi Başlangıç"}
        </a>
      </div>
    </section>
  );
}
