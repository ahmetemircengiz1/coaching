import type { DashboardThemeId } from "@/src/theme/dashboardThemes";

export interface DashboardThemeStats {
  activeStudents: number;
  maxStudents: number;
  weeklyCheckIns: number;
}

export interface DashboardNewCheckIn {
  id: string;
  studentName: string;
  studentId: string;
  weekNumber: number;
  date: string;
  weight: number | null;
}

export interface DashboardThemeContent {
  domain: string;
  coachName: string;
  stats: DashboardThemeStats;
  newCheckIns: DashboardNewCheckIn[];
  dashboardNote: string;
}

export interface DashboardThemeComponentProps {
  themeId: DashboardThemeId;
  content: DashboardThemeContent;
}
