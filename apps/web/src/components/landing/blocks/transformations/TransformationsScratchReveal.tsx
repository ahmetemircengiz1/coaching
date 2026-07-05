"use client";

import React, { useEffect, useRef, useState } from "react";
import type { LandingThemeContent, LandingTransformation } from "../../types";
import type { EliteGlobalStyles } from "../../elite-config";
import { Plus, ArrowLeft, ArrowRight } from "lucide-react";

/**
 * TransformationsScratchReveal — progrex esinli.
 *
 * Solda büyük bir "kazı-çıkar" kartı: önce fotoğrafı bir canvas üzerine
 * çizilir; imleç fotoğrafın üzerinde gezdirildikçe önce fotoğrafı silinir ve
 * altından sonra fotoğrafı ortaya çıkar. Sağda ölçüm kutuları (kilo & vücut
 * yağı). Oklarla danışanlar arasında gezilir. (Tasarım yalnız dönüşüme
 * odaklanır; danışan yorumu içermez.)
 *
 * Ölçüm bilgileri koç panelinden (Dönüşüm Hikayeleri ayarları) girilir.
 *
 * inspiredBy: https://progrex.framer.website/
 */

function fmtMetric(
  before: string | null | undefined,
  after: string | null | undefined,
  lossLabel: string,
  resultLabel: string
): { value: string; label: string } | null {
  const a = (after || "").trim();
  const b = (before || "").trim();
  const numA = parseFloat(a.replace(",", "."));
  const numB = parseFloat(b.replace(",", "."));
  if (Number.isFinite(numA) && Number.isFinite(numB) && numB > numA) {
    const unit = a.replace(/[\d.,\s]/g, "");
    const d = Math.round((numB - numA) * 10) / 10;
    return { value: `−${d}${unit}`, label: lossLabel };
  }
  if (a) return { value: a, label: resultLabel };
  return null;
}

export function TransformationsScratchReveal({
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
  const [scratched, setScratched] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const wrapRef = useRef<HTMLDivElement>(null);

  const active: LandingTransformation | undefined = transforms.length
    ? transforms[idx % transforms.length]
    : undefined;
  const beforeSrc = active?.beforePhoto;

  useEffect(() => {
    setScratched(false);
    const canvas = canvasRef.current;
    const wrap = wrapRef.current;
    if (!canvas || !wrap || !beforeSrc) return;
    const w = wrap.clientWidth;
    const h = wrap.clientHeight;
    if (!w || !h) return;
    canvas.width = w;
    canvas.height = h;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    const img = new Image();
    img.onload = () => {
      const ir = img.width / img.height;
      const cr = w / h;
      let dw: number, dh: number, dx: number, dy: number;
      if (ir > cr) {
        dh = h;
        dw = h * ir;
        dx = (w - dw) / 2;
        dy = 0;
      } else {
        dw = w;
        dh = w / ir;
        dx = 0;
        dy = (h - dh) / 2;
      }
      ctx.globalCompositeOperation = "source-over";
      ctx.clearRect(0, 0, w, h);
      ctx.drawImage(img, dx, dy, dw, dh);
    };
    img.src = beforeSrc;
  }, [beforeSrc]);

  if (!active) return null;

  const primary = config?.primaryColor || "#2563eb";
  const bg = config?.backgroundColor || "#0a0a0a";
  const text = config?.textColor || "#ffffff";
  const headingFont = 'var(--font-oswald), "Arial Narrow", sans-serif';

  const n = transforms.length;
  const go = (d: number) => setIdx((p) => (p + d + n) % n);

  const erase = (e: React.PointerEvent) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    const rect = canvas.getBoundingClientRect();
    const x = (e.clientX - rect.left) * (canvas.width / rect.width);
    const y = (e.clientY - rect.top) * (canvas.height / rect.height);
    ctx.globalCompositeOperation = "destination-out";
    ctx.beginPath();
    ctx.arc(x, y, 46, 0, Math.PI * 2);
    ctx.fill();
    if (!scratched) setScratched(true);
  };

  // Tüm bilgileri yan panele toparla — sadece "son kilo" değil koçun girdiği her şey.
  const customStats = ((active as unknown as { customStats?: { label?: string; value?: string }[] | null }).customStats || [])
    .filter((s): s is { label: string; value: string } => Boolean(s?.label?.trim() && s?.value?.trim()));

  const metrics: { value: string; label: string }[] = [];
  const weightMetric = fmtMetric(active.weightBefore, active.weightAfter, "Kilo kaybı", "Sonuç kilo");
  if (weightMetric) metrics.push(weightMetric);
  const bodyFatMetric = fmtMetric(active.bodyFatBefore, active.bodyFatAfter, "Yağ oranı düşüşü", "Vücut yağı");
  if (bodyFatMetric) metrics.push(bodyFatMetric);
  if (active.duration?.trim()) metrics.push({ value: active.duration, label: "Süre" });
  if (active.age?.trim()) metrics.push({ value: active.age, label: "Yaş" });
  if (active.role?.trim()) metrics.push({ value: active.role, label: "Meslek / Rol" });
  for (const cs of customStats) metrics.push({ value: cs.value, label: cs.label });

  const card = `${text}0a`;
  const border = `${text}1f`;

  return (
    <section className="py-24 sm:py-32 px-6" style={{ backgroundColor: bg }}>
      <div className="mx-auto max-w-6xl">
        {/* Üst başlık */}
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <span
              className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-[0.2em]"
              style={{ color: primary }}
            >
              <Plus className="h-3.5 w-3.5" strokeWidth={3} />
              {texts?.transformationsTitle || "Dönüşüm"}
            </span>
            <h2
              className="mt-2 font-extrabold"
              style={{
                fontFamily: headingFont,
                color: text,
                fontSize: "clamp(2rem, 4.5vw, 3.4rem)",
                lineHeight: 1,
              }}
            >
              {active.clientName}
            </h2>
          </div>
          {/* Süre artık yan paneldeki metrik kartlarında gösteriliyor */}
        </div>

        {/* İçerik */}
        <div
          className={`mt-8 grid gap-5${
            metrics.length > 0 ? " md:grid-cols-2" : ""
          }`}
        >
          {/* Sol: kazı-çıkar kartı */}
          <div
            ref={wrapRef}
            className={`relative overflow-hidden rounded-3xl${
              metrics.length > 0 ? "" : " mx-auto w-full max-w-md"
            }`}
            style={{ aspectRatio: "4 / 5", background: card }}
          >
            {/* Sonra fotoğrafı (altta) */}
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={active.afterPhoto}
              alt="Sonra"
              draggable={false}
              className="absolute inset-0 h-full w-full object-cover"
            />
            {/* Önce fotoğrafı — canvas (kazınır) */}
            <canvas
              ref={canvasRef}
              onPointerDown={erase}
              onPointerMove={erase}
              className="absolute inset-0 h-full w-full touch-none"
              style={{ cursor: "crosshair" }}
            />
            {/* İpucu */}
            <div
              className="pointer-events-none absolute inset-x-0 bottom-0 flex justify-center pb-5 transition-opacity duration-500"
              style={{ opacity: scratched ? 0 : 1 }}
            >
              <span
                className="rounded-full px-4 py-1.5 text-xs font-bold uppercase tracking-wider backdrop-blur-md"
                style={{ background: "rgba(0,0,0,0.55)", color: "#fff" }}
              >
                Ortaya çıkarmak için kazı
              </span>
            </div>
          </div>

          {/* Sağ: tüm bilgi kartları — 1 veya 2 metrikte tek kolon, 3+ metrikte 2 kolon */}
          {metrics.length > 0 && (
            <div
              className={`grid gap-4 content-center ${
                metrics.length > 2 ? "grid-cols-2" : "grid-cols-1"
              }`}
            >
              {metrics.map((m, i) => {
                const compact = metrics.length > 2;
                return (
                  <div
                    key={`${m.label}-${i}`}
                    className={`rounded-3xl border ${compact ? "p-5" : "p-8"}`}
                    style={{ background: card, borderColor: border }}
                  >
                    <div
                      className="font-extrabold break-words"
                      style={{
                        fontFamily: headingFont,
                        color: text,
                        fontSize: compact
                          ? "clamp(1.5rem, 3vw, 2.2rem)"
                          : "clamp(2.6rem, 5vw, 3.8rem)",
                        lineHeight: 1.05,
                      }}
                    >
                      {m.value}
                    </div>
                    <div
                      className={`${compact ? "mt-1.5 text-[10px]" : "mt-2 text-xs"} uppercase tracking-wider`}
                      style={{ color: `${text}80` }}
                    >
                      {m.label}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Gezinme */}
        {n > 1 && (
          <div className="mt-8 flex items-center justify-center gap-4">
            <button
              type="button"
              onClick={() => go(-1)}
              aria-label="Önceki"
              className="inline-flex h-11 w-11 items-center justify-center rounded-full border transition-colors"
              style={{ borderColor: border, color: text }}
            >
              <ArrowLeft className="h-5 w-5" />
            </button>
            <div className="flex gap-2">
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
            <button
              type="button"
              onClick={() => go(1)}
              aria-label="Sonraki"
              className="inline-flex h-11 w-11 items-center justify-center rounded-full border transition-colors"
              style={{ borderColor: border, color: text }}
            >
              <ArrowRight className="h-5 w-5" />
            </button>
          </div>
        )}
      </div>
    </section>
  );
}
