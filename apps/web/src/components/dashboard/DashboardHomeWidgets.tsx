"use client";

import Link from "next/link";
import { useEffect, useRef, useState, useTransition } from "react";
import { ArrowRight, StickyNote, Inbox } from "lucide-react";
import { updateDashboardNote } from "@/app/site/[domain]/dashboard/actions";
import type { DashboardNewCheckIn } from "./types";

const SAVE_DEBOUNCE_MS = 1200;

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("tr-TR", {
    day: "numeric",
    month: "short",
  });
}

export function DashboardHomeWidgets({
  domain,
  newCheckIns,
  initialNote,
}: {
  domain: string;
  newCheckIns: DashboardNewCheckIn[];
  initialNote: string;
}) {
  return (
    <div className="grid gap-4 lg:grid-cols-2">
      <StickyNoteCard domain={domain} initialNote={initialNote} />
      <NewCheckInsCard domain={domain} checkIns={newCheckIns} />
    </div>
  );
}

// ── Yeni Check-in Kartları ───────────────────────────────────────────────

function NewCheckInsCard({ domain, checkIns }: { domain: string; checkIns: DashboardNewCheckIn[] }) {
  return (
    <article
      className="relative overflow-hidden p-5 sm:p-6"
      style={{
        backgroundColor: "var(--dashboard-card-bg)",
        borderColor: "var(--dashboard-card-border)",
        borderWidth: "1px",
        borderRadius: "var(--dashboard-card-radius)",
        boxShadow: "var(--dashboard-card-shadow)",
        backdropFilter: "var(--dashboard-glass-effect)",
      }}
    >
      <div className="mb-4 flex items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <div
            className="flex h-9 w-9 items-center justify-center rounded-full"
            style={{ backgroundColor: "color-mix(in srgb, var(--dashboard-accent) 15%, transparent)" }}
          >
            <Inbox className="h-4 w-4" style={{ color: "var(--dashboard-accent)" }} />
          </div>
          <h2 className="text-lg font-semibold tracking-tight" style={{ color: "var(--dashboard-main-text)" }}>
            Yeni Check-in
          </h2>
          {checkIns.length > 0 && (
            <span
              className="ml-1 inline-flex items-center justify-center rounded-full px-2 py-0.5 text-xs font-semibold"
              style={{
                backgroundColor: "var(--dashboard-accent)",
                color: "var(--dashboard-accent-text, #000)",
              }}
            >
              {checkIns.length}
            </span>
          )}
        </div>
      </div>

      {checkIns.length === 0 ? (
        <div
          className="flex flex-col items-center justify-center rounded-lg border border-dashed py-10 text-center"
          style={{ borderColor: "var(--dashboard-card-border)", color: "var(--dashboard-main-text-muted)" }}
        >
          <Inbox className="mb-2 h-8 w-8 opacity-40" />
          <p className="text-sm">Şu an okunmamış check-in yok.</p>
          <p className="mt-0.5 text-xs opacity-60">Öğrencilerin yeni check-in gönderdiğinde burada görüneceksin.</p>
        </div>
      ) : (
        <ul className="space-y-2">
          {checkIns.map((c) => (
            <li key={c.id}>
              <Link
                href={`/site/${domain}/dashboard/students/${c.studentId}`}
                className="group flex items-center gap-3 rounded-lg border p-3 transition-all hover:translate-x-0.5"
                style={{
                  borderColor: "var(--dashboard-card-border)",
                  backgroundColor: "color-mix(in srgb, var(--dashboard-accent) 4%, transparent)",
                }}
              >
                <div
                  className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-sm font-semibold"
                  style={{
                    backgroundColor: "color-mix(in srgb, var(--dashboard-accent) 18%, transparent)",
                    color: "var(--dashboard-accent)",
                  }}
                >
                  {c.studentName.charAt(0).toUpperCase()}
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <p className="truncate text-sm font-semibold" style={{ color: "var(--dashboard-main-text)" }}>
                      {c.studentName}
                    </p>
                    <span
                      className="shrink-0 rounded px-1.5 py-0.5 text-[10px] font-medium"
                      style={{
                        backgroundColor: "color-mix(in srgb, var(--dashboard-main-text) 8%, transparent)",
                        color: "var(--dashboard-main-text-muted)",
                      }}
                    >
                      Hafta {c.weekNumber}
                    </span>
                  </div>
                  <p className="mt-0.5 text-xs" style={{ color: "var(--dashboard-main-text-muted)" }}>
                    {formatDate(c.date)}
                    {c.weight != null && ` · ${c.weight} kg`}
                  </p>
                </div>
                <ArrowRight
                  className="h-4 w-4 shrink-0 opacity-50 transition-opacity group-hover:opacity-100"
                  style={{ color: "var(--dashboard-main-text-muted)" }}
                />
              </Link>
            </li>
          ))}
        </ul>
      )}
    </article>
  );
}

// ── Yapışkan Not ─────────────────────────────────────────────────────────

type SaveStatus = "idle" | "saving" | "saved" | "error";

function StickyNoteCard({ domain, initialNote }: { domain: string; initialNote: string }) {
  const [note, setNote] = useState(initialNote);
  const [status, setStatus] = useState<SaveStatus>("idle");
  const [_, startTransition] = useTransition();
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const lastSavedRef = useRef(initialNote);

  useEffect(() => {
    if (note === lastSavedRef.current) return;

    setStatus("saving");
    if (timerRef.current) clearTimeout(timerRef.current);

    timerRef.current = setTimeout(() => {
      startTransition(async () => {
        try {
          await updateDashboardNote(domain, note);
          lastSavedRef.current = note;
          setStatus("saved");
          setTimeout(() => setStatus((s) => (s === "saved" ? "idle" : s)), 1500);
        } catch {
          setStatus("error");
        }
      });
    }, SAVE_DEBOUNCE_MS);

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [note, domain]);

  return (
    <article
      className="flex h-full flex-col p-5 sm:p-6"
      style={{
        backgroundColor: "#fef3c7",
        borderColor: "#fde68a",
        borderWidth: "1px",
        borderRadius: "var(--dashboard-card-radius)",
        boxShadow: "0 8px 24px -6px rgba(202, 138, 4, 0.25)",
        color: "#78350f",
      }}
    >
      <div className="mb-3 flex items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <StickyNote className="h-4 w-4" />
          <h2 className="text-lg font-semibold tracking-tight">Notlarım</h2>
        </div>
        <SaveBadge status={status} />
      </div>
      <textarea
        value={note}
        onChange={(e) => setNote(e.target.value)}
        placeholder={"Bir not yaz...\n\nÖrn: 'Pazartesi Mehmet'in programını yenile'\n'Salı saat 18:00 görüşme'"}
        // text-base (16px) mobilde — iOS Safari'nin focus'ta otomatik zoom yapmasını engeller.
        // min-h: mobilde daha geniş, masaüstünde kompakt kalır.
        className="flex-1 min-h-[220px] sm:min-h-[180px] resize-none bg-transparent text-base sm:text-sm leading-relaxed outline-none placeholder:text-[#a16207]/60"
        style={{ color: "#78350f", fontFamily: "'Kalam', 'Caveat', 'Comic Sans MS', cursive, system-ui" }}
        maxLength={5000}
      />
      <p className="mt-2 text-[11px]" style={{ color: "#a16207" }}>
        {note.length}/5000
      </p>
    </article>
  );
}

function SaveBadge({ status }: { status: SaveStatus }) {
  if (status === "idle") return null;

  const labels: Record<Exclude<SaveStatus, "idle">, string> = {
    saving: "Kaydediliyor...",
    saved: "Kaydedildi ✓",
    error: "Hata",
  };

  const colors: Record<Exclude<SaveStatus, "idle">, string> = {
    saving: "#a16207",
    saved: "#15803d",
    error: "#b91c1c",
  };

  return (
    <span className="text-[11px] font-medium" style={{ color: colors[status] }}>
      {labels[status]}
    </span>
  );
}
