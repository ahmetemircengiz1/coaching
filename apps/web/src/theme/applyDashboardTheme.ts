import type { CSSProperties } from "react";
import type { DashboardThemeDefinition } from "./dashboardThemes";

export type DashboardThemeStyle = CSSProperties &
  Record<
    | "--dashboard-sidebar-bg"
    | "--dashboard-sidebar-border"
    | "--dashboard-sidebar-text"
    | "--dashboard-sidebar-text-muted"
    | "--dashboard-sidebar-hover"
    | "--dashboard-sidebar-active"
    | "--dashboard-sidebar-active-text"
    | "--dashboard-header-bg"
    | "--dashboard-header-border"
    | "--dashboard-main-bg"
    | "--dashboard-main-text"
    | "--dashboard-main-text-muted"
    | "--dashboard-card-bg"
    | "--dashboard-card-border"
    | "--dashboard-accent"
    | "--dashboard-accent-text"
    | "--dashboard-mobile-bg"
    | "--dashboard-chart-primary"
    | "--dashboard-chart-secondary"
    | "--sidebar-bg"
    | "--sidebar-border"
    | "--sidebar-text"
    | "--sidebar-text-muted"
    | "--sidebar-hover"
    | "--sidebar-active"
    | "--sidebar-active-text"
    | "--header-bg"
    | "--header-border"
    | "--main-bg"
    | "--main-text"
    | "--main-text-muted"
    | "--card-bg"
    | "--card-border"
    | "--accent"
    | "--accent-text"
    | "--mobile-bg"
    // New design properties
    | "--dashboard-card-radius"
    | "--dashboard-card-shadow"
    | "--dashboard-glass-effect"
    | "--dashboard-glass-bg",
    string
  >;

export function applyDashboardTheme(
  theme: DashboardThemeDefinition
): DashboardThemeStyle {
  return {
    "--dashboard-sidebar-bg": theme.sidebarBg,
    "--dashboard-sidebar-border": theme.sidebarBorder,
    "--dashboard-sidebar-text": theme.sidebarText,
    "--dashboard-sidebar-text-muted": theme.sidebarTextMuted,
    "--dashboard-sidebar-hover": theme.sidebarHover,
    "--dashboard-sidebar-active": theme.sidebarActive,
    "--dashboard-sidebar-active-text": theme.sidebarActiveText,
    "--dashboard-header-bg": theme.headerBg,
    "--dashboard-header-border": theme.headerBorder,
    "--dashboard-main-bg": theme.mainBg,
    "--dashboard-main-text": theme.mainText,
    "--dashboard-main-text-muted": theme.mainTextMuted,
    "--dashboard-card-bg": theme.cardBg,
    "--dashboard-card-border": theme.cardBorder,
    "--dashboard-accent": theme.accent,
    "--dashboard-accent-text": theme.accentText,
    "--dashboard-mobile-bg": theme.mobileBg,
    "--dashboard-chart-primary": theme.chartPrimary,
    "--dashboard-chart-secondary": theme.chartSecondary,
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

    // Design Tokens
    "--dashboard-card-radius": theme.cardRadius,
    "--dashboard-card-shadow": theme.cardShadow,
    "--dashboard-glass-effect": theme.glassEffect ? "blur(12px)" : "none",
    "--dashboard-glass-bg": theme.glassBg,
  };
}
