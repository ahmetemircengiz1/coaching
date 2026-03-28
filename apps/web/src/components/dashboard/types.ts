import type { DashboardThemeId } from "@/src/theme/dashboardThemes";

export interface DashboardThemeStats {
  activeStudents: number;
  maxStudents: number;
  weeklyCheckIns: number;
  avgCompliance: number | null;
  unreadMessages: number;
}

export interface DashboardLatestCheckIn {
  id: string;
  studentName: string;
  studentId: string;
  weekNumber: number;
  date: string;
  weight: number | null;
  compliance: number | null;
  coachFeedback: string | null;
}

export interface DashboardAttentionStudent {
  id: string;
  name: string;
  compliance: number;
  lastCheckInDate: string | null;
}

export interface DashboardThemeContent {
  domain: string;
  coachName: string;
  stats: DashboardThemeStats;
  latestCheckIns: DashboardLatestCheckIn[];
  attentionStudents: DashboardAttentionStudent[];
}

export interface DashboardThemeComponentProps {
  themeId: DashboardThemeId;
  content: DashboardThemeContent;
}
