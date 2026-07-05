"use client";

import React, { useRef, useState } from "react";
import type { LandingThemeContent, LandingTransformation } from "../../types";
import type { EliteGlobalStyles } from "../../elite-config";
import { ChevronsLeftRight, ArrowLeft, ArrowRight } from "lucide-react";

/**
 * TransformationsCompareSlider — fitflow esinli.
 *
 * Solda başlık; sağda sürüklenebilir bir önce/sonra karşılaştırma görseli.
 * Ortadaki tutamağı sürükledikçe sonra fotoğrafının üzerinden önce fotoğrafı
 * açılır/kapanır. Birden çok danışan için ok + nokta göstergesi.
 * (Tasarım yalnız dönüşüme odaklanır; danışan yorumu içermez.)
 *
 * inspiredBy: https://fitflow-template.framer.website/
 */
export function TransformationsCompareSlider({
  content,
  config,
}: {
  content: LandingThemeContent;
  config?: EliteGlobalStyles;
}) {
  const texts = content.landingTexts;
  const transforms = (content.transformations || []).filter(
    (t) => t.beforePhoto && t.afterPhoto
  );
  const [idx, setIdx] = useState(0);
  const [pos, setPos] = useState(50);
  const dragging = useRef(false);
  const boxRef = useRef<HTMLDivElement>(null);

  if (transforms.length === 0) return null;

  const primary = config?.primaryColor || "#fb5d8d";
  const bg = config?.backgroundColor || "#0a0a0a";
  const text = config?.textColor || "#ffffff";

  const n = transforms.length;
  const active: LandingTransformation = transforms[idx % n];
  const go = (d: number) => {
    setIdx((p) => (p + d + n) % n);
    setPos(50);
  };

  const updateFromClientX = (clientX: number) => {
    const box = boxRef.current;
    if (!box) return;
    const rect = box.getBoundingClientRect();
    const pct = ((clientX - rect.left) / rect.width) * 100;
    setPos(Math.min(100, Math.max(0, pct)));
  };

  const onPointerDown = (e: React.PointerEvent) => {
    dragging.current = true;
    e.currentTarget.setPointerCapture(e.pointerId);
    updateFromClientX(e.clientX);
  };
  const onPointerMove = (e: React.PointerEvent) => {
    if (!dragging.current) return;
    updateFromClientX(e.clientX);
  };
  const onPointerUp = () => {
    dragging.current = false;
  };

  const title = texts?.transformationsTitle || "Gerçek İnsanlar, Gerçek Sonuçlar";
  const parts = title.trim().split(/\s+/);
  const half = Math.ceil(parts.length / 2);
  const line1 = parts.slice(0, half).join(" ");
  const line2 = parts.slice(half).join(" ");

  return (
    <section className="py-24 sm:py-32 px-6" style={{ backgroundColor: bg }}>
      <div className="mx-auto grid max-w-6xl items-center gap-12 md:grid-cols-2 md:gap-16">
        {/* Sol: metin */}
        <div>
          <h2
            className="font-bold"
            style={{
              fontSize: "clamp(2.2rem, 5vw, 3.8rem)",
              lineHeight: 1.05,
            }}
          >
            <span style={{ color: primary }}>{line1}</span>
            {line2 && (
              <>
                <br />
                <span style={{ color: text }}>{line2}</span>
              </>
            )}
          </h2>
          <div className="mt-8 flex items-center gap-4">
            <p className="text-sm" style={{ color: text }}>
              <span className="font-bold">{active.clientName}</span>
              {active.duration ? (
                <span style={{ color: `${text}80` }}> · {active.duration}</span>
              ) : null}
            </p>
            {n > 1 && (
              <div className="ml-auto flex gap-2">
                <button
                  type="button"
                  onClick={() => go(-1)}
                  aria-label="Önceki"
                  className="inline-flex h-10 w-10 items-center justify-center rounded-full border transition-colors"
                  style={{ borderColor: `${text}33`, color: text }}
                >
                  <ArrowLeft className="h-4 w-4" />
                </button>
                <button
                  type="button"
                  onClick={() => go(1)}
                  aria-label="Sonraki"
                  className="inline-flex h-10 w-10 items-center justify-center rounded-full border transition-colors"
                  style={{ borderColor: `${text}33`, color: text }}
                >
                  <ArrowRight className="h-4 w-4" />
                </button>
              </div>
            )}
          </div>
          {n > 1 && (
            <div className="mt-6 flex gap-2">
              {transforms.map((_, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => {
                    setIdx(i);
                    setPos(50);
                  }}
                  aria-label={`Dönüşüm ${i + 1}`}
                  className="h-1.5 rounded-full transition-all"
                  style={{
                    width: i === idx ? 26 : 8,
                    background: i === idx ? primary : `${text}33`,
                  }}
                />
              ))}
            </div>
          )}
        </div>

        {/* Sağ: karşılaştırma sürgüsü */}
        <div
          ref={boxRef}
          onPointerDown={onPointerDown}
          onPointerMove={onPointerMove}
          onPointerUp={onPointerUp}
          onPointerCancel={onPointerUp}
          className="relative touch-none select-none overflow-hidden rounded-3xl"
          style={{ aspectRatio: "4 / 5", background: `${text}10`, cursor: "ew-resize" }}
        >
          {/* Sonra (taban) */}
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={active.afterPhoto}
            alt="Sonra"
            draggable={false}
            className="absolute inset-0 h-full w-full object-cover"
          />
          {/* Önce (üst, kırpılır) */}
          <div
            className="absolute inset-0"
            style={{ clipPath: `inset(0 ${100 - pos}% 0 0)` }}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={active.beforePhoto}
              alt="Önce"
              draggable={false}
              className="absolute inset-0 h-full w-full object-cover"
            />
          </div>

          {/* Etiketler */}
          <span
            className="absolute top-4 left-4 rounded-full px-3 py-1 text-xs font-bold"
            style={{ background: "#ffffff", color: "#000" }}
          >
            Önce
          </span>
          <span
            className="absolute top-4 right-4 rounded-full px-3 py-1 text-xs font-bold"
            style={{ background: primary, color: "#000" }}
          >
            Sonra
          </span>

          {/* Tutamak */}
          <div
            className="absolute inset-y-0 -translate-x-1/2"
            style={{ left: `${pos}%` }}
          >
            <div className="h-full w-[3px]" style={{ background: "#ffffff" }} />
            <div
              className="absolute top-1/2 left-1/2 inline-flex h-12 w-12 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full shadow-lg"
              style={{ background: "#ffffff" }}
            >
              <ChevronsLeftRight className="h-5 w-5" style={{ color: "#000" }} />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
