import { MessageCircle, Target, Users } from "lucide-react";
import type { DashboardThemeComponentProps } from "./types";

function formatDate(value: string | null) {
  if (!value) {
    return "-";
  }

  return new Date(value).toLocaleDateString("tr-TR", {
    day: "numeric",
    month: "short",
  });
}

export function DashboardTheme1({ content }: DashboardThemeComponentProps) {
  const { stats, latestCheckIns, attentionStudents, coachName } = content;

  return (
    <div className="space-y-5">
      <section className="grid gap-4 md:grid-cols-3">
        {[
          {
            label: "Aktif Öğrenci",
            value: `${stats.activeStudents}/${stats.maxStudents === 999 ? "∞" : stats.maxStudents}`,
            icon: Users,
          },
          { label: "Haftalık Check-in", value: String(stats.weeklyCheckIns), icon: Target },
          { label: "Yeni Mesaj", value: String(stats.unreadMessages), icon: MessageCircle },
        ].map((item) => (
          <article
            key={item.label}
            className="group relative flex flex-col justify-between overflow-hidden p-5 transition-all duration-300 hover:scale-[1.02]"
            style={{
              backgroundColor: "var(--dashboard-card-bg)",
              borderColor: "var(--dashboard-card-border)",
              borderWidth: "1px",
              borderRadius: "var(--dashboard-card-radius)",
              boxShadow: "var(--dashboard-card-shadow)",
              backdropFilter: "var(--dashboard-glass-effect)",
            }}
          >
            <div className="absolute inset-0 bg-gradient-to-br from-white/[0.02] to-transparent pointer-events-none" />
            <div className="relative z-10 mb-4 flex items-center justify-between">
              <p className="text-sm font-medium tracking-wide text-white/60">{item.label}</p>
              <div
                className="flex items-center justify-center rounded-full p-2"
                style={{ backgroundColor: "color-mix(in srgb, var(--dashboard-accent) 15%, transparent)" }}
              >
                <item.icon className="h-4 w-4" style={{ color: "var(--dashboard-accent)" }} />
              </div>
            </div>
            <p className="relative z-10 text-3xl font-bold tracking-tight text-white group-hover:text-[var(--dashboard-accent)] transition-colors">
              {item.value}
            </p>
          </article>
        ))}
      </section>

      <section>
        <article
          className="relative overflow-hidden p-5 sm:p-6"
          style={{
            backgroundColor: "var(--dashboard-card-bg)",
            borderColor: "var(--dashboard-card-border)",
            borderWidth: "1px",
            borderRadius: "var(--dashboard-card-radius)",
            boxShadow: "var(--dashboard-card-shadow)",
            backdropFilter: "var(--dashboard-glass-effect)",
          }}
        >
          <div className="absolute inset-0 bg-gradient-to-br from-white/[0.01] to-transparent pointer-events-none" />
          <h2 className="relative z-10 mb-5 text-xl font-semibold tracking-tight text-white">Bugünkü Antrenman Takibi</h2>
          <div className="relative z-10 grid gap-3 sm:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2">
            {latestCheckIns.slice(0, 4).map((checkIn) => (
              <div
                key={checkIn.id}
                className="group flex flex-col justify-between rounded-lg border p-4 transition-colors hover:bg-white/[0.04]"
                style={{
                  borderColor: "var(--dashboard-card-border)",
                  backgroundColor: "rgba(255,255,255,0.02)",
                }}
              >
                <div className="mb-2 flex items-start justify-between">
                  <p className="font-semibold text-white">{checkIn.studentName}</p>
                  <span className="shrink-0 rounded bg-white/5 px-2 py-1 text-xs font-medium text-white/70">
                    Hafta {checkIn.weekNumber}
                  </span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-2">
                    <span className="text-white/50">Kilo:</span>
                    <span className="font-medium text-white">{checkIn.weight ?? "-"} kg</span>
                  </div>
                </div>
              </div>
            ))}
            {latestCheckIns.length === 0 && (
              <div className="col-span-full flex items-center justify-center rounded-lg border border-dashed border-white/20 p-8 text-center text-white/50">
                Henüz check-in kaydı yok.
              </div>
            )}
          </div>
        </article>
      </section>
    </div>
  );
}
