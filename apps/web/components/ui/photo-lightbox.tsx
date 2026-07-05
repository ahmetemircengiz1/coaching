"use client";

import React, { useEffect } from "react";
import { X } from "lucide-react";

interface PhotoLightboxProps {
  src: string;
  alt?: string;
  onClose: () => void;
  /** Üst metadata (öğün adı, tarih vb.) */
  caption?: React.ReactNode;
  /** Ana görsel altında kullanıcı notu */
  note?: string | null;
  /** Koç yorumu (varsa farklı stil) */
  coachComment?: string | null;
  /** Ekstra ayak (yorum yaz formu vb.) lightbox altına yerleştirilir */
  footer?: React.ReactNode;
}

/**
 * Genel amaçlı görsel lightbox — `meal-log-*`, `checkin-week-view` gibi
 * yerlerde paylaşımlı kullanılır. Esc ile kapanır, dışarı tık ile kapanır.
 */
export function PhotoLightbox({
  src,
  alt,
  onClose,
  caption,
  note,
  coachComment,
  footer,
}: PhotoLightboxProps) {
  // Esc → kapat
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    // Body scroll kilidi
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = prevOverflow;
    };
  }, [onClose]);

  return (
    <div
      className="fixed inset-0 z-[200] bg-black/90 flex items-center justify-center p-4 overflow-y-auto"
      onClick={onClose}
    >
      <button
        type="button"
        className="fixed top-4 right-4 p-2 rounded-full bg-white/10 text-white hover:bg-white/20 transition z-[210]"
        onClick={onClose}
        aria-label="Kapat"
      >
        <X className="w-5 h-5" />
      </button>

      <div
        className="max-w-3xl w-full my-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={src}
          alt={alt || ""}
          className="w-full max-h-[70vh] object-contain rounded-lg"
        />

        <div className="mt-4 max-w-lg mx-auto space-y-3">
          {caption && (
            <p className="text-sm text-white/70 text-center">{caption}</p>
          )}

          {note && (
            <div className="rounded-md bg-white/5 px-4 py-3 text-sm text-white/90 whitespace-pre-wrap">
              {note}
            </div>
          )}

          {coachComment && (
            <div
              className="rounded-md px-4 py-3 text-sm whitespace-pre-wrap border-l-4"
              style={{
                backgroundColor: "rgba(204, 255, 0, 0.08)",
                borderLeftColor: "var(--dashboard-accent, #ccff00)",
                color: "rgba(255,255,255,0.92)",
              }}
            >
              <p className="text-[10px] font-bold uppercase tracking-wider mb-1 opacity-80" style={{ color: "var(--dashboard-accent, #ccff00)" }}>
                Koçundan Yorum
              </p>
              {coachComment}
            </div>
          )}

          {footer}
        </div>
      </div>
    </div>
  );
}
