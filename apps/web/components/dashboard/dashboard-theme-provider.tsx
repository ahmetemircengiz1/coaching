"use client";

import { createContext, useContext } from "react";
import type { DashboardTheme } from "@/lib/templates/dashboard-themes";

const ThemeContext = createContext<DashboardTheme | null>(null);

export function DashboardThemeProvider({
  theme,
  children,
}: {
  theme: DashboardTheme;
  children: React.ReactNode;
}) {
  return (
    <ThemeContext.Provider value={theme}>
      <div
        style={{
          // CSS custom properties for theme colors
          "--sidebar-bg": theme.sidebarBg,
          "--sidebar-border": theme.sidebarBorder,
          "--sidebar-text": theme.sidebarText,
          "--sidebar-text-muted": theme.sidebarTextMuted,
          "--sidebar-hover": theme.sidebarHover,
          "--sidebar-active": theme.sidebarActive,
          "--sidebar-active-text": theme.sidebarActiveText,
          "--header-bg": theme.headerBg,
          "--header-border": theme.headerBorder,
          "--main-bg": theme.mainBg,
          "--main-text": theme.mainText,
          "--main-text-muted": theme.mainTextMuted,
          "--card-bg": theme.cardBg,
          "--card-border": theme.cardBorder,
          "--accent": theme.accent,
          "--accent-text": theme.accentText,
          "--mobile-bg": theme.mobileBg,
        } as React.CSSProperties}
      >
        {children}
      </div>
    </ThemeContext.Provider>
  );
}

export function useDashboardTheme(): DashboardTheme {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error("useDashboardTheme must be used within DashboardThemeProvider");
  return ctx;
}
