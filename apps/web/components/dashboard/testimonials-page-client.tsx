"use client";

import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ValidatedInput } from "@/components/dashboard/validated-input";
import {
  createTestimonial,
  updateTestimonial,
  deleteTestimonial,
} from "@/app/site/[domain]/dashboard/testimonials/actions";
import { ConfirmDialog, useConfirmDialog } from "@/components/dashboard/confirm-dialog";
import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import FileUpload from "@/components/ui/file-upload";

interface TestimonialData {
  id: string;
  clientName: string;
  role: string | null;
  quote: string;
  rating: number | null;
  avatar: string | null;
  isPublished: boolean;
}

export default function TestimonialsPageClient({
  domain,
  testimonials,
}: {
  domain: string;
  testimonials: TestimonialData[];
}) {
  const router = useRouter();
  const { confirm, dialogProps } = useConfirmDialog();
  const [editingId, setEditingId] = useState<string | null>(null);
  const [showCreate, setShowCreate] = useState(false);
  const [loading, setLoading] = useState(false);

  const [local, setLocal] = useState<TestimonialData[]>(testimonials);
  useEffect(() => {
    setLocal(testimonials);
  }, [testimonials]);

  const [clientName, setClientName] = useState("");
  const [role, setRole] = useState("");
  const [quote, setQuote] = useState("");
  const [rating, setRating] = useState(0);
  const [avatar, setAvatar] = useState("");
  const [isPublished, setIsPublished] = useState(true);

  const startEdit = (t: TestimonialData) => {
    setEditingId(t.id);
    setClientName(t.clientName);
    setRole(t.role || "");
    setQuote(t.quote);
    setRating(t.rating || 0);
    setAvatar(t.avatar || "");
    setIsPublished(t.isPublished);
    setShowCreate(true);
  };

  const startCreate = () => {
    setEditingId(null);
    setClientName("");
    setRole("");
    setQuote("");
    setRating(0);
    setAvatar("");
    setIsPublished(true);
    setShowCreate(true);
  };

  const handleSave = async () => {
    if (!quote.trim()) return;
    setLoading(true);

    const data = {
      clientName: clientName.trim() || "Danışan",
      role: role.trim() || undefined,
      quote: quote.trim(),
      rating: rating > 0 ? rating : undefined,
      avatar: avatar.trim() || undefined,
      isPublished,
    };

    // Optimistik local state için undefined → null normalizasyonu
    const normalized: Omit<TestimonialData, "id"> = {
      clientName: data.clientName,
      role: data.role || null,
      quote: data.quote,
      rating: data.rating || null,
      avatar: data.avatar || null,
      isPublished: data.isPublished,
    };

    if (editingId) {
      setLocal((prev) =>
        prev.map((t) => (t.id === editingId ? { ...t, ...normalized } : t))
      );
    } else {
      setLocal((prev) => [...prev, { id: `temp-${Date.now()}`, ...normalized }]);
    }

    const id = editingId;
    setEditingId(null);
    setShowCreate(false);
    setLoading(false);

    if (id) {
      await updateTestimonial(domain, id, data);
    } else {
      await createTestimonial(domain, data);
    }
  };

  const handleDelete = async (id: string) => {
    const t = local.find((tr) => tr.id === id);
    const confirmed = await confirm({
      title: "Yorumu Sil",
      description: `"${t?.clientName || "Bu yorum"}" kalıcı olarak silinecek. Bu işlem geri alınamaz.`,
      confirmText: "Sil",
      variant: "danger",
    });
    if (!confirmed) return;

    setLocal((prev) => prev.filter((tr) => tr.id !== id));
    await deleteTestimonial(domain, id);
  };

  const isEditing = showCreate || editingId;
  const inputStyle = {
    backgroundColor: "var(--dashboard-card-bg)",
    borderColor: "var(--dashboard-card-border)",
    color: "var(--dashboard-main-text)",
  };

  return (
    <div className="space-y-6 py-6" style={{ color: "var(--dashboard-main-text)" }}>
      {/* Geri tuşu — Ayarlar → Site İçeriği → Yorumlar sekmesine döner */}
      <button
        type="button"
        onClick={() => router.push(`/site/${domain}/dashboard/settings`)}
        className="inline-flex items-center gap-1.5 text-sm transition hover:opacity-80"
        style={{ color: "var(--dashboard-main-text-muted)" }}
      >
        <ArrowLeft className="h-4 w-4" />
        Ayarlara Dön
      </button>

      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-heading text-xl font-bold">Öğrenci Yorumları</h1>
          <p className="text-sm mt-1" style={{ color: "var(--dashboard-main-text-muted)" }}>
            Landing page&apos;inizdeki yorumlar bölümünde görünür
          </p>
        </div>
        {!isEditing && (
          <Button
            onClick={startCreate}
            style={{ backgroundColor: "var(--dashboard-accent)", color: "var(--dashboard-accent-text)" }}
            className="font-semibold hover:opacity-90"
          >
            + Yeni Yorum
          </Button>
        )}
      </div>

      {isEditing && (
        <Card style={{ backgroundColor: "var(--dashboard-card-bg)", borderColor: "var(--dashboard-card-border)" }}>
          <CardContent className="p-4 space-y-3">
            <h3 className="font-semibold">{editingId ? "Yorumu Düzenle" : "Yeni Öğrenci Yorumu"}</h3>

            <ValidatedInput
              value={clientName}
              onChange={(e) => setClientName(e.target.value)}
              placeholder="Danışan adı"
              error={!clientName.trim() ? "Danışan adı zorunludur" : undefined}
              style={inputStyle}
            />

            <Input
              value={role}
              onChange={(e) => setRole(e.target.value)}
              placeholder="Meslek / Rol (örn: Yazılımcı, Online Danışan) — opsiyonel"
              style={inputStyle}
            />

            <div>
              <label className="text-xs mb-1 block" style={{ color: "var(--dashboard-main-text-muted)" }}>
                Yorum metni
              </label>
              <textarea
                value={quote}
                onChange={(e) => setQuote(e.target.value)}
                placeholder="Danışanın yorumu / deneyimi"
                rows={3}
                className="w-full rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2"
                style={{
                  backgroundColor: "var(--dashboard-card-bg)",
                  border: "1px solid var(--dashboard-card-border)",
                  color: "var(--dashboard-main-text)",
                }}
              />
            </div>

            {/* Yıldız puanı */}
            <div>
              <label className="text-xs mb-1 block" style={{ color: "var(--dashboard-main-text-muted)" }}>
                Yıldız puanı (opsiyonel)
              </label>
              <div className="flex items-center gap-1.5">
                {[1, 2, 3, 4, 5].map((n) => (
                  <button
                    key={n}
                    type="button"
                    onClick={() => setRating(rating === n ? 0 : n)}
                    aria-label={`${n} yıldız`}
                    className="text-2xl leading-none transition-transform hover:scale-110"
                    style={{ color: n <= rating ? "#facc15" : "var(--dashboard-card-border)" }}
                  >
                    ★
                  </button>
                ))}
                {rating > 0 && (
                  <button
                    type="button"
                    onClick={() => setRating(0)}
                    className="ml-2 text-xs"
                    style={{ color: "var(--dashboard-main-text-muted)" }}
                  >
                    Temizle
                  </button>
                )}
              </div>
            </div>

            {/* Fotoğraf */}
            <div>
              <label className="text-xs mb-1 block" style={{ color: "var(--dashboard-main-text-muted)" }}>
                Danışan Fotoğrafı (opsiyonel)
              </label>
              <div className="max-w-[160px]">
                <FileUpload
                  bucket="transformations"
                  currentUrl={avatar || undefined}
                  onUploaded={(url) => setAvatar(url)}
                  label="Fotoğraf"
                  aspectRatio="aspect-square"
                />
              </div>
            </div>

            <label className="flex items-center gap-2 text-sm">
              <input type="checkbox" checked={isPublished} onChange={(e) => setIsPublished(e.target.checked)} />
              <span style={{ color: "var(--dashboard-main-text-muted)" }}>
                Yayında (landing page&apos;de görünsün)
              </span>
            </label>

            <div className="flex gap-2">
              <Button
                onClick={handleSave}
                disabled={loading || !quote.trim()}
                style={{ backgroundColor: "var(--dashboard-accent)", color: "var(--dashboard-accent-text)" }}
                className="font-semibold hover:opacity-90"
              >
                {loading ? "..." : editingId ? "Güncelle" : "Oluştur"}
              </Button>
              <Button
                onClick={() => {
                  setEditingId(null);
                  setShowCreate(false);
                }}
                className="border rounded-md px-4 py-2"
                style={{ backgroundColor: "transparent", borderColor: "var(--dashboard-card-border)", color: "var(--dashboard-main-text)" }}
              >
                İptal
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {local.length === 0 && !showCreate ? (
        <Card className="animate-fade-in" style={{ backgroundColor: "var(--dashboard-card-bg)", borderColor: "var(--dashboard-card-border)" }}>
          <CardContent className="py-16 text-center">
            <p className="text-4xl mb-3">💬</p>
            <p className="text-lg font-medium mb-1" style={{ color: "var(--dashboard-main-text-muted)" }}>
              Henüz öğrenci yorumu yok
            </p>
            <p className="text-sm max-w-md mx-auto" style={{ color: "var(--dashboard-main-text-muted)", opacity: 0.7 }}>
              Danışanlarınızın yorumlarını ekleyin — landing page&apos;deki yorumlar bölümünde görünür
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {local.map((t) => (
            <Card key={t.id} style={{ backgroundColor: "var(--dashboard-card-bg)", borderColor: "var(--dashboard-card-border)" }}>
              <CardContent className="p-4 space-y-3">
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-3 min-w-0">
                    <div
                      className="h-10 w-10 shrink-0 overflow-hidden rounded-full flex items-center justify-center text-sm font-bold"
                      style={{ backgroundColor: "var(--dashboard-accent)", color: "var(--dashboard-accent-text)" }}
                    >
                      {t.avatar ? (
                        <img src={t.avatar} alt={t.clientName} className="h-full w-full object-cover" />
                      ) : (
                        t.clientName.charAt(0).toUpperCase()
                      )}
                    </div>
                    <div className="min-w-0">
                      <p className="font-semibold text-sm truncate">{t.clientName}</p>
                      {t.role && (
                        <p className="text-xs truncate" style={{ color: "var(--dashboard-main-text-muted)" }}>
                          {t.role}
                        </p>
                      )}
                    </div>
                  </div>
                  <div className="flex gap-1 shrink-0">
                    <button onClick={() => startEdit(t)} className="text-xs px-1" style={{ color: "var(--dashboard-main-text-muted)" }}>
                      Düzenle
                    </button>
                    <button onClick={() => handleDelete(t.id)} className="text-xs text-red-400/50 hover:text-red-400 px-1">
                      Sil
                    </button>
                  </div>
                </div>

                {t.rating ? (
                  <div className="text-sm" style={{ color: "#facc15" }}>
                    {"★".repeat(t.rating)}
                    <span style={{ color: "var(--dashboard-card-border)" }}>
                      {"★".repeat(5 - t.rating)}
                    </span>
                  </div>
                ) : null}

                <p className="text-sm leading-relaxed" style={{ color: "var(--dashboard-main-text-muted)" }}>
                  &ldquo;{t.quote}&rdquo;
                </p>

                {!t.isPublished && (
                  <span
                    className="inline-block text-[10px] px-1.5 py-0.5 rounded"
                    style={{ backgroundColor: "var(--dashboard-card-bg)", color: "var(--dashboard-main-text-muted)" }}
                  >
                    Taslak
                  </span>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}
      <ConfirmDialog {...dialogProps} />
    </div>
  );
}
