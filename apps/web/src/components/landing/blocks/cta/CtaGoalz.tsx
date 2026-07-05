import React from "react";
import { ArrowRight } from "lucide-react";
import type { LandingThemeContent } from "../../types";
import type { EliteGlobalStyles } from "../../elite-config";

interface EliteProps {
  content: LandingThemeContent;
  config?: EliteGlobalStyles;
}

/**
 * CtaGoalz — tam ekran arkaplan üzerinde dev tipografili final CTA.
 *
 * Üstte küçük etiket, ortada büyük büyük-harf başlık, vurgu renkli pill buton;
 * altta üç dekoratif motivasyon alıntısı. Arkaplan görseli koç ayarlardan
 * yükler (landingTexts.ctaImage); yoksa yeşilimsi gradyan default gösterilir.
 *
 * inspiredBy: https://goalz-template.framer.website/
 */
export function CtaGoalz({ content, config }: EliteProps) {
  const texts = content.landingTexts;
  const primary = config?.primaryColor || "#34d399";
  const bg = config?.backgroundColor || "#0b0f0c";
  const image = texts?.ctaImage;

  const eyebrow = texts?.ctaEyebrow || "BİRLİKTE BAŞARALIM";
  const headline = (
    texts?.ctaHeadline || texts?.heroHeadline || "Hadi Başla. Hadi Büyü"
  ).toUpperCase();
  const buttonText = texts?.ctaPrimaryText || "Aramıza Katıl";

  const quotes = [
    "HER ADIM SENİ HEDEFİNE YAKLAŞTIRIR.",
    "HAYALLER HER ANTRENMANLA GÜÇLENİR.",
    "ŞAMPİYONLAR SAHADA YETİŞİR.",
  ];

  // Goalz başlık/etiket örnekteki gibi soluk yeşil-beyaz tonda — vurgu renginden türetilir.
  const headingTint = `color-mix(in srgb, ${primary} 50%, white)`;
  const eyebrowTint = `color-mix(in srgb, ${primary} 60%, white)`;

  return (
    <section
      className="relative flex min-h-[92vh] flex-col items-center justify-between overflow-hidden px-6 py-16 sm:py-20"
      style={{ backgroundColor: bg }}
    >
      {/* Arkaplan */}
      <div className="absolute inset-0 z-0">
        {image ? (
          <img src={image} alt="" className="h-full w-full object-cover" />
        ) : (
          <div
            className="h-full w-full"
            style={{
              background: `linear-gradient(165deg, ${bg}, ${primary}22 45%, ${bg}), radial-gradient(circle at 50% 35%, ${primary}26, transparent 60%)`,
            }}
          />
        )}
        <div
          className="absolute inset-0"
          style={{ background: image ? "rgba(6,12,8,0.6)" : "rgba(6,12,8,0.25)" }}
        />
      </div>

      {/* Orta blok */}
      <div className="relative z-10 flex flex-1 flex-col items-center justify-center text-center">
        <span
          className="text-[11px] font-bold uppercase tracking-[0.4em] sm:text-xs"
          style={{ color: eyebrowTint }}
        >
          {eyebrow}
        </span>
        <h2
          className="mt-6 text-5xl font-black uppercase leading-[0.9] tracking-tight sm:text-7xl md:text-8xl lg:text-9xl"
          style={{ color: headingTint }}
        >
          {headline}
        </h2>
        <a
          href={content.authUrl}
          className="group mt-10 inline-flex items-center gap-2.5 rounded-full px-9 py-4 text-xs font-bold uppercase tracking-[0.15em] text-black transition-transform duration-300 hover:scale-105 sm:text-sm"
          style={{ backgroundColor: primary }}
        >
          {buttonText}
          <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
        </a>
      </div>

      {/* Alt dekoratif alıntılar */}
      <div className="relative z-10 mt-12 grid w-full max-w-5xl grid-cols-1 gap-5 sm:grid-cols-3">
        {quotes.map((q) => (
          <p
            key={q}
            className="text-center text-[11px] font-bold uppercase leading-relaxed tracking-wider text-white/55"
          >
            “{q}”
          </p>
        ))}
      </div>
    </section>
  );
}
