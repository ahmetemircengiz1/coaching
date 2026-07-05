"use client";

import React, { useEffect, useRef, useState } from "react";
import type { LandingThemeContent } from "../../types";
import type { EliteGlobalStyles } from "../../elite-config";

/**
 * TransformationsCinematicStrip — fightness esinli.
 *
 * Dönüşüm fotoğrafları sinematik bir film şeridi gibi soldan sağa akar — fakat
 * düz değil: kareler dışbükey 3 boyutlu bir yay üzerinde dizilir. Ortadaki kare
 * izleyiciye en yakın noktada, tam karşıya bakar; kenardaki kareler geriye
 * yaslanır ve dışa doğru döner. Akış sürerken her kare bu yayın içinden geçer.
 *
 * Ortadaki mavi "portal" ışığının solundaki kareler siyah-beyaz (eski hal);
 * portalın sağına geçen kareler renklenir (yeni hal).
 *
 * Teknik: iki özdeş katman üst üste. Üstteki katman grayscale'dir ve clip-path
 * ile yalnız sol yarıda görünür; alttaki renkli katman sağ yarıda ortaya çıkar.
 * Kareler bir requestAnimationFrame döngüsüyle akıtılır; her karenin ekran
 * konumuna göre rotateY + translateZ uygulanarak içbükey yay oluşturulur.
 *
 * inspiredBy: https://fightness.framer.website/
 */

const CARD_W = 196;
const CARD_H = 288;
const GAP = 32;
const SLOT = CARD_W + GAP;

export function TransformationsCinematicStrip({
  content,
  config,
}: {
  content: LandingThemeContent;
  config?: EliteGlobalStyles;
}) {
  const texts = content.landingTexts;
  const transforms = content.transformations || [];

  const primary = config?.primaryColor || "#3b5bff";
  const bg = config?.backgroundColor || "#0a0a0a";
  const text = config?.textColor || "#ffffff";
  const headingFont = 'var(--font-oswald), "Arial Narrow", sans-serif';

  // Tüm öncesi + sonrası fotoğraflarını tek bir akışa düzleştir
  let photos: string[] = [];
  for (const t of transforms) {
    if (t.beforePhoto) photos.push(t.beforePhoto);
    if (t.afterPhoto) photos.push(t.afterPhoto);
  }
  // Geniş ekranları doldurmaya ve kesintisiz akışa yetecek kare sayısı
  while (photos.length > 0 && photos.length < 12) photos = [...photos, ...photos];
  const loop = [...photos, ...photos];

  const viewportRef = useRef<HTMLDivElement>(null);
  const colorRefs = useRef<(HTMLDivElement | null)[]>([]);
  const grayRefs = useRef<(HTMLDivElement | null)[]>([]);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const vp = viewportRef.current;
    const L = loop.length;
    if (!vp || L === 0) return;

    const reduce = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    const stripW = L * SLOT;
    const BUF = CARD_W + 90; // sarma sınırını ekran dışına taşır
    const SPEED = 52; // px/sn
    const MAX_ANGLE = 76; // derece — kenar karenin dönüşü (yüksek bükeylik)
    const DEPTH = 520; // px — kenar karenin geriye yaslanması (yüksek derinlik)
    const DROOP = 30; // px — kenar karelerin aşağı kayması

    let offset = 0;
    let raf = 0;
    let last = performance.now();

    const apply = () => {
      const vw = vp.clientWidth;
      const cx = vw / 2;
      const half = vw / 2 || 1;
      for (let i = 0; i < L; i++) {
        const x =
          (((i * SLOT - offset + BUF) % stripW) + stripW) % stripW - BUF;
        const center = x + CARD_W / 2;
        const raw = (center - cx) / half;
        const p = Math.max(-1.7, Math.min(1.7, raw));
        const rotY = -p * MAX_ANGLE;
        const tz = -Math.abs(p) * DEPTH;
        const ty = Math.abs(p) * DROOP;
        const t = `translate(${x}px, calc(-50% + ${ty}px)) rotateY(${rotY}deg) translateZ(${tz}px)`;
        const zi = String(1000 - Math.round(Math.abs(center - cx)));
        const c = colorRefs.current[i];
        const g = grayRefs.current[i];
        if (c) {
          c.style.transform = t;
          c.style.zIndex = zi;
        }
        if (g) {
          g.style.transform = t;
          g.style.zIndex = zi;
        }
      }
    };

    apply();
    setReady(true);

    if (reduce) {
      const onResize = () => apply();
      window.addEventListener("resize", onResize);
      return () => window.removeEventListener("resize", onResize);
    }

    const tick = (now: number) => {
      const dt = Math.min(0.05, (now - last) / 1000);
      last = now;
      offset = (offset + SPEED * dt) % stripW;
      apply();
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [loop.length]);

  if (loop.length === 0) return null;

  const title = texts?.transformationsTitle || "Sıfırdan Zirveye";
  const parts = title.trim().split(/\s+/);
  const lastWord = parts.length > 1 ? parts[parts.length - 1] : null;
  const headWords = lastWord ? parts.slice(0, -1).join(" ") : title;

  const cardStyle: React.CSSProperties = {
    top: "50%",
    left: 0,
    width: CARD_W,
    height: CARD_H,
    transformOrigin: "center center",
    willChange: "transform",
    backfaceVisibility: "hidden",
    boxShadow: "0 44px 74px -26px rgba(0,0,0,0.82)",
    background: "#111",
  };

  return (
    <section
      className="relative overflow-hidden py-24 sm:py-32"
      style={{ backgroundColor: bg }}
    >
      {/* Başlık */}
      <div className="text-center px-6 mb-14 sm:mb-20">
        <span
          className="text-xs font-semibold uppercase tracking-[0.34em]"
          style={{ color: `${text}66` }}
        >
          (Gerçek Dönüşümler)
        </span>
        <h2
          className="mt-4 font-extrabold uppercase"
          style={{
            fontFamily: headingFont,
            color: text,
            fontSize: "clamp(2.6rem, 8vw, 7rem)",
            lineHeight: 0.95,
            letterSpacing: "-0.01em",
          }}
        >
          {headWords}
          {lastWord && <span style={{ color: primary }}> {lastWord}</span>}
        </h2>
      </div>

      {/* Akan içbükey şerit */}
      <div
        ref={viewportRef}
        className="relative mx-auto"
        style={{
          height: 470,
          opacity: ready ? 1 : 0,
          transition: "opacity 0.5s ease",
          WebkitMaskImage:
            "linear-gradient(90deg, transparent, #000 14%, #000 86%, transparent)",
          maskImage:
            "linear-gradient(90deg, transparent, #000 14%, #000 86%, transparent)",
        }}
      >
        {/* Renkli katman (alt) */}
        <div
          className="absolute inset-0"
          style={{ perspective: "920px", perspectiveOrigin: "50% 46%" }}
        >
          {loop.map((src, i) => (
            <div
              key={`c-${i}`}
              ref={(el) => {
                colorRefs.current[i] = el;
              }}
              className="absolute overflow-hidden rounded-2xl"
              style={cardStyle}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={src}
                alt=""
                draggable={false}
                className="h-full w-full object-cover"
              />
            </div>
          ))}
        </div>

        {/* Gri katman (üst) — yalnız sol yarı görünür */}
        <div
          className="absolute inset-0"
          style={{
            perspective: "1200px",
            perspectiveOrigin: "50% 46%",
            clipPath: "inset(0 50% 0 0)",
            filter: "grayscale(1) brightness(0.82)",
          }}
        >
          {loop.map((src, i) => (
            <div
              key={`g-${i}`}
              ref={(el) => {
                grayRefs.current[i] = el;
              }}
              className="absolute overflow-hidden rounded-2xl"
              style={cardStyle}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={src}
                alt=""
                draggable={false}
                className="h-full w-full object-cover"
              />
            </div>
          ))}
        </div>

        {/* Merkezdeki mavi portal */}
        <div
          className="pointer-events-none absolute inset-y-0 left-1/2 -translate-x-1/2"
          style={{ width: 340, zIndex: 2000 }}
        >
          <div
            className="absolute inset-0"
            style={{
              background: `radial-gradient(ellipse 46% 60% at 50% 50%, ${primary}55, transparent 70%)`,
            }}
          />
          <div
            className="absolute inset-y-16 left-1/2 -translate-x-1/2"
            style={{
              width: 6,
              borderRadius: 9999,
              background: `linear-gradient(${primary}, #ffffff, ${primary})`,
              boxShadow: `0 0 22px 6px ${primary}, 0 0 64px 16px ${primary}88`,
            }}
          />
        </div>
      </div>
    </section>
  );
}
