"use client";

import React, { useState } from "react";
import type { LandingThemeContent, LandingTransformation } from "../../types";
import type { EliteGlobalStyles } from "../../elite-config";
import { ChevronLeft, ChevronRight } from "lucide-react";

/**
 * TransformationsStoryCarousel — curtis esinli.
 *
 * Ortada büyük aktif kart: önce & sonra fotoğrafları yan yana, altında danışan
 * adı ve süreç. Yanlarda komşu kartlar soluk ve küçülmüş şekilde görünür.
 * Dairesel oklar ve nokta göstergesiyle gezilir. (Tasarım yalnız dönüşüme
 * odaklanır; danışan yorumu içermez.)
 *
 * inspiredBy: https://curtis.framer.media/
 */
export function TransformationsStoryCarousel({
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
  if (transforms.length === 0) return null;

  const primary = config?.primaryColor || "#a3e635";
  const bg = config?.backgroundColor || "#0a0a0a";
  const text = config?.textColor || "#ffffff";

  const n = transforms.length;
  const active: LandingTransformation = transforms[idx % n];
  const prev = transforms[(idx - 1 + n) % n];
  const next = transforms[(idx + 1) % n];
  const go = (d: number) => setIdx((p) => (p + d + n) % n);

  const title = texts?.transformationsTitle || "Sonuçlar Kendini Anlatır";
  const parts = title.trim().split(/\s+/);
  const firstWord = parts[0];
  const restWords = parts.slice(1).join(" ");

  return (
    <section className="py-24 sm:py-32 px-6" style={{ backgroundColor: bg }}>
      <div className="mx-auto max-w-6xl">
        {/* Başlık */}
        <div className="mx-auto mb-12 max-w-2xl text-center">
          <span
            className="inline-block rounded-full border px-4 py-1 text-xs font-semibold uppercase tracking-wider"
            style={{ borderColor: `${text}26`, color: `${text}cc` }}
          >
            Danışan Hikayeleri
          </span>
          <h2
            className="mt-5 font-bold"
            style={{
              color: text,
              fontSize: "clamp(2rem, 5vw, 3.6rem)",
              lineHeight: 1.05,
            }}
          >
            <span style={{ color: primary }}>{firstWord}</span>
            {restWords ? ` ${restWords}` : ""}
          </h2>
          <p className="mt-4 text-sm leading-relaxed" style={{ color: `${text}80` }}>
            Filtre yok. Sadece disiplin, istikrar ve gerçek sonuçlar — kanıtlanmış
            bir sistemle gelen değişim.
          </p>
        </div>

        {/* Carousel */}
        <div className="relative">
          {/* Komşu kartlar (soluk önizleme) */}
          {n > 1 && (
            <>
              <div
                className="pointer-events-none absolute inset-y-8 -left-10 hidden w-44 overflow-hidden rounded-2xl lg:block"
                style={{ opacity: 0.25, filter: "blur(2px)" }}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={prev.afterPhoto}
                  alt=""
                  className="h-full w-full object-cover"
                />
              </div>
              <div
                className="pointer-events-none absolute inset-y-8 -right-10 hidden w-44 overflow-hidden rounded-2xl lg:block"
                style={{ opacity: 0.25, filter: "blur(2px)" }}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={next.afterPhoto}
                  alt=""
                  className="h-full w-full object-cover"
                />
              </div>
            </>
          )}

          {/* Aktif kart */}
          <div
            className="relative overflow-hidden rounded-3xl border"
            style={{ borderColor: `${text}1a`, background: `${text}08` }}
          >
            {/* Fotoğraflar */}
            <div className="grid grid-cols-2 gap-1 p-1">
              {[
                { src: active.beforePhoto, label: "Önce", accent: false },
                { src: active.afterPhoto, label: "Sonra", accent: true },
              ].map((ph) => (
                <div
                  key={ph.label}
                  className="relative overflow-hidden rounded-2xl"
                  style={{ aspectRatio: "4 / 5", background: `${text}10` }}
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={ph.src}
                    alt={ph.label}
                    className="absolute inset-0 h-full w-full object-cover"
                  />
                  <span
                    className="absolute top-4 left-4 rounded-full px-3 py-1 text-xs font-bold"
                    style={
                      ph.accent
                        ? { background: primary, color: "#000" }
                        : { background: "#ffffff", color: "#000" }
                    }
                  >
                    {ph.label}
                  </span>
                </div>
              ))}
            </div>

            {/* Danışan adı + süreç */}
            <div
              className="flex items-center justify-between gap-4 border-t px-7 py-5"
              style={{ borderColor: `${text}14` }}
            >
              <p className="text-xl font-bold" style={{ color: text }}>
                {active.clientName}
              </p>
              {active.duration && (
                <span
                  className="rounded-full px-3 py-1 text-xs font-semibold"
                  style={{ background: `${primary}1f`, color: primary }}
                >
                  {active.duration}
                </span>
              )}
            </div>
          </div>

          {/* Oklar */}
          {n > 1 && (
            <>
              <button
                type="button"
                onClick={() => go(-1)}
                aria-label="Önceki"
                className="absolute top-1/2 left-3 z-10 inline-flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full backdrop-blur-md transition-transform hover:scale-105"
                style={{ background: `${text}1f`, color: text }}
              >
                <ChevronLeft className="h-5 w-5" />
              </button>
              <button
                type="button"
                onClick={() => go(1)}
                aria-label="Sonraki"
                className="absolute top-1/2 right-3 z-10 inline-flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full backdrop-blur-md transition-transform hover:scale-105"
                style={{ background: `${text}1f`, color: text }}
              >
                <ChevronRight className="h-5 w-5" />
              </button>
            </>
          )}
        </div>

        {/* Noktalar */}
        {n > 1 && (
          <div className="mt-8 flex justify-center gap-2">
            {transforms.map((_, i) => (
              <button
                key={i}
                type="button"
                onClick={() => setIdx(i)}
                aria-label={`Dönüşüm ${i + 1}`}
                className="h-2 rounded-full transition-all"
                style={{
                  width: i === idx ? 24 : 8,
                  background: i === idx ? primary : `${text}33`,
                }}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
