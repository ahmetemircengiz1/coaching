"use client";

import React, { useEffect, useRef, useState } from "react";
import type { LandingThemeContent } from "../../types";
import type { EliteGlobalStyles } from "../../elite-config";
import { ClipboardList, Dumbbell, LineChart } from "lucide-react";

/**
 * FeatureStickyReveal — outpace esinli (fotosuz varyant).
 * Pinlenmiş bölüm: sol panel sabit kalır, kullanıcı kaydırdıkça sağ tarafta
 * büyük özellik kartları tek tek (crossfade ile) karşıya gelir; tüm özellikler
 * gösterilince sayfa normal akışına döner. Kartların içinde fotoğraf yok —
 * accent glow + dev numara filigranı + ikon tabanlı tasarım.
 *
 * NOT: `position: sticky` KULLANILMIYOR — `overflow:hidden` üst container'lar
 * bozuyor. JS ile `position: fixed` pinleme + rAF döngüsü kullanılır.
 *
 * inspiredBy: https://outpace.framer.media/
 */
export function FeatureStickyReveal({
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

  const heading = texts?.systemTitle || "Seni Sonuca Götüren Sistem";
  const sub =
    texts?.systemSubtitle || "Aşağı kaydır; sürecin her adımı tek tek karşına gelsin.";

  const t = texts as Record<string, string | undefined> | undefined;
  const features = [
    {
      icon: ClipboardList,
      title: texts?.system1Title || "Kişisel Değerlendirme",
      desc:
        texts?.system1Description ||
        "Mevcut formunu, alışkanlıklarını ve hedeflerini birlikte netleştiriyoruz.",
      image: t?.system1Image,
    },
    {
      icon: Dumbbell,
      title: texts?.system2Title || "Sana Özel Program",
      desc:
        texts?.system2Description ||
        "Yaşam tarzına uyan, sürdürülebilir ve ölçülebilir bir antrenman planı kuruyoruz.",
      image: t?.system2Image,
    },
    {
      icon: LineChart,
      title: texts?.system3Title || "Takip ve Optimizasyon",
      desc:
        texts?.system3Description ||
        "İlerlemeni düzenli ölçüyor, planı sonuçlarına göre sürekli güncelliyoruz.",
      image: t?.system3Image,
    },
  ];
  const count = features.length;

  const sectionRef = useRef<HTMLElement>(null);
  const [active, setActive] = useState(0);
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
        setActive(0);
        return;
      }
      if (rect.top >= 0) setPin("before");
      else if (rect.bottom <= vh) setPin("after");
      else setPin("fixed");
      const progress = Math.min(Math.max(-rect.top / travel, 0), 1);
      setActive(Math.min(count - 1, Math.floor(progress * count)));
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
  }, [count]);

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
      style={{ height: `${count * 100}vh`, backgroundColor: bg }}
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

            {/* Adım listesi */}
            <div className="mt-10 space-y-1">
              {features.map((f, i) => {
                const on = i === active;
                return (
                  <div
                    key={i}
                    className="flex items-center gap-4 py-2 transition-opacity duration-300"
                    style={{ opacity: on ? 1 : 0.35 }}
                  >
                    <span
                      className="font-black tabular-nums leading-none"
                      style={{
                        fontFamily: headingFont,
                        fontSize: "1.5rem",
                        color: on ? primary : "rgba(255,255,255,0.5)",
                      }}
                    >
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <span
                      className="h-px flex-1 transition-colors duration-300"
                      style={{ background: on ? primary : "rgba(255,255,255,0.14)" }}
                    />
                    <span className="text-sm font-semibold text-white">{f.title}</span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Sağ — büyük aktif özellik kartı (fotosuz) */}
          <div className="relative h-[460px] sm:h-[540px]">
            {features.map((f, i) => {
              const Icon = f.icon;
              return (
                <div
                  key={i}
                  className="absolute inset-0 rounded-[2.25rem] overflow-hidden border border-white/12 flex flex-col justify-between p-10 sm:p-12 transition-all duration-700 ease-out"
                  style={{
                    opacity: i === active ? 1 : 0,
                    transform:
                      i === active
                        ? "translateY(0) scale(1)"
                        : i < active
                          ? "translateY(-44px) scale(0.95)"
                          : "translateY(44px) scale(0.95)",
                    pointerEvents: i === active ? "auto" : "none",
                    backgroundColor: "#101010",
                  }}
                  aria-hidden={i !== active}
                >
                  {/* Foto verilmişse kart arka planına otursun + okunabilirlik için koyu gradyan */}
                  {f.image && (
                    <>
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={f.image}
                        alt=""
                        className="absolute inset-0 w-full h-full object-cover"
                        style={{ opacity: 0.55 }}
                        aria-hidden
                      />
                      <div
                        className="absolute inset-0 pointer-events-none"
                        style={{
                          background:
                            "linear-gradient(180deg, rgba(0,0,0,0.35) 0%, rgba(0,0,0,0.45) 45%, rgba(0,0,0,0.82) 100%)",
                        }}
                      />
                    </>
                  )}
                  <div
                    className="absolute -top-24 -right-20 w-80 h-80 rounded-full blur-[90px] pointer-events-none"
                    style={{ background: primary, opacity: f.image ? 0.1 : 0.18 }}
                  />
                  <span
                    className="absolute top-7 right-8 font-black leading-none pointer-events-none"
                    style={{
                      fontFamily: headingFont,
                      fontSize: "8rem",
                      color: f.image ? "rgba(255,255,255,0.12)" : "rgba(255,255,255,0.07)",
                    }}
                  >
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <span
                    className="relative inline-flex w-16 h-16 rounded-2xl items-center justify-center"
                    style={{ background: primary }}
                  >
                    <Icon className="w-7 h-7 text-black" strokeWidth={2} />
                  </span>
                  <div className="relative">
                    <h3
                      className="text-3xl sm:text-4xl font-bold text-white drop-shadow"
                      style={{ fontFamily: headingFont }}
                    >
                      {f.title}
                    </h3>
                    <p className="mt-4 text-white/80 leading-relaxed text-[15px] sm:text-base max-w-md">
                      {f.desc}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
