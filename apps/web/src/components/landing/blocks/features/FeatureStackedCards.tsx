"use client";

import React, { useEffect, useRef, useState } from "react";
import type { LandingThemeContent } from "../../types";
import type { EliteGlobalStyles } from "../../elite-config";
import { Dumbbell, Flame, Apple } from "lucide-react";

/**
 * FeatureStackedCards — peakfitness esinli (fotosuz varyant).
 * Pinlenmiş bölüm: sol panel sabit kalır, kullanıcı kaydırdıkça sağ tarafta
 * büyük kartlar alttan gelip cüzdandaki kartlar gibi üst üste istiflenir.
 * Tüm kartlar dizildiğinde sayfa normal akışına döner. Kartların içinde
 * fotoğraf yok — accent glow + dev numara filigranı + ikon tabanlı tasarım.
 *
 * NOT: `position: sticky` KULLANILMIYOR — JS ile `position: fixed` pinleme +
 * rAF döngüsü; `overflow:hidden` üst container'lardan etkilenmez.
 *
 * inspiredBy: https://peakfitness.framer.website/
 */
export function FeatureStackedCards({
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

  const heading = texts?.systemTitle || "Programın İçinde Ne Var";
  const sub = texts?.systemSubtitle || "Aşağı kaydır; her özellik üst üste dizilsin.";

  const t = texts as Record<string, string | undefined> | undefined;
  const cards = [
    {
      icon: Dumbbell,
      title: texts?.system1Title || "Antrenman Planı",
      desc:
        texts?.system1Description ||
        "Hedeflerine göre kademeli ilerleyen, kişiye özel hazırlanan antrenman programı.",
      image: t?.system1Image,
    },
    {
      icon: Flame,
      title: texts?.system2Title || "Kondisyon & Dayanıklılık",
      desc:
        texts?.system2Description ||
        "Performansını ve dayanıklılığını adım adım yukarı taşıyan akıllı yaklaşım.",
      image: t?.system2Image,
    },
    {
      icon: Apple,
      title: texts?.system3Title || "Beslenme Rehberi",
      desc:
        texts?.system3Description ||
        "Uygulanabilir, sürdürülebilir ve sonuç odaklı kişisel beslenme desteği.",
      image: t?.system3Image,
    },
  ];
  const n = cards.length;

  const CARD_H = 440; // px
  const OFFSET = 34; // istif kayması (px)

  const sectionRef = useRef<HTMLElement>(null);
  const [progress, setProgress] = useState(0);
  const [pin, setPin] = useState<"before" | "fixed" | "after">("before");

  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;
    let raf = 0;
    let running = false;

    const measure = () => {
      const rect = el.getBoundingClientRect();
      const vh = window.innerHeight;
      const travel = rect.height - vh;
      if (travel <= 0) {
        setPin("before");
        setProgress(0);
        return;
      }
      if (rect.top >= 0) setPin("before");
      else if (rect.bottom <= vh) setPin("after");
      else setPin("fixed");
      setProgress(Math.min(Math.max(-rect.top / travel, 0), 1));
    };

    const loop = () => {
      measure();
      if (running) raf = requestAnimationFrame(loop);
    };

    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !running) {
          running = true;
          loop();
        } else if (!entry.isIntersecting && running) {
          running = false;
          cancelAnimationFrame(raf);
          measure();
        }
      },
      { threshold: 0 }
    );
    io.observe(el);
    measure();

    return () => {
      running = false;
      cancelAnimationFrame(raf);
      io.disconnect();
    };
  }, []);

  const stageStyle: React.CSSProperties =
    pin === "fixed"
      ? { position: "fixed", top: 0, left: 0, right: 0, height: "100vh" }
      : pin === "after"
        ? { position: "absolute", bottom: 0, left: 0, right: 0, height: "100vh" }
        : { position: "absolute", top: 0, left: 0, right: 0, height: "100vh" };

  return (
    <section
      ref={sectionRef}
      className="relative"
      style={{ height: `${n * 100}vh`, backgroundColor: bg }}
    >
      <div
        className="overflow-hidden flex items-center"
        style={{ ...stageStyle, backgroundColor: bg }}
      >
        <div className="max-w-6xl mx-auto w-full px-6 grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          {/* Sol — sabit panel */}
          <div>
            <span
              className="text-xs font-bold uppercase tracking-[0.32em]"
              style={{ color: primary }}
            >
              Özellikler
            </span>
            <h2
              className="mt-4 font-black uppercase text-white"
              style={{
                fontFamily: headingFont,
                fontSize: "clamp(2.5rem, 4.8vw, 4.5rem)",
                lineHeight: 1,
              }}
            >
              {heading}
            </h2>
            <p className="mt-6 max-w-md text-white/55 leading-relaxed text-[15px] sm:text-base">
              {sub}
            </p>
            <div className="mt-9 flex items-end gap-3">
              <span
                className="font-black leading-none"
                style={{ color: primary, fontFamily: headingFont, fontSize: "3rem" }}
              >
                {String(Math.min(n, Math.floor(progress * n) + 1)).padStart(2, "0")}
              </span>
              <span className="text-white/30 text-sm pb-1.5">/ {String(n).padStart(2, "0")}</span>
            </div>
          </div>

          {/* Sağ — istiflenen büyük kartlar (fotosuz) */}
          <div
            className="relative overflow-hidden"
            style={{ height: `${CARD_H + (n - 1) * OFFSET}px` }}
          >
            {cards.map((c, i) => {
              const lp = Math.min(Math.max(progress * n - i, 0), 1);
              const Icon = c.icon;
              return (
                <div
                  key={i}
                  className="absolute left-0 right-0 rounded-[2.25rem] overflow-hidden border border-white/12"
                  style={{
                    top: `${i * OFFSET}px`,
                    height: `${CARD_H}px`,
                    zIndex: i + 1,
                    transform: `translateY(${(1 - lp) * 120}%)`,
                    boxShadow: "0 -20px 50px rgba(0,0,0,0.6)",
                    backgroundColor: "#121212",
                  }}
                >
                  <div
                    className="absolute -top-24 -right-16 w-72 h-72 rounded-full blur-[80px] pointer-events-none"
                    style={{ background: primary, opacity: 0.16 }}
                  />
                  {/* Foto verilmişse kart üst-yarısında foto, alt-yarıda içerik;
                      verilmemişse default fotosuz layout (ikon + numara). */}
                  {c.image ? (
                    <div className="relative h-full flex flex-col">
                      <div className="relative w-full overflow-hidden" style={{ height: "55%" }}>
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src={c.image} alt={c.title} className="w-full h-full object-cover" />
                        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black/70 pointer-events-none" />
                      </div>
                      <div className="relative flex-1 flex flex-col justify-between p-7 sm:p-8">
                        <div className="flex items-center justify-between">
                          <span
                            className="inline-flex w-12 h-12 rounded-2xl items-center justify-center"
                            style={{ background: primary }}
                          >
                            <Icon className="w-5 h-5 text-black" strokeWidth={2} />
                          </span>
                          <span
                            className="font-black leading-none"
                            style={{
                              fontFamily: headingFont,
                              fontSize: "3rem",
                              color: "rgba(255,255,255,0.08)",
                            }}
                          >
                            {String(i + 1).padStart(2, "0")}
                          </span>
                        </div>
                        <div>
                          <h3
                            className="text-2xl font-bold text-white"
                            style={{ fontFamily: headingFont }}
                          >
                            {c.title}
                          </h3>
                          <p className="mt-2 text-[14px] text-white/60 leading-relaxed max-w-md">
                            {c.desc}
                          </p>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="relative h-full flex flex-col justify-between p-9 sm:p-10">
                      <div className="flex items-center justify-between">
                        <span
                          className="inline-flex w-14 h-14 rounded-2xl items-center justify-center"
                          style={{ background: primary }}
                        >
                          <Icon className="w-6 h-6 text-black" strokeWidth={2} />
                        </span>
                        <span
                          className="font-black leading-none"
                          style={{
                            fontFamily: headingFont,
                            fontSize: "4rem",
                            color: "rgba(255,255,255,0.08)",
                          }}
                        >
                          {String(i + 1).padStart(2, "0")}
                        </span>
                      </div>
                      <div>
                        <h3
                          className="text-2xl sm:text-3xl font-bold text-white"
                          style={{ fontFamily: headingFont }}
                        >
                          {c.title}
                        </h3>
                        <p className="mt-3 text-[15px] text-white/60 leading-relaxed max-w-md">
                          {c.desc}
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
