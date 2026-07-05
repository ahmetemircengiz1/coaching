"use client";

import React, { useState, useTransition } from "react";
import { Trash2, Pencil, Check, X, Sun, Sunset, Moon, Coffee, MessageSquare } from "lucide-react";
import { toast } from "sonner";
import { MealPhotoUploader } from "./meal-photo-uploader";
import { PhotoLightbox } from "@/components/ui/photo-lightbox";
import {
  deleteMealEntry,
  updateMealEntry,
  type MealEntryDTO,
  type MealType,
} from "@/app/site/[domain]/student/nutrition/meal-log-actions";
import { useRouter } from "next/navigation";

interface Props {
  domain: string;
  date: string;
  entries: MealEntryDTO[];
}

const MEAL_TYPES: Array<{ id: MealType; label: string; icon: React.ReactNode }> = [
  { id: "breakfast", label: "Kahvaltı", icon: <Sun className="w-3.5 h-3.5" /> },
  { id: "lunch", label: "Öğle", icon: <Sunset className="w-3.5 h-3.5" /> },
  { id: "dinner", label: "Akşam", icon: <Moon className="w-3.5 h-3.5" /> },
  { id: "snack", label: "Ara Öğün", icon: <Coffee className="w-3.5 h-3.5" /> },
];

export function MealLogDayView({ domain, date, entries }: Props) {
  const router = useRouter();
  const [, startTransition] = useTransition();

  const handleUploaded = () => {
    startTransition(() => {
      router.refresh();
    });
  };

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
      {MEAL_TYPES.map((type) => {
        const slotEntries = entries.filter((e) => e.mealType === type.id);
        return (
          <MealSlot
            key={type.id}
            domain={domain}
            date={date}
            type={type}
            entries={slotEntries}
            onUploaded={handleUploaded}
            onChanged={handleUploaded}
          />
        );
      })}
    </div>
  );
}

function MealSlot({
  domain,
  date,
  type,
  entries,
  onUploaded,
  onChanged,
}: {
  domain: string;
  date: string;
  type: { id: MealType; label: string; icon: React.ReactNode };
  entries: MealEntryDTO[];
  onUploaded: () => void;
  onChanged: () => void;
}) {
  const hasEntries = entries.length > 0;

  return (
    <div
      className="rounded-lg border p-3 space-y-2"
      style={{
        borderColor: hasEntries
          ? "color-mix(in srgb, var(--dashboard-accent) 25%, var(--dashboard-card-border))"
          : "var(--dashboard-card-border)",
        backgroundColor: hasEntries
          ? "color-mix(in srgb, var(--dashboard-accent) 5%, var(--dashboard-card-bg))"
          : "var(--dashboard-card-bg)",
      }}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-1.5">
          <span style={{ color: hasEntries ? "var(--dashboard-accent)" : "var(--dashboard-main-text-muted)" }}>
            {type.icon}
          </span>
          <span className="text-sm font-semibold">{type.label}</span>
          {hasEntries && (
            <span
              className="text-[10px] px-1.5 py-0.5 rounded-full font-bold"
              style={{ backgroundColor: "var(--dashboard-accent)", color: "var(--dashboard-accent-text)" }}
            >
              {entries.length}
            </span>
          )}
        </div>
      </div>

      {/* Yüklenmiş foto galerisi */}
      {hasEntries && (
        <div className="grid grid-cols-2 gap-2">
          {entries.map((entry) => (
            <MealEntryCard
              key={entry.id}
              domain={domain}
              entry={entry}
              onChanged={onChanged}
            />
          ))}
        </div>
      )}

      {/* Yükleme butonları */}
      <MealPhotoUploader
        domain={domain}
        date={date}
        mealType={type.id}
        onUploaded={onUploaded}
      />
    </div>
  );
}

function MealEntryCard({
  domain,
  entry,
  onChanged,
}: {
  domain: string;
  entry: MealEntryDTO;
  onChanged: () => void;
}) {
  const [editing, setEditing] = useState(false);
  const [showLightbox, setShowLightbox] = useState(false);
  const [noteDraft, setNoteDraft] = useState(entry.note || "");
  const [busy, setBusy] = useState(false);
  const [, startTransition] = useTransition();

  const handleDelete = async () => {
    if (!confirm("Bu fotoğrafı silmek istediğine emin misin?")) return;
    setBusy(true);
    const result = await deleteMealEntry(domain, entry.id);
    setBusy(false);
    if (!result.success) {
      toast.error(result.error || "Silinemedi");
    } else {
      toast.success("Silindi");
      startTransition(() => onChanged());
    }
  };

  const handleSaveNote = async () => {
    setBusy(true);
    const next = noteDraft.trim() || null;
    const result = await updateMealEntry(domain, entry.id, { note: next });
    setBusy(false);
    if (!result.success) {
      toast.error(result.error || "Kaydedilemedi");
    } else {
      setEditing(false);
      startTransition(() => onChanged());
    }
  };

  return (
    <>
      {showLightbox && (
        <PhotoLightbox
          src={entry.photoUrl}
          alt={entry.note || "Yemek fotoğrafı"}
          onClose={() => setShowLightbox(false)}
          note={entry.note}
          coachComment={entry.coachComment}
        />
      )}
      <div className="relative rounded-md overflow-hidden group" style={{ aspectRatio: "1" }}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={entry.photoUrl}
          alt={entry.note || "Yemek fotoğrafı"}
          className="absolute inset-0 w-full h-full object-cover cursor-zoom-in"
          loading="lazy"
          onClick={() => !editing && setShowLightbox(true)}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent pointer-events-none" />

        {/* Koç yorum rozeti */}
        {entry.coachComment && (
          <button
            type="button"
            onClick={() => setShowLightbox(true)}
            className="absolute top-1 left-1 inline-flex items-center justify-center w-5 h-5 rounded-full"
            style={{ backgroundColor: "var(--dashboard-accent)", color: "var(--dashboard-accent-text)" }}
            title="Koçundan yorum var"
            aria-label="Koçundan yorum var"
          >
            <MessageSquare className="w-2.5 h-2.5" />
          </button>
        )}

        {/* Aksiyonlar */}
        <div className="absolute top-1 right-1 flex gap-1 opacity-0 group-hover:opacity-100 transition">
          <button
            type="button"
            onClick={() => setEditing(!editing)}
            disabled={busy}
            className="p-1 rounded bg-white/90 text-black hover:bg-white"
            aria-label="Not düzenle"
          >
            <Pencil className="w-3 h-3" />
          </button>
          <button
            type="button"
            onClick={handleDelete}
            disabled={busy}
            className="p-1 rounded bg-red-500/90 text-white hover:bg-red-500"
            aria-label="Sil"
          >
            <Trash2 className="w-3 h-3" />
          </button>
        </div>

        {/* Not — varsa altta, yoksa boş */}
        {!editing && entry.note && (
          <p className="absolute bottom-0 left-0 right-0 p-1.5 text-[10px] text-white line-clamp-2 pointer-events-none">
            {entry.note}
          </p>
        )}

        {/* Inline note editor */}
        {editing && (
        <div className="absolute inset-0 bg-black/85 p-2 flex flex-col gap-2">
          <textarea
            value={noteDraft}
            onChange={(e) => setNoteDraft(e.target.value)}
            maxLength={500}
            placeholder="Bu öğüne kısa not..."
            className="flex-1 bg-white/10 text-white text-[11px] rounded p-1.5 resize-none placeholder-white/40 outline-none"
            autoFocus
          />
          <div className="flex gap-1">
            <button
              type="button"
              onClick={handleSaveNote}
              disabled={busy}
              className="flex-1 inline-flex items-center justify-center gap-1 py-1 rounded text-[10px] font-bold"
              style={{ backgroundColor: "var(--dashboard-accent)", color: "var(--dashboard-accent-text)" }}
            >
              <Check className="w-3 h-3" />
              Kaydet
            </button>
            <button
              type="button"
              onClick={() => {
                setEditing(false);
                setNoteDraft(entry.note || "");
              }}
              disabled={busy}
              className="flex-1 inline-flex items-center justify-center gap-1 py-1 rounded text-[10px] text-white border border-white/20"
            >
              <X className="w-3 h-3" />
              İptal
            </button>
          </div>
        </div>
      )}
      </div>
    </>
  );
}
