"use client";

import React from "react";
import { X, Sparkles } from "lucide-react";
import { BUILDER_TEMPLATES, instantiateTemplate, type BuilderTemplate } from "@/src/components/landing/builder/templates";
import { useBuilderStore } from "./useBuilderStore";
import { BlockThumbnail } from "./BlockThumbnail";
import { getBlock } from "@/src/components/landing/blocks/manifest";

interface TemplatePickerProps {
  open: boolean;
  onClose: () => void;
}

export function TemplatePicker({ open, onClose }: TemplatePickerProps) {
  const setConfig = useBuilderStore((s) => s.setConfig);

  if (!open) return null;

  const handleApply = (template: BuilderTemplate) => {
    const ok = window.confirm(
      `"${template.name}" şablonu yüklenecek. Mevcut bölüm yapın bununla değişecek (Cmd/Ctrl+Z ile geri alabilirsin). Devam?`
    );
    if (!ok) return;
    setConfig(instantiateTemplate(template));
    onClose();
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ backgroundColor: "rgba(0,0,0,0.7)", backdropFilter: "blur(4px)" }}
      onClick={onClose}
    >
      <div
        className="w-full max-w-5xl max-h-[85vh] rounded-xl border overflow-hidden flex flex-col"
        style={{
          backgroundColor: "var(--dashboard-card-bg)",
          borderColor: "var(--dashboard-card-border)",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div
          className="flex items-center justify-between px-6 py-4 border-b"
          style={{ borderColor: "var(--dashboard-card-border)" }}
        >
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5" style={{ color: "var(--dashboard-accent)" }} />
            <h2 className="text-lg font-semibold" style={{ color: "var(--dashboard-main-text)" }}>
              Hazır Şablon Galerisi
            </h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1 rounded hover:opacity-70"
            style={{ color: "var(--dashboard-main-text-muted)" }}
            aria-label="Kapat"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="px-6 py-3 border-b" style={{ borderColor: "var(--dashboard-card-border)" }}>
          <p className="text-sm" style={{ color: "var(--dashboard-main-text-muted)" }}>
            Bir şablon seçtiğinde tüm bölümler bu yapıyla değişir. Sonra her bölümü dilediğin gibi düzenleyebilirsin.
            Yanlış seçtiysen geri almak için <kbd className="text-xs px-1.5 py-0.5 rounded border" style={{ borderColor: "var(--dashboard-card-border)" }}>Ctrl+Z</kbd> kullan.
          </p>
        </div>

        {/* Grid */}
        <div className="flex-1 overflow-y-auto p-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {BUILDER_TEMPLATES.map((template) => {
              const heroBlock = getBlock(template.previewHeroBlockId);
              return (
                <button
                  key={template.id}
                  type="button"
                  onClick={() => handleApply(template)}
                  className="group text-left rounded-xl border overflow-hidden transition-all hover:scale-[1.01] hover:shadow-lg"
                  style={{
                    borderColor: "var(--dashboard-card-border)",
                    backgroundColor: "var(--dashboard-main-bg)",
                  }}
                >
                  {/* Thumbnail (hero block of template) */}
                  <div
                    className="aspect-[16/9] relative overflow-hidden"
                    style={{ backgroundColor: template.config.globalStyles?.backgroundColor || "#000" }}
                  >
                    {heroBlock ? (
                      <BlockThumbnail block={heroBlock} className="w-full h-full" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-white/30 text-xs font-mono">
                        {template.previewHeroBlockId}
                      </div>
                    )}
                    {/* Renk şeridi */}
                    <div
                      className="absolute bottom-0 left-0 right-0 h-1.5"
                      style={{ backgroundColor: template.config.globalStyles?.primaryColor || "#ccff00" }}
                    />
                  </div>

                  {/* Body */}
                  <div className="p-4">
                    <h3
                      className="text-sm font-semibold mb-1"
                      style={{ color: "var(--dashboard-main-text)" }}
                    >
                      {template.name}
                    </h3>
                    <p
                      className="text-xs leading-relaxed mb-3"
                      style={{ color: "var(--dashboard-main-text-muted)" }}
                    >
                      {template.description}
                    </p>
                    <div className="flex items-center justify-between">
                      <div className="flex gap-1">
                        {/* Color swatches */}
                        <span
                          className="inline-block w-3 h-3 rounded-full border border-white/10"
                          style={{ backgroundColor: template.config.globalStyles?.primaryColor || "#ccff00" }}
                          title="Vurgu"
                        />
                        <span
                          className="inline-block w-3 h-3 rounded-full border border-white/10"
                          style={{ backgroundColor: template.config.globalStyles?.backgroundColor || "#000" }}
                          title="Arkaplan"
                        />
                        <span
                          className="inline-block w-3 h-3 rounded-full border border-white/10"
                          style={{ backgroundColor: template.config.globalStyles?.textColor || "#fff" }}
                          title="Metin"
                        />
                      </div>
                      <span
                        className="text-[10px] font-mono"
                        style={{ color: "var(--dashboard-main-text-muted)" }}
                      >
                        {template.config.sections.length} bölüm
                      </span>
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
