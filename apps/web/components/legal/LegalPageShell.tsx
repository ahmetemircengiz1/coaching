import Link from "next/link";
import type { ReactNode } from "react";

export function LegalPageShell({
  title,
  lastUpdated,
  children,
}: {
  title: string;
  lastUpdated: string;
  children: ReactNode;
}) {
  return (
    <div className="min-h-screen bg-[#111111] text-white selection:bg-[#ccff00] selection:text-black">
      <nav className="border-b border-white/5 bg-[#111111]/80 backdrop-blur-xl">
        <div className="container mx-auto px-6 h-16 flex items-center justify-between">
          <Link
            href="/"
            className="font-heading text-xl font-bold tracking-widest flex items-center gap-2"
          >
            COACH<span className="text-[#ccff00]">OS</span>
          </Link>
          <Link
            href="/"
            className="text-sm text-white/60 hover:text-white transition-colors"
          >
            ← Ana sayfa
          </Link>
        </div>
      </nav>

      <main className="container mx-auto max-w-3xl px-6 py-16">
        <div className="mb-10">
          <h1 className="font-heading text-3xl md:text-4xl font-bold tracking-tight mb-3">
            {title}
          </h1>
          <p className="text-xs text-white/40">
            Son güncelleme: {lastUpdated}
          </p>
        </div>

        <div className="prose prose-invert prose-sm md:prose-base max-w-none text-white/80 leading-relaxed [&_h2]:font-heading [&_h2]:text-xl [&_h2]:font-semibold [&_h2]:mt-10 [&_h2]:mb-3 [&_h2]:text-white [&_h3]:text-base [&_h3]:font-semibold [&_h3]:mt-6 [&_h3]:mb-2 [&_h3]:text-white [&_p]:mb-4 [&_ul]:list-disc [&_ul]:pl-6 [&_ul]:space-y-1.5 [&_ul]:mb-4 [&_strong]:text-white [&_a]:text-[#ccff00] [&_a]:underline hover:[&_a]:opacity-80">
          {children}
        </div>

        <div className="mt-16 rounded-lg border border-yellow-500/30 bg-yellow-500/5 p-4 text-xs text-yellow-200/80">
          <strong className="text-yellow-200">Not:</strong> Bu metin genel bir
          şablondur. Platform sahibi, kendi şirket bilgileri ve özel
          hükümlerle uyumlu hale getirmek için bir hukuk danışmanına
          başvurmalıdır.
        </div>
      </main>
    </div>
  );
}
