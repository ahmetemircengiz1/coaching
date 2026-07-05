"use client";

import React, { useRef, useState } from "react";
import { Camera, Image as ImageIcon, Loader2, X } from "lucide-react";
import { toast } from "sonner";
import {
  addMealEntry,
  type MealType,
} from "@/app/site/[domain]/student/nutrition/meal-log-actions";

interface Props {
  domain: string;
  date: string;       // YYYY-MM-DD
  mealType: MealType;
  onUploaded?: () => void;
  /** Hangi tetikleyici görüneceği — slot içinden, FAB vs. */
  trigger?: "slot" | "button";
}

const MAX_DIMENSION = 1600;
const TARGET_QUALITY = 0.82;

/**
 * Görseli canvas ile yeniden boyutlandırır + JPEG'e çevirir (WebP yerine — Safari uyum).
 * Mobil bandwidth için kritik: 4MP foto → ~200KB.
 */
async function resizeImage(file: File): Promise<Blob> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onerror = () => reject(new Error("Dosya okunamadı"));
    reader.onload = () => {
      const img = new Image();
      img.onerror = () => reject(new Error("Resim yüklenemedi"));
      img.onload = () => {
        let { width, height } = img;
        if (width > MAX_DIMENSION || height > MAX_DIMENSION) {
          if (width > height) {
            height = Math.round(height * (MAX_DIMENSION / width));
            width = MAX_DIMENSION;
          } else {
            width = Math.round(width * (MAX_DIMENSION / height));
            height = MAX_DIMENSION;
          }
        }
        const canvas = document.createElement("canvas");
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext("2d");
        if (!ctx) {
          reject(new Error("Canvas alınamadı"));
          return;
        }
        ctx.drawImage(img, 0, 0, width, height);
        canvas.toBlob(
          (blob) => {
            if (blob) resolve(blob);
            else reject(new Error("Görsel sıkıştırılamadı"));
          },
          "image/jpeg",
          TARGET_QUALITY
        );
      };
      img.src = reader.result as string;
    };
    reader.readAsDataURL(file);
  });
}

export function MealPhotoUploader({ domain, date, mealType, onUploaded, trigger = "slot" }: Props) {
  const cameraInputRef = useRef<HTMLInputElement>(null);
  const galleryInputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState<"idle" | "resize" | "upload" | "save">("idle");

  const handleFile = async (file: File) => {
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      toast.error("Sadece görsel dosyası yükleyebilirsin");
      return;
    }
    if (file.size > 12 * 1024 * 1024) {
      toast.error("Dosya çok büyük (max ~12MB)");
      return;
    }

    setUploading(true);
    try {
      // 1) Resize + JPEG
      setProgress("resize");
      const resized = await resizeImage(file);

      // 2) Upload to Supabase via /api/upload
      setProgress("upload");
      const formData = new FormData();
      formData.append("file", resized, `meal-${date}-${mealType}.jpg`);
      formData.append("bucket", "meal-photos");

      const uploadRes = await fetch("/api/upload", { method: "POST", body: formData });
      const uploadData = await uploadRes.json();
      if (!uploadRes.ok || !uploadData.url) {
        throw new Error(uploadData.error || "Upload başarısız");
      }

      // 3) DB kaydı (plan limit kontrolü server-side)
      setProgress("save");
      const result = await addMealEntry(domain, {
        date,
        mealType,
        photoUrl: uploadData.url,
      });
      if (!result.success) {
        // Plan limiti vb. server-side hata — kullanıcıya net göster
        toast.error(result.error || "Kaydedilemedi");
        return;
      }

      toast.success("Fotoğraf yüklendi");
      onUploaded?.();
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Bilinmeyen hata";
      toast.error(msg);
    } finally {
      setUploading(false);
      setProgress("idle");
      if (cameraInputRef.current) cameraInputRef.current.value = "";
      if (galleryInputRef.current) galleryInputRef.current.value = "";
    }
  };

  const progressLabel = {
    idle: "",
    resize: "Sıkıştırılıyor...",
    upload: "Yükleniyor...",
    save: "Kaydediliyor...",
  }[progress];

  if (trigger === "button") {
    return (
      <>
        <input
          ref={cameraInputRef}
          type="file"
          accept="image/*"
          capture="environment"
          className="hidden"
          onChange={(e) => e.target.files?.[0] && handleFile(e.target.files[0])}
        />
        <input
          ref={galleryInputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={(e) => e.target.files?.[0] && handleFile(e.target.files[0])}
        />
        <div className="flex gap-2">
          <button
            type="button"
            disabled={uploading}
            onClick={() => cameraInputRef.current?.click()}
            className="flex-1 inline-flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg text-xs font-semibold disabled:opacity-50"
            style={{ backgroundColor: "var(--dashboard-accent)", color: "var(--dashboard-accent-text)" }}
          >
            {uploading ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Camera className="w-3.5 h-3.5" />}
            {uploading ? progressLabel : "Kamera"}
          </button>
          <button
            type="button"
            disabled={uploading}
            onClick={() => galleryInputRef.current?.click()}
            className="flex-1 inline-flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg text-xs font-semibold border disabled:opacity-50"
            style={{
              borderColor: "var(--dashboard-card-border)",
              color: "var(--dashboard-main-text)",
            }}
          >
            <ImageIcon className="w-3.5 h-3.5" />
            Galeri
          </button>
        </div>
      </>
    );
  }

  // Default "slot" trigger — büyük tıklama alanı + 2 buton
  return (
    <div className="space-y-2">
      <input
        ref={cameraInputRef}
        type="file"
        accept="image/*"
        capture="environment"
        className="hidden"
        onChange={(e) => e.target.files?.[0] && handleFile(e.target.files[0])}
      />
      <input
        ref={galleryInputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={(e) => e.target.files?.[0] && handleFile(e.target.files[0])}
      />
      <div className="grid grid-cols-2 gap-1.5">
        <button
          type="button"
          disabled={uploading}
          onClick={() => cameraInputRef.current?.click()}
          className="inline-flex items-center justify-center gap-1 px-2 py-1.5 rounded-md text-[11px] font-semibold disabled:opacity-50"
          style={{ backgroundColor: "var(--dashboard-accent)", color: "var(--dashboard-accent-text)" }}
        >
          {uploading ? <Loader2 className="w-3 h-3 animate-spin" /> : <Camera className="w-3 h-3" />}
          Kamera
        </button>
        <button
          type="button"
          disabled={uploading}
          onClick={() => galleryInputRef.current?.click()}
          className="inline-flex items-center justify-center gap-1 px-2 py-1.5 rounded-md text-[11px] font-semibold border disabled:opacity-50"
          style={{ borderColor: "var(--dashboard-card-border)", color: "var(--dashboard-main-text)" }}
        >
          <ImageIcon className="w-3 h-3" />
          Galeri
        </button>
      </div>
      {uploading && (
        <p className="text-[10px] text-center opacity-60">{progressLabel}</p>
      )}
    </div>
  );
}
