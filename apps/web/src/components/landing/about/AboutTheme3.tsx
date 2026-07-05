"use client";

import Link from "next/link";
import { ArrowRight, Heart } from "lucide-react";
import { Theme3Navbar } from "../themes/LandingTheme3";
import type { LandingThemeContent } from "../types";

interface Props {
  content: LandingThemeContent;
  paragraphs: string[];
}

export function AboutTheme3({ content, paragraphs }: Props) {
  return (
    <div className="min-h-screen bg-[#f5f6fb] text-slate-800 relative overflow-hidden" style={{ fontFamily: "var(--font-body, inherit)" }}>
      {/* Pastel blobs background */}
      <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden">
        <div className="absolute -right-[15%] -top-[10%] h-[700px] w-[700px] rounded-full bg-teal-100 opacity-60 blur-[100px]" />
        <div className="absolute -left-[10%] top-[30%] h-[500px] w-[500px] rounded-full bg-blue-100 opacity-60 blur-[100px]" />
        <div className="absolute right-[15%] bottom-[-10%] h-[500px] w-[500px] rounded-full bg-amber-100 opacity-50 blur-[100px]" />
      </div>

      <Theme3Navbar content={content} />

      <main className="relative z-10 pt-32 md:pt-40 pb-24">
        {/* Hero */}
        <section className="mx-auto max-w-4xl px-6 text-center mb-16 md:mb-20">
          <div className="inline-flex items-center gap-2 rounded-full bg-teal-100 text-teal-700 px-5 py-2 text-xs font-bold mb-6">
            <Heart size={14} fill="currentColor" />
            Hakkımızda
          </div>
          <h1
            className="text-5xl md:text-7xl font-extrabold tracking-tight text-slate-900 leading-[1.05] mb-6"
            style={{ fontFamily: "var(--font-heading, inherit)" }}
          >
            Merhaba,{" "}
            <span className="text-teal-600 relative inline-block">
              {content.brandName}
              <svg className="absolute -bottom-3 left-0 w-full" height="10" viewBox="0 0 200 10" preserveAspectRatio="none">
                <path d="M0,5 Q50,0 100,5 T200,5" stroke="#ffbe10" strokeWidth="3" fill="none" strokeLinecap="round" />
              </svg>
            </span>
          </h1>
          <p className="text-lg text-slate-500 max-w-2xl mx-auto leading-relaxed">
            Birlikte yola çıkalım. İşte bize dair küçük bir hikâye.
          </p>
        </section>

        {/* Content card */}
        <section className="mx-auto max-w-3xl px-6">
          {paragraphs.length > 0 ? (
            <article className="rounded-[2rem] bg-white border border-slate-100 shadow-[0_20px_60px_rgba(15,23,42,0.06)] p-8 md:p-12">
              {paragraphs.map((para, i) => (
                <p
                  key={i}
                  className={i === 0 ? "text-xl md:text-2xl font-semibold leading-[1.6] text-slate-900 mb-8" : "text-base md:text-lg leading-[1.85] text-slate-600 mb-6"}
                >
                  {para}
                </p>
              ))}
              <div className="mt-10 pt-8 border-t border-slate-100 flex items-center gap-3">
                <div className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-teal-100 text-teal-700">
                  <Heart size={16} fill="currentColor" />
                </div>
                <div>
                  <p className="text-sm font-bold text-slate-900">{content.brandName}</p>
                  <p className="text-xs text-slate-500">Yolculuğumuz birlikte başlıyor</p>
                </div>
              </div>
            </article>
          ) : (
            <div className="rounded-[2rem] bg-white border border-slate-100 shadow-sm p-16 text-center">
              <p className="text-lg text-slate-500">Henüz hakkımızda bilgisi eklenmemiş.</p>
            </div>
          )}

          {/* CTA */}
          <div className="mt-12 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href={`/site/${content.domain}#paketler`}
              className="group inline-flex items-center gap-2 rounded-full bg-teal-600 px-8 h-12 text-sm font-bold text-white shadow-lg shadow-teal-600/20 transition-all hover:-translate-y-0.5 hover:shadow-xl hover:shadow-teal-600/30"
            >
              Paketleri Gör
              <ArrowRight size={16} className="transition-transform group-hover:translate-x-1" />
            </Link>
            <Link
              href={`/site/${content.domain}`}
              className="inline-flex items-center justify-center rounded-full bg-white border border-slate-200 px-8 h-12 text-sm font-semibold text-slate-700 hover:bg-slate-50 transition-colors"
            >
              Ana Sayfa
            </Link>
          </div>
        </section>
      </main>

      <footer className="relative z-10 border-t border-slate-100 bg-white/50 backdrop-blur-sm py-8">
        <div className="mx-auto max-w-6xl px-6 flex items-center justify-between text-sm text-slate-500">
          <span>&copy; {new Date().getFullYear()} {content.brandName}</span>
          <span className="text-teal-600 font-semibold">Fresh Mint</span>
        </div>
      </footer>
    </div>
  );
}
