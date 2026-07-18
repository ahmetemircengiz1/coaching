"use client";

import { useCallback, useRef, useState } from "react";
import { Film, Trash2, Upload } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { updateCoachSettings } from "../actions";
import { notifyPreviewRefresh } from "@/src/lib/preview-bus";
import { createClient } from "@/lib/supabase/client";

interface HeroVideoSettingsProps {
  domain: string;
  initialHeroVideoUrl: string;
}

const MAX_MB = 50;
const ACCEPT = "video/mp4,video/webm,video/quicktime";

export function HeroVideoSettings({ domain, initialHeroVideoUrl }: HeroVideoSettingsProps) {
  const [videoUrl, setVideoUrl] = useState(initialHeroVideoUrl || "");
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const persist = useCallback(
    async (next: string | null) => {
      const result = await updateCoachSettings(domain, { heroVideoUrl: next });
      if (result?.success === false) {
        toast.error("Video kaydedilemedi.");
        return false;
      }
      notifyPreviewRefresh();
      return true;
    },
    [domain]
  );

  const handleUpload = useCallback(
    async (file: File) => {
      if (file.size > MAX_MB * 1024 * 1024) {
        toast.error(`Video boyutu ${MAX_MB}MB'dan büyük olamaz.`);
        return;
      }
      if (!["video/mp4", "video/webm", "video/quicktime"].includes(file.type)) {
        toast.error("Sadece MP4, WebM veya MOV video yüklenebilir.");
        return;
      }
      setUploading(true);
      try {
        // 1) Sunucudan imzalı yükleme adresi al (dosya Vercel'e gitmez —
        //    4.5MB istek limitine takılmadan doğrudan Supabase'e yüklenir)
        const res = await fetch("/api/upload/hero-video", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ contentType: file.type, size: file.size }),
        });
        const data = await res.json();
        if (!res.ok || !data.path || !data.token) {
          throw new Error(data.error || "Yükleme başarısız");
        }

        // 2) Videoyu doğrudan Supabase Storage'a yükle
        const supabase = createClient();
        const { error: uploadError } = await supabase.storage
          .from("hero-videos")
          .uploadToSignedUrl(data.path, data.token, file, { contentType: file.type });
        if (uploadError) {
          throw new Error("Video yüklenemedi. Lütfen tekrar deneyin.");
        }

        const next = data.publicUrl || "";
        setVideoUrl(next);
        const ok = await persist(next || null);
        if (ok) toast.success("Video yüklendi!");
      } catch (err) {
        console.error("Hero video upload error:", err);
        toast.error(
          err instanceof Error ? err.message : "Yükleme sırasında bir hata oluştu."
        );
      } finally {
        setUploading(false);
      }
    },
    [persist]
  );

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) handleUpload(file);
    e.target.value = "";
  };

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      const file = e.dataTransfer.files[0];
      if (file) handleUpload(file);
    },
    [handleUpload]
  );

  const handleDelete = async () => {
    setVideoUrl("");
    const ok = await persist(null);
    if (ok) toast.success("Hero videosu silindi.");
  };

  return (
    <Card
      style={{
        backgroundColor: "var(--dashboard-card-bg)",
        borderColor: "var(--dashboard-card-border)",
        color: "var(--dashboard-main-text)",
      }}
    >
      <CardHeader>
        <CardTitle className="text-lg">Hero Videosu (Opsiyonel)</CardTitle>
        <p className="text-sm" style={{ color: "var(--dashboard-main-text-muted)" }}>
          Big Display hero tasarımının sağ alt kartında oynatılır. Ziyaretçi karta
          tıkladığında video, ekranı ortalanmış bir oynatıcıda açılır.
          Yüklemezsen hero fotoğrafı veya öne çıkan kapak gösterilir.
        </p>
        <div
          className="mt-2 rounded-lg border px-3 py-2 text-xs"
          style={{
            borderColor: "var(--dashboard-accent)",
            backgroundColor:
              "color-mix(in srgb, var(--dashboard-accent) 5%, transparent)",
            color: "var(--dashboard-main-text-muted)",
          }}
        >
          <strong style={{ color: "var(--dashboard-main-text)" }}>İpucu:</strong>{" "}
          15–30 saniye, 1080p, ses kapalı oynatılır — kısa, akıcı bir antrenman
          montajı en iyisidir. MP4, WebM veya MOV — Maks {MAX_MB}MB.
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {videoUrl ? (
          <div className="space-y-3">
            <div
              className="flex justify-center w-full rounded-lg border overflow-hidden"
              style={{
                borderColor: "var(--dashboard-card-border)",
                backgroundColor: "#000",
              }}
            >
              <video
                src={videoUrl}
                controls
                playsInline
                className="block w-full"
                style={{ maxHeight: "360px" }}
              />
            </div>
            <div className="flex items-center gap-2">
              <Button
                onClick={() => fileInputRef.current?.click()}
                disabled={uploading}
                variant="outline"
                size="sm"
                style={{
                  borderColor: "var(--dashboard-card-border)",
                  color: "var(--dashboard-main-text)",
                  backgroundColor: "transparent",
                }}
              >
                <Upload className="mr-1 h-3.5 w-3.5" />
                {uploading ? "Yükleniyor..." : "Değiştir"}
              </Button>
              <Button
                onClick={handleDelete}
                variant="outline"
                size="sm"
                className="text-red-400 hover:text-red-300 hover:bg-red-400/10"
                style={{
                  borderColor: "var(--dashboard-card-border)",
                  backgroundColor: "transparent",
                }}
              >
                <Trash2 className="mr-1 h-3.5 w-3.5" />
                Sil
              </Button>
            </div>
          </div>
        ) : (
          <div
            className="flex cursor-pointer flex-col items-center justify-center gap-3 rounded-lg border-2 border-dashed py-12 transition hover:opacity-80"
            style={{
              borderColor: "var(--dashboard-card-border)",
              backgroundColor: "var(--dashboard-main-bg)",
            }}
            onClick={() => fileInputRef.current?.click()}
            onDrop={handleDrop}
            onDragOver={(e) => e.preventDefault()}
          >
            <Film
              className="h-10 w-10"
              style={{ color: "var(--dashboard-main-text-muted)" }}
            />
            <div className="text-center">
              <p className="text-sm font-medium">
                {uploading ? "Yükleniyor..." : "Video yükle"}
              </p>
              <p
                className="text-xs mt-1"
                style={{ color: "var(--dashboard-main-text-muted)" }}
              >
                MP4, WebM veya MOV — Maks {MAX_MB}MB
              </p>
            </div>
          </div>
        )}

        <input
          ref={fileInputRef}
          type="file"
          accept={ACCEPT}
          className="hidden"
          onChange={handleFileChange}
        />
      </CardContent>
    </Card>
  );
}
