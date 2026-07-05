"use client";

import { useState, useTransition, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  assignProgramToStudent,
  addCheckInFeedback,
  updateCheckInMeasurements,
} from "@/app/site/[domain]/dashboard/students/assign-actions";
import { useRouter } from "next/navigation";

interface ProgramOption {
  id: string;
  name: string;
  weeks: number;
}

interface CheckIn {
  id: string;
  weekNumber: number;
  date: string;
  weight: number | null;
  bodyFat: number | null;
  chest: number | null;
  waist: number | null;
  hips: number | null;
  arms: number | null;
  thighs: number | null;
  energyLevel: number | null;
  sleepQuality: number | null;
  stressLevel: number | null;
  notes: string | null;
  compliance: number | null;
  coachFeedback: string | null;
}

const inputStyle = {
  backgroundColor: "var(--dashboard-card-bg)",
  borderColor: "var(--dashboard-card-border)",
  color: "var(--dashboard-main-text)",
};

interface ProgramExercise {
  name: string;
  muscleGroup: string | null;
  sets: number;
  reps: string;
  restSeconds: number | null;
}

interface ProgramWorkout {
  id: string;
  name: string;
  weekNumber: number;
  dayOfWeek: number;
  exercises: ProgramExercise[];
}

interface ProgramDetails {
  name: string;
  weeks: number;
  workouts: ProgramWorkout[];
}

const dayNames = ["Pzt", "Sal", "Çar", "Per", "Cum", "Cmt", "Paz"];

// Program atama bileşeni
export function AssignProgramSection({
  domain,
  studentId,
  programs,
  currentPlan,
  programDetails,
}: {
  domain: string;
  studentId: string;
  programs: ProgramOption[];
  currentPlan: { name: string } | null;
  programDetails?: ProgramDetails | null;
}) {
  const router = useRouter();
  const [showAssign, setShowAssign] = useState(false);
  const [showDetails, setShowDetails] = useState(false);
  const [selectedProgram, setSelectedProgram] = useState("");
  const [loading, setLoading] = useState(false);

  const [localCurrentPlan, setLocalCurrentPlan] = useState<{ name: string } | null>(currentPlan);
  useEffect(() => {
    setLocalCurrentPlan(currentPlan);
  }, [currentPlan]);

  const handleAssign = async () => {
    if (!selectedProgram) return;
    setLoading(true);

    const sel = programs.find(p => p.id === selectedProgram);
    if (sel) {
      setLocalCurrentPlan({ name: sel.name });
    }

    setShowAssign(false);
    setSelectedProgram("");
    setLoading(false);

    assignProgramToStudent(domain, studentId, selectedProgram).then(() => {
      router.refresh();
    });
  };

  // Haftalara göre grupla
  const weekGroups = programDetails
    ? programDetails.workouts.reduce<Record<number, ProgramWorkout[]>>((acc, w) => {
      if (!acc[w.weekNumber]) acc[w.weekNumber] = [];
      acc[w.weekNumber].push(w);
      return acc;
    }, {})
    : {};

  return (
    <div>
      {localCurrentPlan ? (
        <div className="flex items-center gap-3 flex-wrap">
          <span className="text-sm" style={{ color: "var(--dashboard-main-text-muted)" }}>
            Aktif Program: <strong style={{ color: "var(--dashboard-main-text)" }}>{localCurrentPlan.name}</strong>
          </span>
          <div className="flex gap-2">
            {programDetails && (
              <button onClick={() => setShowDetails(!showDetails)} className="text-xs hover:underline" style={{ color: "var(--dashboard-accent)" }}>
                {showDetails ? "Kapat" : "İncele"}
              </button>
            )}
            <button onClick={() => setShowAssign(!showAssign)} className="text-xs hover:underline" style={{ color: "var(--dashboard-accent)" }}>
              Değiştir
            </button>
          </div>
        </div>
      ) : (
        <Button onClick={() => setShowAssign(!showAssign)}
          className="text-sm border rounded-md px-4 py-2"
          style={{ backgroundColor: "var(--dashboard-card-bg)", borderColor: "var(--dashboard-card-border)", color: "var(--dashboard-main-text)" }}>
          Antrenman Programı Ata
        </Button>
      )}

      {showAssign && (
        <div className="mt-3 flex gap-2 items-center">
          <select value={selectedProgram} onChange={(e) => setSelectedProgram(e.target.value)}
            className="rounded-md px-3 py-2 text-sm flex-1"
            style={{ ...inputStyle, border: "1px solid var(--dashboard-card-border)" }}>
            <option value="">Program seç...</option>
            {programs.map((p) => (
              <option key={p.id} value={p.id}>{p.name} ({p.weeks} hafta)</option>
            ))}
          </select>
          <Button onClick={handleAssign} disabled={loading || !selectedProgram}
            style={{ backgroundColor: "var(--dashboard-accent)", color: "var(--dashboard-accent-text)" }}
            className="font-semibold text-sm hover:opacity-90">
            {loading ? "..." : "Ata"}
          </Button>
          <Button onClick={() => setShowAssign(false)}
            className="border rounded-md px-4 py-2 text-sm"
            style={{ backgroundColor: "transparent", borderColor: "var(--dashboard-card-border)", color: "var(--dashboard-main-text)" }}>
            İptal
          </Button>
        </div>
      )}

      {/* Program Detayları */}
      {showDetails && programDetails && (
        <div className="mt-4 space-y-3">
          <p className="text-sm font-medium" style={{ color: "var(--dashboard-main-text)" }}>
            {programDetails.name} — {programDetails.weeks} Hafta
          </p>
          {Object.entries(weekGroups)
            .sort(([a], [b]) => Number(a) - Number(b))
            .map(([week, workouts]) => (
              <div key={week} className="rounded-lg p-3" style={{ backgroundColor: "color-mix(in srgb, var(--dashboard-accent) 3%, var(--dashboard-card-bg))" }}>
                <p className="text-sm font-semibold mb-2" style={{ color: "var(--dashboard-main-text)" }}>Hafta {week}</p>
                <div className="space-y-2">
                  {workouts.map((w) => (
                    <div key={w.id}>
                      <p className="text-xs font-medium" style={{ color: "var(--dashboard-accent)" }}>
                        {dayNames[w.dayOfWeek - 1] || `Gün ${w.dayOfWeek}`} — {w.name}
                      </p>
                      <div className="ml-3 mt-1 space-y-0.5">
                        {w.exercises.map((ex, i) => (
                          <div key={i} className="flex items-center gap-2 text-xs" style={{ color: "var(--dashboard-main-text-muted)" }}>
                            <span style={{ color: "var(--dashboard-main-text)" }}>{ex.name}</span>
                            <span>{ex.sets} x {ex.reps}</span>
                            {ex.restSeconds && <span>({ex.restSeconds}s dinlenme)</span>}
                            {ex.muscleGroup && (
                              <span className="px-1.5 py-0.5 rounded-full text-[10px]"
                                style={{ backgroundColor: "var(--dashboard-card-bg)" }}>
                                {ex.muscleGroup}
                              </span>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
        </div>
      )}
    </div>
  );
}

// Check-in feedback bileşeni
export function CheckInFeedbackList({
  domain,
  checkIns,
  embedded = false,
}: {
  domain: string;
  checkIns: CheckIn[];
  embedded?: boolean;
}) {
  const router = useRouter();
  const [feedbackId, setFeedbackId] = useState<string | null>(null);
  const [feedback, setFeedback] = useState("");
  const [loading, setLoading] = useState(false);

  const [localCheckIns, setLocalCheckIns] = useState<CheckIn[]>(checkIns);
  const [editingCheckIn, setEditingCheckIn] = useState<string | null>(null);
  const [editWeight, setEditWeight] = useState<string>("");
  useEffect(() => {
    setLocalCheckIns(checkIns);
  }, [checkIns]);

  const handleSave = async (checkInId: string) => {
    if (!feedback.trim()) return;
    setLoading(true);

    const feedbackText = feedback.trim();
    setLocalCheckIns(prev => prev.map(c =>
      c.id === checkInId ? { ...c, coachFeedback: feedbackText } : c
    ));

    setFeedbackId(null);
    setFeedback("");
    setLoading(false);

    addCheckInFeedback(domain, checkInId, feedbackText).then(() => {
      router.refresh();
    });
  };

  const checkInContent = (
    <div className="space-y-3">
      {localCheckIns.map((checkIn) => {
        const measurements = [
          checkIn.bodyFat != null && `%${checkIn.bodyFat} yağ`,
          checkIn.chest != null && `Göğüs: ${checkIn.chest}cm`,
          checkIn.waist != null && `Bel: ${checkIn.waist}cm`,
          checkIn.hips != null && `Kalça: ${checkIn.hips}cm`,
          checkIn.arms != null && `Kol: ${checkIn.arms}cm`,
          checkIn.thighs != null && `Bacak: ${checkIn.thighs}cm`,
        ].filter(Boolean);

        const levelIcon = (val: number | null) => {
          if (val == null) return null;
          if (val >= 4) return "🟢";
          if (val >= 3) return "🟡";
          return "🔴";
        };

        return (
          <div key={checkIn.id} className="p-3 rounded-lg space-y-2"
            style={{ backgroundColor: "color-mix(in srgb, var(--dashboard-accent) 3%, var(--dashboard-card-bg))" }}>
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium" style={{ color: "var(--dashboard-main-text)" }}>Hafta {checkIn.weekNumber}</p>
                <p className="text-xs" style={{ color: "var(--dashboard-main-text-muted)" }}>
                  {new Date(checkIn.date).toLocaleDateString("tr-TR")}
                </p>
              </div>
              <div className="flex items-center gap-4">
                {checkIn.weight && editingCheckIn !== checkIn.id && (
                  <button
                    onClick={() => { setEditingCheckIn(checkIn.id); setEditWeight(String(checkIn.weight)); }}
                    className="text-sm font-semibold hover:underline cursor-pointer"
                    style={{ color: "var(--dashboard-main-text)" }}
                    title="Düzenlemek için tıkla"
                  >
                    {checkIn.weight} kg
                  </button>
                )}
                {editingCheckIn === checkIn.id && (
                  <div className="flex items-center gap-1">
                    <Input
                      type="number"
                      value={editWeight}
                      onChange={(e) => setEditWeight(e.target.value)}
                      className="w-20 h-7 text-xs"
                      style={inputStyle}
                      step="0.1"
                    />
                    <button
                      onClick={async () => {
                        const w = parseFloat(editWeight);
                        if (isNaN(w)) return;
                        setLocalCheckIns(prev => prev.map(c => c.id === checkIn.id ? { ...c, weight: w } : c));
                        setEditingCheckIn(null);
                        await updateCheckInMeasurements(domain, checkIn.id, { weight: w });
                        router.refresh();
                      }}
                      className="text-xs text-green-400 px-1"
                    >
                      ✓
                    </button>
                    <button onClick={() => setEditingCheckIn(null)} className="text-xs px-1" style={{ color: "var(--dashboard-main-text-muted)" }}>✕</button>
                  </div>
                )}
                {checkIn.compliance !== null && (
                  <span className={`text-sm font-semibold ${checkIn.compliance >= 80 ? "text-green-400" :
                      checkIn.compliance >= 60 ? "text-yellow-400" : "text-red-400"
                    }`}>%{checkIn.compliance}</span>
                )}
              </div>
            </div>

            {measurements.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {measurements.map((m, i) => (
                  <span key={i} className="text-xs px-2 py-0.5 rounded-full"
                    style={{ backgroundColor: "var(--dashboard-card-bg)", color: "var(--dashboard-main-text-muted)" }}>
                    {m}
                  </span>
                ))}
              </div>
            )}

            {(checkIn.energyLevel != null || checkIn.sleepQuality != null || checkIn.stressLevel != null) && (
              <div className="flex gap-3 text-xs" style={{ color: "var(--dashboard-main-text-muted)" }}>
                {checkIn.energyLevel != null && (
                  <span>⚡ Enerji: {levelIcon(checkIn.energyLevel)} {checkIn.energyLevel}/5</span>
                )}
                {checkIn.sleepQuality != null && (
                  <span>😴 Uyku: {levelIcon(checkIn.sleepQuality)} {checkIn.sleepQuality}/5</span>
                )}
                {checkIn.stressLevel != null && (
                  <span>🧠 Stres: {levelIcon(6 - checkIn.stressLevel)} {checkIn.stressLevel}/5</span>
                )}
              </div>
            )}

            {checkIn.notes && (
              <div className="rounded px-3 py-2" style={{ backgroundColor: "var(--dashboard-card-bg)" }}>
                <p className="text-xs mb-1" style={{ color: "var(--dashboard-main-text-muted)" }}>Öğrenci Notu:</p>
                <p className="text-sm" style={{ color: "var(--dashboard-main-text)" }}>{checkIn.notes}</p>
              </div>
            )}

            {checkIn.coachFeedback ? (
              <div className="rounded px-3 py-2" style={{ backgroundColor: "var(--dashboard-card-bg)" }}>
                <p className="text-xs mb-1" style={{ color: "var(--dashboard-main-text-muted)" }}>Geri Bildirim:</p>
                <p className="text-sm" style={{ color: "var(--dashboard-main-text)" }}>{checkIn.coachFeedback}</p>
              </div>
            ) : feedbackId === checkIn.id ? (
              <div className="flex gap-2">
                <Input value={feedback} onChange={(e) => setFeedback(e.target.value)}
                  placeholder="Geri bildiriminizi yazın..."
                  className="text-sm flex-1"
                  style={inputStyle} />
                <Button onClick={() => handleSave(checkIn.id)} disabled={loading || !feedback.trim()}
                  style={{ backgroundColor: "var(--dashboard-accent)", color: "var(--dashboard-accent-text)" }}
                  className="text-sm hover:opacity-90">
                  {loading ? "..." : "Kaydet"}
                </Button>
                <Button onClick={() => setFeedbackId(null)}
                  className="border rounded-md px-4 py-2 text-sm"
                  style={{ backgroundColor: "transparent", borderColor: "var(--dashboard-card-border)", color: "var(--dashboard-main-text)" }}>
                  İptal
                </Button>
              </div>
            ) : (
              <button onClick={() => { setFeedbackId(checkIn.id); setFeedback(""); }}
                className="text-xs hover:underline" style={{ color: "var(--dashboard-accent)" }}>
                Geri bildirim yaz
              </button>
            )}
          </div>
        );
      })}
    </div>
  );

  if (embedded) {
    return checkInContent;
  }

  return (
    <Card style={{ backgroundColor: "var(--dashboard-card-bg)", borderColor: "var(--dashboard-card-border)" }} className="dashboard-card-hover">
      <details className="group">
        <summary className="cursor-pointer list-none">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-lg" style={{ color: "var(--dashboard-main-text)" }}>Son Check-in&apos;ler</CardTitle>
            <svg
              className="h-4 w-4 transition-transform duration-300 group-open:rotate-180"
              style={{ color: "var(--dashboard-main-text-muted)" }}
              fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
            </svg>
          </CardHeader>
        </summary>
        <CardContent>{checkInContent}</CardContent>
      </details>
    </Card>
  );
}

