import { Card, CardContent } from "@/components/ui/card";
import { getStudentTraining, getStudentOrGuest } from "../actions";
import { TrainingProgramView, type ViewWeek } from "@/components/student/training-program-view";
import { GuestPreview } from "@/components/student/guest-preview";

export default async function StudentTrainingPage({
  params,
}: {
  params: Promise<{ domain: string }>;
}) {
  const { domain } = await params;
  const gate = await getStudentOrGuest(domain);
  if (gate.kind === "guest") {
    return (
      <div className="py-6">
        <GuestPreview page="training" />
      </div>
    );
  }
  const { trainingPlan } = await getStudentTraining(domain);

  const cardStyle = {
    backgroundColor: "var(--dashboard-card-bg)",
    borderColor: "var(--dashboard-card-border)",
    color: "var(--dashboard-main-text)",
  };

  if (!trainingPlan || !trainingPlan.program) {
    return (
      <div className="space-y-6 py-6">
        <h1 className="font-heading text-xl font-bold" style={{ color: "var(--dashboard-main-text)" }}>Antrenman Programı</h1>
        <Card style={cardStyle}>
          <CardContent className="py-12 text-center">
            <p className="text-4xl mb-4">💪</p>
            <p className="text-lg mb-2" style={{ color: "var(--dashboard-main-text-muted)" }}>
              Henüz antrenman programı atanmadı
            </p>
            <p className="text-sm" style={{ color: "var(--dashboard-main-text-muted)", opacity: 0.7 }}>
              Koçun sana bir program atadığında burada görünecek
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  const program = trainingPlan.program;

  // Haftalara göre grupla → { week, workouts[] } (hafta ve gün sıralı)
  const weekMap = new Map<number, ViewWeek>();
  for (const w of program.workouts) {
    let entry = weekMap.get(w.weekNumber);
    if (!entry) {
      entry = { week: w.weekNumber, workouts: [] };
      weekMap.set(w.weekNumber, entry);
    }
    entry.workouts.push({
      id: w.id,
      name: w.name,
      dayOfWeek: w.dayOfWeek,
      exercises: w.exercises.map((we) => ({
        id: we.id,
        name: we.exercise.name,
        sets: we.sets,
        reps: we.reps,
        restSeconds: we.restSeconds,
        alternatives: we.alternatives.map((a) => a.alternativeExercise.name),
      })),
    });
  }
  const weeks: ViewWeek[] = [...weekMap.values()].sort((a, b) => a.week - b.week);
  weeks.forEach((wk) => wk.workouts.sort((a, b) => a.dayOfWeek - b.dayOfWeek));

  // Öğrenciye hafta seçtirmiyoruz: koç programı atarken süreyi zaten belirledi ve program
  // tek haftalık şablonun tekrarıdır. İlk (temsili) haftayı gösteriyoruz — tüm günleri içerir —
  // ve öğrenci sadece gün seçer. (Bileşen tek hafta olunca hafta seçicisini hiç göstermez.)
  const displayWeeks: ViewWeek[] = weeks.length > 0 ? [weeks[0]] : [];

  return (
    <div className="space-y-5 py-6">
      <div>
        <h1 className="font-heading text-xl font-bold" style={{ color: "var(--dashboard-main-text)" }}>Antrenman Programı</h1>
        <p className="text-sm mt-1" style={{ color: "var(--dashboard-main-text-muted)" }}>
          {program.name}
        </p>
      </div>

      {displayWeeks.length === 0 ? (
        <Card style={cardStyle}>
          <CardContent className="py-12 text-center">
            <p className="text-sm" style={{ color: "var(--dashboard-main-text-muted)" }}>
              Bu programda henüz antrenman günü tanımlanmamış.
            </p>
          </CardContent>
        </Card>
      ) : (
        <TrainingProgramView weeks={displayWeeks} />
      )}
    </div>
  );
}
