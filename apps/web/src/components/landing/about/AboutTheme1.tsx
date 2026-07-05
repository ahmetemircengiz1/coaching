"use client";

import Link from "next/link";
import { ArrowRight, Sparkles } from "lucide-react";
import { Theme1Navbar } from "../themes/LandingTheme1";
import type { LandingThemeContent } from "../types";

interface Props {
  content: LandingThemeContent;
  paragraphs: string[];
}

export function AboutTheme1({ content, paragraphs }: Props) {
  return (
    <div className="min-h-screen bg-[#0B0B0C] text-[#F5F3EE] relative overflow-hidden" style={{ fontFamily: "var(--font-body, inherit)" }}>
      {/* Background */}
      <div className="pointer-events-none fixed inset-0 z-0">
        <div className="absolute top-[-10%] left-1/2 -translate-x-1/2 w-[700px] h-[500px] bg-[#D4AF37]/10 blur-[160px] rounded-full" />
        <div className="absolute bottom-[-10%] right-[5%] w-[400px] h-[400px] bg-[#D4AF37]/8 blur-[140px] rounded-full" />
        <div className="absolute inset-0 bg-[url('/noise.png')] opacity-20 mix-blend-overlay" />
      </div>

      <Theme1Navbar content={content} />

      <main className="relative z-10 pt-32 md:pt-40 pb-24">
        {/* Hero */}
        <section className="mx-auto max-w-5xl px-6 text-center mb-20 md:mb-28">
          <div className="inline-flex items-center gap-2 rounded-full border border-[#D4AF37]/30 bg-[#D4AF37]/5 px-5 py-2 text-[10px] font-bold tracking-[0.3em] uppercase text-[#D4AF37] mb-8">
            <Sparkles size={12} />
            Hakkımızda
          </div>
          <h1
            className="text-5xl md:text-7xl lg:text-8xl font-black tracking-tight leading-[1] mb-6"
            style={{ fontFamily: "var(--font-heading, 'Playfair Display', Georgia, serif)" }}
          >
            <span className="bg-gradient-to-br from-[#F3E5AB] via-[#D4AF37] to-[#A8822E] bg-clip-text text-transparent">
              {content.brandName}
            </span>
          </h1>
          <p className="text-lg md:text-xl text-white/60 italic font-light max-w-2xl mx-auto">
            Mükemmellik için tasarlanmış yolculuğunuzun hikâyesi.
          </p>
          <div className="mt-10 flex items-center justify-center gap-4">
            <div className="h-px w-16 bg-gradient-to-r from-transparent to-[#D4AF37]/60" />
            <div className="h-2 w-2 rotate-45 bg-[#D4AF37]" />
            <div className="h-px w-16 bg-gradient-to-l from-transparent to-[#D4AF37]/60" />
          </div>
        </section>

        {/* Content */}
        <section className="mx-auto max-w-4xl px-6">
          {paragraphs.length > 0 ? (
            <article className="relative">
              <div className="absolute -inset-x-4 -inset-y-8 bg-gradient-to-b from-[#D4AF37]/5 via-transparent to-[#D4AF37]/5 blur-3xl" />
              <div className="relative rounded-[2rem] border border-[#D4AF37]/20 bg-gradient-to-b from-white/[0.04] to-white/[0.01] backdrop-blur-xl p-8 md:p-14 shadow-[0_0_80px_rgba(212,175,55,0.08)]">
                {paragraphs.map((para, i) => (
                  <p
                    key={i}
                    className={i === 0 ? "text-xl md:text-2xl font-light leading-[1.8] text-[#F5F3EE] mb-8 first-letter:text-5xl first-letter:font-black first-letter:text-[#D4AF37] first-letter:mr-2 first-letter:float-left first-letter:leading-none first-letter:mt-1" : "text-base md:text-lg leading-[1.9] text-white/70 mb-6"}
                    style={i === 0 ? { fontFamily: "var(--font-heading, 'Playfair Display', Georgia, serif)" } : undefined}
                  >
                    {para}
                  </p>
                ))}
                <div className="mt-12 flex items-center gap-4">
                  <div className="h-px flex-1 bg-gradient-to-r from-[#D4AF37]/40 to-transparent" />
                  <span className="text-[10px] font-bold uppercase tracking-[0.4em] text-[#D4AF37]">
                    {content.brandName}
                  </span>
                  <div className="h-px flex-1 bg-gradient-to-l from-[#D4AF37]/40 to-transparent" />
                </div>
              </div>
            </article>
          ) : (
            <div className="rounded-[2rem] border border-[#D4AF37]/20 bg-white/[0.02] p-16 text-center">
              <p className="text-lg text-white/70">Henüz hakkımızda bilgisi eklenmemiş.</p>
            </div>
          )}

          {/* CTA */}
          <div className="mt-16 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href={`/site/${content.domain}#paketler`}
              className="group inline-flex items-center justify-center gap-2 rounded-full bg-gradient-to-r from-[#D4AF37] to-[#F3E5AB] px-8 h-12 text-xs font-bold uppercase tracking-widest text-black transition-all hover:scale-105 hover:shadow-[0_0_30px_rgba(212,175,55,0.5)]"
            >
              Paketleri İncele
              <ArrowRight size={14} className="transition-transform group-hover:translate-x-1" />
            </Link>
            <Link
              href={`/site/${content.domain}`}
              className="inline-flex items-center justify-center rounded-full border border-white/20 px-8 h-12 text-xs font-semibold uppercase tracking-widest text-white/80 transition-colors hover:border-[#D4AF37]/60 hover:text-[#D4AF37]"
            >
              Ana Sayfa
            </Link>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="relative z-10 border-t border-white/5 py-8">
        <div className="mx-auto max-w-7xl px-6 flex items-center justify-between text-xs text-white/40 uppercase tracking-widest">
          <span>&copy; {new Date().getFullYear()} {content.brandName}</span>
          <span className="text-[#D4AF37]/60">Midnight Gold</span>
        </div>
      </footer>
    </div>
  );
}
