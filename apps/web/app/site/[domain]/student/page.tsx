import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getStudentDashboard } from "./actions";
import { getStudentMealLog } from "./nutrition/meal-log-actions";
import { Sun, Sunset, Moon, Coffee, Check } from "lucide-react";

// Günlük yemek/antrenman özetinin midnight'ta sıfırlanması için Next.js cache'i bypass.
export const dynamic = "force-dynamic";

export default async function StudentDashboardPage({
  params,
}: {
  params: Promise<{ domain: string }>;
}) {
  const { domain } = await params;
  const [{ student, trainingPlan, nutritionPlan, lastCheckIn }, mealLog] =
    await Promise.all([
      getStudentDashboard(domain),
      getStudentMealLog(domain, 1),   // Sadece bugün için özet
    ]);

  const todayIso = new Date().toLocaleDateString("en-CA");
  const todayEntries = mealLog.days.find((d) => d.date === todayIso)?.entries || [];
  const filledTypes = new Set(todayEntries.map((e) => e.mealType));

  return (
    <div className="space-y-5 py-6">
      {/* Greeting — son check-in tarihi selamlamanın yanında küçük gösterilir */}
      <div className="animate-fade-in flex items-start justify-between gap-3">
        <h1 className="font-heading text-xl font-bold">
          Merhaba, {student.name.split(" ")[0]}!
        </h1>
        {lastCheckIn && (
          <div className="shrink-0 text-right leading-tight">
            <p className="text-[10px] font-bold uppercase tracking-widest" style={{ color: "var(--dashboard-main-text-muted)" }}>
              Son Check-in
            </p>
            <p className="text-sm font-semibold" style={{ color: "var(--dashboard-main-text)" }}>
              {new Date(lastCheckIn.date).toLocaleDateString("tr-TR", { day: "numeric", month: "short" })}
            </p>
          </div>
        )}
      </div>

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

      {/* Bugünkü Yemekler */}
      <Link href={`/site/${domain}/student/nutrition/log`} className="block">
        <Card
          className="overflow-hidden border transition-all hover:scale-[1.005]"
          style={{
            backgroundColor: "var(--dashboard-glass-bg, var(--dashboard-card-bg))",
            borderColor: "var(--dashboard-card-border)",
            borderRadius: "var(--dashboard-card-radius)",
            boxShadow: "var(--dashboard-card-shadow)",
            backdropFilter: "var(--dashboard-glass-effect, none)",
          }}
        >
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-base">Bugünkü Yemekler</CardTitle>
              <span className="text-xs" style={{ color: "var(--dashboard-main-text-muted)" }}>
                {filledTypes.size}/4 öğün
              </span>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-4 gap-2">
              <MealSlotMini icon={<Sun className="w-4 h-4" />} label="Kahvaltı" filled={filledTypes.has("breakfast")} />
              <MealSlotMini icon={<Sunset className="w-4 h-4" />} label="Öğle" filled={filledTypes.has("lunch")} />
              <MealSlotMini icon={<Moon className="w-4 h-4" />} label="Akşam" filled={filledTypes.has("dinner")} />
              <MealSlotMini icon={<Coffee className="w-4 h-4" />} label="Ara" filled={filledTypes.has("snack")} />
            </div>
            <p className="text-[11px] mt-3 opacity-60">
              {filledTypes.size === 0
                ? "Tıkla ve ilk öğününün fotoğrafını yükle →"
                : filledTypes.size === 4
                  ? "Tüm öğünler yüklendi! ✨"
                  : "Tıkla ve eksik öğünlerini tamamla →"}
            </p>
          </CardContent>
        </Card>
      </Link>

    </div>
  );
}

function MealSlotMini({
  icon,
  label,
  filled,
}: {
  icon: React.ReactNode;
  label: string;
  filled: boolean;
}) {
  return (
    <div
      className="flex flex-col items-center justify-center gap-1 py-2 rounded-md text-center transition"
      style={{
        backgroundColor: filled
          ? "color-mix(in srgb, var(--dashboard-accent) 12%, var(--dashboard-card-bg))"
          : "color-mix(in srgb, var(--dashboard-card-border) 30%, transparent)",
        border: filled
          ? "1px solid color-mix(in srgb, var(--dashboard-accent) 40%, transparent)"
          : "1px solid var(--dashboard-card-border)",
      }}
    >
      <span style={{ color: filled ? "var(--dashboard-accent)" : "var(--dashboard-main-text-muted)" }}>
        {filled ? <Check className="w-4 h-4" strokeWidth={3} /> : icon}
      </span>
      <span
        className="text-[10px] font-semibold"
        style={{ color: filled ? "var(--dashboard-accent)" : "var(--dashboard-main-text-muted)" }}
      >
        {label}
      </span>
    </div>
  );
}
