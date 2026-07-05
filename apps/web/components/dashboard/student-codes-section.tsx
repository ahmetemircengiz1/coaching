"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Copy, MessageCircle, X, ChevronDown, Plus, Check } from "lucide-react";
import {
  createRegistrationCode,
  revokeRegistrationCode,
} from "@/app/site/[domain]/dashboard/students/actions";

export type CodeItem = {
  id: string;
  code: string;
  label: string | null;
  packageName: string | null;
  packageId: string | null;
  status: "active" | "used" | "expired" | "revoked";
  expiresAt: string | null;
  usedAt: string | null;
  usedByStudentId: string | null;
  revokedAt: string | null;
  createdAt: string;
};

export type PackageOption = { id: string; name: string };

const STATUS_META: Record<CodeItem["status"], { label: string; bg: string; fg: string }> = {
  active: { label: "Aktif", bg: "rgba(34,197,94,0.15)", fg: "#22c55e" },
  used: { label: "Kullanıldı", bg: "rgba(59,130,246,0.15)", fg: "#3b82f6" },
  expired: { label: "Süresi Doldu", bg: "rgba(148,163,184,0.15)", fg: "#94a3b8" },
  revoked: { label: "İptal", bg: "rgba(239,68,68,0.15)", fg: "#ef4444" },
};

function StatusBadge({ status }: { status: CodeItem["status"] }) {
  const c = STATUS_META[status];
  return (
    <span
      className="inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-semibold shrink-0"
      style={{ backgroundColor: c.bg, color: c.fg }}
    >
      {c.label}
    </span>
  );
}

function shareWhatsApp(code: string) {
  const msg = `Merhaba! Koçluk hesabını oluşturmak için kayıt kodun: ${code}\n\nKayıt sayfasından e-posta, şifre ve bu kodu girerek hesabını oluşturabilirsin.`;
  window.open(`https://wa.me/?text=${encodeURIComponent(msg)}`, "_blank");
}

async function copyCode(code: string) {
  try {
    await navigator.clipboard.writeText(code);
    toast.success("Kod panoya kopyalandı.");
  } catch {
    toast.error("Kod kopyalanamadı.");
  }
}

export function StudentCodesSection({
  domain,
  packages,
  codes,
}: {
  domain: string;
  packages: PackageOption[];
  codes: CodeItem[];
}) {
  const router = useRouter();
  const [expanded, setExpanded] = useState(false);
  const [freshCode, setFreshCode] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const activeCodes = codes.filter((c) => c.status === "active");
  const otherCodes = codes.filter((c) => c.status !== "active");

  const generate = () => {
    startTransition(async () => {
      const result = await createRegistrationCode(domain, { expiresInDays: 30 });
      if ("error" in result && result.error) {
        toast.error(result.error);
        return;
      }
      if ("code" in result && result.code) {
        setFreshCode(result.code);
        void copyCode(result.code);
        router.refresh();
      }
    });
  };

  const handleRevoke = (codeId: string) => {
    if (!confirm("Bu kodu iptal etmek istediğinize emin misiniz?")) return;
    startTransition(async () => {
      const result = await revokeRegistrationCode(domain, codeId);
      if ("error" in result && result.error) {
        toast.error(result.error);
      } else {
        toast.success("Kod iptal edildi.");
        router.refresh();
      }
    });
  };

  const iconBtn =
    "inline-flex items-center justify-center h-8 w-8 rounded-lg transition hover:opacity-80";
  const iconBtnStyle = {
    backgroundColor: "color-mix(in srgb, var(--dashboard-accent) 8%, transparent)",
    color: "var(--dashboard-main-text-muted)",
  };

  return (
    <div className="space-y-3">
      {/* ── Başlık + tek tık üret ── */}
      <div className="flex items-center justify-between gap-3">
        <div className="min-w-0">
          <h2 className="font-heading text-sm font-semibold" style={{ color: "var(--dashboard-main-text)" }}>
            Kayıt Kodları
          </h2>
          <p className="text-xs mt-0.5" style={{ color: "var(--dashboard-main-text-muted)" }}>
            {activeCodes.length} kullanılmamış · öğrencine gönder, tek kullanımlık
          </p>
        </div>
        <button
          type="button"
          onClick={generate}
          disabled={isPending}
          className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-sm font-semibold transition hover:opacity-90 disabled:opacity-50 shrink-0"
          style={{ backgroundColor: "var(--dashboard-accent)", color: "var(--dashboard-accent-text)" }}
        >
          <Plus className="h-4 w-4" />
          {isPending ? "Üretiliyor..." : "Kod Üret"}
        </button>
      </div>

      {/* ── Yeni üretilen kod (öne çıkar) ── */}
      {freshCode && (
        <div
          className="flex flex-wrap items-center gap-3 p-3 rounded-xl animate-fade-in"
          style={{
            backgroundColor: "color-mix(in srgb, var(--dashboard-accent) 10%, var(--dashboard-card-bg))",
            border: "1px solid var(--dashboard-accent)",
          }}
        >
          <div className="flex items-center gap-2 min-w-0">
            <Check className="h-4 w-4 shrink-0" style={{ color: "var(--dashboard-accent)" }} />
            <span
              className="px-3 py-1.5 rounded-lg font-mono text-lg font-bold tracking-[0.25em]"
              style={{ backgroundColor: "var(--dashboard-card-bg)", color: "var(--dashboard-main-text)" }}
            >
              {freshCode}
            </span>
          </div>
          <span className="text-xs" style={{ color: "var(--dashboard-main-text-muted)" }}>
            Kopyalandı — öğrencine gönder
          </span>
          <div className="flex items-center gap-2 ml-auto">
            <button type="button" onClick={() => copyCode(freshCode)} className={iconBtn} style={iconBtnStyle} title="Kopyala">
              <Copy className="h-4 w-4" />
            </button>
            <button
              type="button"
              onClick={() => shareWhatsApp(freshCode)}
              className="inline-flex items-center gap-1.5 h-8 px-3 rounded-lg text-xs font-semibold transition hover:opacity-90"
              style={{ backgroundColor: "#25D366", color: "#fff" }}
            >
              <MessageCircle className="h-4 w-4" />
              WhatsApp
            </button>
            <button type="button" onClick={() => setFreshCode(null)} className={iconBtn} style={iconBtnStyle} title="Kapat">
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>
      )}

      {/* ── Aktif kodlar (kompakt satırlar) ── */}
      {activeCodes.length > 0 && (
        <div className="space-y-1.5">
          {activeCodes.map((c) => (
            <div
              key={c.id}
              className="flex items-center gap-2 px-3 py-2 rounded-lg"
              style={{ backgroundColor: "var(--dashboard-card-bg)", border: "1px solid var(--dashboard-card-border)" }}
            >
              <span
                className="font-mono text-sm font-bold tracking-widest px-2 py-1 rounded-md shrink-0"
                style={{
                  backgroundColor: "color-mix(in srgb, var(--dashboard-accent) 10%, transparent)",
                  color: "var(--dashboard-main-text)",
                }}
              >
                {c.code}
              </span>
              {c.packageName && (
                <span className="text-xs truncate hidden sm:inline" style={{ color: "var(--dashboard-main-text-muted)" }}>
                  {c.packageName}
                </span>
              )}
              <div className="flex items-center gap-1.5 ml-auto shrink-0">
                <button type="button" onClick={() => copyCode(c.code)} className={iconBtn} style={iconBtnStyle} title="Kopyala">
                  <Copy className="h-4 w-4" />
                </button>
                <button type="button" onClick={() => shareWhatsApp(c.code)} className={iconBtn} style={iconBtnStyle} title="WhatsApp ile gönder">
                  <MessageCircle className="h-4 w-4" />
                </button>
                <button
                  type="button"
                  onClick={() => handleRevoke(c.id)}
                  disabled={isPending}
                  className={iconBtn}
                  style={{ backgroundColor: "rgba(239,68,68,0.08)", color: "#ef4444" }}
                  title="İptal et"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* ── Geçmiş kodlar (kayıt altında) ── */}
      {otherCodes.length > 0 && (
        <div>
          <button
            type="button"
            onClick={() => setExpanded((v) => !v)}
            className="inline-flex items-center gap-1 text-xs font-medium transition hover:opacity-80"
            style={{ color: "var(--dashboard-main-text-muted)" }}
          >
            <ChevronDown className={`h-3.5 w-3.5 transition-transform ${expanded ? "rotate-180" : ""}`} />
            {expanded ? "Geçmiş kodları gizle" : `Geçmiş kodlar (${otherCodes.length})`}
          </button>
          {expanded && (
            <div className="grid gap-1.5 mt-2">
              {otherCodes.map((c) => (
                <div
                  key={c.id}
                  className="flex items-center justify-between gap-2 px-3 py-2 rounded-lg text-sm"
                  style={{ backgroundColor: "var(--dashboard-card-bg)", border: "1px solid var(--dashboard-card-border)" }}
                >
                  <div className="min-w-0 flex-1 flex items-center gap-2">
                    <span className="font-mono font-semibold opacity-70" style={{ color: "var(--dashboard-main-text)" }}>
                      {c.code}
                    </span>
                    {c.label && (
                      <span className="truncate" style={{ color: "var(--dashboard-main-text-muted)" }}>— {c.label}</span>
                    )}
                  </div>
                  <StatusBadge status={c.status} />
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
