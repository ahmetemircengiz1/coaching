"use client";

import { useCallback, useMemo, useRef, useState } from "react";
import { Upload, FileText, X, Check, AlertCircle, Download } from "lucide-react";
import { parseProgramText, PROGRAM_TEXT_EXAMPLE } from "@/lib/import/program-text-parser";
import { parseNutritionText, NUTRITION_TEXT_EXAMPLE } from "@/lib/import/nutrition-text-parser";
import { parseProgramCsv, buildProgramCsvTemplate } from "@/lib/import/program-csv-parser";
import { parseNutritionCsv, buildNutritionCsvTemplate } from "@/lib/import/nutrition-csv-parser";
import { downloadCsv } from "@/lib/import/csv-utils";

type Mode = "text" | "csv" | "json";
type Kind = "program" | "nutrition";

interface ImportDialogProps {
  open: boolean;
  onClose: () => void;
  onImport: (raw: string) => Promise<{ success: boolean; error?: string }>;
  title: string;
  description: string;
  formatExample: string;
  /** Hangi içerik türü içe aktarılıyor — parser seçimi için */
  kind: Kind;
}

interface PreviewState {
  ok: boolean;
  summary?: string;
  error?: string;
  /** Submit için hazır JSON */
  json?: string;
}

export function ImportDialog({
  open,
  onClose,
  onImport,
  title,
  description,
  formatExample,
  kind,
}: ImportDialogProps) {
  const [mode, setMode] = useState<Mode>("text");
  const [content, setContent] = useState("");
  const [planName, setPlanName] = useState("");
  const [planWeeks, setPlanWeeks] = useState(4);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [showFormat, setShowFormat] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  const acceptByMode: Record<Mode, string> = {
    text: ".txt,.md",
    csv: ".csv",
    json: ".json",
  };

  const exampleByMode = useMemo<string>(() => {
    if (mode === "json") return formatExample;
    if (mode === "csv")
      return kind === "program"
        ? buildProgramCsvTemplate()
        : buildNutritionCsvTemplate();
    return kind === "program" ? PROGRAM_TEXT_EXAMPLE : NUTRITION_TEXT_EXAMPLE;
  }, [mode, kind, formatExample]);

  const placeholderByMode: Record<Mode, string> = {
    text:
      kind === "program"
        ? "Hafta 1 - Pazartesi - Push Günü\nBench Press 4x8-10 90sn\n..."
        : "Plan: Bulk\nÖğün: Kahvaltı - 08:00\nYulaf 80g 300kcal 10P 54K 6Y\n...",
    csv:
      kind === "program"
        ? "Hafta,Gün,Antrenman Adı,Egzersiz,Set,Tekrar,Dinlenme (sn),Not\n1,Pazartesi,Push Günü,Bench Press,4,8-10,90,\n..."
        : "Öğün,Saat,Yiyecek,Porsiyon,Kalori,Protein,Karbonhidrat,Yağ\nKahvaltı,08:00,Yulaf,80g,300,10,54,6\n...",
    json: kind === "program" ? '{"name":"...","weeks":4,"workouts":[...]}' : '{"name":"...","meals":[...]}',
  };

  const reset = useCallback(() => {
    setContent("");
    setPlanName("");
    setPlanWeeks(4);
    setError("");
    setSuccess(false);
    setShowFormat(false);
  }, []);

  const handleClose = useCallback(() => {
    reset();
    onClose();
  }, [onClose, reset]);

  const handleFile = useCallback(
    async (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (!file) return;
      if (file.size > 512 * 1024) {
        setError("Dosya boyutu 512 KB'dan büyük olamaz.");
        return;
      }
      const text = await file.text();
      setContent(text);
      setError("");
      // Dosya adından plan adı tahmini (sadece input boşsa)
      if (!planName) {
        const stem = file.name.replace(/\.(json|csv|txt|md)$/i, "");
        setPlanName(stem);
      }
    },
    [planName],
  );

  /** Mevcut girdiden parse sonucu — submit için JSON üret veya hata göster. */
  const preview = useMemo<PreviewState>(() => {
    if (!content.trim()) return { ok: false };

    if (mode === "json") {
      try {
        JSON.parse(content);
        return { ok: true, json: content, summary: "JSON formatı geçerli" };
      } catch {
        return { ok: false, error: "Geçersiz JSON formatı." };
      }
    }

    if (mode === "text") {
      if (kind === "program") {
        const result = parseProgramText({
          text: content,
          fallbackName: planName,
          fallbackWeeks: planWeeks,
        });
        if (!result.ok || !result.data) {
          return {
            ok: false,
            error: (result.error ?? "") + (result.line ? ` (satır ${result.line})` : ""),
          };
        }
        const p = result.preview!;
        return {
          ok: true,
          json: JSON.stringify(result.data),
          summary: `${p.workouts} antrenman, ${p.exercises} egzersiz`,
        };
      }
      const result = parseNutritionText({ text: content, fallbackName: planName });
      if (!result.ok || !result.data) {
        return {
          ok: false,
          error: (result.error ?? "") + (result.line ? ` (satır ${result.line})` : ""),
        };
      }
      const p = result.preview!;
      return {
        ok: true,
        json: JSON.stringify(result.data),
        summary:
          `${p.meals} öğün, ${p.foods} yiyecek` +
          (p.supplements ? `, ${p.supplements} takviye` : ""),
      };
    }

    // CSV
    if (kind === "program") {
      const result = parseProgramCsv({ csv: content, name: planName, weeks: planWeeks });
      if (!result.ok || !result.data) {
        return {
          ok: false,
          error: (result.error ?? "") + (result.line ? ` (satır ${result.line})` : ""),
        };
      }
      const p = result.preview!;
      return {
        ok: true,
        json: JSON.stringify(result.data),
        summary: `${p.workouts} antrenman, ${p.exercises} egzersiz`,
      };
    }
    const result = parseNutritionCsv({ csv: content, name: planName });
    if (!result.ok || !result.data) {
      return {
        ok: false,
        error: (result.error ?? "") + (result.line ? ` (satır ${result.line})` : ""),
      };
    }
    const p = result.preview!;
    return {
      ok: true,
      json: JSON.stringify(result.data),
      summary: `${p.meals} öğün, ${p.foods} yiyecek`,
    };
  }, [content, mode, kind, planName, planWeeks]);

  const handleImport = useCallback(async () => {
    if (!preview.ok || !preview.json) {
      setError(preview.error || "İçeri aktarılacak veri yok.");
      return;
    }
    setLoading(true);
    setError("");
    const result = await onImport(preview.json);
    setLoading(false);
    if (result.success) {
      setSuccess(true);
      setTimeout(() => {
        reset();
        onClose();
      }, 1200);
    } else {
      setError(result.error || "İçeri aktarma sırasında bir hata oluştu.");
    }
  }, [preview, onImport, reset, onClose]);

  const downloadTemplate = useCallback(() => {
    const csv = kind === "program" ? buildProgramCsvTemplate() : buildNutritionCsvTemplate();
    const filename = kind === "program" ? "antrenman-program-sablonu.csv" : "beslenme-plan-sablonu.csv";
    downloadCsv(filename, csv);
  }, [kind]);

  if (!open) return null;

  const TabBtn = ({ value, label }: { value: Mode; label: string }) => (
    <button
      type="button"
      onClick={() => {
        setMode(value);
        setContent("");
        setError("");
        setShowFormat(false);
      }}
      className="px-4 py-2 rounded-lg text-sm font-medium transition border"
      style={{
        backgroundColor:
          mode === value ? "var(--dashboard-accent)" : "transparent",
        color:
          mode === value
            ? "var(--dashboard-accent-text)"
            : "var(--dashboard-main-text)",
        borderColor:
          mode === value
            ? "var(--dashboard-accent)"
            : "var(--dashboard-card-border)",
      }}
    >
      {label}
    </button>
  );

  const showWeeksInput = kind === "program" && (mode === "text" || mode === "csv");
  const showNameInput = mode === "text" || mode === "csv";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={handleClose} />
      <div
        className="relative w-full max-w-2xl rounded-2xl border shadow-2xl overflow-hidden max-h-[90vh] flex flex-col"
        style={{
          backgroundColor: "var(--dashboard-card-bg)",
          borderColor: "var(--dashboard-card-border)",
          color: "var(--dashboard-main-text)",
        }}
      >
        {/* Header */}
        <div
          className="flex items-center justify-between px-6 py-4 border-b shrink-0"
          style={{ borderColor: "var(--dashboard-card-border)" }}
        >
          <div>
            <h3 className="text-lg font-bold">{title}</h3>
            <p className="text-xs mt-0.5" style={{ color: "var(--dashboard-main-text-muted)" }}>
              {description}
            </p>
          </div>
          <button
            type="button"
            onClick={handleClose}
            className="p-2 rounded-lg hover:bg-white/10 transition"
            aria-label="Kapat"
          >
            <X size={18} />
          </button>
        </div>

        {/* Mode tabs */}
        <div
          className="flex gap-2 px-6 py-3 border-b shrink-0"
          style={{ borderColor: "var(--dashboard-card-border)" }}
        >
          <TabBtn value="text" label="Düz Metin" />
          <TabBtn value="csv" label="Excel / CSV" />
          <TabBtn value="json" label="JSON (Gelişmiş)" />
        </div>

        {/* Body — scrollable */}
        <div className="px-6 py-5 space-y-4 overflow-y-auto">
          {/* Plan adı + hafta input */}
          {showNameInput && (
            <div className="grid grid-cols-1 sm:grid-cols-[1fr_120px] gap-3">
              <div>
                <label className="block text-xs font-medium mb-1" style={{ color: "var(--dashboard-main-text-muted)" }}>
                  Plan adı <span style={{ color: "#ef4444" }}>*</span>
                </label>
                <input
                  type="text"
                  value={planName}
                  onChange={(e) => setPlanName(e.target.value)}
                  placeholder={kind === "program" ? "ör. Push Pull Legs - 4 Hafta" : "ör. Bulk Beslenme Planı"}
                  maxLength={200}
                  className="w-full rounded-lg border px-3 py-2 text-sm bg-transparent outline-none"
                  style={{
                    borderColor: "var(--dashboard-card-border)",
                    color: "var(--dashboard-main-text)",
                  }}
                />
              </div>
              {showWeeksInput && (
                <div>
                  <label className="block text-xs font-medium mb-1" style={{ color: "var(--dashboard-main-text-muted)" }}>
                    Hafta sayısı
                  </label>
                  <input
                    type="number"
                    min={1}
                    max={52}
                    value={planWeeks}
                    onChange={(e) => setPlanWeeks(Math.max(1, Math.min(52, parseInt(e.target.value) || 1)))}
                    className="w-full rounded-lg border px-3 py-2 text-sm bg-transparent outline-none"
                    style={{
                      borderColor: "var(--dashboard-card-border)",
                      color: "var(--dashboard-main-text)",
                    }}
                  />
                </div>
              )}
            </div>
          )}

          {/* CSV template download */}
          {mode === "csv" && (
            <button
              type="button"
              onClick={downloadTemplate}
              className="flex items-center gap-2 text-xs font-medium px-3 py-2 rounded-lg border hover:bg-white/5 transition w-fit"
              style={{
                borderColor: "var(--dashboard-card-border)",
                color: "var(--dashboard-accent)",
              }}
            >
              <Download size={14} />
              Örnek CSV şablonunu indir
            </button>
          )}

          {/* File upload */}
          <div>
            <input
              ref={fileRef}
              type="file"
              accept={acceptByMode[mode]}
              onChange={handleFile}
              className="hidden"
            />
            <button
              type="button"
              onClick={() => fileRef.current?.click()}
              className="w-full flex items-center justify-center gap-2 py-3 rounded-xl border-2 border-dashed transition hover:border-solid"
              style={{
                borderColor: "var(--dashboard-accent)",
                color: "var(--dashboard-accent)",
                backgroundColor: "color-mix(in srgb, var(--dashboard-accent) 5%, transparent)",
              }}
            >
              <Upload size={18} />
              <span className="text-sm font-medium">
                {mode === "csv" ? ".csv" : mode === "json" ? ".json" : ".txt"} dosyası seç
              </span>
            </button>
          </div>

          <div className="text-center text-xs" style={{ color: "var(--dashboard-main-text-muted)" }}>
            veya içeriği aşağıya yapıştır
          </div>

          {/* Textarea */}
          <textarea
            value={content}
            onChange={(e) => {
              setContent(e.target.value);
              setError("");
            }}
            placeholder={placeholderByMode[mode]}
            rows={10}
            className="w-full rounded-xl border px-4 py-3 text-xs bg-transparent outline-none resize-y font-mono"
            style={{
              borderColor: "var(--dashboard-card-border)",
              color: "var(--dashboard-main-text)",
              minHeight: 200,
            }}
          />

          {/* Format example toggle */}
          <button
            type="button"
            onClick={() => setShowFormat((s) => !s)}
            className="flex items-center gap-1.5 text-xs font-medium"
            style={{ color: "var(--dashboard-accent)" }}
          >
            <FileText size={14} />
            {showFormat ? "Format örneğini gizle" : "Format örneğini göster"}
          </button>

          {showFormat && (
            <pre
              className="rounded-xl border p-4 text-xs overflow-x-auto max-h-60 whitespace-pre-wrap"
              style={{
                borderColor: "var(--dashboard-card-border)",
                backgroundColor: "var(--dashboard-main-bg)",
                color: "var(--dashboard-main-text-muted)",
              }}
            >
              {exampleByMode}
            </pre>
          )}

          {/* Preview / Validation */}
          {content.trim() && preview.ok && preview.summary && (
            <div
              className="flex items-start gap-2 rounded-xl border px-4 py-3 text-sm"
              style={{
                borderColor: "#22c55e",
                color: "#22c55e",
                backgroundColor: "rgba(34,197,94,0.05)",
              }}
            >
              <Check size={16} className="mt-0.5 shrink-0" />
              <div>
                <div className="font-medium">Ön izleme</div>
                <div className="text-xs opacity-90 mt-0.5">{preview.summary}</div>
              </div>
            </div>
          )}

          {/* Inline parse error (live) */}
          {content.trim() && !preview.ok && preview.error && (
            <div
              className="flex items-start gap-2 rounded-xl border px-4 py-3 text-sm"
              style={{
                borderColor: "#f59e0b",
                color: "#f59e0b",
                backgroundColor: "rgba(245,158,11,0.05)",
              }}
            >
              <AlertCircle size={16} className="mt-0.5 shrink-0" />
              <div>
                <div className="font-medium">Çözümleme hatası</div>
                <div className="text-xs opacity-90 mt-0.5">{preview.error}</div>
              </div>
            </div>
          )}

          {/* Server error */}
          {error && (
            <div
              className="flex items-start gap-2 rounded-xl border px-4 py-3 text-sm"
              style={{
                borderColor: "#ef4444",
                color: "#ef4444",
                backgroundColor: "rgba(239,68,68,0.05)",
              }}
            >
              <AlertCircle size={16} className="mt-0.5 shrink-0" />
              {error}
            </div>
          )}

          {/* Success */}
          {success && (
            <div
              className="flex items-center gap-2 rounded-xl border px-4 py-3 text-sm"
              style={{
                borderColor: "#22c55e",
                color: "#22c55e",
                backgroundColor: "rgba(34,197,94,0.05)",
              }}
            >
              <Check size={16} />
              Başarıyla içeri aktarıldı!
            </div>
          )}
        </div>

        {/* Footer */}
        <div
          className="flex items-center justify-end gap-3 px-6 py-4 border-t shrink-0"
          style={{ borderColor: "var(--dashboard-card-border)" }}
        >
          <button
            type="button"
            onClick={handleClose}
            className="px-4 py-2 rounded-lg text-sm font-medium hover:bg-white/10 transition"
          >
            İptal
          </button>
          <button
            type="button"
            onClick={handleImport}
            disabled={loading || !preview.ok}
            className="px-5 py-2 rounded-lg text-sm font-bold transition hover:opacity-90 disabled:opacity-40"
            style={{
              backgroundColor: "var(--dashboard-accent)",
              color: "var(--dashboard-accent-text)",
            }}
          >
            {loading ? "Aktarılıyor..." : "İçeri Aktar"}
          </button>
        </div>
      </div>
    </div>
  );
}

// ── JSON Format examples (mevcut, korunur) ──

export const PROGRAM_FORMAT_EXAMPLE = `{
  "name": "Push Pull Legs - 4 Hafta",
  "description": "Klasik PPL split programi",
  "weeks": 4,
  "workouts": [
    {
      "weekNumber": 1,
      "dayOfWeek": 1,
      "name": "Push Gunu",
      "exercises": [
        {
          "name": "Bench Press",
          "sets": 4,
          "reps": "8-10",
          "restSeconds": 90,
          "notes": "Isınma seti dahil"
        },
        {
          "name": "Shoulder Press",
          "sets": 3,
          "reps": "10-12",
          "restSeconds": 60
        }
      ]
    },
    {
      "weekNumber": 1,
      "dayOfWeek": 2,
      "name": "Pull Gunu",
      "exercises": [
        {
          "name": "Barbell Row",
          "sets": 4,
          "reps": "8-10",
          "restSeconds": 90
        }
      ]
    }
  ]
}`;

export const NUTRITION_FORMAT_EXAMPLE = `{
  "name": "Bulk Beslenme Plani",
  "targetCalories": 2800,
  "targetProtein": 180,
  "targetCarbs": 350,
  "targetFat": 80,
  "coachNotes": "Antrenman gunlerinde karbonhidrat arttirilabilir",
  "supplements": [
    {
      "name": "Whey Protein",
      "dosage": "30g",
      "timing": "Antrenman sonrasi"
    }
  ],
  "meals": [
    {
      "name": "Kahvalti",
      "time": "08:00",
      "foods": [
        {
          "name": "Yulaf ezmesi",
          "portion": "80g",
          "calories": 300,
          "protein": 10,
          "carbs": 54,
          "fat": 6
        },
        {
          "name": "Yumurta",
          "portion": "3 adet",
          "calories": 210,
          "protein": 18,
          "carbs": 1,
          "fat": 15
        }
      ]
    },
    {
      "name": "Ogle Yemegi",
      "time": "13:00",
      "foods": [
        {
          "name": "Tavuk gogsu",
          "portion": "200g",
          "calories": 330,
          "protein": 62,
          "carbs": 0,
          "fat": 7
        },
        {
          "name": "Pirinc",
          "portion": "150g (pismis)",
          "calories": 195,
          "protein": 4,
          "carbs": 43,
          "fat": 0
        }
      ]
    }
  ]
}`;
