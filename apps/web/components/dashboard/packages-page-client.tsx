"use client";

import { useState, useTransition, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  createCoachPackage,
  updateCoachPackage,
  deleteCoachPackage,
} from "@/app/site/[domain]/dashboard/packages/actions";
import { useRouter } from "next/navigation";

interface PackageData {
  id: string;
  name: string;
  description: string;
  duration: number;
  price: number;
  currency: string;
  features: unknown;
  isActive: boolean;
  _count: { students: number };
}

const inputStyle = {
  backgroundColor: "var(--dashboard-card-bg)",
  borderColor: "var(--dashboard-card-border)",
  color: "var(--dashboard-main-text)",
};

export default function PackagesPageClient({
  domain,
  packages,
}: {
  domain: string;
  packages: PackageData[];
}) {
  const router = useRouter();

  // Optimistic local state
  const [localPackages, setLocalPackages] = useState<PackageData[]>(packages);

  // Sync when props change (e.g. from background revalidation)
  useEffect(() => {
    setLocalPackages(packages);
  }, [packages]);

  const [editingId, setEditingId] = useState<string | null>(null);
  const [showCreate, setShowCreate] = useState(false);
  const [loading, setLoading] = useState(false);

  // Form state
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [duration, setDuration] = useState(4);
  const [price, setPrice] = useState(0);
  const [currency, setCurrency] = useState("TRY");
  const [features, setFeatures] = useState("");
  const [isActive, setIsActive] = useState(true);

  const startEdit = (pkg: PackageData) => {
    setEditingId(pkg.id);
    setName(pkg.name);
    setDescription(pkg.description);
    setDuration(pkg.duration);
    setPrice(pkg.price);
    setCurrency(pkg.currency);
    setFeatures(Array.isArray(pkg.features) ? (pkg.features as string[]).join("\n") : "");
    setIsActive(pkg.isActive);
    setShowCreate(false);
  };

  const startCreate = () => {
    setEditingId(null);
    setName("");
    setDescription("");
    setDuration(4);
    setPrice(0);
    setCurrency("TRY");
    setFeatures("");
    setIsActive(true);
    setShowCreate(true);
  };

  const handleSave = async () => {
    if (!name.trim()) return;
    setLoading(true);

    const featureList = features.split("\n").map((f) => f.trim()).filter(Boolean);
    const data = {
      name: name.trim(),
      description: description.trim(),
      duration,
      price,
      currency,
      features: featureList,
      isActive,
    };

    // Prepare optimistic item
    const optimisticPkg: PackageData = {
      id: editingId || `temp-${Date.now()}`,
      ...data,
      _count: { students: editingId ? localPackages.find(p => p.id === editingId)?._count.students || 0 : 0 }
    };

    // Optimistically update UI
    if (editingId) {
      setLocalPackages(prev => prev.map(p => p.id === editingId ? optimisticPkg : p));
    } else {
      setLocalPackages(prev => [...prev, optimisticPkg]);
    }

    setEditingId(null);
    setShowCreate(false);
    setLoading(false);

    // Background server action
    try {
      if (editingId) {
        await updateCoachPackage(domain, editingId, data);
      } else {
        await createCoachPackage(domain, data);
      }
    } catch (e) {
      console.error(e);
      // Revert on strict error if needed, but actions usually don't throw, they return objects
      setLocalPackages(packages); // Revert to known good prop state
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Bu paketi silmek istediğine emin misin?")) return;

    // Optimistic delete
    setLocalPackages(prev => prev.filter(p => p.id !== id));

    // Background execution
    const result = await deleteCoachPackage(domain, id);
    if (!result.success) {
      alert("error" in result ? result.error : "Hata");
      setLocalPackages(packages); // rever to known good prop state
    }
  };

  const isEditing = showCreate || editingId;

  return (
    <div className="space-y-6 py-6" style={{ color: "var(--dashboard-main-text)" }}>
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-heading text-xl font-bold">Paketlerim</h1>
          <p className="text-sm mt-1" style={{ color: "var(--dashboard-main-text-muted)" }}>
            Landing page&apos;inizde görünen koçluk paketleri
          </p>
        </div>
        {!isEditing && (
          <Button onClick={startCreate}
            style={{ backgroundColor: "var(--dashboard-accent)", color: "var(--dashboard-accent-text)" }}
            className="font-semibold hover:opacity-90">
            + Yeni Paket
          </Button>
        )}
      </div>

      {/* Edit / Create Form */}
      {isEditing && (
        <Card style={{ backgroundColor: "var(--dashboard-card-bg)", borderColor: "var(--dashboard-card-border)" }}>
          <CardContent className="p-4 space-y-3">
            <h3 className="font-semibold">
              {editingId ? "Paketi Düzenle" : "Yeni Paket Oluştur"}
            </h3>
            <Input value={name} onChange={(e) => setName(e.target.value)}
              placeholder="Paket adı (örn: Premium Koçluk)"
              style={inputStyle} disabled={loading} />
            <textarea value={description} onChange={(e) => setDescription(e.target.value)}
              placeholder="Paket açıklaması"
              rows={2}
              disabled={loading}
              className="w-full rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 disabled:opacity-50"
              style={{ ...inputStyle, border: "1px solid var(--dashboard-card-border)" }} />
            <div className="grid grid-cols-3 gap-3">
              <div>
                <label className="text-xs" style={{ color: "var(--dashboard-main-text-muted)" }}>Fiyat</label>
                <Input type="number" value={price} onChange={(e) => setPrice(Number(e.target.value))}
                  style={inputStyle} min={0} disabled={loading} />
              </div>
              <div>
                <label className="text-xs" style={{ color: "var(--dashboard-main-text-muted)" }}>Para Birimi</label>
                <select value={currency} onChange={(e) => setCurrency(e.target.value)}
                  disabled={loading}
                  className="w-full rounded-md px-3 py-2 text-sm disabled:opacity-50"
                  style={{ ...inputStyle, border: "1px solid var(--dashboard-card-border)" }}>
                  <option value="TRY">TRY</option>
                  <option value="USD">USD</option>
                  <option value="EUR">EUR</option>
                </select>
              </div>
              <div>
                <label className="text-xs" style={{ color: "var(--dashboard-main-text-muted)" }}>Süre (hafta)</label>
                <Input type="number" value={duration} onChange={(e) => setDuration(Number(e.target.value))}
                  style={inputStyle} min={1} disabled={loading} />
              </div>
            </div>
            <div>
              <label className="text-xs" style={{ color: "var(--dashboard-main-text-muted)" }}>
                Paket İçerikleri (her satır bir madde)
              </label>
              <textarea value={features} onChange={(e) => setFeatures(e.target.value)}
                placeholder={"Kişiye özel antrenman programı\nHaftalık beslenme planı\n7/24 mesaj desteği"}
                rows={4}
                disabled={loading}
                className="w-full rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 disabled:opacity-50"
                style={{ ...inputStyle, border: "1px solid var(--dashboard-card-border)" }} />
            </div>
            {editingId && (
              <label className="flex items-center gap-2 text-sm">
                <input type="checkbox" checked={isActive} onChange={(e) => setIsActive(e.target.checked)}
                  disabled={loading}
                  className="rounded" />
                <span style={{ color: "var(--dashboard-main-text-muted)" }}>Aktif (landing page&apos;de görünsün)</span>
              </label>
            )}
            <div className="flex gap-2">
              <Button onClick={handleSave} disabled={loading || !name.trim()}
                style={{ backgroundColor: "var(--dashboard-accent)", color: "var(--dashboard-accent-text)" }}
                className="font-semibold hover:opacity-90">
                {loading ? "Kaydediliyor..." : editingId ? "Güncelle" : "Oluştur"}
              </Button>
              <Button onClick={() => { setEditingId(null); setShowCreate(false); }}
                disabled={loading}
                className="border rounded-md px-4 py-2"
                style={{ backgroundColor: "transparent", borderColor: "var(--dashboard-card-border)", color: "var(--dashboard-main-text)" }}>
                İptal
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Package List */}
      {localPackages.length === 0 && !showCreate ? (
        <Card className="animate-fade-in" style={{ backgroundColor: "var(--dashboard-card-bg)", borderColor: "var(--dashboard-card-border)" }}>
          <CardContent className="py-16 text-center">
            <p className="text-4xl mb-3">📦</p>
            <p className="text-lg font-medium mb-1" style={{ color: "var(--dashboard-main-text-muted)" }}>Henüz paket yok</p>
            <p className="text-sm max-w-md mx-auto" style={{ color: "var(--dashboard-main-text-muted)", opacity: 0.7 }}>
              Öğrencileriniz için koçluk paketleri oluşturun
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {localPackages.map((pkg) => (
            <Card key={pkg.id}
              className="transition"
              style={{
                backgroundColor: "var(--dashboard-card-bg)",
                borderColor: "var(--dashboard-card-border)",
                opacity: pkg.isActive ? 1 : 0.6,
              }}>
              <CardContent className="p-4">
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <h3 className="font-semibold" style={{ color: "var(--dashboard-main-text)" }}>{pkg.name}</h3>
                    {!pkg.isActive && (
                      <span className="text-[10px] px-2 py-0.5 rounded" style={{ backgroundColor: "var(--dashboard-card-bg)", color: "var(--dashboard-main-text-muted)" }}>Pasif</span>
                    )}
                  </div>
                  <div className="flex gap-1">
                    <button onClick={() => startEdit(pkg)}
                      className="text-xs px-2 py-1" style={{ color: "var(--dashboard-main-text-muted)" }}>Düzenle</button>
                    <button onClick={() => handleDelete(pkg.id)}
                      className="text-xs text-red-400/50 hover:text-red-400 px-2 py-1">Sil</button>
                  </div>
                </div>
                <p className="text-2xl font-bold mb-1" style={{ color: "var(--dashboard-accent)" }}>
                  {pkg.price.toLocaleString("tr-TR")} {pkg.currency}
                </p>
                <p className="text-xs mb-3" style={{ color: "var(--dashboard-main-text-muted)" }}>{pkg.duration} hafta</p>
                <p className="text-sm mb-3 line-clamp-2" style={{ color: "var(--dashboard-main-text)", opacity: 0.7 }}>{pkg.description}</p>
                {Array.isArray(pkg.features) && (
                  <ul className="space-y-1 mb-3">
                    {(pkg.features as string[]).slice(0, 3).map((f, i) => (
                      <li key={i} className="text-xs flex items-start gap-1" style={{ color: "var(--dashboard-main-text-muted)" }}>
                        <span style={{ color: "var(--dashboard-accent)" }}>✓</span> {f}
                      </li>
                    ))}
                    {(pkg.features as string[]).length > 3 && (
                      <li className="text-xs" style={{ color: "var(--dashboard-main-text-muted)", opacity: 0.6 }}>+{(pkg.features as string[]).length - 3} daha</li>
                    )}
                  </ul>
                )}
                <p className="text-xs" style={{ color: "var(--dashboard-main-text-muted)", opacity: 0.6 }}>{pkg._count.students} öğrenci</p>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
