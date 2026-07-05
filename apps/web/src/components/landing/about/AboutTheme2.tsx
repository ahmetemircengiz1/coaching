"use client";

import Link from "next/link";
import { ArrowRight, Waves } from "lucide-react";
import { Theme2Navbar } from "../themes/LandingTheme2";
import type { LandingThemeContent } from "../types";

interface Props {
  content: LandingThemeContent;
  paragraphs: string[];
}

export function AboutTheme2({ content, paragraphs }: Props) {
  return (
    <div className="min-h-screen bg-[#03060C] text-[#e8f0f8] relative overflow-hidden" style={{ fontFamily: "var(--font-body, inherit)" }}>
      {/* Background */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <div className="absolute top-[-20%] right-[-10%] w-[800px] h-[800px] bg-[#00E5FF]/10 blur-[200px] rounded-full mix-blend-screen" />
        <div className="absolute bottom-[-20%] left-[-10%] w-[600px] h-[600px] bg-[#0284C7]/10 blur-[150px] rounded-full mix-blend-screen" />
        <div className="absolute inset-0 bg-[linear-gradient(rgba(0,229,255,0.04)_1px,transparent_1px),linear-gradient(90deg,rgba(0,229,255,0.04)_1px,transparent_1px)] bg-[size:80px_80px] [mask-image:radial-gradient(ellipse_60%_60%_at_50%_30%,#000_60%,transparent_100%)]" />
      </div>

      <Theme2Navbar content={content} />

      <main className="relative z-10 pt-32 md:pt-40 pb-24">
        {/* Hero */}
        <section className="mx-auto max-w-6xl px-6 lg:px-12 mb-20 md:mb-28">
          <div className="grid md:grid-cols-12 gap-10 items-end">
            <div className="md:col-span-8">
              <div className="inline-flex items-center gap-2 rounded-full border border-[#00E5FF]/30 bg-[#00E5FF]/5 px-5 py-2 text-[10px] font-black tracking-[0.3em] uppercase text-[#00E5FF] mb-8 backdrop-blur-xl">
                <Waves size={12} />
                Hikâyemiz
              </div>
              <h1
                className="text-5xl md:text-7xl lg:text-8xl font-black tracking-tight leading-[0.95] uppercase"
                style={{ fontFamily: "var(--font-heading, inherit)" }}
              >
                <span className="bg-gradient-to-r from-white via-[#00E5FF] to-white bg-clip-text text-transparent">
                  {content.brandName}
                </span>
              </h1>
              <div className="mt-8 h-1 w-32 bg-gradient-to-r from-[#00E5FF] to-transparent rounded-full" />
            </div>
            <div className="md:col-span-4">
              <p className="text-sm text-[#64748B] font-bold uppercase tracking-[0.2em] leading-relaxed border-l-2 border-[#00E5FF] pl-4">
                Derin bir dalış. Dönüşümün kişisel ritmi.
              </p>
            </div>
          </div>
        </section>

        {/* Content */}
        <section className="mx-auto max-w-5xl px-6 lg:px-12">
          {paragraphs.length > 0 ? (
            <article className="relative rounded-3xl border border-[#00E5FF]/15 bg-gradient-to-br from-[#00E5FF]/[0.03] via-[#03060C]/60 to-[#0284C7]/[0.03] backdrop-blur-2xl p-8 md:p-14 shadow-[0_0_60px_rgba(0,229,255,0.05)]">
              {/* Corner accents */}
              <div className="absolute top-0 left-0 w-16 h-16 border-t-2 border-l-2 border-[#00E5FF]/40 rounded-tl-3xl" />
              <div className="absolute bottom-0 right-0 w-16 h-16 border-b-2 border-r-2 border-[#00E5FF]/40 rounded-br-3xl" />

              {paragraphs.map((para, i) => (
                <p
                  key={i}
                  className={i === 0 ? "text-xl md:text-2xl font-light leading-[1.75] text-[#e8f0f8] mb-8" : "text-base md:text-lg leading-[1.9] text-[#94A3B8] mb-6"}
                >
                  {para}
                </p>
              ))}

              <div className="mt-12 flex items-center gap-3">
                <div className="h-2 w-2 rounded-full bg-[#00E5FF] shadow-[0_0_10px_#00E5FF]" />
                <span className="text-[11px] font-black uppercase tracking-[0.3em] text-[#00E5FF]">
                  {content.brandName}
                </span>
              </div>
            </article>
          ) : (
            <div className="rounded-3xl border border-[#00E5FF]/20 bg-[#00E5FF]/[0.02] p-16 text-center backdrop-blur-xl">
              <p className="text-lg text-[#94A3B8]">Henüz hakkımızda bilgisi eklenmemiş.</p>
            </div>
          )}

          {/* CTA */}
          <div className="mt-16 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href={`/site/${content.domain}#paketler`}
              className="group inline-flex items-center gap-2 rounded-full bg-[#00E5FF] px-8 h-12 text-xs font-black uppercase tracking-widest text-[#03060C] transition-all hover:shadow-[0_0_30px_rgba(0,229,255,0.6)]"
            >
              Paketleri Keşfet
              <ArrowRight size={14} className="transition-transform group-hover:translate-x-1" />
            </Link>
            <Link
              href={`/site/${content.domain}`}
              className="inline-flex items-center justify-center rounded-full border border-[#00E5FF]/30 px-8 h-12 text-xs font-bold uppercase tracking-widest text-[#00E5FF] hover:bg-[#00E5FF]/10 transition-colors"
            >
              Ana Sayfa
            </Link>
          </div>
        </section>
      </main>

      <footer className="relative z-10 border-t border-[#00E5FF]/10 py-8">
        <div className="mx-auto max-w-[1400px] px-6 lg:px-12 flex items-center justify-between text-[11px] text-[#64748B] uppercase tracking-[0.2em] font-bold">
          <span>&copy; {new Date().getFullYear()} {content.brandName}</span>
          <span className="text-[#00E5FF]/50">Ocean Breeze</span>
        </div>
      </footer>
    </div>
  );
}
