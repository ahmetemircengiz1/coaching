"use client";

import { createContext, useContext } from "react";
import { cn } from "@/lib/utils";
import { applyDashboardTheme } from "@/src/theme/applyDashboardTheme";
import type { DashboardThemeDefinition } from "@/src/theme/dashboardThemes";

const DashboardThemeContext = createContext<DashboardThemeDefinition | null>(null);

export function DashboardThemeProvider({
  theme,
  className,
  children,
}: {
  theme: DashboardThemeDefinition;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <DashboardThemeContext.Provider value={theme}>
      <div
        data-dashboard-theme={theme.id}
        className={cn("dashboard-override min-h-screen text-[var(--dashboard-main-text)] bg-[var(--dashboard-main-bg)]", className)}
        style={applyDashboardTheme(theme)}
      >
        {children}
      </div>
    </DashboardThemeContext.Provider>
  );
}

export function useDashboardTheme() {
  const theme = useContext(DashboardThemeContext);
  if (!theme) {
    throw new Error("useDashboardTheme must be used inside DashboardThemeProvider.");
  }

  return theme;
}
