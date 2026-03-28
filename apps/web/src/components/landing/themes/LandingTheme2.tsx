"use client";

import Link from "next/link";
import { Menu, MessageCircle, X, ArrowRight, Activity, Users, Star, Waves, ChevronRight, CheckCircle2 } from "lucide-react";
import { useMemo, useState, useEffect, useRef } from "react";
import { formatCount, formatPackagePrice, withFallbackFeatures } from "../helpers";
import { TransformationCarousel } from "../TransformationCarousel";
import type { LandingThemeComponentProps, LandingPackage, LandingThemeContent } from "../types";
import type { SectionRendererProps, ThemeLayout } from "../section-types";
import { FadeInScroll } from "../FadeInScroll";
import { FAQAccordion } from "../FAQSection";
import { SocialIcons } from "../SocialIcons";
import { HeroDesktopImage, HeroMobileImage, hasHeroImage } from "../HeroBackground";

/* ─── Theme 2 – "Ocean Breeze" V2 (Webflow-Style) ─── */

function normalizePackages(packages: LandingPackage[]) {
  if (packages.length > 0) return packages.slice(0, 3);
  return [
    { id: "starter", name: "Tidal Wave", description: "", duration: 12, price: 3990, currency: "TRY", features: ["Kişiye özel program", "Haftalık check-in", "WhatsApp desteği"] },
    { id: "pro", name: "Deep Dive", description: "", duration: 24, price: 6990, currency: "TRY", features: ["Kişiye özel program", "Haftalık check-in", "WhatsApp desteği", "Beslenme planı"] },
    { id: "elite", name: "Tsunami", description: "", duration: 12, price: 5990, currency: "TRY", features: ["Kişiye özel program", "Haftalık check-in", "Sınırsız iletişim", "Beslenme planı"] },
  ] satisfies LandingPackage[];
}

/* ─── Background ─── */
function Theme2Background() {
  return (
    <div className="fixed inset-0 z-0 pointer-events-none">
      <div className="absolute top-[-20%] right-[-10%] w-[800px] h-[800px] bg-[#00E5FF]/5 blur-[200px] rounded-full mix-blend-screen" />
      <div className="absolute bottom-[-20%] left-[-10%] w-[600px] h-[600px] bg-[#0284C7]/10 blur-[150px] rounded-full mix-blend-screen" />
      <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-[0.03] mix-blend-overlay" />
    </div>
  );
}

/* ─── Navbar ─── */
export function Theme2Navbar({ content }: { content: LandingThemeContent }) {
  const [menuOpen, setMenuOpen] = useState(false);
  return (
    <>
      {/* Desktop header */}
      <header className="fixed top-0 w-full z-50 bg-[#03060C]/20 backdrop-blur-2xl border-b border-[#00E5FF]/5 transition-all duration-300 hidden md:block">
        <div className="mx-auto flex h-20 max-w-[1400px] items-center justify-between px-6 lg:px-12">
          <span className="text-xl font-black tracking-widest text-transparent bg-clip-text bg-gradient-to-r from-white to-[#00E5FF] uppercase">
            {content.brandName}
          </span>

          <nav className="flex items-center gap-10">
            <a href="#felsefe" className="text-[11px] font-bold text-[#64748B] hover:text-[#00E5FF] transition-all uppercase tracking-[0.2em]">Felsefe</a>
            <a href="#platform" className="text-[11px] font-bold text-[#64748B] hover:text-[#00E5FF] transition-all uppercase tracking-[0.2em]">Platform</a>
            {content.transformations.length > 0 && <a href="#donusumler" className="text-[11px] font-bold text-[#64748B] hover:text-[#00E5FF] transition-all uppercase tracking-[0.2em]">Dönüşüm</a>}
            <a href="#paketler" className="text-[11px] font-bold text-[#64748B] hover:text-[#00E5FF] transition-all uppercase tracking-[0.2em]">Paketler</a>
          </nav>

          <div className="flex items-center gap-6">
            <Link href={content.authUrl} className="text-[11px] font-bold text-[#64748B] hover:text-white transition-colors uppercase tracking-widest">
              Giriş Yap
            </Link>
            <a href={content.whatsappUrl} target="_blank" rel="noreferrer" className="inline-flex h-10 items-center justify-center rounded-none border border-[#00E5FF]/20 bg-[#00E5FF]/5 px-8 text-[11px] font-black text-[#00E5FF] transition-all hover:bg-[#00E5FF] hover:text-[#03060C] uppercase tracking-[0.2em] shadow-[0_0_20px_rgba(0,229,255,0.05)]">
              Başla
            </a>
          </div>
        </div>
      </header>

      {/* Mobile floating hamburger */}
      <button type="button" onClick={() => setMenuOpen(true)} className="fixed top-4 right-4 z-50 inline-flex h-11 w-11 items-center justify-center border border-[#00E5FF]/20 text-[#00E5FF] bg-black/40 backdrop-blur-md md:hidden shadow-lg rounded-lg" aria-label="Menu">
        <Menu size={20} />
      </button>

      {/* Mobile fullscreen menu */}
      {menuOpen && (
        <div className="fixed inset-0 z-50 bg-[#03060C]/95 backdrop-blur-3xl flex flex-col items-center justify-center md:hidden">
          <button type="button" onClick={() => setMenuOpen(false)} className="absolute top-4 right-4 h-11 w-11 inline-flex items-center justify-center border border-[#00E5FF]/20 text-[#00E5FF] bg-[#00E5FF]/5 rounded-lg" aria-label="Kapat">
            <X size={20} />
          </button>
          <span className="text-xl font-black tracking-widest text-transparent bg-clip-text bg-gradient-to-r from-white to-[#00E5FF] uppercase mb-10">{content.brandName}</span>
          <div className="flex flex-col gap-6 text-sm font-black text-[#64748B] uppercase tracking-[0.2em] text-center">
            <a href="#felsefe" onClick={() => setMenuOpen(false)}>Felsefe</a>
            <a href="#platform" onClick={() => setMenuOpen(false)}>Platform</a>
            {content.transformations.length > 0 && <a href="#donusumler" onClick={() => setMenuOpen(false)}>Dönüşüm</a>}
            <a href="#paketler" onClick={() => setMenuOpen(false)}>Paketler</a>
            <Link href={content.authUrl} onClick={() => setMenuOpen(false)}>Giriş Yap</Link>
            <a href={content.whatsappUrl} target="_blank" rel="noreferrer" className="text-[#00E5FF]">Başla</a>
          </div>
        </div>
      )}
    </>
  );
}

/* ─── Hero Section ─── */
export function Theme2Hero({ content, variant }: SectionRendererProps) {
  const withImage = hasHeroImage(content);

  return (
    <section className="relative min-h-[100svh] w-full bg-[#03060C] overflow-hidden">
      {/* Mobile background */}
      <HeroMobileImage content={content} />

      <div className={`relative z-10 mx-auto max-w-7xl px-6 lg:px-8 pt-32 pb-20 md:pt-40 md:pb-24 min-h-[100svh] flex items-center ${withImage ? "md:grid md:grid-cols-2 md:gap-12" : "justify-center"}`}>
        {/* Left: Text */}
        <div className={`${withImage ? "" : "flex flex-col items-center text-center"}`}>
          <FadeInScroll delay={100} duration={1200} direction="up">
            <div className="inline-flex shadow-[0_0_30px_rgba(0,229,255,0.1)] items-center gap-3 px-6 py-2 rounded-full border border-[#00E5FF]/20 bg-[#00E5FF]/5 backdrop-blur-xl mb-12 uppercase tracking-[0.3em] text-[10px] font-black text-[#00E5FF]">
              <Waves className="h-3 w-3" /> Yeni Nesil Antrenman
            </div>
          </FadeInScroll>

          <h1 className="text-[14vw] md:text-[6vw] lg:text-[5vw] font-black leading-[0.85] tracking-tighter uppercase">
            <span className="block text-transparent bg-clip-text bg-gradient-to-b from-white to-[#0A1220]">Derin</span>
            <span className="block text-transparent bg-clip-text bg-gradient-to-r from-[#00E5FF] to-[#0284C7] drop-shadow-[0_0_40px_rgba(0,229,255,0.3)]">Gelişim</span>
          </h1>

          <FadeInScroll delay={500} duration={1000} direction="up" distance={40}>
            <p className="mt-12 max-w-xl text-base md:text-xl leading-relaxed text-white/60 md:text-[#64748B] font-medium">
              {content.bio || "Sıradan programları unutun. Milimetrik analiz ve sıvı adaptasyon ile vücudunuzun potansiyelini serbest bırakın."}
            </p>
          </FadeInScroll>

          <FadeInScroll delay={700} duration={1000} direction="up" distance={20}>
            <div className="mt-12 flex flex-col sm:flex-row gap-5">
              <a href="#felsefe" className="inline-flex h-14 items-center justify-center rounded-full bg-[#00E5FF] px-10 text-sm font-black text-[#03060C] shadow-[0_0_30px_rgba(0,229,255,0.3)] transition-all hover:scale-105 uppercase tracking-widest w-full sm:w-auto">
                Keşfet
              </a>
            </div>
          </FadeInScroll>
        </div>

        {/* Right: Hero image (desktop) */}
        {withImage && (
          <div className="hidden md:block relative h-[600px] lg:h-[700px]">
            <HeroDesktopImage content={content} themeBg="#03060C" accentColor="#00E5FF" />
          </div>
        )}
      </div>
    </section>
  );
}

/* ─── Stats Section ─── */
export function Theme2Stats({ content, variant }: SectionRendererProps) {
  return (
    <section id="felsefe" className="relative bg-[#03060C] z-20 py-32 md:py-48 px-6 border-t border-[#00E5FF]/5">
      <div className="max-w-[1400px] mx-auto">
        <FadeInScroll delay={100} duration={1000} direction="up">
          <h2 className="text-[8vw] md:text-[5vw] font-black leading-none tracking-tighter text-white uppercase mb-24 opacity-20">
            Data.<br />Disiplin.<br />Sonuç.
          </h2>
        </FadeInScroll>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            { label: "Aktif Öğrenci", value: `${formatCount(content.studentCount || 1000)}+`, icon: Users },
            { label: "Başarılı Dönüşüm", value: `${content.transformationCount || 10}+`, icon: Activity },
            { label: "Yıl Deneyim", value: "5+", icon: Star }
          ].map((stat, i) => (
            <FadeInScroll key={i} delay={i * 200} duration={1000} direction="up" distance={50}>
              <div className="group border-t border-[#00E5FF]/10 pt-8 relative overflow-hidden">
                <div className="absolute top-0 left-0 w-0 h-px bg-[#00E5FF] transition-all duration-700 group-hover:w-full" />
                <stat.icon className="h-8 w-8 text-[#00E5FF] mb-8 opacity-50 group-hover:opacity-100 transition-opacity" />
                <h3 className="text-6xl md:text-7xl font-black text-white tracking-tighter mb-4">{stat.value}</h3>
                <p className="text-[#64748B] text-xs font-black uppercase tracking-[0.2em]">{stat.label}</p>
              </div>
            </FadeInScroll>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ─── Platform Tour (Theme-specific, shown in monolithic mode) ─── */
function Theme2PlatformTour({ content }: { content: LandingThemeContent }) {
  return (
    <section id="platform" className="relative bg-[#0A1220] z-20 border-t border-[#00E5FF]/10">
      <div className="flex flex-col md:flex-row items-start justify-between px-6 lg:px-12 max-w-[1400px] mx-auto relative">
        <div className="w-full md:w-1/2 md:sticky top-0 h-[60vh] md:h-screen flex items-center justify-center pt-20 pb-10 z-0">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(0,229,255,0.05)_0%,transparent_60%)]" />
          <div className="relative w-full max-w-[400px] aspect-[4/5] bg-[#03060C]/60 backdrop-blur-3xl border border-[#00E5FF]/20 rounded-3xl shadow-[0_0_100px_rgba(0,229,255,0.05)] overflow-hidden flex flex-col">
            <div className="h-16 border-b border-[#00E5FF]/10 flex items-center px-6 gap-3">
              <div className="w-3 h-3 rounded-full bg-red-500/20 border border-red-500/50" />
              <div className="w-3 h-3 rounded-full bg-yellow-500/20 border border-yellow-500/50" />
              <div className="w-3 h-3 rounded-full bg-green-500/20 border border-green-500/50" />
            </div>
            <div className="flex-1 p-6 flex flex-col gap-6">
              <div className="w-1/3 h-4 bg-[#00E5FF]/10 rounded" />
              <div className="w-full h-32 bg-gradient-to-r from-[#00E5FF]/5 to-[#0284C7]/5 rounded-xl border border-[#00E5FF]/10 flex items-end p-4 gap-2">
                {[40, 70, 45, 90, 65, 80, 100].map((h, i) => (
                  <div key={i} className="flex-1 bg-[#00E5FF]/20 rounded-t-sm transition-all duration-1000" style={{ height: `${h}%` }} />
                ))}
              </div>
              <div className="space-y-3">
                <div className="w-full h-12 bg-[#00E5FF]/5 rounded-lg border border-[#00E5FF]/10 flex items-center px-4 gap-3">
                  <div className="w-6 h-6 rounded bg-[#00E5FF]/20" />
                  <div className="w-1/2 h-2 bg-[#00E5FF]/10 rounded" />
                </div>
                <div className="w-full h-12 bg-[#00E5FF]/5 rounded-lg border border-[#00E5FF]/10 flex items-center px-4 gap-3">
                  <div className="w-6 h-6 rounded bg-[#00E5FF]/20" />
                  <div className="w-3/4 h-2 bg-[#00E5FF]/10 rounded" />
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="w-full md:w-1/2 flex flex-col pt-10 md:pt-[30vh] pb-32 md:pb-[20vh] gap-32 md:gap-[40vh] pl-0 md:pl-16 z-10 relative">
          <div className="bg-[#03060C]/80 md:bg-transparent backdrop-blur-xl md:backdrop-blur-none p-8 md:p-0 rounded-3xl border border-[#00E5FF]/10 md:border-none shadow-2xl md:shadow-none">
            <FadeInScroll delay={200} duration={1000} direction="up" distance={50}>
              <span className="text-[#00E5FF] text-[10px] font-black uppercase tracking-[0.3em] mb-4 block">Dijital Ekosistem</span>
              <h3 className="text-4xl md:text-5xl font-black text-white leading-[1.1] mb-6 tracking-tighter">
                Sürecini cebinde <br className="hidden md:block" />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#00E5FF] to-[#0284C7]">kontrol altında tut.</span>
              </h3>
              <p className="text-[#64748B] text-base md:text-lg mb-8 leading-relaxed">
                Sana özel hazırlanan programlar, beslenme metrikleri ve gelişim grafikleri saniyeler içinde karşında. Statik PDF&apos;lere son, dinamik ve etkileşimli izleme dönemine hoş geldin.
              </p>
              <ul className="space-y-4">
                {[
                  "Gerçek zamanlı data takibi",
                  "İnteraktif beslenme ve yağ oranı föyleri",
                  "Kesintisiz iletişim ve form analizi"
                ].map((item, i) => (
                  <li key={i} className="flex items-center gap-4 text-[#94A3B8] font-medium text-sm">
                    <CheckCircle2 className="text-[#00E5FF] w-5 h-5 flex-shrink-0" />
                    {item}
                  </li>
                ))}
              </ul>
            </FadeInScroll>
          </div>

          <div className="bg-[#03060C]/95 md:bg-[#03060C]/40 backdrop-blur-xl p-8 rounded-3xl border border-[#00E5FF]/20 shadow-[0_0_50px_rgba(0,229,255,0.05)] flex flex-col gap-8 transform-gpu">
            <FadeInScroll delay={100} duration={1000} direction="up" distance={80}>
              <div>
                <span className="text-[#00E5FF] text-[10px] font-black uppercase tracking-[0.3em] block mb-2">Şeffaf Tasarım</span>
                <h3 className="text-3xl font-black text-white leading-[1.1] tracking-tighter">
                  Arayüzden <br className="md:hidden" /><span className="text-transparent bg-clip-text bg-gradient-to-r from-[#00E5FF] to-[#0284C7]">Detaylara.</span>
                </h3>
                <p className="text-[#64748B] mt-4 text-sm leading-relaxed">
                  Hem koçunuzun gözetimi altında olduğunuzu hissedecek hem de kendi ilerlemenize dair tüm istatistiklere hakim olacaksınız.
                </p>
              </div>
            </FadeInScroll>

            <div className="flex flex-col md:flex-row gap-6 mt-4">
              <div className="flex-1 group">
                <FadeInScroll delay={300} duration={1200} direction="left" distance={100}>
                  <img src="/dashboard-preview-1.png" alt="Platform Arayüzü 1" className="w-full h-auto aspect-[16/10] object-cover object-left-top md:object-center rounded-xl border border-[#00E5FF]/20 shadow-[0_0_40px_rgba(0,229,255,0.1)] group-hover:scale-[1.02] group-hover:border-[#00E5FF]/50 transition-all duration-500" />
                </FadeInScroll>
              </div>
              <div className="flex-1 group md:mt-12">
                <FadeInScroll delay={500} duration={1200} direction="right" distance={100}>
                  <img src="/dashboard-preview-2.png" alt="Platform Arayüzü 2" className="w-full h-auto aspect-[16/10] object-cover object-left-top md:object-center rounded-xl border border-[#00E5FF]/20 shadow-[0_0_40px_rgba(0,229,255,0.1)] group-hover:scale-[1.02] group-hover:border-[#00E5FF]/50 transition-all duration-500" />
                </FadeInScroll>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ─── Transformations Section ─── */
export function Theme2Transformations({ content, variant }: SectionRendererProps) {
  if (content.transformations.length === 0) return null;
  return (
    <section id="donusumler" className="py-32 px-6 relative bg-[#03060C] z-30">
      <div className="mx-auto max-w-[1400px]">
        <FadeInScroll delay={100} duration={1200} direction="up" distance={40}>
          <div className="mb-24 flex flex-col md:flex-row md:items-end justify-between gap-8 border-b border-[#00E5FF]/10 pb-12">
            <h2 className="text-5xl md:text-[6vw] font-black leading-[0.9] tracking-tighter text-white uppercase">
              Ham <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#00E5FF] to-[#0284C7]">Kanıt.</span>
            </h2>
            <p className="max-w-sm text-[#64748B] font-medium leading-relaxed">
              Sistemimizin ürettiği mutlak gerçekler. İstikrarın fiziksel manifestosu.
            </p>
          </div>
        </FadeInScroll>

        <FadeInScroll delay={300} duration={1000} direction="up">
          <div className="mx-auto max-w-4xl">
            <TransformationCarousel items={content.transformations} variant="dark" />
          </div>
        </FadeInScroll>
      </div>
    </section>
  );
}

/* ─── Packages Section ─── */
export function Theme2Packages({ content, variant }: SectionRendererProps) {
  const packages = useMemo(() => normalizePackages(content.packages), [content.packages]);
  return (
    <section id="paketler" className="py-32 px-6 relative bg-[#03060C] z-30">
      <div className="absolute inset-0 bg-[#00E5FF]/5 mix-blend-screen pointer-events-none" />
      <div className="mx-auto max-w-[1400px] relative z-10">
        <FadeInScroll delay={100} duration={1000} direction="up">
          <div className="text-center mb-24">
            <span className="text-[#00E5FF] text-[10px] font-black uppercase tracking-[0.3em] mb-4 block">Erişim Ağı</span>
            <h2 className="text-5xl md:text-[5vw] font-black leading-none tracking-tighter text-white uppercase">
              Sisteme <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#00E5FF] to-[#0284C7]">Katıl.</span>
            </h2>
          </div>
        </FadeInScroll>

        <div className="grid gap-6 md:grid-cols-3 max-w-6xl mx-auto items-center">
          {packages.map((pkg, i) => {
            const isPro = i === 1;
            return (
              <FadeInScroll key={pkg.id} delay={i * 200} duration={1000} direction="up" distance={50}>
                <article className={`relative flex flex-col p-10 backdrop-blur-3xl transition-all duration-700 ${isPro ? "bg-[#0A1220]/80 border border-[#00E5FF]/50 shadow-[0_0_80px_rgba(0,229,255,0.15)] md:scale-110 z-20" : "bg-[#060B14]/60 border border-[#00E5FF]/10 hover:border-[#00E5FF]/30 hover:bg-[#0A1220]/40"}`}>

                  {isPro && (
                    <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-1 bg-[#00E5FF] text-[#03060C] text-[10px] font-black uppercase tracking-[0.2em] shadow-[0_0_20px_rgba(0,229,255,0.5)]">
                      Önerilen Protokol
                    </div>
                  )}

                  <div className="mb-12">
                    <h3 className={`text-sm font-black mb-6 uppercase tracking-[0.2em] ${isPro ? "text-[#00E5FF]" : "text-white"}`}>{pkg.name}</h3>
                    <div className="flex items-baseline gap-2">
                      <span className="text-5xl md:text-6xl font-black text-white tracking-tighter">{formatPackagePrice(pkg.price, pkg.currency)}</span>
                    </div>
                    <p className="mt-2 text-[10px] font-bold text-[#64748B] uppercase tracking-[0.2em]">Aylık Lisans</p>
                  </div>

                  <ul className="flex-1 space-y-6 mb-12">
                    {withFallbackFeatures(pkg.features).map((f, idx) => (
                      <li key={idx} className="flex items-start gap-4">
                        <ChevronRight className={`w-4 h-4 flex-shrink-0 mt-0.5 ${isPro ? "text-[#00E5FF]" : "text-[#64748B]"}`} />
                        <span className={`text-sm font-medium leading-relaxed ${isPro ? "text-white" : "text-[#94A3B8]"}`}>{f}</span>
                      </li>
                    ))}
                  </ul>

                  <Link href={`${content.authUrl}?package=${pkg.id}`} className={`group relative inline-flex h-16 w-full items-center justify-center bg-transparent border ${isPro ? "border-[#00E5FF] text-[#00E5FF]" : "border-[#00E5FF]/20 text-white"} text-[11px] font-black uppercase tracking-[0.2em] overflow-hidden transition-all duration-500 hover:border-[#00E5FF]`}>
                    <div className={`absolute inset-0 bg-[#00E5FF] -translate-x-full transition-transform duration-500 ease-out group-hover:translate-x-0 ${isPro ? "opacity-20" : "opacity-10"}`} />
                    <span className="relative z-10 flex items-center gap-2">
                      Protokolü Başlat <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-2" />
                    </span>
                  </Link>
                </article>
              </FadeInScroll>
            );
          })}
        </div>
      </div>
    </section>
  );
}

/* ─── FAQ Section ─── */
export function Theme2FAQ({ variant }: SectionRendererProps) {
  return (
    <section className="py-32 px-6 relative bg-[#03060C] z-30 border-t border-[#00E5FF]/5">
      <div className="mx-auto max-w-[1400px]">
        <div className="mb-20">
          <FadeInScroll delay={100} duration={1000} direction="up">
            <h2 className="text-4xl md:text-5xl font-black text-white tracking-tighter uppercase mb-4">Sık Sorulan<br /><span className="text-transparent bg-clip-text bg-gradient-to-r from-[#00E5FF] to-[#0284C7]">Sorular.</span></h2>
          </FadeInScroll>
        </div>
        <FAQAccordion
          variant={variant as 1 | 2}
          accentColor="text-[#00E5FF]"
          textColor="text-white"
          mutedColor="text-[#64748B]"
          borderColor="border-[#00E5FF]/10"
          hoverBg="hover:bg-[#00E5FF]/[0.02]"
        />
      </div>
    </section>
  );
}

/* ─── Contact / Footer Section ─── */
export function Theme2Contact({ content, variant }: SectionRendererProps) {
  return (
    <footer id="iletisim" className="mt-auto bg-[#03060C] border-t border-[#00E5FF]/10 py-20 px-6 relative z-30">
      <div className="mx-auto max-w-[1400px] flex flex-col md:flex-row justify-between items-end gap-12">
        <div>
          <div className="text-3xl font-black tracking-tighter text-white mb-6 uppercase">{content.brandName}</div>
          <p className="text-[#64748B] text-xs font-bold uppercase tracking-[0.2em] max-w-xs leading-relaxed">
            Modern biyokimya ve disiplinli mühendisliğin kesişim noktası.
          </p>
        </div>

        <div className="flex flex-col md:items-end gap-6 text-[10px] font-black text-[#64748B] tracking-[0.3em] uppercase">
          <a href={`mailto:${content.email}`} className="hover:text-[#00E5FF] transition-colors">E-Posta: {content.email || "hello@brand.com"}</a>
          <a href={content.whatsappUrl} target="_blank" rel="noreferrer" className="hover:text-[#00E5FF] transition-colors">WhatsApp Destek</a>
          <Link href={content.authUrl} className="hover:text-[#00E5FF] transition-colors text-white">Sisteme Giriş Yap</Link>
        </div>
      </div>

      {content.socialLinks && (
        <div className="mx-auto max-w-[1400px] mt-12">
          <SocialIcons links={content.socialLinks} iconClassName="w-5 h-5 text-[#64748B] hover:text-[#00E5FF] transition-colors" />
        </div>
      )}

      <div className="mx-auto max-w-[1400px] mt-8 pt-8 border-t border-[#00E5FF]/5 flex flex-col md:flex-row justify-between items-center text-[9px] font-black text-[#64748B] tracking-[0.2em] uppercase">
        <p>&copy; {new Date().getFullYear()} TATH. Tüm hakları gizlidir.</p>
        <p className="mt-4 md:mt-0">Sürüm 2.0.4</p>
      </div>
    </footer>
  );
}

/* ─── Main Component (backward compatible) ─── */
export function LandingTheme2({ content }: LandingThemeComponentProps) {
  return (
    <div className="relative min-h-screen bg-[#03060C] text-[#E0F2FE] selection:bg-[#00E5FF]/30 selection:text-white overflow-hidden" style={{ fontFamily: "var(--font-body, Inter, sans-serif)" }}>
      <Theme2Background />
      <div className="relative z-10 flex flex-col min-h-screen">
        <Theme2Navbar content={content} />
        <Theme2Hero content={content} variant={1} />
        <Theme2Stats content={content} variant={1} />
        <Theme2PlatformTour content={content} />
        <Theme2Transformations content={content} variant={1} />
        <Theme2Packages content={content} variant={1} />
        <Theme2Contact content={content} variant={1} />
      </div>
    </div>
  );
}

/* ─── Layout Export (DynamicLandingRenderer için) ─── */
export const theme2Layout: ThemeLayout = {
  Wrapper: ({ children }) => (
    <div className="relative min-h-screen bg-[#03060C] text-[#E0F2FE] selection:bg-[#00E5FF]/30 selection:text-white overflow-hidden" style={{ fontFamily: "var(--font-body, Inter, sans-serif)" }}>
      <Theme2Background />
      <div className="relative z-10 flex flex-col min-h-screen">
        {children}
      </div>
    </div>
  ),
  Navbar: Theme2Navbar,
  sections: {
    hero: Theme2Hero,
    stats: Theme2Stats,
    transformations: Theme2Transformations,
    packages: Theme2Packages,
    faq: Theme2FAQ,
    contact: Theme2Contact,
  },
};
