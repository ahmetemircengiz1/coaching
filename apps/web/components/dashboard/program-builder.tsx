"use client";

import { useState, useTransition, useEffect } from "react";
import { toast } from "sonner";
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
  cloneWeekTo,
  setExerciseAlternatives,
  updateProgram,
} from "@/app/site/[domain]/dashboard/programs/actions";
import { createExercise } from "@/app/site/[domain]/dashboard/exercises/actions";
import { Pencil } from "lucide-react";
import { ConfirmDialog, useConfirmDialog } from "@/components/dashboard/confirm-dialog";
import { AssignToStudentsModal } from "@/components/dashboard/assign-to-students-modal";
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
  alternatives?: {
    id: string;
    alternativeExercise: { id: string; name: string; category: string };
  }[];
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
  const { confirm, dialogProps } = useConfirmDialog();
  const [saveStatus, setSaveStatus] = useState<"idle" | "saving" | "saved">("idle");
  const [showAddWorkout, setShowAddWorkout] = useState(false);
  const [newWorkoutDay, setNewWorkoutDay] = useState(1);
  const [newWorkoutName, setNewWorkoutName] = useState("");
  const [addingExerciseTo, setAddingExerciseTo] = useState<string | null>(null);
  const [showAssignModal, setShowAssignModal] = useState(false);
  const [showCloneWeek, setShowCloneWeek] = useState(false);
  const [cloneTargets, setCloneTargets] = useState<Set<number>>(new Set());
  const [cloning, setCloning] = useState(false);

  const handleCloneWeek = async () => {
    if (cloneTargets.size === 0) return;
    setCloning(true);
    const result = await cloneWeekTo(domain, localProgram.id, selectedWeek, Array.from(cloneTargets));
    setCloning(false);

    if (!result.success) {
      toast.error(("error" in result && result.error) || "Kopyalama başarısız");
      return;
    }
    setShowCloneWeek(false);
    setCloneTargets(new Set());
    router.refresh();
  };

  const toggleCloneTarget = (week: number) => {
    setCloneTargets((prev) => {
      const next = new Set(prev);
      if (next.has(week)) next.delete(week);
      else next.add(week);
      return next;
    });
  };
  const [exerciseSearch, setExerciseSearch] = useState("");
  const [newSets, setNewSets] = useState(3);
  const [newReps, setNewReps] = useState("10");
  const [newRest, setNewRest] = useState(60);
  const [editingWE, setEditingWE] = useState<string | null>(null);

  const [localProgram, setLocalProgram] = useState<Program>(program);
  useEffect(() => {
    setLocalProgram(program);
  }, [program]);

  // Custom egzersiz akışı için lokal kopya — yeni oluşturulanlar listeye eklenir.
  const [localExercises, setLocalExercises] = useState<Exercise[]>(exercises);
  useEffect(() => {
    setLocalExercises(exercises);
  }, [exercises]);
  const [creatingExercise, setCreatingExercise] = useState(false);

  // Program adı rename state'i
  const [renamingProgram, setRenamingProgram] = useState(false);
  const [programNameDraft, setProgramNameDraft] = useState(localProgram.name);
  useEffect(() => {
    setProgramNameDraft(localProgram.name);
  }, [localProgram.name]);

  const handleSaveProgramName = async () => {
    const next = programNameDraft.trim();
    if (!next || next === localProgram.name) {
      setRenamingProgram(false);
      setProgramNameDraft(localProgram.name);
      return;
    }
    // Optimistic
    setLocalProgram((prev) => ({ ...prev, name: next }));
    setRenamingProgram(false);
    const result = await updateProgram(domain, localProgram.id, {
      name: next,
      description: localProgram.description || undefined,
      weeks: localProgram.weeks,
    });
    if (!result.success) {
      toast.error(("error" in result && result.error) || "Program adı güncellenemedi");
      setLocalProgram((prev) => ({ ...prev, name: localProgram.name }));
      return;
    }
    refreshWithStatus();
  };

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

  const filteredExercises = localExercises.filter(
    (e) =>
      e.name.toLowerCase().includes(exerciseSearch.toLowerCase()) ||
      e.category.toLowerCase().includes(exerciseSearch.toLowerCase())
  );
  const trimmedSearch = exerciseSearch.trim();
  // Custom egzersiz önerisi: arama metni var, hiçbir egzersizin adıyla birebir eşleşmiyor.
  const hasExactMatch =
    trimmedSearch.length > 0 &&
    localExercises.some((e) => e.name.toLowerCase() === trimmedSearch.toLowerCase());
  const showCustomCreate = trimmedSearch.length >= 2 && !hasExactMatch;

  const handleCreateAndAddExercise = async (workoutId: string) => {
    if (!trimmedSearch || creatingExercise) return;
    setCreatingExercise(true);
    const result = await createExercise(domain, {
      name: trimmedSearch,
      category: "Diğer",
    });
    if (!result.success || !result.exercise) {
      toast.error("Egzersiz oluşturulamadı");
      setCreatingExercise(false);
      return;
    }
    // Yeni egzersizi lokal listeye ekle, sonra workout'a aktar
    const newEx: Exercise = {
      id: result.exercise.id,
      name: result.exercise.name,
      category: result.exercise.category,
    };
    setLocalExercises((prev) => [...prev, newEx]);
    setCreatingExercise(false);
    await handleAddExercise(workoutId, newEx.id);
  };

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
    const confirmed = await confirm({
      title: "Antrenman Gununu Sil",
      description: "Bu antrenman gunu ve icindeki tum egzersizler silinecek. Bu islem geri alinamaz.",
      confirmText: "Sil",
      variant: "danger",
    });
    if (!confirmed) return;
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

    const exObj = localExercises.find((e) => e.id === exerciseId);
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
            {renamingProgram ? (
              <Input
                autoFocus
                value={programNameDraft}
                onChange={(e) => setProgramNameDraft(e.target.value)}
                onBlur={handleSaveProgramName}
                onKeyDown={(e) => {
                  if (e.key === "Enter") handleSaveProgramName();
                  if (e.key === "Escape") {
                    setProgramNameDraft(localProgram.name);
                    setRenamingProgram(false);
                  }
                }}
                className="font-heading text-xl font-bold h-auto py-1 px-2"
                style={inputStyle}
              />
            ) : (
              <h1
                className="font-heading text-xl font-bold inline-flex items-center gap-2 group cursor-pointer"
                onClick={() => setRenamingProgram(true)}
                title="Tıklayıp adı değiştir"
              >
                {localProgram.name}
                <Pencil className="h-3.5 w-3.5 opacity-0 group-hover:opacity-60 transition-opacity" />
              </h1>
            )}
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
        <div className="flex items-center gap-2">
          <Button
            onClick={() => router.push(`/site/${domain}/dashboard/programs`)}
            className="border rounded-md px-4 py-2"
            style={{ backgroundColor: "transparent", borderColor: "var(--dashboard-card-border)", color: "var(--dashboard-main-text)" }}
          >
            Geri Dön
          </Button>
          <Button
            onClick={() => setShowAssignModal(true)}
            className="font-semibold hover:opacity-90 px-4 py-2"
            style={{ backgroundColor: "var(--dashboard-accent)", color: "var(--dashboard-accent-text)" }}
          >
            Öğrenciye Ata
          </Button>
        </div>
      </div>

      {/* Hafta Seçici + Klonlama */}
      <div className="space-y-2">
        <div className="flex items-center gap-2 flex-wrap">
          <div className="flex gap-2 overflow-x-auto pb-2 flex-1 min-w-0">
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
          {weekWorkouts.length > 0 && localProgram.weeks > 1 && (
            <button
              onClick={() => {
                setShowCloneWeek((v) => !v);
                setCloneTargets(new Set());
              }}
              className="shrink-0 text-xs px-3 py-2 rounded-lg border transition hover:bg-white/5"
              style={{
                borderColor: "var(--dashboard-card-border)",
                color: "var(--dashboard-main-text)",
              }}
              title={`Hafta ${selectedWeek}'i başka haftalara kopyala`}
            >
              ⧉ Bu haftayı kopyala
            </button>
          )}
        </div>

        {showCloneWeek && (
          <div
            className="p-3 rounded-lg border space-y-2"
            style={{
              backgroundColor: "color-mix(in srgb, var(--dashboard-accent) 4%, var(--dashboard-card-bg))",
              borderColor: "var(--dashboard-card-border)",
            }}
          >
            <p className="text-xs" style={{ color: "var(--dashboard-main-text-muted)" }}>
              <strong style={{ color: "var(--dashboard-main-text)" }}>Hafta {selectedWeek}</strong>'i hangi haftalara kopyalayacaksın? (Hedef haftalardaki dolu günler atlanır.)
            </p>
            <div className="flex gap-2 flex-wrap">
              {Array.from({ length: localProgram.weeks }, (_, i) => i + 1)
                .filter((w) => w !== selectedWeek)
                .map((w) => {
                  const checked = cloneTargets.has(w);
                  return (
                    <button
                      key={w}
                      onClick={() => toggleCloneTarget(w)}
                      className="px-3 py-1.5 rounded-md text-xs border transition"
                      style={
                        checked
                          ? {
                              backgroundColor: "var(--dashboard-accent)",
                              color: "var(--dashboard-accent-text)",
                              borderColor: "var(--dashboard-accent)",
                              fontWeight: 600,
                            }
                          : {
                              backgroundColor: "transparent",
                              borderColor: "var(--dashboard-card-border)",
                              color: "var(--dashboard-main-text-muted)",
                            }
                      }
                    >
                      Hafta {w}
                    </button>
                  );
                })}
            </div>
            <div className="flex items-center gap-2 pt-1">
              <Button
                onClick={handleCloneWeek}
                disabled={cloning || cloneTargets.size === 0}
                className="text-xs px-3 py-1.5 font-semibold hover:opacity-90 disabled:opacity-40"
                style={{ backgroundColor: "var(--dashboard-accent)", color: "var(--dashboard-accent-text)" }}
              >
                {cloning ? "Kopyalanıyor..." : `${cloneTargets.size} haftaya kopyala`}
              </Button>
              <Button
                onClick={() => {
                  setShowCloneWeek(false);
                  setCloneTargets(new Set());
                }}
                disabled={cloning}
                className="text-xs px-3 py-1.5 border rounded-md"
                style={{
                  backgroundColor: "transparent",
                  borderColor: "var(--dashboard-card-border)",
                  color: "var(--dashboard-main-text)",
                }}
              >
                İptal
              </Button>
            </div>
          </div>
        )}
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
                        className="rounded-lg"
                        style={{ backgroundColor: "color-mix(in srgb, var(--dashboard-accent) 3%, var(--dashboard-card-bg))" }}
                      >
                        <div className="flex items-center gap-3 py-2 px-3">
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
                        <ExerciseAlternativesEditor
                          domain={domain}
                          workoutExerciseId={we.id}
                          ownExerciseId={we.exercise.id}
                          allExercises={exercises}
                          initialAlternatives={we.alternatives ?? []}
                        />
                      </div>
                    ))}
                  </div>
                )}

                {/* Egzersiz Ekleme Paneli */}
                {addingExerciseTo === workout.id && (
                  <div className="pt-3 mt-3 space-y-3" style={{ borderTop: "1px solid var(--dashboard-card-border)" }}>
                    <div className="flex items-center gap-2">
                      <Input
                        value={exerciseSearch}
                        onChange={(e) => setExerciseSearch(e.target.value)}
                        placeholder="Egzersiz ara..."
                        className="text-sm flex-1"
                        style={inputStyle}
                      />
                      <a
                        href={`/site/${domain}/dashboard/exercises`}
                        className="shrink-0 text-xs underline whitespace-nowrap px-2 py-1.5 rounded transition-colors hover:bg-white/5"
                        style={{ color: "var(--dashboard-accent)" }}
                        title="Egzersiz kütüphanesini aç"
                      >
                        Kütüphaneyi aç
                      </a>
                    </div>
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
                      {filteredExercises.length === 0 && !showCustomCreate ? (
                        <p className="text-xs text-center py-4" style={{ color: "var(--dashboard-main-text-muted)" }}>
                          {localExercises.length === 0
                            ? 'Üstteki "Egzersiz ara" alanına bir ad yazıp "+ Yeni egzersiz" ile başla'
                            : "Aramaya devam et"}
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
                      {/* Custom egzersiz öner — listede yoksa "+ '<ad>' egzersizini oluştur ve ekle" */}
                      {showCustomCreate && (
                        <button
                          onClick={() => handleCreateAndAddExercise(workout.id)}
                          disabled={loading || creatingExercise}
                          className="w-full flex items-center gap-2 px-3 py-2 text-left rounded-lg transition text-sm border border-dashed"
                          style={{
                            borderColor: "var(--dashboard-accent)",
                            color: "var(--dashboard-accent)",
                          }}
                          title="Bu egzersizi kütüphanene ekle ve antrenmana koy"
                        >
                          <span className="font-semibold">+</span>
                          <span className="flex-1 truncate">
                            “{trimmedSearch}” egzersizini oluştur ve ekle
                          </span>
                          {creatingExercise && <span className="text-xs opacity-70">...</span>}
                        </button>
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
      <ConfirmDialog {...dialogProps} />

      <AssignToStudentsModal
        domain={domain}
        kind="program"
        planId={localProgram.id}
        planName={localProgram.name}
        open={showAssignModal}
        onClose={() => setShowAssignModal(false)}
        onAssigned={() => router.refresh()}
      />
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

// ── Alternatif Egzersiz Editörü ─────────────────────────────────────────
type AltExercise = { id: string; name: string; category: string };

function ExerciseAlternativesEditor({
  domain,
  workoutExerciseId,
  ownExerciseId,
  allExercises,
  initialAlternatives,
}: {
  domain: string;
  workoutExerciseId: string;
  ownExerciseId: string;
  allExercises: { id: string; name: string; category: string }[];
  initialAlternatives: { id: string; alternativeExercise: AltExercise }[];
}) {
  const [open, setOpen] = useState(false);
  const [alts, setAlts] = useState<AltExercise[]>(
    initialAlternatives.map((a) => a.alternativeExercise)
  );
  const [search, setSearch] = useState("");
  const [saving, setSaving] = useState(false);

  // Local id list ile server'a yolla
  const persistAlts = async (next: AltExercise[]) => {
    setAlts(next);
    setSaving(true);
    const result = await setExerciseAlternatives(
      domain,
      workoutExerciseId,
      next.map((a) => a.id)
    );
    setSaving(false);
    if (!result.success) {
      // basit revert
      setAlts(alts);
      toast.error(("error" in result && result.error) || "Alternatif güncellenemedi");
    }
  };

  const addAlt = (ex: AltExercise) => {
    if (alts.find((a) => a.id === ex.id)) return;
    persistAlts([...alts, ex]);
    setSearch("");
  };

  const removeAlt = (id: string) => {
    persistAlts(alts.filter((a) => a.id !== id));
  };

  const filtered = search.trim()
    ? allExercises.filter(
        (e) =>
          e.id !== ownExerciseId &&
          !alts.find((a) => a.id === e.id) &&
          (e.name.toLowerCase().includes(search.toLowerCase()) ||
            e.category.toLowerCase().includes(search.toLowerCase()))
      ).slice(0, 5)
    : [];

  return (
    <div className="px-3 pb-2">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="text-[11px] underline transition-opacity hover:opacity-80"
        style={{ color: "var(--dashboard-main-text-muted)" }}
      >
        Alternatifler {alts.length > 0 && `(${alts.length})`} {open ? "▲" : "▼"}
      </button>
      {open && (
        <div
          className="mt-2 p-2 rounded space-y-2"
          style={{
            backgroundColor: "color-mix(in srgb, var(--dashboard-main-text) 2%, transparent)",
            border: "1px solid var(--dashboard-card-border)",
          }}
        >
          {alts.length === 0 ? (
            <p className="text-[11px]" style={{ color: "var(--dashboard-main-text-muted)", opacity: 0.7 }}>
              Henüz alternatif yok. Aşağıdan ekle — öğrenci sıkıştığında bunlardan birine geçebilsin.
            </p>
          ) : (
            <ul className="flex flex-wrap gap-1">
              {alts.map((a) => (
                <li
                  key={a.id}
                  className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px]"
                  style={{
                    backgroundColor: "color-mix(in srgb, var(--dashboard-accent) 12%, transparent)",
                    color: "var(--dashboard-main-text)",
                  }}
                >
                  <span>{a.name}</span>
                  <button
                    type="button"
                    onClick={() => removeAlt(a.id)}
                    className="text-red-400/70 hover:text-red-400 ml-0.5"
                    aria-label={`${a.name} alternatifini kaldır`}
                  >
                    ×
                  </button>
                </li>
              ))}
            </ul>
          )}
          <div>
            <Input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="+ Alternatif egzersiz ara..."
              className="text-xs h-7"
              style={{
                backgroundColor: "var(--dashboard-card-bg)",
                borderColor: "var(--dashboard-card-border)",
                color: "var(--dashboard-main-text)",
              }}
              disabled={saving}
            />
            {filtered.length > 0 && (
              <ul
                className="mt-1 max-h-32 overflow-y-auto rounded"
                style={{
                  backgroundColor: "var(--dashboard-card-bg)",
                  border: "1px solid var(--dashboard-card-border)",
                }}
              >
                {filtered.map((e) => (
                  <li key={e.id}>
                    <button
                      type="button"
                      onClick={() => addAlt(e)}
                      className="w-full text-left px-2 py-1 text-xs hover:bg-white/5 flex justify-between"
                      style={{ color: "var(--dashboard-main-text)" }}
                    >
                      <span>{e.name}</span>
                      <span style={{ color: "var(--dashboard-main-text-muted)" }}>{e.category}</span>
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
