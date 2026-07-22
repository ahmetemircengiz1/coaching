"use client";

import React from "react";
import type { LandingThemeContent } from "../../types";
import type { EliteGlobalStyles } from "../../elite-config";
import { getCtaProps } from "../cta-helpers";

/**
 * HeroSplitAccent — Gymone esinli (iyileştirilmiş).
 * - 50/50 horizontal split: sol metin kart + sağ media
 * - Sol üstte pill badge (örn: "Online Personal Trainer")
 * - Headline'da markdown `*kelime*` → accent renkli vurgu
 * - Sağ tarafta foto + diagonal accent stripes + dot grid pattern (decorative)
 * - Foto'suz fallback: sağ taraf saf accent + dekoratif kompozisyon + brand initial
 *
 * inspiredBy:
 * - https://gymone.framer.website/ (50/50 split, side photo, diagonal stripes, dot grid)
 */
export function HeroSplitAccent({
  content,
  config,
}: {
  content: LandingThemeContent;
  config?: EliteGlobalStyles;
}) {
  const texts = content.landingTexts;
  const primary = config?.primaryColor || "#ccff00";
  const accent = config?.textColor || "#ccff00";
  const bgDark = "#0a1a14"; // forest-green-black, gymone'a benzer ama yumuşatılmış

  const headline = texts?.heroHeadline || "En İyi *Antrenman* Programı";
  const subtitle =
    texts?.heroSubtitle ||
    "Profesyonel kişisel antrenmanla en iyi formuna kavuş. Vücudunu yeniden inşa et.";
  const ctaPrimary = texts?.ctaPrimaryText || "Başla";
  const ctaSecondary = texts?.ctaSecondaryText || "Programları İncele";
  const ctaPrimaryProps = getCtaProps(content, texts?.ctaPrimaryTarget, "auth");
  const ctaSecondaryProps = getCtaProps(content, texts?.ctaSecondaryTarget, "packages");

  const heroImage = content.heroImageDesktopUrl || content.heroImageOriginalUrl || null;
  const heroVideo = content.heroVideoUrl || null;
  const brandInitial = content.brandName?.charAt(0)?.toUpperCase() || "C";

  // Markdown `*word*` → accent renkli vurgu
  const parts = headline.split(/(\*[^*]+\*)/g);

  return (
    <section
      className="relative min-h-[100svh] overflow-hidden grid grid-cols-1 lg:grid-cols-2"
      style={{ backgroundColor: bgDark }}
    >
      {/* SOL: Metin tarafı */}
      <div className="relative z-10 flex items-center px-6 lg:px-12 py-20 lg:py-12">
        <div className="w-full max-w-xl space-y-8">
          {/* Headline */}
          <h1
            className="font-black uppercase text-white leading-[0.95] tracking-tight animate-[fadeInLeft_0.8s_ease_0.2s_both]"
            style={{
              fontSize: "clamp(2.5rem, 6.5vw, 5.5rem)",
              fontFamily: content.headingFont || "inherit",
            }}
          >
            {parts.map((part, i) => {
              const isAccent = /^\*[^*]+\*$/.test(part);
              if (isAccent) {
                return (
                  <span key={i} style={{ color: accent, display: "inline-block" }}>
                    {part.slice(1, -1)}
                  </span>
                );
              }
              return <React.Fragment key={i}>{part}</React.Fragment>;
            })}
          </h1>

          {/* Subtitle */}
          <p
            className="text-base lg:text-lg text-white/65 leading-relaxed max-w-md animate-[fadeInLeft_0.9s_ease_0.4s_both]"
            style={{ fontFamily: content.bodyFont || "inherit" }}
          >
            {subtitle}
          </p>

          {/* CTAs */}
          <div className="flex gap-3 flex-wrap pt-2 animate-[fadeInLeft_1s_ease_0.6s_both]">
            <a
              {...ctaPrimaryProps}
              className="inline-flex items-center gap-2 px-8 py-4 font-bold text-sm uppercase tracking-wider transition-all hover:scale-[1.03]"
              style={{
                backgroundColor: "#000",
                color: "#fff",
                borderRadius: "2px",
              }}
            >
              {ctaPrimary}
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M14 5l7 7m0 0l-7 7m7-7H3" />
              </svg>
            </a>
            {ctaSecondary && (
              <a
                {...ctaSecondaryProps}
                className="inline-flex items-center px-4 py-4 text-xs font-bold uppercase tracking-widest text-white/50 transition-colors hover:text-white"
              >
                {ctaSecondary}
              </a>
            )}
          </div>
        </div>
      </div>

      {/* SAĞ: Media + dekoratif overlay */}
      <div className="relative overflow-hidden min-h-[40vh] lg:min-h-full">
        {/* Background media */}
        <div className="absolute inset-0">
          {heroVideo ? (
            <video
              src={heroVideo}
              autoPlay
              muted
              loop
              playsInline
              className="absolute inset-0 w-full h-full object-cover"
              style={{ objectPosition: `${content.heroFocalX ?? 50}% ${content.heroFocalY ?? 35}%` }}
            />
          ) : heroImage ? (
            <img
              src={heroImage}
              alt=""
              className="absolute inset-0 w-full h-full object-cover"
              style={{ objectPosition: `${content.heroFocalX ?? 50}% ${content.heroFocalY ?? 35}%` }}
            />
          ) : (
            /* Foto'suz fallback: accent renkli dekoratif kompozisyon */
            <div
              className="absolute inset-0 flex items-center justify-center"
              style={{
                background: `linear-gradient(135deg, ${accent}30 0%, ${bgDark} 100%)`,
              }}
            >
              <div
                className="text-[28rem] font-black leading-none opacity-10 select-none pointer-events-none"
                style={{ color: accent, fontFamily: content.headingFont || "inherit" }}
                aria-hidden
              >
                {brandInitial}
              </div>
            </div>
          )}
        </div>

        {/* Diagonal accent stripes — decorative */}
        <div
          className="absolute inset-0 opacity-30 pointer-events-none"
          style={{
            backgroundImage: `repeating-linear-gradient(
              -45deg,
              transparent 0,
              transparent 30px,
              ${accent}40 30px,
              ${accent}40 32px
            )`,
            maskImage: "linear-gradient(to bottom, transparent 0%, black 30%, black 70%, transparent 100%)",
            WebkitMaskImage: "linear-gradient(to bottom, transparent 0%, black 30%, black 70%, transparent 100%)",
          }}
          aria-hidden
        />

        {/* Dot grid pattern — top-right corner */}
        <div
          className="absolute top-8 right-8 w-32 h-32 opacity-50 pointer-events-none"
          style={{
            backgroundImage: `radial-gradient(circle, ${accent} 1.5px, transparent 1.5px)`,
            backgroundSize: "14px 14px",
          }}
          aria-hidden
        />

        {/* Bottom gradient for legibility */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent pointer-events-none" />

        {/* Floating brand chip — bottom-left of media */}
        <div className="absolute bottom-6 left-6 px-3 py-2 bg-black/60 backdrop-blur-md border border-white/10 rounded animate-[fadeIn_1.2s_ease_0.8s_both]">
          <p className="text-[10px] uppercase tracking-widest text-white/60">Koçun</p>
          <p className="text-sm font-bold text-white">{content.brandName}</p>
        </div>
      </div>

      <style>{`
        @keyframes fadeInLeft {
          from { opacity: 0; transform: translateX(-30px); }
          to { opacity: 1; transform: translateX(0); }
        }
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
      `}</style>
    </section>
  );
}
