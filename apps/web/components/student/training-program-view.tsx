"use client";

import { useMemo, useState } from "react";
import {
  WORKOUT_SECTIONS,
  SECTION_META,
  toWorkoutSection,
  formatCardio,
} from "@/lib/constants/workout-sections";

export type ViewExercise = {
  id: string;
  name: string;
  sets: number;
  reps: string;
  restSeconds: number | null;
  notes: string | null;
  section: string;
  durationMinutes: number | null;
  intensity: string | null;
  cardioType: string | null;
  alternatives: string[];
};

export type ViewWorkout = {
  id: string;
  name: string;
  dayOfWeek: number;
  notes: string | null;
  exercises: ViewExercise[];
};

export type ViewWeek = {
  week: number;
  workouts: ViewWorkout[];
};

const DAY_SHORT = ["", "Pzt", "Sal", "Çar", "Per", "Cum", "Cmt", "Paz"];
const DAY_LONG = ["", "Pazartesi", "Salı", "Çarşamba", "Perşembe", "Cuma", "Cumartesi", "Pazar"];

export function TrainingProgramView({ weeks }: { weeks: ViewWeek[] }) {
  const [weekIdx, setWeekIdx] = useState(0);
  const [dayState, setDayState] = useState<number | null>(null);

  const week = weeks[weekIdx] ?? weeks[0];

  // Bu haftada antrenman olan günler (sıralı, tekrarsız)
  const days = useMemo(() => {
    const set = new Set<number>();
    week.workouts.forEach((w) => set.add(w.dayOfWeek));
    return [...set].sort((a, b) => a - b);
  }, [week]);

  // Seçili gün — kullanıcı seçtiyse ve o haftada varsa onu, yoksa ilk günü kullan
  const selectedDay = dayState != null && days.includes(dayState) ? dayState : days[0];
  const dayWorkouts = week.workouts.filter((w) => w.dayOfWeek === selectedDay);

  return (
    <div className="space-y-5">
      {/* ── Hafta seçici (en üstte, sıralı) ── */}
      {weeks.length > 1 && (
        <div className="flex gap-2 overflow-x-auto pb-1 -mx-1 px-1">
          {weeks.map((w, i) => {
            const active = i === weekIdx;
            return (
              <button
                key={w.week}
                type="button"
                onClick={() => setWeekIdx(i)}
                className="shrink-0 px-4 py-2 rounded-xl text-sm font-semibold transition-all"
                style={{
                  backgroundColor: active
                    ? "var(--dashboard-accent)"
                    : "var(--dashboard-card-bg)",
                  color: active
                    ? "var(--dashboard-accent-text)"
                    : "var(--dashboard-main-text-muted)",
                  border: `1px solid ${active ? "var(--dashboard-accent)" : "var(--dashboard-card-border)"}`,
                }}
              >
                Hafta {w.week}
              </button>
            );
          })}
        </div>
      )}

      {/* ── Gün seçici ── */}
      <div className="flex gap-2 overflow-x-auto pb-1 -mx-1 px-1">
        {days.map((d) => {
          const active = d === selectedDay;
          return (
            <button
              key={d}
              type="button"
              onClick={() => setDayState(d)}
              className="shrink-0 flex flex-col items-center justify-center min-w-[52px] px-3 py-2 rounded-xl transition-all"
              style={{
                backgroundColor: active
                  ? "color-mix(in srgb, var(--dashboard-accent) 14%, var(--dashboard-card-bg))"
                  : "var(--dashboard-card-bg)",
                border: `1px solid ${active ? "var(--dashboard-accent)" : "var(--dashboard-card-border)"}`,
              }}
            >
              <span
                className="text-sm font-bold"
                style={{ color: active ? "var(--dashboard-accent)" : "var(--dashboard-main-text)" }}
              >
                {DAY_SHORT[d]}
              </span>
            </button>
          );
        })}
      </div>

      {/* ── Seçili günün programı ── */}
      <div className="space-y-3">
        {dayWorkouts.map((workout) => (
          <div
            key={workout.id}
            className="rounded-2xl overflow-hidden"
            style={{
              backgroundColor: "var(--dashboard-card-bg)",
              border: "1px solid var(--dashboard-card-border)",
            }}
          >
            <div
              className="px-4 py-3 flex items-center justify-between gap-2"
              style={{ borderBottom: "1px solid var(--dashboard-card-border)" }}
            >
              <span className="font-semibold" style={{ color: "var(--dashboard-main-text)" }}>
                {workout.name}
              </span>
              <span className="text-xs font-medium" style={{ color: "var(--dashboard-main-text-muted)" }}>
                {DAY_LONG[workout.dayOfWeek]}
              </span>
            </div>
            {workout.notes && (
              <p
                className="px-4 py-2.5 text-xs italic"
                style={{
                  backgroundColor: "color-mix(in srgb, var(--dashboard-accent) 6%, transparent)",
                  color: "var(--dashboard-main-text)",
                  borderBottom: "1px solid var(--dashboard-card-border)",
                }}
              >
                📌 {workout.notes}
              </p>
            )}

            {/* Bölümler: ana antrenman / karın / kardiyo — boş olan gösterilmez */}
            {(() => {
              const filled = WORKOUT_SECTIONS.filter((s) =>
                workout.exercises.some((e) => toWorkoutSection(e.section) === s)
              );
              // Tek bölüm ve o da ana antrenmansa başlık gösterme (sade görünüm korunur)
              const showHeaders = filled.length > 1 || (filled.length === 1 && filled[0] !== "MAIN");

              return filled.map((sec) => {
                const list = workout.exercises.filter((e) => toWorkoutSection(e.section) === sec);
                const isCardio = sec === "CARDIO";
                return (
                  <div key={sec}>
                    {showHeaders && (
                      <p
                        className="px-4 py-1.5 text-[11px] font-semibold uppercase tracking-wider"
                        style={{
                          color: "var(--dashboard-main-text-muted)",
                          backgroundColor: "color-mix(in srgb, var(--dashboard-accent) 4%, transparent)",
                        }}
                      >
                        {SECTION_META[sec].icon} {SECTION_META[sec].label}
                      </p>
                    )}
                    <ul className="divide-y px-4" style={{ borderColor: "var(--dashboard-card-border)" }}>
                      {list.map((ex) => (
                        <li key={ex.id} className="py-2.5 first:pt-3 last:pb-3">
                          <div className="flex items-baseline justify-between gap-3">
                            <p className="text-sm font-medium" style={{ color: "var(--dashboard-main-text)" }}>
                              {ex.name}
                            </p>
                            <span className="shrink-0 text-xs font-semibold" style={{ color: "var(--dashboard-main-text-muted)" }}>
                              {isCardio ? `${ex.durationMinutes ?? "-"} dk` : `${ex.sets} × ${ex.reps}`}
                            </span>
                          </div>
                          {isCardio ? (
                            <p className="text-xs mt-0.5" style={{ color: "var(--dashboard-main-text-muted)", opacity: 0.7 }}>
                              {formatCardio({ cardioType: ex.cardioType, intensity: ex.intensity })}
                            </p>
                          ) : ex.restSeconds ? (
                            <p className="text-xs mt-0.5" style={{ color: "var(--dashboard-main-text-muted)", opacity: 0.7 }}>
                              {ex.restSeconds}s dinlenme
                            </p>
                          ) : null}
                          {ex.notes && (
                            <p className="text-xs mt-1 italic" style={{ color: "var(--dashboard-main-text)", opacity: 0.8 }}>
                              {ex.notes}
                            </p>
                          )}
                          {ex.alternatives.length > 0 && (
                            <p className="text-xs mt-1" style={{ color: "var(--dashboard-main-text-muted)" }}>
                              <span style={{ opacity: 0.7 }}>Alternatif: </span>
                              {ex.alternatives.join(", ")}
                            </p>
                          )}
                        </li>
                      ))}
                    </ul>
                  </div>
                );
              });
            })()}
          </div>
        ))}
        {dayWorkouts.length === 0 && (
          <p className="text-center text-sm py-8" style={{ color: "var(--dashboard-main-text-muted)" }}>
            Bu gün için antrenman yok.
          </p>
        )}
      </div>
    </div>
  );
}
