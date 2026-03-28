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

export function DashboardTheme3({ content }: DashboardThemeComponentProps) {
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
        ].map((item, i) => (
          <article
            key={item.label}
            className="group flex flex-col justify-center p-6 bg-white transition-all hover:-translate-y-1 hover:shadow-lg"
            style={{
              borderRadius: "var(--dashboard-card-radius)",
              boxShadow: "var(--dashboard-card-shadow)",
              border: "1px solid var(--dashboard-card-border)",
            }}
          >
            <div className="flex items-center gap-4">
              <div
                className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl transition-transform group-hover:scale-110"
                style={{
                  backgroundColor: "var(--dashboard-main-bg)",
                  color: "var(--dashboard-accent)",
                }}
              >
                <item.icon className="h-6 w-6" />
              </div>
              <div className="flex flex-col">
                <p className="text-sm font-medium text-black/60">{item.label}</p>
                <p className="text-3xl font-bold tracking-tight text-black/90">
                  {item.value}
                </p>
              </div>
            </div>
          </article>
        ))}
      </section>

      <section>
        <article
          className="p-6 bg-white"
          style={{
            borderRadius: "var(--dashboard-card-radius)",
            boxShadow: "var(--dashboard-card-shadow)",
            border: "1px solid var(--dashboard-card-border)",
          }}
        >
          <div className="mb-6 flex items-center justify-between">
            <h2 className="text-xl font-bold text-black/90">Bugünkü Antrenman Takibi</h2>
            <div className="h-8 w-8 rounded-full bg-[var(--dashboard-main-bg)] flex items-center justify-center">
              <span className="text-xs font-bold text-[var(--dashboard-accent)]">{latestCheckIns.length}</span>
            </div>
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            {latestCheckIns.slice(0, 4).map((checkIn) => (
              <div
                key={checkIn.id}
                className="flex items-center justify-between rounded-2xl p-4 transition-colors hover:bg-[var(--dashboard-main-bg)]"
                style={{
                  border: "1px solid var(--dashboard-card-border)",
                  backgroundColor: "rgba(250, 250, 250, 0.5)",
                }}
              >
                <div className="flex flex-col gap-1">
                  <p className="font-bold text-black/80">{checkIn.studentName}</p>
                  <div className="flex items-center gap-3 text-sm font-medium text-black/50">
                    <span className="flex items-center gap-1.5"><span className="w-1.5 h-1.5 rounded-full bg-slate-300" /> Kilo: {checkIn.weight ?? "-"} kg</span>
                  </div>
                </div>
                <div className="flex flex-col items-end gap-1 text-right">
                  <span className="rounded-full px-3 py-1 text-xs font-bold" style={{ backgroundColor: "var(--dashboard-main-bg)", color: "var(--dashboard-accent)" }}>
                    Hafta {checkIn.weekNumber}
                  </span>
                  <span className="text-xs font-medium text-black/40">
                    {formatDate(checkIn.date)}
                  </span>
                </div>
              </div>
            ))}
            {latestCheckIns.length === 0 && (
              <div className="col-span-full flex flex-col items-center justify-center rounded-2xl border-2 border-dashed border-[var(--dashboard-card-border)] p-10">
                <div className="mb-3 h-12 w-12 rounded-full bg-[var(--dashboard-main-bg)] flex items-center justify-center text-black/20">
                  <Target strokeWidth={1.5} />
                </div>
                <p className="text-sm font-medium text-black/40">Henüz check-in kaydı yok.</p>
              </div>
            )}
          </div>
        </article>
      </section>
    </div>
  );
}
