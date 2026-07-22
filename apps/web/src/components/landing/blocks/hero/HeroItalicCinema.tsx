"use client";

import React from "react";
import type { LandingThemeContent } from "../../types";
import type { EliteGlobalStyles } from "../../elite-config";
import { getCtaProps } from "../cta-helpers";

/**
 * HeroItalicCinema — Hermes esinli.
 * - Belirgin, yumuşak köşeli çerçeve içinde full sinematik foto (ince kenar
 *   çizgisi + dış margin ile çerçeve her zaman görünür)
 * - Hermes yerleşimi: headline + subtitle + CTA'lar sol altta; sağ altta sadece
 *   trust pill
 * - Headline'da markdown `*kelime*` → italic serif accent (Hermes imzası)
 * - Sinematik açılış: headline kelime kelime, blur→netlik + aşağıdan kayarak
 *   belirir (jenerik kart hissi). prefers-reduced-motion'a saygılı.
 * - Tipografi sabit display font kullanır (tema fontundan bağımsız, varsayılan)
 *
 * Koç yazar:  "Kişisel *fitness* programları, *gerçek* sonuçlarla."
 *
 * inspiredBy:
 * - https://hermes-template.framer.website/ (belirgin foto çerçevesi, italic accent, sol-alt yerleşim)
 */
export function HeroItalicCinema({
  content,
  config,
}: {
  content: LandingThemeContent;
  config?: EliteGlobalStyles;
}) {
  const texts = content.landingTexts;
  const primary = config?.primaryColor || "#ffffff";
  const accent = config?.textColor || "#ccff00";

  // Sabit tipografi — tema fontundan bağımsız varsayılan (yüklü next/font)
  const displayFont = 'var(--font-inter), "Helvetica Neue", Arial, sans-serif';

  const headline = texts?.heroHeadline || "Kişisel *fitness* programları, *gerçek* sonuçlarla.";
  const subtitle =
    texts?.heroSubtitle ||
    "Mükemmel zamanı bekleme, hayalini kurduğun vücudu inşa etmeye bugün başla.";
  const ctaPrimary = texts?.ctaPrimaryText || "Programlarımı Gör";
  const ctaSecondary = texts?.ctaSecondaryText || "Daha Fazla Bilgi";
  const ctaPrimaryProps = getCtaProps(content, texts?.ctaPrimaryTarget, "auth");
  const ctaSecondaryProps = getCtaProps(content, texts?.ctaSecondaryTarget, "about");

  // Güven rozeti — koç metnini değiştirebilir veya tamamen gizleyebilir
  const trustHidden = texts?.heroTrustHidden === "1";
  const trustValue =
    texts?.heroTrustValue ||
    `+${content.studentCount > 0 ? content.studentCount : 1322} öğrenci`;
  const trustLabel = texts?.heroTrustLabel || "aktif programda";

  const heroImage = content.heroImageDesktopUrl || content.heroImageOriginalUrl || null;
  const heroVideo = content.heroVideoUrl || null;

  // Markdown `*word*` → italic serif accent. Regex split keep delimiters.
  const parts = headline.split(/(\*[^*]+\*)/g);

  // Headline'ı kelimelere ayır — sinematik açılışta her kelime sırayla belirir.
  let wordIndex = 0;
  const headlineNodes: React.ReactNode[] = [];
  parts.forEach((part, pi) => {
    const isAccent = /^\*[^*]+\*$/.test(part);
    const text = isAccent ? part.slice(1, -1) : part;
    text.split(/(\s+)/).forEach((tok, ti) => {
      if (tok === "") return;
      if (/^\s+$/.test(tok)) {
        headlineNodes.push(<React.Fragment key={`s-${pi}-${ti}`}> </React.Fragment>);
        return;
      }
      const delay = 0.3 + wordIndex * 0.08;
      wordIndex += 1;
      headlineNodes.push(
        <span
          key={`w-${pi}-${ti}`}
          className="inline-block animate-[wordReveal_0.8s_cubic-bezier(0.2,0.7,0.2,1)_both]"
          style={{ animationDelay: `${delay}s` }}
        >
          {isAccent ? (
            <em className="font-serif italic" style={{ color: accent, fontWeight: 500 }}>
              {tok}
            </em>
          ) : (
            tok
          )}
        </span>
      );
    });
  });
  // Headline bittikten sonra subtitle/CTA/pill devreye girer.
  const afterHeadline = 0.3 + Math.max(wordIndex - 1, 0) * 0.08 + 0.45;

  return (
    <section className="relative min-h-[100svh] bg-zinc-950 p-4 sm:p-6 lg:p-7 flex">
      {/* Belirgin Hermes foto çerçevesi */}
      <div className="relative flex-1 rounded-[2rem] lg:rounded-[2.5rem] overflow-hidden flex items-end">
        {/* Background: video > image > gradient fallback */}
        <div className="absolute inset-0 z-0">
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
              className="absolute inset-0 w-full h-full object-cover scale-105 animate-[slowZoom_30s_ease-in-out_infinite_alternate]"
              style={{ objectPosition: `${content.heroFocalX ?? 50}% ${content.heroFocalY ?? 35}%` }}
            />
          ) : (
            <>
              {/* Foto'suz fallback: dark gradient + abstract motion blob'lar */}
              <div
                className="absolute inset-0"
                style={{
                  background: `radial-gradient(circle at 25% 30%, ${primary}25, transparent 50%), radial-gradient(circle at 75% 70%, ${accent}20, transparent 50%), #0a0a0a`,
                }}
              />
              <div
                className="absolute top-1/3 left-1/4 w-96 h-96 rounded-full blur-3xl opacity-30 animate-[float_8s_ease-in-out_infinite]"
                style={{ backgroundColor: primary }}
              />
              <div
                className="absolute bottom-1/4 right-1/3 w-80 h-80 rounded-full blur-3xl opacity-20 animate-[float_10s_ease-in-out_infinite_reverse]"
                style={{ backgroundColor: accent }}
              />
            </>
          )}
          {/* Cinematic gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/55 to-black/10" />
          <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-transparent to-black/20" />
        </div>

        {/* Çerçeve kenar çizgisi — koyu fotoğraflarda bile çerçeveyi belirgin tutar */}
        <div
          className="absolute inset-0 z-20 rounded-[inherit] pointer-events-none"
          style={{
            boxShadow:
              "inset 0 0 0 1.5px rgba(255,255,255,0.16), inset 0 1px 24px rgba(255,255,255,0.05)",
          }}
        />

        {/* Content — Hermes yerleşimi: sol altta her şey, sağ altta trust pill */}
        <div className="relative z-10 w-full p-7 sm:p-10 lg:p-14">
          <div className="grid grid-cols-1 lg:grid-cols-[1.55fr_1fr] gap-8 lg:gap-12 items-end">
            {/* Sol alt: headline + subtitle + CTA'lar */}
            <div className="space-y-6">
              <h1
                className="font-bold text-white leading-[1.04] tracking-tight"
                style={{
                  fontSize: "clamp(2.5rem, 5.8vw, 5.5rem)",
                  fontFamily: displayFont,
                }}
              >
                {headlineNodes}
              </h1>

              <p
                className="text-base lg:text-lg text-white/70 max-w-xl leading-relaxed animate-[fadeInUp_0.8s_ease_both]"
                style={{ fontFamily: displayFont, animationDelay: `${afterHeadline}s` }}
              >
                {subtitle}
              </p>

              <div
                className="flex gap-3 flex-wrap pt-2 animate-[fadeInUp_0.8s_ease_both]"
                style={{ animationDelay: `${afterHeadline + 0.15}s` }}
              >
                <a
                  {...ctaPrimaryProps}
                  className="group inline-flex items-center gap-2 px-7 py-3.5 rounded-md bg-white text-black font-semibold transition-all hover:bg-white/90 hover:gap-3"
                  style={{ fontFamily: displayFont }}
                >
                  {ctaPrimary}
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                  </svg>
                </a>
                {ctaSecondary && (
                  <a
                    {...ctaSecondaryProps}
                    className="inline-flex items-center px-7 py-3.5 rounded-md border border-white/30 text-white font-medium hover:bg-white/10 hover:border-white/50 transition-all"
                    style={{ fontFamily: displayFont }}
                  >
                    {ctaSecondary}
                  </a>
                )}
              </div>
            </div>

            {/* Sağ alt: sadece trust pill (Hermes düzeni) */}
            <div
              className="flex lg:justify-end animate-[fadeInUp_0.9s_ease_both]"
              style={{ animationDelay: `${afterHeadline}s` }}
            >
              {!trustHidden && (
                <div className="inline-flex items-center gap-3 px-5 py-3 rounded-full bg-white/10 backdrop-blur-md border border-white/20">
                  <div className="flex -space-x-2.5">
                    {[0, 1, 2, 3].map((i) => (
                      <div
                        key={i}
                        className="w-8 h-8 rounded-full border-2 border-zinc-900 flex items-center justify-center text-[10px] font-bold text-white"
                        style={{
                          background: `linear-gradient(${90 + i * 60}deg, ${primary}, ${accent})`,
                        }}
                        aria-hidden
                      >
                        {String.fromCharCode(65 + i)}
                      </div>
                    ))}
                  </div>
                  <div className="text-white">
                    <p className="text-sm font-bold leading-none">{trustValue}</p>
                    <p className="text-[11px] text-white/60 leading-none mt-1">{trustLabel}</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes wordReveal {
          from { opacity: 0; transform: translateY(0.5em); filter: blur(12px); }
          to { opacity: 1; transform: translateY(0); filter: blur(0); }
        }
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(30px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes slowZoom {
          0% { transform: scale(1.05); }
          100% { transform: scale(1.15); }
        }
        @keyframes float {
          0%, 100% { transform: translate(0, 0); }
          50% { transform: translate(30px, -40px); }
        }
        @media (prefers-reduced-motion: reduce) {
          [class*="animate-[wordReveal"],
          [class*="animate-[fadeInUp"],
          [class*="animate-[slowZoom"],
          [class*="animate-[float"] {
            animation: none !important;
            opacity: 1 !important;
            filter: none !important;
            transform: none !important;
          }
        }
      `}</style>
    </section>
  );
}
