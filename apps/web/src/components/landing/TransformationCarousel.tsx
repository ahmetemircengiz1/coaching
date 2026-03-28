"use client";

import { useCallback, useEffect, useState } from "react";

export interface TransformationItem {
  id: string;
  clientName: string;
  beforePhoto: string;
  afterPhoto: string;
  duration: string | null;
  description: string | null;
}

interface TransformationCarouselProps {
  items: TransformationItem[];
  /** Interval in ms between auto-advances (default 5000) */
  interval?: number;
  /** Theme variant for styling */
  variant: "dark" | "light" | "warm" | "neon" | "mint";
}

const VARIANTS = {
  dark: {
    bg: "transparent",
    cardBg: "rgba(18,18,18,0.75)",
    cardBorder: "rgba(201,162,77,0.18)",
    text: "#F5F3EE",
    muted: "rgba(245,243,238,0.5)",
    accent: "#E6C27A",
    thumbBorder: "rgba(201,162,77,0.3)",
    thumbActiveBorder: "#E6C27A",
    label: "rgba(245,243,238,0.7)",
    heading: "rgba(201,162,77,0.7)",
  },
  light: {
    bg: "transparent",
    cardBg: "rgba(62,135,145,0.08)",
    cardBorder: "rgba(62,135,145,0.15)",
    text: "#e8f0f8",
    muted: "rgba(196,212,232,0.5)",
    accent: "#5cb8c5",
    thumbBorder: "rgba(62,135,145,0.2)",
    thumbActiveBorder: "#3E8791",
    label: "rgba(196,212,232,0.7)",
    heading: "rgba(62,135,145,0.7)",
  },
  mint: {
    bg: "transparent",
    cardBg: "rgba(255,255,255,0.9)",
    cardBorder: "rgba(30,183,180,0.15)",
    text: "#262A33",
    muted: "#5A6577",
    accent: "#1EB7B4",
    thumbBorder: "rgba(30,183,180,0.2)",
    thumbActiveBorder: "#1EB7B4",
    label: "#5A6577",
    heading: "rgba(30,183,180,0.8)",
  },
  warm: {
    bg: "transparent",
    cardBg: "white",
    cardBorder: "rgba(62,47,40,0.08)",
    text: "#3E2F28",
    muted: "rgba(62,47,40,0.5)",
    accent: "#C75B39",
    thumbBorder: "rgba(62,47,40,0.1)",
    thumbActiveBorder: "#C75B39",
    label: "rgba(62,47,40,0.6)",
    heading: "rgba(199,91,57,0.7)",
  },
  neon: {
    bg: "transparent",
    cardBg: "rgba(14,19,32,0.8)",
    cardBorder: "rgba(46,200,216,0.15)",
    text: "white",
    muted: "rgba(184,196,216,0.5)",
    accent: "#2EC8D8",
    thumbBorder: "rgba(46,200,216,0.15)",
    thumbActiveBorder: "#2EC8D8",
    label: "rgba(184,196,216,0.6)",
    heading: "rgba(46,200,216,0.7)",
  },
};

export function TransformationCarousel({
  items,
  interval = 5000,
  variant,
}: TransformationCarouselProps) {
  const [active, setActive] = useState(0);
  const v = VARIANTS[variant];

  const goTo = useCallback((index: number) => setActive(index), []);

  useEffect(() => {
    if (items.length <= 1) return;
    const timer = setInterval(() => {
      setActive((prev) => (prev + 1) % items.length);
    }, interval);
    return () => clearInterval(timer);
  }, [items.length, interval]);

  if (items.length === 0) return null;

  const current = items[active];

  return (
    <div>
      {/* Main display – before/after side by side */}
      <div
        className="overflow-hidden rounded-2xl border shadow-lg"
        style={{ borderColor: v.cardBorder, backgroundColor: v.cardBg }}
      >
        <div className="grid grid-cols-2">
          {/* Before */}
          <div className="relative">
            <img
              src={current.beforePhoto}
              alt={`${current.clientName} - Önce`}
              className="aspect-[3/4] w-full object-cover"
            />
            <span
              className="absolute bottom-3 left-3 rounded-lg px-3 py-1 text-xs font-bold backdrop-blur-sm"
              style={{ backgroundColor: "rgba(0,0,0,0.6)", color: "white" }}
            >
              Önce
            </span>
          </div>
          {/* After */}
          <div className="relative">
            <img
              src={current.afterPhoto}
              alt={`${current.clientName} - Sonra`}
              className="aspect-[3/4] w-full object-cover"
            />
            <span
              className="absolute bottom-3 right-3 rounded-lg px-3 py-1 text-xs font-bold backdrop-blur-sm"
              style={{ backgroundColor: v.accent, color: "white" }}
            >
              Sonra
            </span>
          </div>
        </div>

        {/* Info bar */}
        <div className="flex items-center justify-between px-5 py-3">
          <div>
            <p className="text-sm font-semibold" style={{ color: v.text }}>
              {current.clientName}
            </p>
            {current.duration && (
              <p className="text-xs" style={{ color: v.muted }}>
                {current.duration}
              </p>
            )}
          </div>
          <p className="text-xs font-medium" style={{ color: v.muted }}>
            {active + 1} / {items.length}
          </p>
        </div>
      </div>

      {/* Thumbnails */}
      {items.length > 1 && (
        <div className="mt-4 flex items-center justify-center gap-2">
          {items.map((item, i) => (
            <button
              key={item.id}
              type="button"
              onClick={() => goTo(i)}
              className="overflow-hidden rounded-lg border-2 transition-all duration-300"
              style={{
                borderColor: i === active ? v.thumbActiveBorder : v.thumbBorder,
                opacity: i === active ? 1 : 0.5,
                transform: i === active ? "scale(1.05)" : "scale(1)",
              }}
            >
              <img
                src={item.afterPhoto}
                alt={item.clientName}
                className="h-14 w-14 object-cover sm:h-16 sm:w-16"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
