"use client";

import React, { useState } from "react";
import { PhotoLightbox } from "@/components/ui/photo-lightbox";
import type { MealLogWindow, MealLogDay, MealEntryDTO } from "@/app/site/[domain]/student/nutrition/meal-log-actions";

interface Props {
  window: MealLogWindow;
}

const MEAL_LABELS: Record<string, string> = {
  breakfast: "Kahvaltı",
  lunch: "Öğle",
  dinner: "Akşam",
  snack: "Ara Öğün",
};

function formatDayLabel(iso: string): string {
  const d = new Date(`${iso}T00:00:00.000Z`);
  return d.toLocaleDateString("tr-TR", {
    day: "2-digit",
    month: "short",
    weekday: "short",
    timeZone: "UTC",
  });
}

export function MealLogHistory({ window }: Props) {
  const [lightbox, setLightbox] = useState<MealEntryDTO | null>(null);
  const filledDays = window.days.filter((d) => d.entries.length > 0);

  if (filledDays.length === 0) {
    return (
      <div className="text-center py-10 opacity-50">
        <p className="text-sm">Henüz yüklenmiş yemek fotoğrafı yok.</p>
        <p className="text-xs mt-1">Bugünkü öğünlerinden başlayabilirsin.</p>
      </div>
    );
  }

  return (
    <>
      <div className="space-y-4">
        {filledDays.map((day) => (
          <DayBlock
            key={day.date}
            day={day}
            onPhotoClick={(e) => setLightbox(e)}
          />
        ))}
      </div>

      {lightbox && (
        <PhotoLightbox
          src={lightbox.photoUrl}
          alt={lightbox.note || MEAL_LABELS[lightbox.mealType] || lightbox.mealType}
          onClose={() => setLightbox(null)}
          caption={
            <>
              <span className="font-semibold">{MEAL_LABELS[lightbox.mealType] || lightbox.mealType}</span>
              {" · "}
              {formatDayLabel(lightbox.date)}
            </>
          }
          note={lightbox.note}
          coachComment={lightbox.coachComment}
        />
      )}
    </>
  );
}

function DayBlock({
  day,
  onPhotoClick,
}: {
  day: MealLogDay;
  onPhotoClick: (e: MealEntryDTO) => void;
}) {
  return (
    <div>
      <h4 className="text-xs font-semibold uppercase tracking-wider mb-2 opacity-70">
        {formatDayLabel(day.date)}
      </h4>
      <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-2">
        {day.entries.map((entry) => (
          <button
            key={entry.id}
            type="button"
            onClick={() => onPhotoClick(entry)}
            className="relative aspect-square rounded-md overflow-hidden group"
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={entry.photoUrl}
              alt={entry.note || `${MEAL_LABELS[entry.mealType] || entry.mealType}`}
              className="absolute inset-0 w-full h-full object-cover transition group-hover:scale-105"
              loading="lazy"
            />
            {entry.coachComment && (
              <span
                className="absolute top-1 right-1 inline-flex items-center justify-center w-5 h-5 rounded-full text-[10px] font-bold"
                style={{ backgroundColor: "var(--dashboard-accent)", color: "var(--dashboard-accent-text)" }}
                title="Koçundan yorum var"
              >
                ✦
              </span>
            )}
            <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 to-transparent p-1.5">
              <span className="text-[10px] font-semibold text-white">
                {MEAL_LABELS[entry.mealType] || entry.mealType}
              </span>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}

