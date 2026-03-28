"use client";

import { useState, useTransition, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  addWorkout,
  deleteWorkout,
  addExerciseToWorkout,
  removeExerciseFromWorkout,
  updateWorkoutExercise,
  reorderWorkoutExercise,
} from "@/app/site/[domain]/dashboard/programs/actions";
import { useRouter } from "next/navigation";

const DAY_NAMES = ["", "Pazartesi", "Salı", "Çarşamba", "Perşembe", "Cuma", "Cumartesi", "Pazar"];

interface Exercise {
  id: string;
  name: string;
  category: string;
}

interface WorkoutExerciseData {
  id: string;
  sets: number;
  reps: string;
  restSeconds: number | null;
  notes: string | null;
  orderIndex: number;
  exercise: { id: string; name: string; category: string };
}

interface Workout {
  id: string;
  weekNumber: number;
  dayOfWeek: number;
  name: string;
  exercises: WorkoutExerciseData[];
}

interface Program {
  id: string;
  name: string;
  description: string | null;
  weeks: number;
  workouts: Workout[];
}

const inputStyle = {
  backgroundColor: "var(--dashboard-card-bg)",
  borderColor: "var(--dashboard-card-border)",
  color: "var(--dashboard-main-text)",
};

export default function ProgramBuilder({
  domain,
  program,
  exercises,
}: {
  domain: string;
  program: Program;
  exercises: Exercise[];
}) {
  const router = useRouter();
  const [selectedWeek, setSelectedWeek] = useState(1);
  const [loading, setLoading] = useState(false);
  const [saveStatus, setSaveStatus] = useState<"idle" | "saving" | "saved">("idle");
  const [showAddWorkout, setShowAddWorkout] = useState(false);
  const [newWorkoutDay, setNewWorkoutDay] = useState(1);
  const [newWorkoutName, setNewWorkoutName] = useState("");
  const [addingExerciseTo, setAddingExerciseTo] = useState<string | null>(null);
  const [exerciseSearch, setExerciseSearch] = useState("");
  const [newSets, setNewSets] = useState(3);
  const [newReps, setNewReps] = useState("10");
  const [newRest, setNewRest] = useState(60);
  const [editingWE, setEditingWE] = useState<string | null>(null);

  const [localProgram, setLocalProgram] = useState<Program>(program);
  useEffect(() => {
    setLocalProgram(program);
  }, [program]);

  const refreshWithStatus = () => {
    setSaveStatus("saving");
    router.refresh();
    setTimeout(() => {
      setSaveStatus("saved");
      setTimeout(() => setSaveStatus("idle"), 2000);
    }, 500);
  };

  const weekWorkouts = localProgram.workouts
    .filter((w) => w.weekNumber === selectedWeek)
    .sort((a, b) => a.dayOfWeek - b.dayOfWeek);

  const filteredExercises = exercises.filter(
    (e) =>
      e.name.toLowerCase().includes(exerciseSearch.toLowerCase()) ||
      e.category.toLowerCase().includes(exerciseSearch.toLowerCase())
  );

  const handleAddWorkout = async () => {
    if (!newWorkoutName.trim()) return;
    setLoading(true);

    const tempId = `temp-${Date.now()}`;
    const newWorkout: Workout = {
      id: tempId,
      weekNumber: selectedWeek,
      dayOfWeek: newWorkoutDay,
      name: newWorkoutName.trim(),
      exercises: [],
    };

    setLocalProgram((prev) => ({
      ...prev,
      workouts: [...prev.workouts, newWorkout]
    }));

    setNewWorkoutName("");
    setShowAddWorkout(false);
    setLoading(false);

    addWorkout(domain, localProgram.id, {
      weekNumber: selectedWeek,
      dayOfWeek: newWorkoutDay,
      name: newWorkoutName.trim(),
    }).then(() => {
      refreshWithStatus();
    });
  };

  const handleDeleteWorkout = async (workoutId: string) => {
    if (!confirm("Bu antrenman gününü silmek istediğine emin misin?")) return;
    setLoading(true);

    setLocalProgram((prev) => ({
      ...prev,
      workouts: prev.workouts.filter((w) => w.id !== workoutId)
    }));

    setLoading(false);
    deleteWorkout(domain, workoutId).then(() => {
      refreshWithStatus();
    });
  };

  const handleAddExercise = async (workoutId: string, exerciseId: string) => {
    setLoading(true);

    const exObj = exercises.find((e) => e.id === exerciseId);
    if (!exObj) {
      setLoading(false);
      return;
    }

    const tempId = `temp-${Date.now()}`;
    const newEx: WorkoutExerciseData = {
      id: tempId,
      sets: newSets,
      reps: newReps,
      restSeconds: newRest,
      notes: null,
      orderIndex: 0,
      exercise: { id: exObj.id, name: exObj.name, category: exObj.category }
    };

    setLocalProgram((prev) => ({
      ...prev,
      workouts: prev.workouts.map((w) =>
        w.id === workoutId ? { ...w, exercises: [...w.exercises, newEx] } : w
      )
    }));

    setAddingExerciseTo(null);
    setExerciseSearch("");
    setNewSets(3);
    setNewReps("10");
    setNewRest(60);
    setLoading(false);

    addExerciseToWorkout(domain, workoutId, {
      exerciseId,
      sets: newSets,
      reps: newReps,
      restSeconds: newRest,
    }).then(() => {
      refreshWithStatus();
    });
  };

  const handleRemoveExercise = async (weId: string) => {
    setLoading(true);

    setLocalProgram((prev) => ({
      ...prev,
      workouts: prev.workouts.map((w) => ({
        ...w,
        exercises: w.exercises.filter((e) => e.id !== weId)
      }))
    }));

    setLoading(false);
    removeExerciseFromWorkout(domain, weId).then(() => {
      refreshWithStatus();
    });
  };

  const handleReorder = async (workoutId: string, weId: string, direction: "up" | "down") => {
    // Optimistic reorder
    setLocalProgram((prev) => ({
      ...prev,
      workouts: prev.workouts.map((w) => {
        if (w.id !== workoutId) return w;
        const exs = [...w.exercises];
        const idx = exs.findIndex((e) => e.id === weId);
        const targetIdx = direction === "up" ? idx - 1 : idx + 1;
        if (targetIdx < 0 || targetIdx >= exs.length) return w;
        [exs[idx], exs[targetIdx]] = [exs[targetIdx], exs[idx]];
        return { ...w, exercises: exs };
      }),
    }));

    reorderWorkoutExercise(domain, weId, direction).then(() => {
      refreshWithStatus();
    });
  };

  const handleUpdateExercise = async (weId: string, sets: number, reps: string, rest: number) => {
    setLoading(true);

    setLocalProgram((prev) => ({
      ...prev,
      workouts: prev.workouts.map((w) => ({
        ...w,
        exercises: w.exercises.map((e) =>
          e.id === weId ? { ...e, sets, reps, restSeconds: rest } : e
        )
      }))
    }));

    setEditingWE(null);
    setLoading(false);
    updateWorkoutExercise(domain, weId, { sets, reps, restSeconds: rest }).then(() => {
      refreshWithStatus();
    });
  };

  return (
    <div className="space-y-6 py-6" style={{ color: "var(--dashboard-main-text)" }}>
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div>
            <h1 className="font-heading text-xl font-bold">{localProgram.name}</h1>
            {localProgram.description && (
              <p className="text-sm mt-1" style={{ color: "var(--dashboard-main-text-muted)" }}>{localProgram.description}</p>
            )}
          </div>
          {saveStatus !== "idle" && (
            <span
              className="text-xs px-2 py-1 rounded-full animate-fade-in"
              style={{
                backgroundColor: saveStatus === "saving"
                  ? "color-mix(in srgb, var(--dashboard-accent) 15%, transparent)"
                  : "color-mix(in srgb, #22c55e 15%, transparent)",
                color: saveStatus === "saving" ? "var(--dashboard-accent)" : "#22c55e",
              }}
            >
              {saveStatus === "saving" ? "Kaydediliyor..." : "Kaydedildi ✓"}
            </span>
          )}
        </div>
        <Button
          onClick={() => router.push(`/site/${domain}/dashboard/programs`)}
          className="border rounded-md px-4 py-2"
          style={{ backgroundColor: "transparent", borderColor: "var(--dashboard-card-border)", color: "var(--dashboard-main-text)" }}
        >
          Geri Dön
        </Button>
      </div>

      {/* Hafta Seçici */}
      <div className="flex gap-2 overflow-x-auto pb-2">
        {Array.from({ length: localProgram.weeks }, (_, i) => i + 1).map((week) => (
          <button
            key={week}
            onClick={() => setSelectedWeek(week)}
            className="px-4 py-2 rounded-lg text-sm whitespace-nowrap transition"
            style={
              selectedWeek === week
                ? { backgroundColor: "var(--dashboard-accent)", color: "var(--dashboard-accent-text)", fontWeight: 600 }
                : { backgroundColor: "var(--dashboard-card-bg)", color: "var(--dashboard-main-text-muted)" }
            }
          >
            Hafta {week}
          </button>
        ))}
      </div>

      {/* Antrenman Günleri */}
      {weekWorkouts.length === 0 ? (
        <Card style={{ backgroundColor: "var(--dashboard-card-bg)", borderColor: "var(--dashboard-card-border)" }}>
          <CardContent className="py-12 text-center" style={{ color: "var(--dashboard-main-text-muted)" }}>
            <p>Bu hafta için antrenman günü eklenmemiş.</p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {weekWorkouts.map((workout) => (
            <Card key={workout.id} style={{ backgroundColor: "var(--dashboard-card-bg)", borderColor: "var(--dashboard-card-border)" }}>
              <CardContent className="p-4">
                {/* Workout Header */}
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h3 className="font-semibold" style={{ color: "var(--dashboard-main-text)" }}>{workout.name}</h3>
                    <p className="text-xs" style={{ color: "var(--dashboard-main-text-muted)" }}>{DAY_NAMES[workout.dayOfWeek]}</p>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => {
                        setAddingExerciseTo(addingExerciseTo === workout.id ? null : workout.id);
                      }}
                      className="text-xs px-3 py-1 rounded-md font-semibold"
                      style={{ backgroundColor: "var(--dashboard-accent)", color: "var(--dashboard-accent-text)" }}
                    >
                      + Egzersiz
                    </button>
                    <button
                      onClick={() => handleDeleteWorkout(workout.id)}
                      className="text-xs px-3 py-1 text-red-400 hover:bg-red-400/10 rounded-md"
                    >
                      Sil
                    </button>
                  </div>
                </div>

                {/* Egzersiz Listesi */}
                {workout.exercises.length > 0 && (
                  <div className="space-y-2 mb-3">
                    {workout.exercises.map((we, idx) => (
                      <div
                        key={we.id}
                        className="flex items-center gap-3 py-2 px-3 rounded-lg"
                        style={{ backgroundColor: "color-mix(in srgb, var(--dashboard-accent) 3%, var(--dashboard-card-bg))" }}
                      >
                        <div className="flex flex-col gap-0.5">
                          <button
                            onClick={() => handleReorder(workout.id, we.id, "up")}
                            disabled={idx === 0}
                            className="text-[10px] px-1 py-0 rounded transition disabled:opacity-20"
                            style={{ color: "var(--dashboard-main-text-muted)" }}
                            aria-label="Yukarı taşı"
                          >
                            ▲
                          </button>
                          <button
                            onClick={() => handleReorder(workout.id, we.id, "down")}
                            disabled={idx === workout.exercises.length - 1}
                            className="text-[10px] px-1 py-0 rounded transition disabled:opacity-20"
                            style={{ color: "var(--dashboard-main-text-muted)" }}
                            aria-label="Aşağı taşı"
                          >
                            ▼
                          </button>
                        </div>
                        <span className="text-xs w-5" style={{ color: "var(--dashboard-main-text-muted)", opacity: 0.6 }}>{idx + 1}</span>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium truncate" style={{ color: "var(--dashboard-main-text)" }}>{we.exercise.name}</p>
                          <p className="text-xs" style={{ color: "var(--dashboard-main-text-muted)" }}>{we.exercise.category}</p>
                        </div>
                        {editingWE === we.id ? (
                          <EditExerciseInline
                            we={we}
                            onSave={(s, r, rest) => handleUpdateExercise(we.id, s, r, rest)}
                            onCancel={() => setEditingWE(null)}
                          />
                        ) : (
                          <>
                            <div className="text-xs flex gap-3" style={{ color: "var(--dashboard-main-text-muted)" }}>
                              <span>{we.sets}x{we.reps}</span>
                              <span>{we.restSeconds ?? 60}s</span>
                            </div>
                            <button
                              onClick={() => setEditingWE(we.id)}
                              className="text-xs px-1"
                              style={{ color: "var(--dashboard-main-text-muted)" }}
                              aria-label={`${we.exercise.name} düzenle`}
                            >
                              ✏️
                            </button>
                            <button
                              onClick={() => handleRemoveExercise(we.id)}
                              className="text-xs text-red-400/50 hover:text-red-400 px-1"
                              aria-label={`${we.exercise.name} kaldır`}
                            >
                              ✕
                            </button>
                          </>
                        )}
                      </div>
                    ))}
                  </div>
                )}

                {/* Egzersiz Ekleme Paneli */}
                {addingExerciseTo === workout.id && (
                  <div className="pt-3 mt-3 space-y-3" style={{ borderTop: "1px solid var(--dashboard-card-border)" }}>
                    <Input
                      value={exerciseSearch}
                      onChange={(e) => setExerciseSearch(e.target.value)}
                      placeholder="Egzersiz ara..."
                      className="text-sm"
                      style={inputStyle}
                    />
                    <div className="flex gap-3">
                      <div className="flex items-center gap-1">
                        <label className="text-xs" style={{ color: "var(--dashboard-main-text-muted)" }}>Set:</label>
                        <Input
                          type="number"
                          value={newSets}
                          onChange={(e) => setNewSets(Number(e.target.value))}
                          className="w-16 text-sm"
                          style={inputStyle}
                          min={1}
                        />
                      </div>
                      <div className="flex items-center gap-1">
                        <label className="text-xs" style={{ color: "var(--dashboard-main-text-muted)" }}>Tekrar:</label>
                        <Input
                          value={newReps}
                          onChange={(e) => setNewReps(e.target.value)}
                          className="w-20 text-sm"
                          style={inputStyle}
                          placeholder="10"
                        />
                      </div>
                      <div className="flex items-center gap-1">
                        <label className="text-xs" style={{ color: "var(--dashboard-main-text-muted)" }}>Din.(s):</label>
                        <Input
                          type="number"
                          value={newRest}
                          onChange={(e) => setNewRest(Number(e.target.value))}
                          className="w-20 text-sm"
                          style={inputStyle}
                          min={0}
                          step={15}
                        />
                      </div>
                    </div>
                    <div className="max-h-48 overflow-y-auto space-y-1">
                      {filteredExercises.length === 0 ? (
                        <p className="text-xs text-center py-4" style={{ color: "var(--dashboard-main-text-muted)" }}>
                          {exercises.length === 0
                            ? "Önce egzersiz kütüphanesine egzersiz ekleyin"
                            : "Eşleşen egzersiz bulunamadı"}
                        </p>
                      ) : (
                        filteredExercises.map((ex) => (
                          <button
                            key={ex.id}
                            onClick={() => handleAddExercise(workout.id, ex.id)}
                            disabled={loading}
                            className="w-full flex items-center gap-3 px-3 py-2 text-left rounded-lg transition text-sm"
                            style={{ color: "var(--dashboard-main-text)" }}
                          >
                            <span className="flex-1">{ex.name}</span>
                            <span className="text-xs" style={{ color: "var(--dashboard-main-text-muted)" }}>{ex.category}</span>
                          </button>
                        ))
                      )}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Yeni Antrenman Günü Ekle */}
      {showAddWorkout ? (
        <Card style={{ backgroundColor: "var(--dashboard-card-bg)", borderColor: "var(--dashboard-card-border)" }}>
          <CardContent className="p-4 space-y-3">
            <h3 className="font-semibold text-sm">Yeni Antrenman Günü</h3>
            <div className="flex gap-3">
              <select
                value={newWorkoutDay}
                onChange={(e) => setNewWorkoutDay(Number(e.target.value))}
                className="rounded-md px-3 py-2 text-sm"
                style={{ ...inputStyle, border: "1px solid var(--dashboard-card-border)" }}
              >
                {[1, 2, 3, 4, 5, 6, 7].map((d) => (
                  <option key={d} value={d}>{DAY_NAMES[d]}</option>
                ))}
              </select>
              <Input
                value={newWorkoutName}
                onChange={(e) => setNewWorkoutName(e.target.value)}
                placeholder="Örn: Göğüs + Triceps"
                className="text-sm flex-1"
                style={inputStyle}
              />
            </div>
            <div className="flex gap-2">
              <Button
                onClick={handleAddWorkout}
                disabled={loading || !newWorkoutName.trim()}
                className="font-semibold text-sm hover:opacity-90"
                style={{ backgroundColor: "var(--dashboard-accent)", color: "var(--dashboard-accent-text)" }}
              >
                {loading ? "..." : "Ekle"}
              </Button>
              <Button
                onClick={() => setShowAddWorkout(false)}
                className="border rounded-md px-4 py-2 text-sm"
                style={{ backgroundColor: "transparent", borderColor: "var(--dashboard-card-border)", color: "var(--dashboard-main-text)" }}
              >
                İptal
              </Button>
            </div>
          </CardContent>
        </Card>
      ) : (
        <button
          onClick={() => setShowAddWorkout(true)}
          className="w-full py-3 border border-dashed rounded-lg text-sm transition"
          style={{ borderColor: "var(--dashboard-card-border)", color: "var(--dashboard-main-text-muted)" }}
        >
          + Antrenman Günü Ekle
        </button>
      )}
    </div>
  );
}

// Inline düzenleme bileşeni
function EditExerciseInline({
  we,
  onSave,
  onCancel,
}: {
  we: WorkoutExerciseData;
  onSave: (sets: number, reps: string, rest: number) => void;
  onCancel: () => void;
}) {
  const [sets, setSets] = useState(we.sets);
  const [reps, setReps] = useState(we.reps);
  const [rest, setRest] = useState(we.restSeconds ?? 60);

  return (
    <div className="flex items-center gap-2">
      <Input
        type="number"
        value={sets}
        onChange={(e) => setSets(Number(e.target.value))}
        className="w-14 text-xs h-7"
        style={{
          backgroundColor: "var(--dashboard-card-bg)",
          borderColor: "var(--dashboard-card-border)",
          color: "var(--dashboard-main-text)",
        }}
        min={1}
      />
      <span className="text-xs" style={{ color: "var(--dashboard-main-text-muted)" }}>x</span>
      <Input
        value={reps}
        onChange={(e) => setReps(e.target.value)}
        className="w-16 text-xs h-7"
        style={{
          backgroundColor: "var(--dashboard-card-bg)",
          borderColor: "var(--dashboard-card-border)",
          color: "var(--dashboard-main-text)",
        }}
      />
      <Input
        type="number"
        value={rest}
        onChange={(e) => setRest(Number(e.target.value))}
        className="w-16 text-xs h-7"
        style={{
          backgroundColor: "var(--dashboard-card-bg)",
          borderColor: "var(--dashboard-card-border)",
          color: "var(--dashboard-main-text)",
        }}
        min={0}
        step={15}
      />
      <button onClick={() => onSave(sets, reps, rest)} className="text-xs text-green-400 px-1">✓</button>
      <button onClick={onCancel} className="text-xs px-1" style={{ color: "var(--dashboard-main-text-muted)" }}>✕</button>
    </div>
  );
}
