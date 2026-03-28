import { DashboardThemeProvider } from "@/src/components/DashboardThemeProvider";
import { DashboardThemeRenderer } from "@/src/components/dashboard/DashboardThemeRenderer";
import type { DashboardThemeContent } from "@/src/components/dashboard/types";
import { DASHBOARD_THEME_LIST } from "@/src/theme/dashboardThemes";

const SAMPLE_CONTENT: DashboardThemeContent = {
  domain: "preview",
  coachName: "Osman Arslan",
  stats: {
    activeStudents: 83,
    maxStudents: 120,
    weeklyCheckIns: 16,
    avgCompliance: 92,
    unreadMessages: 7,
  },
  latestCheckIns: [
    {
      id: "checkin-1",
      studentName: "Ayse Yilmaz",
      studentId: "s-1",
      weekNumber: 5,
      date: "2026-04-19",
      weight: 94,
      compliance: 89,
      coachFeedback: "Program guzel gidiyor.",
    },
    {
      id: "checkin-2",
      studentName: "Mehmet Demir",
      studentId: "s-2",
      weekNumber: 6,
      date: "2026-04-20",
      weight: 90,
      compliance: 82,
      coachFeedback: "Kilo dususu devam ediyor.",
    },
    {
      id: "checkin-3",
      studentName: "Elif Kaya",
      studentId: "s-3",
      weekNumber: 4,
      date: "2026-04-21",
      weight: 68,
      compliance: 74,
      coachFeedback: "Enerji seviyesi artti.",
    },
    {
      id: "checkin-4",
      studentName: "Lutfu Yuksek",
      studentId: "s-4",
      weekNumber: 5,
      date: "2026-04-22",
      weight: 101,
      compliance: 58,
      coachFeedback: "Takip siklastirilmali.",
    },
  ],
  attentionStudents: [
    {
      id: "s-4",
      name: "Lutfu Yuksek",
      compliance: 58,
      lastCheckInDate: "2026-04-22",
    },
    {
      id: "s-5",
      name: "Can Arda",
      compliance: 62,
      lastCheckInDate: "2026-04-21",
    },
    {
      id: "s-6",
      name: "Zeynep Arslan",
      compliance: 55,
      lastCheckInDate: "2026-04-20",
    },
  ],
};

export default function DashboardPreviewPage() {
  return (
    <div className="bg-[#06070c] px-4 py-10 text-white sm:px-6">
      <div className="mx-auto w-full max-w-7xl space-y-10">
        <header className="space-y-2">
          <h1 className="text-4xl font-semibold tracking-wide">Dashboard Preview</h1>
          <p className="text-sm text-white/60">
            Tum dashboard temalari ayni sample data ile gosterilir.
          </p>
        </header>

        {DASHBOARD_THEME_LIST.map((theme) => (
          <section key={theme.id} className="space-y-3">
            <h2 className="text-sm font-semibold uppercase tracking-[0.14em] text-white/70">
              {theme.name}
            </h2>
            <div className="overflow-hidden rounded-2xl border border-white/10 bg-black/20 p-4 sm:p-6">
              <DashboardThemeProvider theme={theme}>
                <DashboardThemeRenderer themeId={theme.id} content={SAMPLE_CONTENT} />
              </DashboardThemeProvider>
            </div>
          </section>
        ))}
      </div>
    </div>
  );
}
