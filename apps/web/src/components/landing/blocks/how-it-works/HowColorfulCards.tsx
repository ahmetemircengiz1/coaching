import React from "react";
import type { LandingThemeContent } from "../../types";
import type { EliteGlobalStyles } from "../../elite-config";
import { ArrowUpRight, Dumbbell } from "lucide-react";

/**
 * HowColorfulCards — fitflow esinli.
 * Ortalanmış başlık + 2x2 büyük, canlı renkli gradient kart ızgarası.
 * Her kartta köşede ok ikonu ve yukarı-aşağı süzülen (animasyonlu) dambıl
 * grafiği bulunur. Kartlar bilinçli olarak canlı/doygun renklidir — tema
 * renginden bağımsız (bu bloğun amacı renkli seçenektir).
 *
 * inspiredBy: https://fitflow-template.framer.website/
 */
export function HowColorfulCards({
  content,
  config: _config,
}: {
  content: LandingThemeContent;
  config?: EliteGlobalStyles;
}) {
  const texts = content.landingTexts;
  const headingFont = 'var(--font-oswald), "Arial Narrow", sans-serif';

  const heading = texts?.systemTitle || "Fitness Yolculuğun";
  const sub =
    texts?.systemSubtitle ||
    "Başlamak çok kolay. Bu basit adımları takip et ve birlikte en iyi haline ulaşalım.";

  const t = texts as Record<string, string | undefined> | undefined;
  const cards = [
    {
      title: texts?.system1Title || "Programını Seç",
      desc:
        texts?.system1Description ||
        "Hedeflerine uygun planı seç — ister güç, ister kilo kontrolü, ister hareketlilik.",
      gradient: "linear-gradient(135deg, #ff9bbb 0%, #fc5d8d 100%)",
      image: t?.system1Image,
    },
    {
      title: texts?.system2Title || "Sana Özel Plan",
      desc:
        texts?.system2Description ||
        "Koçun, ihtiyaçlarına göre özel bir antrenman ve beslenme planı tasarlar.",
      gradient: "linear-gradient(135deg, #e0a9df 0%, #b06fce 100%)",
      image: t?.system2Image,
    },
    {
      title: texts?.system3Title || "İstediğin Zaman Antrenman",
      desc:
        texts?.system3Description ||
        "Videolu antrenmanlar, ilerleme takibi ve tam koç desteğiyle planını uygula.",
      gradient: "linear-gradient(135deg, #aa9bf0 0%, #7d72e0 100%)",
      image: t?.system3Image,
    },
    {
      title: "Sonuçları Gör ve Hisset",
      desc: "İstikrarlı kal, gelişimini takip et ve dönüşümünü kutla!",
      gradient: "linear-gradient(135deg, #9ab8f7 0%, #6f8fea 100%)",
      image: undefined,
    },
  ];

  return (
    <section className="py-24 sm:py-32 px-6" style={{ backgroundColor: _config?.backgroundColor || "#0a0a0a" }}>
      <div className="max-w-6xl mx-auto">
        <div className="text-center max-w-2xl mx-auto mb-14 sm:mb-16">
          <span className="text-xs font-bold uppercase tracking-[0.32em] text-white/45">
            Nasıl Çalışır
          </span>
          <h2
            className="mt-4 font-bold text-white"
            style={{ fontSize: "clamp(2.25rem, 5vw, 4rem)", lineHeight: 1.05 }}
          >
            {heading}
          </h2>
          <p className="mt-4 text-white/55 leading-relaxed text-[15px] sm:text-base">{sub}</p>
        </div>

        <div className="grid sm:grid-cols-2 gap-5 sm:gap-6">
          {cards.map((c, i) => (
            <article
              key={i}
              className="relative overflow-hidden rounded-[2rem] p-9 sm:p-10 min-h-[320px] flex flex-col justify-between"
              style={{ background: c.gradient }}
            >
              {/* Foto verilmişse kart bg'ine otursun + gradient'i renk overlay'e çevir */}
              {c.image && (
                <>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={c.image}
                    alt=""
                    className="absolute inset-0 w-full h-full object-cover"
                    aria-hidden
                  />
                  {/* Renk overlay — kart kimliğini koruyan renkli sis */}
                  <div
                    className="absolute inset-0 pointer-events-none mix-blend-multiply"
                    style={{ background: c.gradient, opacity: 0.55 }}
                  />
                  {/* Okunabilirlik için alt-koyu gradyan */}
                  <div
                    className="absolute inset-0 pointer-events-none"
                    style={{
                      background:
                        "linear-gradient(180deg, rgba(0,0,0,0.15) 0%, rgba(0,0,0,0.35) 55%, rgba(0,0,0,0.7) 100%)",
                    }}
                  />
                </>
              )}

              {/* Köşe ok */}
              <span className="absolute top-7 right-7 inline-flex w-9 h-9 rounded-full bg-white/25 items-center justify-center z-10 backdrop-blur-sm">
                <ArrowUpRight className="w-5 h-5 text-white" strokeWidth={2.4} />
              </span>

              {/* Foto yoksa dekoratif dambıl korunur */}
              {!c.image && (
                <div
                  className="pointer-events-none absolute right-4 sm:right-8 top-1/2 -translate-y-1/2 animate-[howDumbbellFloat_3.4s_ease-in-out_infinite]"
                  style={{ animationDelay: `${i * 0.45}s` }}
                >
                  <Dumbbell
                    className="w-32 h-32 sm:w-40 sm:h-40"
                    style={{ color: "rgba(255,255,255,0.45)", transform: "rotate(-25deg)" }}
                    strokeWidth={1.6}
                  />
                </div>
              )}

              <h3
                className={`relative text-3xl sm:text-[2.3rem] font-bold text-white drop-shadow ${
                  c.image ? "max-w-full" : "max-w-[60%]"
                }`}
                style={{ lineHeight: 1.08 }}
              >
                {c.title}
              </h3>
              <p
                className={`relative text-[15px] text-white/90 leading-relaxed ${
                  c.image ? "max-w-full" : "max-w-[62%]"
                }`}
              >
                {c.desc}
              </p>
            </article>
          ))}
        </div>
      </div>

      <style>{`
        @keyframes howDumbbellFloat {
          0%, 100% { transform: translateY(-50%) translateY(0); }
          50% { transform: translateY(-50%) translateY(-18px); }
        }
        @media (prefers-reduced-motion: reduce) {
          [class*="animate-[howDumbbellFloat"] { animation: none !important; }
        }
      `}</style>
    </section>
  );
}
