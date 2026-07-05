"use client";

import Link from "next/link";
import { useMemo, useState } from "react";

type RailStudent = {
  id: string;
  name: string;
  status: string;
};

const cardStyle = {
  backgroundColor: "var(--dashboard-card-bg)",
  borderColor: "var(--dashboard-card-border)",
};

function StatusDot({ active }: { active: boolean }) {
  return (
    <span
      className="w-2 h-2 rounded-full shrink-0"
      style={{ backgroundColor: active ? "#22c55e" : "var(--dashboard-card-border)" }}
      aria-hidden
    />
  );
}

/**
 * Öğrenci detay sayfasında hızlı geçiş için öğrenci listesi.
 * Masaüstünde solda sabit (sticky) dikey ray; mobilde üstte yatay kaydırılan şerit.
 */
export function StudentSwitcherRail({
  domain,
  students,
  currentId,
}: {
  domain: string;
  students: RailStudent[];
  currentId: string;
}) {
  const [q, setQ] = useState("");

  const filtered = useMemo(() => {
    if (!q.trim()) return students;
    const needle = q.toLowerCase();
    return students.filter((s) => s.name.toLowerCase().includes(needle));
  }, [students, q]);

  const href = (id: string) => `/site/${domain}/dashboard/students/${id}`;

  return (
    <>
      {/* ── Masaüstü: sol dikey ray ── */}
      <aside className="hidden lg:block w-56 shrink-0">
        <div
          className="sticky top-4 rounded-2xl border p-3 flex flex-col"
          style={{ ...cardStyle, maxHeight: "calc(100vh - 2rem)" }}
        >
          <div className="flex items-center justify-between px-1 mb-2">
            <span className="text-sm font-semibold" style={{ color: "var(--dashboard-main-text)" }}>
              Öğrenciler
            </span>
            <span className="text-xs" style={{ color: "var(--dashboard-main-text-muted)" }}>
              {students.length}
            </span>
          </div>

          {students.length > 6 && (
            <input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Ara..."
              className="mb-2 w-full rounded-lg px-3 py-1.5 text-xs outline-none"
              style={{
                backgroundColor: "color-mix(in srgb, var(--dashboard-accent) 4%, var(--dashboard-card-bg))",
                border: "1px solid var(--dashboard-card-border)",
                color: "var(--dashboard-main-text)",
              }}
            />
          )}

          <nav className="flex-1 overflow-y-auto -mx-1 px-1 space-y-1">
            {filtered.map((s) => {
              const isCurrent = s.id === currentId;
              return (
                <Link
                  key={s.id}
                  href={href(s.id)}
                  scroll
                  aria-current={isCurrent ? "page" : undefined}
                  className="flex items-center gap-2.5 rounded-xl px-2.5 py-2 transition"
                  style={{
                    backgroundColor: isCurrent
                      ? "color-mix(in srgb, var(--dashboard-accent) 14%, transparent)"
                      : "transparent",
                    border: `1px solid ${isCurrent ? "var(--dashboard-accent)" : "transparent"}`,
                  }}
                >
                  <span
                    className="w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold shrink-0"
                    style={{
                      backgroundColor: "color-mix(in srgb, var(--dashboard-accent) 15%, var(--dashboard-card-bg))",
                      color: "var(--dashboard-accent)",
                    }}
                  >
                    {s.name.charAt(0)}
                  </span>
                  <span
                    className="flex-1 min-w-0 text-sm truncate"
                    style={{
                      color: isCurrent ? "var(--dashboard-accent)" : "var(--dashboard-main-text)",
                      fontWeight: isCurrent ? 600 : 400,
                    }}
                  >
                    {s.name}
                  </span>
                  <StatusDot active={s.status === "active"} />
                </Link>
              );
            })}
            {filtered.length === 0 && (
              <p className="text-xs px-2 py-3 text-center" style={{ color: "var(--dashboard-main-text-muted)" }}>
                Eşleşme yok
              </p>
            )}
          </nav>
        </div>
      </aside>

      {/* ── Mobil: üstte yatay kaydırılan şerit ── */}
      <div className="lg:hidden -mx-1 mb-1 overflow-x-auto">
        <div className="flex gap-2 px-1 pb-1">
          {students.map((s) => {
            const isCurrent = s.id === currentId;
            return (
              <Link
                key={s.id}
                href={href(s.id)}
                scroll
                aria-current={isCurrent ? "page" : undefined}
                className="flex items-center gap-2 rounded-full px-3 py-1.5 shrink-0 transition"
                style={{
                  backgroundColor: isCurrent
                    ? "color-mix(in srgb, var(--dashboard-accent) 16%, transparent)"
                    : "var(--dashboard-card-bg)",
                  border: `1px solid ${isCurrent ? "var(--dashboard-accent)" : "var(--dashboard-card-border)"}`,
                }}
              >
                <span
                  className="w-6 h-6 rounded-full flex items-center justify-center text-xs font-semibold"
                  style={{
                    backgroundColor: "color-mix(in srgb, var(--dashboard-accent) 15%, var(--dashboard-card-bg))",
                    color: "var(--dashboard-accent)",
                  }}
                >
                  {s.name.charAt(0)}
                </span>
                <span
                  className="text-xs whitespace-nowrap"
                  style={{
                    color: isCurrent ? "var(--dashboard-accent)" : "var(--dashboard-main-text)",
                    fontWeight: isCurrent ? 600 : 400,
                  }}
                >
                  {s.name.split(" ")[0]}
                </span>
              </Link>
            );
          })}
        </div>
      </div>
    </>
  );
}
