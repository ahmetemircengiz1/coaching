import { ImageIcon } from "lucide-react";

type Frame = "browser" | "phone" | "plain";

interface MediaSlotProps {
  /** Bu alana hangi görselin geleceğini anlatan kısa etiket (placeholder'da görünür). */
  label: string;
  /** Önerilen boyut/oran ipucu, ör. "Önerilen: 1920×1080 (16:9)". */
  hint?: string;
  /** CSS aspect-ratio, ör. "16/9", "4/3", "9/16". */
  ratio?: string;
  /** Görsel hazır olunca verilecek public yol, ör. "/marketing/hero-site.png". */
  src?: string;
  alt?: string;
  /** Çerçeve tipi: tarayıcı mockup'ı, telefon mockup'ı veya çıplak. */
  frame?: Frame;
  /** Tarayıcı çerçevesindeki adres çubuğu metni. */
  url?: string;
  className?: string;
}

const ACCENT = "#3d6fd1";

/**
 * Pazarlama sayfasındaki görsel alanlarını tutar (koyu tema).
 * - `src` verilmezse: ne görselin geleceğini açıklayan şık bir placeholder gösterir.
 * - `src` verilirse: görseli (gerekirse tarayıcı/telefon çerçevesiyle) basar.
 * Görseller hazır olunca tek yapılacak: ilgili MediaSlot'a `src` eklemek.
 */
export function MediaSlot({
  label,
  hint,
  ratio = "16/9",
  src,
  alt,
  frame = "plain",
  url = "seninmarkan.shred.com.tr",
  className,
}: MediaSlotProps) {
  const inner = src ? (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={src}
      alt={alt ?? label}
      loading="lazy"
      className="h-full w-full object-cover object-top"
    />
  ) : (
    <div className="flex h-full w-full flex-col items-center justify-center gap-3 p-6 text-center">
      <div
        className="flex h-12 w-12 items-center justify-center rounded-2xl border"
        style={{ borderColor: `${ACCENT}33`, backgroundColor: `${ACCENT}14` }}
      >
        <ImageIcon className="h-6 w-6" style={{ color: ACCENT }} />
      </div>
      <p className="max-w-xs text-sm font-semibold text-white/70">{label}</p>
      {hint && <p className="text-xs text-white/35">{hint}</p>}
      <span
        className="mt-1 rounded-full border px-3 py-1 text-[10px] font-semibold uppercase tracking-wider"
        style={{ color: ACCENT, borderColor: `${ACCENT}33`, backgroundColor: `${ACCENT}14` }}
      >
        Görsel buraya gelecek
      </span>
    </div>
  );

  if (frame === "browser") {
    return (
      <div
        className={`overflow-hidden rounded-2xl border border-white/10 bg-[#0a0a0a] shadow-[0_30px_60px_-20px_rgba(0,0,0,0.7)] ${className ?? ""}`}
      >
        <div className="flex h-11 items-center gap-2 border-b border-white/5 bg-[#111] px-5">
          <div className="h-2.5 w-2.5 rounded-full bg-white/15" />
          <div className="h-2.5 w-2.5 rounded-full bg-white/15" />
          <div className="h-2.5 w-2.5 rounded-full bg-white/15" />
          <span className="mx-auto select-none font-mono text-[11px] text-white/35">
            {url}
          </span>
        </div>
        <div className="relative w-full bg-[#0c0c0c]" style={{ aspectRatio: ratio }}>
          {inner}
        </div>
      </div>
    );
  }

  if (frame === "phone") {
    return (
      <div
        className={`mx-auto overflow-hidden rounded-[2.2rem] border-[6px] border-[#1a1a1a] bg-black shadow-[0_30px_60px_-20px_rgba(0,0,0,0.8)] ${className ?? ""}`}
        style={{ maxWidth: 280 }}
      >
        <div className="relative w-full bg-[#0c0c0c]" style={{ aspectRatio: "9/19" }}>
          {inner}
        </div>
      </div>
    );
  }

  return (
    <div
      className={`relative overflow-hidden rounded-2xl border bg-[#0c0c0c] ${
        src ? "border-white/10" : "border-dashed border-white/15"
      } ${className ?? ""}`}
      style={{ aspectRatio: ratio }}
    >
      {inner}
    </div>
  );
}
