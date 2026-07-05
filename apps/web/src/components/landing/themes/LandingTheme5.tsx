"use client";

import Link from "next/link";
import { Activity, Mail, MessageCircle, Users, Zap, Shield, ChevronRight } from "lucide-react";
import { useMemo, useId } from "react";
import { UnifiedNavbar } from "../shared/UnifiedNavbar";
import { SystemHowSection } from "../shared/SystemHowSection";
import { resolveNavbarVariant } from "../config";
import { formatCount, formatPackagePrice, withFallbackFeatures, buildPackageInquiryUrl } from "../helpers";
import { TransformationCarousel } from "../TransformationCarousel";
import type { LandingThemeComponentProps, LandingPackage, LandingThemeContent } from "../types";
import { getTextEffectStyle } from "../types";
import type { SectionRendererProps, ThemeLayout } from "../section-types";
import { FAQAccordion } from "../FAQSection";
import { SocialIcons } from "../SocialIcons";
import { HeroFullscreenImage, hasHeroImage } from "../HeroBackground";

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
  const variant = resolveNavbarVariant(content.landingConfig?.navbarVariant, "theme-5");
  return <UnifiedNavbar content={content} variant={variant} />;
}

/* ─── Hero Section ─── */
export function Theme5Hero({ content, variant }: SectionRendererProps) {
  const withImage = hasHeroImage(content);
  const texts = content.landingTexts;
  const headlineColor = texts?.heroTextColor || undefined;
  const subtitleColor = texts?.heroSubtitleColor || undefined;
  const effectStyle = getTextEffectStyle(texts?.heroTextEffect, headlineColor);
  const textAlign = texts?.heroTextAlign || "center";

  const posMode = texts?.heroTextPositionMode || "flex";
  const posX = texts?.heroTextPosX ?? 50;
  const posY = texts?.heroTextPosY ?? 50;
  const scale = texts?.heroTextScale ?? 1;
  const subtitleScale = Number(texts?.heroSubtitleScale ?? 1);
  const headlineBg = texts?.heroHeadlineBgColor || "";
  const subtitleBg = texts?.heroSubtitleBgColor || "";
  const weight = texts?.heroTextWeight || undefined;
  const containerId = useId().replace(/:/g, "");
  const containerClass = `hero-text-${containerId}`;

  return (
    <section data-landing-section="hero" className="relative min-h-[100svh] overflow-hidden bg-[#07090F]">
      <style>{`
        .${containerClass} {
          transform: scale(${scale});
          transform-origin: ${textAlign === "left" ? "left center" : textAlign === "right" ? "right center" : "center center"};
        }
        @media (min-width: 768px) {
          .${containerClass} {
            ${posMode === "absolute" ? `
              position: absolute !important;
              left: ${posX}% !important;
              top: ${posY}% !important;
              transform: translate(-50%, -50%) scale(${scale}) !important;
              margin: 0 !important;
            ` : ""}
          }
        }
      `}</style>
      {/* Fullscreen background */}
      <HeroFullscreenImage content={content} themeBg="#07090F" />

      <div className={`relative z-10 mx-auto max-w-[1400px] px-6 lg:px-12 pt-32 pb-20 md:pt-44 md:pb-32 min-h-[100svh] flex items-center justify-center text-center`}>
        {/* Text */}
        <div className={`max-w-3xl w-full ${textAlign === "center" ? "mx-auto items-center text-center" : textAlign === "left" ? "mr-auto items-start text-left" : "ml-auto items-end text-right"} flex flex-col ${containerClass}`}>
          <div className="inline-flex items-center justify-center gap-3 px-4 py-1.5 rounded bg-[#2EC8D8]/10 border border-[#2EC8D8]/30 mb-8 backdrop-blur-sm">
            <Zap size={14} className="text-[#2EC8D8]" />
            <span className="text-[10px] font-bold text-[#2EC8D8] tracking-[0.2em] uppercase">Protokol V2.0 Aktif</span>
          </div>

          {texts?.heroHeadline ? (
            <h1 className={`text-4xl md:text-6xl lg:text-[72px] ${weight ? '' : 'font-black'} tracking-tighter ${headlineColor || headlineBg ? '' : 'text-white'} mb-6 leading-[1] uppercase`} style={{ color: headlineColor || undefined, fontWeight: weight, ...effectStyle }}>
              {headlineBg ? (
                <span style={{ backgroundColor: headlineBg, padding: "0.1em 0.3em", display: "inline-block", boxDecorationBreak: "clone", WebkitBoxDecorationBreak: "clone" }}>{texts.heroHeadline}</span>
              ) : headlineColor ? (
                <span>{texts.heroHeadline}</span>
              ) : (
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#2EC8D8] to-[#9D4EDD]">
                  {texts.heroHeadline}
                </span>
              )}
            </h1>
          ) : (
            <h1 className={`text-4xl md:text-6xl lg:text-[72px] ${weight ? '' : 'font-black'} tracking-tighter text-white mb-6 leading-[1] uppercase`} style={{ fontWeight: weight, ...effectStyle }}>
              Evriminizi
              <br className="hidden md:block" />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#2EC8D8] to-[#9D4EDD]">
                Hackleyin.
              </span>
            </h1>
          )}

          <p className={`mt-8 max-w-xl leading-relaxed ${subtitleColor ? '' : 'text-white/60 md:text-[#8B9BB4]'} font-medium ${subtitleScale === 1 ? 'text-lg md:text-xl' : ''}`} style={{ color: subtitleColor || undefined, textShadow: subtitleBg ? undefined : "0 1px 10px rgba(0,0,0,0.5)", fontSize: subtitleScale !== 1 ? `${subtitleScale * 1.25}rem` : undefined }}>
            {subtitleBg ? (
              <span style={{ backgroundColor: subtitleBg, padding: "0.15em 0.4em", display: "inline-block", boxDecorationBreak: "clone", WebkitBoxDecorationBreak: "clone" }}>
                {texts?.heroSubtitle || content.bio || "Biyomekanik optimizasyon ve veri odaklı antrenman sistemleriyle fiziksel limitlerinizi yeniden yazın."}
              </span>
            ) : (
              texts?.heroSubtitle || content.bio || "Biyomekanik optimizasyon ve veri odaklı antrenman sistemleriyle fiziksel limitlerinizi yeniden yazın."
            )}
          </p>

          <div className="mt-12 flex flex-col sm:flex-row items-center justify-center gap-5">
            <a href="#paketler" className="inline-flex h-14 items-center justify-center rounded bg-[#2EC8D8] px-10 text-sm font-black text-[#07090F] shadow-[0_0_30px_rgba(46,200,216,0.3)] transition-all hover:bg-white hover:shadow-[0_0_40px_rgba(255,255,255,0.4)] uppercase tracking-widest w-full sm:w-auto">
              {texts?.ctaPrimaryText || "Programları İncele"}
            </a>
            {content.whatsappNumber ? (
              <a href={content.whatsappUrl} target="_blank" rel="noreferrer" className="inline-flex h-14 items-center justify-center gap-2 rounded border border-[#8B9BB4]/30 bg-transparent px-8 text-sm font-bold text-white transition-all hover:border-[#2EC8D8]/50 hover:bg-[#2EC8D8]/5 uppercase tracking-widest w-full sm:w-auto">
                <MessageCircle size={16} className="text-[#9D4EDD]" />
                {texts?.ctaSecondaryText || "WhatsApp ile Başla"}
              </a>
            ) : (
              <Link href={content.authUrl} className="inline-flex h-14 items-center justify-center gap-2 rounded border border-[#8B9BB4]/30 bg-transparent px-8 text-sm font-bold text-white transition-all hover:border-[#2EC8D8]/50 hover:bg-[#2EC8D8]/5 uppercase tracking-widest w-full sm:w-auto">
                <Shield size={16} className="text-[#9D4EDD]" />
                {texts?.ctaSecondaryText || "Kayıt Ol"}
              </Link>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

/* ─── Stats Section ─── */
export function Theme5Stats({ content, variant }: SectionRendererProps) {
  return (
    <section data-landing-section="stats" id="tanitim" className="px-6 lg:px-12 border-y border-[#2EC8D8]/20 bg-[#0C1220]/50 backdrop-blur-sm">
      <div className="mx-auto max-w-[1400px]">
        <div className="grid grid-cols-1 md:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-[#2EC8D8]/20">
          <div className="py-12 md:py-16 md:px-12 flex flex-col">
            <div className="flex items-baseline gap-2 mb-2">
              <span className="text-5xl font-black text-white">{content.landingTexts?.stat1Value || `${formatCount(content.studentCount || 1000)}+`}</span>
            </div>
            <p className="text-xs font-bold text-[#8B9BB4] uppercase tracking-[0.2em] flex items-center gap-2">
              <span className="w-4 h-px bg-[#2EC8D8]" /> {content.landingTexts?.stat1Label || "Aktif Öğrenci"}
            </p>
          </div>
          <div className="py-12 md:py-16 md:px-12 flex flex-col">
            <div className="flex items-baseline gap-2 mb-2">
              <span className="text-5xl font-black text-white">{content.landingTexts?.stat2Value || `${content.transformationCount || 10}+`}</span>
            </div>
            <p className="text-xs font-bold text-[#8B9BB4] uppercase tracking-[0.2em] flex items-center gap-2">
              <span className="w-4 h-px bg-[#9D4EDD]" /> {content.landingTexts?.stat2Label || "Başarılı Dönüşüm"}
            </p>
          </div>
          <div className="py-12 md:py-16 md:px-12 flex flex-col">
            <div className="flex items-baseline gap-2 mb-2">
              <span className="text-5xl font-black text-white">{content.landingTexts?.stat3Value || "5+"}</span>
            </div>
            <p className="text-xs font-bold text-[#8B9BB4] uppercase tracking-[0.2em] flex items-center gap-2">
              <span className="w-4 h-px bg-white" /> {content.landingTexts?.stat3Label || "Yıl Deneyim"}
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
    <section data-landing-section="transformations" id="donusumler" className="py-24 px-6 lg:px-12 relative overflow-hidden border-b border-[#2EC8D8]/20">
      <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-[#9D4EDD]/5 blur-[150px] rounded-full pointer-events-none" />
      <div className="mx-auto max-w-[1400px] flex flex-col lg:flex-row gap-16 lg:items-center">
        <div data-section-heading className="lg:w-1/3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded border border-[#9D4EDD]/30 mb-6 bg-[#9D4EDD]/10">
            <Activity size={12} className="text-[#9D4EDD]" />
            <span className="text-[10px] font-bold text-[#9D4EDD] tracking-widest uppercase">Görsel Kanıt</span>
          </div>
          <h2 className="text-4xl md:text-5xl font-black text-white uppercase tracking-tighter leading-[1]">{content.landingTexts?.transformationsTitle || <>Veri Analiz<br />Sonuçları</>}</h2>
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
    <section data-landing-section="packages" id="paketler" className="py-32 px-6 lg:px-12 relative">
      <div className="mx-auto max-w-[1400px]">
        <div data-section-heading className="mb-20">
          <div className="inline-flex items-center gap-2 mb-4">
            <span className="w-8 h-px bg-[#2EC8D8]" />
            <span className="text-[10px] font-bold text-[#2EC8D8] tracking-[0.2em] uppercase">Erişim Yetkisi</span>
          </div>
          <h2 className="text-4xl md:text-5xl font-black text-white uppercase tracking-tighter">{content.landingTexts?.packagesTitle || "Sistem Modülleri"}</h2>
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

                  {(() => {
                    const cta = buildPackageInquiryUrl(content.brandName, pkg.name, content.whatsappNumber, content.email, content.authUrl);
                    const cls = `relative inline-flex h-12 w-full items-center justify-center border text-xs font-black uppercase tracking-[0.2em] transition-all overflow-hidden ${isPro ? "bg-[#2EC8D8] border-[#2EC8D8] text-[#07090F] hover:bg-white hover:border-white shadow-[0_0_20px_rgba(46,200,216,0.2)]" : "bg-transparent border-[#1E293B] text-white hover:border-[#2EC8D8]/50 hover:bg-[#2EC8D8]/10"}`;
                    return cta.external
                      ? <a href={cta.href} target="_blank" rel="noreferrer" className={cls}>Koça Yaz</a>
                      : <Link href={cta.href} className={cls}>Koça Yaz</Link>;
                  })()}
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
export function Theme5FAQ({ content, variant }: SectionRendererProps) {
  return (
    <section data-landing-section="faq" className="py-24 px-6 lg:px-12 relative border-y border-[#2EC8D8]/20">
      <div className="mx-auto max-w-[1400px]">
        <div data-section-heading className="mb-16">
          <div className="inline-flex items-center gap-2 mb-4">
            <span className="w-8 h-px bg-[#9D4EDD]" />
            <span className="text-[10px] font-bold text-[#9D4EDD] tracking-[0.2em] uppercase">Bilgi Bankası</span>
          </div>
          <h2 className="text-4xl md:text-5xl font-black text-white uppercase tracking-tighter">{content.landingTexts?.faqTitle || "Sık Sorulan Sorular"}</h2>
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
    <footer data-landing-section="contact" id="iletisim" className="mt-auto border-t border-[#2EC8D8]/20 bg-[#07090F] pt-16 pb-8 px-6 lg:px-12 relative overflow-hidden">
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:32px_32px] opacity-30" />

      <div className="mx-auto max-w-[1400px] relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-10">
        <div>
          <div className="text-2xl font-black tracking-widest text-white uppercase mb-2" style={{ WebkitTextStroke: "0.5px #2EC8D8" }}>
            {content.brandName}
          </div>
          <p className="text-xs font-bold text-[#8B9BB4] uppercase tracking-[0.2em]">{content.landingTexts?.footerTagline || "Sistem Versiyonu 2.0.4"}</p>
        </div>

        <div className="flex flex-wrap items-center gap-8 text-[11px] font-bold uppercase tracking-[0.2em] text-[#8B9BB4]">
          <a href={`mailto:${content.email}`} className="hover:text-[#2EC8D8] transition-colors flex items-center gap-2"><Mail size={14} className="text-[#2EC8D8]/50" /> İrtibat Teli</a>
          {content.whatsappNumber && <a href={content.whatsappUrl} target="_blank" rel="noreferrer" className="hover:text-[#2EC8D8] transition-colors flex items-center gap-2"><MessageCircle size={14} className="text-[#2EC8D8]/50" /> Destek Ağı</a>}
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
        <SystemHowSection content={content} variant={1} />
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
    system: SystemHowSection,
    packages: Theme5Packages,
    faq: Theme5FAQ,
    contact: Theme5Contact,
  },
};
