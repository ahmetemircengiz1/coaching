"use client";

import React from "react";
import { useBuilderStore } from "./useBuilderStore";

const COLOR_PALETTES: Array<{
  id: string;
  name: string;
  primary: string;
  background: string;
  text: string;
}> = [
  { id: "vibrant-lime", name: "Canlı Limon", primary: "#ccff00", background: "#050505", text: "#ffffff" },
  { id: "neon-cyan", name: "Neon Mavi", primary: "#00d4ff", background: "#000814", text: "#ffffff" },
  { id: "warm-earth", name: "Sıcak Toprak", primary: "#d4a574", background: "#1a1410", text: "#fff5e6" },
  { id: "premium-gold", name: "Premium Altın", primary: "#c9a961", background: "#0a0a0a", text: "#ffffff" },
  { id: "minimal-orange", name: "Minimal Turuncu", primary: "#ff5733", background: "#fafafa", text: "#0a0a0a" },
  { id: "violet-night", name: "Mor Gece", primary: "#7c3aed", background: "#0f0717", text: "#ffffff" },
  { id: "emerald", name: "Zümrüt", primary: "#10b981", background: "#0a1410", text: "#ffffff" },
  { id: "rose-blush", name: "Pembe Allık", primary: "#f43f5e", background: "#fff8f8", text: "#1a0a0a" },
  { id: "monochrome", name: "Monokrom", primary: "#ffffff", background: "#0a0a0a", text: "#ffffff" },
];

const FONT_PRESETS: Array<{
  id: string;
  name: string;
  heading: string;
  body: string;
  description: string;
}> = [
  { id: "modern-sans", name: "Modern Sans", heading: "Inter, sans-serif", body: "Inter, sans-serif", description: "Temiz, çok yönlü, profesyonel" },
  { id: "editorial-serif", name: "Editöryal Serif", heading: "Playfair Display, serif", body: "Inter, sans-serif", description: "Zarif başlıklar, okunaklı gövde" },
  { id: "luxury-serif", name: "Lüks Serif", heading: "Cormorant Garamond, serif", body: "Inter, sans-serif", description: "Premium, klasik, üst segment" },
  { id: "display-bold", name: "Display Bold", heading: "Anton, sans-serif", body: "Inter, sans-serif", description: "Güçlü, sportif, dikkat çekici" },
  { id: "geometric", name: "Geometrik", heading: "Space Grotesk, sans-serif", body: "Inter, sans-serif", description: "Modern, teknolojik, geometrik" },
  { id: "humanist", name: "İnsancıl", heading: "DM Serif Display, serif", body: "DM Sans, sans-serif", description: "Sıcak, davetkar, güvenilir" },
];

export function GlobalStylePanel() {
  const globalStyles = useBuilderStore((s) => s.config.globalStyles);
  const setGlobalStyles = useBuilderStore((s) => s.setGlobalStyles);

  const gs = globalStyles || {
    primaryColor: "#ccff00",
    backgroundColor: "#050505",
    textColor: "#ffffff",
    fontFamilyHeading: "Inter, sans-serif",
    fontFamilyBody: "Inter, sans-serif",
    borderRadius: "md" as const,
  };

  const applyPalette = (p: typeof COLOR_PALETTES[number]) => {
    setGlobalStyles({
      primaryColor: p.primary,
      backgroundColor: p.background,
      textColor: p.text,
    });
  };

  const applyFont = (f: typeof FONT_PRESETS[number]) => {
    setGlobalStyles({
      fontFamilyHeading: f.heading,
      fontFamilyBody: f.body,
    });
  };

  return (
    <div className="space-y-6 p-4">
      <div>
        <h4 className="text-sm font-semibold mb-1" style={{ color: "var(--dashboard-main-text)" }}>
          Global Stil
        </h4>
        <p className="text-xs" style={{ color: "var(--dashboard-main-text-muted)" }}>
          Tüm bölümler için varsayılan renkler ve yazı tipi. Tek bölüm için override yapmak istersen sol panelden bölüm seç.
        </p>
      </div>

      {/* Renk paletleri */}
      <div>
        <label className="text-xs font-semibold uppercase tracking-wider block mb-2" style={{ color: "var(--dashboard-main-text-muted)" }}>
          Hazır Palet
        </label>
        <div className="grid grid-cols-3 gap-2">
          {COLOR_PALETTES.map((p) => {
            const isActive =
              gs.primaryColor.toLowerCase() === p.primary.toLowerCase() &&
              gs.backgroundColor.toLowerCase() === p.background.toLowerCase();
            return (
              <button
                key={p.id}
                type="button"
                onClick={() => applyPalette(p)}
                className="rounded-lg border p-2 transition hover:scale-[1.02]"
                style={{
                  borderColor: isActive ? "var(--dashboard-accent)" : "var(--dashboard-card-border)",
                  borderWidth: isActive ? 2 : 1,
                  backgroundColor: "var(--dashboard-main-bg)",
                }}
                title={p.name}
              >
                <div className="flex gap-0.5 mb-1.5 h-6 rounded overflow-hidden">
                  <span className="flex-[2]" style={{ backgroundColor: p.background }} />
                  <span className="flex-1" style={{ backgroundColor: p.primary }} />
                  <span className="flex-1" style={{ backgroundColor: p.text }} />
                </div>
                <p className="text-[10px] font-medium truncate" style={{ color: "var(--dashboard-main-text)" }}>
                  {p.name}
                </p>
              </button>
            );
          })}
        </div>
      </div>

      <div className="border-t pt-5" style={{ borderColor: "var(--dashboard-card-border)" }}>
        <label className="text-xs font-semibold uppercase tracking-wider block mb-2" style={{ color: "var(--dashboard-main-text-muted)" }}>
          Özel Renkler
        </label>
        <div className="space-y-3">
          <ColorRow label="Vurgu (buton, link)" value={gs.primaryColor} onChange={(v) => setGlobalStyles({ primaryColor: v })} />
          <ColorRow label="Arkaplan" value={gs.backgroundColor} onChange={(v) => setGlobalStyles({ backgroundColor: v })} />
          <ColorRow label="Metin" value={gs.textColor} onChange={(v) => setGlobalStyles({ textColor: v })} />
        </div>
      </div>

      {/* Font presetleri */}
      <div className="border-t pt-5" style={{ borderColor: "var(--dashboard-card-border)" }}>
        <label className="text-xs font-semibold uppercase tracking-wider block mb-2" style={{ color: "var(--dashboard-main-text-muted)" }}>
          Yazı Tipi Çifti
        </label>
        <div className="space-y-2">
          {FONT_PRESETS.map((f) => {
            const isActive = gs.fontFamilyHeading === f.heading && gs.fontFamilyBody === f.body;
            return (
              <button
                key={f.id}
                type="button"
                onClick={() => applyFont(f)}
                className="w-full text-left rounded-lg border px-3 py-2 transition hover:opacity-90"
                style={{
                  borderColor: isActive ? "var(--dashboard-accent)" : "var(--dashboard-card-border)",
                  borderWidth: isActive ? 2 : 1,
                  backgroundColor: "var(--dashboard-main-bg)",
                }}
              >
                <div className="flex items-baseline justify-between gap-2 mb-0.5">
                  <span className="text-sm font-semibold" style={{ color: "var(--dashboard-main-text)", fontFamily: f.heading }}>
                    {f.name}
                  </span>
                  <span className="text-[10px]" style={{ color: "var(--dashboard-main-text-muted)" }}>
                    {f.heading.split(",")[0]}
                  </span>
                </div>
                <p className="text-[11px]" style={{ color: "var(--dashboard-main-text-muted)" }}>
                  {f.description}
                </p>
              </button>
            );
          })}
        </div>
      </div>

      <div className="border-t pt-5" style={{ borderColor: "var(--dashboard-card-border)" }}>
        <label className="text-xs font-medium block mb-1" style={{ color: "var(--dashboard-main-text-muted)" }}>
          Köşe Yuvarlaklığı
        </label>
        <select
          value={gs.borderRadius}
          onChange={(e) => setGlobalStyles({ borderRadius: e.target.value as typeof gs.borderRadius })}
          className="w-full px-3 py-2 rounded-md text-sm"
          style={{
            backgroundColor: "var(--dashboard-main-bg)",
            color: "var(--dashboard-main-text)",
            border: "1px solid var(--dashboard-card-border)",
          }}
        >
          <option value="none">Yok (kare)</option>
          <option value="sm">Küçük</option>
          <option value="md">Orta</option>
          <option value="lg">Büyük</option>
          <option value="full">Tam yuvarlak</option>
        </select>
      </div>
    </div>
  );
}

function ColorRow({ label, value, onChange }: { label: string; value: string; onChange: (v: string) => void }) {
  return (
    <div>
      <label className="text-xs font-medium block mb-1" style={{ color: "var(--dashboard-main-text-muted)" }}>
        {label}
      </label>
      <div className="flex items-center gap-2">
        <input
          type="color"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="w-10 h-10 rounded border cursor-pointer"
          style={{ borderColor: "var(--dashboard-card-border)", padding: 0 }}
        />
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="flex-1 px-3 py-2 rounded-md text-sm font-mono"
          style={{
            backgroundColor: "var(--dashboard-main-bg)",
            color: "var(--dashboard-main-text)",
            border: "1px solid var(--dashboard-card-border)",
          }}
        />
      </div>
    </div>
  );
}
