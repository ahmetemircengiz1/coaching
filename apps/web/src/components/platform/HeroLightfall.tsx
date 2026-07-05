"use client";

import { useEffect, useRef, useState } from "react";
import { useReducedMotion } from "framer-motion";
import Lightfall from "./Lightfall";

const ACCENT = "#d4ff3f";

// Modül seviyesinde sabit referans — her render'da yeni dizi üretip
// Lightfall'ın WebGL bağlamını yeniden kurmasını önler.
const COLORS = ["#d4ff3f", "#eaffb0", "#9fe870"];

/**
 * Hero için lime'a boyanmış Lightfall arka planı.
 * - `prefers-reduced-motion` açıksa: animasyon yerine statik lime gradyan (siyah değil).
 * - Hero ekrandan çıkınca animasyon duraklatılır (pil/performans).
 * - Üstte hafif vinyet/gradyan katmanları metni okunur tutar.
 */
export function HeroLightfall() {
  const reduce = useReducedMotion();
  const ref = useRef<HTMLDivElement>(null);
  const [inView, setInView] = useState(true);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(([entry]) => setInView(entry.isIntersecting), {
      threshold: 0,
    });
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  return (
    <div ref={ref} className="absolute inset-0 z-0 overflow-hidden bg-[#050505]">
      {reduce ? (
        // Reduced-motion: animasyonsuz ama siyah değil — statik lime parıltıları.
        <>
          <div
            className="absolute -right-[10%] -top-[20%] h-[700px] w-[700px] rounded-full opacity-[0.16] blur-[150px]"
            style={{ backgroundColor: ACCENT }}
          />
          <div
            className="absolute -bottom-[25%] left-[20%] h-[600px] w-[600px] rounded-full opacity-[0.10] blur-[140px]"
            style={{ backgroundColor: ACCENT }}
          />
        </>
      ) : (
        <div className="absolute inset-0">
          <Lightfall
            colors={COLORS}
            backgroundColor="#0a0f00"
            speed={0.45}
            streakCount={4}
            streakWidth={1}
            streakLength={1}
            glow={1.1}
            density={0.6}
            twinkle={1}
            zoom={3}
            backgroundGlow={0.5}
            opacity={1}
            mouseInteraction
            mouseStrength={0.5}
            mouseRadius={1}
            paused={!inView}
          />
        </div>
      )}

      {/* İnce grid dokusu */}
      <div
        className="absolute inset-0 opacity-[0.04]"
        style={{ backgroundImage: "radial-gradient(#ffffff 1px, transparent 1px)", backgroundSize: "40px 40px" }}
      />
      {/* Okunabilirlik için hafif vinyet (akışı boğmadan) + üst/alt geçiş */}
      <div
        className="absolute inset-0"
        style={{ background: "radial-gradient(ellipse 95% 85% at 50% 42%, transparent 45%, rgba(5,5,5,0.82) 96%)" }}
      />
      <div className="absolute inset-x-0 top-0 h-28 bg-gradient-to-b from-[#050505] to-transparent" />
      <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-[#050505] to-transparent" />
    </div>
  );
}
