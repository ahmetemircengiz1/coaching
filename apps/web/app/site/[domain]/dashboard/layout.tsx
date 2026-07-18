import { CoachSidebarLayoutWrapper } from "@/components/dashboard/sidebar-layout-wrapper";
import { CoachBottomNav } from "@/components/dashboard/coach-bottom-nav";
import { PageGuide } from "@/components/dashboard/page-guide";
import { DashboardThemeProvider } from "@/src/components/DashboardThemeProvider";
import { BottomNavTourWrapper, BottomNavTourButton } from "@/components/dashboard/bottom-nav-tour-wrapper";
import {
  getDashboardTheme,
  resolveDashboardThemeId,
} from "@/src/theme/dashboardThemes";
import { logoutAction } from "@/app/site/[domain]/auth/logout-action";
import { getCoachAuth } from "./actions";

function SidebarContent({ children }: { children: React.ReactNode }) {
  return (
    <main
      className="flex-1 w-full min-h-[calc(100vh-1rem)] lg:min-h-[calc(100vh-2rem)] rounded-2xl lg:rounded-3xl overflow-hidden shadow-lg border relative flex flex-col"
      style={{
        backgroundColor: "var(--dashboard-main-bg)",
        borderColor: "var(--dashboard-card-border)",
        boxShadow: "var(--dashboard-card-shadow)",
      }}
    >
      <div className="p-4 lg:p-6 flex-1 overflow-x-hidden animate-fade-in relative z-0">{children}</div>
    </main>
  );
}

export default async function DashboardLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ domain: string }>;
}) {
  const { domain } = await params;

  // getCoachAuth is cached per request — no duplicate DB query
  const coach = await getCoachAuth(domain);

  const selectedTheme = coach.dashboardThemeId
    ? getDashboardTheme(coach.dashboardThemeId)
    : getDashboardTheme(resolveDashboardThemeId(coach.dashboardTemplateId));

  const navPosition = coach.sidebarPosition || "left";

  // Bottom nav layout
  if (navPosition === "bottom") {
    return (
      <DashboardThemeProvider theme={selectedTheme}>
        <BottomNavTourWrapper>
        <div
          className="min-h-screen"
          style={{
            backgroundColor: "var(--dashboard-main-bg)",
            color: "var(--dashboard-main-text)",
          }}
        >
          <header
            className="fixed top-0 w-full z-40 h-14 flex items-center justify-between px-6 backdrop-blur-md"
            style={{
              backgroundColor: "var(--dashboard-header-bg)",
              borderBottom: "1px solid var(--dashboard-header-border)",
            }}
          >
            <span className="text-lg font-semibold" style={{ color: "var(--dashboard-sidebar-active-text)" }}>
              {coach.brandName}
            </span>
            <div className="flex items-center gap-2">
              <BottomNavTourButton />
              <a
                href={`/site/${domain}`}
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 rounded-lg transition-colors hover:opacity-80"
                style={{ color: "var(--dashboard-sidebar-text-muted)" }}
                title="Siteyi Aç"
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="10" />
                  <path d="M2 12h20M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
                </svg>
              </a>
              <form action={logoutAction.bind(null, domain)}>
                <button
                  type="submit"
                  className="p-2 rounded-lg transition-colors hover:opacity-80"
                  style={{ color: "var(--dashboard-sidebar-text-muted)" }}
                  title="Çıkış Yap"
                >
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
                    <polyline points="16 17 21 12 16 7" />
                    <line x1="21" y1="12" x2="9" y2="12" />
                  </svg>
                </button>
              </form>
            </div>
          </header>
          <main className="pt-14 pb-20 px-4 max-w-4xl mx-auto">
            <div className="p-0 pt-4 lg:pt-6 animate-fade-in">
              <PageGuide role="coach" domain={domain} />
              {children}
            </div>
          </main>
          <CoachBottomNav domain={domain} />
        </div>
        </BottomNavTourWrapper>
      </DashboardThemeProvider>
    );
  }

  // Right sidebar layout
  if (navPosition === "right") {
    return (
      <DashboardThemeProvider theme={selectedTheme}>
        <div
          className="flex min-h-screen"
          style={{
            backgroundColor: "var(--dashboard-sidebar-bg)",
            color: "var(--dashboard-main-text)",
          }}
        >
          <CoachSidebarLayoutWrapper
            domain={domain}
            coachName={coach.name}
            brandName={coach.brandName}
            position="right"
          >
            <SidebarContent>
              <PageGuide role="coach" domain={domain} />
              {children}
            </SidebarContent>
          </CoachSidebarLayoutWrapper>
        </div>
      </DashboardThemeProvider>
    );
  }

  // Default: left sidebar
  return (
    <DashboardThemeProvider theme={selectedTheme}>
      <div
        className="flex min-h-screen"
        style={{
          backgroundColor: "var(--dashboard-sidebar-bg)",
          color: "var(--dashboard-main-text)",
        }}
      >
        <CoachSidebarLayoutWrapper
          domain={domain}
          coachName={coach.name}
          brandName={coach.brandName}
          position="left"
        >
          <SidebarContent>
            <PageGuide role="coach" domain={domain} />
            {children}
          </SidebarContent>
        </CoachSidebarLayoutWrapper>
      </div>
    </DashboardThemeProvider>
  );
}
