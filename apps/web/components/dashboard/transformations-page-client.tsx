"use client";

import { useState, useTransition, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  createTransformation,
  updateTransformation,
  deleteTransformation,
} from "@/app/site/[domain]/dashboard/transformations/actions";
import { useRouter } from "next/navigation";
import FileUpload from "@/components/ui/file-upload";

interface TransformationData {
  id: string;
  clientName: string;
  description: string | null;
  beforePhoto: string;
  afterPhoto: string;
  duration: string | null;
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

  const startEdit = (t: TransformationData) => {
    setEditingId(t.id);
    setClientName(t.clientName);
    setDescription(t.description || "");
    setBeforePhoto(t.beforePhoto);
    setAfterPhoto(t.afterPhoto);
    setDuration(t.duration || "");
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
    setIsPublished(true);
    setShowCreate(true);
  };

  const handleSave = async () => {
    if (!beforePhoto.trim() || !afterPhoto.trim()) return;
    setLoading(true);

    const data = {
      clientName: clientName.trim() || "Danışan",
      description: description.trim() || undefined,
      beforePhoto: beforePhoto.trim(),
      afterPhoto: afterPhoto.trim(),
      duration: duration.trim() || undefined,
      isPublished,
    };

    if (editingId) {
      setLocalTransformations((prev) =>
        prev.map((t) => (t.id === editingId ? { ...t, ...data, description: data.description || null, duration: data.duration || null } : t))
      );
    } else {
      const tempId = `temp-${Date.now()}`;
      setLocalTransformations((prev) => [...prev, { id: tempId, ...data, description: data.description || null, duration: data.duration || null }]);
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
    if (!confirm("Bu dönüşüm hikayesini silmek istediğine emin misin?")) return;

    setLocalTransformations((prev) => prev.filter((t) => t.id !== id));
    await deleteTransformation(domain, id);
  };

  const isEditing = showCreate || editingId;

  return (
    <div className="space-y-6 py-6" style={{ color: "var(--dashboard-main-text)" }}>
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
            <Input value={clientName} onChange={(e) => setClientName(e.target.value)}
              placeholder="Danışan adı"
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
    </div>
  );
}
