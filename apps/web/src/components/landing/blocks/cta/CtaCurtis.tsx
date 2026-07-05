import React from "react";
import { ArrowUpRight } from "lucide-react";
import type { LandingThemeContent } from "../../types";
import type { EliteGlobalStyles } from "../../elite-config";

interface EliteProps {
  content: LandingThemeContent;
  config?: EliteGlobalStyles;
}

/**
 * CtaCurtis — tam ekran arkaplan görseli üzerinde ortalanmış final CTA.
 *
 * Arkaplan görseli koç tarafından ayarlardan yüklenir (landingTexts.ctaImage);
 * yüklenmezse şık bir koyu gradyan default gösterilir. Buton koçun kayıt /
 * dashboard giriş adresine (content.authUrl) yönlendirir.
 *
 * inspiredBy: https://curtis.framer.media/
 */
export function CtaCurtis({ content, config }: EliteProps) {
  const texts = content.landingTexts;
  const primary = config?.primaryColor || "#a3e635";
  const bg = config?.backgroundColor || "#0a0a0a";
  const image = texts?.ctaImage;

  const headline =
    texts?.ctaHeadline || texts?.heroHeadline || "Hedeflerine Ulaşmaya Hazır mısın?";
  const subtitle =
    texts?.ctaSubtitle ||
    "Yapılandırılmış antrenman ve istikrarlı çalışmayla; ölçülebilir ilerleme ve gerçek danışan sonuçlarıyla kanıtlandı.";
  const buttonText = texts?.ctaPrimaryText || "Yolculuğa Başla";

  // Başlığın son kelime(ler)ini vurgu rengine boya (Curtis tarzı)
  const words = headline.trim().split(/\s+/);
  const splitAt = words.length > 3 ? words.length - 2 : Math.max(1, words.length - 1);
  const headFirst = words.slice(0, splitAt).join(" ");
  const headAccent = words.slice(splitAt).join(" ");

  return (
    <section
      className="relative flex min-h-[88vh] items-center justify-center overflow-hidden px-6"
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
              background: `radial-gradient(circle at 72% 28%, ${primary}30, transparent 55%), radial-gradient(circle at 18% 82%, ${primary}1f, transparent 52%), ${bg}`,
            }}
          />
        )}
        <div
          className="absolute inset-0"
          style={{ background: image ? "rgba(0,0,0,0.62)" : "rgba(0,0,0,0.28)" }}
        />
      </div>

      <div className="relative z-10 mx-auto flex max-w-2xl flex-col items-center text-center">
        <h2 className="text-3xl font-bold leading-[1.1] tracking-tight text-white sm:text-4xl md:text-5xl">
          {headFirst}{headAccent ? " " : ""}
          {headAccent && <span style={{ color: primary }}>{headAccent}</span>}
        </h2>
        <p className="mt-5 max-w-md text-sm leading-relaxed text-white/70 sm:text-base">
          {subtitle}
        </p>
        <a
          href={content.authUrl}
          className="group mt-9 inline-flex items-center gap-3 rounded-full py-1.5 pl-6 pr-1.5 text-sm font-bold text-black transition-transform duration-300 hover:scale-105"
          style={{ backgroundColor: primary }}
        >
          {buttonText}
          <span className="flex h-9 w-9 items-center justify-center rounded-full bg-black text-white transition-transform duration-300 group-hover:rotate-45">
            <ArrowUpRight className="h-4 w-4" />
          </span>
        </a>
      </div>
    </section>
  );
}
