import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getStudentProgress, getStudentPlanHistory, getStudentOrGuest } from "../actions";
import { WeightChart, MeasurementsChart } from "@/components/dashboard/progress-chart";
import { GuestPreview } from "@/components/student/guest-preview";

const cardStyle = {
  backgroundColor: "var(--dashboard-card-bg)",
  borderColor: "var(--dashboard-card-border)",
  color: "var(--dashboard-main-text)",
};

function AccordionSection({
  title,
  defaultOpen = false,
  children,
}: {
  title: string;
  defaultOpen?: boolean;
  children: React.ReactNode;
}) {
  return (
    <Card style={cardStyle} className="dashboard-card-hover">
      <details open={defaultOpen || undefined} className="group">
        <summary className="cursor-pointer list-none">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-base">{title}</CardTitle>
            <svg
              className="h-4 w-4 transition-transform duration-300 group-open:rotate-180"
              style={{ color: "var(--dashboard-main-text-muted)" }}
              fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
            </svg>
          </CardHeader>
        </summary>
        <CardContent>{children}</CardContent>
      </details>
    </Card>
  );
}

export default async function StudentProgressPage({
  params,
}: {
  params: Promise<{ domain: string }>;
}) {
  const { domain } = await params;
  const gate = await getStudentOrGuest(domain);
  if (gate.kind === "guest") {
    return (
      <div className="py-6">
        <GuestPreview page="progress" />
      </div>
    );
  }
  const [{ checkIns }, planHistory] = await Promise.all([
    getStudentProgress(domain),
    getStudentPlanHistory(domain),
  ]);

  const hasData = checkIns.length > 0;
  const latest = hasData ? checkIns[checkIns.length - 1] : null;
  const first = hasData ? checkIns[0] : null;

  const weightChange =
    first?.weight && latest?.weight
      ? (latest.weight - first.weight).toFixed(1)
      : null;

  // Fotoğrafları topla (eski front/side/back + yeni photos dizisi)
  const photos = checkIns.filter(
    (c) => c.frontPhoto || c.sidePhoto || c.backPhoto || (c.photos && (c.photos as string[]).length > 0)
  );

  return (
    <div className="space-y-4 py-6">
      <h1 className="font-heading text-xl font-bold" style={{ color: "var(--dashboard-main-text)" }}>İlerleme Takibi</h1>

      {!hasData ? (
        <Card style={cardStyle}>
          <CardContent className="py-12 text-center" style={{ color: "var(--dashboard-main-text-muted)" }}>
            <p className="text-3xl mb-2">📊</p>
            <p>Henüz check-in verisi yok.</p>
            <p className="text-sm mt-1">
              İlk check-in&apos;ini gönderdiğinde ilerleme burada görünecek.
            </p>
          </CardContent>
        </Card>
      ) : (
        <>
          {/* Check-in Notları — koçun her check-in'e yazdığı geri bildirimler */}
          {checkIns.some((c) => c.coachFeedback) && (
            <AccordionSection title="Check-in Notları" defaultOpen>
              <div className="space-y-3">
                {checkIns
                  .filter((c) => c.coachFeedback)
                  .slice()
                  .reverse()
                  .map((c) => (
                    <div
                      key={c.weekNumber}
                      className="rounded-lg p-3"
                      style={{
                        backgroundColor: "color-mix(in srgb, var(--dashboard-accent) 4%, var(--dashboard-card-bg))",
                        borderLeft: "3px solid var(--dashboard-accent)",
                      }}
                    >
                      <div className="flex items-center justify-between gap-2 mb-1.5">
                        <span className="text-xs font-semibold" style={{ color: "var(--dashboard-main-text)" }}>
                          Hafta {c.weekNumber}
                        </span>
                        <span className="text-[11px]" style={{ color: "var(--dashboard-main-text-muted)" }}>
                          {new Date(c.date).toLocaleDateString("tr-TR", { day: "numeric", month: "long" })}
                        </span>
                      </div>
                      <p className="text-sm leading-relaxed" style={{ color: "var(--dashboard-main-text)" }}>
                        {c.coachFeedback}
                      </p>
                    </div>
                  ))}
              </div>
            </AccordionSection>
          )}

          {/* Haftalık İlerleme - Fotoğraf + Ölçümler birlikte */}
          {photos.length > 0 && (
            <AccordionSection title="Fotoğraf & Ölçüm Geçmişi">
              <div className="space-y-4">
                {photos.map((c) => {
                  const allPhotos: string[] = [];
                  if (c.frontPhoto) allPhotos.push(c.frontPhoto);
                  if (c.sidePhoto) allPhotos.push(c.sidePhoto);
                  if (c.backPhoto) allPhotos.push(c.backPhoto);
                  if (c.photos && (c.photos as string[]).length > 0) allPhotos.push(...(c.photos as string[]));

                  const hasMeasurements = c.bodyFat != null || c.chest != null || c.waist != null || c.hips != null || c.arms != null || c.thighs != null;

                  return (
                    <details key={c.weekNumber} className="group/week rounded-lg" style={{ backgroundColor: "color-mix(in srgb, var(--dashboard-accent) 3%, var(--dashboard-card-bg))" }}>
                      <summary className="cursor-pointer list-none p-3 flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-medium">Hafta {c.weekNumber}</span>
                          <span className="text-xs" style={{ color: "var(--dashboard-main-text-muted)" }}>
                            {new Date(c.date).toLocaleDateString("tr-TR")}
                          </span>
                          {c.weight && (
                            <span className="text-xs px-2 py-0.5 rounded-full" style={{ backgroundColor: "var(--dashboard-card-bg)", color: "var(--dashboard-main-text-muted)" }}>
                              {c.weight} kg
                            </span>
                          )}
                        </div>
                        <svg
                          className="h-3 w-3 transition-transform group-open/week:rotate-180"
                          style={{ color: "var(--dashboard-main-text-muted)" }}
                          fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}
                        >
                          <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                        </svg>
                      </summary>
                      <div className="px-3 pb-3 space-y-3">
                        {/* Fotoğraflar */}
                        <div className="grid grid-cols-3 gap-2">
                          {allPhotos.slice(0, 3).map((url, i) => {
                            const labels = ["Ön", "Yan", "Arka"];
                            return (
                              <div key={i}>
                                <p className="text-[10px] text-center mb-1" style={{ color: "var(--dashboard-main-text-muted)" }}>{labels[i] || `Fotoğraf ${i + 1}`}</p>
                                <img src={url} alt={labels[i] || ""} className="w-full aspect-[3/4] object-cover rounded-lg" />
                              </div>
                            );
                          })}
                        </div>
                        {allPhotos.length > 3 && (
                          <div className="grid grid-cols-4 gap-2">
                            {allPhotos.slice(3).map((url, i) => (
                              <img key={i} src={url} alt="" className="w-full aspect-square object-cover rounded-lg" />
                            ))}
                          </div>
                        )}

                        {/* Ölçümler */}
                        {hasMeasurements && (
                          <div className="grid grid-cols-3 gap-2">
                            {[
                              { label: "Yağ", value: c.bodyFat, unit: "%" },
                              { label: "Göğüs", value: c.chest, unit: "cm" },
                              { label: "Bel", value: c.waist, unit: "cm" },
                              { label: "Kalça", value: c.hips, unit: "cm" },
                              { label: "Kol", value: c.arms, unit: "cm" },
                              { label: "Bacak", value: c.thighs, unit: "cm" },
                            ]
                              .filter((m) => m.value != null)
                              .map((m) => (
                                <div key={m.label} className="text-center rounded-md py-1.5" style={{ backgroundColor: "var(--dashboard-card-bg)" }}>
                                  <p className="text-[10px]" style={{ color: "var(--dashboard-main-text-muted)" }}>{m.label}</p>
                                  <p className="text-sm font-semibold">{m.value} {m.unit}</p>
                                </div>
                              ))}
                          </div>
                        )}
                      </div>
                    </details>
                  );
                })}
              </div>
            </AccordionSection>
          )}

          {/* Kilo Geçmişi */}
          <AccordionSection title="Kilo Geçmişi">
            {checkIns.filter((c) => c.weight != null).length > 0 ? (
              <div className="space-y-4">
                <WeightChart
                  data={checkIns
                    .filter((c) => c.weight != null)
                    .map((c) => ({
                      week: c.weekNumber,
                      date: new Date(c.date).toLocaleDateString("tr-TR"),
                      weight: Number(c.weight),
                    }))}
                />
                <div className="space-y-2">
                {checkIns
                  .filter((c) => c.weight != null)
                  .map((c) => (
                    <div
                      key={c.weekNumber}
                      className="flex justify-between items-center py-2 last:border-0"
                      style={{ borderBottom: "1px solid var(--dashboard-card-border)" }}
                    >
                      <div>
                        <span className="text-sm font-medium">
                          Hafta {c.weekNumber}
                        </span>
                        <span className="text-xs ml-2" style={{ color: "var(--dashboard-main-text-muted)" }}>
                          {new Date(c.date).toLocaleDateString("tr-TR")}
                        </span>
                      </div>
                      <span className="font-semibold">{c.weight} kg</span>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <p className="text-sm text-center py-4" style={{ color: "var(--dashboard-main-text-muted)", opacity: 0.7 }}>
                Kilo verisi henüz girilmemiş
              </p>
            )}
          </AccordionSection>

          {/* Vücut Ölçümleri */}
          <AccordionSection title="Vücut Ölçümleri">
            {latest &&
              (latest.chest || latest.waist || latest.hips || latest.arms || latest.thighs) ? (
              <div className="space-y-4">
                <MeasurementsChart
                  data={checkIns.map((c) => ({
                    week: c.weekNumber,
                    date: new Date(c.date).toLocaleDateString("tr-TR"),
                    chest: c.chest ? Number(c.chest) : null,
                    waist: c.waist ? Number(c.waist) : null,
                    hips: c.hips ? Number(c.hips) : null,
                    arms: c.arms ? Number(c.arms) : null,
                    thighs: c.thighs ? Number(c.thighs) : null,
                  }))}
                />
                <div className="space-y-3">
                {[
                  { label: "Göğüs", first: first?.chest, latest: latest.chest },
                  { label: "Bel", first: first?.waist, latest: latest.waist },
                  { label: "Kalça", first: first?.hips, latest: latest.hips },
                  { label: "Kol", first: first?.arms, latest: latest.arms },
                  { label: "Bacak", first: first?.thighs, latest: latest.thighs },
                ]
                  .filter((m) => m.latest != null)
                  .map((m) => {
                    const diff =
                      m.first != null && m.latest != null
                        ? (m.latest - m.first).toFixed(1)
                        : null;
                    return (
                      <div
                        key={m.label}
                        className="flex justify-between items-center"
                      >
                        <span className="text-sm" style={{ color: "var(--dashboard-main-text)", opacity: 0.7 }}>{m.label}</span>
                        <div className="flex items-center gap-3">
                          <span className="font-semibold">{m.latest} cm</span>
                          {diff && (
                            <span
                              className={`text-xs ${Number(diff) < 0
                                  ? "text-green-400"
                                  : Number(diff) > 0
                                    ? "text-red-400"
                                    : ""
                                }`}
                              style={Number(diff) === 0 ? { color: "var(--dashboard-main-text-muted)" } : undefined}
                            >
                              {Number(diff) > 0 ? "+" : ""}
                              {diff}
                            </span>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            ) : (
              <p className="text-sm text-center py-4" style={{ color: "var(--dashboard-main-text-muted)", opacity: 0.7 }}>
                Ölçüm verisi henüz girilmemiş
              </p>
            )}
          </AccordionSection>


        </>
      )}

      {/* Antrenman Planı Geçmişi */}
      <AccordionSection title="Antrenman Planları">
        {planHistory.trainingPlans.length > 0 ? (
          <div className="space-y-2">
            {planHistory.trainingPlans.map((p) => {
              const dayNames = ["Pzt", "Sal", "Çar", "Per", "Cum", "Cmt", "Paz"];
              const workouts = (p as Record<string, unknown>).workouts as Array<{name: string; weekNumber: number; dayOfWeek: number; exercises: Array<{sets: number; reps: string; exercise: {name: string; category: string} | null}>}> || [];
              const programWeeks = (p as Record<string, unknown>).programWeeks as number | null;
              return (
                <details key={p.id} className="group/plan rounded-lg" style={{ backgroundColor: "color-mix(in srgb, var(--dashboard-accent) 3%, var(--dashboard-card-bg))" }}>
                  <summary className="cursor-pointer list-none p-3 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium">{p.programName || p.name}</span>
                      <span className="text-xs" style={{ color: "var(--dashboard-main-text-muted)" }}>
                        {new Date(p.createdAt).toLocaleDateString("tr-TR")}
                      </span>
                      {programWeeks && (
                        <span className="text-xs px-2 py-0.5 rounded-full" style={{ backgroundColor: "var(--dashboard-card-bg)", color: "var(--dashboard-main-text-muted)" }}>
                          {programWeeks} hafta
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-2">
                      <span
                        className="text-[10px] px-2 py-0.5 rounded-full font-medium"
                        style={{
                          backgroundColor: p.status === "active"
                            ? "color-mix(in srgb, var(--dashboard-accent) 15%, var(--dashboard-card-bg))"
                            : "var(--dashboard-card-bg)",
                          color: p.status === "active"
                            ? "var(--dashboard-accent)"
                            : "var(--dashboard-main-text-muted)",
                        }}
                      >
                        {p.status === "active" ? "Aktif" : p.status === "completed" ? "Tamamlandı" : p.status}
                      </span>
                      <svg
                        className="h-3 w-3 transition-transform duration-300 group-open/plan:rotate-180"
                        style={{ color: "var(--dashboard-main-text-muted)" }}
                        fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                      </svg>
                    </div>
                  </summary>
                  {workouts.length > 0 && (
                    <div className="px-3 pb-3 space-y-2">
                      {(() => {
                        const weekGroups: Record<number, typeof workouts> = {};
                        for (const w of workouts) {
                          if (!weekGroups[w.weekNumber]) weekGroups[w.weekNumber] = [];
                          weekGroups[w.weekNumber].push(w);
                        }
                        return Object.entries(weekGroups).sort(([a], [b]) => Number(a) - Number(b)).map(([week, wks]) => (
                          <div key={week} className="rounded-lg p-2" style={{ backgroundColor: "var(--dashboard-card-bg)" }}>
                            <p className="text-xs font-semibold mb-1" style={{ color: "var(--dashboard-main-text-muted)" }}>Hafta {week}</p>
                            <div className="space-y-1">
                              {wks.map((w, wi) => (
                                <div key={wi}>
                                  <p className="text-xs font-medium" style={{ color: "var(--dashboard-accent)" }}>
                                    {dayNames[w.dayOfWeek - 1] || `Gün ${w.dayOfWeek}`} — {w.name}
                                  </p>
                                  <div className="ml-3 mt-0.5 space-y-0.5">
                                    {w.exercises.map((ex, ei) => (
                                      <div key={ei} className="flex items-center gap-2 text-[11px]" style={{ color: "var(--dashboard-main-text-muted)" }}>
                                        <span style={{ color: "var(--dashboard-main-text)" }}>{ex.exercise?.name || "Egzersiz"}</span>
                                        <span>{ex.sets} x {ex.reps}</span>
                                        {ex.exercise?.category && (
                                          <span className="px-1.5 py-0.5 rounded-full text-[10px]" style={{ backgroundColor: "color-mix(in srgb, var(--dashboard-accent) 5%, var(--dashboard-card-bg))" }}>
                                            {ex.exercise.category}
                                          </span>
                                        )}
                                      </div>
                                    ))}
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                        ));
                      })()}
                    </div>
                  )}
                </details>
              );
            })}
          </div>
        ) : (
          <p className="text-sm text-center py-4" style={{ color: "var(--dashboard-main-text-muted)", opacity: 0.7 }}>
            Henüz antrenman planı atanmamış
          </p>
        )}
      </AccordionSection>

      {/* Beslenme Planı Geçmişi */}
      <AccordionSection title="Beslenme Planları">
        {planHistory.nutritionPlans.length > 0 ? (
          <div className="space-y-2">
            {planHistory.nutritionPlans.map((p, idx) => (
              <details key={p.id} className="group/nutrition rounded-lg" style={{ backgroundColor: "color-mix(in srgb, var(--dashboard-accent) 3%, var(--dashboard-card-bg))" }}>
                <summary className="cursor-pointer list-none p-3 flex items-center justify-between">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-sm font-medium">{p.name}</span>
                    <span className="text-xs" style={{ color: "var(--dashboard-main-text-muted)" }}>
                      {new Date(p.createdAt).toLocaleDateString("tr-TR")}
                    </span>
                    {p.targetCalories && (
                      <span className="text-xs px-2 py-0.5 rounded-full" style={{ backgroundColor: "var(--dashboard-card-bg)", color: "var(--dashboard-main-text-muted)" }}>
                        {p.targetCalories} kcal
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-2">
                    {idx === 0 && (
                      <span
                        className="text-[10px] px-2 py-0.5 rounded-full font-medium"
                        style={{
                          backgroundColor: "color-mix(in srgb, var(--dashboard-accent) 15%, var(--dashboard-card-bg))",
                          color: "var(--dashboard-accent)",
                        }}
                      >
                        Güncel
                      </span>
                    )}
                    <svg
                      className="h-3 w-3 transition-transform duration-300 group-open/nutrition:rotate-180"
                      style={{ color: "var(--dashboard-main-text-muted)" }}
                      fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                    </svg>
                  </div>
                </summary>
                <div className="px-3 pb-3 space-y-2">
                  {(p.targetProtein || p.targetCarbs || p.targetFat) && (
                    <div className="flex gap-3 text-xs" style={{ color: "var(--dashboard-main-text-muted)" }}>
                      {p.targetProtein && <span className="text-blue-300">Protein: {p.targetProtein}g</span>}
                      {p.targetCarbs && <span className="text-orange-300">Karb: {p.targetCarbs}g</span>}
                      {p.targetFat && <span className="text-yellow-300">Yağ: {p.targetFat}g</span>}
                    </div>
                  )}
                  {Array.isArray((p as Record<string, unknown>).meals) && ((p as Record<string, unknown>).meals as Array<{id: string; name: string; time: string | null; foods: unknown}>).length > 0 && (
                    <div className="space-y-1">
                      {((p as Record<string, unknown>).meals as Array<{id: string; name: string; time: string | null; foods: unknown}>).map((meal) => (
                        <div key={meal.id} className="rounded-lg p-2" style={{ backgroundColor: "var(--dashboard-card-bg)" }}>
                          <div className="flex items-center gap-2">
                            <span className="text-xs font-medium" style={{ color: "var(--dashboard-accent)" }}>{meal.name}</span>
                            {meal.time && <span className="text-[11px]" style={{ color: "var(--dashboard-main-text-muted)" }}>{meal.time}</span>}
                          </div>
                          {Array.isArray(meal.foods) && (meal.foods as Array<{name?: string; amount?: string}>).length > 0 && (
                            <div className="ml-3 mt-0.5 space-y-0.5">
                              {(meal.foods as Array<{name?: string; amount?: string}>).map((food, fi) => (
                                <p key={fi} className="text-[11px]" style={{ color: "var(--dashboard-main-text-muted)" }}>
                                  {food.name || "Yiyecek"}{food.amount ? ` — ${food.amount}` : ""}
                                </p>
                              ))}
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </details>
            ))}
          </div>
        ) : (
          <p className="text-sm text-center py-4" style={{ color: "var(--dashboard-main-text-muted)", opacity: 0.7 }}>
            Henüz beslenme planı atanmamış
          </p>
        )}
      </AccordionSection>
    </div>
  );
}
