import React from "react";
import type { LandingThemeContent } from "../../types";
import type { EliteGlobalStyles } from "../../elite-config";
import { resolveAboutStats } from "./about-helpers";

interface EliteProps {
  content: LandingThemeContent;
  config?: EliteGlobalStyles;
}

/**
 * AboutFightness — solda dev marka adı (vurgu + beyaz) + bio, sağda dev kare
 * koç fotoğrafı + 3 istatistik. Fightness sitesindeki Hakkımda bölümü.
 * Tüm metinler/foto/istatistikler koç ayarlarından (Hakkımda bölümü) gelir.
 * inspiredBy: https://fightness.framer.website/
 */
export function AboutFightness({ content, config }: EliteProps) {
  const texts = content.landingTexts;
  const primary = config?.primaryColor || "#2563eb";
  const bg = "#0a0a0a";
  const brand = content.title || content.brandName || "Koç";
  const words = brand.trim().split(/\s+/);
  const first = words[0];
  const rest = words.slice(1).join(" ");
  const image =
    texts?.aboutImage ||
    content.heroImageDesktopUrl ||
    content.heroImageOriginalUrl ||
    content.heroImage ||
    null;
  const image2 = texts?.aboutImage2 || null;
  const eyebrow = texts?.aboutEyebrow || "(Antrenörün)";
  const bio =
    texts?.aboutBio1 ||
    `Merhaba, ben ${brand} — güç antrenmanı, fonksiyonel hareket ve kondisyon üzerine yıllarca tecrübeyle sana hedefine odaklı, yüksek etkili antrenmanlarla rehberlik ediyorum.`;
  const stats = resolveAboutStats(texts, [
    { v: "10+", l: "Yıl Tecrübe" },
    { v: "200+", l: "Mutlu Danışan" },
    { v: "1.900+", l: "Antrenman Saati" },
  ]);

  // "200+" gibi değerlerde sondaki + işaretini üst-yazı'ya (sup) çıkar
  const splitPlus = (v: string) => {
    const m = v.match(/^(.*?)(\+)?$/);
    return { num: m?.[1] || v, plus: m?.[2] || "" };
  };

  return (
    <section
      className="overflow-hidden px-6 pt-24 pb-24"
      style={{ backgroundColor: bg, color: "#fff" }}
    >
      <div className="mx-auto grid max-w-7xl gap-14 lg:grid-cols-2 lg:gap-16">
        {/* Sol: etiket + dev isim + bio */}
        <div className="flex flex-col gap-8">
          <div>
            <p className="text-sm text-white/55">{eyebrow}</p>
            <h2 className="mt-4 text-6xl font-black uppercase leading-[0.95] tracking-tight sm:text-7xl md:text-8xl">
              <span style={{ color: primary }}>{first}</span>
              {rest && (
                <>
                  <br />
                  {rest}
                </>
              )}
            </h2>
          </div>
          <p
            className="max-w-lg text-base font-medium leading-[1.75] text-white/75 sm:text-lg"
            style={{ fontFamily: content.bodyFont || "var(--font-inter), sans-serif" }}
          >
            {bio}
          </p>
        </div>

        {/* Sağ: foto (+ opsiyonel ikincil foto) + istatistikler */}
        <div className="flex flex-col gap-10">
          <div className="relative">
            <div className="w-full overflow-hidden rounded-md bg-white/5">
              {image ? (
                // Kart, foto'nun doğal en-boy oranına göre büyür — kırpılma olmaz.
                <img
                  src={image}
                  alt={brand}
                  className="block h-auto w-full"
                />
              ) : (
                <div className="flex aspect-square w-full items-center justify-center text-sm text-white/40">
                  Fotoğraf eklemek için Ayarlar → Hakkımda
                </div>
              )}
            </div>
            {/* İkincil foto: ana fotonun sol alt köşesine bindirilmiş kart */}
            {image2 && image && (
              <img
                src={image2}
                alt=""
                className="absolute bottom-4 left-4 w-28 sm:w-36 aspect-square object-cover rounded-md border-2 border-white/25 shadow-2xl"
              />
            )}
          </div>
          {stats.length > 0 && (
            <div
              className="grid gap-6 sm:gap-8"
              style={{ gridTemplateColumns: `repeat(${Math.min(stats.length, 3)}, minmax(0, 1fr))` }}
            >
              {stats.map((s, i) => {
                const { num, plus } = splitPlus(s.v);
                return (
                  <div key={i}>
                    <div className="text-3xl font-extrabold leading-none sm:text-4xl md:text-5xl">
                      {num}
                      {plus && (
                        <sup className="text-xl sm:text-2xl" style={{ color: primary }}>
                          {plus}
                        </sup>
                      )}
                    </div>
                    <div className="mt-3 text-sm text-white/60">{s.l}</div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
