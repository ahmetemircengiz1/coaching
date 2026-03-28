"use client";

/**
 * CSS-based dashboard theme preview cards.
 * Shows a mini representation of each dashboard theme's sidebar + content area.
 */

import type { DashboardThemeDefinition } from "@/src/theme/dashboardThemes";

interface DashboardThemePreviewProps {
  theme: DashboardThemeDefinition;
}

export function DashboardThemePreview({ theme }: DashboardThemePreviewProps) {
  return (
    <div
      className="relative aspect-[4/5] overflow-hidden rounded-lg flex"
      style={{ backgroundColor: theme.mainBg }}
    >
      {/* Sidebar */}
      <div
        className="flex w-[30%] flex-col px-1.5 py-2"
        style={{ backgroundColor: theme.sidebarBg, borderRight: `1px solid ${theme.sidebarBorder}` }}
      >
        {/* Brand */}
        <div className="h-1.5 w-10 rounded-full mb-3" style={{ backgroundColor: theme.sidebarText, opacity: 0.8 }} />

        {/* Menu items */}
        <div className="space-y-1.5">
          {[1, 2, 3, 4, 5].map((i) => (
            <div
              key={i}
              className="flex items-center gap-1 rounded px-1 py-0.5"
              style={
                i === 1
                  ? { backgroundColor: theme.sidebarActive }
                  : undefined
              }
            >
              <div
                className="h-1.5 w-1.5 rounded-sm"
                style={{ backgroundColor: i === 1 ? theme.sidebarActiveText : theme.sidebarTextMuted, opacity: 0.6 }}
              />
              <div
                className="h-1 flex-1 rounded-full"
                style={{ backgroundColor: i === 1 ? theme.sidebarActiveText : theme.sidebarText, opacity: i === 1 ? 0.9 : 0.5 }}
              />
            </div>
          ))}
        </div>
      </div>

      {/* Main content */}
      <div className="flex-1 p-2">
        {/* Header */}
        <div
          className="mb-2 flex items-center justify-between rounded px-1.5 py-1"
          style={{ backgroundColor: theme.headerBg, border: `1px solid ${theme.headerBorder}` }}
        >
          <div className="h-1.5 w-12 rounded-full" style={{ backgroundColor: theme.mainText, opacity: 0.6 }} />
          <div className="h-2 w-2 rounded-full" style={{ backgroundColor: theme.accent, opacity: 0.7 }} />
        </div>

        {/* Stat cards */}
        <div className="grid grid-cols-2 gap-1 mb-2">
          {[1, 2].map((i) => (
            <div
              key={i}
              className="rounded p-1.5"
              style={{ backgroundColor: theme.cardBg, border: `1px solid ${theme.cardBorder}` }}
            >
              <div className="h-1 w-6 rounded-full mb-1" style={{ backgroundColor: theme.mainTextMuted }} />
              <div className="h-2 w-4 rounded-full" style={{ backgroundColor: theme.mainText, opacity: 0.8 }} />
            </div>
          ))}
        </div>

        {/* Chart area */}
        <div
          className="rounded p-1.5"
          style={{ backgroundColor: theme.cardBg, border: `1px solid ${theme.cardBorder}` }}
        >
          <div className="h-1 w-8 rounded-full mb-1.5" style={{ backgroundColor: theme.mainText, opacity: 0.5 }} />
          <div className="flex items-end gap-0.5 h-8">
            {[40, 65, 45, 80, 55, 70, 50].map((h, i) => (
              <div
                key={i}
                className="flex-1 rounded-t-sm"
                style={{
                  height: `${h}%`,
                  backgroundColor: i % 2 === 0 ? theme.chartPrimary : theme.chartSecondary,
                  opacity: 0.7,
                }}
              />
            ))}
          </div>
        </div>

        {/* Action button */}
        <div
          className="mt-1.5 h-3 w-12 rounded-full mx-auto"
          style={{ backgroundColor: theme.accent }}
        />
      </div>
    </div>
  );
}
