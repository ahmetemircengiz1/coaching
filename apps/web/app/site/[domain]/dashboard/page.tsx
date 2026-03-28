import { DashboardThemeRenderer } from "@/src/components/dashboard/DashboardThemeRenderer";
import type { DashboardThemeContent } from "@/src/components/dashboard/types";
import { resolveDashboardThemeId } from "@/src/theme/dashboardThemes";
import { getDashboardStats } from "./actions";

export default async function CoachDashboardPage({
  params,
}: {
  params: Promise<{ domain: string }>;
}) {
  const { domain } = await params;
  const { coach, stats, latestCheckIns, attentionStudents } =
    await getDashboardStats(domain);

  const selectedThemeId = coach.dashboardThemeId
    ? resolveDashboardThemeId(coach.dashboardThemeId)
    : resolveDashboardThemeId(coach.dashboardTemplateId);

  const content: DashboardThemeContent = {
    domain,
    coachName: coach.name,
    stats,
    latestCheckIns,
    attentionStudents,
  };

  return <DashboardThemeRenderer themeId={selectedThemeId} content={content} />;
}
