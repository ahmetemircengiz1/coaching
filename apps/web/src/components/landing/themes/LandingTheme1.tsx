"use client";

import Link from "next/link";
import { Menu, MessageCircle, X, ArrowRight, TrendingUp, ShieldCheck, Zap, Star } from "lucide-react";
import { useMemo, useState } from "react";
import { formatCount, formatPackagePrice, withFallbackFeatures } from "../helpers";
import { TransformationCarousel } from "../TransformationCarousel";
import type { LandingThemeComponentProps, LandingPackage, LandingThemeContent } from "../types";
import type { SectionRendererProps, ThemeLayout } from "../section-types";
import { FAQAccordion } from "../FAQSection";
import { SocialIcons } from "../SocialIcons";
import { HeroDesktopImage, HeroMobileImage, hasHeroImage } from "../HeroBackground";

/* ─── Theme 1 – "Midnight Gold" ─── Premium Luxury, Deep Dark, Gold Accents, Glowing Effects */

function normalizePackages(packages: LandingPackage[]) {
  if (packages.length > 0) return packages.slice(0, 3);
  return [
    { id: "starter", name: "Gold Standard", description: "", duration: 12, price: 3990, currency: "TRY", features: ["Kişiye özel program", "Haftalık check-in", "WhatsApp desteği"] },
    { id: "pro", name: "Platinum", description: "", duration: 12, price: 5990, currency: "TRY", features: ["Kişiye özel program", "Haftalık check-in", "WhatsApp desteği", "Beslenme planı"] },
    { id: "elite", name: "Apex Prestige", description: "", duration: 12, price: 7990, currency: "TRY", features: ["Kişiye özel program", "Haftalık check-in", "Sınırsız iletişim", "Beslenme planı"] },
  ] satisfies LandingPackage[];
}

/* ─── Background ─── */
function Theme1Background() {
  return (
    <div className="pointer-events-none fixed inset-0 z-0">
      <div className="absolute top-[-10%] left-1/2 -translate-x-1/2 w-[600px] h-[500px] bg-[#D4AF37]/10 blur-[150px] rounded-full" />
      <div className="absolute inset-0 bg-[url('/noise.png')] opacity-20 mix-blend-overlay" />
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:64px_64px] [mask-image:radial-gradient(ellipse_60%_60%_at_50%_20%,#000_70%,transparent_100%)] opacity-30" />
    </div>
  );
}

/* ─── Navbar ─── */
export function Theme1Navbar({ content }: { content: LandingThemeContent }) {
  const [menuOpen, setMenuOpen] = useState(false);
  return (
    <>
      {/* Desktop header */}
      <header className="fixed top-0 w-full z-50 border-b border-white/5 bg-[#0A0A0C]/60 backdrop-blur-2xl transition-all duration-300 hidden md:block">
        <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-6 lg:px-8">
          <span className="text-lg font-black tracking-widest text-[#D4AF37] uppercase" style={{ letterSpacing: "0.2em" }}>{content.brandName}</span>

          <nav className="flex items-center gap-10">
            <a href="#tanitim" className="text-xs font-semibold text-white/50 hover:text-[#D4AF37] transition-all uppercase tracking-widest">Hakkımızda</a>
            {content.transformations.length > 0 && <a href="#donusumler" className="text-xs font-semibold text-white/50 hover:text-[#D4AF37] transition-all uppercase tracking-widest">Dönüşüm</a>}
            <a href="#paketler" className="text-xs font-semibold text-white/50 hover:text-[#D4AF37] transition-all uppercase tracking-widest">Paketler</a>
            <a href="#iletisim" className="text-xs font-semibold text-white/50 hover:text-[#D4AF37] transition-all uppercase tracking-widest">İletişim</a>
          </nav>

          <div className="flex items-center gap-5">
            <Link href={content.authUrl} className="text-sm font-semibold text-white/70 hover:text-white transition-colors">
              Giriş Yap
            </Link>
            <a href={content.whatsappUrl} target="_blank" rel="noreferrer" className="inline-flex h-10 items-center justify-center rounded-full bg-gradient-to-r from-[#D4AF37] to-[#F3E5AB] px-6 text-xs font-bold text-black transition-all hover:scale-105 hover:shadow-[0_0_20px_rgba(212,175,55,0.4)]">
              Başla
            </a>
          </div>
        </div>
      </header>

      {/* Mobile floating hamburger */}
      <button type="button" onClick={() => setMenuOpen(true)} className="fixed top-4 right-4 z-50 inline-flex h-11 w-11 items-center justify-center rounded-full bg-black/40 backdrop-blur-md border border-white/10 text-[#D4AF37] md:hidden shadow-lg" aria-label="Menu">
        <Menu size={20} />
      </button>

      {/* Mobile fullscreen menu */}
      {menuOpen && (
        <div className="fixed inset-0 z-50 bg-[#0A0A0C]/95 backdrop-blur-3xl flex flex-col items-center justify-center md:hidden">
          <button type="button" onClick={() => setMenuOpen(false)} className="absolute top-4 right-4 h-11 w-11 inline-flex items-center justify-center rounded-full bg-white/5 border border-white/10 text-[#D4AF37]" aria-label="Kapat">
            <X size={20} />
          </button>
          <span className="text-lg font-black tracking-widest text-[#D4AF37] uppercase mb-10" style={{ letterSpacing: "0.2em" }}>{content.brandName}</span>
          <div className="flex flex-col gap-6 text-sm font-semibold text-white/70 tracking-widest uppercase text-center">
            <a href="#tanitim" onClick={() => setMenuOpen(false)}>Hakkımızda</a>
            {content.transformations.length > 0 && <a href="#donusumler" onClick={() => setMenuOpen(false)}>Dönüşüm</a>}
            <a href="#paketler" onClick={() => setMenuOpen(false)}>Paketler</a>
            <a href="#iletisim" onClick={() => setMenuOpen(false)}>İletişim</a>
            <Link href={content.authUrl} onClick={() => setMenuOpen(false)}>Giriş Yap</Link>
            <a href={content.whatsappUrl} target="_blank" rel="noreferrer" className="text-[#D4AF37]">Başla</a>
          </div>
        </div>
      )}
    </>
  );
}

/* ─── Hero Section ─── */
export function Theme1Hero({ content, variant }: SectionRendererProps) {
  const withImage = hasHeroImage(content);

  return (
    <section className="relative min-h-[100svh] overflow-hidden">
      {/* Mobile background */}
      <HeroMobileImage content={content} />

      <div className={`relative z-10 mx-auto max-w-7xl px-6 lg:px-8 pt-32 pb-20 md:pt-40 md:pb-24 min-h-[100svh] flex items-center ${withImage ? "md:grid md:grid-cols-2 md:gap-12" : "justify-center text-center"}`}>
        {/* Left: Text */}
        <div className={`${withImage ? "" : "max-w-5xl mx-auto"} animate-in fade-in slide-in-from-bottom-8 duration-1000`}>
          <div className="inline-flex items-center gap-3 px-4 py-1.5 rounded-full bg-[#D4AF37]/10 border border-[#D4AF37]/20 mb-8 backdrop-blur-md">
            <Star className="h-3 w-3 text-[#D4AF37] fill-[#D4AF37]" />
            <span className="text-[10px] font-bold text-[#D4AF37] tracking-[0.3em] uppercase">Premium Koçluk Ekosistemi</span>
            <Star className="h-3 w-3 text-[#D4AF37] fill-[#D4AF37]" />
          </div>

          <h1 className="text-4xl md:text-6xl lg:text-7xl font-black tracking-tight text-white mb-8 leading-[1.1] font-serif">
            Mükemmeliğe <br className="hidden md:block" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#C9A24D] via-[#FFE58F] to-[#C9A24D]">
              Ulaşın.
            </span>
          </h1>

          <p className="mt-8 max-w-xl text-lg md:text-xl leading-relaxed text-white/70 md:text-gray-400 font-medium">
            {content.bio || "En üst düzey performans. Size özel tasarlanmış, lüks ve bilimsel verilerle şekillendirilen bir gelişim serüveni."}
          </p>

          <div className="mt-14 flex flex-col sm:flex-row items-start gap-5">
            <a href="#paketler" className="inline-flex h-14 items-center justify-center rounded-full bg-gradient-to-r from-[#D4AF37] to-[#F3E5AB] px-10 text-sm font-bold text-black shadow-[0_0_40px_rgba(212,175,55,0.25)] transition-all hover:scale-105 hover:shadow-[0_0_60px_rgba(212,175,55,0.4)] group w-full sm:w-auto">
              Koleksiyonu İncele
              <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
            </a>
            <a href={content.whatsappUrl} target="_blank" rel="noreferrer" className="inline-flex h-14 items-center justify-center gap-2 rounded-full border border-white/10 bg-white/5 px-10 text-sm font-bold text-white transition-all hover:bg-white/10 hover:border-[#D4AF37]/50 backdrop-blur-md w-full sm:w-auto group">
              <MessageCircle size={16} className="text-gray-400 group-hover:text-[#D4AF37] transition-colors" />
              Başla
            </a>
          </div>
        </div>

        {/* Right: Hero image (desktop) */}
        {withImage && (
          <div className="hidden md:block relative h-[600px] lg:h-[700px]">
            <HeroDesktopImage content={content} themeBg="#0A0A0C" accentColor="#D4AF37" />
          </div>
        )}
      </div>
    </section>
  );
}

/* ─── Stats Section ─── */
export function Theme1Stats({ content, variant }: SectionRendererProps) {
  return (
    <section id="tanitim" className="px-6 py-20 relative z-10">
      <div className="mx-auto max-w-6xl">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="rounded-[2rem] border border-white/5 bg-gradient-to-b from-white/[0.03] to-transparent p-10 flex flex-col items-center justify-center text-center shadow-2xl relative overflow-hidden group">
            <div className="absolute inset-0 bg-gradient-to-b from-[#D4AF37]/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
            <div className="h-16 w-16 rounded-2xl bg-gradient-to-br from-[#D4AF37]/20 to-transparent flex items-center justify-center mb-6 border border-[#D4AF37]/20">
              <TrendingUp className="text-[#D4AF37] h-8 w-8" />
            </div>
            <h3 className="text-5xl font-black text-white mb-2 tracking-tight group-hover:scale-105 transition-transform duration-500">{formatCount(content.studentCount || 1000)}+</h3>
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-[0.2em]">Aktif Öğrenci</p>
          </div>

          <div className="rounded-[2rem] border border-white/5 bg-gradient-to-b from-white/[0.03] to-transparent p-10 flex flex-col items-center justify-center text-center shadow-2xl relative overflow-hidden group">
            <div className="absolute inset-0 bg-gradient-to-b from-[#D4AF37]/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
            <div className="h-16 w-16 rounded-2xl bg-gradient-to-br from-[#D4AF37]/20 to-transparent flex items-center justify-center mb-6 border border-[#D4AF37]/20">
              <ShieldCheck className="text-[#D4AF37] h-8 w-8" />
            </div>
            <h3 className="text-5xl font-black text-white mb-2 tracking-tight group-hover:scale-105 transition-transform duration-500">{content.transformationCount || 10}+</h3>
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-[0.2em]">Başarılı Dönüşüm</p>
          </div>

          <div className="rounded-[2rem] border border-white/5 bg-gradient-to-b from-white/[0.03] to-transparent p-10 flex flex-col items-center justify-center text-center shadow-2xl relative overflow-hidden group">
            <div className="absolute inset-0 bg-gradient-to-b from-[#D4AF37]/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
            <div className="h-16 w-16 rounded-2xl bg-gradient-to-br from-[#D4AF37]/20 to-transparent flex items-center justify-center mb-6 border border-[#D4AF37]/20">
              <Zap className="text-[#D4AF37] h-8 w-8" />
            </div>
            <h3 className="text-5xl font-black text-white mb-2 tracking-tight group-hover:scale-105 transition-transform duration-500">5+</h3>
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-[0.2em]">Yıl Deneyim</p>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ─── Transformations Section ─── */
export function Theme1Transformations({ content, variant }: SectionRendererProps) {
  if (content.transformations.length === 0) return null;
  return (
    <section id="donusumler" className="py-24 px-6 border-y border-white/5 bg-[#060608] relative">
      <div className="absolute right-0 top-1/2 -translate-y-1/2 w-[400px] h-[400px] bg-[#D4AF37]/5 blur-[120px] rounded-full pointer-events-none" />
      <div className="mx-auto max-w-6xl relative z-10">
        <div className="mb-20 text-center">
          <h2 className="text-4xl md:text-6xl font-black text-white tracking-tight font-serif mb-6">Şaheserler.</h2>
          <div className="h-1 w-20 bg-gradient-to-r from-transparent via-[#D4AF37] to-transparent mx-auto opacity-50" />
        </div>
        <div className="mx-auto max-w-xl">
          <TransformationCarousel items={content.transformations} variant="dark" />
        </div>
      </div>
    </section>
  );
}

/* ─── Packages Section ─── */
export function Theme1Packages({ content, variant }: SectionRendererProps) {
  const packages = useMemo(() => normalizePackages(content.packages), [content.packages]);
  return (
    <section id="paketler" className="py-32 px-6 relative">
      <div className="absolute inset-0 bg-[#060608] -z-10" />
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-3xl h-[400px] bg-[#D4AF37]/5 blur-[150px] rounded-full pointer-events-none" />

      <div className="mx-auto max-w-6xl relative z-10">
        <div className="text-center mb-24">
          <h2 className="text-4xl md:text-6xl font-black text-white tracking-tight font-serif mb-6">Özel Koleksiyon.</h2>
          <div className="h-1 w-20 bg-gradient-to-r from-transparent via-[#D4AF37] to-transparent mx-auto opacity-50 mb-6" />
          <p className="text-gray-400 font-medium tracking-wide">Sadece en iyisini arayanlar için tasarlandı.</p>
        </div>

        <div className="grid gap-8 md:grid-cols-3 items-stretch">
          {packages.map((pkg, i) => {
            const isPro = i === 1;
            return (
              <article key={pkg.id} className={`flex flex-col rounded-[2.5rem] p-10 transition-all duration-500 relative ${isPro ? "bg-gradient-to-b from-[#1A1813] to-[#0A0A0C] border border-[#D4AF37]/40 shadow-[0_0_80px_rgba(212,175,55,0.15)] md:-translate-y-4 z-10" : "bg-gradient-to-b from-[#121214] to-[#0A0A0C] border border-white/5 hover:border-white/10 hover:shadow-2xl"}`}>

                {isPro && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2 px-6 py-2 bg-gradient-to-r from-[#D4AF37] to-[#F3E5AB] text-black text-[10px] font-black uppercase tracking-[0.2em] rounded-full shadow-[0_0_20px_rgba(212,175,55,0.4)]">
                    Prestige
                  </div>
                )}

                <div className="mb-10 text-center">
                  <h3 className={`text-xl font-bold mb-4 uppercase tracking-[0.15em] ${isPro ? "text-[#D4AF37]" : "text-white"}`}>{pkg.name}</h3>
                  <div className="flex items-baseline justify-center gap-2">
                    <span className="text-4xl md:text-6xl font-black text-white tracking-tight font-serif">{formatPackagePrice(pkg.price, pkg.currency)}</span>
                  </div>
                  <p className="mt-3 text-[10px] font-semibold text-gray-500 uppercase tracking-[0.2em]">Aylık Yatırım</p>
                </div>

                <div className="h-px w-full bg-gradient-to-r from-transparent via-white/10 to-transparent mb-10" />

                <ul className="flex-1 space-y-5 mb-10">
                  {withFallbackFeatures(pkg.features).map((f, idx) => (
                    <li key={idx} className="flex items-center gap-4">
                      <div className={`flex h-4 w-4 shrink-0 items-center justify-center rounded-full ${isPro ? "bg-[#D4AF37]/20 text-[#D4AF37]" : "bg-white/5 text-gray-400"}`}>
                        <svg width="8" height="8" viewBox="0 0 12 12" fill="none"><path d="M2.5 6L4.5 8L9.5 3" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>
                      </div>
                      <span className={`${isPro ? "text-gray-300 font-medium" : "text-gray-400"} text-sm tracking-wide`}>{f}</span>
                    </li>
                  ))}
                </ul>

                <Link href={`${content.authUrl}?package=${pkg.id}`} className={`mt-auto inline-flex h-14 w-full items-center justify-center rounded-2xl text-xs font-bold uppercase tracking-widest transition-all duration-300 ${isPro ? "bg-gradient-to-r from-[#D4AF37] to-[#F3E5AB] text-black shadow-[0_0_30px_rgba(212,175,55,0.2)] hover:scale-105" : "bg-white/5 text-white border border-white/10 hover:bg-white/10"}`}>
                  Seçimi Onayla
                </Link>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}

/* ─── FAQ Section ─── */
export function Theme1FAQ({ variant }: SectionRendererProps) {
  return (
    <section className="py-24 px-6 relative z-10 bg-[#060608]">
      <div className="mx-auto max-w-6xl">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-black text-white tracking-tight font-serif mb-4">Sık Sorulan Sorular</h2>
          <div className="h-1 w-20 bg-gradient-to-r from-transparent via-[#D4AF37] to-transparent mx-auto opacity-50" />
        </div>
        <FAQAccordion
          variant={variant as 1 | 2}
          accentColor="text-[#D4AF37]"
          textColor="text-white"
          mutedColor="text-gray-400"
          borderColor="border-white/10"
          hoverBg="hover:bg-white/[0.02]"
        />
      </div>
    </section>
  );
}

/* ─── Contact / Footer Section ─── */
export function Theme1Contact({ content, variant }: SectionRendererProps) {
  return (
    <footer id="iletisim" className="mt-auto border-t border-white/5 bg-[#030304] py-16 px-6 relative z-10">
      <div className="mx-auto max-w-6xl flex flex-col md:flex-row justify-between items-center gap-8">
        <div className="text-2xl font-black tracking-[0.2em] text-[#D4AF37] uppercase font-serif">
          {content.brandName}
        </div>

        <div className="flex items-center gap-8 text-xs font-semibold text-gray-500 tracking-widest uppercase">
          <a href={`mailto:${content.email}`} className="hover:text-[#D4AF37] transition-colors">E-posta</a>
          <a href={content.whatsappUrl} target="_blank" rel="noreferrer" className="hover:text-[#D4AF37] transition-colors">WhatsApp</a>
          <Link href={content.authUrl} className="hover:text-[#D4AF37] transition-colors">VIP Giriş</Link>
        </div>

        {content.socialLinks && (
          <SocialIcons links={content.socialLinks} iconClassName="w-5 h-5 text-gray-500 hover:text-[#D4AF37] transition-colors" />
        )}

        <p className="text-[10px] font-semibold text-gray-700 uppercase tracking-[0.2em]">
          &copy; {new Date().getFullYear()} Elite Ekosistem. Tüm Hakları Saklıdır.
        </p>
      </div>
    </footer>
  );
}

/* ─── Main Component (backward compatible) ─── */
export function LandingTheme1({ content }: LandingThemeComponentProps) {
  return (
    <div className="relative min-h-screen bg-[#060608] text-[#EFEFEF] selection:bg-[#D4AF37]/30 selection:text-white overflow-hidden" style={{ fontFamily: "var(--font-body, Inter, sans-serif)" }}>
      <Theme1Background />
      <div className="relative z-10 flex flex-col min-h-screen">
        <Theme1Navbar content={content} />
        <Theme1Hero content={content} variant={1} />
        <Theme1Stats content={content} variant={1} />
        <Theme1Transformations content={content} variant={1} />
        <Theme1Packages content={content} variant={1} />
        <Theme1Contact content={content} variant={1} />
      </div>
    </div>
  );
}

/* ─── Layout Export (DynamicLandingRenderer için) ─── */
export const theme1Layout: ThemeLayout = {
  Wrapper: ({ children }) => (
    <div className="relative min-h-screen bg-[#060608] text-[#EFEFEF] selection:bg-[#D4AF37]/30 selection:text-white overflow-hidden" style={{ fontFamily: "var(--font-body, Inter, sans-serif)" }}>
      <Theme1Background />
      <div className="relative z-10 flex flex-col min-h-screen">
        {children}
      </div>
    </div>
  ),
  Navbar: Theme1Navbar,
  sections: {
    hero: Theme1Hero,
    stats: Theme1Stats,
    transformations: Theme1Transformations,
    packages: Theme1Packages,
    faq: Theme1FAQ,
    contact: Theme1Contact,
  },
};
