"use client";

import { useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { addCheckInFeedback, updateCheckInMeasurements } from "@/app/site/[domain]/dashboard/students/assign-actions";
import { Download, X, ChevronLeft, ChevronRight, ZoomIn } from "lucide-react";

export type WeekCheckIn = {
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
  photos: string[];
};

const inputStyle = {
  backgroundColor: "var(--dashboard-input-bg)",
  borderColor: "var(--dashboard-input-border)",
  color: "var(--dashboard-input-text)",
};

function LevelIcon({ val }: { val: number | null }) {
  if (val == null) return null;
  if (val >= 4) return <span>🟢</span>;
  if (val >= 3) return <span>🟡</span>;
  return <span>🔴</span>;
}

export function CheckInWeekView({
  domain,
  weeks,
}: {
  domain: string;
  weeks: WeekCheckIn[];
}) {
  const router = useRouter();
  const [selectedWeek, setSelectedWeek] = useState(weeks[0]?.weekNumber ?? 0);
  const [localWeeks, setLocalWeeks] = useState(weeks);
  const [feedbackOpen, setFeedbackOpen] = useState(false);
  const [feedback, setFeedback] = useState("");
  const [saving, setSaving] = useState(false);
  const [editingWeight, setEditingWeight] = useState(false);
  const [editWeight, setEditWeight] = useState("");
  const [lightboxUrl, setLightboxUrl] = useState<string | null>(null);
  const [lightboxIndex, setLightboxIndex] = useState(0);

  const current = localWeeks.find((w) => w.weekNumber === selectedWeek);
  if (!current) return null;

  const photoLabels = ["Ön", "Yan", "Arka"];

  const handleSaveFeedback = async () => {
    if (!feedback.trim()) return;
    setSaving(true);
    const text = feedback.trim();
    setLocalWeeks((prev) =>
      prev.map((w) =>
        w.id === current.id ? { ...w, coachFeedback: text } : w
      )
    );
    setFeedbackOpen(false);
    setFeedback("");
    setSaving(false);
    await addCheckInFeedback(domain, current.id, text);
    router.refresh();
  };

  const handleSaveWeight = async () => {
    const w = parseFloat(editWeight);
    if (isNaN(w)) return;
    setLocalWeeks((prev) =>
      prev.map((wk) =>
        wk.id === current.id ? { ...wk, weight: w } : wk
      )
    );
    setEditingWeight(false);
    await updateCheckInMeasurements(domain, current.id, { weight: w });
    router.refresh();
  };

  const openLightbox = (url: string, index: number) => {
    setLightboxUrl(url);
    setLightboxIndex(index);
  };

  const closeLightbox = () => setLightboxUrl(null);

  const handleDownload = useCallback(async (url: string, filename: string) => {
    try {
      const res = await fetch(url);
      const blob = await res.blob();
      const blobUrl = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = blobUrl;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(blobUrl);
    } catch {
      window.open(url, "_blank");
    }
  }, []);

  const measurements = [
    current.bodyFat != null && { label: "Yağ", value: `%${current.bodyFat}` },
    current.chest != null && { label: "Göğüs", value: `${current.chest}cm` },
    current.waist != null && { label: "Bel", value: `${current.waist}cm` },
    current.hips != null && { label: "Kalça", value: `${current.hips}cm` },
    current.arms != null && { label: "Kol", value: `${current.arms}cm` },
    current.thighs != null && { label: "Bacak", value: `${current.thighs}cm` },
  ].filter(Boolean) as { label: string; value: string }[];

  return (
    <div className="space-y-4">
      {/* Hafta Seçici */}
      <div className="flex gap-2 overflow-x-auto pb-1 custom-scrollbar">
        {localWeeks.map((w) => (
          <button
            key={w.weekNumber}
            type="button"
            onClick={() => setSelectedWeek(w.weekNumber)}
            className="shrink-0 px-3 py-1.5 rounded-full text-xs font-medium transition-all"
            style={{
              backgroundColor:
                w.weekNumber === selectedWeek
                  ? "var(--dashboard-accent)"
                  : "color-mix(in srgb, var(--dashboard-accent) 8%, var(--dashboard-card-bg))",
              color:
                w.weekNumber === selectedWeek
                  ? "var(--dashboard-accent-text)"
                  : "var(--dashboard-main-text-muted)",
            }}
          >
            Hafta {w.weekNumber}
          </button>
        ))}
      </div>

      {/* Tarih + Kilo */}
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium" style={{ color: "var(--dashboard-main-text)" }}>
            Hafta {current.weekNumber}
          </p>
          <p className="text-xs" style={{ color: "var(--dashboard-main-text-muted)" }}>
            {new Date(current.date).toLocaleDateString("tr-TR")}
          </p>
        </div>
        <div className="flex items-center gap-3">
          {current.weight != null && !editingWeight && (
            <button
              onClick={() => {
                setEditingWeight(true);
                setEditWeight(String(current.weight));
              }}
              className="text-lg font-bold hover:underline cursor-pointer"
              style={{ color: "var(--dashboard-main-text)" }}
              title="Düzenlemek için tıkla"
            >
              {current.weight} kg
            </button>
          )}
          {editingWeight && (
            <div className="flex items-center gap-1">
              <Input
                type="number"
                value={editWeight}
                onChange={(e) => setEditWeight(e.target.value)}
                className="w-20 h-7 text-xs"
                style={inputStyle}
                step="0.1"
              />
              <button onClick={handleSaveWeight} className="text-xs text-green-400 px-1">
                ✓
              </button>
              <button
                onClick={() => setEditingWeight(false)}
                className="text-xs px-1"
                style={{ color: "var(--dashboard-main-text-muted)" }}
              >
                ✕
              </button>
            </div>
          )}
          {current.compliance != null && (
            <span
              className={`text-sm font-semibold ${
                current.compliance >= 80
                  ? "text-green-400"
                  : current.compliance >= 60
                    ? "text-yellow-400"
                    : "text-red-400"
              }`}
            >
              %{current.compliance}
            </span>
          )}
        </div>
      </div>

      {/* Fotoğraflar */}
      {current.photos.length > 0 && (
        <div className="grid grid-cols-3 gap-2">
          {current.photos.slice(0, 3).map((url, i) => (
            <div key={i} className="relative group">
              <p
                className="text-[10px] text-center mb-1"
                style={{ color: "var(--dashboard-main-text-muted)" }}
              >
                {photoLabels[i] || `Fotoğraf ${i + 1}`}
              </p>
              <div className="relative overflow-hidden rounded-lg">
                <img
                  src={url}
                  alt={photoLabels[i] || ""}
                  className="w-full aspect-[3/4] object-cover cursor-pointer transition-transform hover:scale-[1.02]"
                  onClick={() => openLightbox(url, i)}
                />
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors flex items-center justify-center opacity-0 group-hover:opacity-100">
                  <div className="flex gap-1">
                    <button
                      onClick={() => openLightbox(url, i)}
                      className="p-1.5 rounded-full bg-black/50 text-white hover:bg-black/70 transition"
                      title="Büyüt"
                    >
                      <ZoomIn className="h-3.5 w-3.5" />
                    </button>
                    <button
                      onClick={() =>
                        handleDownload(
                          url,
                          `hafta${current.weekNumber}_${photoLabels[i] || `foto${i + 1}`}.jpg`
                        )
                      }
                      className="p-1.5 rounded-full bg-black/50 text-white hover:bg-black/70 transition"
                      title="İndir"
                    >
                      <Download className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
          {/* 3'ten fazla fotoğraf varsa */}
          {current.photos.length > 3 && (
            <div className="col-span-3 grid grid-cols-4 gap-2 mt-1">
              {current.photos.slice(3).map((url, i) => (
                <div key={i} className="relative group">
                  <div className="relative overflow-hidden rounded-lg">
                    <img
                      src={url}
                      alt=""
                      className="w-full aspect-square object-cover cursor-pointer"
                      onClick={() => openLightbox(url, i + 3)}
                    />
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors flex items-center justify-center opacity-0 group-hover:opacity-100">
                      <button
                        onClick={() => openLightbox(url, i + 3)}
                        className="p-1 rounded-full bg-black/50 text-white"
                      >
                        <ZoomIn className="h-3 w-3" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Fotoğraf yoksa */}
      {current.photos.length === 0 && (
        <div
          className="grid grid-cols-3 gap-2"
        >
          {[0, 1, 2].map((i) => (
            <div key={i}>
              <p className="text-[10px] text-center mb-1" style={{ color: "var(--dashboard-main-text-muted)" }}>
                {photoLabels[i]}
              </p>
              <div
                className="w-full aspect-[3/4] rounded-lg flex items-center justify-center text-xs"
                style={{
                  backgroundColor: "color-mix(in srgb, var(--dashboard-accent) 5%, var(--dashboard-card-bg))",
                  color: "var(--dashboard-main-text-muted)",
                }}
              >
                Yok
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Ölçümler */}
      {measurements.length > 0 && (
        <div className="grid grid-cols-3 gap-2">
          {measurements.map((m) => (
            <div
              key={m.label}
              className="text-center rounded-lg py-2"
              style={{
                backgroundColor:
                  "color-mix(in srgb, var(--dashboard-accent) 5%, var(--dashboard-card-bg))",
              }}
            >
              <p
                className="text-[10px]"
                style={{ color: "var(--dashboard-main-text-muted)" }}
              >
                {m.label}
              </p>
              <p className="text-sm font-semibold">{m.value}</p>
            </div>
          ))}
        </div>
      )}

      {/* Enerji / Uyku / Stres */}
      {(current.energyLevel != null ||
        current.sleepQuality != null ||
        current.stressLevel != null) && (
        <div
          className="flex gap-3 text-xs"
          style={{ color: "var(--dashboard-main-text-muted)" }}
        >
          {current.energyLevel != null && (
            <span>
              ⚡ Enerji: <LevelIcon val={current.energyLevel} />{" "}
              {current.energyLevel}/5
            </span>
          )}
          {current.sleepQuality != null && (
            <span>
              😴 Uyku: <LevelIcon val={current.sleepQuality} />{" "}
              {current.sleepQuality}/5
            </span>
          )}
          {current.stressLevel != null && (
            <span>
              🧠 Stres: <LevelIcon val={6 - current.stressLevel} />{" "}
              {current.stressLevel}/5
            </span>
          )}
        </div>
      )}

      {/* Öğrenci Notu */}
      {current.notes && (
        <div
          className="rounded-lg px-3 py-2"
          style={{ backgroundColor: "color-mix(in srgb, var(--dashboard-accent) 3%, var(--dashboard-card-bg))" }}
        >
          <p
            className="text-xs mb-1"
            style={{ color: "var(--dashboard-main-text-muted)" }}
          >
            Öğrenci Notu:
          </p>
          <p className="text-sm" style={{ color: "var(--dashboard-main-text)" }}>
            {current.notes}
          </p>
        </div>
      )}

      {/* Geri Bildirim */}
      {current.coachFeedback ? (
        <div
          className="rounded-lg px-3 py-2"
          style={{ backgroundColor: "color-mix(in srgb, var(--dashboard-accent) 3%, var(--dashboard-card-bg))" }}
        >
          <p
            className="text-xs mb-1"
            style={{ color: "var(--dashboard-main-text-muted)" }}
          >
            Geri Bildirim:
          </p>
          <p className="text-sm" style={{ color: "var(--dashboard-main-text)" }}>
            {current.coachFeedback}
          </p>
        </div>
      ) : feedbackOpen ? (
        <div className="flex gap-2">
          <Input
            value={feedback}
            onChange={(e) => setFeedback(e.target.value)}
            placeholder="Geri bildiriminizi yazın..."
            className="text-sm flex-1"
            style={inputStyle}
          />
          <Button
            onClick={handleSaveFeedback}
            disabled={saving || !feedback.trim()}
            style={{
              backgroundColor: "var(--dashboard-accent)",
              color: "var(--dashboard-accent-text)",
            }}
            className="text-sm hover:opacity-90"
          >
            {saving ? "..." : "Kaydet"}
          </Button>
          <Button
            onClick={() => setFeedbackOpen(false)}
            className="border rounded-md px-4 py-2 text-sm"
            style={{
              backgroundColor: "transparent",
              borderColor: "var(--dashboard-card-border)",
              color: "var(--dashboard-main-text)",
            }}
          >
            İptal
          </Button>
        </div>
      ) : (
        <button
          onClick={() => {
            setFeedbackOpen(true);
            setFeedback("");
          }}
          className="text-xs hover:underline"
          style={{ color: "var(--dashboard-accent)" }}
        >
          Geri bildirim yaz
        </button>
      )}

      {/* Lightbox Modal */}
      {lightboxUrl && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-sm"
          onClick={closeLightbox}
        >
          <div
            className="relative max-w-[90vw] max-h-[90vh]"
            onClick={(e) => e.stopPropagation()}
          >
            <img
              src={lightboxUrl}
              alt=""
              className="max-w-full max-h-[85vh] object-contain rounded-lg"
            />
            {/* Controls */}
            <div className="absolute top-2 right-2 flex gap-1">
              <button
                onClick={() =>
                  handleDownload(
                    lightboxUrl,
                    `hafta${current.weekNumber}_foto${lightboxIndex + 1}.jpg`
                  )
                }
                className="p-2 rounded-full bg-black/60 text-white hover:bg-black/80 transition"
                title="İndir"
              >
                <Download className="h-4 w-4" />
              </button>
              <button
                onClick={closeLightbox}
                className="p-2 rounded-full bg-black/60 text-white hover:bg-black/80 transition"
                title="Kapat"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
            {/* Prev/Next */}
            {current.photos.length > 1 && (
              <>
                <button
                  onClick={() => {
                    const prev =
                      (lightboxIndex - 1 + current.photos.length) %
                      current.photos.length;
                    setLightboxIndex(prev);
                    setLightboxUrl(current.photos[prev]);
                  }}
                  className="absolute left-2 top-1/2 -translate-y-1/2 p-2 rounded-full bg-black/60 text-white hover:bg-black/80 transition"
                >
                  <ChevronLeft className="h-5 w-5" />
                </button>
                <button
                  onClick={() => {
                    const next =
                      (lightboxIndex + 1) % current.photos.length;
                    setLightboxIndex(next);
                    setLightboxUrl(current.photos[next]);
                  }}
                  className="absolute right-2 top-1/2 -translate-y-1/2 p-2 rounded-full bg-black/60 text-white hover:bg-black/80 transition"
                >
                  <ChevronRight className="h-5 w-5" />
                </button>
              </>
            )}
            {/* Counter */}
            <div className="absolute bottom-2 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full bg-black/60 text-white text-xs">
              {lightboxIndex + 1} / {current.photos.length}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
