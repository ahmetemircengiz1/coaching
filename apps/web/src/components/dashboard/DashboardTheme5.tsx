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

export function DashboardTheme5({ content }: DashboardThemeComponentProps) {
  const { stats, latestCheckIns, coachName } = content;

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
        ].map((card) => (
          <article
            key={card.label}
            className="group relative overflow-hidden p-6 transition-all duration-300 hover:shadow-lg hover:-translate-y-1"
            style={{
              backgroundColor: "var(--dashboard-glass-bg)",
              backdropFilter: "var(--dashboard-glass-effect)",
              borderColor: "var(--dashboard-card-border)",
              borderWidth: "1px",
              borderRadius: "var(--dashboard-card-radius)",
              boxShadow: "var(--dashboard-card-shadow)",
            }}
          >
            {/* Ambient inner glow */}
            <div className="absolute top-0 right-0 w-32 h-32 rounded-full opacity-10 bg-gradient-to-br from-[var(--dashboard-accent)] to-transparent -mr-16 -mt-16 pointer-events-none" />

            <div className="relative z-10 mb-4 flex items-center justify-between">
              <p className="text-sm font-semibold tracking-wide text-black/60">{card.label}</p>
              <div className="rounded-xl bg-black/5 p-2.5 transition-colors group-hover:bg-[var(--dashboard-accent)] group-hover:text-white">
                <card.icon className="h-5 w-5 opacity-70 group-hover:opacity-100" />
              </div>
            </div>
            <p className="relative z-10 text-4xl font-black tracking-tight" style={{ color: "var(--dashboard-chart-secondary)" }}>
              {card.value}
            </p>
          </article>
        ))}
      </section>

      <section>
        <article
          className="relative overflow-hidden p-6"
          style={{
            backgroundColor: "var(--dashboard-glass-bg)",
            backdropFilter: "var(--dashboard-glass-effect)",
            borderColor: "var(--dashboard-card-border)",
            borderWidth: "1px",
            borderRadius: "var(--dashboard-card-radius)",
            boxShadow: "var(--dashboard-card-shadow)",
          }}
        >
          <div className="absolute top-0 left-0 w-64 h-64 rounded-full opacity-5 bg-gradient-to-br from-[var(--dashboard-accent)] to-transparent -ml-24 -mt-24 pointer-events-none" />

          <h2 className="relative z-10 mb-5 text-xl font-bold tracking-tight text-black/80">Bugünkü Antrenman Takibi</h2>
          <div className="relative z-10 space-y-4">
            {latestCheckIns.slice(0, 4).map((checkIn) => (
              <div
                key={checkIn.id}
                className="group flex flex-col sm:flex-row sm:items-center justify-between p-4 transition-all hover:bg-black/5"
                style={{
                  borderColor: "var(--dashboard-card-border)",
                  borderWidth: "1px",
                  borderRadius: "calc(var(--dashboard-card-radius) - 8px)",
                  backgroundColor: "rgba(255, 255, 255, 0.5)",
                }}
              >
                <div>
                  <div className="flex items-center gap-3 mb-1">
                    <p className="font-bold text-black/80">{checkIn.studentName}</p>
                    <span
                      className="rounded-full px-2.5 py-0.5 text-xs font-bold"
                      style={{ backgroundColor: "color-mix(in srgb, var(--dashboard-accent) 15%, transparent)", color: "var(--dashboard-accent)" }}
                    >
                      Hafta {checkIn.weekNumber}
                    </span>
                  </div>
                  <span className="text-xs font-semibold text-black/40">
                    {formatDate(checkIn.date)}
                  </span>
                </div>

                <div className="mt-3 sm:mt-0 flex items-center gap-6">
                  <div className="flex flex-col items-end">
                    <span className="text-[10px] font-bold uppercase tracking-widest text-black/40">Kilo</span>
                    <span className="font-bold text-black/70">{checkIn.weight ?? "-"} kg</span>
                  </div>
                </div>
              </div>
            ))}
            {latestCheckIns.length === 0 && (
              <div className="flex items-center justify-center p-8 text-sm font-semibold text-black/40">
                Henüz check-in kaydı yok.
              </div>
            )}
          </div>
        </article>
      </section>
    </div>
  );
}
