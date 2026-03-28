"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { ImagePlus, Trash2, Upload } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { updateCoachSettings } from "../actions";

interface HeroImageSettingsProps {
  domain: string;
  initialHeroImageOriginalUrl: string;
  initialHeroImageDesktopUrl: string;
  initialHeroImageMobileUrl: string;
  initialHeroImageBlurDataUrl: string;
  initialHeroFocalX: number;
  initialHeroFocalY: number;
  initialHeroMode: "photo" | "logo";
  onSaved?: () => void;
}

export function HeroImageSettings({
  domain,
  initialHeroImageDesktopUrl,
  initialHeroImageMobileUrl,
  initialHeroImageBlurDataUrl,
  initialHeroFocalX,
  initialHeroFocalY,
  initialHeroMode,
  onSaved,
  ...rest
}: HeroImageSettingsProps) {
  const [originalUrl, setOriginalUrl] = useState(rest.initialHeroImageOriginalUrl || "");
  const [desktopUrl, setDesktopUrl] = useState(initialHeroImageDesktopUrl || "");
  const [mobileUrl, setMobileUrl] = useState(initialHeroImageMobileUrl || "");
  const [blurDataUrl, setBlurDataUrl] = useState(initialHeroImageBlurDataUrl || "");
  const [cutoutUrl, setCutoutUrl] = useState("");
  const [focalX, setFocalX] = useState(initialHeroFocalX);
  const [focalY, setFocalY] = useState(initialHeroFocalY);
  const [heroMode, setHeroMode] = useState<"photo" | "logo">(initialHeroMode);
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const previewRef = useRef<HTMLDivElement>(null);
  const debounceRef = useRef<ReturnType<typeof setTimeout>>(null);
  const mountedRef = useRef(false);

  const hasImage = !!desktopUrl;

  // Silent save — saves to DB without toast, then refreshes preview
  const silentSave = useCallback(async (data: {
    originalUrl: string; desktopUrl: string; mobileUrl: string;
    blurDataUrl: string; cutoutUrl: string;
    focalX: number; focalY: number; heroMode: "photo" | "logo";
  }) => {
    await updateCoachSettings(domain, {
      heroImageOriginalUrl: data.originalUrl || null,
      heroImageDesktopUrl: data.desktopUrl || null,
      heroImageMobileUrl: data.mobileUrl || null,
      heroImageBlurDataUrl: data.blurDataUrl || null,
      heroImageCutoutUrl: data.cutoutUrl || null,
      heroFocalX: data.focalX,
      heroFocalY: data.focalY,
      heroMode: data.heroMode,
    });
    onSaved?.();
  }, [domain, onSaved]);

  // Debounced silent save for focal point changes
  const debouncedSilentSave = useCallback((data: Parameters<typeof silentSave>[0]) => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => silentSave(data), 600);
  }, [silentSave]);

  // Auto-preview: when focal point or hero mode changes, debounced save + refresh
  useEffect(() => {
    if (!mountedRef.current) {
      mountedRef.current = true;
      return;
    }
    if (!desktopUrl) return;
    debouncedSilentSave({
      originalUrl, desktopUrl, mobileUrl, blurDataUrl, cutoutUrl,
      focalX, focalY, heroMode,
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [focalX, focalY, heroMode]);

  const handleUpload = useCallback(async (file: File) => {
    if (file.size > 10 * 1024 * 1024) {
      toast.error("Dosya boyutu 10MB'dan buyuk olamaz.");
      return;
    }
    if (!["image/jpeg", "image/png", "image/webp"].includes(file.type)) {
      toast.error("Sadece JPEG, PNG ve WebP yuklenebilir.");
      return;
    }

    setUploading(true);
    try {
      const formData = new FormData();
      formData.append("file", file);
      const res = await fetch("/api/upload/hero", { method: "POST", body: formData });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Yukleme basarisiz");
      }
      const data = await res.json();
      const newOriginal = data.heroImageOriginalUrl || "";
      const newDesktop = data.heroImageDesktopUrl || "";
      const newMobile = data.heroImageMobileUrl || "";
      const newBlur = data.heroImageBlurDataUrl || "";
      const newCutout = data.heroImageCutoutUrl || "";
      const newFocalX = data.heroFocalX ?? 50;
      const newFocalY = data.heroFocalY ?? 35;
      const newMode = data.heroMode || "photo";

      setOriginalUrl(newOriginal);
      setDesktopUrl(newDesktop);
      setMobileUrl(newMobile);
      setBlurDataUrl(newBlur);
      setCutoutUrl(newCutout);
      setFocalX(newFocalX);
      setFocalY(newFocalY);
      setHeroMode(newMode);

      // Auto-save after upload and refresh preview
      toast.success("Fotograf yuklendi!");
      await silentSave({
        originalUrl: newOriginal, desktopUrl: newDesktop, mobileUrl: newMobile,
        blurDataUrl: newBlur, cutoutUrl: newCutout,
        focalX: newFocalX, focalY: newFocalY, heroMode: newMode,
      });
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Yukleme hatasi");
    } finally {
      setUploading(false);
    }
  }, [silentSave]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) handleUpload(file);
    e.target.value = "";
  };

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file) handleUpload(file);
  }, [handleUpload]);

  const handleFocalClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = Math.round(((e.clientX - rect.left) / rect.width) * 100);
    const y = Math.round(((e.clientY - rect.top) / rect.height) * 100);
    setFocalX(Math.max(0, Math.min(100, x)));
    setFocalY(Math.max(0, Math.min(100, y)));
  };

  const handleDelete = async () => {
    setOriginalUrl("");
    setDesktopUrl("");
    setMobileUrl("");
    setBlurDataUrl("");
    setCutoutUrl("");
    setFocalX(50);
    setFocalY(35);
    setHeroMode("photo");
    // Auto-save deletion and refresh preview
    await silentSave({
      originalUrl: "", desktopUrl: "", mobileUrl: "",
      blurDataUrl: "", cutoutUrl: "",
      focalX: 50, focalY: 35, heroMode: "photo",
    });
    toast.success("Hero fotografi silindi.");
  };

  const handleSave = async () => {
    setSaving(true);
    const result = await updateCoachSettings(domain, {
      heroImageOriginalUrl: originalUrl || null,
      heroImageDesktopUrl: desktopUrl || null,
      heroImageMobileUrl: mobileUrl || null,
      heroImageBlurDataUrl: blurDataUrl || null,
      heroImageCutoutUrl: cutoutUrl || null,
      heroFocalX: focalX,
      heroFocalY: focalY,
      heroMode,
    });
    if (result?.success === false) {
      toast.error("Hero fotograf kaydedilemedi.");
    } else {
      toast.success("Hero fotograf kaydedildi.");
      onSaved?.();
    }
    setSaving(false);
  };

  return (
    <Card style={{ backgroundColor: "var(--dashboard-card-bg)", borderColor: "var(--dashboard-card-border)", color: "var(--dashboard-main-text)" }}>
      <CardHeader>
        <CardTitle className="text-lg">Hero Fotografi</CardTitle>
        <p className="text-sm" style={{ color: "var(--dashboard-main-text-muted)" }}>
          Landing sayfanizin hero bolumunde gorunecek kisisel fotografiniz.
          Degisiklikler otomatik olarak onizlemeye yansir.
        </p>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Preview / Upload zone */}
        {hasImage ? (
          <div className="space-y-3">
            {/* Image preview with focal point */}
            <div
              ref={previewRef}
              className="relative w-full cursor-crosshair overflow-hidden rounded-lg border"
              style={{ borderColor: "var(--dashboard-card-border)", backgroundColor: "rgba(0,0,0,0.1)" }}
              onClick={handleFocalClick}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={desktopUrl}
                alt="Hero preview"
                className="w-full h-auto block"
                style={{ maxHeight: "400px", objectFit: "contain" }}
              />
              {/* Focal point indicator */}
              <div
                className="pointer-events-none absolute h-6 w-6 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-white shadow-lg"
                style={{
                  left: `${focalX}%`,
                  top: `${focalY}%`,
                  backgroundColor: "rgba(255,255,255,0.3)",
                  boxShadow: "0 0 0 2px rgba(0,0,0,0.5), 0 0 8px rgba(0,0,0,0.3)",
                }}
              >
                <div className="absolute inset-0 m-auto h-1.5 w-1.5 rounded-full bg-white" />
              </div>
              {/* Hint */}
              <div className="absolute bottom-2 left-2 rounded bg-black/60 px-2 py-1 text-[10px] text-white backdrop-blur-sm">
                Odak noktasini belirlemek icin tiklayin
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-2">
              <Button
                onClick={() => fileInputRef.current?.click()}
                disabled={uploading}
                variant="outline"
                size="sm"
                style={{ borderColor: "var(--dashboard-card-border)", color: "var(--dashboard-main-text)", backgroundColor: "transparent" }}
              >
                <Upload className="mr-1 h-3.5 w-3.5" />
                Degistir
              </Button>
              <Button
                onClick={handleDelete}
                variant="outline"
                size="sm"
                className="text-red-400 hover:text-red-300 hover:bg-red-400/10"
                style={{ borderColor: "var(--dashboard-card-border)", backgroundColor: "transparent" }}
              >
                <Trash2 className="mr-1 h-3.5 w-3.5" />
                Sil
              </Button>
            </div>
          </div>
        ) : (
          <div
            className="flex cursor-pointer flex-col items-center justify-center gap-3 rounded-lg border-2 border-dashed py-12 transition hover:opacity-80"
            style={{ borderColor: "var(--dashboard-card-border)", backgroundColor: "var(--dashboard-main-bg)" }}
            onClick={() => fileInputRef.current?.click()}
            onDrop={handleDrop}
            onDragOver={(e) => e.preventDefault()}
          >
            <ImagePlus className="h-10 w-10" style={{ color: "var(--dashboard-main-text-muted)" }} />
            <div className="text-center">
              <p className="text-sm font-medium">
                {uploading ? "Yukleniyor..." : "Fotograf yukle"}
              </p>
              <p className="text-xs mt-1" style={{ color: "var(--dashboard-main-text-muted)" }}>
                JPEG, PNG veya WebP - Maks 10MB
              </p>
            </div>
          </div>
        )}

        {/* Hidden file input */}
        <input
          ref={fileInputRef}
          type="file"
          accept="image/jpeg,image/png,image/webp"
          className="hidden"
          onChange={handleFileChange}
        />

        {/* Hero mode toggle */}
        {hasImage && (
          <div className="space-y-2">
            <label className="block text-sm font-medium">Gorunum Modu</label>
            <div className="flex gap-4">
              <label className="flex items-center gap-2 cursor-pointer text-sm">
                <input
                  type="radio"
                  name="heroMode"
                  checked={heroMode === "photo"}
                  onChange={() => setHeroMode("photo")}
                  className="accent-[var(--dashboard-accent)]"
                />
                <span>Fotograf (tam ekran arka plan)</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer text-sm">
                <input
                  type="radio"
                  name="heroMode"
                  checked={heroMode === "logo"}
                  onChange={() => setHeroMode("logo")}
                  className="accent-[var(--dashboard-accent)]"
                />
                <span>Logo (ortalanmis)</span>
              </label>
            </div>
          </div>
        )}

        {/* Save */}
        <Button
          onClick={handleSave}
          disabled={saving}
          style={{
            backgroundColor: "var(--dashboard-accent)",
            color: "var(--dashboard-accent-text)",
          }}
          className="font-semibold hover:opacity-90"
        >
          {saving ? "Kaydediliyor..." : "Kaydet"}
        </Button>
      </CardContent>
    </Card>
  );
}
