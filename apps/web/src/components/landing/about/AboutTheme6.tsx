"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Theme6Navbar } from "../themes/LandingTheme6";
import type { LandingThemeContent } from "../types";

interface Props {
  content: LandingThemeContent;
  paragraphs: string[];
}

const BG_IMAGE = "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?q=80&w=2070&auto=format&fit=crop";

export function AboutTheme6({ content, paragraphs }: Props) {
  return (
    <div className="min-h-screen bg-black text-white relative" style={{ fontFamily: "var(--font-body, inherit)" }}>
      {/* Cinematic fixed background */}
      <div className="pointer-events-none fixed inset-0 z-0">
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: `url(${BG_IMAGE})` }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-black/60 to-black" />
        <div className="absolute inset-0 bg-black/40" />
      </div>

      <Theme6Navbar content={content} />

      <main className="relative z-10">
        {/* Cinematic hero */}
        <section className="min-h-[85vh] flex flex-col justify-end px-6 md:px-12 pb-16 md:pb-24 pt-32">
          <div className="mx-auto w-full max-w-7xl">
            <div className="text-[11px] font-bold uppercase tracking-[0.4em] text-white/70 mb-6 flex items-center gap-3">
              <div className="h-px w-12 bg-white/60" />
              <span>Chapter 01 — Hakkımızda</span>
            </div>
            <h1
              className="text-6xl md:text-8xl lg:text-[11rem] font-bold tracking-tight leading-[0.9] uppercase text-white drop-shadow-2xl"
              style={{ fontFamily: "var(--font-heading, inherit)" }}
            >
              {content.brandName}
            </h1>
            <p className="mt-8 max-w-2xl text-lg md:text-xl text-white/80 leading-relaxed font-light">
              Her büyük dönüşüm, anlatılmaya değer bir hikâyeyle başlar.
            </p>
          </div>
          {/* Scroll hint */}
          <div className="mt-12 flex items-center justify-center">
            <div className="flex flex-col items-center gap-2 text-[10px] font-bold uppercase tracking-[0.3em] text-white/50">
              <span>Aşağı Kaydır</span>
              <div className="h-10 w-px bg-gradient-to-b from-white/60 to-transparent" />
            </div>
          </div>
        </section>

        {/* Content over dark scroll */}
        <section className="bg-gradient-to-b from-transparent via-black/95 to-black py-24 md:py-32 px-6 md:px-12">
          <div className="mx-auto w-full max-w-4xl">
            {paragraphs.length > 0 ? (
              <article className="relative">
                {/* Large quote mark decoration */}
                <div
                  className="absolute -top-16 -left-4 text-[12rem] font-bold text-white/5 select-none pointer-events-none leading-none"
                  style={{ fontFamily: "Georgia, serif" }}
                >
                  &ldquo;
                </div>

                <div className="relative rounded-2xl border border-white/10 bg-white/[0.03] backdrop-blur-xl p-8 md:p-14">
                  {paragraphs.map((para, i) => (
                    <p
                      key={i}
                      className={i === 0 ? "text-2xl md:text-3xl font-light leading-[1.6] text-white mb-10" : "text-base md:text-lg leading-[1.95] text-white/70 mb-6 font-light"}
                    >
                      {para}
                    </p>
                  ))}

                  <div className="mt-12 pt-8 border-t border-white/10 flex items-center justify-between">
                    <div>
                      <div className="text-[10px] font-bold uppercase tracking-[0.3em] text-white/50 mb-2">
                        — İmza
                      </div>
                      <div className="text-xl font-bold uppercase tracking-widest text-white">
                        {content.brandName}
                      </div>
                    </div>
                    <div className="text-[10px] font-bold uppercase tracking-[0.3em] text-white/40">
                      Chapter 01 / End
                    </div>
                  </div>
                </div>
              </article>
            ) : (
              <div className="rounded-2xl border border-white/10 bg-white/[0.03] backdrop-blur-xl p-16 text-center">
                <p className="text-lg text-white/60">Henüz hakkımızda bilgisi eklenmemiş.</p>
              </div>
            )}

            {/* CTA */}
            <div className="mt-16 flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                href={`/site/${content.domain}#paketler`}
                className="group inline-flex items-center gap-2 rounded-full bg-white px-8 h-12 text-xs font-bold uppercase tracking-widest text-black transition-all hover:bg-white/90"
              >
                Paketleri Gör
                <ArrowRight size={14} className="transition-transform group-hover:translate-x-1" />
              </Link>
              <Link
                href={`/site/${content.domain}`}
                className="inline-flex items-center justify-center rounded-full border border-white/30 px-8 h-12 text-xs font-bold uppercase tracking-widest text-white/80 hover:bg-white/10 transition-colors"
              >
                Ana Sayfa
              </Link>
            </div>
          </div>
        </section>
      </main>

      <footer className="relative z-10 border-t border-white/10 bg-black py-8">
        <div className="mx-auto max-w-7xl px-6 md:px-12 flex items-center justify-between text-[11px] text-white/50 uppercase tracking-[0.3em] font-bold">
          <span>&copy; {new Date().getFullYear()} {content.brandName}</span>
          <span>Dynamic Flow</span>
        </div>
      </footer>
    </div>
  );
}
