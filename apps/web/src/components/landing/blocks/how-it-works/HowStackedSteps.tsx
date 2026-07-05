"use client";

import React, { useEffect, useRef, useState } from "react";
import type { LandingThemeContent } from "../../types";
import type { EliteGlobalStyles } from "../../elite-config";

/**
 * HowStackedSteps — fightness esinli.
 * Pinlenmiş bölüm: sol panel (eyebrow + dev başlık + açıklama) sabit kalır,
 * kullanıcı kaydırdıkça sağ tarafta adım kartları alttan gelip üst üste
 * istiflenir. Kartların içinde görsel yok — yalnızca STEP etiketi + açıklama.
 *
 * NOT: `position: sticky` KULLANILMIYOR — JS ile `position: fixed` pinleme +
 * rAF döngüsü; `overflow:hidden` üst container'lardan etkilenmez.
 *
 * inspiredBy: https://fightness.framer.website/
 */
export function HowStackedSteps({
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

  const heading = texts?.systemTitle || "Basit, Kanıtlanmış Bir Süreç";
  const sub =
    texts?.systemSubtitle ||
    "Her danışan net ve yapılandırılmış bir süreci takip eder — değerlendirmeden uygulamaya ve sürekli ilerleme takibine kadar.";

  const t = texts as Record<string, string | undefined> | undefined;
  const steps = [
    {
      title: texts?.system1Title || "Değerlendirme",
      desc:
        texts?.system1Description ||
        "Başlangıç noktanı, hedeflerini ve fiziksel durumunu detaylıca analiz ediyoruz.",
      image: t?.system1Image,
    },
    {
      title: texts?.system2Title || "Strateji ve Planlama",
      desc:
        texts?.system2Description ||
        "Hedeflerine, programına ve mevcut form seviyene uygun kişisel bir antrenman planı oluşturuyoruz.",
      image: t?.system2Image,
    },
    {
      title: texts?.system3Title || "Uygulama ve Takip",
      desc:
        texts?.system3Description ||
        "Planı hayata geçirir, düzenli takip ve geri bildirimle ilerlemeni güvence altına alırız.",
      image: t?.system3Image,
    },
  ];
  const n = steps.length;

  const CARD_H = 420; // px
  const OFFSET = 32; // istif kayması (px)

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
              (Nasıl Çalışır)
            </span>
            <h2
              className="mt-4 font-black uppercase text-white"
              style={{
                fontFamily: headingFont,
                fontSize: "clamp(2.75rem, 6vw, 5.5rem)",
                lineHeight: 0.95,
              }}
            >
              {heading}
            </h2>
            <p className="mt-7 max-w-md text-white/55 leading-relaxed text-[15px] sm:text-base">
              {sub}
            </p>
          </div>

          {/* Sağ — istiflenen adım kartları */}
          <div
            className="relative overflow-hidden"
            style={{ height: `${CARD_H + (n - 1) * OFFSET}px` }}
          >
            {steps.map((s, i) => {
              const lp = Math.min(Math.max(progress * n - i, 0), 1);
              return (
                <div
                  key={i}
                  className="absolute left-0 right-0 rounded-[2rem] overflow-hidden border border-white/12"
                  style={{
                    top: `${i * OFFSET}px`,
                    height: `${CARD_H}px`,
                    zIndex: i + 1,
                    transform: `translateY(${(1 - lp) * 120}%)`,
                    boxShadow: "0 -20px 50px rgba(0,0,0,0.6)",
                    backgroundColor: "#121212",
                  }}
                >
                  {/* Foto verilmişse kart bg'i + alt koyu gradyan */}
                  {s.image && (
                    <>
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={s.image}
                        alt=""
                        className="absolute inset-0 w-full h-full object-cover"
                        style={{ opacity: 0.55 }}
                        aria-hidden
                      />
                      <div
                        className="absolute inset-0 pointer-events-none"
                        style={{
                          background:
                            "linear-gradient(180deg, rgba(0,0,0,0.3) 0%, rgba(0,0,0,0.55) 50%, rgba(0,0,0,0.9) 100%)",
                        }}
                      />
                    </>
                  )}
                  <div
                    className="absolute -top-20 -right-16 w-72 h-72 rounded-full blur-[80px] pointer-events-none"
                    style={{ background: primary, opacity: s.image ? 0.1 : 0.18 }}
                  />
                  <div className="relative h-full flex flex-col justify-between p-9 sm:p-10">
                    <span
                      className="text-sm font-bold uppercase tracking-[0.3em] drop-shadow"
                      style={{ color: primary }}
                    >
                      Adım {String(i + 1).padStart(2, "0")}
                    </span>
                    <div>
                      <h3
                        className="font-black uppercase text-white drop-shadow"
                        style={{ fontFamily: headingFont, fontSize: "clamp(2rem, 3.4vw, 3.25rem)", lineHeight: 1 }}
                      >
                        {s.title}
                      </h3>
                      <p
                        className={`mt-3.5 text-[15px] sm:text-base leading-relaxed max-w-md ${
                          s.image ? "text-white/85" : "text-white/60"
                        }`}
                      >
                        {s.desc}
                      </p>
                    </div>
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
