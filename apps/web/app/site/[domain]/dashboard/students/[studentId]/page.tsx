import { Suspense } from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import prisma from "@coach-os/database";
import { getCoachAuth } from "../../actions";
import {
  AssignProgramSection,
} from "@/components/dashboard/student-detail-actions";
import { AssignNutritionSection } from "@/components/dashboard/assign-nutrition-section";
import { CheckInWeekView } from "@/components/dashboard/checkin-week-view";
import type { WeekCheckIn } from "@/components/dashboard/checkin-week-view";
import { StudentNotes } from "@/components/dashboard/student-notes";
import { ExportCSVButton } from "@/components/dashboard/export-csv-button";
import { WeightChart, MeasurementsChart } from "@/components/dashboard/progress-chart";
import { MealLogCoachView } from "@/components/dashboard/meal-log-coach-view";
import { getStudentMealLogForCoach } from "../meal-log-actions";
import { signPhotoUrls } from "@/lib/supabase/signed-url";
import { StudentSwitcherRail } from "@/components/dashboard/student-switcher-rail";

const cardStyle = { backgroundColor: "var(--dashboard-card-bg)", borderColor: "var(--dashboard-card-border)" };

function AccordionSection({
  title,
  defaultOpen = false,
  count,
  children,
}: {
  title: string;
  defaultOpen?: boolean;
  count?: number;
  children: React.ReactNode;
}) {
  return (
    <Card style={cardStyle} className="dashboard-card-hover">
      <details open={defaultOpen || undefined} className="group">
        <summary className="cursor-pointer list-none">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-lg">
              {title}
              {count != null && <span className="text-sm font-normal ml-1" style={{ color: "var(--dashboard-main-text-muted)" }}>({count})</span>}
            </CardTitle>
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

export default async function StudentDetailPage({
  params,
}: {
  params: Promise<{ domain: string; studentId: string }>;
}) {
  const { domain, studentId } = await params;

  const coach = await getCoachAuth(domain);

  // Bu öğrencinin tüm görülmemiş check-in'lerini "görüldü" olarak işaretle
  // (dashboard ana sayfasındaki "Yeni Check-in" kartlarından gizlensin)
  await prisma.weeklyCheckIn.updateMany({
    where: {
      studentId,
      student: { coachId: coach.id },
      coachViewedAt: null,
    },
    data: { coachViewedAt: new Date() },
  });

  // Sadece sayfanın "çekirdeği" (header, program, beslenme, grafikler) için gereken
  // sorgular burada bloke eder. Yemek fotoğrafları bölümü
  // aşağıda <Suspense> ile stream edilir → sayfa kabuğu onları beklemeden açılır.
  const [student, coachPrograms, libraryNutritionPlans, allStudents] = await Promise.all([
    prisma.student.findUnique({
      where: { id: studentId },
      include: {
        coachPackage: { select: { name: true, duration: true } },
        checkIns: {
          orderBy: { date: "desc" },
          take: 50,
          select: {
            id: true,
            weekNumber: true,
            date: true,
            weight: true,
            bodyFat: true,
            chest: true,
            waist: true,
            hips: true,
            arms: true,
            thighs: true,
            energyLevel: true,
            sleepQuality: true,
            stressLevel: true,
            notes: true,
            compliance: true,
            coachFeedback: true,
            frontPhoto: true,
            sidePhoto: true,
            backPhoto: true,
            photos: true,
          },
        },
        trainingPlans: {
          orderBy: { createdAt: "desc" },
          take: 10,
          select: {
            id: true, name: true, status: true, createdAt: true, programId: true,
            program: {
              select: {
                name: true,
                weeks: true,
                workouts: {
                  orderBy: [{ weekNumber: "asc" }, { dayOfWeek: "asc" }],
                  select: {
                    name: true,
                    weekNumber: true,
                    dayOfWeek: true,
                    exercises: {
                      orderBy: { orderIndex: "asc" },
                      select: {
                        sets: true,
                        reps: true,
                        exercise: { select: { name: true, category: true } },
                      },
                    },
                  },
                },
              },
            },
          },
        },
        nutritionPlans: {
          orderBy: { createdAt: "desc" },
          take: 10,
          select: {
            id: true,
            name: true,
            status: true,
            targetCalories: true,
            targetProtein: true,
            targetCarbs: true,
            targetFat: true,
            coachNotes: true,
            createdAt: true,
            meals: {
              orderBy: { orderIndex: "asc" },
              select: { id: true, name: true, time: true, foods: true, orderIndex: true },
            },
          },
        },
        metrics: {
          where: { type: "weight" },
          orderBy: { date: "desc" },
          take: 1,
          select: { value: true, date: true },
        },
      },
    }),
    prisma.program.findMany({
      where: { coachId: coach.id },
      select: { id: true, name: true, weeks: true },
      orderBy: { createdAt: "desc" },
    }),
    prisma.nutritionPlan.findMany({
      where: { coachId: coach.id, studentId: null },
      select: {
        id: true,
        name: true,
        targetCalories: true,
        _count: { select: { meals: true } },
      },
      orderBy: { createdAt: "desc" },
    }),
    prisma.student.findMany({
      where: { coachId: coach.id },
      select: { id: true, name: true, status: true },
      orderBy: [{ status: "asc" }, { name: "asc" }],
    }),
  ]);

  if (!student || student.coachId !== coach.id) {
    notFound();
  }

  const programs = coachPrograms.map((p) => ({
    id: p.id,
    name: p.name,
    weeks: p.weeks,
  }));

  const nutritionPlanOptions = libraryNutritionPlans.map((p) => ({
    id: p.id,
    name: p.name,
    targetCalories: p.targetCalories,
    mealCount: p._count.meals,
  }));

  const lastCheckIn = student.checkIns[0];
  const lastWeight = student.metrics[0];
  const activePlan = student.trainingPlans.find((p) => p.status === "active") || null;
  const currentPlan = activePlan ? { id: activePlan.id, name: activePlan.program?.name || activePlan.name } : null;
  const activeNutrition = student.nutritionPlans.find((p) => p.status === "active") || null;
  const currentNutrition = activeNutrition ? {
    id: activeNutrition.id,
    name: activeNutrition.name,
    targetCalories: activeNutrition.targetCalories,
    targetProtein: activeNutrition.targetProtein,
    targetCarbs: activeNutrition.targetCarbs,
    targetFat: activeNutrition.targetFat,
    coachNotes: activeNutrition.coachNotes,
    meals: activeNutrition.meals,
  } : null;

  // Aktif programın detaylarını fetch et
  let programDetails = null;
  if (activePlan?.programId) {
    const program = await prisma.program.findUnique({
      where: { id: activePlan.programId },
      include: {
        workouts: {
          orderBy: [{ weekNumber: "asc" }, { dayOfWeek: "asc" }],
          include: {
            exercises: {
              orderBy: { orderIndex: "asc" },
              include: {
                exercise: { select: { name: true, category: true } },
              },
            },
          },
        },
      },
    });
    if (program) {
      programDetails = {
        name: program.name,
        weeks: program.weeks,
        workouts: program.workouts.map((w) => ({
          id: w.id,
          name: w.name,
          weekNumber: w.weekNumber,
          dayOfWeek: w.dayOfWeek,
          exercises: w.exercises.map((we) => ({
            name: we.exercise?.name || "Egzersiz",
            muscleGroup: we.exercise?.category || null,
            sets: we.sets,
            reps: we.reps,
            restSeconds: we.restSeconds,
          })),
        })),
      };
    }
  }

  // Check-in + fotoğraf verilerini birleştir (haftalık görünüm için).
  // Private bucket — foto referanslarını topla + tek batch'te signed URL'e çevir.
  const rawPhotosByCheckIn = student.checkIns.map((c) => {
    const arr: string[] = [];
    if (c.frontPhoto) arr.push(c.frontPhoto);
    if (c.sidePhoto) arr.push(c.sidePhoto);
    if (c.backPhoto) arr.push(c.backPhoto);
    if (c.photos && c.photos.length > 0) arr.push(...c.photos);
    return arr;
  });
  const signedPhotoFlat = await signPhotoUrls(rawPhotosByCheckIn.flat());
  let photoCursor = 0;

  const weekCheckIns: WeekCheckIn[] = student.checkIns.map((c, ci) => {
    const count = rawPhotosByCheckIn[ci].length;
    const photos = signedPhotoFlat
      .slice(photoCursor, photoCursor + count)
      .filter((u): u is string => !!u);
    photoCursor += count;
    return {
      id: c.id,
      weekNumber: c.weekNumber,
      date: c.date.toISOString(),
      weight: c.weight ? Number(c.weight) : null,
      bodyFat: c.bodyFat ? Number(c.bodyFat) : null,
      chest: c.chest ? Number(c.chest) : null,
      waist: c.waist ? Number(c.waist) : null,
      hips: c.hips ? Number(c.hips) : null,
      arms: c.arms ? Number(c.arms) : null,
      thighs: c.thighs ? Number(c.thighs) : null,
      energyLevel: c.energyLevel,
      sleepQuality: c.sleepQuality,
      stressLevel: c.stressLevel,
      notes: c.notes,
      compliance: c.compliance,
      coachFeedback: c.coachFeedback,
      photos,
    };
  });

  // Grafik verileri için eski format (sadece ölçümler)
  const checkInsData = weekCheckIns.map((c) => ({
    weekNumber: c.weekNumber,
    date: c.date,
    weight: c.weight,
    chest: c.chest,
    waist: c.waist,
    hips: c.hips,
    arms: c.arms,
    thighs: c.thighs,
  }));

  return (
    <div className="flex gap-4 lg:gap-6 pb-6">
      <StudentSwitcherRail domain={domain} students={allStudents} currentId={studentId} />

      <div className="flex-1 min-w-0 space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href={`/site/${domain}/dashboard/students`}>
            <Button variant="ghost" style={{ color: "var(--dashboard-main-text-muted)" }}>
              ← Geri
            </Button>
          </Link>
          <div
            className="w-12 h-12 rounded-full flex items-center justify-center font-bold text-lg"
            style={{ backgroundColor: "color-mix(in srgb, var(--dashboard-accent) 15%, var(--dashboard-card-bg))", color: "var(--dashboard-accent)" }}
          >
            {student.name.charAt(0)}
          </div>
          <div>
            <h1 className="font-heading text-xl font-bold">{student.name}</h1>
            <p className="text-sm" style={{ color: "var(--dashboard-main-text-muted)" }}>{student.email}</p>
          </div>
          <Badge variant={student.status === "active" ? "default" : "secondary"}>
            {student.status === "active" ? "Aktif" : "Pasif"}
          </Badge>
          <div className="ml-auto">
            <ExportCSVButton
              studentName={student.name}
              checkIns={student.checkIns.map((c) => ({
                weekNumber: c.weekNumber,
                date: c.date.toISOString(),
                weight: c.weight ? Number(c.weight) : null,
                bodyFat: c.bodyFat ? Number(c.bodyFat) : null,
                chest: c.chest ? Number(c.chest) : null,
                waist: c.waist ? Number(c.waist) : null,
                hips: c.hips ? Number(c.hips) : null,
                arms: c.arms ? Number(c.arms) : null,
                thighs: c.thighs ? Number(c.thighs) : null,
                energyLevel: c.energyLevel,
                sleepQuality: c.sleepQuality,
                stressLevel: c.stressLevel,
                compliance: c.compliance,
                notes: c.notes,
              }))}
            />
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 gap-4 stagger-children">
        <Card style={cardStyle} className="animate-count-up dashboard-card-hover">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-normal" style={{ color: "var(--dashboard-main-text-muted)" }}>Son Check-in</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-lg font-semibold">
              {lastCheckIn ? new Date(lastCheckIn.date).toLocaleDateString("tr-TR") : "Henüz yok"}
            </p>
            {lastCheckIn && <p className="text-xs" style={{ color: "var(--dashboard-main-text-muted)" }}>Hafta {lastCheckIn.weekNumber}</p>}
          </CardContent>
        </Card>

        <Card style={cardStyle} className="animate-count-up dashboard-card-hover">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-normal" style={{ color: "var(--dashboard-main-text-muted)" }}>Son Kilo</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">{lastWeight ? `${Number(lastWeight.value)}` : "-"}</p>
            {lastWeight && <p className="text-xs" style={{ color: "var(--dashboard-main-text-muted)" }}>kg</p>}
          </CardContent>
        </Card>
      </div>

      {/* Antrenman Programı (Aktif + Geçmiş) */}
      <AccordionSection title="Antrenman Programı">
        <div className="space-y-4">
          <AssignProgramSection
            domain={domain}
            studentId={studentId}
            programs={programs}
            currentPlan={currentPlan}
            programDetails={programDetails}
          />
          {student.trainingPlans.length > 1 && (
            <div className="space-y-2 pt-2" style={{ borderTop: "1px solid var(--dashboard-card-border)" }}>
              <p className="text-xs font-semibold" style={{ color: "var(--dashboard-main-text-muted)" }}>Geçmiş Programlar</p>
              {student.trainingPlans.filter((p) => p.status !== "active").map((p) => {
                const dayNames = ["Pzt", "Sal", "Çar", "Per", "Cum", "Cmt", "Paz"];
                const workouts = p.program?.workouts || [];
                return (
                  <details key={p.id} className="group/plan rounded-lg" style={{ backgroundColor: "color-mix(in srgb, var(--dashboard-accent) 3%, var(--dashboard-card-bg))" }}>
                    <summary className="cursor-pointer list-none p-3 flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-medium">{p.program?.name || p.name}</span>
                        <span className="text-xs" style={{ color: "var(--dashboard-main-text-muted)" }}>
                          {new Date(p.createdAt).toLocaleDateString("tr-TR")}
                        </span>
                        {p.program?.weeks && (
                          <span className="text-xs px-2 py-0.5 rounded-full" style={{ backgroundColor: "var(--dashboard-card-bg)", color: "var(--dashboard-main-text-muted)" }}>
                            {p.program.weeks} hafta
                          </span>
                        )}
                      </div>
                      <div className="flex items-center gap-2">
                        <span
                          className="text-[10px] px-2 py-0.5 rounded-full font-medium"
                          style={{ backgroundColor: "var(--dashboard-card-bg)", color: "var(--dashboard-main-text-muted)" }}
                        >
                          {p.status === "completed" ? "Tamamlandı" : p.status}
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
          )}
        </div>
      </AccordionSection>

      {/* Beslenme Planı (Aktif + Geçmiş) */}
      <AccordionSection title="Beslenme Planı">
        <div className="space-y-4">
          <AssignNutritionSection
            domain={domain}
            studentId={studentId}
            nutritionPlans={nutritionPlanOptions}
            currentNutrition={currentNutrition}
          />
          {student.nutritionPlans.length > 1 && (
            <div className="space-y-2 pt-2" style={{ borderTop: "1px solid var(--dashboard-card-border)" }}>
              <p className="text-xs font-semibold" style={{ color: "var(--dashboard-main-text-muted)" }}>Geçmiş Planlar</p>
              {student.nutritionPlans.filter((p) => p.status !== "active").map((p) => (
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
                      <span
                        className="text-[10px] px-2 py-0.5 rounded-full font-medium"
                        style={{ backgroundColor: "var(--dashboard-card-bg)", color: "var(--dashboard-main-text-muted)" }}
                      >
                        {p.status === "completed" ? "Tamamlandı" : p.status}
                      </span>
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
                    {p.meals.length > 0 && (
                      <div className="space-y-1">
                        {p.meals.map((meal) => (
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
                    {p.coachNotes && (
                      <p className="text-xs italic" style={{ color: "var(--dashboard-main-text-muted)" }}>Not: {p.coachNotes}</p>
                    )}
                  </div>
                </details>
              ))}
            </div>
          )}
        </div>
      </AccordionSection>

      {/* Yemek Fotoğrafları — stream edilir */}
      <Suspense fallback={<SectionSkeleton title="Yemek Fotoğrafları" />}>
        <MealPhotosSection domain={domain} studentId={studentId} />
      </Suspense>

      {/* Check-in & Fotoğraflar (haftalık görünüm) — #10: aktiviteyle birlikte default açık */}
      {weekCheckIns.length > 0 && (
        <AccordionSection title="Check-in & Fotoğraflar" count={weekCheckIns.length} defaultOpen>
          <CheckInWeekView domain={domain} weeks={weekCheckIns} />
        </AccordionSection>
      )}

      {/* İlerleme Grafikleri */}
      {checkInsData.length >= 2 && (
        <AccordionSection title="İlerleme Grafikleri">
          <div className="space-y-6">
            {checkInsData.filter((c) => c.weight != null).length >= 2 && (
              <div>
                <p className="text-sm font-medium mb-1" style={{ color: "var(--dashboard-main-text-muted)" }}>Kilo Değişimi</p>
                <WeightChart
                  data={checkInsData
                    .filter((c) => c.weight != null)
                    .map((c) => ({
                      week: c.weekNumber,
                      date: c.date,
                      weight: c.weight!,
                    }))}
                />
              </div>
            )}
            <div>
              <p className="text-sm font-medium mb-1" style={{ color: "var(--dashboard-main-text-muted)" }}>Vücut Ölçüleri</p>
              <MeasurementsChart
                data={checkInsData.map((c) => ({
                  week: c.weekNumber,
                  date: c.date,
                  chest: c.chest,
                  waist: c.waist,
                  hips: c.hips,
                  arms: c.arms,
                  thighs: c.thighs,
                }))}
              />
            </div>
          </div>
        </AccordionSection>
      )}

      {/* Koç Notları */}
      <AccordionSection title="Koç Notları">
        <StudentNotes
          domain={domain}
          studentId={studentId}
          initialNotes={student.coachNotes || ""}
          embedded
        />
      </AccordionSection>

      {/* Paket Bilgisi */}
      <AccordionSection title="Paket Bilgisi">
        {student.coachPackage ? (() => {
          const durationWeeks = student.coachPackage.duration;
          const startDate = new Date(student.startDate);
          const endDate = new Date(startDate);
          endDate.setDate(endDate.getDate() + durationWeeks * 7);
          const now = new Date();
          const remainingMs = endDate.getTime() - now.getTime();
          const remainingWeeks = Math.max(0, Math.ceil(remainingMs / (7 * 24 * 60 * 60 * 1000)));
          const isExpired = remainingMs <= 0;

          return (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div>
                <p className="text-xs" style={{ color: "var(--dashboard-main-text-muted)" }}>Paket</p>
                <p className="text-sm font-semibold mt-1">{student.coachPackage.name}</p>
              </div>
              <div>
                <p className="text-xs" style={{ color: "var(--dashboard-main-text-muted)" }}>Başlangıç</p>
                <p className="text-sm font-semibold mt-1">{startDate.toLocaleDateString("tr-TR")}</p>
              </div>
              <div>
                <p className="text-xs" style={{ color: "var(--dashboard-main-text-muted)" }}>Bitiş</p>
                <p className="text-sm font-semibold mt-1">{endDate.toLocaleDateString("tr-TR")}</p>
              </div>
              <div>
                <p className="text-xs" style={{ color: "var(--dashboard-main-text-muted)" }}>Kalan Süre</p>
                <p className={`text-sm font-semibold mt-1 ${isExpired ? "text-red-400" : remainingWeeks <= 2 ? "text-yellow-400" : ""}`}>
                  {isExpired ? "Süresi doldu" : `${remainingWeeks} hafta`}
                </p>
              </div>
            </div>
          );
        })() : (
          <p className="text-sm" style={{ color: "var(--dashboard-main-text-muted)" }}>Henüz paket atanmamış</p>
        )}
      </AccordionSection>
      </div>
    </div>
  );
}

/* ───────────────────────── Stream edilen bölümler ─────────────────────────
 * Aşağıdaki async server component'ler kendi verilerini çeker ve <Suspense>
 * ile sarılıdır. Böylece ağır olmayan sayfa kabuğu (header, program, beslenme,
 * grafikler) bu sorguları beklemeden anında render edilir; bu bölümler hazır
 * oldukça akarak yerleşir. */

function SectionSkeleton({ title, defaultOpen = false }: { title: string; defaultOpen?: boolean }) {
  return (
    <AccordionSection title={title} defaultOpen={defaultOpen}>
      <div className="space-y-3 animate-pulse">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="h-12 rounded-lg" style={{ backgroundColor: "var(--dashboard-card-border)", opacity: 0.4 }} />
        ))}
      </div>
    </AccordionSection>
  );
}

async function MealPhotosSection({ domain, studentId }: { domain: string; studentId: string }) {
  const mealLogWindow = await getStudentMealLogForCoach(domain, studentId, 30);
  return (
    <AccordionSection
      title="Yemek Fotoğrafları"
      count={mealLogWindow.days.reduce((acc, d) => acc + d.entries.length, 0)}
    >
      <MealLogCoachView window={mealLogWindow} />
    </AccordionSection>
  );
}
