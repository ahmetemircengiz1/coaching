"use client";

import Link from "next/link";
import { Menu, MessageCircle, X, ArrowRight, CheckCircle2, Heart, Award } from "lucide-react";
import { useMemo, useState } from "react";
import { formatCount, formatPackagePrice, withFallbackFeatures } from "../helpers";
import { TransformationCarousel } from "../TransformationCarousel";
import type { LandingThemeComponentProps, LandingPackage, LandingThemeContent } from "../types";
import type { SectionRendererProps, ThemeLayout } from "../section-types";
import { FAQAccordion } from "../FAQSection";
import { SocialIcons } from "../SocialIcons";
import { HeroDesktopImage, HeroMobileImage, hasHeroImage } from "../HeroBackground";

/* ─── Theme 3 – "Solidroad Pastel Light" ─── */

function normalizePackages(packages: LandingPackage[]) {
  if (packages.length > 0) return packages.slice(0, 3);
  return [
    { id: "starter", name: "Başlangıç", description: "", duration: 12, price: 3990, currency: "TRY", features: ["Kişiye özel program", "Haftalık check-in", "WhatsApp desteği"] },
    { id: "pro", name: "Gelişim", description: "", duration: 12, price: 5990, currency: "TRY", features: ["Kişiye özel program", "Haftalık check-in", "WhatsApp desteği", "Beslenme planı"] },
    { id: "elite", name: "Premium", description: "", duration: 12, price: 7990, currency: "TRY", features: ["Kişiye özel program", "Haftalık check-in", "Sınırsız iletişim", "Beslenme planı"] },
  ] satisfies LandingPackage[];
}

/* ─── Background ─── */
function Theme3Background() {
  return (
    <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden">
      <div className="absolute -right-[15%] -top-[10%] h-[800px] w-[800px] rounded-full bg-teal-50 opacity-60 blur-[100px]" />
      <div className="absolute -left-[10%] top-[30%] h-[600px] w-[600px] rounded-full bg-blue-50 opacity-60 blur-[100px]" />
      <div className="absolute right-[20%] bottom-[-10%] h-[500px] w-[500px] rounded-full bg-indigo-50 opacity-60 blur-[100px]" />
    </div>
  );
}

/* ─── Navbar ─── */
export function Theme3Navbar({ content }: { content: LandingThemeContent }) {
  const [menuOpen, setMenuOpen] = useState(false);
  return (
    <>
      {/* Desktop navbar */}
      <nav className="fixed top-4 w-full z-50 px-4 md:px-8 hidden md:block">
        <div className="mx-auto flex h-[72px] max-w-6xl items-center justify-between rounded-[2rem] bg-white/90 px-6 sm:px-8 shadow-sm backdrop-blur-xl border border-slate-100">
          <span className="text-xl font-extrabold tracking-tight text-teal-700">{content.brandName}</span>

          <nav className="flex items-center gap-8">
            <a href="#tanitim" className="text-[15px] font-semibold text-slate-500 transition-colors hover:text-teal-700">Hakkımızda</a>
            {content.transformations.length > 0 && <a href="#donusumler" className="text-[15px] font-semibold text-slate-500 transition-colors hover:text-teal-700">Dönüşüm</a>}
            <a href="#paketler" className="text-[15px] font-semibold text-slate-500 transition-colors hover:text-teal-700">Paketler</a>
            <a href="#iletisim" className="text-[15px] font-semibold text-slate-500 transition-colors hover:text-teal-700">İletişim</a>
          </nav>

          <div className="flex items-center gap-3">
            <Link href={content.authUrl} className="text-[15px] font-semibold text-teal-700 bg-teal-50 px-5 py-2.5 rounded-full hover:bg-teal-100 transition-colors">
              Giriş Yap
            </Link>
            <a href={content.whatsappUrl} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 rounded-full bg-teal-600 px-6 py-2.5 text-[15px] font-bold text-white shadow-md shadow-teal-600/20 transition-all hover:-translate-y-0.5 hover:shadow-lg hover:shadow-teal-600/30">
              Başla
            </a>
          </div>
        </div>
      </nav>

      {/* Mobile floating hamburger */}
      <button type="button" onClick={() => setMenuOpen(true)} className="fixed top-4 right-4 z-50 inline-flex h-11 w-11 items-center justify-center rounded-full bg-white/80 backdrop-blur-md text-slate-600 md:hidden shadow-lg border border-slate-200" aria-label="Menu">
        <Menu size={18} />
      </button>

      {/* Mobile fullscreen menu */}
      {menuOpen && (
        <div className="fixed inset-0 z-50 bg-white/95 backdrop-blur-3xl flex flex-col items-center justify-center md:hidden">
          <button type="button" onClick={() => setMenuOpen(false)} className="absolute top-4 right-4 h-11 w-11 inline-flex items-center justify-center rounded-full bg-slate-100 text-slate-600" aria-label="Kapat">
            <X size={18} />
          </button>
          <span className="text-xl font-extrabold tracking-tight text-teal-700 mb-10">{content.brandName}</span>
          <div className="flex flex-col gap-4 text-center text-base font-bold text-slate-600">
            <a href="#tanitim" onClick={() => setMenuOpen(false)}>Hakkımızda</a>
            {content.transformations.length > 0 && <a href="#donusumler" onClick={() => setMenuOpen(false)}>Dönüşüm</a>}
            <a href="#paketler" onClick={() => setMenuOpen(false)}>Paketler</a>
            <a href="#iletisim" onClick={() => setMenuOpen(false)}>İletişim</a>
            <Link href={content.authUrl} className="text-teal-600" onClick={() => setMenuOpen(false)}>Giriş Yap</Link>
            <a href={content.whatsappUrl} target="_blank" rel="noreferrer" className="bg-teal-600 text-white py-3 rounded-full mt-2 px-8">Başla</a>
          </div>
        </div>
      )}
    </>
  );
}

/* ─── Hero Section ─── */
export function Theme3Hero({ content, variant }: SectionRendererProps) {
  const withImage = hasHeroImage(content);

  return (
    <section className="relative min-h-[100svh] overflow-hidden bg-white">
      {/* Mobile background */}
      <HeroMobileImage content={content} />

      <div className={`relative z-10 mx-auto max-w-7xl px-6 sm:px-8 pt-36 pb-16 md:pt-44 md:pb-24 min-h-[100svh] flex items-center ${withImage ? "md:grid md:grid-cols-2 md:gap-12" : "justify-center text-center"}`}>
        {/* Left: Text */}
        <div className={withImage ? "" : "max-w-4xl mx-auto"}>
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white border border-slate-200 mb-8 shadow-sm">
            <span className="flex h-2 w-2 rounded-full bg-green-400 animate-pulse" />
            <span className="text-sm font-bold text-slate-700 md:text-slate-700 tracking-tight">Kişiye Özel Evrimi Başlat</span>
          </div>

          <h1 className="text-[44px] md:text-[56px] lg:text-[72px] font-black leading-[1.05] tracking-tight text-white md:text-slate-900 drop-shadow-sm">
            Potansiyelinizin
            <br />
            en <span className="text-teal-400 md:text-teal-600 relative inline-block">
              güçlü
              <svg className="absolute -bottom-2 left-0 w-full h-3 text-teal-300 -z-10 hidden md:block" viewBox="0 0 100 20" preserveAspectRatio="none"><path d="M0 10 Q 25 20 50 10 T 100 10" fill="none" stroke="currentColor" strokeWidth="6" strokeLinecap="round" /></svg>
            </span>
            <br />  haline ulaşın.
          </h1>

          <p className="mt-8 max-w-xl text-xl leading-relaxed text-white/80 md:text-slate-600 font-medium">
            {content.bio || "Hayallerinizdeki fiziğe ulaşmak artık zor değil. Sizi motive eden, sizi anlayan ve destekleyen bir koçluk ekosistemi."}
          </p>

          <div className="mt-12 flex flex-col sm:flex-row items-start gap-4">
            <a href="#paketler" className="inline-flex h-16 w-full sm:w-auto items-center justify-center rounded-full bg-teal-600 px-10 text-lg font-bold text-white shadow-xl shadow-teal-600/20 transition-all hover:-translate-y-1 hover:shadow-teal-600/30 group">
              Programları İncele
              <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
            </a>
            <a href={content.whatsappUrl} target="_blank" rel="noreferrer" className="inline-flex h-16 w-full sm:w-auto items-center justify-center gap-2 rounded-full bg-white px-10 text-lg font-bold text-slate-700 shadow-md ring-1 ring-slate-200 transition-all hover:bg-slate-50 hover:shadow-lg">
              <MessageCircle size={20} className="text-teal-600" />
              Başla
            </a>
          </div>
        </div>

        {/* Right: Hero image (desktop) */}
        {withImage && (
          <div className="hidden md:block relative h-[550px] lg:h-[650px]">
            <HeroDesktopImage content={content} themeBg="#ffffff" accentColor="#0d9488" />
          </div>
        )}
      </div>
    </section>
  );
}

/* ─── Stats Section ─── */
export function Theme3Stats({ content, variant }: SectionRendererProps) {
  return (
    <section id="tanitim" className="px-6 pb-20 sm:px-8">
      <div className="mx-auto max-w-5xl">
        <div className="flex flex-col items-center justify-between gap-8 rounded-[2.5rem] bg-white px-8 py-10 shadow-xl shadow-slate-200/50 md:flex-row md:px-16 md:py-12 border border-slate-100">
          {[
            { icon: Heart, value: `${formatCount(content.studentCount || 500)}+`, label: "Aktif Öğrenci", color: "text-rose-500", bg: "bg-rose-50" },
            { icon: Award, value: `${content.transformationCount || 10}+`, label: "Başarılı Dönüşüm", color: "text-indigo-500", bg: "bg-indigo-50" },
            { icon: CheckCircle2, value: `5+`, label: "Yıl Deneyim", color: "text-teal-500", bg: "bg-teal-50" },
          ].map((stat, i) => (
            <div key={stat.label} className="flex flex-col items-center text-center w-full">
              {i > 0 && <div className="mb-8 h-px w-full bg-slate-100 md:hidden" />}
              <div className={`h-16 w-16 ${stat.bg} ${stat.color} rounded-full flex items-center justify-center mb-4`}>
                <stat.icon size={28} />
              </div>
              <p className="text-4xl font-black text-slate-800">{stat.value}</p>
              <p className="mt-2 text-base font-bold text-slate-500">{stat.label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ─── Transformations Section ─── */
export function Theme3Transformations({ content, variant }: SectionRendererProps) {
  if (content.transformations.length === 0) return null;
  return (
    <section id="donusumler" className="px-6 pb-24 sm:px-8">
      <div className="mx-auto max-w-6xl">
        <div className="text-center mb-16">
          <h2 className="text-[40px] font-black text-slate-900 tracking-tight">Onlar başardı. <br className="md:hidden" /> <span className="text-teal-600">Sıra sizde.</span></h2>
        </div>
        <div className="mx-auto max-w-xl bg-white p-4 rounded-[3rem] shadow-xl shadow-slate-200/50 border border-slate-100">
          <TransformationCarousel items={content.transformations} variant="mint" />
        </div>
      </div>
    </section>
  );
}

/* ─── Packages Section ─── */
export function Theme3Packages({ content, variant }: SectionRendererProps) {
  const packages = useMemo(() => normalizePackages(content.packages), [content.packages]);
  return (
    <section id="paketler" className="px-6 pb-32 pt-12 sm:px-8">
      <div className="mx-auto max-w-6xl">
        <div className="text-center mb-20">
          <h2 className="text-[40px] font-black text-slate-900 tracking-tight">Size en uygun program.</h2>
          <p className="mt-4 text-lg text-slate-500 font-medium">Hedeflerinize göre tasarlanmış koçluk modelleri.</p>
        </div>

        <div className="mx-auto grid max-w-5xl gap-8 md:grid-cols-3 items-center">
          {packages.map((pkg, i) => {
            const isPro = i === 1;
            return (
              <div key={pkg.id} className={`relative flex flex-col rounded-[3rem] p-10 transition-all duration-300 ${isPro ? "bg-teal-700 text-white shadow-2xl shadow-teal-900/20 scale-105 z-10" : "bg-white text-slate-900 shadow-xl shadow-slate-200/50 border border-slate-100 hover:-translate-y-2"}`}>

                {isPro && (
                  <div className="absolute -top-5 left-1/2 -translate-x-1/2 rounded-full bg-yellow-400 px-6 py-2 text-xs font-black uppercase tracking-wider text-yellow-900 shadow-lg">
                    Popüler
                  </div>
                )}

                <div className="text-center mb-8">
                  <h3 className={`text-xl font-black mb-4 ${isPro ? "text-teal-100" : "text-teal-700"}`}>{pkg.name}</h3>
                  <div className="flex items-center justify-center gap-2">
                    <span className="text-[48px] font-black tracking-tight leading-none">
                      {formatPackagePrice(pkg.price, pkg.currency)}
                    </span>
                  </div>
                </div>

                <div className={`my-8 h-px w-full ${isPro ? "bg-teal-600" : "bg-slate-100"}`} />

                <ul className="flex-1 space-y-5 mb-10">
                  {withFallbackFeatures(pkg.features).slice(0, 5).map((f, idx) => (
                    <li key={idx} className="flex items-start gap-4">
                      <div className={`mt-1 flex h-6 w-6 shrink-0 items-center justify-center rounded-full font-bold text-sm ${isPro ? "bg-teal-600 text-white" : "bg-teal-50 text-teal-600"}`}>
                        ✓
                      </div>
                      <span className={`text-[15px] font-semibold leading-relaxed ${isPro ? "text-teal-50" : "text-slate-600"}`}>{f}</span>
                    </li>
                  ))}
                </ul>

                <Link href={`${content.authUrl}?package=${pkg.id}`} className={`mt-auto inline-flex h-14 w-full items-center justify-center rounded-full text-lg font-bold transition-all ${isPro ? "bg-white text-teal-700 hover:bg-teal-50 shadow-lg" : "bg-slate-900 text-white hover:bg-slate-800 shadow-lg"}`}>
                  Programı Başlat
                </Link>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

/* ─── FAQ Section ─── */
export function Theme3FAQ({ variant }: SectionRendererProps) {
  return (
    <section className="px-6 pb-24 sm:px-8">
      <div className="mx-auto max-w-6xl">
        <div className="text-center mb-16">
          <h2 className="text-[40px] font-black text-slate-900 tracking-tight">Sık Sorulan <span className="text-teal-600">Sorular</span></h2>
        </div>
        <div className="bg-white rounded-[2.5rem] p-8 md:p-12 shadow-xl shadow-slate-200/50 border border-slate-100">
          <FAQAccordion
            variant={variant as 1 | 2}
            accentColor="text-teal-600"
            textColor="text-slate-800"
            mutedColor="text-slate-500"
            borderColor="border-slate-100"
            hoverBg="hover:bg-slate-50"
          />
        </div>
      </div>
    </section>
  );
}

/* ─── Contact / Footer Section ─── */
export function Theme3Contact({ content, variant }: SectionRendererProps) {
  return (
    <footer id="iletisim" className="mt-auto border-t border-slate-200 bg-white py-12 px-6">
      <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-6 sm:flex-row sm:px-8">
        <div className="text-2xl font-black tracking-tight text-slate-800">
          {content.brandName}
        </div>
        <div className="flex items-center gap-8">
          <a href={`mailto:${content.email}`} className="text-sm font-bold text-slate-500 transition-colors hover:text-teal-700">Email İletişim</a>
          <a href={content.whatsappUrl} target="_blank" rel="noreferrer" className="text-sm font-bold text-slate-500 transition-colors hover:text-teal-700">WhatsApp Destek</a>
          <Link href={content.authUrl} className="text-sm font-bold text-slate-500 transition-colors hover:text-teal-700">Katılımcı Girişi</Link>
        </div>
        {content.socialLinks && (
          <SocialIcons links={content.socialLinks} iconClassName="w-5 h-5 text-slate-400 hover:text-teal-600 transition-colors" />
        )}
        <p className="text-sm font-semibold text-slate-400">&copy; {new Date().getFullYear()}</p>
      </div>
    </footer>
  );
}

/* ─── Main Component (backward compatible) ─── */
export function LandingTheme3({ content }: LandingThemeComponentProps) {
  return (
    <div className="relative min-h-screen overflow-x-hidden bg-[#F8FAFC] text-[#334155] selection:bg-teal-200 selection:text-teal-900" style={{ fontFamily: "var(--font-body, Inter, sans-serif)" }}>
      <Theme3Background />
      <div className="relative z-10 flex flex-col min-h-screen">
        <Theme3Navbar content={content} />
        <Theme3Hero content={content} variant={1} />
        <Theme3Stats content={content} variant={1} />
        <Theme3Transformations content={content} variant={1} />
        <Theme3Packages content={content} variant={1} />
        <Theme3Contact content={content} variant={1} />
      </div>
    </div>
  );
}

/* ─── Layout Export (DynamicLandingRenderer için) ─── */
export const theme3Layout: ThemeLayout = {
  Wrapper: ({ children }) => (
    <div className="relative min-h-screen overflow-x-hidden bg-[#F8FAFC] text-[#334155] selection:bg-teal-200 selection:text-teal-900" style={{ fontFamily: "var(--font-body, Inter, sans-serif)" }}>
      <Theme3Background />
      <div className="relative z-10 flex flex-col min-h-screen">
        {children}
      </div>
    </div>
  ),
  Navbar: Theme3Navbar,
  sections: {
    hero: Theme3Hero,
    stats: Theme3Stats,
    transformations: Theme3Transformations,
    packages: Theme3Packages,
    faq: Theme3FAQ,
    contact: Theme3Contact,
  },
};
