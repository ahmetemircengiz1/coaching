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

export function DashboardTheme4({ content }: DashboardThemeComponentProps) {
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
        ].map((item) => (
          <article
            key={item.label}
            className="group relative flex flex-col p-6 transition-transform hover:-translate-y-1 overflow-hidden shadow-sm hover:shadow-md"
            style={{
              backgroundColor: "var(--dashboard-card-bg)",
              borderRadius: "var(--dashboard-card-radius)",
              border: "1px solid var(--dashboard-card-border)",
              borderBottomColor: "var(--dashboard-accent)",
              borderBottomWidth: "4px",
            }}
          >
            {/* Playful background shape - adjusted for dark mode readability */}
            <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-[var(--dashboard-accent)] to-transparent opacity-[0.05] rounded-bl-full pointer-events-none group-hover:scale-125 transition-transform duration-500" />

            <div className="mb-4 flex items-center justify-between relative z-10">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-black/20" style={{ color: "var(--dashboard-accent)" }}>
                <item.icon className="h-6 w-6" />
              </div>
            </div>
            <p className="text-5xl font-black tracking-tighter mb-1 relative z-10 text-white" style={{ color: "var(--dashboard-main-text)" }}>{item.value}</p>
            <p className="text-xs font-bold uppercase tracking-widest relative z-10 text-white/50" style={{ color: "var(--dashboard-main-text-muted)" }}>
              {item.label}
            </p>
          </article>
        ))}
      </section>

      <section>
        <article
          className="p-6 md:p-8"
          style={{
            backgroundColor: "var(--dashboard-card-bg)",
            borderColor: "var(--dashboard-card-border)",
            borderWidth: "1px",
            borderRadius: "var(--dashboard-card-radius)",
          }}
        >
          <div className="mb-8 flex items-center justify-between border-b-2 pb-4" style={{ borderColor: "var(--dashboard-card-border)" }}>
            <h2 className="text-xl font-black uppercase tracking-widest text-white" style={{ color: "var(--dashboard-main-text)" }}>
              Bugünkü Antrenman Takibi
            </h2>
            <div className="h-3 w-3 bg-[var(--dashboard-accent)] animate-pulse" />
          </div>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {latestCheckIns.slice(0, 4).map((checkIn) => (
              <div
                key={checkIn.id}
                className="group flex flex-col justify-between p-5 transition-transform hover:-translate-y-1 shadow-sm hover:shadow-md"
                style={{
                  backgroundColor: "rgba(0,0,0,0.2)",
                  borderRadius: "calc(var(--dashboard-card-radius) - 4px)",
                  borderTop: "3px solid var(--dashboard-accent)",
                }}
              >
                <div>
                  <div className="mb-4 flex items-start justify-between">
                    <p className="font-black text-lg text-white group-hover:text-[var(--dashboard-accent)] transition-colors">{checkIn.studentName}</p>
                    <span className="text-[10px] font-bold uppercase bg-black/40 px-2 py-1 object-contain rounded text-white/50 shadow-sm" style={{ color: "var(--dashboard-main-text-muted)" }}>
                      {formatDate(checkIn.date)}
                    </span>
                  </div>
                  <div className="flex flex-col gap-2">
                    <div className="flex items-center justify-between bg-black/30 p-2.5 rounded shadow-sm">
                      <span className="text-xs font-bold uppercase text-white/50" style={{ color: "var(--dashboard-main-text-muted)" }}>Kilo</span>
                      <span className="text-sm font-black text-white" style={{ color: "var(--dashboard-main-text)" }}>{checkIn.weight ?? "-"} kg</span>
                    </div>
                  </div>
                </div>
                <div className="mt-5 border-t border-[var(--dashboard-card-border)] pt-4">
                  <span className="inline-block px-3 py-1 text-xs font-black uppercase tracking-wider text-white shadow-sm" style={{ backgroundColor: "var(--dashboard-accent)", color: "var(--dashboard-main-bg)" }}>
                    Hafta {checkIn.weekNumber}
                  </span>
                </div>
              </div>
            ))}
            {latestCheckIns.length === 0 && (
              <div className="col-span-full flex items-center justify-center p-12 bg-black/20 rounded-2xl border-2 border-dashed border-[var(--dashboard-card-border)]">
                <p className="text-sm font-black uppercase tracking-widest text-white/40" style={{ color: "var(--dashboard-main-text-muted)" }}>
                  Kayıt Yok
                </p>
              </div>
            )}
          </div>
        </article>
      </section>
    </div>
  );
}
