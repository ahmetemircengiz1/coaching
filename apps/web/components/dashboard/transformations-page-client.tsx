"use client";

import { useState, useTransition, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ValidatedInput } from "@/components/dashboard/validated-input";
import {
  createTransformation,
  updateTransformation,
  deleteTransformation,
} from "@/app/site/[domain]/dashboard/transformations/actions";
import { ConfirmDialog, useConfirmDialog } from "@/components/dashboard/confirm-dialog";
import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import FileUpload from "@/components/ui/file-upload";

interface CustomStat {
  label: string;
  value: string;
}

interface TransformationData {
  id: string;
  clientName: string;
  description: string | null;
  beforePhoto: string;
  afterPhoto: string;
  duration: string | null;
  age: string | null;
  role: string | null;
  weightBefore: string | null;
  weightAfter: string | null;
  bodyFatBefore: string | null;
  bodyFatAfter: string | null;
  customStats?: CustomStat[] | null;
  isPublished: boolean;
}

export default function TransformationsPageClient({
  domain,
  transformations,
}: {
  domain: string;
  transformations: TransformationData[];
}) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [editingId, setEditingId] = useState<string | null>(null);
  const [showCreate, setShowCreate] = useState(false);
  const { confirm, dialogProps } = useConfirmDialog();
  const [loading, setLoading] = useState(false);

  const [localTransformations, setLocalTransformations] = useState<TransformationData[]>(transformations);
  useEffect(() => {
    setLocalTransformations(transformations);
  }, [transformations]);

  const [clientName, setClientName] = useState("");
  const [description, setDescription] = useState("");
  const [beforePhoto, setBeforePhoto] = useState("");
  const [afterPhoto, setAfterPhoto] = useState("");
  const [duration, setDuration] = useState("");
  const [isPublished, setIsPublished] = useState(true);
  // Opsiyonel ölçüm bilgileri
  const [age, setAge] = useState("");
  const [role, setRole] = useState("");
  const [weightBefore, setWeightBefore] = useState("");
  const [weightAfter, setWeightAfter] = useState("");
  const [bodyFatBefore, setBodyFatBefore] = useState("");
  const [bodyFatAfter, setBodyFatAfter] = useState("");
  // Koçun kendi istediği özel istatistikler (Squat 1RM, 5km koşu süresi, vb.)
  const [customStats, setCustomStats] = useState<CustomStat[]>([]);

  const startEdit = (t: TransformationData) => {
    setEditingId(t.id);
    setClientName(t.clientName);
    setDescription(t.description || "");
    setBeforePhoto(t.beforePhoto);
    setAfterPhoto(t.afterPhoto);
    setDuration(t.duration || "");
    setAge(t.age || "");
    setRole(t.role || "");
    setWeightBefore(t.weightBefore || "");
    setWeightAfter(t.weightAfter || "");
    setBodyFatBefore(t.bodyFatBefore || "");
    setBodyFatAfter(t.bodyFatAfter || "");
    setCustomStats(Array.isArray(t.customStats) ? t.customStats : []);
    setIsPublished(t.isPublished);
    setShowCreate(true);
  };

  const startCreate = () => {
    setEditingId(null);
    setClientName("");
    setDescription("");
    setBeforePhoto("");
    setAfterPhoto("");
    setDuration("");
    setAge("");
    setRole("");
    setWeightBefore("");
    setWeightAfter("");
    setBodyFatBefore("");
    setBodyFatAfter("");
    setCustomStats([]);
    setIsPublished(true);
    setShowCreate(true);
  };

  const handleSave = async () => {
    if (!beforePhoto.trim() || !afterPhoto.trim()) return;
    setLoading(true);

    const cleanedCustomStats = customStats
      .map((s) => ({ label: s.label.trim(), value: s.value.trim() }))
      .filter((s) => s.label && s.value);

    const data = {
      clientName: clientName.trim() || "Danışan",
      description: description.trim() || undefined,
      beforePhoto: beforePhoto.trim(),
      afterPhoto: afterPhoto.trim(),
      duration: duration.trim() || undefined,
      age: age.trim() || undefined,
      role: role.trim() || undefined,
      weightBefore: weightBefore.trim() || undefined,
      weightAfter: weightAfter.trim() || undefined,
      bodyFatBefore: bodyFatBefore.trim() || undefined,
      bodyFatAfter: bodyFatAfter.trim() || undefined,
      customStats: cleanedCustomStats,
      isPublished,
    };

    // Optimistik local state için undefined → null normalizasyonu
    const normalized = {
      ...data,
      description: data.description || null,
      duration: data.duration || null,
      age: data.age || null,
      role: data.role || null,
      weightBefore: data.weightBefore || null,
      weightAfter: data.weightAfter || null,
      bodyFatBefore: data.bodyFatBefore || null,
      bodyFatAfter: data.bodyFatAfter || null,
      customStats: cleanedCustomStats.length > 0 ? cleanedCustomStats : null,
    };

    if (editingId) {
      setLocalTransformations((prev) =>
        prev.map((t) => (t.id === editingId ? { ...t, ...normalized } : t))
      );
    } else {
      const tempId = `temp-${Date.now()}`;
      setLocalTransformations((prev) => [...prev, { id: tempId, ...normalized }]);
    }

    setEditingId(null);
    setShowCreate(false);
    setLoading(false);

    if (editingId) {
      await updateTransformation(domain, editingId, data);
    } else {
      await createTransformation(domain, data);
    }
  };

  const handleDelete = async (id: string) => {
    const t = localTransformations.find(tr => tr.id === id);
    const confirmed = await confirm({
      title: "Donusum Hikayesini Sil",
      description: `"${t?.clientName || "Bu hikaye"}" kalici olarak silinecek. Bu islem geri alinamaz.`,
      confirmText: "Sil",
      variant: "danger",
    });
    if (!confirmed) return;

    setLocalTransformations((prev) => prev.filter((tr) => tr.id !== id));
    await deleteTransformation(domain, id);
  };

  const isEditing = showCreate || editingId;

  return (
    <div className="space-y-6 py-6" style={{ color: "var(--dashboard-main-text)" }}>
      {/* Geri tuşu — Ayarlar → Site İçeriği → Dönüşümler sekmesine döner */}
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
          <h1 className="font-heading text-xl font-bold">Dönüşüm Hikayeleri</h1>
          <p className="text-sm mt-1" style={{ color: "var(--dashboard-main-text-muted)" }}>
            Landing page&apos;inizde görünen dönüşümler
          </p>
        </div>
        {!isEditing && (
          <Button onClick={startCreate}
            style={{ backgroundColor: "var(--dashboard-accent)", color: "var(--dashboard-accent-text)" }}
            className="font-semibold hover:opacity-90">
            + Yeni Dönüşüm
          </Button>
        )}
      </div>

      {isEditing && (
        <Card style={{ backgroundColor: "var(--dashboard-card-bg)", borderColor: "var(--dashboard-card-border)" }}>
          <CardContent className="p-4 space-y-3">
            <h3 className="font-semibold" style={{ color: "var(--dashboard-main-text)" }}>
              {editingId ? "Dönüşümü Düzenle" : "Yeni Dönüşüm Hikayesi"}
            </h3>
            <ValidatedInput value={clientName} onChange={(e) => setClientName(e.target.value)}
              placeholder="Danışan adı"
              error={!clientName.trim() ? "Danisan adi zorunludur" : undefined}
              style={{ backgroundColor: "var(--dashboard-card-bg)", borderColor: "var(--dashboard-card-border)", color: "var(--dashboard-main-text)" }} />
            <textarea value={description} onChange={(e) => setDescription(e.target.value)}
              placeholder="Kısa açıklama" rows={2}
              className="w-full rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2"
              style={{
                backgroundColor: "var(--dashboard-card-bg)",
                border: "1px solid var(--dashboard-card-border)",
                color: "var(--dashboard-main-text)",
              }} />
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs mb-1 block" style={{ color: "var(--dashboard-main-text-muted)" }}>Önce Fotoğrafı</label>
                <FileUpload
                  bucket="transformations"
                  currentUrl={beforePhoto || undefined}
                  onUploaded={(url) => setBeforePhoto(url)}
                  label="Önce Fotoğrafı"
                  aspectRatio="aspect-[3/4]"
                />
              </div>
              <div>
                <label className="text-xs mb-1 block" style={{ color: "var(--dashboard-main-text-muted)" }}>Sonra Fotoğrafı</label>
                <FileUpload
                  bucket="transformations"
                  currentUrl={afterPhoto || undefined}
                  onUploaded={(url) => setAfterPhoto(url)}
                  label="Sonra Fotoğrafı"
                  aspectRatio="aspect-[3/4]"
                />
              </div>
            </div>
            <Input value={duration} onChange={(e) => setDuration(e.target.value)}
              placeholder="Süre (örn: 12 hafta)"
              style={{ backgroundColor: "var(--dashboard-card-bg)", borderColor: "var(--dashboard-card-border)", color: "var(--dashboard-main-text)" }} />

            {/* Ölçüm bilgileri — bazı dönüşüm tasarımları bunları gösterir, opsiyonel */}
            <div className="rounded-md border p-3 space-y-3"
              style={{ borderColor: "var(--dashboard-card-border)", backgroundColor: "color-mix(in srgb, var(--dashboard-card-bg) 60%, transparent)" }}>
              <p className="text-[11px] font-semibold uppercase tracking-wider" style={{ color: "var(--dashboard-main-text-muted)" }}>
                Ölçüm Bilgileri (opsiyonel)
              </p>
              <p className="text-[11px]" style={{ color: "var(--dashboard-main-text-muted)", opacity: 0.7 }}>
                Bazı dönüşüm tasarımları (İstatistik Kartı, Kazı-Çıkar vb.) bu bilgileri gösterir. Boş bırakırsanız o tasarımlarda gizlenir.
              </p>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs mb-1 block" style={{ color: "var(--dashboard-main-text-muted)" }}>Yaş</label>
                  <Input value={age} onChange={(e) => setAge(e.target.value)} placeholder="35"
                    style={{ backgroundColor: "var(--dashboard-card-bg)", borderColor: "var(--dashboard-card-border)", color: "var(--dashboard-main-text)" }} />
                </div>
                <div>
                  <label className="text-xs mb-1 block" style={{ color: "var(--dashboard-main-text-muted)" }}>Meslek / Rol</label>
                  <Input value={role} onChange={(e) => setRole(e.target.value)} placeholder="Memur"
                    style={{ backgroundColor: "var(--dashboard-card-bg)", borderColor: "var(--dashboard-card-border)", color: "var(--dashboard-main-text)" }} />
                </div>
                <div>
                  <label className="text-xs mb-1 block" style={{ color: "var(--dashboard-main-text-muted)" }}>Kilo — Önce</label>
                  <Input value={weightBefore} onChange={(e) => setWeightBefore(e.target.value)} placeholder="95 kg"
                    style={{ backgroundColor: "var(--dashboard-card-bg)", borderColor: "var(--dashboard-card-border)", color: "var(--dashboard-main-text)" }} />
                </div>
                <div>
                  <label className="text-xs mb-1 block" style={{ color: "var(--dashboard-main-text-muted)" }}>Kilo — Sonra</label>
                  <Input value={weightAfter} onChange={(e) => setWeightAfter(e.target.value)} placeholder="74 kg"
                    style={{ backgroundColor: "var(--dashboard-card-bg)", borderColor: "var(--dashboard-card-border)", color: "var(--dashboard-main-text)" }} />
                </div>
                <div>
                  <label className="text-xs mb-1 block" style={{ color: "var(--dashboard-main-text-muted)" }}>Vücut Yağı — Önce</label>
                  <Input value={bodyFatBefore} onChange={(e) => setBodyFatBefore(e.target.value)} placeholder="%40"
                    style={{ backgroundColor: "var(--dashboard-card-bg)", borderColor: "var(--dashboard-card-border)", color: "var(--dashboard-main-text)" }} />
                </div>
                <div>
                  <label className="text-xs mb-1 block" style={{ color: "var(--dashboard-main-text-muted)" }}>Vücut Yağı — Sonra</label>
                  <Input value={bodyFatAfter} onChange={(e) => setBodyFatAfter(e.target.value)} placeholder="%30"
                    style={{ backgroundColor: "var(--dashboard-card-bg)", borderColor: "var(--dashboard-card-border)", color: "var(--dashboard-main-text)" }} />
                </div>
              </div>

              {/* Özel İstatistikler — koçun kendi belirlediği ölçümler */}
              <div className="pt-2 mt-2 border-t" style={{ borderColor: "var(--dashboard-card-border)" }}>
                <div className="flex items-center justify-between mb-2">
                  <div>
                    <p className="text-[11px] font-semibold uppercase tracking-wider" style={{ color: "var(--dashboard-main-text-muted)" }}>
                      Özel İstatistikler (opsiyonel)
                    </p>
                    <p className="text-[10px]" style={{ color: "var(--dashboard-main-text-muted)", opacity: 0.7 }}>
                      Örn: Squat 1RM &rarr; “120kg → 165kg”, 5K süresi &rarr; “28dk → 22dk”
                    </p>
                  </div>
                  {customStats.length < 10 && (
                    <button
                      type="button"
                      onClick={() => setCustomStats((prev) => [...prev, { label: "", value: "" }])}
                      className="text-xs px-2 py-1 rounded border"
                      style={{
                        borderColor: "var(--dashboard-accent)",
                        color: "var(--dashboard-accent)",
                        backgroundColor: "transparent",
                      }}
                    >
                      + Satır ekle
                    </button>
                  )}
                </div>
                <div className="space-y-2">
                  {customStats.map((cs, i) => (
                    <div key={i} className="flex gap-2">
                      <Input
                        value={cs.label}
                        onChange={(e) => {
                          const v = e.target.value;
                          setCustomStats((prev) => prev.map((s, idx) => (idx === i ? { ...s, label: v } : s)));
                        }}
                        placeholder="Etiket (örn: Squat 1RM)"
                        className="flex-1"
                        style={{ backgroundColor: "var(--dashboard-card-bg)", borderColor: "var(--dashboard-card-border)", color: "var(--dashboard-main-text)" }}
                      />
                      <Input
                        value={cs.value}
                        onChange={(e) => {
                          const v = e.target.value;
                          setCustomStats((prev) => prev.map((s, idx) => (idx === i ? { ...s, value: v } : s)));
                        }}
                        placeholder="Değer (örn: 120kg → 165kg)"
                        className="flex-1"
                        style={{ backgroundColor: "var(--dashboard-card-bg)", borderColor: "var(--dashboard-card-border)", color: "var(--dashboard-main-text)" }}
                      />
                      <button
                        type="button"
                        onClick={() => setCustomStats((prev) => prev.filter((_, idx) => idx !== i))}
                        className="px-2 text-xs rounded border text-red-400 hover:bg-red-400/10"
                        style={{ borderColor: "var(--dashboard-card-border)" }}
                        title="Bu satırı sil"
                      >
                        ✕
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <label className="flex items-center gap-2 text-sm">
              <input type="checkbox" checked={isPublished} onChange={(e) => setIsPublished(e.target.checked)} />
              <span style={{ color: "var(--dashboard-main-text-muted)" }}>Yayında (landing page&apos;de görünsün)</span>
            </label>
            <div className="flex gap-2">
              <Button onClick={handleSave} disabled={loading || !beforePhoto.trim() || !afterPhoto.trim()}
                style={{ backgroundColor: "var(--dashboard-accent)", color: "var(--dashboard-accent-text)" }}
                className="font-semibold hover:opacity-90">
                {loading ? "..." : editingId ? "Güncelle" : "Oluştur"}
              </Button>
              <Button onClick={() => { setEditingId(null); setShowCreate(false); }}
                className="border rounded-md px-4 py-2"
                style={{ backgroundColor: "transparent", borderColor: "var(--dashboard-card-border)", color: "var(--dashboard-main-text)" }}>
                İptal
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {localTransformations.length === 0 && !showCreate ? (
        <Card className="animate-fade-in" style={{ backgroundColor: "var(--dashboard-card-bg)", borderColor: "var(--dashboard-card-border)" }}>
          <CardContent className="py-16 text-center">
            <p className="text-4xl mb-3">📸</p>
            <p className="text-lg font-medium mb-1" style={{ color: "var(--dashboard-main-text-muted)" }}>Henüz dönüşüm hikayesi yok</p>
            <p className="text-sm max-w-md mx-auto" style={{ color: "var(--dashboard-main-text-muted)", opacity: 0.7 }}>
              Danışanlarınızın dönüşüm fotoğraflarını ekleyin
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {localTransformations.map((t) => (
            <Card key={t.id} className="overflow-hidden" style={{ backgroundColor: "var(--dashboard-card-bg)", borderColor: "var(--dashboard-card-border)" }}>
              <div className="grid grid-cols-2 aspect-[2/1.2]">
                <div className="relative" style={{ backgroundColor: "var(--dashboard-card-bg)" }}>
                  {t.beforePhoto ? (
                    <img src={t.beforePhoto} alt="Önce" className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-xs" style={{ color: "var(--dashboard-main-text-muted)" }}>Önce</div>
                  )}
                  <span className="absolute bottom-1 left-1 bg-black/60 text-white px-1.5 py-0.5 rounded text-[10px]">Önce</span>
                </div>
                <div className="relative" style={{ backgroundColor: "var(--dashboard-card-bg)" }}>
                  {t.afterPhoto ? (
                    <img src={t.afterPhoto} alt="Sonra" className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-xs" style={{ color: "var(--dashboard-main-text-muted)" }}>Sonra</div>
                  )}
                  <span className="absolute bottom-1 left-1 px-1.5 py-0.5 rounded text-[10px]" style={{ backgroundColor: "var(--dashboard-accent)", color: "var(--dashboard-accent-text)" }}>Sonra</span>
                </div>
              </div>
              <CardContent className="p-3">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="font-semibold text-sm" style={{ color: "var(--dashboard-main-text)" }}>{t.clientName}</p>
                    {t.duration && <p className="text-xs" style={{ color: "var(--dashboard-main-text-muted)" }}>{t.duration}</p>}
                    {!t.isPublished && (
                      <span className="text-[10px] px-1.5 py-0.5 rounded" style={{ backgroundColor: "var(--dashboard-card-bg)", color: "var(--dashboard-main-text-muted)" }}>Taslak</span>
                    )}
                  </div>
                  <div className="flex gap-1">
                    <button onClick={() => startEdit(t)} className="text-xs px-1" style={{ color: "var(--dashboard-main-text-muted)" }}>Düzenle</button>
                    <button onClick={() => handleDelete(t.id)} className="text-xs text-red-400/50 hover:text-red-400 px-1">Sil</button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
      <ConfirmDialog {...dialogProps} />
    </div>
  );
}
