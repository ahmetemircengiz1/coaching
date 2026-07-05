"use client";

import React, { useState } from "react";
import type { LandingThemeContent, LandingTransformation } from "../../types";
import type { EliteGlobalStyles } from "../../elite-config";
import { Dumbbell, ArrowLeft, ArrowRight } from "lucide-react";

/**
 * TransformationsStatCard — fitnix esinli.
 *
 * Tek bir büyük kart: solda danışan adı, rol, yaş ve ölçüm tablosu
 * (süreç / önce / sonra — sonra değerleri vurgu renginde); sağda önce & sonra
 * fotoğrafları yan yana. Oklar ve nokta göstergesiyle danışanlar arasında gezilir.
 *
 * Ölçüm bilgileri (kilo, vücut yağı, yaş, rol) koç panelinden — Dönüşüm
 * Hikayeleri ayarlarından — girilir; boşsa ilgili satır gizlenir.
 *
 * inspiredBy: https://fitnix.framer.website/
 */
export function TransformationsStatCard({
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

  const primary = config?.primaryColor || "#ff6a1a";
  const bg = config?.backgroundColor || "#0a0a0a";
  const text = config?.textColor || "#ffffff";
  const headingFont = 'var(--font-oswald), "Arial Narrow", sans-serif';

  const active: LandingTransformation = transforms[idx % transforms.length];
  const go = (d: number) =>
    setIdx((p) => (p + d + transforms.length) % transforms.length);

  const customStats = ((active as unknown as { customStats?: { label?: string; value?: string }[] | null }).customStats || [])
    .filter((s): s is { label: string; value: string } => Boolean(s?.label?.trim() && s?.value?.trim()));

  const rows = (
    [
      active.weightBefore || active.weightAfter
        ? { label: "Kilo", before: active.weightBefore, after: active.weightAfter }
        : null,
      active.bodyFatBefore || active.bodyFatAfter
        ? { label: "Vücut Yağı", before: active.bodyFatBefore, after: active.bodyFatAfter }
        : null,
      // Custom istatistikler — before kolonu yok, "after" alanı tüm değeri (önce → sonra) içerir
      ...customStats.map((cs) => ({ label: cs.label, before: null, after: cs.value })),
    ].filter(Boolean) as { label: string; before?: string | null; after?: string | null }[]
  );

  const title = texts?.transformationsTitle || "Gerçek Emek, Gerçek Gelişim";

  const NavBtn = ({
    onClick,
    children,
  }: {
    onClick: () => void;
    children: React.ReactNode;
  }) => (
    <button
      type="button"
      onClick={onClick}
      className="inline-flex w-11 h-11 items-center justify-center rounded-full border transition-colors"
      style={{ borderColor: `${text}33`, color: text }}
    >
      {children}
    </button>
  );

  return (
    <section className="py-24 sm:py-32 px-6" style={{ backgroundColor: bg }}>
      <div className="max-w-6xl mx-auto">
        {/* Üst bar */}
        <div className="flex items-start justify-between gap-6">
          <div>
            <span
              className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.2em]"
              style={{ color: text }}
            >
              <span
                className="inline-flex w-7 h-7 items-center justify-center rounded-md"
                style={{ background: primary }}
              >
                <Dumbbell className="w-4 h-4 text-black" />
              </span>
              Önce ve Sonra
            </span>
            <h2
              className="mt-5 font-extrabold uppercase"
              style={{
                fontFamily: headingFont,
                color: text,
                fontSize: "clamp(2rem, 5vw, 3.6rem)",
                lineHeight: 1,
              }}
            >
              {title}
            </h2>
          </div>
          <div className="hidden sm:flex gap-3 shrink-0 pt-2">
            <NavBtn onClick={() => go(-1)}>
              <ArrowLeft className="w-5 h-5" />
            </NavBtn>
            <NavBtn onClick={() => go(1)}>
              <ArrowRight className="w-5 h-5" />
            </NavBtn>
          </div>
        </div>

        {/* Kart */}
        <div
          className="mt-10 grid md:grid-cols-2 overflow-hidden rounded-3xl border"
          style={{ borderColor: `${text}1a`, background: `${text}08` }}
        >
          {/* Sol: bilgiler */}
          <div className="p-8 sm:p-10 flex flex-col">
            <h3
              className="font-extrabold uppercase"
              style={{
                fontFamily: headingFont,
                color: text,
                fontSize: "clamp(1.8rem, 3.5vw, 2.8rem)",
                lineHeight: 1,
              }}
            >
              {active.clientName}
            </h3>
            <div className="mt-2 space-y-0.5 text-sm" style={{ color: `${text}99` }}>
              {active.role && <p>{active.role}</p>}
              {active.age && <p>Yaş: {active.age}</p>}
            </div>

            {rows.length > 0 && (
              <div className="mt-8 border-t pt-4" style={{ borderColor: `${text}1a` }}>
                <div
                  className="grid grid-cols-3 gap-x-4 pb-3 text-xs font-bold uppercase tracking-wider"
                  style={{ color: text }}
                >
                  <span>{active.duration || "Süreç"}</span>
                  <span>Önce</span>
                  <span>Sonra</span>
                </div>
                {rows.map((r) => (
                  <div
                    key={r.label}
                    className="grid grid-cols-3 gap-x-4 border-t py-2.5 text-sm"
                    style={{ borderColor: `${text}12` }}
                  >
                    <span style={{ color: `${text}99` }}>{r.label}</span>
                    <span style={{ color: text }}>{r.before || "—"}</span>
                    <span className="font-bold" style={{ color: primary }}>
                      {r.after || "—"}
                    </span>
                  </div>
                ))}
              </div>
            )}

            {active.description && (
              <p
                className="mt-6 text-sm leading-relaxed"
                style={{ color: `${text}88` }}
              >
                {active.description}
              </p>
            )}

            <div className="mt-auto flex items-center gap-3 pt-8">
              <div className="flex gap-1.5">
                {transforms.map((_, i) => (
                  <button
                    key={i}
                    type="button"
                    onClick={() => setIdx(i)}
                    aria-label={`Dönüşüm ${i + 1}`}
                    className="h-1.5 rounded-full transition-all"
                    style={{
                      width: i === idx ? 26 : 8,
                      background: i === idx ? primary : `${text}33`,
                    }}
                  />
                ))}
              </div>
              <div className="ml-auto flex gap-2 sm:hidden">
                <NavBtn onClick={() => go(-1)}>
                  <ArrowLeft className="w-4 h-4" />
                </NavBtn>
                <NavBtn onClick={() => go(1)}>
                  <ArrowRight className="w-4 h-4" />
                </NavBtn>
              </div>
            </div>
          </div>

          {/* Sağ: fotoğraflar */}
          <div className="grid grid-cols-2 gap-1 p-1">
            {[
              { src: active.beforePhoto, label: "Önce", accent: false },
              { src: active.afterPhoto, label: "Sonra", accent: true },
            ].map((ph) => (
              <div
                key={ph.label}
                className="relative overflow-hidden rounded-2xl"
                style={{ aspectRatio: "3 / 4", background: `${text}10` }}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={ph.src}
                  alt={ph.label}
                  className="absolute inset-0 h-full w-full object-cover"
                />
                <span
                  className="absolute top-3 left-3 rounded-md px-3 py-1 text-xs font-bold uppercase tracking-wide"
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
        </div>
      </div>
    </section>
  );
}
