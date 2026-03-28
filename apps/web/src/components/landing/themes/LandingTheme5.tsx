"use client";

import Link from "next/link";
import { Activity, Mail, Menu, MessageCircle, X, Users, Zap, Shield, ChevronRight } from "lucide-react";
import { useMemo, useState } from "react";
import { formatCount, formatPackagePrice, withFallbackFeatures } from "../helpers";
import { TransformationCarousel } from "../TransformationCarousel";
import type { LandingThemeComponentProps, LandingPackage, LandingThemeContent } from "../types";
import type { SectionRendererProps, ThemeLayout } from "../section-types";
import { FAQAccordion } from "../FAQSection";
import { SocialIcons } from "../SocialIcons";
import { HeroDesktopImage, HeroMobileImage, hasHeroImage } from "../HeroBackground";

/* ─── Theme 5 – "Electric Hybrid" ─── */

function normalizePackages(packages: LandingPackage[]) {
  if (packages.length > 0) return packages.slice(0, 3);
  return [
    { id: "starter", name: "Alpha", description: "", duration: 12, price: 3990, currency: "TRY", features: ["Kişiye özel program", "Haftalık data analizi", "7/24 Erişim"] },
    { id: "pro", name: "Sigma", description: "", duration: 24, price: 6990, currency: "TRY", features: ["Kişiye özel program", "Haftalık data analizi", "7/24 Erişim", "Makro planlaması"] },
    { id: "elite", name: "Omega", description: "", duration: 12, price: 5990, currency: "TRY", features: ["Kişiye özel program", "Günlük data analizi", "Sınırsız iletişim", "Makro planlaması"] },
  ] satisfies LandingPackage[];
}

/* ─── Background ─── */
function Theme5Background() {
  return (
    <div className="pointer-events-none fixed inset-0 z-0">
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:64px_64px] [mask-image:radial-gradient(ellipse_80%_80%_at_50%_10%,#000_20%,transparent_100%)]" />
      <div className="absolute -top-[20%] right-[10%] w-[600px] h-[600px] bg-[#2EC8D8]/10 blur-[120px] rounded-full" />
      <div className="absolute top-[40%] text-transparent -left-[10%] w-[500px] h-[500px] bg-[#9D4EDD]/10 blur-[120px] rounded-full" />
    </div>
  );
}

/* ─── Navbar ─── */
export function Theme5Navbar({ content }: { content: LandingThemeContent }) {
  const [menuOpen, setMenuOpen] = useState(false);
  return (
    <>
      {/* Desktop header */}
      <header className="fixed top-0 w-full z-50 bg-[#07090F]/80 backdrop-blur-xl border-b border-[#2EC8D8]/20 hidden md:block">
        <div className="mx-auto flex h-20 max-w-[1400px] items-center justify-between px-6 lg:px-12">
          <div className="flex items-center gap-3">
            <div className="h-2 w-2 rounded-full bg-[#2EC8D8] shadow-[0_0_10px_#2EC8D8] animate-pulse" />
            <span className="text-xl font-black tracking-widest text-white uppercase" style={{ WebkitTextStroke: "0.5px #2EC8D8" }}>
              {content.brandName}
            </span>
          </div>

          <nav className="flex items-center gap-10">
            <a href="#tanitim" className="text-xs font-bold text-[#8B9BB4] hover:text-[#2EC8D8] transition-colors uppercase tracking-[0.2em]">Hakkımızda</a>
            {content.transformations.length > 0 && <a href="#donusumler" className="text-xs font-bold text-[#8B9BB4] hover:text-[#2EC8D8] transition-colors uppercase tracking-[0.2em]">Dönüşüm</a>}
            <a href="#paketler" className="text-xs font-bold text-[#8B9BB4] hover:text-[#2EC8D8] transition-colors uppercase tracking-[0.2em]">Paketler</a>
            <a href="#iletisim" className="text-xs font-bold text-[#8B9BB4] hover:text-[#2EC8D8] transition-colors uppercase tracking-[0.2em]">İletişim</a>
          </nav>

          <div className="flex items-center gap-6">
            <Link href={content.authUrl} className="text-xs font-bold text-[#8B9BB4] hover:text-white transition-colors uppercase tracking-widest">
              Giriş Yap
            </Link>
            <a href={content.whatsappUrl} target="_blank" rel="noreferrer" className="inline-flex h-10 items-center justify-center rounded bg-[#2EC8D8]/10 border border-[#2EC8D8]/40 px-6 text-xs font-bold text-[#2EC8D8] transition-all hover:bg-[#2EC8D8] hover:text-[#07090F] hover:shadow-[0_0_20px_rgba(46,200,216,0.4)] uppercase tracking-widest relative overflow-hidden group">
              <span className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:animate-[shimmer_1.5s_infinite]" />
              Başla
            </a>
          </div>
        </div>
      </header>

      {/* Mobile floating hamburger */}
      <button type="button" onClick={() => setMenuOpen(true)} className="fixed top-4 right-4 z-50 inline-flex h-11 w-11 items-center justify-center border border-[#2EC8D8]/30 text-[#2EC8D8] bg-black/40 backdrop-blur-md md:hidden rounded-lg shadow-lg" aria-label="Menu">
        <Menu size={20} />
      </button>

      {/* Mobile fullscreen menu */}
      {menuOpen && (
        <div className="fixed inset-0 z-50 bg-[#07090F]/95 backdrop-blur-3xl flex flex-col items-center justify-center md:hidden">
          <button type="button" onClick={() => setMenuOpen(false)} className="absolute top-4 right-4 h-11 w-11 inline-flex items-center justify-center border border-[#2EC8D8]/30 text-[#2EC8D8] rounded-lg" aria-label="Kapat">
            <X size={20} />
          </button>
          <div className="flex items-center gap-3 mb-10">
            <div className="h-2 w-2 rounded-full bg-[#2EC8D8] shadow-[0_0_10px_#2EC8D8] animate-pulse" />
            <span className="text-xl font-black tracking-widest text-white uppercase" style={{ WebkitTextStroke: "0.5px #2EC8D8" }}>{content.brandName}</span>
          </div>
          <div className="flex flex-col gap-5 text-sm font-bold text-[#8B9BB4] uppercase tracking-widest text-center">
            <a href="#tanitim" onClick={() => setMenuOpen(false)}>Hakkımızda</a>
            {content.transformations.length > 0 && <a href="#donusumler" onClick={() => setMenuOpen(false)}>Dönüşüm</a>}
            <a href="#paketler" onClick={() => setMenuOpen(false)}>Paketler</a>
            <a href="#iletisim" onClick={() => setMenuOpen(false)}>İletişim</a>
            <Link href={content.authUrl} className="text-[#2EC8D8]" onClick={() => setMenuOpen(false)}>Giriş Yap</Link>
            <a href={content.whatsappUrl} target="_blank" rel="noreferrer" className="text-white">Başla</a>
          </div>
        </div>
      )}
    </>
  );
}

/* ─── Hero Section ─── */
export function Theme5Hero({ content, variant }: SectionRendererProps) {
  const withImage = hasHeroImage(content);

  return (
    <section className="relative min-h-[100svh] overflow-hidden bg-[#07090F]">
      {/* Mobile background */}
      <HeroMobileImage content={content} />

      <div className={`relative z-10 mx-auto max-w-[1400px] px-6 lg:px-12 pt-32 pb-20 md:pt-44 md:pb-32 min-h-[100svh] flex items-center ${withImage ? "md:grid md:grid-cols-2 md:gap-12" : ""}`}>
        {/* Left: Text */}
        <div className="max-w-3xl">
          <div className="inline-flex items-center gap-3 px-4 py-1.5 rounded bg-[#2EC8D8]/10 border border-[#2EC8D8]/30 mb-8 backdrop-blur-sm">
            <Zap size={14} className="text-[#2EC8D8]" />
            <span className="text-[10px] font-bold text-[#2EC8D8] tracking-[0.2em] uppercase">Protokol V2.0 Aktif</span>
          </div>

          <h1 className="text-4xl md:text-6xl lg:text-[72px] font-black tracking-tighter text-white mb-6 leading-[1] uppercase">
            Evriminizi
            <br className="hidden md:block" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#2EC8D8] to-[#9D4EDD]">
              Hackleyin.
            </span>
          </h1>

          <p className="mt-8 max-w-xl text-lg md:text-xl leading-relaxed text-white/60 md:text-[#8B9BB4] font-medium border-l-2 border-[#2EC8D8]/50 pl-6">
            {content.bio || "Biyomekanik optimizasyon ve veri odaklı antrenman sistemleriyle fiziksel limitlerinizi yeniden yazın."}
          </p>

          <div className="mt-12 flex flex-col sm:flex-row items-start gap-5">
            <a href="#paketler" className="inline-flex h-14 items-center justify-center rounded bg-[#2EC8D8] px-10 text-sm font-black text-[#07090F] shadow-[0_0_30px_rgba(46,200,216,0.3)] transition-all hover:bg-white hover:shadow-[0_0_40px_rgba(255,255,255,0.4)] uppercase tracking-widest w-full sm:w-auto">
              Programları İncele
            </a>
            <a href={content.whatsappUrl} target="_blank" rel="noreferrer" className="inline-flex h-14 items-center justify-center gap-2 rounded border border-[#8B9BB4]/30 bg-transparent px-8 text-sm font-bold text-white transition-all hover:border-[#2EC8D8]/50 hover:bg-[#2EC8D8]/5 uppercase tracking-widest w-full sm:w-auto">
              <Shield size={16} className="text-[#9D4EDD]" />
              Başla
            </a>
          </div>
        </div>

        {/* Right: Hero image (desktop) */}
        {withImage && (
          <div className="hidden md:block relative h-[600px] lg:h-[700px]">
            <HeroDesktopImage content={content} themeBg="#07090F" accentColor="#2EC8D8" />
          </div>
        )}
      </div>
    </section>
  );
}

/* ─── Stats Section ─── */
export function Theme5Stats({ content, variant }: SectionRendererProps) {
  return (
    <section id="tanitim" className="px-6 lg:px-12 border-y border-[#2EC8D8]/20 bg-[#0C1220]/50 backdrop-blur-sm">
      <div className="mx-auto max-w-[1400px]">
        <div className="grid grid-cols-1 md:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-[#2EC8D8]/20">
          <div className="py-12 md:py-16 md:px-12 flex flex-col">
            <div className="flex items-baseline gap-2 mb-2">
              <span className="text-5xl font-black text-white">{formatCount(content.studentCount || 1000)}+</span>
            </div>
            <p className="text-xs font-bold text-[#8B9BB4] uppercase tracking-[0.2em] flex items-center gap-2">
              <span className="w-4 h-px bg-[#2EC8D8]" /> Aktif Öğrenci
            </p>
          </div>
          <div className="py-12 md:py-16 md:px-12 flex flex-col">
            <div className="flex items-baseline gap-2 mb-2">
              <span className="text-5xl font-black text-white">{content.transformationCount || 10}+</span>
            </div>
            <p className="text-xs font-bold text-[#8B9BB4] uppercase tracking-[0.2em] flex items-center gap-2">
              <span className="w-4 h-px bg-[#9D4EDD]" /> Başarılı Dönüşüm
            </p>
          </div>
          <div className="py-12 md:py-16 md:px-12 flex flex-col">
            <div className="flex items-baseline gap-2 mb-2">
              <span className="text-5xl font-black text-white">5+</span>
            </div>
            <p className="text-xs font-bold text-[#8B9BB4] uppercase tracking-[0.2em] flex items-center gap-2">
              <span className="w-4 h-px bg-white" /> Yıl Deneyim
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ─── Transformations Section ─── */
export function Theme5Transformations({ content, variant }: SectionRendererProps) {
  if (content.transformations.length === 0) return null;
  return (
    <section id="donusumler" className="py-24 px-6 lg:px-12 relative overflow-hidden border-b border-[#2EC8D8]/20">
      <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-[#9D4EDD]/5 blur-[150px] rounded-full pointer-events-none" />
      <div className="mx-auto max-w-[1400px] flex flex-col lg:flex-row gap-16 lg:items-center">
        <div className="lg:w-1/3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded border border-[#9D4EDD]/30 mb-6 bg-[#9D4EDD]/10">
            <Activity size={12} className="text-[#9D4EDD]" />
            <span className="text-[10px] font-bold text-[#9D4EDD] tracking-widest uppercase">Görsel Kanıt</span>
          </div>
          <h2 className="text-4xl md:text-5xl font-black text-white uppercase tracking-tighter leading-[1]">Veri Analiz<br />Sonuçları</h2>
          <p className="mt-6 text-[#8B9BB4] text-lg">Sistemimize entegre olan bireylerin program sonu anatomik gelişim raporları.</p>
        </div>
        <div className="lg:w-2/3 w-full max-w-xl mx-auto lg:mx-0">
          <div className="p-1 rounded-xl bg-gradient-to-b from-[#2EC8D8]/20 to-transparent">
            <TransformationCarousel items={content.transformations} variant="neon" />
          </div>
        </div>
      </div>
    </section>
  );
}

/* ─── Packages Section ─── */
export function Theme5Packages({ content, variant }: SectionRendererProps) {
  const packages = useMemo(() => normalizePackages(content.packages), [content.packages]);
  return (
    <section id="paketler" className="py-32 px-6 lg:px-12 relative">
      <div className="mx-auto max-w-[1400px]">
        <div className="mb-20">
          <div className="inline-flex items-center gap-2 mb-4">
            <span className="w-8 h-px bg-[#2EC8D8]" />
            <span className="text-[10px] font-bold text-[#2EC8D8] tracking-[0.2em] uppercase">Erişim Yetkisi</span>
          </div>
          <h2 className="text-4xl md:text-5xl font-black text-white uppercase tracking-tighter">Sistem Modülleri</h2>
        </div>

        <div className="grid gap-8 md:grid-cols-3 items-end">
          {packages.map((pkg, i) => {
            const isPro = i === 1;
            return (
              <article key={pkg.id} className={`group relative flex flex-col border transition-all duration-300 ${isPro ? "bg-[#0C1220] border-[#2EC8D8] shadow-[0_0_30px_rgba(46,200,216,0.15)] z-10" : "bg-[#07090F] border-[#1E293B] hover:border-[#8B9BB4]/40"}`}>
                <div className="absolute top-0 left-0 w-4 h-4 border-t-2 border-l-2 border-inherit" />
                <div className="absolute bottom-0 right-0 w-4 h-4 border-b-2 border-r-2 border-inherit" />

                <div className="p-8">
                  {isPro && (
                    <div className="mb-6 inline-flex bg-[#2EC8D8]/10 text-[#2EC8D8] text-[10px] font-black uppercase tracking-[0.2em] px-3 py-1 border border-[#2EC8D8]/30 backdrop-blur-sm">
                      Sistem Önerisi
                    </div>
                  )}
                  <h3 className={`text-xl font-black tracking-widest uppercase mb-4 ${isPro ? "text-white" : "text-[#8B9BB4]"}`}>{pkg.name}</h3>
                  <div className="flex items-baseline gap-2 mb-2">
                    <span className="text-4xl md:text-5xl font-black text-white tracking-tighter">{formatPackagePrice(pkg.price, pkg.currency)}</span>
                  </div>
                  <p className="text-[10px] font-bold text-[#8B9BB4] uppercase tracking-widest">Aylık Lisans Ücreti</p>
                </div>

                <div className="h-px w-full bg-[#1E293B] group-hover:bg-[#2EC8D8]/20 transition-colors" />

                <div className="p-8 pb-10">
                  <ul className="space-y-4 mb-10">
                    {withFallbackFeatures(pkg.features).map((f, idx) => (
                      <li key={idx} className="flex items-start gap-4">
                        <ChevronRight className={`mt-0.5 w-4 h-4 shrink-0 ${isPro ? "text-[#2EC8D8]" : "text-[#8B9BB4]"}`} />
                        <span className="text-sm font-medium text-[#E2E8F0]">{f}</span>
                      </li>
                    ))}
                  </ul>

                  <Link href={`${content.authUrl}?package=${pkg.id}`} className={`relative inline-flex h-12 w-full items-center justify-center border text-xs font-black uppercase tracking-[0.2em] transition-all overflow-hidden ${isPro ? "bg-[#2EC8D8] border-[#2EC8D8] text-[#07090F] hover:bg-white hover:border-white shadow-[0_0_20px_rgba(46,200,216,0.2)]" : "bg-transparent border-[#1E293B] text-white hover:border-[#2EC8D8]/50 hover:bg-[#2EC8D8]/10"}`}>
                    Erişim Sağla
                  </Link>
                </div>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}

/* ─── FAQ Section ─── */
export function Theme5FAQ({ variant }: SectionRendererProps) {
  return (
    <section className="py-24 px-6 lg:px-12 relative border-y border-[#2EC8D8]/20">
      <div className="mx-auto max-w-[1400px]">
        <div className="mb-16">
          <div className="inline-flex items-center gap-2 mb-4">
            <span className="w-8 h-px bg-[#9D4EDD]" />
            <span className="text-[10px] font-bold text-[#9D4EDD] tracking-[0.2em] uppercase">Bilgi Bankası</span>
          </div>
          <h2 className="text-4xl md:text-5xl font-black text-white uppercase tracking-tighter">Sık Sorulan Sorular</h2>
        </div>
        <FAQAccordion
          variant={variant as 1 | 2}
          accentColor="text-[#2EC8D8]"
          textColor="text-[#E2E8F0]"
          mutedColor="text-[#8B9BB4]"
          borderColor="border-[#1E293B]"
          hoverBg="hover:bg-[#0C1220]/50"
        />
      </div>
    </section>
  );
}

/* ─── Contact / Footer Section ─── */
export function Theme5Contact({ content, variant }: SectionRendererProps) {
  return (
    <footer id="iletisim" className="mt-auto border-t border-[#2EC8D8]/20 bg-[#07090F] pt-16 pb-8 px-6 lg:px-12 relative overflow-hidden">
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:32px_32px] opacity-30" />

      <div className="mx-auto max-w-[1400px] relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-10">
        <div>
          <div className="text-2xl font-black tracking-widest text-white uppercase mb-2" style={{ WebkitTextStroke: "0.5px #2EC8D8" }}>
            {content.brandName}
          </div>
          <p className="text-xs font-bold text-[#8B9BB4] uppercase tracking-[0.2em]">Sistem Versiyonu 2.0.4</p>
        </div>

        <div className="flex flex-wrap items-center gap-8 text-[11px] font-bold uppercase tracking-[0.2em] text-[#8B9BB4]">
          <a href={`mailto:${content.email}`} className="hover:text-[#2EC8D8] transition-colors flex items-center gap-2"><Mail size={14} className="text-[#2EC8D8]/50" /> İrtibat Teli</a>
          <a href={content.whatsappUrl} target="_blank" rel="noreferrer" className="hover:text-[#2EC8D8] transition-colors flex items-center gap-2"><MessageCircle size={14} className="text-[#2EC8D8]/50" /> Destek Ağı</a>
          <Link href={content.authUrl} className="hover:text-[#2EC8D8] transition-colors flex items-center gap-2"><Shield size={14} className="text-[#2EC8D8]/50" /> Portal Girişi</Link>
        </div>
      </div>

      {content.socialLinks && (
        <div className="mx-auto max-w-[1400px] mt-12 relative z-10">
          <SocialIcons links={content.socialLinks} iconClassName="w-5 h-5 text-[#8B9BB4] hover:text-[#2EC8D8] transition-colors" />
        </div>
      )}
      <div className="mx-auto max-w-[1400px] mt-8 pt-8 border-t border-[#1E293B] relative z-10">
        <p className="text-[10px] font-bold text-[#8B9BB4]/50 uppercase tracking-[0.2em]">
          &copy; {new Date().getFullYear()} Tüm Protokoller Güvence Altındadır.
        </p>
      </div>
    </footer>
  );
}

/* ─── Main Component (backward compatible) ─── */
export function LandingTheme5({ content }: LandingThemeComponentProps) {
  return (
    <div className="relative min-h-screen bg-[#07090F] text-[#E2E8F0] selection:bg-[#2EC8D8]/30 selection:text-[#2EC8D8]" style={{ fontFamily: "var(--font-body, Inter, sans-serif)" }}>
      <Theme5Background />
      <div className="relative z-10 flex flex-col min-h-screen">
        <Theme5Navbar content={content} />
        <Theme5Hero content={content} variant={1} />
        <Theme5Stats content={content} variant={1} />
        <Theme5Transformations content={content} variant={1} />
        <Theme5Packages content={content} variant={1} />
        <Theme5Contact content={content} variant={1} />
      </div>
    </div>
  );
}

/* ─── Layout Export (DynamicLandingRenderer için) ─── */
export const theme5Layout: ThemeLayout = {
  Wrapper: ({ children }) => (
    <div className="relative min-h-screen bg-[#07090F] text-[#E2E8F0] selection:bg-[#2EC8D8]/30 selection:text-[#2EC8D8]" style={{ fontFamily: "var(--font-body, Inter, sans-serif)" }}>
      <Theme5Background />
      <div className="relative z-10 flex flex-col min-h-screen">
        {children}
      </div>
    </div>
  ),
  Navbar: Theme5Navbar,
  sections: {
    hero: Theme5Hero,
    stats: Theme5Stats,
    transformations: Theme5Transformations,
    packages: Theme5Packages,
    faq: Theme5FAQ,
    contact: Theme5Contact,
  },
};
