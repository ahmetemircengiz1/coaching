"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface PhotoSet {
  weekNumber: number;
  date: string;
  frontPhoto: string | null;
  sidePhoto: string | null;
  backPhoto: string | null;
}

export function StudentPhotoGallery({ photos, embedded }: { photos: PhotoSet[]; embedded?: boolean }) {
  const [selectedWeek, setSelectedWeek] = useState(0);

  if (photos.length === 0) return null;

  const current = photos[selectedWeek];

  const content = (
    <>
      <div className="flex items-center justify-between mb-2">
        {!embedded && <span className="text-lg font-semibold">Check-in Fotoğrafları</span>}
        <div className="flex gap-1 flex-wrap">
          {photos.map((p, i) => (
            <button
              key={i}
              onClick={() => setSelectedWeek(i)}
              className="px-2 py-1 rounded text-xs transition"
              style={{
                backgroundColor: i === selectedWeek
                  ? "var(--dashboard-accent)"
                  : "var(--dashboard-main-bg)",
                color: i === selectedWeek
                  ? "var(--dashboard-accent-text)"
                  : "var(--dashboard-main-text-muted)",
              }}
            >
              H{p.weekNumber}
            </button>
          ))}
        </div>
      </div>
      <p className="text-xs mb-3" style={{ color: "var(--dashboard-main-text-muted)" }}>
        Hafta {current.weekNumber} - {new Date(current.date).toLocaleDateString("tr-TR")}
      </p>
      <div className="grid grid-cols-3 gap-3">
        {[
          { url: current.frontPhoto, label: "Ön" },
          { url: current.sidePhoto, label: "Yan" },
          { url: current.backPhoto, label: "Arka" },
        ].map((photo) => (
          <div key={photo.label} className="text-center">
            {photo.url ? (
              <div className="relative aspect-[3/4] rounded-lg overflow-hidden">
                <img
                  src={photo.url}
                  alt={photo.label}
                  className="w-full h-full object-cover"
                />
              </div>
            ) : (
              <div
                className="aspect-[3/4] rounded-lg flex items-center justify-center"
                style={{ backgroundColor: "var(--dashboard-main-bg)" }}
              >
                <span className="text-xs" style={{ color: "var(--dashboard-main-text-muted)" }}>Yok</span>
              </div>
            )}
            <p className="text-xs mt-1" style={{ color: "var(--dashboard-main-text-muted)" }}>{photo.label}</p>
          </div>
        ))}
      </div>
    </>
  );

  if (embedded) return <div>{content}</div>;

  return (
    <Card style={{ backgroundColor: "var(--dashboard-card-bg)", borderColor: "var(--dashboard-card-border)" }}>
      <CardHeader>
        <CardTitle className="text-lg">Check-in Fotoğrafları</CardTitle>
      </CardHeader>
      <CardContent>{content}</CardContent>
    </Card>
  );
}
