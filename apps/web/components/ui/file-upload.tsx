"use client";

import { useState, useRef, useCallback } from "react";

interface FileUploadProps {
  bucket: "logos" | "hero-images" | "transformations" | "checkins" | "avatars";
  onUploaded: (url: string) => void;
  currentUrl?: string;
  label?: string;
  aspectRatio?: string;
  className?: string;
  isMulti?: boolean;
}

export default function FileUpload({
  bucket,
  onUploaded,
  currentUrl,
  label = "Fotoğraf Yükle",
  aspectRatio = "aspect-square",
  className = "",
  isMulti = false,
}: FileUploadProps) {
  const [preview, setPreview] = useState<string | null>(currentUrl || null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");
  const [dragOver, setDragOver] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFile = useCallback(
    async (file: File) => {
      setError("");

      // Tip kontrolü
      if (!["image/jpeg", "image/png", "image/webp"].includes(file.type)) {
        setError("Sadece JPEG, PNG ve WebP");
        return;
      }

      // Boyut kontrolü (5MB)
      if (file.size > 5 * 1024 * 1024) {
        setError("Maks. 5MB");
        return;
      }

      // Önizleme
      const reader = new FileReader();
      reader.onload = (e) => setPreview(e.target?.result as string);
      reader.readAsDataURL(file);

      // Yükleme
      setUploading(true);
      try {
        const formData = new FormData();
        formData.append("file", file);
        formData.append("bucket", bucket);

        const res = await fetch("/api/upload", {
          method: "POST",
          body: formData,
        });

        const data = await res.json();

        if (!res.ok) {
          setError(data.error || "Yükleme hatası");
          return;
        }

        onUploaded(data.url);
      } catch {
        setError("Yükleme başarısız");
      } finally {
        setUploading(false);
      }
    },
    [bucket, onUploaded]
  );

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setDragOver(false);
      const file = e.dataTransfer.files[0];
      if (file) handleFile(file);
    },
    [handleFile]
  );

  return (
    <div className={className}>
      <input
        ref={inputRef}
        type="file"
        multiple={isMulti}
        accept="image/jpeg,image/png,image/webp"
        onChange={(e) => {
          const files = e.target.files;
          if (!files || files.length === 0) return;

          if (isMulti) {
            Array.from(files).forEach((file) => handleFile(file));
          } else {
            handleFile(files[0]);
          }
        }}
        className="hidden"
      />

      <div
        onClick={() => inputRef.current?.click()}
        onDragOver={(e) => {
          e.preventDefault();
          setDragOver(true);
        }}
        onDragLeave={() => setDragOver(false)}
        onDrop={handleDrop}
        className={`relative flex items-center justify-center ${aspectRatio} rounded-xl border-2 border-dashed flex-col cursor-pointer overflow-hidden transition-all ${dragOver
            ? "border-[var(--dashboard-accent)] bg-[var(--dashboard-accent)]/10"
            : "border-[var(--dashboard-card-border)] hover:border-[var(--dashboard-accent)] bg-[var(--dashboard-main-bg)] hover:bg-[var(--dashboard-card-bg)]"
          }`}
      >
        {!isMulti && preview ? (
          <>
            <img
              src={preview}
              alt="Önizleme"
              className="w-full h-full object-cover"
            />
            {/* Overlay on hover */}
            <div className="absolute inset-0 bg-black/50 opacity-0 hover:opacity-100 transition-opacity flex items-center justify-center">
              <span className="text-white text-sm font-medium">
                {uploading ? "Yükleniyor..." : "Değiştir"}
              </span>
            </div>
          </>
        ) : (
          <div className="flex flex-col items-center justify-center p-4 text-[var(--dashboard-main-text-muted)] text-center w-full h-full">
            <svg
              width="32"
              height="32"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              className="mb-2 opacity-50"
            >
              <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4M17 8l-5-5-5 5M12 3v12" />
            </svg>
            <span className="text-xs font-semibold">{uploading ? "Yükleniyor..." : label}</span>
            <span className="text-[10px] sm:text-xs mt-1 opacity-70">
              JPEG, PNG, WebP (maks. 5MB)
            </span>
          </div>
        )}

        {/* Upload progress overlay */}
        {uploading && (
          <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
            <div className="w-8 h-8 border-2 border-[#ccff00] border-t-transparent rounded-full animate-spin" />
          </div>
        )}
      </div>

      {error && <p className="text-red-400 text-xs mt-1">{error}</p>}
    </div>
  );
}
