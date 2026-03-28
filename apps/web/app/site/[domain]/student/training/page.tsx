import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getStudentTraining } from "../actions";

export default async function StudentTrainingPage({
  params,
}: {
  params: Promise<{ domain: string }>;
}) {
  const { domain } = await params;
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
  const workoutsByWeek: Record<number, typeof program.workouts> = {};
  program.workouts.forEach((w) => {
    if (!workoutsByWeek[w.weekNumber]) workoutsByWeek[w.weekNumber] = [];
    workoutsByWeek[w.weekNumber].push(w);
  });

  const dayNames = ["", "Pzt", "Sal", "Çar", "Per", "Cum", "Cmt", "Paz"];

  return (
    <div className="space-y-6 py-6">
      <div>
        <h1 className="font-heading text-xl font-bold" style={{ color: "var(--dashboard-main-text)" }}>Antrenman Programı</h1>
        <p className="text-sm mt-1" style={{ color: "var(--dashboard-main-text-muted)" }}>{program.name}</p>
      </div>

      {Object.entries(workoutsByWeek).map(([week, workouts]) => (
        <div key={week}>
          <h2 className="text-sm font-semibold mb-3" style={{ color: "var(--dashboard-main-text-muted)" }}>
            Hafta {week}
          </h2>
          <div className="space-y-3">
            {workouts.map((workout) => (
              <Card key={workout.id} style={cardStyle}>
                <CardHeader className="pb-2">
                  <CardTitle className="text-base flex items-center justify-between">
                    <span>{workout.name}</span>
                    <span className="text-xs font-normal" style={{ color: "var(--dashboard-main-text-muted)" }}>
                      {dayNames[workout.dayOfWeek]}
                    </span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {workout.exercises.map((we) => (
                      <div
                        key={we.id}
                        className="flex items-center justify-between py-1 last:border-0"
                        style={{ borderBottom: "1px solid var(--dashboard-card-border)" }}
                      >
                        <span className="text-sm">{we.exercise.name}</span>
                        <span className="text-xs" style={{ color: "var(--dashboard-main-text-muted)" }}>
                          {we.sets} x {we.reps}
                          {we.restSeconds
                            ? ` (${we.restSeconds}s dinlenme)`
                            : ""}
                        </span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
