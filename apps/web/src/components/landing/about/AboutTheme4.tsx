"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Theme4Navbar } from "../themes/LandingTheme4";
import type { LandingThemeContent } from "../types";

interface Props {
  content: LandingThemeContent;
  paragraphs: string[];
}

export function AboutTheme4({ content, paragraphs }: Props) {
  return (
    <div className="min-h-screen bg-[#FBF9F6] text-[#2C2A29] relative overflow-hidden" style={{ fontFamily: "var(--font-body, inherit)" }}>
      {/* Editorial grid background */}
      <div className="pointer-events-none fixed inset-0 z-0 flex justify-center overflow-hidden">
        <div className="w-full max-w-[1400px] h-full border-x border-[#EAE4D9]/40 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:100px_100px]" />
        <div className="absolute top-0 w-full h-[500px] bg-gradient-to-b from-[#FBF9F6] to-transparent" />
      </div>

      <Theme4Navbar content={content} />

      <main className="relative z-10 pt-36 md:pt-44 pb-24">
        {/* Editorial Hero */}
        <section className="mx-auto max-w-5xl px-6 mb-16 md:mb-24">
          <div className="grid md:grid-cols-12 gap-10 items-start">
            <div className="md:col-span-3 md:pt-4">
              <div className="text-[10px] font-bold tracking-[0.35em] uppercase text-[#C75B39] mb-3">
                — Hikâyemiz
              </div>
              <div className="text-xs text-[#7C726A] font-medium">
                Issue N°01 · {new Date().getFullYear()}
              </div>
            </div>
            <div className="md:col-span-9">
              <h1
                className="text-5xl md:text-7xl lg:text-8xl font-normal tracking-tight leading-[1] text-[#2C2A29]"
                style={{ fontFamily: "'Playfair Display', Georgia, 'Times New Roman', serif", fontStyle: "italic" }}
              >
                {content.brandName}
              </h1>
              <div className="mt-8 flex items-center gap-4">
                <div className="h-px w-20 bg-[#C75B39]" />
                <span
                  className="text-sm text-[#7C726A] italic"
                  style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
                >
                  Sizinle birlikte yazılan bir hikâye
                </span>
              </div>
            </div>
          </div>
        </section>

        {/* Content — magazine layout */}
        <section className="mx-auto max-w-5xl px-6">
          {paragraphs.length > 0 ? (
            <article className="grid md:grid-cols-12 gap-10">
              <aside className="md:col-span-3">
                <div className="sticky top-32 space-y-6">
                  <div>
                    <div className="text-[10px] font-bold tracking-[0.3em] uppercase text-[#7C726A] mb-2">Koç</div>
                    <div
                      className="text-2xl font-normal text-[#2C2A29]"
                      style={{ fontFamily: "'Playfair Display', Georgia, serif", fontStyle: "italic" }}
                    >
                      {content.brandName}
                    </div>
                  </div>
                  <div className="h-px w-12 bg-[#C75B39]" />
                  <div>
                    <div className="text-[10px] font-bold tracking-[0.3em] uppercase text-[#7C726A] mb-2">Alan</div>
                    <div className="text-sm text-[#4A3C31] leading-relaxed">
                      Kişisel antrenman · Yaşam koçluğu
                    </div>
                  </div>
                </div>
              </aside>

              <div className="md:col-span-9">
                <div className="bg-white border border-[#EAE4D9] rounded-sm p-8 md:p-12 shadow-[0_30px_80px_rgba(44,42,41,0.05)]">
                  {paragraphs.map((para, i) => (
                    <p
                      key={i}
                      className={i === 0 ? "text-2xl md:text-3xl font-normal leading-[1.5] text-[#2C2A29] mb-8 first-letter:text-7xl first-letter:font-bold first-letter:text-[#C75B39] first-letter:mr-3 first-letter:float-left first-letter:leading-[0.9]" : "text-base md:text-lg leading-[1.9] text-[#4A3C31] mb-6"}
                      style={i === 0 ? { fontFamily: "'Playfair Display', Georgia, serif" } : undefined}
                    >
                      {para}
                    </p>
                  ))}
                  <div className="mt-12 pt-6 border-t border-[#EAE4D9] flex items-center justify-between">
                    <span
                      className="text-sm italic text-[#7C726A]"
                      style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
                    >
                      — {content.brandName}
                    </span>
                    <div className="h-2 w-2 rotate-45 bg-[#C75B39]" />
                  </div>
                </div>
              </div>
            </article>
          ) : (
            <div className="rounded-sm border border-[#EAE4D9] bg-white p-16 text-center">
              <p className="text-lg text-[#7C726A] italic" style={{ fontFamily: "'Playfair Display', Georgia, serif" }}>
                Henüz hakkımızda bilgisi eklenmemiş.
              </p>
            </div>
          )}

          {/* CTA */}
          <div className="mt-16 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href={`/site/${content.domain}#paketler`}
              className="group inline-flex items-center gap-2 rounded-full bg-[#C75B39] px-8 h-12 text-sm font-semibold text-white shadow-md transition-all hover:bg-[#8A3A22]"
            >
              Paketleri İncele
              <ArrowRight size={16} className="transition-transform group-hover:translate-x-1" />
            </Link>
            <Link
              href={`/site/${content.domain}`}
              className="inline-flex items-center justify-center rounded-full bg-white border border-[#EAE4D9] px-8 h-12 text-sm font-medium text-[#4A3C31] hover:bg-[#FBF9F6] transition-colors"
            >
              Ana Sayfa
            </Link>
          </div>
        </section>
      </main>

      <footer className="relative z-10 border-t border-[#EAE4D9] py-8 mt-16">
        <div className="mx-auto max-w-5xl px-6 flex items-center justify-between text-xs text-[#7C726A]">
          <span>&copy; {new Date().getFullYear()} {content.brandName}</span>
          <span className="italic text-[#C75B39]" style={{ fontFamily: "'Playfair Display', Georgia, serif" }}>
            Warm Earth
          </span>
        </div>
      </footer>
    </div>
  );
}
