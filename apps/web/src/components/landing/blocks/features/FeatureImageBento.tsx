import React from "react";
import type { LandingThemeContent } from "../../types";
import type { EliteGlobalStyles } from "../../elite-config";
import { Dumbbell, HeartPulse, ShieldCheck, Salad } from "lucide-react";

/**
 * FeatureImageBento — curtis esinli (fotosuz varyant).
 * Ortalanmış başlık + büyük bento kart ızgarası:
 *  - Büyük dikey kart (accent glow + dev ikon filigranı)
 *  - Geniş kart (accent şerit + dekoratif halka)
 *  - Accent renkli dolu kart (renk vurgusu)
 *  - Sade ikon kartı (ortalanmış)
 * Kartların içinde fotoğraf yok — accent gradient, ikon ve tipografi tabanlı.
 *
 * inspiredBy: https://curtis.framer.media/
 */
export function FeatureImageBento({
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

  const title = texts?.systemTitle || "Hedeflerine Göre Tasarlanmış Antrenman";
  const sub =
    texts?.systemSubtitle ||
    "Her ilerleme; kişiye özel antrenman, stratejik beslenme ve her adımda hesap verebilirlikle elde edilir.";

  const t = texts as Record<string, string | undefined> | undefined;
  const c1 = {
    title: texts?.system1Title || "Gerçek Güç İnşası",
    desc:
      texts?.system1Description ||
      "Gerçek rakamlara, sağlam tekniğe ve uzun vadeli kazanımlara odaklı kademeli güç antrenmanı.",
    image: t?.system1Image,
  };
  const c2 = {
    title: texts?.system2Title || "Elit Kondisyon",
    desc:
      texts?.system2Description ||
      "Daha güçlü ve istikrarlı antrenmanı destekleyen gerçek dayanıklılık geliştir.",
    image: t?.system2Image,
  };
  const c3 = {
    title: texts?.system3Title || "Sakatlık Önleme",
    desc: texts?.system3Description || "Sakatlanma riskini azaltmak için tasarlanmış akıllı yaklaşım.",
    image: t?.system3Image,
  };
  const c4 = {
    title: t?.system4Title || "Uzman Beslenme",
    desc: t?.system4Description || "Uzun vadeli sonuçlar için stratejik beslenme rehberliği.",
    image: t?.system4Image,
  };

  return (
    <section className="py-24 sm:py-32 px-6" style={{ backgroundColor: bg }}>
      <div className="max-w-6xl mx-auto">
        {/* Başlık */}
        <div className="text-center max-w-2xl mx-auto mb-12 sm:mb-16">
          <span className="inline-block px-4 py-1.5 rounded-full border border-white/15 text-xs font-bold uppercase tracking-[0.2em] text-white/70">
            Özellikler
          </span>
          <h2
            className="mt-6 font-black uppercase text-white"
            style={{ fontFamily: headingFont, fontSize: "clamp(2.25rem, 5vw, 4.25rem)", lineHeight: 1.04 }}
          >
            {title}
          </h2>
          <p className="mt-5 text-white/55 leading-relaxed text-[15px] sm:text-base">{sub}</p>
        </div>

        {/* Bento ızgara */}
        <div className="grid md:grid-cols-3 gap-4 md:gap-5 md:auto-rows-[330px]">
          {/* Kart 1 — büyük dikey */}
          <article
            className="relative overflow-hidden rounded-[2rem] md:row-span-2 border border-white/10 p-9 sm:p-10 flex flex-col justify-between min-h-[440px]"
            style={{ backgroundColor: c1.image ? "#0a0a0a" : "rgba(255,255,255,0.035)" }}
          >
            {c1.image && (
              <>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={c1.image}
                  alt=""
                  className="absolute inset-0 w-full h-full object-cover"
                  style={{ opacity: 0.55 }}
                  aria-hidden
                />
                <div
                  className="absolute inset-0 pointer-events-none"
                  style={{
                    background:
                      "linear-gradient(180deg, rgba(0,0,0,0.2) 0%, rgba(0,0,0,0.55) 60%, rgba(0,0,0,0.9) 100%)",
                  }}
                />
              </>
            )}
            <div
              className="absolute -top-20 -right-16 w-60 h-60 rounded-full blur-[80px] pointer-events-none"
              style={{ background: primary, opacity: c1.image ? 0.08 : 0.16 }}
            />
            {!c1.image && (
              <Dumbbell
                className="absolute -bottom-8 -right-6 w-52 h-52 pointer-events-none"
                style={{ color: "rgba(255,255,255,0.04)" }}
                strokeWidth={1}
              />
            )}
            <span
              className="relative inline-flex w-14 h-14 rounded-2xl items-center justify-center backdrop-blur-sm"
              style={{
                background: c1.image ? "rgba(0,0,0,0.55)" : `${primary}1f`,
                border: c1.image ? `1px solid ${primary}66` : undefined,
              }}
            >
              <Dumbbell className="w-6 h-6" style={{ color: primary }} strokeWidth={1.9} />
            </span>
            <div className="relative">
              <h3
                className="font-bold text-white drop-shadow"
                style={{ fontFamily: headingFont, fontSize: "clamp(2rem, 3.2vw, 3.1rem)", lineHeight: 1.05 }}
              >
                {c1.title}
              </h3>
              <p className={`mt-3.5 leading-relaxed max-w-md ${c1.image ? "text-white/85" : "text-white/60"}`}>{c1.desc}</p>
            </div>
          </article>

          {/* Kart 2 — geniş, accent şerit + dekoratif halka (foto varken halka yerine foto bg) */}
          <article
            className="relative overflow-hidden rounded-[2rem] md:col-span-2 border border-white/10 flex min-h-[300px]"
            style={{ backgroundColor: c2.image ? "#0a0a0a" : "rgba(255,255,255,0.035)" }}
          >
            {c2.image && (
              <>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={c2.image}
                  alt=""
                  className="absolute inset-0 w-full h-full object-cover"
                  style={{ opacity: 0.5 }}
                  aria-hidden
                />
                <div
                  className="absolute inset-0 pointer-events-none"
                  style={{
                    background:
                      "linear-gradient(90deg, rgba(0,0,0,0.85) 0%, rgba(0,0,0,0.55) 55%, rgba(0,0,0,0.2) 100%)",
                  }}
                />
              </>
            )}
            <div
              className="absolute left-0 top-0 bottom-0 w-1.5 z-10"
              style={{ background: primary }}
            />
            <div className="relative flex-1 flex flex-col justify-center p-9 sm:p-10">
              <span
                className="inline-flex w-14 h-14 rounded-2xl items-center justify-center backdrop-blur-sm"
                style={{
                  background: c2.image ? "rgba(0,0,0,0.55)" : `${primary}1f`,
                  border: c2.image ? `1px solid ${primary}66` : undefined,
                }}
              >
                <HeartPulse className="w-6 h-6" style={{ color: primary }} strokeWidth={1.9} />
              </span>
              <h3
                className="mt-5 text-2xl sm:text-[2rem] font-bold text-white drop-shadow"
                style={{ fontFamily: headingFont, lineHeight: 1.08 }}
              >
                {c2.title}
              </h3>
              <p className={`mt-3 leading-relaxed max-w-md text-[15px] ${c2.image ? "text-white/85" : "text-white/55"}`}>{c2.desc}</p>
            </div>
            {!c2.image && (
              <div className="hidden sm:flex w-[32%] shrink-0 items-center justify-center relative">
                <div
                  className="w-44 h-44 rounded-full border-2 border-dashed"
                  style={{ borderColor: `${primary}33` }}
                />
                <div
                  className="absolute w-24 h-24 rounded-full"
                  style={{ background: `${primary}14` }}
                />
                <HeartPulse className="absolute w-9 h-9" style={{ color: primary }} strokeWidth={1.8} />
              </div>
            )}
          </article>

          {/* Kart 3 — accent renkli dolu kart (foto varken accent rim + foto bg) */}
          <article
            className="relative overflow-hidden rounded-[2rem] flex flex-col justify-between p-9 min-h-[300px]"
            style={{
              background: c3.image ? "#0a0a0a" : primary,
              border: c3.image ? `2px solid ${primary}` : undefined,
            }}
          >
            {c3.image && (
              <>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={c3.image}
                  alt=""
                  className="absolute inset-0 w-full h-full object-cover"
                  style={{ opacity: 0.55 }}
                  aria-hidden
                />
                <div
                  className="absolute inset-0 pointer-events-none"
                  style={{
                    background:
                      "linear-gradient(180deg, rgba(0,0,0,0.25) 0%, rgba(0,0,0,0.55) 55%, rgba(0,0,0,0.9) 100%)",
                  }}
                />
              </>
            )}
            <span
              className="relative inline-flex w-14 h-14 rounded-2xl items-center justify-center backdrop-blur-sm"
              style={{
                background: c3.image ? "rgba(0,0,0,0.55)" : "rgba(0,0,0,0.15)",
                border: c3.image ? `1px solid ${primary}66` : undefined,
              }}
            >
              <ShieldCheck
                className="w-6 h-6"
                style={{ color: c3.image ? primary : "#000" }}
                strokeWidth={2}
              />
            </span>
            <div className="relative">
              <h3
                className={`text-2xl font-bold drop-shadow ${c3.image ? "text-white" : "text-black"}`}
                style={{ fontFamily: headingFont }}
              >
                {c3.title}
              </h3>
              <p className={`mt-2.5 text-sm leading-relaxed ${c3.image ? "text-white/85" : "text-black/70"}`}>
                {c3.desc}
              </p>
            </div>
          </article>

          {/* Kart 4 — sade ikon kartı, ortalanmış (foto varken foto-bg karta dönüşür) */}
          <article
            className="relative overflow-hidden rounded-[2rem] border border-white/10 flex flex-col items-center justify-center text-center p-9 min-h-[300px]"
            style={{ backgroundColor: c4.image ? "#0a0a0a" : "rgba(255,255,255,0.035)" }}
          >
            {c4.image && (
              <>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={c4.image}
                  alt=""
                  className="absolute inset-0 w-full h-full object-cover"
                  style={{ opacity: 0.55 }}
                  aria-hidden
                />
                <div
                  className="absolute inset-0 pointer-events-none"
                  style={{
                    background:
                      "linear-gradient(180deg, rgba(0,0,0,0.25) 0%, rgba(0,0,0,0.55) 55%, rgba(0,0,0,0.9) 100%)",
                  }}
                />
              </>
            )}
            <span
              className="relative inline-flex w-14 h-14 rounded-2xl items-center justify-center backdrop-blur-sm"
              style={{
                background: c4.image ? "rgba(0,0,0,0.55)" : `${primary}1f`,
                border: c4.image ? `1px solid ${primary}66` : undefined,
              }}
            >
              <Salad className="w-6 h-6" style={{ color: primary }} strokeWidth={1.9} />
            </span>
            <h3
              className="relative mt-5 text-xl sm:text-2xl font-bold text-white drop-shadow"
              style={{ fontFamily: headingFont }}
            >
              {c4.title}
            </h3>
            <p
              className={`relative mt-2.5 text-sm leading-relaxed max-w-[15rem] ${
                c4.image ? "text-white/85" : "text-white/55"
              }`}
            >
              {c4.desc}
            </p>
          </article>
        </div>
      </div>
    </section>
  );
}
