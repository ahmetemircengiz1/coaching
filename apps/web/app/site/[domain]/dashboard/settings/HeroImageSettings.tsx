"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { ImagePlus, Smartphone, Trash2, Upload } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { updateCoachSettings } from "../actions";
import { notifyPreviewRefresh } from "@/src/lib/preview-bus";

interface HeroImageSettingsProps {
  domain: string;
  initialHeroImageOriginalUrl: string;
  initialHeroImageDesktopUrl: string;
  initialHeroImageMobileUrl: string;
  initialHeroImageBlurDataUrl: string;
  initialHeroFocalX: number;
  initialHeroFocalY: number;
  initialHeroMode: "photo" | "logo";
  initialHeroImageDark?: boolean | null;
}

export function HeroImageSettings({
  domain,
  initialHeroImageDesktopUrl,
  initialHeroImageMobileUrl,
  initialHeroImageBlurDataUrl,
  initialHeroFocalX,
  initialHeroFocalY,
  initialHeroMode,
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
  const [heroImageDark, setHeroImageDark] = useState<boolean | null>(rest.initialHeroImageDark ?? null);
  const [hasCustomMobile, setHasCustomMobile] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [uploadingMobile, setUploadingMobile] = useState(false);
  const [saving, setSaving] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const mobileFileInputRef = useRef<HTMLInputElement>(null);
  const previewRef = useRef<HTMLDivElement>(null);
  const debounceRef = useRef<ReturnType<typeof setTimeout>>(null);
  // Store initial values to detect real user changes (prevents strict mode overwrite)
  const initialFocalXRef = useRef(initialHeroFocalX);
  const initialFocalYRef = useRef(initialHeroFocalY);
  const initialHeroModeRef = useRef(initialHeroMode);

  const hasImage = !!desktopUrl;

  // Silent save — saves to DB without toast, then refreshes preview
  const silentSave = useCallback(async (data: {
    originalUrl: string; desktopUrl: string; mobileUrl: string;
    blurDataUrl: string; cutoutUrl: string;
    focalX: number; focalY: number; heroMode: "photo" | "logo";
    heroImageDark?: boolean | null;
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
      ...(data.heroImageDark !== undefined && { heroImageDark: data.heroImageDark }),
    });
    notifyPreviewRefresh();
  }, [domain]);

  // Debounced silent save for focal point changes
  const debouncedSilentSave = useCallback((data: Parameters<typeof silentSave>[0]) => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(async () => {
      await silentSave(data);
      // Update initial refs after successful save
      initialFocalXRef.current = data.focalX;
      initialFocalYRef.current = data.focalY;
      initialHeroModeRef.current = data.heroMode;
    }, 600);
  }, [silentSave]);

  // Auto-preview: when focal point or hero mode changes, debounced save + refresh
  useEffect(() => {
    // Only save if values actually differ from initial — prevents overwrite on mount
    const focalXChanged = focalX !== initialFocalXRef.current;
    const focalYChanged = focalY !== initialFocalYRef.current;
    const modeChanged = heroMode !== initialHeroModeRef.current;
    if (!focalXChanged && !focalYChanged && !modeChanged) return;
    if (!desktopUrl) return;
    debouncedSilentSave({
      originalUrl, desktopUrl, mobileUrl, blurDataUrl, cutoutUrl,
      focalX, focalY, heroMode,
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [focalX, focalY, heroMode]);

  const handleUpload = useCallback(async (file: File) => {
    if (file.size > 15 * 1024 * 1024) {
      toast.error("Dosya boyutu 15MB'dan buyuk olamaz.");
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
      const newDark = data.heroImageDark ?? null;

      setOriginalUrl(newOriginal);
      setDesktopUrl(newDesktop);
      setMobileUrl(newMobile);
      setBlurDataUrl(newBlur);
      setCutoutUrl(newCutout);
      setFocalX(newFocalX);
      setFocalY(newFocalY);
      setHeroMode(newMode);
      setHeroImageDark(newDark);

      // Auto-save after upload and refresh preview
      toast.success("Fotograf yuklendi!");
      await silentSave({
        originalUrl: newOriginal, desktopUrl: newDesktop, mobileUrl: newMobile,
        blurDataUrl: newBlur, cutoutUrl: newCutout,
        focalX: newFocalX, focalY: newFocalY, heroMode: newMode,
        heroImageDark: newDark,
      });
    } catch (err) {
      console.error("Hero upload error:", err);
      toast.error("Yükleme sırasında bir hata oluştu. Lütfen tekrar deneyin.");
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

  // Custom mobile image upload
  const handleMobileUpload = useCallback(async (file: File) => {
    if (file.size > 10 * 1024 * 1024) {
      toast.error("Mobil fotograf 10MB'dan buyuk olamaz.");
      return;
    }
    if (!["image/jpeg", "image/png", "image/webp"].includes(file.type)) {
      toast.error("Sadece JPEG, PNG ve WebP yuklenebilir.");
      return;
    }

    setUploadingMobile(true);
    try {
      const formData = new FormData();
      formData.append("file", file);
      const res = await fetch("/api/upload/hero-mobile", { method: "POST", body: formData });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Mobil yukleme basarisiz");
      }
      const data = await res.json();
      const newMobileUrl = data.heroImageMobileUrl || "";
      setMobileUrl(newMobileUrl);
      setHasCustomMobile(true);

      // Save to DB
      toast.success("Mobil fotograf yuklendi!");
      await silentSave({
        originalUrl, desktopUrl, mobileUrl: newMobileUrl,
        blurDataUrl, cutoutUrl,
        focalX, focalY, heroMode,
      });
    } catch (err) {
      console.error("Mobile upload error:", err);
      toast.error("Mobil yükleme sırasında bir hata oluştu. Lütfen tekrar deneyin.");
    } finally {
      setUploadingMobile(false);
    }
  }, [silentSave, originalUrl, desktopUrl, blurDataUrl, cutoutUrl, focalX, focalY, heroMode]);

  const handleMobileFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) handleMobileUpload(file);
    e.target.value = "";
  };

  const handleRemoveCustomMobile = useCallback(async () => {
    // Custom mobile fotoğrafı kaldır: DB'deki mobileUrl null'a çekilir.
    // Renderer mobil için desktop URL'sine veya cutout'a fallback yapar.
    // Eğer kullanıcı orijinal hero'yu yeniden yüklerse otomatik mobil crop yine üretilir.
    setHasCustomMobile(false);
    setMobileUrl("");
    try {
      await silentSave({
        originalUrl, desktopUrl, mobileUrl: "",
        blurDataUrl, cutoutUrl,
        focalX, focalY, heroMode,
      });
      toast.success("Özel mobil fotoğraf kaldırıldı.");
    } catch (err) {
      console.error("Remove custom mobile error:", err);
      // State'i geri al ki bir sonraki tıklama tekrar denesin
      setHasCustomMobile(true);
      toast.error("Mobil fotoğraf kaldırılamadı. Lütfen tekrar deneyin.");
    }
  }, [silentSave, originalUrl, desktopUrl, blurDataUrl, cutoutUrl, focalX, focalY, heroMode]);

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
    setHeroImageDark(null);
    // Auto-save deletion and refresh preview
    await silentSave({
      originalUrl: "", desktopUrl: "", mobileUrl: "",
      blurDataUrl: "", cutoutUrl: "",
      focalX: 50, focalY: 35, heroMode: "photo",
      heroImageDark: null,
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
      heroImageDark,
    });
    if (result?.success === false) {
      toast.error("Hero fotograf kaydedilemedi.");
    } else {
      toast.success("Hero fotograf kaydedildi.");
      notifyPreviewRefresh();
    }
    setSaving(false);
  };

  return (
    <Card style={{ backgroundColor: "var(--dashboard-card-bg)", borderColor: "var(--dashboard-card-border)", color: "var(--dashboard-main-text)" }}>
      <CardHeader>
        <CardTitle className="text-lg">Hero Fotografi</CardTitle>
        <p className="text-sm" style={{ color: "var(--dashboard-main-text-muted)" }}>
          Landing sayfanizin giris ekraninda tam ekran gorunecek fotografiniz.
          Degisiklikler otomatik olarak onizlemeye yansir.
        </p>
        <div className="mt-2 rounded-lg border px-3 py-2 text-xs" style={{ borderColor: "var(--dashboard-accent)", backgroundColor: "color-mix(in srgb, var(--dashboard-accent) 5%, transparent)", color: "var(--dashboard-main-text-muted)" }}>
          <strong style={{ color: "var(--dashboard-main-text)" }}>Önerilen:</strong> Yatay (landscape) formatta, en az 1920x1080 piksel, yüksek çözünürlüklü JPEG fotoğraf yükleyin. Fotoğraf orijinal kalitede servis edilir. Mobil için otomatik dikey kırpım yapılır — isterseniz ayrı bir mobil fotoğraf da yükleyebilirsiniz.
        </div>
        <div className="mt-2 rounded-lg border px-3 py-2 text-xs" style={{ borderColor: "#f59e0b", backgroundColor: "color-mix(in srgb, #f59e0b 8%, transparent)", color: "var(--dashboard-main-text)" }}>
          <strong style={{ color: "#f59e0b" }}>⚠️ Dikkat — Fotoğraf Kalitesi:</strong> Telefon veya kameradan doğrudan çekilmiş düşük çözünürlüklü fotoğraflar, landing sayfasında tam ekran gösterildiğinde bulanık ve kalitesiz görünür. Ekranda profesyonel bir izlenim bırakmak için fotoğrafınızı bir <strong>yapay zekâ yükseltme aracı</strong> (ör. Upscayl, Let&apos;s Enhance, Topaz Photo AI, Gigapixel AI, Remini) ile <strong>en az 1920x1080 (Full HD)</strong>, tercihen <strong>4K (3840x2160) veya 8K</strong> çözünürlüğe yükselttikten sonra buraya yükleyin. Bu işlem sadece birkaç dakika sürer ve sitenizin izlenimini önemli ölçüde değiştirir.
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Preview / Upload zone */}
        {hasImage ? (
          <div className="space-y-3">
            {/* Image preview with focal point */}
            {/* Image preview with focal point */}
            <div className="flex justify-center w-full rounded-lg border" style={{ borderColor: "var(--dashboard-card-border)" }}>
              <div
                ref={previewRef}
                className="relative cursor-crosshair inline-block"
                onClick={handleFocalClick}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={desktopUrl}
                  alt="Hero preview"
                  className="block rounded-lg"
                  style={{ maxWidth: "100%", maxHeight: "600px", width: "auto" }}
                  draggable={false}
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
                JPEG, PNG veya WebP - Maks 15MB - Yatay format oneriliyor
              </p>
            </div>
          </div>
        )}

        {/* Hidden file inputs */}
        <input
          ref={fileInputRef}
          type="file"
          accept="image/jpeg,image/png,image/webp"
          className="hidden"
          onChange={handleFileChange}
        />
        <input
          ref={mobileFileInputRef}
          type="file"
          accept="image/jpeg,image/png,image/webp"
          className="hidden"
          onChange={handleMobileFileChange}
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

        {/* Optional custom mobile image */}
        {hasImage && (
          <div className="space-y-2 rounded-lg border p-3" style={{ borderColor: "var(--dashboard-card-border)", backgroundColor: "color-mix(in srgb, var(--dashboard-card-bg) 50%, transparent)" }}>
            <div className="flex items-center gap-2">
              <Smartphone className="h-4 w-4" style={{ color: "var(--dashboard-accent)" }} />
              <label className="block text-sm font-medium">Mobil Fotograf (Opsiyonel)</label>
            </div>
            <p className="text-xs" style={{ color: "var(--dashboard-main-text-muted)" }}>
              Varsayilan olarak masaustu fotografiniz mobil icin otomatik olarak dikey (3:4) kirpilir.
              Isterseniz mobil icin ayri bir dikey fotograf yukleyebilirsiniz.
            </p>
            {hasCustomMobile && mobileUrl ? (
              <div className="flex items-center gap-3">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={mobileUrl}
                  alt="Mobil onizleme"
                  className="h-24 w-auto rounded border object-cover"
                  style={{ borderColor: "var(--dashboard-card-border)", aspectRatio: "3/4" }}
                />
                <div className="flex flex-col gap-1.5">
                  <Button
                    onClick={() => mobileFileInputRef.current?.click()}
                    disabled={uploadingMobile}
                    variant="outline"
                    size="sm"
                    style={{ borderColor: "var(--dashboard-card-border)", color: "var(--dashboard-main-text)", backgroundColor: "transparent" }}
                  >
                    <Upload className="mr-1 h-3 w-3" />
                    Degistir
                  </Button>
                  <Button
                    onClick={handleRemoveCustomMobile}
                    variant="outline"
                    size="sm"
                    className="text-red-400 hover:text-red-300 hover:bg-red-400/10"
                    style={{ borderColor: "var(--dashboard-card-border)", backgroundColor: "transparent" }}
                  >
                    <Trash2 className="mr-1 h-3 w-3" />
                    Otomatik kirpima don
                  </Button>
                </div>
              </div>
            ) : (
              <Button
                onClick={() => mobileFileInputRef.current?.click()}
                disabled={uploadingMobile}
                variant="outline"
                size="sm"
                style={{ borderColor: "var(--dashboard-card-border)", color: "var(--dashboard-main-text)", backgroundColor: "transparent" }}
              >
                <Smartphone className="mr-1 h-3.5 w-3.5" />
                {uploadingMobile ? "Yukleniyor..." : "Ozel mobil fotograf yukle"}
              </Button>
            )}
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
