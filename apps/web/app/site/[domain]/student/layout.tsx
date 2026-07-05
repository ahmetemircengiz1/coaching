import { redirect } from "next/navigation";
import { getAuthUser } from "@/lib/supabase/server";
import prisma from "@coach-os/database";
import { BottomNav } from "@/components/student/bottom-nav";
import { StudentSidebarLayoutWrapper } from "@/components/student/student-sidebar-layout-wrapper";
import { LogoutButton } from "@/components/student/logout-button";
import { WhatsAppFab } from "@/components/student/whatsapp-fab";
import { DashboardThemeProvider } from "@/src/components/DashboardThemeProvider";
import { getDashboardTheme } from "@/src/theme/dashboardThemes";

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
      <header
        className="h-16 flex items-center border-b px-6 backdrop-blur-md sticky top-0 z-10"
        style={{
          backgroundColor: "color-mix(in srgb, var(--dashboard-main-bg) 80%, transparent)",
          borderColor: "var(--dashboard-header-border)",
        }}
      >
        <div className="ml-auto" />
      </header>
      <div className="p-4 lg:p-6 flex-1 overflow-x-hidden animate-fade-in relative z-0">
        <div className="max-w-2xl mx-auto">{children}</div>
      </div>
    </main>
  );
}

export default async function StudentLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ domain: string }>;
}) {
  const { domain } = await params;

  const user = await getAuthUser();

  if (!user) {
    redirect(`/site/${domain}/auth`);
  }

  const student = await prisma.student.findUnique({
    where: { userId: user.id },
    include: {
      coach: {
        select: {
          brandName: true,
          subdomain: true,
          dashboardThemeId: true,
          whatsappNumber: true,
        },
      },
    },
  });

  if (!student || student.coach.subdomain !== domain) {
    redirect(`/site/${domain}/auth`);
  }

  if (student.status !== "active") {
    redirect(`/site/${domain}/account-suspended`);
  }

  const themeId = student.dashboardThemeId || student.coach.dashboardThemeId || 1;
  const selectedTheme = getDashboardTheme(themeId);
  const navPosition = student.sidebarPosition || "bottom";

  // Sidebar layout (left or right)
  if (navPosition === "left" || navPosition === "right") {
    return (
      <DashboardThemeProvider theme={selectedTheme}>
        <div
          className="flex min-h-screen"
          style={{
            backgroundColor: "var(--dashboard-sidebar-bg)",
            color: "var(--dashboard-main-text)",
          }}
        >
          <StudentSidebarLayoutWrapper
            domain={domain}
            brandName={student.coach.brandName}
            studentName={student.name}
            position={navPosition as "left" | "right"}
          >
            <SidebarContent>{children}</SidebarContent>
          </StudentSidebarLayoutWrapper>
          <WhatsAppFab whatsappNumber={student.coach.whatsappNumber} brandName={student.coach.brandName} />
        </div>
      </DashboardThemeProvider>
    );
  }

  // Default: bottom nav layout
  return (
    <DashboardThemeProvider theme={selectedTheme}>
      <div
        className="min-h-screen"
        style={{
          backgroundColor: "var(--dashboard-main-bg)",
          color: "var(--dashboard-main-text)",
        }}
      >
        <header
          className="fixed top-0 w-full z-50 h-14 flex items-center px-6"
          style={{
            backgroundColor: "var(--dashboard-header-bg)",
            borderBottom: "1px solid var(--dashboard-header-border)",
          }}
        >
          <span className="font-heading text-lg font-bold">
            {student.coach.brandName}
          </span>
          <div className="ml-auto flex items-center gap-3">
            <LogoutButton domain={domain} />
          </div>
        </header>

        <main className="pt-14 pb-20 px-4 max-w-2xl mx-auto">
          {children}
        </main>

        <WhatsAppFab whatsappNumber={student.coach.whatsappNumber} brandName={student.coach.brandName} />

        <BottomNav domain={domain} />
      </div>
    </DashboardThemeProvider>
  );
}
