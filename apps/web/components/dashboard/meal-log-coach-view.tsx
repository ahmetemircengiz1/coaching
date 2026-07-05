"use client";

import React, { useState, useTransition } from "react";
import { useParams, useRouter } from "next/navigation";
import { Camera, Check, Loader2, MessageSquare, Pencil, Trash2, X } from "lucide-react";
import { toast } from "sonner";
import { PhotoLightbox } from "@/components/ui/photo-lightbox";
import { addMealComment } from "@/app/site/[domain]/dashboard/students/meal-log-actions";
import type { MealLogWindow, MealEntryDTO } from "@/app/site/[domain]/student/nutrition/meal-log-actions";

interface Props {
  window: MealLogWindow;
}

const MEAL_LABELS: Record<string, string> = {
  breakfast: "Kahvaltı",
  lunch: "Öğle",
  dinner: "Akşam",
  snack: "Ara Öğün",
};

const MEAL_ORDER = ["breakfast", "lunch", "dinner", "snack"];

function formatLongDay(iso: string): string {
  const d = new Date(`${iso}T00:00:00.000Z`);
  return d.toLocaleDateString("tr-TR", {
    weekday: "long",
    day: "2-digit",
    month: "long",
    timeZone: "UTC",
  });
}

export function MealLogCoachView({ window }: Props) {
  const [lightbox, setLightbox] = useState<MealEntryDTO | null>(null);

  if (window.days.length === 0) {
    return (
      <div className="text-center py-10 opacity-50">
        <Camera className="w-10 h-10 mx-auto mb-3 opacity-40" />
        <p className="text-sm font-medium">Henüz öğrenci yemek fotoğrafı yüklemedi.</p>
        <p className="text-xs mt-1">
          Yüklemeleri burada günlük olarak göreceksin.
        </p>
      </div>
    );
  }

  // Son 30 günün özet istatistiği
  const totalEntries = window.days.reduce((acc, d) => acc + d.entries.length, 0);
  const daysWithEntry = window.days.length;

  return (
    <>
      <div className="space-y-5">
        {/* Üst özet */}
        <div className="flex items-center gap-4 text-sm flex-wrap pb-3 border-b" style={{ borderColor: "var(--dashboard-card-border)" }}>
          <div>
            <span className="text-2xl font-bold" style={{ color: "var(--dashboard-accent)" }}>
              {totalEntries}
            </span>
            <span className="ml-2 opacity-60">toplam öğün</span>
          </div>
          <div className="opacity-50 text-xs">
            {daysWithEntry} aktif gün
          </div>
        </div>

        {/* Günler — en yeni en üstte */}
        {window.days.map((day) => {
          // Öğün tipine göre grupla + sırala
          const byType = new Map<string, MealEntryDTO[]>();
          for (const entry of day.entries) {
            const arr = byType.get(entry.mealType) || [];
            arr.push(entry);
            byType.set(entry.mealType, arr);
          }

          return (
            <div key={day.date}>
              <h4 className="text-sm font-semibold mb-2 flex items-center gap-2">
                <span>{formatLongDay(day.date)}</span>
                <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-full opacity-60" style={{ backgroundColor: "var(--dashboard-card-border)" }}>
                  {day.entries.length} öğün
                </span>
              </h4>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                {MEAL_ORDER.map((type) => {
                  const entries = byType.get(type) || [];
                  if (entries.length === 0) {
                    return (
                      <div
                        key={type}
                        className="rounded-md border border-dashed p-3 flex flex-col items-center justify-center opacity-40 text-center"
                        style={{
                          borderColor: "var(--dashboard-card-border)",
                          minHeight: 100,
                        }}
                      >
                        <span className="text-[10px] uppercase tracking-wider opacity-60">{MEAL_LABELS[type]}</span>
                        <span className="text-[10px] mt-1 opacity-50">Yüklenmedi</span>
                      </div>
                    );
                  }
                  return (
                    <div
                      key={type}
                      className="rounded-md p-2"
                      style={{
                        backgroundColor: "color-mix(in srgb, var(--dashboard-accent) 4%, var(--dashboard-card-bg))",
                        border: "1px solid color-mix(in srgb, var(--dashboard-accent) 15%, var(--dashboard-card-border))",
                      }}
                    >
                      <div className="text-[10px] uppercase tracking-wider font-bold mb-1.5" style={{ color: "var(--dashboard-accent)" }}>
                        {MEAL_LABELS[type]}
                      </div>
                      <div className={`grid gap-1 ${entries.length > 1 ? "grid-cols-2" : "grid-cols-1"}`}>
                        {entries.map((entry) => (
                          <button
                            key={entry.id}
                            type="button"
                            onClick={() => setLightbox(entry)}
                            className="relative aspect-square rounded overflow-hidden group"
                          >
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img
                              src={entry.photoUrl}
                              alt={entry.note || MEAL_LABELS[type]}
                              className="absolute inset-0 w-full h-full object-cover transition group-hover:scale-105"
                              loading="lazy"
                            />
                            <div className="absolute top-1 right-1 flex gap-0.5">
                              {entry.note && (
                                <span
                                  className="w-1.5 h-1.5 rounded-full bg-white/80"
                                  aria-label="Öğrenci notu var"
                                  title="Öğrenci notu var"
                                />
                              )}
                              {entry.coachComment && (
                                <span
                                  className="w-1.5 h-1.5 rounded-full"
                                  style={{ backgroundColor: "var(--dashboard-accent)" }}
                                  aria-label="Yorum yazdın"
                                  title="Bu öğüne yorum yazdın"
                                />
                              )}
                            </div>
                          </button>
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}

        <p className="text-[11px] opacity-50 italic">
          Fotoğrafa tıkladığında detayını görebilir, öğrenciye doğrudan yorum yazabilirsin. Yorum öğrenciye bildirim olarak iletilir.
        </p>
      </div>

      {lightbox && (
        <CoachLightbox
          entry={lightbox}
          onClose={() => setLightbox(null)}
          onCommentSaved={(updated) => {
            setLightbox(updated);
          }}
        />
      )}
    </>
  );
}

function CoachLightbox({
  entry,
  onClose,
  onCommentSaved,
}: {
  entry: MealEntryDTO;
  onClose: () => void;
  onCommentSaved: (updated: MealEntryDTO) => void;
}) {
  const params = useParams();
  const router = useRouter();
  const domain = params.domain as string;

  const [editing, setEditing] = useState(!entry.coachComment);
  const [draft, setDraft] = useState(entry.coachComment || "");
  const [saving, setSaving] = useState(false);
  const [, startTransition] = useTransition();

  const handleSave = async () => {
    setSaving(true);
    const next = draft.trim();
    const result = await addMealComment(domain, entry.id, next || null);
    setSaving(false);
    if (!result.success) {
      toast.error(result.error || "Yorum kaydedilemedi");
      return;
    }
    toast.success(next ? "Yorum kaydedildi" : "Yorum silindi");
    onCommentSaved({ ...entry, coachComment: next || null });
    setEditing(false);
    startTransition(() => router.refresh());
  };

  const handleDelete = async () => {
    if (!confirm("Yorumu silmek istediğine emin misin?")) return;
    setSaving(true);
    const result = await addMealComment(domain, entry.id, null);
    setSaving(false);
    if (!result.success) {
      toast.error(result.error || "Silinemedi");
      return;
    }
    toast.success("Silindi");
    onCommentSaved({ ...entry, coachComment: null });
    setDraft("");
    setEditing(true);
    startTransition(() => router.refresh());
  };

  return (
    <PhotoLightbox
      src={entry.photoUrl}
      alt={entry.note || MEAL_LABELS[entry.mealType] || entry.mealType}
      onClose={onClose}
      caption={
        <>
          <span className="font-semibold">{MEAL_LABELS[entry.mealType] || entry.mealType}</span>
          {" · "}
          {formatLongDay(entry.date)}
        </>
      }
      note={entry.note}
      coachComment={!editing ? entry.coachComment : null}
      footer={
        <div
          className="rounded-md p-3 border-l-4"
          style={{
            backgroundColor: "rgba(204, 255, 0, 0.05)",
            borderLeftColor: "var(--dashboard-accent, #ccff00)",
          }}
        >
          <div className="flex items-center justify-between mb-2">
            <p className="text-[10px] font-bold uppercase tracking-wider opacity-80" style={{ color: "var(--dashboard-accent, #ccff00)" }}>
              Koç yorumu
            </p>
            {!editing && entry.coachComment && (
              <div className="flex gap-1">
                <button
                  type="button"
                  onClick={() => setEditing(true)}
                  className="inline-flex items-center gap-1 text-[11px] text-white/70 hover:text-white"
                >
                  <Pencil className="w-3 h-3" />
                  Düzenle
                </button>
                <button
                  type="button"
                  onClick={handleDelete}
                  disabled={saving}
                  className="inline-flex items-center gap-1 text-[11px] text-red-300 hover:text-red-200 disabled:opacity-50"
                >
                  <Trash2 className="w-3 h-3" />
                  Sil
                </button>
              </div>
            )}
          </div>

          {editing ? (
            <div className="space-y-2">
              <textarea
                value={draft}
                onChange={(e) => setDraft(e.target.value)}
                rows={3}
                maxLength={1000}
                placeholder="Öğrenciye geri bildirim yaz... (örn: porsiyonlar iyi, protein ekleyebilirsin)"
                className="w-full bg-white/5 text-white text-sm rounded p-2 resize-y placeholder-white/30 outline-none border border-white/10 focus:border-white/30"
                autoFocus
              />
              <div className="flex items-center justify-between gap-2">
                <span className="text-[10px] text-white/40">
                  {draft.length}/1000
                </span>
                <div className="flex gap-2">
                  {entry.coachComment && (
                    <button
                      type="button"
                      onClick={() => {
                        setEditing(false);
                        setDraft(entry.coachComment || "");
                      }}
                      disabled={saving}
                      className="inline-flex items-center gap-1 px-3 py-1.5 rounded text-[11px] font-medium text-white/70 border border-white/20 hover:bg-white/5"
                    >
                      İptal
                    </button>
                  )}
                  <button
                    type="button"
                    onClick={handleSave}
                    disabled={saving || (!entry.coachComment && draft.trim().length === 0)}
                    className="inline-flex items-center gap-1 px-3 py-1.5 rounded text-[11px] font-bold disabled:opacity-50"
                    style={{ backgroundColor: "var(--dashboard-accent, #ccff00)", color: "#000" }}
                  >
                    {saving ? <Loader2 className="w-3 h-3 animate-spin" /> : <Check className="w-3 h-3" />}
                    {entry.coachComment ? "Güncelle" : "Yorum Yaz"}
                  </button>
                </div>
              </div>
            </div>
          ) : (
            !entry.coachComment && (
              <button
                type="button"
                onClick={() => setEditing(true)}
                className="w-full text-left flex items-center gap-2 py-2 text-sm text-white/50 hover:text-white/80"
              >
                <MessageSquare className="w-4 h-4" />
                Yorum yaz...
              </button>
            )
          )}
        </div>
      }
    />
  );
}
