"use client";

import Link from "next/link";
import { MessageCircle, ArrowRight, CheckCircle2, Heart, Award } from "lucide-react";
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
  const variant = resolveNavbarVariant(content.landingConfig?.navbarVariant, "theme-3");
  return <UnifiedNavbar content={content} variant={variant} />;
}

/* ─── Hero Section ─── */
export function Theme3Hero({ content, variant }: SectionRendererProps) {
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
    <section data-landing-section="hero" className="relative min-h-[100svh] overflow-hidden bg-white">
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
      <HeroFullscreenImage content={content} themeBg="#ffffff" />

      <div className={`relative z-10 mx-auto max-w-7xl px-6 sm:px-8 pt-36 pb-16 md:pt-44 md:pb-24 min-h-[100svh] flex items-center justify-center text-center`}>
        {/* Text */}
        <div className={`max-w-4xl w-full ${textAlign === "center" ? "mx-auto text-center" : textAlign === "left" ? "mr-auto text-left" : "ml-auto text-right"} ${containerClass}`}>
          <div className="inline-flex items-center justify-center gap-2 px-4 py-2 rounded-full bg-white border border-slate-200 mb-8 shadow-sm">
            <span className="flex h-2 w-2 rounded-full bg-green-400 animate-pulse" />
            <span className="text-sm font-bold text-slate-700 md:text-slate-700 tracking-tight">Kişiye Özel Evrimi Başlat</span>
          </div>

          {texts?.heroHeadline ? (
            <h1 className={`text-[44px] md:text-[56px] lg:text-[72px] ${weight ? '' : 'font-black'} leading-[1.05] tracking-tight drop-shadow-sm ${headlineColor || headlineBg ? '' : 'text-white md:text-slate-900'}`} style={{ color: headlineColor || undefined, fontWeight: weight, ...effectStyle }}>
              {headlineBg ? (
                <span style={{ backgroundColor: headlineBg, padding: "0.05em 0.25em", display: "inline-block", boxDecorationBreak: "clone", WebkitBoxDecorationBreak: "clone" }}>{texts.heroHeadline}</span>
              ) : headlineColor ? (
                <span>{texts.heroHeadline}</span>
              ) : (
                <span className="text-teal-400 md:text-teal-600">{texts.heroHeadline}</span>
              )}
            </h1>
          ) : (
            <h1 className={`text-[44px] md:text-[56px] lg:text-[72px] ${weight ? '' : 'font-black'} leading-[1.05] tracking-tight drop-shadow-sm ${headlineColor || headlineBg ? '' : 'text-white md:text-slate-900'}`} style={{ color: headlineColor || undefined, fontWeight: weight, ...effectStyle }}>
              {headlineBg ? (
                <span style={{ backgroundColor: headlineBg, padding: "0.05em 0.25em", display: "inline-block", boxDecorationBreak: "clone", WebkitBoxDecorationBreak: "clone" }}>Potansiyelinizin en güçlü haline ulaşın.</span>
              ) : (
                <>
                  Potansiyelinizin
                  <br />
                  en <span className="text-teal-400 md:text-teal-600 relative inline-block">
                    güçlü
                    <svg className="absolute -bottom-2 left-0 w-full h-3 text-teal-300 -z-10 hidden md:block" viewBox="0 0 100 20" preserveAspectRatio="none"><path d="M0 10 Q 25 20 50 10 T 100 10" fill="none" stroke="currentColor" strokeWidth="6" strokeLinecap="round" /></svg>
                  </span>
                  <br />  haline ulaşın.
                </>
              )}
            </h1>
          )}

          <p className={`mt-8 max-w-xl leading-relaxed font-medium ${subtitleColor ? '' : 'text-white/80 md:text-slate-600'} ${subtitleScale === 1 ? 'text-xl' : ''}`} style={{ color: subtitleColor || undefined, textShadow: subtitleBg ? undefined : "0 1px 10px rgba(0,0,0,0.4)", fontSize: subtitleScale !== 1 ? `${subtitleScale * 1.25}rem` : undefined }}>
            {subtitleBg ? (
              <span style={{ backgroundColor: subtitleBg, padding: "0.15em 0.4em", display: "inline-block", boxDecorationBreak: "clone", WebkitBoxDecorationBreak: "clone" }}>
                {texts?.heroSubtitle || content.bio || "Hayallerinizdeki fiziğe ulaşmak artık zor değil. Sizi motive eden, sizi anlayan ve destekleyen bir koçluk ekosistemi."}
              </span>
            ) : (
              texts?.heroSubtitle || content.bio || "Hayallerinizdeki fiziğe ulaşmak artık zor değil. Sizi motive eden, sizi anlayan ve destekleyen bir koçluk ekosistemi."
            )}
          </p>

          <div className="mt-12 flex flex-col sm:flex-row items-center justify-center gap-4">
            <a href="#paketler" className="inline-flex h-16 w-full sm:w-auto items-center justify-center rounded-full bg-teal-600 px-10 text-lg font-bold text-white shadow-xl shadow-teal-600/20 transition-all hover:-translate-y-1 hover:shadow-teal-600/30 group">
              {texts?.ctaPrimaryText || "Programları İncele"}
              <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
            </a>
            {content.whatsappNumber ? (
              <a href={content.whatsappUrl} target="_blank" rel="noreferrer" className="inline-flex h-16 w-full sm:w-auto items-center justify-center gap-2 rounded-full bg-white px-10 text-lg font-bold text-slate-700 shadow-md ring-1 ring-slate-200 transition-all hover:bg-slate-50 hover:shadow-lg">
                <MessageCircle size={20} className="text-teal-600" />
                {texts?.ctaSecondaryText || "WhatsApp ile Başla"}
              </a>
            ) : (
              <Link href={content.authUrl} className="inline-flex h-16 w-full sm:w-auto items-center justify-center gap-2 rounded-full bg-white px-10 text-lg font-bold text-slate-700 shadow-md ring-1 ring-slate-200 transition-all hover:bg-slate-50 hover:shadow-lg">
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
export function Theme3Stats({ content, variant }: SectionRendererProps) {
  const texts = content.landingTexts;
  return (
    <section data-landing-section="stats" id="tanitim" className="py-20 px-6 sm:px-8">
      <div className="max-w-[1400px] mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 text-center divide-y md:divide-y-0 md:divide-x divide-slate-200">
          <div className="pt-8 md:pt-0">
            <div className="text-5xl lg:text-7xl font-black text-slate-900 tracking-tighter">{texts?.stat1Value || `${formatCount(content.studentCount || 500)}+`}</div>
            <div className="mt-4 text-xs font-bold text-teal-600 uppercase tracking-[0.2em]">{texts?.stat1Label || "Aktif Öğrenci"}</div>
          </div>
          <div className="pt-8 md:pt-0">
            <div className="text-5xl lg:text-7xl font-black text-slate-900 tracking-tighter">{texts?.stat2Value || `${content.transformationCount || 10}+`}</div>
            <div className="mt-4 text-xs font-bold text-teal-600 uppercase tracking-[0.2em]">{texts?.stat2Label || "Başarılı Dönüşüm"}</div>
          </div>
          <div className="pt-8 md:pt-0">
            <div className="text-5xl lg:text-7xl font-black text-slate-900 tracking-tighter">{texts?.stat3Value || "5+"}</div>
            <div className="mt-4 text-xs font-bold text-teal-600 uppercase tracking-[0.2em]">{texts?.stat3Label || "Yıl Deneyim"}</div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ─── Transformations Section ─── */
export function Theme3Transformations({ content, variant }: SectionRendererProps) {
  if (content.transformations.length === 0) return null;
  return (
    <section data-landing-section="transformations" id="donusumler" className="px-6 pb-24 sm:px-8">
      <div className="mx-auto max-w-6xl">
        <div data-section-heading className="text-center mb-16">
          <h2 className="text-[40px] font-black text-slate-900 tracking-tight">{content.landingTexts?.transformationsTitle || <>Onlar başardı. <br className="md:hidden" /> <span className="text-teal-600">Sıra sizde.</span></>}</h2>
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
    <section data-landing-section="packages" id="paketler" className="px-6 pb-32 pt-12 sm:px-8">
      <div className="mx-auto max-w-6xl">
        <div data-section-heading className="text-center mb-20">
          <h2 className="text-[40px] font-black text-slate-900 tracking-tight">{content.landingTexts?.packagesTitle || "Size en uygun program."}</h2>
          <p className="mt-4 text-lg text-slate-500 font-medium">{content.landingTexts?.packagesSubtitle || "Hedeflerinize göre tasarlanmış koçluk modelleri."}</p>
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

                {(() => {
                  const cta = buildPackageInquiryUrl(content.brandName, pkg.name, content.whatsappNumber, content.email, content.authUrl);
                  const cls = `mt-auto inline-flex h-14 w-full items-center justify-center rounded-full text-lg font-bold transition-all ${isPro ? "bg-white text-teal-700 hover:bg-teal-50 shadow-lg" : "bg-slate-900 text-white hover:bg-slate-800 shadow-lg"}`;
                  return cta.external
                    ? <a href={cta.href} target="_blank" rel="noreferrer" className={cls}>Koça Yaz</a>
                    : <Link href={cta.href} className={cls}>Koça Yaz</Link>;
                })()}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

/* ─── FAQ Section ─── */
export function Theme3FAQ({ content, variant }: SectionRendererProps) {
  return (
    <section data-landing-section="faq" className="px-6 pb-24 sm:px-8">
      <div className="mx-auto max-w-6xl">
        <div data-section-heading className="text-center mb-16">
          <h2 className="text-[40px] font-black text-slate-900 tracking-tight">{content.landingTexts?.faqTitle || <>Sık Sorulan <span className="text-teal-600">Sorular</span></>}</h2>
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
    <footer data-landing-section="contact" id="iletisim" className="mt-auto border-t border-slate-200 bg-white py-12 px-6">
      <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-6 sm:flex-row sm:px-8">
        <div className="text-2xl font-black tracking-tight text-slate-800">
          {content.brandName}
        </div>
        <div className="flex items-center gap-8">
          <a href={`mailto:${content.email}`} className="text-sm font-bold text-slate-500 transition-colors hover:text-teal-700">Email İletişim</a>
          {content.whatsappNumber && <a href={content.whatsappUrl} target="_blank" rel="noreferrer" className="text-sm font-bold text-slate-500 transition-colors hover:text-teal-700">WhatsApp Destek</a>}
          <Link href={content.authUrl} className="text-sm font-bold text-slate-500 transition-colors hover:text-teal-700">Katılımcı Girişi</Link>
        </div>
        {content.socialLinks && (
          <SocialIcons links={content.socialLinks} iconClassName="w-5 h-5 text-slate-400 hover:text-teal-600 transition-colors" />
        )}
        <p className="text-sm font-semibold text-slate-400">&copy; {new Date().getFullYear()} {content.landingTexts?.footerTagline || ""}</p>
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
        <SystemHowSection content={content} variant={1} />
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
    system: SystemHowSection,
    packages: Theme3Packages,
    faq: Theme3FAQ,
    contact: Theme3Contact,
  },
};
