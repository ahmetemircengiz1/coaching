// Dashboard tema tanımları
// Her tema sidebar, header, main area ve accent renklerini belirler

export interface DashboardTheme {
  id: string;
  // Sidebar
  sidebarBg: string;
  sidebarBorder: string;
  sidebarText: string;
  sidebarTextMuted: string;
  sidebarHover: string;
  sidebarActive: string;
  sidebarActiveText: string;
  // Header
  headerBg: string;
  headerBorder: string;
  // Main content area
  mainBg: string;
  mainText: string;
  mainTextMuted: string;
  // Cards
  cardBg: string;
  cardBorder: string;
  // Accent
  accent: string;
  accentText: string; // text color on accent bg
  // Mobile header
  mobileBg: string;
  // Mode
  mode: "dark" | "light";
}

export const DASHBOARD_THEMES: Record<string, DashboardTheme> = {
  "dark-teal": {
    id: "dark-teal",
    sidebarBg: "#111827",
    sidebarBorder: "rgba(255,255,255,0.1)",
    sidebarText: "rgba(255,255,255,0.6)",
    sidebarTextMuted: "rgba(255,255,255,0.4)",
    sidebarHover: "rgba(255,255,255,0.05)",
    sidebarActive: "rgba(255,255,255,0.1)",
    sidebarActiveText: "#ffffff",
    headerBg: "#0f172a",
    headerBorder: "rgba(255,255,255,0.1)",
    mainBg: "#030712",
    mainText: "#ffffff",
    mainTextMuted: "rgba(255,255,255,0.6)",
    cardBg: "#111827",
    cardBorder: "rgba(255,255,255,0.1)",
    accent: "#14b8a6",
    accentText: "#000000",
    mobileBg: "#0f172a",
    mode: "dark",
  },
  "dark-gold": {
    id: "dark-gold",
    sidebarBg: "#0a0a0a",
    sidebarBorder: "rgba(255,255,255,0.08)",
    sidebarText: "rgba(255,255,255,0.6)",
    sidebarTextMuted: "rgba(255,255,255,0.35)",
    sidebarHover: "rgba(255,255,255,0.05)",
    sidebarActive: "rgba(204,255,0,0.1)",
    sidebarActiveText: "#ccff00",
    headerBg: "#0a0a0a",
    headerBorder: "rgba(255,255,255,0.08)",
    mainBg: "#000000",
    mainText: "#ffffff",
    mainTextMuted: "rgba(255,255,255,0.5)",
    cardBg: "#0a0a0a",
    cardBorder: "rgba(255,255,255,0.08)",
    accent: "#ccff00",
    accentText: "#000000",
    mobileBg: "#0a0a0a",
    mode: "dark",
  },
  "light-gold": {
    id: "light-gold",
    sidebarBg: "#ffffff",
    sidebarBorder: "#e5e7eb",
    sidebarText: "#374151",
    sidebarTextMuted: "#9ca3af",
    sidebarHover: "#f3f4f6",
    sidebarActive: "#fef3c7",
    sidebarActiveText: "#92400e",
    headerBg: "#ffffff",
    headerBorder: "#e5e7eb",
    mainBg: "#f9fafb",
    mainText: "#111827",
    mainTextMuted: "#6b7280",
    cardBg: "#ffffff",
    cardBorder: "#e5e7eb",
    accent: "#f59e0b",
    accentText: "#ffffff",
    mobileBg: "#ffffff",
    mode: "light",
  },
  "dark-orange": {
    id: "dark-orange",
    sidebarBg: "#1a1a2e",
    sidebarBorder: "rgba(255,255,255,0.08)",
    sidebarText: "rgba(255,255,255,0.6)",
    sidebarTextMuted: "rgba(255,255,255,0.35)",
    sidebarHover: "rgba(255,255,255,0.05)",
    sidebarActive: "rgba(249,115,22,0.15)",
    sidebarActiveText: "#fb923c",
    headerBg: "#16162a",
    headerBorder: "rgba(255,255,255,0.08)",
    mainBg: "#0f0f1a",
    mainText: "#ffffff",
    mainTextMuted: "rgba(255,255,255,0.5)",
    cardBg: "#1a1a2e",
    cardBorder: "rgba(255,255,255,0.08)",
    accent: "#f97316",
    accentText: "#ffffff",
    mobileBg: "#16162a",
    mode: "dark",
  },
  "light-modern": {
    id: "light-modern",
    sidebarBg: "#1e1b4b",
    sidebarBorder: "rgba(255,255,255,0.1)",
    sidebarText: "rgba(255,255,255,0.7)",
    sidebarTextMuted: "rgba(255,255,255,0.4)",
    sidebarHover: "rgba(255,255,255,0.05)",
    sidebarActive: "rgba(255,255,255,0.15)",
    sidebarActiveText: "#ffffff",
    headerBg: "#ffffff",
    headerBorder: "#e5e7eb",
    mainBg: "#f8fafc",
    mainText: "#1e293b",
    mainTextMuted: "#64748b",
    cardBg: "#ffffff",
    cardBorder: "#e2e8f0",
    accent: "#8b5cf6",
    accentText: "#ffffff",
    mobileBg: "#1e1b4b",
    mode: "light",
  },
};

export function getDashboardTheme(themeId: string): DashboardTheme {
  return DASHBOARD_THEMES[themeId] || DASHBOARD_THEMES["dark-teal"];
}
