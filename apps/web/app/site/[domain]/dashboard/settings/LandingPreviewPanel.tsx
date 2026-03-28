"use client";

import { useCallback, useState } from "react";
import { Monitor, Smartphone, RefreshCw, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";

interface LandingPreviewPanelProps {
  domain: string;
  /** Increment this to force iframe refresh */
  refreshKey?: number;
}

type PreviewDevice = "desktop" | "mobile";

export function LandingPreviewPanel({ domain, refreshKey = 0 }: LandingPreviewPanelProps) {
  const [device, setDevice] = useState<PreviewDevice>("desktop");
  const [internalKey, setInternalKey] = useState(0);

  const iframeSrc = `/site/${domain}?preview=1&t=${refreshKey}-${internalKey}`;

  const handleRefresh = useCallback(() => {
    setInternalKey((k) => k + 1);
  }, []);

  return (
    <div className="flex flex-col h-full rounded-xl border overflow-hidden"
      style={{
        borderColor: "var(--dashboard-card-border)",
        backgroundColor: "var(--dashboard-card-bg)",
      }}
    >
      {/* Toolbar */}
      <div
        className="flex items-center justify-between px-4 py-2 border-b"
        style={{ borderColor: "var(--dashboard-card-border)" }}
      >
        <div className="flex items-center gap-1">
          <button
            type="button"
            onClick={() => setDevice("desktop")}
            className={`p-2 rounded-lg transition-colors ${
              device === "desktop"
                ? "bg-white/10 text-white"
                : "text-white/40 hover:text-white/70"
            }`}
            title="Masaustu"
          >
            <Monitor size={16} />
          </button>
          <button
            type="button"
            onClick={() => setDevice("mobile")}
            className={`p-2 rounded-lg transition-colors ${
              device === "mobile"
                ? "bg-white/10 text-white"
                : "text-white/40 hover:text-white/70"
            }`}
            title="Mobil"
          >
            <Smartphone size={16} />
          </button>
        </div>

        <span className="text-xs font-medium" style={{ color: "var(--dashboard-main-text-muted)" }}>
          Onizleme
        </span>

        <div className="flex items-center gap-1">
          <button
            type="button"
            onClick={handleRefresh}
            className="p-2 rounded-lg text-white/40 hover:text-white/70 transition-colors"
            title="Yenile"
          >
            <RefreshCw size={16} />
          </button>
          <a
            href={`/site/${domain}`}
            target="_blank"
            rel="noreferrer"
            className="p-2 rounded-lg text-white/40 hover:text-white/70 transition-colors"
            title="Yeni sekmede ac"
          >
            <ExternalLink size={16} />
          </a>
        </div>
      </div>

      {/* Preview area */}
      <div className="flex-1 flex items-start justify-center overflow-hidden bg-[#1a1a2e] p-4">
        <div
          className="relative bg-white rounded-lg shadow-2xl overflow-hidden transition-all duration-300"
          style={{
            width: device === "desktop" ? "100%" : "375px",
            height: device === "desktop" ? "100%" : "667px",
            maxWidth: "100%",
          }}
        >
          <iframe
            key={`${refreshKey}-${internalKey}`}
            src={iframeSrc}
            title="Landing Page Onizleme"
            className="w-full h-full border-0"
            style={{ transformOrigin: "top left" }}
          />
        </div>
      </div>
    </div>
  );
}
