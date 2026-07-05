"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { Monitor, Smartphone, RefreshCw, ExternalLink } from "lucide-react";
import { onPreviewRefresh } from "@/src/lib/preview-bus";

interface LandingPreviewPanelProps {
  domain: string;
  refreshKey?: number;
  /** Builder içinden çağrılırken section'lara tıklayıp drawer'da düzenleme modunu aç */
  editMode?: boolean;
}

type PreviewDevice = "desktop" | "mobile";

const DESKTOP_WIDTH = 1280;
const DESKTOP_HEIGHT = 800;
const MOBILE_WIDTH = 375;
const MOBILE_HEIGHT = 667;

export function LandingPreviewPanel({ domain, refreshKey = 0, editMode = false }: LandingPreviewPanelProps) {
  const [device, setDevice] = useState<PreviewDevice>("mobile");
  const [internalKey, setInternalKey] = useState(0);
  const [loading, setLoading] = useState(true);
  const [scale, setScale] = useState(1);
  const viewportRef = useRef<HTMLDivElement>(null);

  const iframeSrc = `/site/${domain}?preview=1${editMode ? "&edit=1" : ""}&t=${refreshKey}-${internalKey}`;

  const handleRefresh = useCallback(() => {
    setLoading(true);
    setInternalKey((k) => k + 1);
  }, []);

  useEffect(() => {
    return onPreviewRefresh(() => {
      setLoading(true);
      setInternalKey((k) => k + 1);
    });
  }, []);

  useEffect(() => {
    const el = viewportRef.current;
    if (!el) return;

    const update = () => {
      const availW = el.clientWidth - 16;
      const availH = el.clientHeight - 16;
      if (availW <= 0 || availH <= 0) return;

      if (device === "desktop") {
        const s = Math.min(availW / DESKTOP_WIDTH, availH / DESKTOP_HEIGHT, 1);
        setScale(s);
      } else {
        const s = Math.min(availW / MOBILE_WIDTH, availH / MOBILE_HEIGHT, 1);
        setScale(s);
      }
    };

    update();
    const ro = new ResizeObserver(update);
    ro.observe(el);
    return () => ro.disconnect();
  }, [device]);

  const frameWidth = device === "desktop" ? DESKTOP_WIDTH : MOBILE_WIDTH;
  const frameHeight = device === "desktop" ? DESKTOP_HEIGHT : MOBILE_HEIGHT;

  return (
    <div
      className="flex flex-col h-full rounded-xl border overflow-hidden"
      style={{
        borderColor: "var(--dashboard-card-border)",
        backgroundColor: "var(--dashboard-card-bg)",
      }}
    >
      <div
        className="flex items-center justify-between px-4 py-2 border-b"
        style={{ borderColor: "var(--dashboard-card-border)" }}
      >
        <div
          className="flex items-center gap-1 rounded-lg p-1"
          style={{ backgroundColor: "var(--dashboard-main-bg)" }}
        >
          <button
            type="button"
            onClick={() => setDevice("mobile")}
            className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-semibold transition-colors"
            style={{
              backgroundColor: device === "mobile" ? "var(--dashboard-accent)" : "transparent",
              color: device === "mobile" ? "var(--dashboard-accent-text)" : "var(--dashboard-main-text-muted)",
            }}
            title="Mobil"
          >
            <Smartphone size={14} />
            Mobil
          </button>
          <button
            type="button"
            onClick={() => setDevice("desktop")}
            className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-semibold transition-colors"
            style={{
              backgroundColor: device === "desktop" ? "var(--dashboard-accent)" : "transparent",
              color: device === "desktop" ? "var(--dashboard-accent-text)" : "var(--dashboard-main-text-muted)",
            }}
            title="Web"
          >
            <Monitor size={14} />
            Web
          </button>
        </div>

        <div className="flex items-center gap-1">
          <button
            type="button"
            onClick={handleRefresh}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium transition-colors hover:opacity-80"
            style={{
              backgroundColor: "var(--dashboard-main-bg)",
              color: "var(--dashboard-main-text)",
              border: "1px solid var(--dashboard-card-border)",
            }}
            title="Yenile"
          >
            <RefreshCw size={13} className={loading ? "animate-spin" : ""} />
            Yenile
          </button>

          <a
            href={`/site/${domain}`}
            target="_blank"
            rel="noreferrer"
            className="p-2 rounded-md transition-colors hover:opacity-70"
            style={{ color: "var(--dashboard-main-text-muted)" }}
            title="Yeni sekmede aç"
          >
            <ExternalLink size={15} />
          </a>
        </div>
      </div>

      <div
        ref={viewportRef}
        className="flex-1 flex items-start justify-center overflow-hidden p-2 relative"
        style={{ backgroundColor: "var(--dashboard-main-bg)" }}
      >
        {loading && (
          <div
            className="absolute inset-0 flex items-center justify-center z-10"
            style={{ backgroundColor: "var(--dashboard-main-bg)" }}
          >
            <div className="flex flex-col items-center gap-3">
              <div
                className="w-6 h-6 border-2 rounded-full animate-spin"
                style={{
                  borderColor: "var(--dashboard-card-border)",
                  borderTopColor: "var(--dashboard-accent)",
                }}
              />
              <span className="text-xs" style={{ color: "var(--dashboard-main-text-muted)" }}>
                Yükleniyor...
              </span>
            </div>
          </div>
        )}
        <div
          style={{
            width: frameWidth * scale,
            height: frameHeight * scale,
          }}
        >
          <div
            className="bg-white rounded-lg shadow-2xl overflow-hidden"
            style={{
              width: frameWidth,
              height: frameHeight,
              transform: `scale(${scale})`,
              transformOrigin: "top left",
            }}
          >
            <iframe
              key={`${refreshKey}-${internalKey}`}
              src={iframeSrc}
              title="Landing Page Önizleme"
              className="border-0"
              style={{ width: frameWidth, height: frameHeight }}
              onLoad={() => setLoading(false)}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
