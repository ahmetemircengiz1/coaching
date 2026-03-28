import { Clock3, MessageCircle, Users } from "lucide-react";
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

export function DashboardTheme2({ content }: DashboardThemeComponentProps) {
  const { stats, latestCheckIns, coachName } = content;

  return (
    <div className="space-y-5">
      <section className="grid gap-4 md:grid-cols-3">
        {[
          { label: "Aktif Öğrenci", value: `${stats.activeStudents}/${stats.maxStudents === 999 ? "∞" : stats.maxStudents}`, icon: Users },
          { label: "Haftalık Check-in", value: String(stats.weeklyCheckIns), icon: Clock3 },
          { label: "Yeni Mesaj", value: String(stats.unreadMessages), icon: MessageCircle },
        ].map((card) => (
          <article
            key={card.label}
            className="group relative overflow-hidden p-[1px] transition-all hover:scale-[1.02]"
            style={{
              borderRadius: "var(--dashboard-card-radius)",
              boxShadow: "var(--dashboard-card-shadow)",
            }}
          >
            {/* Animated border glow */}
            <div
              className="absolute inset-0 opacity-20 group-hover:opacity-100 transition-opacity duration-500"
              style={{
                background: "linear-gradient(to bottom right, var(--dashboard-accent), transparent)",
              }}
            />
            {/* Inner card */}
            <div
              className="relative h-full w-full p-5"
              style={{
                backgroundColor: "var(--dashboard-card-bg)",
                borderRadius: "calc(var(--dashboard-card-radius) - 1px)",
                backdropFilter: "var(--dashboard-glass-effect)",
              }}
            >
              <div className="mb-3 flex items-center justify-between">
                <p className="text-xs font-medium uppercase tracking-[0.1em] text-white/60">
                  {card.label}
                </p>
                <card.icon
                  className="h-4 w-4 opacity-70 drop-shadow-[0_0_8px_rgba(203,160,91,0.5)]"
                  style={{ color: "var(--dashboard-accent)" }}
                />
              </div>
              <p
                className="mt-1 font-serif text-3xl font-bold tracking-tight"
                style={{
                  background: "linear-gradient(to right, #FFF, var(--dashboard-accent))",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                }}
              >
                {card.value}
              </p>
            </div>
          </article>
        ))}
      </section>

      <section>
        <article
          className="p-6"
          style={{
            backgroundColor: "var(--dashboard-card-bg)",
            borderColor: "var(--dashboard-card-border)",
            borderWidth: "1px",
            borderRadius: "var(--dashboard-card-radius)",
            boxShadow: "var(--dashboard-card-shadow)",
            backdropFilter: "var(--dashboard-glass-effect)",
          }}
        >
          <div className="mb-6 flex items-center gap-3">
            <div className="h-[1px] flex-1 bg-gradient-to-r from-transparent to-[var(--dashboard-card-border)]" />
            <h2 className="font-serif text-xl font-medium tracking-wide text-white/90">
              Son Check-in Kayıtları
            </h2>
            <div className="h-[1px] flex-1 bg-gradient-to-l from-transparent to-[var(--dashboard-card-border)]" />
          </div>

          <div className="space-y-4">
            {latestCheckIns.slice(0, 5).map((checkIn) => (
              <div
                key={checkIn.id}
                className="group flex flex-col sm:flex-row sm:items-center justify-between border-b pb-4 last:border-0 last:pb-0 transition-colors"
                style={{ borderColor: "var(--dashboard-card-border)" }}
              >
                <div>
                  <div className="flex items-center gap-3 mb-1">
                    <p className="font-medium text-white/95">{checkIn.studentName}</p>
                    <span
                      className="rounded-full border px-2 py-[2px] text-[10px] font-bold tracking-wider uppercase"
                      style={{
                        color: "var(--dashboard-accent)",
                        borderColor: "color-mix(in srgb, var(--dashboard-accent) 30%, transparent)",
                        backgroundColor: "color-mix(in srgb, var(--dashboard-accent) 10%, transparent)",
                      }}
                    >
                      Hafta {checkIn.weekNumber}
                    </span>
                  </div>
                  <div className="flex items-center gap-4 text-sm text-white/60">
                    <span className="flex items-center gap-1">
                      <Clock3 className="h-3 w-3" />
                      {formatDate(checkIn.date)}
                    </span>
                  </div>
                </div>
                <div className="mt-2 sm:mt-0 flex items-center gap-6 text-sm">
                  <div className="text-right">
                    <p className="text-white/50 text-xs uppercase tracking-wider mb-0.5">Kilo</p>
                    <p className="font-medium text-white/90">{checkIn.weight ?? "-"} <span className="text-white/50 text-xs">kg</span></p>
                  </div>
                </div>
              </div>
            ))}
            {latestCheckIns.length === 0 && (
              <div className="py-8 text-center">
                <p className="font-serif text-white/40 italic">Kayıt bulunamadı.</p>
              </div>
            )}
          </div>
        </article>
      </section>
    </div>
  );
}
