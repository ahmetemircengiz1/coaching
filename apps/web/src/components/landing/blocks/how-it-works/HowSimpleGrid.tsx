import React from "react";
import type { LandingThemeContent } from "../../types";
import type { EliteGlobalStyles } from "../../elite-config";
import { MousePointerClick, CalendarCheck, Dumbbell, TrendingUp } from "lucide-react";

/**
 * HowSimpleGrid — athlex esinli.
 * Ortalanmış başlık + yan yana 4 sade adım kartı (ikon + başlık + açıklama).
 * "Basit bir site isteyenler" için minimal seçenek.
 *
 * inspiredBy: https://athlex.framer.website/
 */
export function HowSimpleGrid({
  content,
  config,
}: {
  content: LandingThemeContent;
  config?: EliteGlobalStyles;
}) {
  const texts = content.landingTexts;
  const primary = config?.primaryColor || "#ccff00";
  const bg = config?.backgroundColor || "#0a0a0a";
  const headingFont = 'var(--font-oswald), "Arial Narrow", sans-serif';

  const heading = texts?.systemTitle || "Başlamak İçin Kolay Adımlar";
  const sub =
    texts?.systemSubtitle ||
    "Antrenmanlara nasıl başlayacağını, planları nasıl takip edeceğini ve yolda nasıl kalacağını öğren.";

  const t = texts as Record<string, string | undefined> | undefined;
  const steps = [
    {
      icon: MousePointerClick,
      title: texts?.system1Title || "Program Seç",
      desc:
        texts?.system1Description ||
        "Hedeflerine ve günlük rutinine uygun doğru antrenman planını seç.",
      image: t?.system1Image,
    },
    {
      icon: CalendarCheck,
      title: texts?.system2Title || "Rutinini Kur",
      desc:
        texts?.system2Description ||
        "Antrenman zamanını planla, istikrarlı kalarak sağlıklı alışkanlıklar oluştur.",
      image: t?.system2Image,
    },
    {
      icon: Dumbbell,
      title: texts?.system3Title || "Her Gün Antrenman",
      desc:
        texts?.system3Description ||
        "Egzersizlerini düzenli yap; gücünü artır, aktif kal ve daha iyi hisset.",
      image: t?.system3Image,
    },
    {
      icon: TrendingUp,
      title: "Sonuçları Gör",
      desc: "Zamanla gelişimini izle, motive kalarak güçlü bir şekilde devam et.",
      image: undefined,
    },
  ];

  return (
    <section className="py-24 sm:py-32 px-6" style={{ backgroundColor: bg }}>
      <div className="max-w-6xl mx-auto">
        <div className="text-center max-w-2xl mx-auto mb-14 sm:mb-16">
          <span
            className="text-xs font-bold uppercase tracking-[0.32em]"
            style={{ color: primary }}
          >
            Nasıl Çalışır
          </span>
          <h2
            className="mt-4 font-black uppercase text-white"
            style={{ fontFamily: headingFont, fontSize: "clamp(2.25rem, 5vw, 4.25rem)", lineHeight: 1.02 }}
          >
            {heading}
          </h2>
          <p className="mt-4 text-white/55 leading-relaxed text-[15px] sm:text-base">{sub}</p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {steps.map((s, i) => {
            const Icon = s.icon;
            return (
              <div
                key={i}
                className="relative overflow-hidden rounded-[1.75rem] border border-white/10 p-8 min-h-[300px] flex flex-col"
                style={{
                  backgroundColor: s.image ? "#0a0a0a" : "rgba(255,255,255,0.035)",
                }}
              >
                {/* Foto verilmişse kart bg'i + okunabilirlik için koyu gradyan */}
                {s.image && (
                  <>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={s.image}
                      alt=""
                      className="absolute inset-0 w-full h-full object-cover"
                      style={{ opacity: 0.5 }}
                      aria-hidden
                    />
                    <div
                      className="absolute inset-0 pointer-events-none"
                      style={{
                        background:
                          "linear-gradient(180deg, rgba(0,0,0,0.3) 0%, rgba(0,0,0,0.55) 55%, rgba(0,0,0,0.9) 100%)",
                      }}
                    />
                  </>
                )}
                <div className="relative flex items-center justify-between">
                  {/* İkon her zaman görünür — foto varken accent rim'li koyu rozet */}
                  <span
                    className="inline-flex w-14 h-14 rounded-2xl items-center justify-center backdrop-blur-sm"
                    style={{
                      background: s.image ? "rgba(0,0,0,0.55)" : primary,
                      border: s.image ? `1px solid ${primary}66` : undefined,
                    }}
                  >
                    <Icon
                      className="w-6 h-6"
                      style={{ color: s.image ? primary : "#000" }}
                      strokeWidth={2}
                    />
                  </span>
                  <span
                    className="font-black leading-none"
                    style={{
                      fontFamily: headingFont,
                      fontSize: "2.75rem",
                      color: s.image ? "rgba(255,255,255,0.16)" : "rgba(255,255,255,0.08)",
                    }}
                  >
                    {String(i + 1).padStart(2, "0")}
                  </span>
                </div>
                <h3
                  className="relative mt-auto pt-10 text-xl font-black uppercase text-white drop-shadow"
                  style={{ fontFamily: headingFont }}
                >
                  {s.title}
                </h3>
                <p
                  className={`relative mt-3 text-sm leading-relaxed ${
                    s.image ? "text-white/85" : "text-white/55"
                  }`}
                >
                  {s.desc}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
