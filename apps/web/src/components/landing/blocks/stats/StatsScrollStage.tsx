"use client";

import React, { useEffect, useRef, useState } from "react";
import type { LandingThemeContent } from "../../types";
import type { EliteGlobalStyles } from "../../elite-config";

/**
 * StatsScrollStage — rimz esinli.
 * Pinlenmiş sahne: bölüm boyunca ekran sabit kalır, kullanıcı kaydırdıkça
 * dev istatistikler tek tek ekrana gelir; bölüm bitince sayfa normal akışına döner.
 *
 * NOT: `position: sticky` KULLANILMIYOR — landing sayfasında `overflow: hidden`
 * taşıyan bir üst container var ve bu sticky'yi sessizce bozuyor (sahne kayıp
 * gidip arkada simsiyah boşluk bırakıyordu). Bunun yerine sahne JS ile
 * `position: fixed` arasında geçiş yapıyor:
 *   - before: bölüme henüz gelinmedi → absolute, üstte
 *   - fixed:  bölümün içindeyiz       → fixed, ekrana sabit
 *   - after:  bölüm geçildi           → absolute, altta
 * İlerleme tespiti scroll event'i yerine, bölüm görünürken çalışan bir
 * requestAnimationFrame döngüsüyle yapılır → hangi öğenin kaydığından bağımsız.
 *
 * inspiredBy: https://rimz.framer.website/
 */
export function StatsScrollStage({
  content,
  config,
}: {
  content: LandingThemeContent;
  config?: EliteGlobalStyles;
}) {
  const texts = content.landingTexts;
  const primary = config?.primaryColor || "#ccff00";
  const headingFont = 'var(--font-oswald), "Arial Narrow", sans-serif';

  const stats = [
    { value: texts?.stat1Value || "12.000+", label: texts?.stat1Label || "Mutlu Öğrenci" },
    { value: texts?.stat2Value || "500+", label: texts?.stat2Label || "Tamamlanan Program" },
    { value: texts?.stat3Value || "10+", label: texts?.stat3Label || "Yıl Tecrübe" },
  ];
  const count = stats.length;

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
      if (rect.top >= 0) {
        setPin("before");
      } else if (rect.bottom <= vh) {
        setPin("after");
      } else {
        setPin("fixed");
      }
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
          measure(); // bölüm dışına çıkınca son durumu (before/after) sabitle
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
      className="relative bg-black"
      style={{ height: `${count * 100}vh` }}
    >
      <div
        className="overflow-hidden bg-black flex items-center justify-center"
        style={stageStyle}
      >
        {/* Eyebrow */}
        <span className="absolute top-8 left-6 sm:left-10 text-xs sm:text-sm font-bold uppercase tracking-[0.3em] text-white">
          Başarılarımız
        </span>

        {/* İlerleme noktaları */}
        <div className="absolute top-8 right-6 sm:right-10 flex gap-2">
          {stats.map((_, i) => (
            <span
              key={i}
              className="w-2 h-2 rounded-full transition-colors duration-300"
              style={{ backgroundColor: i === active ? primary : "rgba(255,255,255,0.2)" }}
            />
          ))}
        </div>

        {/* İstatistikler — üst üste, crossfade */}
        {stats.map((s, i) => (
          <div
            key={i}
            className="absolute inset-0 flex flex-col items-center justify-center px-6 transition-all duration-700 ease-out"
            style={{
              opacity: i === active ? 1 : 0,
              transform:
                i === active
                  ? "translateY(0)"
                  : i < active
                    ? "translateY(-48px)"
                    : "translateY(48px)",
            }}
            aria-hidden={i !== active}
          >
            <div
              className="font-black text-white text-center leading-none"
              style={{ fontSize: "clamp(4rem, 15vw, 13rem)", fontFamily: headingFont }}
            >
              {s.value}
            </div>
            <div
              className="mt-6 text-base sm:text-2xl font-semibold uppercase tracking-[0.22em] text-center"
              style={{ color: primary }}
            >
              {s.label}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
