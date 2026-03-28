import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getStudentDashboard } from "./actions";

export default async function StudentDashboardPage({
  params,
}: {
  params: Promise<{ domain: string }>;
}) {
  const { domain } = await params;
  const { student, trainingPlan, nutritionPlan, lastCheckIn, unreadMessages } =
    await getStudentDashboard(domain);

  return (
    <div className="space-y-5 py-6">
      {/* Greeting */}
      <div className="animate-fade-in">
        <h1 className="font-heading text-xl font-bold">
          Merhaba, {student.name.split(" ")[0]}!
        </h1>
        {student.packageName && (
          <p className="text-xs mt-1" style={{ color: "var(--dashboard-main-text-muted)" }}>{student.packageName}</p>
        )}
      </div>

      {/* Unread Messages Banner */}
      {unreadMessages > 0 && (
        <Link href={`/site/${domain}/student/messages`}>
          <div
            className="group relative overflow-hidden p-4 flex items-center justify-between transition-all hover:scale-[1.01]"
            style={{
              backgroundColor: "color-mix(in srgb, var(--dashboard-accent) 10%, var(--dashboard-main-bg))",
              border: "1px solid color-mix(in srgb, var(--dashboard-accent) 20%, transparent)",
              borderRadius: "var(--dashboard-card-radius)",
              boxShadow: "var(--dashboard-card-shadow)",
            }}
          >
            <div className="absolute inset-0 bg-gradient-to-r from-[var(--dashboard-accent)]/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
            <div className="relative z-10 flex items-center gap-3">
              <div
                className="w-10 h-10 rounded-full flex items-center justify-center text-lg shadow-sm"
                style={{ backgroundColor: "color-mix(in srgb, var(--dashboard-accent) 20%, var(--dashboard-card-bg))" }}
              >
                💬
              </div>
              <span className="text-sm font-semibold tracking-wide text-[var(--dashboard-main-text)]">{unreadMessages} okunmamış mesaj</span>
            </div>
            <span className="relative z-10 text-sm font-bold tracking-tight transition-transform group-hover:translate-x-1" style={{ color: "var(--dashboard-accent)" }}>Oku →</span>
          </div>
        </Link>
      )}

      {/* Today's Program */}
      <Card
        className="overflow-hidden border transition-all"
        style={{
          backgroundColor: "var(--dashboard-glass-bg, var(--dashboard-card-bg))",
          borderColor: "var(--dashboard-card-border)",
          borderRadius: "var(--dashboard-card-radius)",
          boxShadow: "var(--dashboard-card-shadow)",
          backdropFilter: "var(--dashboard-glass-effect, none)",
        }}
      >
        <CardHeader className="pb-3 border-b border-[var(--dashboard-card-border)]/50">
          <CardTitle className="text-xs font-bold uppercase tracking-widest" style={{ color: "var(--dashboard-main-text-muted)" }}>
            Bugünkü Programın
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-4">
          {trainingPlan ? (
            <Link
              href={`/site/${domain}/student/training`}
              className="block -mx-2 px-2 py-2 rounded-lg transition-colors"
            >
              <p className="font-semibold">{trainingPlan.name}</p>
              <p className="text-sm mt-1" style={{ color: "var(--dashboard-accent)" }}>Antrenmanı görüntüle →</p>
            </Link>
          ) : (
            <div className="py-2 text-center">
              <p className="text-3xl mb-2">💪</p>
              <p className="text-sm" style={{ color: "var(--dashboard-main-text-muted)" }}>Henüz atanmış bir program yok</p>
              <p className="text-xs mt-1" style={{ color: "var(--dashboard-main-text-muted)", opacity: 0.7 }}>Koçun sana bir program atadığında burada görünecek</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Son Check-in */}
      <Card
        className="overflow-hidden border"
        style={{
          backgroundColor: "var(--dashboard-glass-bg, var(--dashboard-card-bg))",
          borderColor: "var(--dashboard-card-border)",
          borderRadius: "var(--dashboard-card-radius)",
          boxShadow: "var(--dashboard-card-shadow)",
          backdropFilter: "var(--dashboard-glass-effect, none)"
        }}
      >
        <CardContent className="pt-5 pb-5 flex flex-col items-center justify-center text-center">
          <p className="text-2xl font-bold tracking-tight" style={{ color: "var(--dashboard-main-text)" }}>
            {lastCheckIn
              ? new Date(lastCheckIn.date).toLocaleDateString("tr-TR", {
                day: "numeric",
                month: "short",
              })
              : "-"}
          </p>
          <p className="text-[10px] font-bold uppercase tracking-widest mt-2" style={{ color: "var(--dashboard-main-text-muted)" }}>Son Check-in</p>
        </CardContent>
      </Card>

      {/* Nutrition Summary */}
      {nutritionPlan && (
        <Link href={`/site/${domain}/student/nutrition`}>
          <Card
            className="group overflow-hidden border transition-all hover:scale-[1.01]"
            style={{
              backgroundColor: "var(--dashboard-glass-bg, var(--dashboard-card-bg))",
              borderColor: "var(--dashboard-card-border)",
              borderRadius: "var(--dashboard-card-radius)",
              boxShadow: "var(--dashboard-card-shadow)",
              backdropFilter: "var(--dashboard-glass-effect, none)"
            }}
          >
            <CardHeader className="pb-3 border-b border-[var(--dashboard-card-border)]/50">
              <CardTitle className="text-xs font-bold uppercase tracking-widest" style={{ color: "var(--dashboard-main-text-muted)" }}>
                Beslenme Planı
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-4">
              <p className="font-semibold">{nutritionPlan.name}</p>
              {nutritionPlan.targetCalories && (
                <div className="flex gap-3 mt-3">
                  <div className="px-2.5 py-1 rounded-md text-xs" style={{ backgroundColor: "color-mix(in srgb, var(--dashboard-card-border) 30%, var(--dashboard-card-bg))" }}>
                    <span style={{ color: "var(--dashboard-main-text-muted)" }}>Kcal </span>
                    <span className="font-semibold text-[var(--dashboard-main-text)]">{nutritionPlan.targetCalories}</span>
                  </div>
                  {nutritionPlan.targetProtein && (
                    <div className="px-2.5 py-1 rounded-md bg-blue-500/10 text-xs text-blue-500 dark:text-blue-400">
                      <span>P </span>
                      <span className="font-semibold">{nutritionPlan.targetProtein}g</span>
                    </div>
                  )}
                  {nutritionPlan.targetCarbs && (
                    <div className="px-2.5 py-1 rounded-md bg-orange-500/10 text-xs text-orange-500 dark:text-orange-400">
                      <span>K </span>
                      <span className="font-semibold">{nutritionPlan.targetCarbs}g</span>
                    </div>
                  )}
                  {nutritionPlan.targetFat && (
                    <div className="px-2.5 py-1 rounded-md bg-yellow-500/10 text-xs text-yellow-500 dark:text-yellow-400">
                      <span>Y </span>
                      <span className="font-semibold">{nutritionPlan.targetFat}g</span>
                    </div>
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        </Link>
      )}

      {/* Coach Feedback */}
      {lastCheckIn?.coachFeedback && (
        <Card
          className="overflow-hidden border"
          style={{
            backgroundColor: "var(--dashboard-glass-bg, var(--dashboard-card-bg))",
            borderColor: "var(--dashboard-card-border)",
            borderLeftWidth: "4px",
            borderLeftColor: "var(--dashboard-accent)",
            borderRadius: "var(--dashboard-card-radius)",
            boxShadow: "var(--dashboard-card-shadow)",
            backdropFilter: "var(--dashboard-glass-effect, none)"
          }}
        >
          <CardHeader className="pb-3 border-b border-[var(--dashboard-card-border)]/30">
            <CardTitle className="text-xs font-bold uppercase tracking-widest" style={{ color: "var(--dashboard-main-text-muted)" }}>
              Koçundan Mesaj
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-4">
            <p className="text-sm leading-relaxed">{lastCheckIn.coachFeedback}</p>
          </CardContent>
        </Card>
      )}

    </div>
  );
}
