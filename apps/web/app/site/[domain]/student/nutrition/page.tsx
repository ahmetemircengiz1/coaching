import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getStudentNutrition } from "../actions";
import { MealCompleteToggle } from "@/components/student/meal-complete-toggle";

// Her gün sıfırdan "yedim" işaretlemesi yapılabilmesi için sayfa her istekte
// taze render edilir — Next.js cache'ine düşmesin.
export const dynamic = "force-dynamic";

const TR_DATE = new Intl.DateTimeFormat("tr-TR", {
  weekday: "long",
  day: "numeric",
  month: "long",
});

export default async function StudentNutritionPage({
  params,
}: {
  params: Promise<{ domain: string }>;
}) {
  const { domain } = await params;
  const { nutritionPlan, mealStatus } = await getStudentNutrition(domain);
  const todayLabel = TR_DATE.format(new Date());

  const cardStyle = {
    backgroundColor: "var(--dashboard-card-bg)",
    borderColor: "var(--dashboard-card-border)",
    color: "var(--dashboard-main-text)",
  };

  if (!nutritionPlan) {
    return (
      <div className="space-y-6 py-6">
        <h1 className="font-heading text-xl font-bold" style={{ color: "var(--dashboard-main-text)" }}>Beslenme Programı</h1>
        <Card style={cardStyle}>
          <CardContent className="py-12 text-center">
            <p className="text-4xl mb-4">🥗</p>
            <p className="text-lg mb-2" style={{ color: "var(--dashboard-main-text-muted)" }}>
              Henüz beslenme programı atanmadı
            </p>
            <p className="text-sm" style={{ color: "var(--dashboard-main-text-muted)", opacity: 0.7 }}>
              Koçun sana bir beslenme programı atadığında burada görünecek
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  type FoodItem = { name: string; portion: string; calories: number; protein: number; carbs: number; fat: number };
  type SupplementItem = { name: string; dosage: string; timing: string; notes?: string };

  const supplements = (nutritionPlan as Record<string, unknown>).supplements as SupplementItem[] | null;
  const coachNotes = (nutritionPlan as Record<string, unknown>).coachNotes as string | null;

  return (
    <div className="space-y-6 py-6">
      <div>
        <h1 className="font-heading text-xl font-bold" style={{ color: "var(--dashboard-main-text)" }}>Beslenme Programı</h1>
        <p className="text-sm mt-1" style={{ color: "var(--dashboard-main-text-muted)" }}>
          {nutritionPlan.name} · <span style={{ opacity: 0.7 }}>{todayLabel} — yediğin öğünleri ✓ ile işaretle</span>
        </p>
        <p className="text-[11px] mt-1" style={{ color: "var(--dashboard-main-text-muted)", opacity: 0.7 }}>
          İşaretler her gün sıfırlanır; yarın aynı planı yeniden işaretleyebilirsin.
        </p>
      </div>

      {/* Makro Hedefler */}
      {nutritionPlan.targetCalories && (
        <Card style={cardStyle}>
          <CardContent className="py-4">
            <div className="grid grid-cols-4 gap-2 text-center">
              <div>
                <p className="text-lg font-bold" style={{ color: "var(--dashboard-accent)" }}>
                  {nutritionPlan.targetCalories}
                </p>
                <p className="text-[10px]" style={{ color: "var(--dashboard-main-text-muted)" }}>kcal</p>
              </div>
              <div>
                <p className="text-lg font-bold">
                  {nutritionPlan.targetProtein || "-"}
                </p>
                <p className="text-[10px]" style={{ color: "var(--dashboard-main-text-muted)" }}>Protein (g)</p>
              </div>
              <div>
                <p className="text-lg font-bold">
                  {nutritionPlan.targetCarbs || "-"}
                </p>
                <p className="text-[10px]" style={{ color: "var(--dashboard-main-text-muted)" }}>Karb (g)</p>
              </div>
              <div>
                <p className="text-lg font-bold">
                  {nutritionPlan.targetFat || "-"}
                </p>
                <p className="text-[10px]" style={{ color: "var(--dashboard-main-text-muted)" }}>Yağ (g)</p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Koç Notları */}
      {coachNotes && (
        <Card style={cardStyle}>
          <CardHeader className="pb-2">
            <CardTitle className="text-base">Koç Notları</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm leading-relaxed" style={{ color: "var(--dashboard-main-text)", opacity: 0.85 }}>
              {coachNotes}
            </p>
          </CardContent>
        </Card>
      )}

      {/* Öğünler */}
      {nutritionPlan.meals.map((meal) => {
        const mealFoods = meal.foods as FoodItem[];
        const totalCalories = mealFoods.reduce((sum, f) => sum + (f.calories || 0), 0);
        const totalProtein = mealFoods.reduce((sum, f) => sum + (f.protein || 0), 0);
        const totalCarbs = mealFoods.reduce((sum, f) => sum + (f.carbs || 0), 0);
        const totalFat = mealFoods.reduce((sum, f) => sum + (f.fat || 0), 0);

        const status = mealStatus[meal.id];
        const isEaten = !!status?.completed;
        const altUsed = status?.alternativeUsed ?? null;
        const mealAlts = Array.isArray((meal as Record<string, unknown>).alternatives)
          ? ((meal as Record<string, unknown>).alternatives as string[])
          : [];
        const displayLabel = altUsed ? altUsed : meal.name;

        return (
          <Card
            key={meal.id}
            style={{
              ...cardStyle,
              backgroundColor: isEaten
                ? "color-mix(in srgb, #10b981 6%, var(--dashboard-card-bg))"
                : cardStyle.backgroundColor,
            }}
          >
            <CardHeader className="pb-2">
              <CardTitle className="text-base flex items-center justify-between gap-2 flex-wrap">
                <div className="flex items-center gap-2 flex-wrap">
                  <span style={{ textDecoration: isEaten ? "line-through" : "none", opacity: isEaten ? 0.6 : 1 }}>
                    {meal.name}
                  </span>
                  {altUsed && (
                    <span
                      className="text-[10px] px-1.5 py-0.5 rounded-full font-normal"
                      style={{
                        backgroundColor: "color-mix(in srgb, var(--dashboard-accent) 18%, transparent)",
                        color: "var(--dashboard-accent)",
                      }}
                      title={`Yendi: ${altUsed}`}
                    >
                      → {altUsed}
                    </span>
                  )}
                </div>
                <div className="flex items-center gap-2 flex-wrap">
                  {meal.time && (
                    <span className="text-xs font-normal" style={{ color: "var(--dashboard-main-text-muted)" }}>
                      {meal.time}
                    </span>
                  )}
                  <span
                    className="text-[10px] px-2 py-0.5 rounded-full font-normal"
                    style={{
                      backgroundColor: "color-mix(in srgb, var(--dashboard-accent) 10%, var(--dashboard-card-bg))",
                      color: "var(--dashboard-accent)",
                    }}
                  >
                    {totalCalories} kcal
                  </span>
                  <MealCompleteToggle
                    domain={domain}
                    mealId={meal.id}
                    initialCompleted={isEaten}
                    initialAlternativeUsed={altUsed}
                    alternatives={mealAlts}
                  />
                </div>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {mealFoods.map((food: FoodItem, i: number) => (
                  <div
                    key={i}
                    className="flex items-center justify-between py-1.5 last:border-0"
                    style={{ borderBottom: "1px solid var(--dashboard-card-border)" }}
                  >
                    <div>
                      <span className="text-sm">{food.name}</span>
                      <span className="text-xs ml-2" style={{ color: "var(--dashboard-main-text-muted)" }}>
                        {food.portion}
                      </span>
                    </div>
                    <div className="flex items-center gap-3 text-xs" style={{ color: "var(--dashboard-main-text-muted)" }}>
                      <span>{food.calories} kcal</span>
                      <span className="text-blue-400">P:{food.protein}g</span>
                    </div>
                  </div>
                ))}
                {/* Öğün Toplamları */}
                <div className="flex items-center justify-end gap-3 pt-1 text-[11px]" style={{ color: "var(--dashboard-main-text-muted)" }}>
                  <span className="text-blue-400">P:{totalProtein.toFixed(0)}g</span>
                  <span className="text-orange-400">K:{totalCarbs.toFixed(0)}g</span>
                  <span className="text-yellow-400">Y:{totalFat.toFixed(0)}g</span>
                </div>
              </div>
            </CardContent>
          </Card>
        );
      })}

      {/* Takviyeler */}
      {supplements && supplements.length > 0 && (
        <Card style={cardStyle}>
          <CardHeader className="pb-2">
            <CardTitle className="text-base">Takviyeler</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {supplements.map((supp, i) => (
                <div
                  key={i}
                  className="flex items-start justify-between py-2 last:border-0"
                  style={{ borderBottom: "1px solid var(--dashboard-card-border)" }}
                >
                  <div>
                    <p className="text-sm font-medium">{supp.name}</p>
                    <p className="text-xs mt-0.5" style={{ color: "var(--dashboard-main-text-muted)" }}>
                      {supp.dosage} &bull; {supp.timing}
                    </p>
                    {supp.notes && (
                      <p className="text-xs mt-0.5" style={{ color: "var(--dashboard-main-text-muted)", opacity: 0.7 }}>
                        {supp.notes}
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
