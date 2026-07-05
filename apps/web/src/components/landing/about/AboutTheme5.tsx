"use client";

import Link from "next/link";
import { ArrowRight, Zap } from "lucide-react";
import { Theme5Navbar } from "../themes/LandingTheme5";
import type { LandingThemeContent } from "../types";

interface Props {
  content: LandingThemeContent;
  paragraphs: string[];
}

export function AboutTheme5({ content, paragraphs }: Props) {
  return (
    <div className="min-h-screen bg-[#07090F] text-white relative overflow-hidden" style={{ fontFamily: "var(--font-body, inherit)" }}>
      {/* Grid + glow background */}
      <div className="pointer-events-none fixed inset-0 z-0">
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:64px_64px] [mask-image:radial-gradient(ellipse_80%_80%_at_50%_30%,#000_30%,transparent_100%)]" />
        <div className="absolute -top-[15%] right-[5%] w-[600px] h-[600px] bg-[#2EC8D8]/15 blur-[120px] rounded-full" />
        <div className="absolute top-[30%] -left-[10%] w-[500px] h-[500px] bg-[#9D4EDD]/15 blur-[120px] rounded-full" />
        <div className="absolute bottom-[10%] right-[20%] w-[400px] h-[400px] bg-[#c4df44]/8 blur-[100px] rounded-full" />
      </div>

      <Theme5Navbar content={content} />

      <main className="relative z-10 pt-32 md:pt-40 pb-24">
        {/* Hero */}
        <section className="mx-auto max-w-[1400px] px-6 lg:px-12 mb-20 md:mb-24">
          <div className="flex items-center gap-3 mb-8">
            <div className="h-2 w-2 rounded-full bg-[#2EC8D8] shadow-[0_0_10px_#2EC8D8] animate-pulse" />
            <span className="text-xs font-black uppercase tracking-[0.4em] text-[#2EC8D8]">
              [ SYSTEM.HAKKIMIZDA ]
            </span>
          </div>

          <h1
            className="text-6xl md:text-8xl lg:text-[10rem] font-black tracking-tight leading-[0.9] uppercase mb-8"
            style={{ fontFamily: "var(--font-heading, inherit)" }}
          >
            <span
              className="block text-white"
              style={{ WebkitTextStroke: "1px rgba(46,200,216,0.3)" }}
            >
              {content.brandName}
            </span>
            <span
              className="block text-transparent bg-gradient-to-r from-[#2EC8D8] via-[#c4df44] to-[#2EC8D8] bg-clip-text bg-[length:200%_auto] animate-[shimmer_3s_linear_infinite]"
              style={{ fontSize: "0.4em", letterSpacing: "0.3em" }}
            >
              // PROTOCOL_01
            </span>
          </h1>

          <div className="flex items-center gap-4 text-[11px] font-bold uppercase tracking-[0.3em] text-[#8B9BB4]">
            <Zap size={12} className="text-[#c4df44]" />
            <span>v2.{new Date().getFullYear()}</span>
            <div className="h-px flex-1 bg-gradient-to-r from-[#2EC8D8]/40 to-transparent max-w-[200px]" />
            <span className="text-[#2EC8D8]">ONLINE</span>
          </div>
        </section>

        {/* Content terminal */}
        <section className="mx-auto max-w-5xl px-6 lg:px-12">
          {paragraphs.length > 0 ? (
            <article className="relative">
              {/* Terminal header */}
              <div className="flex items-center justify-between rounded-t-lg bg-[#0F1622] border border-[#2EC8D8]/30 border-b-0 px-4 py-2">
                <div className="flex items-center gap-2">
                  <div className="h-2.5 w-2.5 rounded-full bg-[#FF5F56]/60" />
                  <div className="h-2.5 w-2.5 rounded-full bg-[#FFBD2E]/60" />
                  <div className="h-2.5 w-2.5 rounded-full bg-[#27C93F]/60" />
                </div>
                <span className="text-[10px] font-bold uppercase tracking-[0.25em] text-[#8B9BB4]">
                  about.md
                </span>
                <span className="text-[10px] font-bold uppercase tracking-[0.25em] text-[#2EC8D8]">
                  READ-ONLY
                </span>
              </div>

              <div className="relative rounded-b-lg border border-[#2EC8D8]/30 bg-gradient-to-br from-[#0F1622] to-[#07090F] p-8 md:p-12 shadow-[0_0_80px_rgba(46,200,216,0.08)]">
                {/* Corner accents */}
                <div className="absolute -top-px -left-px w-8 h-8 border-t-2 border-l-2 border-[#2EC8D8]" />
                <div className="absolute -bottom-px -right-px w-8 h-8 border-b-2 border-r-2 border-[#c4df44]" />

                {paragraphs.map((para, i) => (
                  <p
                    key={i}
                    className={i === 0 ? "text-xl md:text-2xl font-bold leading-[1.6] text-white mb-8" : "text-base md:text-lg leading-[1.85] text-[#B8C5D6] mb-6"}
                  >
                    <span className="text-[#2EC8D8] mr-2 select-none font-mono">&gt;</span>
                    {para}
                  </p>
                ))}

                <div className="mt-10 pt-6 border-t border-[#2EC8D8]/20 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="h-2 w-2 rounded-full bg-[#27C93F] animate-pulse" />
                    <span className="text-[11px] font-black uppercase tracking-[0.3em] text-[#8B9BB4]">
                      SIGNED — {content.brandName}
                    </span>
                  </div>
                  <span className="text-[11px] font-black uppercase tracking-[0.3em] text-[#c4df44]">
                    EOF_
                  </span>
                </div>
              </div>
            </article>
          ) : (
            <div className="rounded-lg border border-[#2EC8D8]/20 bg-[#0F1622]/50 p-16 text-center backdrop-blur-xl">
              <p className="text-lg text-[#8B9BB4] font-mono">// no_data_available</p>
            </div>
          )}

          {/* CTA */}
          <div className="mt-16 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href={`/site/${content.domain}#paketler`}
              className="group relative inline-flex items-center gap-2 overflow-hidden rounded bg-[#2EC8D8]/10 border border-[#2EC8D8]/50 px-8 h-12 text-xs font-black uppercase tracking-widest text-[#2EC8D8] transition-all hover:bg-[#2EC8D8] hover:text-[#07090F] hover:shadow-[0_0_30px_rgba(46,200,216,0.5)]"
            >
              <span className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:animate-[shimmer_1.5s_infinite]" />
              &gt; Paketleri Çalıştır
              <ArrowRight size={14} />
            </Link>
            <Link
              href={`/site/${content.domain}`}
              className="inline-flex items-center justify-center rounded border border-[#8B9BB4]/30 px-8 h-12 text-xs font-bold uppercase tracking-widest text-[#8B9BB4] hover:text-white hover:border-white/50 transition-colors"
            >
              &gt; Ana Sayfa
            </Link>
          </div>
        </section>
      </main>

      <footer className="relative z-10 border-t border-[#2EC8D8]/15 py-8">
        <div className="mx-auto max-w-[1400px] px-6 lg:px-12 flex items-center justify-between text-[11px] text-[#8B9BB4] uppercase tracking-[0.3em] font-black">
          <span>&copy; {new Date().getFullYear()} // {content.brandName}</span>
          <span className="text-[#c4df44]">ELECTRIC_NIGHT</span>
        </div>
      </footer>
    </div>
  );
}
