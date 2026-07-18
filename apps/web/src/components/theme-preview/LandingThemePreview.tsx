"use client";

/**
 * CSS-based landing theme preview cards.
 * Shows a mini representation of each landing theme's colors and layout.
 */

interface LandingThemePreviewProps {
  themeId: string;
}

const THEME_STYLES: Record<string, {
  bg: string;
  navBg: string;
  navBorder: string;
  textColor: string;
  mutedColor: string;
  accent: string;
  accentText: string;
  cardBg: string;
  cardBorder: string;
}> = {
  "theme-1": {
    bg: "#0B0B0C",
    navBg: "rgba(11,11,12,0.85)",
    navBorder: "rgba(201,162,77,0.15)",
    textColor: "#F5F3EE",
    mutedColor: "rgba(245,243,238,0.5)",
    accent: "linear-gradient(90deg, #C9A24D 0%, #E6C27A 55%, #A8822E 100%)",
    accentText: "#0B0B0C",
    cardBg: "rgba(18,18,18,0.75)",
    cardBorder: "rgba(201,162,77,0.18)",
  },
  "theme-2": {
    bg: "#0B1628",
    navBg: "rgba(11,22,40,0.8)",
    navBorder: "rgba(62,135,145,0.15)",
    textColor: "#e8f0f8",
    mutedColor: "rgba(196,212,232,0.5)",
    accent: "#3E8791",
    accentText: "#ffffff",
    cardBg: "rgba(20,35,55,0.6)",
    cardBorder: "rgba(62,135,145,0.15)",
  },
  "theme-3": {
    bg: "#F5F6FB",
    navBg: "rgba(245,246,251,0.85)",
    navBorder: "rgba(30,183,180,0.1)",
    textColor: "#262A33",
    mutedColor: "#5A6577",
    accent: "#1EB7B4",
    accentText: "#ffffff",
    cardBg: "#ffffff",
    cardBorder: "rgba(30,183,180,0.15)",
  },
  "theme-4": {
    bg: "#FAF8F5",
    navBg: "rgba(250,248,245,0.88)",
    navBorder: "rgba(62,47,40,0.08)",
    textColor: "#3E2F28",
    mutedColor: "rgba(62,47,40,0.5)",
    accent: "#C75B39",
    accentText: "#ffffff",
    cardBg: "#ffffff",
    cardBorder: "rgba(62,47,40,0.08)",
  },
  "theme-5": {
    bg: "#0A0D14",
    navBg: "rgba(10,13,20,0.85)",
    navBorder: "rgba(46,200,216,0.12)",
    textColor: "#ffffff",
    mutedColor: "rgba(184,196,216,0.5)",
    accent: "linear-gradient(135deg, #2EC8D8 0%, #C4DF44 100%)",
    accentText: "#0A0D14",
    cardBg: "rgba(14,19,32,0.8)",
    cardBorder: "rgba(46,200,216,0.15)",
  },
  "theme-6": {
    bg: "#000000",
    navBg: "rgba(0,0,0,0.85)",
    navBorder: "rgba(255,255,255,0.14)",
    textColor: "#ffffff",
    mutedColor: "rgba(255,255,255,0.55)",
    accent: "linear-gradient(90deg, #ffffff 0%, #cfd6e4 100%)",
    accentText: "#000000",
    cardBg: "rgba(255,255,255,0.05)",
    cardBorder: "rgba(255,255,255,0.14)",
  },
};

export function LandingThemePreview({ themeId }: LandingThemePreviewProps) {
  const s = THEME_STYLES[themeId] || THEME_STYLES["theme-1"];
  const isGradientAccent = s.accent.includes("gradient");

  return (
    <div
      className="relative aspect-[4/5] overflow-hidden rounded-lg"
      style={{ backgroundColor: s.bg }}
    >
      {/* Mini navbar */}
      <div
        className="flex items-center justify-between px-3 py-2"
        style={{ backgroundColor: s.navBg, borderBottom: `1px solid ${s.navBorder}` }}
      >
        <div className="h-1.5 w-10 rounded-full" style={{ backgroundColor: s.textColor, opacity: 0.7 }} />
        <div className="flex gap-1.5">
          <div className="h-1.5 w-6 rounded-full" style={{ backgroundColor: s.mutedColor }} />
          <div className="h-1.5 w-6 rounded-full" style={{ backgroundColor: s.mutedColor }} />
        </div>
      </div>

      {/* Mini hero */}
      <div className="px-3 pt-4 pb-3">
        <div className="h-2 w-20 rounded-full mb-1.5" style={{ backgroundColor: s.textColor, opacity: 0.8 }} />
        <div className="h-2 w-16 rounded-full mb-1.5" style={{ background: isGradientAccent ? s.accent : s.accent, opacity: 0.9 }} />
        <div className="h-1 w-24 rounded-full mt-2" style={{ backgroundColor: s.mutedColor, opacity: 0.5 }} />
        <div className="h-1 w-20 rounded-full mt-1" style={{ backgroundColor: s.mutedColor, opacity: 0.4 }} />
        <div
          className="mt-3 h-4 w-14 rounded-full"
          style={{ background: isGradientAccent ? s.accent : s.accent }}
        />
      </div>

      {/* Mini stats */}
      <div className="mx-3 flex justify-around py-2" style={{ borderTop: `1px solid ${s.navBorder}`, borderBottom: `1px solid ${s.navBorder}` }}>
        {[1, 2, 3].map((i) => (
          <div key={i} className="flex flex-col items-center gap-0.5">
            <div className="h-1.5 w-5 rounded-full" style={{ backgroundColor: s.textColor, opacity: 0.7 }} />
            <div className="h-1 w-4 rounded-full" style={{ backgroundColor: s.mutedColor, opacity: 0.4 }} />
          </div>
        ))}
      </div>

      {/* Mini package cards */}
      <div className="flex gap-1.5 px-3 pt-3">
        {[1, 2, 3].map((i) => (
          <div
            key={i}
            className="flex-1 rounded-md p-1.5"
            style={{ backgroundColor: s.cardBg, border: `1px solid ${s.cardBorder}` }}
          >
            <div className="h-1 w-full rounded-full mb-1" style={{ backgroundColor: s.textColor, opacity: 0.5 }} />
            <div className="h-1.5 w-2/3 rounded-full mb-1.5" style={{ background: isGradientAccent ? s.accent : s.accent, opacity: 0.8 }} />
            <div className="space-y-0.5">
              <div className="h-0.5 w-full rounded-full" style={{ backgroundColor: s.mutedColor, opacity: 0.3 }} />
              <div className="h-0.5 w-full rounded-full" style={{ backgroundColor: s.mutedColor, opacity: 0.3 }} />
            </div>
            <div
              className="mt-1.5 h-2.5 w-full rounded-full"
              style={{ background: isGradientAccent ? s.accent : s.accent }}
            />
          </div>
        ))}
      </div>
    </div>
  );
}
