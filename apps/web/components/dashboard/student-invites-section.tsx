"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  createStudentInvite,
  revokeStudentInvite,
} from "@/app/site/[domain]/dashboard/students/actions";

export type InviteItem = {
  id: string;
  email: string;
  name: string;
  packageName: string | null;
  status: "active" | "claimed" | "expired" | "revoked";
  expiresAt: string;
  claimedAt: string | null;
  revokedAt: string | null;
  createdAt: string;
  inviteUrl: string | null;
};

export type PackageOption = { id: string; name: string };

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("tr-TR", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

function StatusBadge({ status }: { status: InviteItem["status"] }) {
  const config = {
    active: { label: "Aktif", bg: "rgba(34,197,94,0.15)", fg: "#22c55e" },
    claimed: { label: "Kullanıldı", bg: "rgba(59,130,246,0.15)", fg: "#3b82f6" },
    expired: { label: "Süresi Doldu", bg: "rgba(148,163,184,0.15)", fg: "#94a3b8" },
    revoked: { label: "İptal", bg: "rgba(239,68,68,0.15)", fg: "#ef4444" },
  }[status];

  return (
    <span
      className="inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-semibold"
      style={{ backgroundColor: config.bg, color: config.fg }}
    >
      {config.label}
    </span>
  );
}

export function StudentInvitesSection({
  domain,
  packages,
  invites,
}: {
  domain: string;
  packages: PackageOption[];
  invites: InviteItem[];
}) {
  const router = useRouter();
  const [showModal, setShowModal] = useState(false);
  const [expanded, setExpanded] = useState(false);
  const [lastCreated, setLastCreated] = useState<{ url: string; email: string; name: string } | null>(null);
  const [form, setForm] = useState({
    email: "",
    name: "",
    packageId: "",
    expiresInDays: 7,
  });
  const [error, setError] = useState("");
  const [isPending, startTransition] = useTransition();

  const activeInvites = invites.filter((i) => i.status === "active");
  const otherInvites = invites.filter((i) => i.status !== "active");

  const openModal = () => {
    setForm({ email: "", name: "", packageId: "", expiresInDays: 7 });
    setError("");
    setLastCreated(null);
    setShowModal(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    startTransition(async () => {
      const result = await createStudentInvite(domain, {
        email: form.email.trim(),
        name: form.name.trim(),
        packageId: form.packageId || undefined,
        expiresInDays: form.expiresInDays,
      });

      if ("error" in result && result.error) {
        setError(result.error);
        return;
      }

      if ("inviteUrl" in result && result.inviteUrl) {
        setLastCreated({ url: result.inviteUrl, email: form.email.trim(), name: form.name.trim() });
        if ("duplicate" in result && result.duplicate) {
          toast.info("Bu e-posta için zaten aktif bir davet vardı — mevcut link gösteriliyor.");
        } else {
          toast.success("Davet linki oluşturuldu.");
        }
        router.refresh();
      }
    });
  };

  const copyUrl = async (url: string) => {
    try {
      await navigator.clipboard.writeText(url);
      toast.success("Link panoya kopyalandı.");
    } catch {
      toast.error("Link kopyalanamadı.");
    }
  };

  const whatsappShare = (url: string, name: string) => {
    const msg = `Merhaba ${name}, koçluk sürecinize başlamak için aşağıdaki linkten hesabınızı oluşturun:\n\n${url}\n\nLink 7 gün geçerli olacaktır.`;
    window.open(`https://wa.me/?text=${encodeURIComponent(msg)}`, "_blank");
  };

  const handleRevoke = async (inviteId: string) => {
    if (!confirm("Bu daveti iptal etmek istediğinize emin misiniz?")) return;
    startTransition(async () => {
      const result = await revokeStudentInvite(domain, inviteId);
      if ("error" in result && result.error) {
        toast.error(result.error);
      } else {
        toast.success("Davet iptal edildi.");
        router.refresh();
      }
    });
  };

  return (
    <>
      <div className="flex items-center justify-between">
        <div>
          <h2 className="font-heading text-lg font-semibold" style={{ color: "var(--dashboard-main-text)" }}>
            Davetler
          </h2>
          <p className="text-xs mt-0.5" style={{ color: "var(--dashboard-main-text-muted)" }}>
            {activeInvites.length} aktif davet
          </p>
        </div>
        <Button
          onClick={openModal}
          style={{ backgroundColor: "var(--dashboard-accent)", color: "var(--dashboard-accent-text)" }}
        >
          + Öğrenci Davet Et
        </Button>
      </div>

      {activeInvites.length > 0 && (
        <div className="grid gap-3">
          {activeInvites.map((inv) => (
            <Card
              key={inv.id}
              style={{ backgroundColor: "var(--dashboard-card-bg)", borderColor: "var(--dashboard-card-border)" }}
            >
              <CardContent className="py-4">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <p className="font-semibold truncate" style={{ color: "var(--dashboard-main-text)" }}>
                        {inv.name}
                      </p>
                      <StatusBadge status={inv.status} />
                    </div>
                    <p className="text-sm truncate" style={{ color: "var(--dashboard-main-text-muted)" }}>
                      {inv.email}
                    </p>
                    <div className="flex gap-3 mt-1 text-xs flex-wrap" style={{ color: "var(--dashboard-main-text-muted)" }}>
                      {inv.packageName && <span>Paket: {inv.packageName}</span>}
                      <span>Bitiş: {formatDate(inv.expiresAt)}</span>
                    </div>
                  </div>
                  <div className="flex gap-2 flex-wrap">
                    {inv.inviteUrl && (
                      <>
                        <Button size="sm" variant="outline" onClick={() => copyUrl(inv.inviteUrl!)}>
                          Linki Kopyala
                        </Button>
                        <Button size="sm" variant="outline" onClick={() => whatsappShare(inv.inviteUrl!, inv.name)}>
                          WhatsApp
                        </Button>
                      </>
                    )}
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleRevoke(inv.id)}
                      disabled={isPending}
                      style={{ color: "#ef4444", borderColor: "rgba(239,68,68,0.3)" }}
                    >
                      İptal
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {otherInvites.length > 0 && (
        <div className="space-y-2">
          <button
            onClick={() => setExpanded((v) => !v)}
            className="text-xs font-medium underline"
            style={{ color: "var(--dashboard-main-text-muted)" }}
          >
            {expanded ? "Geçmiş davetleri gizle" : `Geçmiş davetleri göster (${otherInvites.length})`}
          </button>
          {expanded && (
            <div className="grid gap-2">
              {otherInvites.map((inv) => (
                <div
                  key={inv.id}
                  className="flex items-center justify-between gap-2 px-3 py-2 rounded-lg text-sm"
                  style={{
                    backgroundColor: "var(--dashboard-card-bg)",
                    border: "1px solid var(--dashboard-card-border)",
                  }}
                >
                  <div className="min-w-0 flex-1">
                    <p className="truncate" style={{ color: "var(--dashboard-main-text)" }}>
                      {inv.name} <span style={{ color: "var(--dashboard-main-text-muted)" }}>— {inv.email}</span>
                    </p>
                  </div>
                  <StatusBadge status={inv.status} />
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {showModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          style={{ backgroundColor: "rgba(0,0,0,0.6)" }}
          onClick={() => !isPending && setShowModal(false)}
        >
          <div
            className="w-full max-w-md rounded-2xl p-6 max-h-[90vh] overflow-y-auto"
            style={{
              backgroundColor: "var(--dashboard-card-bg)",
              border: "1px solid var(--dashboard-card-border)",
              color: "var(--dashboard-main-text)",
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-heading text-lg font-bold">
                {lastCreated ? "Davet Linki Hazır" : "Öğrenci Davet Et"}
              </h3>
              <button
                onClick={() => setShowModal(false)}
                disabled={isPending}
                className="text-xl opacity-60 hover:opacity-100"
              >
                ×
              </button>
            </div>

            {lastCreated ? (
              <div className="space-y-4">
                <p className="text-sm" style={{ color: "var(--dashboard-main-text-muted)" }}>
                  <span className="font-semibold" style={{ color: "var(--dashboard-main-text)" }}>
                    {lastCreated.name}
                  </span>{" "}
                  ({lastCreated.email}) için davet linki oluşturuldu.
                </p>
                <div
                  className="p-3 rounded-lg text-xs break-all font-mono"
                  style={{
                    backgroundColor: "color-mix(in srgb, var(--dashboard-accent) 8%, transparent)",
                    border: "1px solid color-mix(in srgb, var(--dashboard-accent) 30%, transparent)",
                    color: "var(--dashboard-main-text)",
                  }}
                >
                  {lastCreated.url}
                </div>
                <div className="flex gap-2">
                  <Button
                    type="button"
                    className="flex-1"
                    onClick={() => copyUrl(lastCreated.url)}
                    style={{ backgroundColor: "var(--dashboard-accent)", color: "var(--dashboard-accent-text)" }}
                  >
                    Linki Kopyala
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    className="flex-1"
                    onClick={() => whatsappShare(lastCreated.url, lastCreated.name)}
                  >
                    WhatsApp ile Gönder
                  </Button>
                </div>
                <p className="text-xs text-center" style={{ color: "var(--dashboard-main-text-muted)" }}>
                  Bu link {form.expiresInDays} gün geçerli ve tek kullanımlıktır.
                </p>
                <Button type="button" variant="outline" className="w-full" onClick={() => setShowModal(false)}>
                  Kapat
                </Button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                {error && (
                  <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-sm">
                    {error}
                  </div>
                )}

                <div>
                  <label className="text-sm font-medium mb-1.5 block" style={{ color: "var(--dashboard-main-text-muted)" }}>
                    Ad Soyad
                  </label>
                  <Input
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    placeholder="Örn: Mehmet Yılmaz"
                    required
                    minLength={2}
                    maxLength={100}
                    style={{
                      backgroundColor: "var(--dashboard-card-bg)",
                      borderColor: "var(--dashboard-card-border)",
                      color: "var(--dashboard-main-text)",
                    }}
                  />
                </div>

                <div>
                  <label className="text-sm font-medium mb-1.5 block" style={{ color: "var(--dashboard-main-text-muted)" }}>
                    E-posta
                  </label>
                  <Input
                    type="email"
                    value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                    placeholder="ornek@mail.com"
                    required
                    style={{
                      backgroundColor: "var(--dashboard-card-bg)",
                      borderColor: "var(--dashboard-card-border)",
                      color: "var(--dashboard-main-text)",
                    }}
                  />
                </div>

                <div>
                  <label className="text-sm font-medium mb-1.5 block" style={{ color: "var(--dashboard-main-text-muted)" }}>
                    Paket (opsiyonel)
                  </label>
                  <select
                    value={form.packageId}
                    onChange={(e) => setForm({ ...form, packageId: e.target.value })}
                    className="w-full h-10 px-3 rounded-md text-sm"
                    style={{
                      backgroundColor: "var(--dashboard-card-bg)",
                      border: "1px solid var(--dashboard-card-border)",
                      color: "var(--dashboard-main-text)",
                    }}
                  >
                    <option value="">Paket atama</option>
                    {packages.map((p) => (
                      <option key={p.id} value={p.id}>
                        {p.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="text-sm font-medium mb-1.5 block" style={{ color: "var(--dashboard-main-text-muted)" }}>
                    Geçerlilik Süresi
                  </label>
                  <select
                    value={form.expiresInDays}
                    onChange={(e) => setForm({ ...form, expiresInDays: Number(e.target.value) })}
                    className="w-full h-10 px-3 rounded-md text-sm"
                    style={{
                      backgroundColor: "var(--dashboard-card-bg)",
                      border: "1px solid var(--dashboard-card-border)",
                      color: "var(--dashboard-main-text)",
                    }}
                  >
                    <option value={3}>3 gün</option>
                    <option value={7}>7 gün</option>
                    <option value={14}>14 gün</option>
                    <option value={30}>30 gün</option>
                  </select>
                </div>

                <div className="flex gap-2 pt-2">
                  <Button
                    type="button"
                    variant="outline"
                    className="flex-1"
                    onClick={() => setShowModal(false)}
                    disabled={isPending}
                  >
                    İptal
                  </Button>
                  <Button
                    type="submit"
                    className="flex-1"
                    disabled={isPending}
                    style={{ backgroundColor: "var(--dashboard-accent)", color: "var(--dashboard-accent-text)" }}
                  >
                    {isPending ? "Oluşturuluyor..." : "Davet Oluştur"}
                  </Button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </>
  );
}
