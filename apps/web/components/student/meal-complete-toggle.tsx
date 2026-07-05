"use client";

import { useEffect, useRef, useState, useTransition } from "react";
import { Check, RotateCcw } from "lucide-react";
import { toggleMealCompletion } from "@/app/site/[domain]/student/log-actions";

export function MealCompleteToggle({
  domain,
  mealId,
  initialCompleted,
  initialAlternativeUsed = null,
  alternatives = [],
}: {
  domain: string;
  mealId: string;
  initialCompleted: boolean;
  initialAlternativeUsed?: string | null;
  alternatives?: string[];
}) {
  const [completed, setCompleted] = useState(initialCompleted);
  const [altUsed, setAltUsed] = useState<string | null>(initialAlternativeUsed);
  const [showAltPicker, setShowAltPicker] = useState(false);
  const [busy, setBusy] = useState(false);
  const altPickerRef = useRef<HTMLDivElement>(null);
  const [_, startTransition] = useTransition();

  useEffect(() => {
    if (!showAltPicker) return;
    const handler = (e: MouseEvent) => {
      if (altPickerRef.current && !altPickerRef.current.contains(e.target as Node)) {
        setShowAltPicker(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [showAltPicker]);

  const handleToggle = (useAlt: string | null = null) => {
    if (busy) return;
    setBusy(true);
    const optimisticCompleted = useAlt !== null ? true : !completed;
    setCompleted(optimisticCompleted);
    if (useAlt !== null) setAltUsed(useAlt);
    else if (!optimisticCompleted) setAltUsed(null);

    startTransition(async () => {
      const result = await toggleMealCompletion(domain, mealId, useAlt);
      if (!result.success) {
        setCompleted(!optimisticCompleted);
        setAltUsed(initialAlternativeUsed);
      } else if ("completed" in result && typeof result.completed === "boolean") {
        setCompleted(result.completed);
        if (!result.completed) setAltUsed(null);
      }
      setBusy(false);
      setShowAltPicker(false);
    });
  };

  return (
    <div className="inline-flex items-center gap-1">
      <button
        type="button"
        onClick={() => handleToggle()}
        disabled={busy}
        aria-pressed={completed}
        aria-label={completed ? "Yedim işaretini kaldır" : "Yedim olarak işaretle"}
        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold border transition-all disabled:opacity-50"
        style={
          completed
            ? {
                backgroundColor: "#10b981",
                borderColor: "#10b981",
                color: "white",
              }
            : {
                backgroundColor: "transparent",
                borderColor: "var(--dashboard-card-border)",
                color: "var(--dashboard-main-text-muted)",
              }
        }
      >
        {completed ? (
          <>
            <Check className="h-3.5 w-3.5" strokeWidth={3} />
            {altUsed ? "Alternatif" : "Yedim"}
          </>
        ) : (
          "✓ Yedim"
        )}
      </button>
      {alternatives.length > 0 && (
        <div className="relative" ref={altPickerRef}>
          <button
            type="button"
            onClick={() => setShowAltPicker((v) => !v)}
            disabled={busy}
            className="p-1.5 rounded-full border transition-colors hover:bg-white/5"
            style={{
              borderColor: "var(--dashboard-card-border)",
              color: "var(--dashboard-main-text-muted)",
            }}
            title="Alternatif öğüne geç"
            aria-label="Alternatif öğün"
          >
            <RotateCcw className="h-3.5 w-3.5" />
          </button>
          {showAltPicker && (
            <div
              className="absolute right-0 top-full mt-1 z-20 min-w-56 rounded-lg shadow-xl"
              style={{
                backgroundColor: "var(--dashboard-card-bg)",
                border: "1px solid var(--dashboard-card-border)",
              }}
            >
              <p className="px-3 py-2 text-[10px] font-semibold uppercase tracking-wider border-b" style={{ color: "var(--dashboard-main-text-muted)", borderColor: "var(--dashboard-card-border)" }}>
                Alternatife geç
              </p>
              <ul className="max-h-56 overflow-y-auto">
                {alternatives.map((a, idx) => {
                  const isCurrent = altUsed === a;
                  return (
                    <li key={idx}>
                      <button
                        type="button"
                        onClick={() => handleToggle(a)}
                        className="w-full text-left px-3 py-2 text-xs hover:bg-white/5 flex items-center justify-between gap-2"
                        style={{ color: "var(--dashboard-main-text)" }}
                      >
                        <span className="flex-1">{a}</span>
                        {isCurrent && <Check className="h-3 w-3 shrink-0" style={{ color: "var(--dashboard-accent)" }} />}
                      </button>
                    </li>
                  );
                })}
              </ul>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
