"use client";

import React from "react";
import { X, Sparkles } from "lucide-react";
import type { PlanTier } from "@/src/components/landing/blocks/manifest-meta";

interface UpgradeModalProps {
  open: boolean;
  onClose: () => void;
  requiredTier: PlanTier;
  blockName?: string;
}

const TIER_LABELS: Record<PlanTier, string> = {
  starter: "Başlangıç",
  pro: "PRO",
  elite: "ELITE",
};

const TIER_FEATURES: Record<PlanTier, string[]> = {
  starter: [
    "Hazır 2 tema",
    "Standart kayıt sistemi",
    "Temel destek",
  ],
  pro: [
    "6 hazır tema",
    "Tüm bölüm varyantları",
    "Bölümleri yeniden sırala",
    "Google Fonts seçimi",
    "SSS bölümü",
  ],
  elite: [
    "Section Builder (yeni)",
    "70+ bölüm tasarımı",
    "Sürükle-bırak düzenleme",
    "Bölüm bazlı renk override",
    "Animasyon kontrolleri",
    "Sınırsız özelleştirme",
  ],
};

export function UpgradeModal({ open, onClose, requiredTier, blockName }: UpgradeModalProps) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm" onClick={onClose}>
      <div
        className="w-full max-w-md rounded-2xl border shadow-2xl overflow-hidden"
        style={{ backgroundColor: "var(--dashboard-card-bg)", borderColor: "var(--dashboard-card-border)" }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="px-6 py-5 border-b relative" style={{ borderColor: "var(--dashboard-card-border)" }}>
          <button
            type="button"
            onClick={onClose}
            className="absolute top-3 right-3 p-1.5 rounded hover:bg-black/5 dark:hover:bg-white/5"
            aria-label="Kapat"
          >
            <X className="w-4 h-4" style={{ color: "var(--dashboard-main-text)" }} />
          </button>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full flex items-center justify-center" style={{ backgroundColor: "rgba(204,255,0,0.15)" }}>
              <Sparkles className="w-5 h-5" style={{ color: "#ccff00" }} />
            </div>
            <div>
              <div className="text-xs uppercase tracking-wider" style={{ color: "var(--dashboard-main-text-muted)" }}>
                {TIER_LABELS[requiredTier]} özelliği
              </div>
              <h3 className="text-lg font-bold" style={{ color: "var(--dashboard-main-text)" }}>
                {blockName ? `"${blockName}" için yükseltme gerek` : "Bu özellik için yükseltme gerek"}
              </h3>
            </div>
          </div>
        </div>

        <div className="px-6 py-5 space-y-4">
          <p className="text-sm leading-relaxed" style={{ color: "var(--dashboard-main-text-muted)" }}>
            Bu blok {TIER_LABELS[requiredTier]} planında kullanılabilir. Yükselttiğinde:
          </p>
          <ul className="space-y-2">
            {TIER_FEATURES[requiredTier].map((feature) => (
              <li key={feature} className="flex items-start gap-2 text-sm" style={{ color: "var(--dashboard-main-text)" }}>
                <span style={{ color: "#10b981" }}>✓</span>
                {feature}
              </li>
            ))}
          </ul>
        </div>

        <div className="px-6 py-4 border-t flex gap-2" style={{ borderColor: "var(--dashboard-card-border)" }}>
          <button
            type="button"
            onClick={onClose}
            className="flex-1 px-3 py-2 rounded-md text-sm font-medium border"
            style={{
              backgroundColor: "var(--dashboard-main-bg)",
              color: "var(--dashboard-main-text)",
              borderColor: "var(--dashboard-card-border)",
            }}
          >
            Şimdilik geç
          </button>
          <a
            href="/platform/pricing"
            target="_blank"
            rel="noreferrer"
            className="flex-1 px-3 py-2 rounded-md text-sm font-bold text-center"
            style={{ backgroundColor: "var(--dashboard-accent)", color: "var(--dashboard-accent-text)" }}
          >
            Planları Gör
          </a>
        </div>
      </div>
    </div>
  );
}
