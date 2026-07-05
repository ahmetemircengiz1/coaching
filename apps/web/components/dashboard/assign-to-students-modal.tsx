"use client";

import { useEffect, useMemo, useState, useTransition } from "react";
import { X, Search, Check, AlertCircle } from "lucide-react";
import {
  assignProgramToStudents,
  assignNutritionPlanToStudents,
  getAssignableStudents,
} from "@/app/site/[domain]/dashboard/students/assign-actions";

type StudentRow = {
  id: string;
  name: string;
  activeProgramName: string | null;
  activeNutritionName: string | null;
};

export function AssignToStudentsModal({
  domain,
  kind,
  planId,
  planName,
  open,
  onClose,
  onAssigned,
}: {
  domain: string;
  kind: "program" | "nutrition";
  planId: string;
  planName: string;
  open: boolean;
  onClose: () => void;
  onAssigned?: (count: number) => void;
}) {
  const [students, setStudents] = useState<StudentRow[] | null>(null);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [_, startTransition] = useTransition();

  useEffect(() => {
    if (!open) return;
    setStudents(null);
    setSelected(new Set());
    setError(null);
    setSuccess(null);
    setSearch("");

    getAssignableStudents(domain)
      .then((rows) => setStudents(rows))
      .catch(() => setError("Öğrenciler yüklenemedi"));
  }, [open, domain]);

  const filtered = useMemo(() => {
    if (!students) return [];
    const q = search.trim().toLowerCase();
    if (!q) return students;
    return students.filter((s) => s.name.toLowerCase().includes(q));
  }, [students, search]);

  const toggle = (id: string) => {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const toggleAll = () => {
    if (selected.size === filtered.length) {
      setSelected(new Set());
    } else {
      setSelected(new Set(filtered.map((s) => s.id)));
    }
  };

  const handleSubmit = () => {
    if (selected.size === 0) return;
    setLoading(true);
    setError(null);

    startTransition(async () => {
      try {
        const ids = Array.from(selected);
        const result =
          kind === "program"
            ? await assignProgramToStudents(domain, planId, ids)
            : await assignNutritionPlanToStudents(domain, planId, ids);

        if (!result.success) {
          setError(("error" in result && result.error) || "Atama başarısız");
          setLoading(false);
          return;
        }

        setSuccess(`${result.count ?? ids.length} öğrenciye atandı ✓`);
        onAssigned?.(result.count ?? ids.length);

        setTimeout(() => {
          setLoading(false);
          onClose();
        }, 900);
      } catch {
        setError("Bir hata oluştu");
        setLoading(false);
      }
    });
  };

  if (!open) return null;

  const kindLabel = kind === "program" ? "programı" : "beslenme planını";
  const activeFieldLabel = kind === "program" ? "Aktif program" : "Aktif beslenme";
  const getActiveValue = (s: StudentRow) =>
    kind === "program" ? s.activeProgramName : s.activeNutritionName;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ backgroundColor: "rgba(0,0,0,0.6)" }}
      onClick={onClose}
    >
      <div
        className="w-full max-w-lg rounded-2xl shadow-2xl flex flex-col max-h-[85vh]"
        style={{
          backgroundColor: "var(--dashboard-card-bg)",
          borderColor: "var(--dashboard-card-border)",
          borderWidth: "1px",
          color: "var(--dashboard-main-text)",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div
          className="flex items-start justify-between p-5 border-b"
          style={{ borderColor: "var(--dashboard-card-border)" }}
        >
          <div className="min-w-0">
            <h2 className="text-lg font-semibold">Öğrenci(ler)e ata</h2>
            <p
              className="mt-1 text-sm truncate"
              style={{ color: "var(--dashboard-main-text-muted)" }}
            >
              <span className="font-medium">{planName}</span> {kindLabel}
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1 rounded-lg hover:bg-white/10 transition-colors"
            aria-label="Kapat"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Search */}
        <div className="p-4 border-b" style={{ borderColor: "var(--dashboard-card-border)" }}>
          <div className="relative">
            <Search
              className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 opacity-50"
              style={{ color: "var(--dashboard-main-text-muted)" }}
            />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Öğrenci ara..."
              className="w-full pl-10 pr-3 py-2 rounded-lg outline-none text-sm border"
              style={{
                backgroundColor: "color-mix(in srgb, var(--dashboard-main-text) 4%, transparent)",
                borderColor: "var(--dashboard-card-border)",
                color: "var(--dashboard-main-text)",
              }}
            />
          </div>
        </div>

        {/* List */}
        <div className="flex-1 overflow-y-auto">
          {students === null ? (
            <div className="p-8 text-center text-sm" style={{ color: "var(--dashboard-main-text-muted)" }}>
              Yükleniyor...
            </div>
          ) : filtered.length === 0 ? (
            <div className="p-8 text-center text-sm" style={{ color: "var(--dashboard-main-text-muted)" }}>
              {students.length === 0 ? "Aktif öğrenci yok." : "Eşleşen öğrenci bulunamadı."}
            </div>
          ) : (
            <>
              {/* Select all bar */}
              <div
                className="sticky top-0 z-10 px-4 py-2 border-b flex items-center justify-between"
                style={{
                  backgroundColor: "var(--dashboard-card-bg)",
                  borderColor: "var(--dashboard-card-border)",
                }}
              >
                <button
                  type="button"
                  onClick={toggleAll}
                  className="text-xs font-medium underline"
                  style={{ color: "var(--dashboard-accent)" }}
                >
                  {selected.size === filtered.length ? "Tüm seçimi kaldır" : "Tümünü seç"}
                </button>
                <span className="text-xs" style={{ color: "var(--dashboard-main-text-muted)" }}>
                  {selected.size} / {filtered.length} seçili
                </span>
              </div>

              <ul>
                {filtered.map((s) => {
                  const isSelected = selected.has(s.id);
                  const currentPlan = getActiveValue(s);
                  return (
                    <li key={s.id}>
                      <button
                        type="button"
                        onClick={() => toggle(s.id)}
                        className="w-full text-left px-4 py-3 flex items-center gap-3 border-b transition-colors hover:bg-white/5"
                        style={{ borderColor: "var(--dashboard-card-border)" }}
                      >
                        <div
                          className="flex h-5 w-5 shrink-0 items-center justify-center rounded border"
                          style={{
                            borderColor: isSelected
                              ? "var(--dashboard-accent)"
                              : "var(--dashboard-card-border)",
                            backgroundColor: isSelected
                              ? "var(--dashboard-accent)"
                              : "transparent",
                          }}
                        >
                          {isSelected && (
                            <Check
                              className="h-3.5 w-3.5"
                              style={{ color: "var(--dashboard-accent-text, #000)" }}
                            />
                          )}
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className="text-sm font-medium">{s.name}</p>
                          {currentPlan && (
                            <p
                              className="mt-0.5 text-xs flex items-center gap-1"
                              style={{ color: "var(--dashboard-main-text-muted)" }}
                            >
                              <AlertCircle className="h-3 w-3 opacity-70" />
                              {activeFieldLabel}: {currentPlan}{" "}
                              <span className="opacity-60">(üzerine yazılacak)</span>
                            </p>
                          )}
                        </div>
                      </button>
                    </li>
                  );
                })}
              </ul>
            </>
          )}
        </div>

        {/* Footer */}
        <div
          className="p-4 border-t flex items-center justify-between gap-3"
          style={{ borderColor: "var(--dashboard-card-border)" }}
        >
          <div className="text-xs min-w-0 flex-1">
            {error && <span style={{ color: "#ef4444" }}>{error}</span>}
            {success && <span style={{ color: "#10b981" }}>{success}</span>}
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onClose}
              disabled={loading}
              className="px-3 py-2 text-sm rounded-lg border transition-colors hover:bg-white/5"
              style={{
                borderColor: "var(--dashboard-card-border)",
                color: "var(--dashboard-main-text)",
              }}
            >
              İptal
            </button>
            <button
              type="button"
              onClick={handleSubmit}
              disabled={selected.size === 0 || loading || !!success}
              className="px-4 py-2 text-sm font-semibold rounded-lg transition-all hover:scale-[1.02] disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:scale-100"
              style={{
                backgroundColor: "var(--dashboard-accent)",
                color: "var(--dashboard-accent-text, #000)",
              }}
            >
              {loading
                ? "Atanıyor..."
                : selected.size === 0
                  ? "Ata"
                  : `${selected.size} öğrenciye ata`}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
