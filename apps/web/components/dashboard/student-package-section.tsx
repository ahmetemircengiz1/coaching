"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  updateStudentPackage,
  extendStudentPackage,
} from "@/app/site/[domain]/dashboard/students/actions";
import { resolvePackageWindow, formatRemaining, type PackageState } from "@/lib/student-package";

export interface PackageOption {
  id: string;
  name: string;
  duration: number; // hafta
  price: number;
  currency: string;
}

const inputStyle = {
  backgroundColor: "var(--dashboard-card-bg)",
  borderColor: "var(--dashboard-card-border)",
  color: "var(--dashboard-main-text)",
};

const STATE_STYLE: Record<Exclude<PackageState, "none">, { label: string; color: string }> = {
  active: { label: "Devam ediyor", color: "#4ade80" },
  endingSoon: { label: "Bitmek üzere", color: "#facc15" },
  expired: { label: "Süresi doldu", color: "#f87171" },
};

function toDateInputValue(d: Date): string {
  // yyyy-MM-dd — yerel saate göre (toISOString UTC'ye kaydırıp günü bir geri alabiliyor)
  const off = d.getTimezoneOffset() * 60000;
  return new Date(d.getTime() - off).toISOString().slice(0, 10);
}

export function StudentPackageSection({
  domain,
  studentId,
  packages,
  current,
  startDate,
  endDate,
}: {
  domain: string;
  studentId: string;
  packages: PackageOption[];
  current: { id: string; name: string; duration: number } | null;
  startDate: string;
  endDate: string | null;
}) {
  const router = useRouter();
  const [editing, setEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [selectedId, setSelectedId] = useState(current?.id ?? packages[0]?.id ?? "");
  const [startInput, setStartInput] = useState(toDateInputValue(new Date(startDate)));

  const win = resolvePackageWindow({
    startDate,
    endDate,
    packageDurationWeeks: current?.duration ?? null,
  });

  const handleSave = async () => {
    if (!selectedId) return;
    setLoading(true);
    const result = await updateStudentPackage(domain, studentId, {
      coachPackageId: selectedId,
      // Tarih input'u gün hassasiyetinde; günün başlangıcı olarak gönder
      startDate: new Date(`${startInput}T00:00:00`).toISOString(),
    });
    setLoading(false);
    if (result?.error) {
      toast.error(result.error);
      return;
    }
    toast.success("Paket güncellendi");
    setEditing(false);
    router.refresh();
  };

  const handleExtend = async (weeks: number) => {
    setLoading(true);
    const result = await extendStudentPackage(domain, studentId, weeks);
    setLoading(false);
    if (result?.error) {
      toast.error(result.error);
      return;
    }
    toast.success(`Paket ${weeks} hafta uzatıldı`);
    router.refresh();
  };

  if (packages.length === 0) {
    return (
      <div className="py-4 text-center">
        <p className="text-sm" style={{ color: "var(--dashboard-main-text)" }}>Henüz paket tanımlamadın</p>
        <p className="mx-auto mt-1.5 max-w-lg text-xs" style={{ color: "var(--dashboard-main-text-muted)" }}>
          Paketler sayfasından koçluk paketlerini oluşturduğunda buradan öğrencine atayabilirsin.
        </p>
        <a
          href={`/site/${domain}/dashboard/packages`}
          className="mt-3 inline-flex rounded-md px-3 py-1.5 text-sm font-semibold"
          style={{ backgroundColor: "var(--dashboard-accent)", color: "var(--dashboard-accent-text)" }}
        >
          Paketleri Yönet
        </a>
      </div>
    );
  }

  // ── Düzenleme formu (paket ata / değiştir) ──
  if (editing || !current) {
    return (
      <div className="space-y-3">
        {!current && (
          <p className="text-xs" style={{ color: "var(--dashboard-main-text-muted)" }}>
            Bu öğrenciye henüz paket atanmamış. Paketi ve başlangıç tarihini seçtiğinde bitiş
            tarihi paket süresinden otomatik hesaplanır.
          </p>
        )}
        <div className="grid gap-3 sm:grid-cols-2">
          <div>
            <label className="mb-1 block text-xs" style={{ color: "var(--dashboard-main-text-muted)" }}>Paket</label>
            <select
              value={selectedId}
              onChange={(e) => setSelectedId(e.target.value)}
              className="w-full rounded-md px-3 py-2 text-sm"
              style={{ ...inputStyle, border: "1px solid var(--dashboard-card-border)" }}
            >
              {packages.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.name} — {p.duration} hafta
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="mb-1 block text-xs" style={{ color: "var(--dashboard-main-text-muted)" }}>Başlangıç</label>
            <Input
              type="date"
              value={startInput}
              onChange={(e) => setStartInput(e.target.value)}
              style={inputStyle}
            />
          </div>
        </div>
        <div className="flex gap-2">
          <Button
            onClick={handleSave}
            disabled={loading || !selectedId}
            className="text-sm font-semibold hover:opacity-90"
            style={{ backgroundColor: "var(--dashboard-accent)", color: "var(--dashboard-accent-text)" }}
          >
            {loading ? "..." : current ? "Kaydet" : "Paketi Ata"}
          </Button>
          {current && (
            <Button
              onClick={() => setEditing(false)}
              className="rounded-md border px-4 py-2 text-sm"
              style={{ backgroundColor: "transparent", borderColor: "var(--dashboard-card-border)", color: "var(--dashboard-main-text)" }}
            >
              İptal
            </Button>
          )}
        </div>
      </div>
    );
  }

  // ── Özet görünüm ──
  const state = win.state === "none" ? null : STATE_STYLE[win.state];

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
        <div>
          <p className="text-xs" style={{ color: "var(--dashboard-main-text-muted)" }}>Paket</p>
          <p className="mt-1 text-sm font-semibold">{current.name}</p>
        </div>
        <div>
          <p className="text-xs" style={{ color: "var(--dashboard-main-text-muted)" }}>Başlangıç</p>
          <p className="mt-1 text-sm font-semibold">{win.startDate.toLocaleDateString("tr-TR")}</p>
        </div>
        <div>
          <p className="text-xs" style={{ color: "var(--dashboard-main-text-muted)" }}>Bitiş</p>
          <p className="mt-1 text-sm font-semibold">{win.endDate?.toLocaleDateString("tr-TR") ?? "-"}</p>
        </div>
        <div>
          <p className="text-xs" style={{ color: "var(--dashboard-main-text-muted)" }}>Kalan Süre</p>
          <p className="mt-1 text-sm font-semibold" style={{ color: state?.color }}>
            {formatRemaining(win)}
          </p>
        </div>
      </div>

      {state && (
        <div>
          <div className="mb-1 flex items-center justify-between text-[11px]" style={{ color: "var(--dashboard-main-text-muted)" }}>
            <span style={{ color: state.color }}>{state.label}</span>
            <span>%{win.progressPct} tamamlandı</span>
          </div>
          <div className="h-1.5 w-full overflow-hidden rounded-full" style={{ backgroundColor: "var(--dashboard-card-border)" }}>
            <div
              className="h-full rounded-full transition-all"
              style={{ width: `${Math.min(100, win.progressPct)}%`, backgroundColor: state.color }}
            />
          </div>
        </div>
      )}

      <div className="flex flex-wrap gap-2">
        <Button
          onClick={() => { setSelectedId(current.id); setEditing(true); }}
          className="rounded-md border px-3 py-1.5 text-sm"
          style={{ backgroundColor: "transparent", borderColor: "var(--dashboard-card-border)", color: "var(--dashboard-main-text)" }}
        >
          Paketi Değiştir
        </Button>
        {[4, 8].map((w) => (
          <Button
            key={w}
            onClick={() => handleExtend(w)}
            disabled={loading}
            className="rounded-md border px-3 py-1.5 text-sm"
            style={{ backgroundColor: "transparent", borderColor: "var(--dashboard-card-border)", color: "var(--dashboard-main-text)" }}
          >
            +{w} hafta uzat
          </Button>
        ))}
      </div>
    </div>
  );
}
