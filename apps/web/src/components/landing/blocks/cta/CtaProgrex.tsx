import React from "react";
import type { LandingThemeContent } from "../../types";
import type { EliteGlobalStyles } from "../../elite-config";

interface EliteProps {
  content: LandingThemeContent;
  config?: EliteGlobalStyles;
}

/**
 * CtaProgrex — minimalist köşe yerleşimli final CTA.
 *
 * Sol üstte dev büyük-harf başlık, sol altta beyaz buton; arası boş bırakılır
 * ki arkaplan görseli nefes alsın. Arkaplan görseli koç ayarlardan yükler
 * (landingTexts.ctaImage); yoksa koyu diyagonal gradyan default gösterilir.
 *
 * inspiredBy: https://progrex.framer.website/
 */
export function CtaProgrex({ content, config }: EliteProps) {
  const texts = content.landingTexts;
  const primary = config?.primaryColor || "#ffffff";
  const bg = config?.backgroundColor || "#0a0a0a";
  const image = texts?.ctaImage;

  const headline = (
    texts?.ctaHeadline || texts?.heroHeadline || "Gerçek Sonuçlara Hazır mısın?"
  ).toUpperCase();
  const buttonText = texts?.ctaPrimaryText || "İletişime Geç";

  return (
    <section
      className="relative flex min-h-[90vh] flex-col justify-between overflow-hidden px-6 py-14 sm:px-12 sm:py-16"
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
              background: `linear-gradient(115deg, #1c1c1c, ${bg} 62%), radial-gradient(circle at 80% 60%, ${primary}14, transparent 55%)`,
            }}
          />
        )}
        {/* Soldan koyulaşan overlay — köşedeki metin her görselde okunur kalsın */}
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(100deg, rgba(0,0,0,0.72) 0%, rgba(0,0,0,0.4) 45%, rgba(0,0,0,0.55) 100%)",
          }}
        />
      </div>

      <h2 className="relative z-10 max-w-4xl text-5xl font-black uppercase leading-[0.95] tracking-tight text-white sm:text-7xl md:text-8xl">
        {headline}
      </h2>

      <div className="relative z-10">
        <a
          href={content.authUrl}
          className="inline-flex items-center rounded-lg bg-white px-7 py-3.5 text-sm font-semibold text-black transition-colors duration-300 hover:bg-white/85 sm:text-base"
        >
          {buttonText}
        </a>
      </div>
    </section>
  );
}
