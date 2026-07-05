import type { DashboardThemeComponentProps } from "./types";
import { DashboardHomeWidgets } from "./DashboardHomeWidgets";

export function DashboardTheme1({ content }: DashboardThemeComponentProps) {
  const { newCheckIns, dashboardNote, domain } = content;

  return (
    <DashboardHomeWidgets
      domain={domain}
      newCheckIns={newCheckIns}
      initialNote={dashboardNote}
    />
  );
}
