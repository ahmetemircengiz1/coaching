"use client";

import React, { useEffect, useRef, useState } from "react";
import type { LandingThemeContent } from "../../types";
import type { EliteGlobalStyles } from "../../elite-config";
import { getCtaProps } from "../cta-helpers";

/**
 * HeroDisplayBold — Fightness esinli.
 * - Hero foto, asimetrik panel: yumuşak köşe radyusları (sol alt keskin) +
 *   sağ alt concave video notch'u (accent rim + glow ile belirgin).
 * - Marka + menü hero'da YOK — bunları her sayfadaki ayrı navbar bloğu yönetir
 *   (notch'larda gösterilseydi navbar ile çakışırdı).
 * - MASSIVE uppercase display tipografi (Oswald — sıkışık/agresif display font);
 *   markdown `*kelime*` → accent renkli kelime.
 * - Trust bloğu (avatar + rating + öğrenci sayısı) alt-solda, açıklama metninin üstünde.
 * - Animasyon: headline soldan sağa wipe ile açılır; accent kelime sürekli glow
 *   pulse; panel üzerinde periyodik premium ışık süzülmesi (açılışta + boştayken).
 *
 * Koç yazar:  "Gücünü *Açığa* Çıkar"  → "AÇIĞA" accent renkli + glow.
 *
 * inspiredBy:
 * - https://fightness.framer.website/ (asimetrik notch'lu panel, dev display typo, video card)
 */
export function HeroDisplayBold({
  content,
  config,
}: {
  content: LandingThemeContent;
  config?: EliteGlobalStyles;
}) {
  const texts = content.landingTexts;
  const primary = config?.primaryColor || "#3b82f6";
  const accent = config?.textColor || "#ffffff";

  // Sabit tipografi — Oswald (yüklü display font), tema fontundan bağımsız varsayılan
  const headingFont = 'var(--font-oswald), "Arial Narrow", "Helvetica Neue", sans-serif';
  const bodyFont = 'var(--font-inter), system-ui, -apple-system, sans-serif';

  const headline = texts?.heroHeadline || "Gücünü *Açığa* Çıkar";
  const subtitle =
    texts?.heroSubtitle ||
    "Sana özel tasarlanmış yüksek performanslı kişisel antrenman. Daha güçlü vücut, daha keskin zihin, durdurulamaz ilerleme.";
  const ctaPrimary = texts?.ctaPrimaryText || "Hemen Başla";
  const ctaSecondary = texts?.ctaSecondaryText || "Antrenman Videosu";
  const ctaPrimaryProps = getCtaProps(content, texts?.ctaPrimaryTarget, "auth");
  const ctaSecondaryTarget = texts?.ctaSecondaryTarget;
  const ctaSecondaryProps = getCtaProps(content, ctaSecondaryTarget, "packages");

  // Güven satırı — koç metinleri değiştirebilir veya satırı tamamen gizleyebilir
  const trustHidden = texts?.heroTrustHidden === "1";
  const trustValue =
    texts?.heroTrustValue || (content.studentCount > 0 ? `${content.studentCount}+` : "100+");
  const trustLabel = texts?.heroTrustLabel || "öğrenci eğitildi";
  const ratingValue = texts?.heroRatingValue || "4.9";

  const heroImage = content.heroImageDesktopUrl || content.heroImageOriginalUrl || null;
  const heroVideo = content.heroVideoUrl || null;
  const brandName = content.brandName || "Coach";
  const brandInitial = brandName.charAt(0).toUpperCase();

  // Lightbox: notch'taki video kartına tıklanınca tam-orta, ekranı kaplamayan oynatıcı
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const lightboxVideoRef = useRef<HTMLVideoElement | null>(null);

  useEffect(() => {
    if (!lightboxOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setLightboxOpen(false);
    };
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    document.addEventListener("keydown", onKey);
    // Açılınca otomatik oynat (ses açık) — kullanıcı tıklayarak başlattı, autoplay policy izin verir
    const v = lightboxVideoRef.current;
    if (v) {
      v.currentTime = 0;
      void v.play().catch(() => {});
    }
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = prevOverflow;
      if (v) v.pause();
    };
  }, [lightboxOpen]);

  const openLightbox = () => {
    if (heroVideo) setLightboxOpen(true);
  };

  // Headline'ı `*kelime*` markdown'a göre böl — yıldızlı kelime accent renkli
  const parts = headline.split(/(\*[^*]+\*)/g);

  // Asimetrik köşe radyusları
  const R = "2.5rem"; // panel dış köşeleri
  const rO = "2rem"; // notch concave köşe — dış (accent rim)
  const rI = "1.85rem"; // notch concave köşe — iç (siyah)
  const rim = `0 0 24px ${primary}55`; // notch glow efekti

  return (
    <section className="relative min-h-[100svh] bg-black p-2 sm:p-3 lg:p-4 flex">
      {/* Asimetrik foto paneli — sol alt köşe keskin */}
      <div
        className="relative flex-1 overflow-hidden"
        style={{ borderRadius: `${R} ${R} ${R} 0.75rem` }}
      >
        {/* Panel arka planı — foto tam parlaklıkta */}
        <div className="absolute inset-0 z-0">
          {heroImage ? (
            <img
              src={heroImage}
              alt=""
              className="absolute inset-0 w-full h-full object-cover scale-105 animate-[slowZoom_30s_ease-in-out_infinite_alternate]"
              style={{ objectPosition: `${content.heroFocalX ?? 50}% ${content.heroFocalY ?? 35}%` }}
            />
          ) : (
            <>
              {/* Foto'suz fallback: vibrant gradient + brand initial watermark */}
              <div
                className="absolute inset-0"
                style={{ background: `linear-gradient(135deg, ${primary} 0%, #0a0a0a 65%)` }}
              />
              <div
                className="absolute -right-16 top-1/2 -translate-y-1/2 leading-none select-none pointer-events-none opacity-[0.07]"
                style={{ fontSize: "38rem", color: "#fff", fontFamily: headingFont, fontWeight: 700 }}
                aria-hidden
              >
                {brandInitial}
              </div>
            </>
          )}
          {/* Okunabilirlik gradyanları */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/25 to-black/40" />
          <div className="absolute inset-0 bg-gradient-to-r from-black/65 via-transparent to-transparent" />
        </div>

        {/* Premium ışık süzülmesi — açılışta + panel boştayken periyodik geçer */}
        <div className="absolute inset-0 z-[6] overflow-hidden rounded-[inherit] pointer-events-none">
          <div
            className="absolute top-0 h-full w-[40%] animate-[lightSweep_9s_ease-in-out_infinite]"
            style={{
              left: "-40%",
              background:
                "linear-gradient(100deg, transparent 35%, rgba(255,255,255,0.14) 50%, transparent 65%)",
            }}
          />
        </div>

        {/* İçerik — headline alta yaslı, trust + subtitle + CTA en altta */}
        <div className="relative z-10 flex flex-col h-full gap-6 px-6 sm:px-10 lg:px-14 pb-6 sm:pb-10 lg:pb-12 pt-24 sm:pt-28">
          {/* Headline */}
          <div className="flex-1 flex flex-col justify-end">
            <h1
              className="uppercase text-white animate-[wipeIn_0.85s_cubic-bezier(0.55,0,0.2,1)_0.2s_both]"
              style={{
                fontSize: "clamp(2.75rem, 8.5vw, 8rem)",
                lineHeight: 1,
                letterSpacing: "0.005em",
                fontFamily: headingFont,
                fontWeight: 700,
              }}
            >
              {parts.map((part, i) => {
                const isAccent = /^\*[^*]+\*$/.test(part);
                if (isAccent) {
                  return (
                    <span
                      key={i}
                      className="animate-[accentGlow_2.8s_ease-in-out_infinite]"
                      style={{ color: primary }}
                    >
                      {part.slice(1, -1)}
                    </span>
                  );
                }
                return <React.Fragment key={i}>{part}</React.Fragment>;
              })}
            </h1>
          </div>

          {/* Alt: trust + subtitle + CTA (sağ alt notch'a çarpmaması için lg:pr) */}
          <div className="max-w-xl lg:pr-72 space-y-5 animate-[fadeInUp_0.8s_ease_0.35s_both]">
            {/* Trust satırı — açıklama metninin üstünde */}
            {!trustHidden && (
              <div className="flex items-center gap-3 flex-wrap" style={{ fontFamily: bodyFont }}>
                <div className="flex -space-x-2">
                  {[0, 1, 2, 3].map((i) => (
                    <div
                      key={i}
                      className="w-7 h-7 rounded-full border-2 border-black flex items-center justify-center text-[10px] font-bold text-white"
                      style={{ background: `linear-gradient(${135 + i * 45}deg, ${primary}, ${accent})` }}
                      aria-hidden
                    >
                      {String.fromCharCode(65 + i)}
                    </div>
                  ))}
                </div>
                <div className="flex" aria-label={`${ratingValue}/5 yıldız`}>
                  {[0, 1, 2, 3, 4].map((i) => (
                    <svg key={i} className="w-3.5 h-3.5" fill="#fbbf24" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.286 3.957a1 1 0 00.95.69h4.162c.969 0 1.371 1.24.588 1.81l-3.37 2.448a1 1 0 00-.364 1.118l1.287 3.957c.3.921-.755 1.688-1.539 1.118l-3.37-2.448a1 1 0 00-1.175 0l-3.37 2.448c-.784.57-1.838-.197-1.539-1.118l1.287-3.957a1 1 0 00-.364-1.118L2.05 9.384c-.783-.57-.38-1.81.588-1.81h4.162a1 1 0 00.95-.69l1.286-3.957z" />
                    </svg>
                  ))}
                </div>
                <span className="text-sm font-bold text-white">{ratingValue}</span>
                <span className="text-white/30">•</span>
                <span className="text-sm text-white/70">
                  <span className="font-bold text-white">{trustValue}</span> {trustLabel}
                </span>
              </div>
            )}

            <p
              className="text-base lg:text-lg text-white/75 leading-relaxed"
              style={{ fontFamily: bodyFont }}
            >
              {subtitle}
            </p>

            <div className="flex gap-3 flex-wrap pt-1">
              <a
                {...ctaPrimaryProps}
                className="group inline-flex items-center gap-2 px-7 py-4 rounded-full font-bold text-base transition-all hover:scale-[1.03] hover:shadow-2xl"
                style={{ backgroundColor: primary, color: "#fff", fontFamily: bodyFont }}
              >
                {ctaPrimary}
                <svg
                  className="w-4 h-4 transition-transform group-hover:translate-x-1"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth={2.5}
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                </svg>
              </a>
              {/* İkincil buton: koç hedef seçmemişse ve video varsa lightbox açar,
                  aksi halde seçilen hedefe (varsayılan: paketler) gider */}
              {ctaSecondary &&
                (!ctaSecondaryTarget && heroVideo ? (
                  <button
                    type="button"
                    onClick={openLightbox}
                    className="inline-flex items-center gap-2 px-6 py-4 rounded-full border border-white/25 text-white font-medium hover:bg-white/10 transition-colors"
                    style={{ fontFamily: bodyFont }}
                  >
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M8 5v14l11-7z" />
                    </svg>
                    {ctaSecondary}
                  </button>
                ) : (
                  <a
                    {...ctaSecondaryProps}
                    className="inline-flex items-center gap-2 px-6 py-4 rounded-full border border-white/25 text-white font-medium hover:bg-white/10 transition-colors"
                    style={{ fontFamily: bodyFont }}
                  >
                    {ctaSecondary}
                  </a>
                ))}
            </div>
          </div>
        </div>

        {/* Sağ alt notch: video/foto card.
            Üst notch'lar (marka + menü) kaldırıldı — bunları her sayfada
            bulunan ayrı navbar bloğu yönetiyor; çifte gösterimi önler. */}
        <div
          className="hidden lg:block absolute bottom-0 right-0 z-20 animate-[fadeInUp_0.9s_ease_0.5s_both]"
          style={{
            borderRadius: `${rO} 0 ${R} 0`,
            background: primary,
            padding: "3px 0 0 3px",
            boxShadow: rim,
          }}
        >
          <div className="bg-black p-4" style={{ borderRadius: `${rI} 0 ${R} 0` }}>
            <button
              type="button"
              onClick={openLightbox}
              disabled={!heroVideo}
              aria-label={heroVideo ? "Antrenman videosunu oynat" : "Antrenman önizlemesi"}
              className="group relative block w-56 aspect-video rounded-xl overflow-hidden cursor-pointer disabled:cursor-default p-0 border-0"
            >
              {heroVideo ? (
                <video
                  src={heroVideo}
                  muted
                  loop
                  playsInline
                  autoPlay
                  className="absolute inset-0 w-full h-full object-cover"
                />
              ) : heroImage ? (
                <img src={heroImage} alt="" className="absolute inset-0 w-full h-full object-cover" />
              ) : (
                <div
                  className="absolute inset-0"
                  style={{ background: `linear-gradient(135deg, ${primary}, #0a0a0a)` }}
                />
              )}
              <div className="absolute inset-0 bg-black/30" />
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-12 h-12 rounded-full bg-white/95 flex items-center justify-center shadow-xl group-hover:scale-110 transition-transform">
                  <svg className="w-5 h-5 text-black ml-0.5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M8 5v14l11-7z" />
                  </svg>
                </div>
              </div>
              <div className="absolute bottom-2 left-3">
                <p className="text-xs font-semibold text-white drop-shadow">Gerçek Antrenman</p>
              </div>
            </button>
          </div>
        </div>
      </div>

      {/* Lightbox — video tıklanınca ortalanmış, ekranı kaplamayan oynatıcı */}
      {lightboxOpen && heroVideo && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-sm animate-[lbFade_0.2s_ease-out]"
          onClick={() => setLightboxOpen(false)}
          role="dialog"
          aria-modal="true"
          aria-label="Antrenman videosu oynatıcısı"
        >
          <div
            className="relative w-[min(92vw,1100px)] max-h-[88vh] aspect-video rounded-2xl overflow-hidden shadow-2xl bg-black"
            onClick={(e) => e.stopPropagation()}
            style={{ border: `2px solid ${primary}` }}
          >
            <video
              ref={lightboxVideoRef}
              src={heroVideo}
              controls
              playsInline
              className="w-full h-full block"
            />
            <button
              type="button"
              onClick={() => setLightboxOpen(false)}
              aria-label="Kapat"
              className="absolute top-3 right-3 z-10 w-9 h-9 rounded-full bg-black/70 hover:bg-black/90 text-white flex items-center justify-center transition-colors"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>
      )}

      <style>{`
        @keyframes wipeIn {
          from { clip-path: inset(0 100% 0 0); }
          to { clip-path: inset(0 0 0 0); }
        }
        @keyframes lightSweep {
          0%   { transform: translateX(0) skewX(-14deg); opacity: 0; }
          6%   { opacity: 1; }
          26%  { opacity: 1; }
          34%  { transform: translateX(360%) skewX(-14deg); opacity: 0; }
          100% { transform: translateX(360%) skewX(-14deg); opacity: 0; }
        }
        @keyframes accentGlow {
          0%, 100% { text-shadow: 0 0 16px ${primary}44; }
          50% { text-shadow: 0 0 40px ${primary}cc; }
        }
        @keyframes fadeInDown {
          from { opacity: 0; transform: translateY(-20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(30px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes slowZoom {
          0% { transform: scale(1.05); }
          100% { transform: scale(1.12); }
        }
        @keyframes lbFade {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @media (prefers-reduced-motion: reduce) {
          [class*="animate-["] {
            animation: none !important;
            opacity: 1 !important;
            clip-path: none !important;
            transform: none !important;
            text-shadow: none !important;
          }
        }
      `}</style>
    </section>
  );
}
