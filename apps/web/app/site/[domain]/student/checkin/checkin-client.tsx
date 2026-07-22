"use client";

import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import FileUpload from "@/components/ui/file-upload";
import { submitCheckIn } from "../actions";

export function StudentCheckInClient() {
  const params = useParams();
  const domain = params.domain as string;
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [weekNumber, setWeekNumber] = useState(0);

  const [formData, setFormData] = useState({
    weight: "",
    bodyFat: "",
    chest: "",
    waist: "",
    hips: "",
    arms: "",
    thighs: "",
    notes: "",
  });

  // stored: DB'ye yazılacak kalıcı referans · preview: anlık gösterim (imzalı)
  const [photos, setPhotos] = useState<{ stored: string; preview: string }[]>([]);

  const updateField = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const result = await submitCheckIn(domain, {
      weight: formData.weight ? parseFloat(formData.weight) : undefined,
      bodyFat: formData.bodyFat ? parseFloat(formData.bodyFat) : undefined,
      chest: formData.chest ? parseFloat(formData.chest) : undefined,
      waist: formData.waist ? parseFloat(formData.waist) : undefined,
      hips: formData.hips ? parseFloat(formData.hips) : undefined,
      arms: formData.arms ? parseFloat(formData.arms) : undefined,
      thighs: formData.thighs ? parseFloat(formData.thighs) : undefined,
      notes: formData.notes || undefined,
      photos: photos.length > 0 ? photos.map((p) => p.stored) : undefined,
    });

    if (result.success) {
      setSuccess(true);
      setWeekNumber(result.weekNumber);
    }

    setLoading(false);
  };

  const cardStyle = {
    backgroundColor: "var(--dashboard-card-bg)",
    borderColor: "var(--dashboard-card-border)",
    color: "var(--dashboard-main-text)",
  };

  const inputStyle = {
    backgroundColor: "color-mix(in srgb, var(--dashboard-card-bg) 80%, var(--dashboard-main-bg))",
    borderColor: "var(--dashboard-card-border)",
    color: "var(--dashboard-main-text)",
  };

  if (success) {
    return (
      <div className="space-y-6 py-6">
        <Card style={cardStyle}>
          <CardContent className="py-12 text-center">
            <p className="text-4xl mb-4">✅</p>
            <p className="text-lg font-semibold mb-2" style={{ color: "var(--dashboard-main-text)" }}>
              Hafta {weekNumber} Check-in Gönderildi!
            </p>
            <p className="text-sm mb-6" style={{ color: "var(--dashboard-main-text-muted)" }}>
              Koçun check-in&apos;ini inceleyecek ve geri bildirim verecek.
            </p>
            <Button
              onClick={() => router.push(`/site/${domain}/student`)}
              className="font-semibold hover:opacity-90"
              style={{ backgroundColor: "var(--dashboard-accent)", color: "var(--dashboard-accent-text)" }}
            >
              Ana Sayfaya Dön
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6 py-6">
      <h1 className="font-heading text-xl font-bold" style={{ color: "var(--dashboard-main-text)" }}>Haftalık Check-in</h1>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Measurements */}
        <Card style={cardStyle}>
          <CardHeader>
            <CardTitle className="text-base">Ölçümler</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs mb-1 block" style={{ color: "var(--dashboard-main-text-muted)" }}>Kilo (kg)</label>
                <Input type="number" step="0.1" value={formData.weight} onChange={(e) => updateField("weight", e.target.value)} style={inputStyle} placeholder="75.5" />
              </div>
              <div>
                <label className="text-xs mb-1 block" style={{ color: "var(--dashboard-main-text-muted)" }}>Yağ Oranı (%)</label>
                <Input type="number" step="0.1" value={formData.bodyFat} onChange={(e) => updateField("bodyFat", e.target.value)} style={inputStyle} placeholder="18.5" />
              </div>
              <div>
                <label className="text-xs mb-1 block" style={{ color: "var(--dashboard-main-text-muted)" }}>Göğüs (cm)</label>
                <Input type="number" step="0.1" value={formData.chest} onChange={(e) => updateField("chest", e.target.value)} style={inputStyle} />
              </div>
              <div>
                <label className="text-xs mb-1 block" style={{ color: "var(--dashboard-main-text-muted)" }}>Bel (cm)</label>
                <Input type="number" step="0.1" value={formData.waist} onChange={(e) => updateField("waist", e.target.value)} style={inputStyle} />
              </div>
              <div>
                <label className="text-xs mb-1 block" style={{ color: "var(--dashboard-main-text-muted)" }}>Kalça (cm)</label>
                <Input type="number" step="0.1" value={formData.hips} onChange={(e) => updateField("hips", e.target.value)} style={inputStyle} />
              </div>
              <div>
                <label className="text-xs mb-1 block" style={{ color: "var(--dashboard-main-text-muted)" }}>Kol (cm)</label>
                <Input type="number" step="0.1" value={formData.arms} onChange={(e) => updateField("arms", e.target.value)} style={inputStyle} />
              </div>
              <div>
                <label className="text-xs mb-1 block" style={{ color: "var(--dashboard-main-text-muted)" }}>Bacak (cm)</label>
                <Input type="number" step="0.1" value={formData.thighs} onChange={(e) => updateField("thighs", e.target.value)} style={inputStyle} />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Photos */}
        <Card style={cardStyle}>
          <CardHeader>
            <CardTitle className="text-base">Fotoğraflar (opsiyonel)</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="grid grid-cols-3 gap-3">
              {photos.map((p, idx) => (
                <div key={idx} className="relative aspect-[3/4] rounded-lg overflow-hidden"
                  style={{ border: "1px solid var(--dashboard-card-border)" }}>
                  <img src={p.preview} alt={`Fotoğraf ${idx + 1}`} className="w-full h-full object-cover" />
                  <button
                    type="button"
                    onClick={() => setPhotos(photos.filter((_, i) => i !== idx))}
                    className="absolute top-1 right-1 w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold"
                    style={{ backgroundColor: "rgba(0,0,0,0.6)", color: "#fff" }}
                  >
                    ✕
                  </button>
                </div>
              ))}
            </div>
            <FileUpload
              bucket="checkins"
              onUploaded={(url, display) =>
                setPhotos((prev) => [...prev, { stored: url, preview: display ?? url }])
              }
              label={photos.length > 0 ? "Daha Fazla Ekle" : "Fotoğraf Yükle"}
              aspectRatio="h-28 w-full"
              isMulti={true}
            />
            <p className="text-xs text-center" style={{ color: "var(--dashboard-main-text-muted)" }}>
              İstediğiniz kadar fotoğraf yükleyebilirsiniz.
            </p>
          </CardContent>
        </Card>

        {/* Notes */}
        <Card style={cardStyle}>
          <CardHeader>
            <CardTitle className="text-base">Notlar</CardTitle>
          </CardHeader>
          <CardContent>
            <textarea
              value={formData.notes}
              onChange={(e) => updateField("notes", e.target.value)}
              className="w-full rounded-md px-3 py-2 text-sm min-h-[100px]"
              style={{
                backgroundColor: "color-mix(in srgb, var(--dashboard-card-bg) 80%, var(--dashboard-main-bg))",
                borderColor: "var(--dashboard-card-border)",
                border: "1px solid var(--dashboard-card-border)",
                color: "var(--dashboard-main-text)",
              }}
              placeholder="Bu hafta hakkında notların..."
            />
          </CardContent>
        </Card>

        <Button
          type="submit"
          disabled={loading}
          className="w-full font-semibold hover:opacity-90"
          size="lg"
          style={{ backgroundColor: "var(--dashboard-accent)", color: "var(--dashboard-accent-text)" }}
        >
          {loading ? "Gönderiliyor..." : "Check-in Gönder"}
        </Button>
      </form>
    </div>
  );
}
