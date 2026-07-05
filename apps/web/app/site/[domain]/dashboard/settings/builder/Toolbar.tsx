"use client";

import React, { useState } from "react";
import { Undo2, Redo2, RotateCcw, ExternalLink, Check, Loader2, AlertCircle, Sparkles } from "lucide-react";
import { useBuilderStore, useBuilderTemporal } from "./useBuilderStore";
import type { SaveStatus } from "./useAutoSave";
import { DEFAULT_ELITE_CONFIG } from "@/src/components/landing/elite-config";
import { TemplatePicker } from "./TemplatePicker";

interface ToolbarProps {
  domain: string;
  saveStatus: SaveStatus;
}

export function Toolbar({ domain, saveStatus }: ToolbarProps) {
  const undo = useBuilderTemporal((s) => s.undo);
  const redo = useBuilderTemporal((s) => s.redo);
  const pastStates = useBuilderTemporal((s) => s.pastStates);
  const futureStates = useBuilderTemporal((s) => s.futureStates);
  const setConfig = useBuilderStore((s) => s.setConfig);
  const [templateOpen, setTemplateOpen] = useState(false);

  const canUndo = pastStates.length > 0;
  const canRedo = futureStates.length > 0;

  const handleReset = () => {
    if (!confirm("Tüm bölümleri varsayılana sıfırla? Bu işlem geri alınabilir (Cmd/Ctrl+Z).")) return;
    setConfig(JSON.parse(JSON.stringify(DEFAULT_ELITE_CONFIG)));
  };

  return (
    <>
      <div className="flex items-center justify-between gap-3 px-4 py-2 border-b" style={{ borderColor: "var(--dashboard-card-border)", backgroundColor: "var(--dashboard-card-bg)" }}>
        <div className="flex items-center gap-2">
          <h3 className="text-sm font-semibold" style={{ color: "var(--dashboard-main-text)" }}>
            Section Builder
          </h3>
          <SaveIndicator status={saveStatus} />
        </div>
        <div className="flex items-center gap-1">
          <button
            type="button"
            onClick={() => setTemplateOpen(true)}
            className="inline-flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-md font-medium border hover:opacity-80 transition"
            style={{
              borderColor: "var(--dashboard-card-border)",
              color: "var(--dashboard-main-text)",
              backgroundColor: "var(--dashboard-main-bg)",
            }}
            title="Hazır şablon seç"
          >
            <Sparkles className="w-3.5 h-3.5" />
            Şablon Galerisi
          </button>
          <div className="w-px h-5 mx-1" style={{ backgroundColor: "var(--dashboard-card-border)" }} />
          <ToolbarButton onClick={() => undo()} disabled={!canUndo} title="Geri al (Ctrl+Z)" aria-label="Geri al">
            <Undo2 className="w-4 h-4" />
          </ToolbarButton>
          <ToolbarButton onClick={() => redo()} disabled={!canRedo} title="Yinele (Ctrl+Shift+Z)" aria-label="Yinele">
            <Redo2 className="w-4 h-4" />
          </ToolbarButton>
          <div className="w-px h-5 mx-1" style={{ backgroundColor: "var(--dashboard-card-border)" }} />
          <ToolbarButton onClick={handleReset} title="Varsayılana sıfırla" aria-label="Sıfırla">
            <RotateCcw className="w-4 h-4" />
          </ToolbarButton>
          <a
            href={`/site/${domain}`}
            target="_blank"
            rel="noreferrer"
            className="ml-2 inline-flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-md font-semibold hover:opacity-80"
            style={{ backgroundColor: "var(--dashboard-accent)", color: "var(--dashboard-accent-text)" }}
          >
            Canlıda Gör <ExternalLink className="w-3 h-3" />
          </a>
        </div>
      </div>
      <TemplatePicker open={templateOpen} onClose={() => setTemplateOpen(false)} />
    </>
  );
}

function ToolbarButton({
  children,
  ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement> & { children: React.ReactNode }) {
  return (
    <button
      type="button"
      className="p-2 rounded-md transition-colors disabled:opacity-30 disabled:cursor-not-allowed hover:bg-black/5 dark:hover:bg-white/5"
      style={{ color: "var(--dashboard-main-text)" }}
      {...props}
    >
      {children}
    </button>
  );
}

function SaveIndicator({ status }: { status: SaveStatus }) {
  const map = {
    idle: { icon: null, text: "" },
    pending: { icon: <Loader2 className="w-3 h-3 animate-spin" />, text: "Bekliyor..." },
    saving: { icon: <Loader2 className="w-3 h-3 animate-spin" />, text: "Kaydediliyor..." },
    saved: { icon: <Check className="w-3 h-3" />, text: "Kaydedildi" },
    error: { icon: <AlertCircle className="w-3 h-3" />, text: "Hata!" },
  } as const;
  const cur = map[status];
  if (!cur.text) return null;
  return (
    <span
      className="inline-flex items-center gap-1 text-xs px-2 py-0.5 rounded"
      style={{
        color: status === "error" ? "#ef4444" : status === "saved" ? "#10b981" : "var(--dashboard-main-text-muted)",
        backgroundColor: "var(--dashboard-main-bg)",
      }}
    >
      {cur.icon}
      {cur.text}
    </span>
  );
}
