import { DashboardTheme1 } from "./DashboardTheme1";
import { DashboardTheme2 } from "./DashboardTheme2";
import { DashboardTheme3 } from "./DashboardTheme3";
import { DashboardTheme4 } from "./DashboardTheme4";
import { DashboardTheme5 } from "./DashboardTheme5";
import type { DashboardThemeComponentProps } from "./types";

export function DashboardThemeRenderer(props: DashboardThemeComponentProps) {
  switch (props.themeId) {
    case 2:
      return <DashboardTheme2 {...props} />;
    case 3:
      return <DashboardTheme3 {...props} />;
    case 4:
      return <DashboardTheme4 {...props} />;
    case 5:
      return <DashboardTheme5 {...props} />;
    case 1:
    default:
      return <DashboardTheme1 {...props} />;
  }
}
