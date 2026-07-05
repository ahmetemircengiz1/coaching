"use client";

import Link from "next/link";
import { MessageCircle, ArrowRight, Play, LineChart, Target, Utensils, Zap } from "lucide-react";
import { useMemo, useState, useEffect, useRef, useId } from "react";
import { UnifiedNavbar } from "../shared/UnifiedNavbar";
import { SystemHowSection } from "../shared/SystemHowSection";
import { resolveNavbarVariant } from "../config";
import { formatCount, formatPackagePrice, withFallbackFeatures, buildPackageInquiryUrl } from "../helpers";
import { TransformationCarousel } from "../TransformationCarousel";
import type { LandingThemeComponentProps, LandingPackage, LandingThemeContent } from "../types";
import { getTextEffectStyle } from "../types";
import type { SectionRendererProps, ThemeLayout } from "../section-types";
import { FadeInScroll } from "../FadeInScroll";
import { FAQAccordion } from "../FAQSection";
import { SocialIcons } from "../SocialIcons";
import { HeroFullscreenImage, hasHeroImage } from "../HeroBackground";

/* ─── Theme 4 – "Warm Minimal V2 (Product Tour)" ─── */

function normalizePackages(packages: LandingPackage[]) {
  if (packages.length > 0) return packages.slice(0, 3);
  return [
    { id: "starter", name: "Standart", description: "", duration: 12, price: 3990, currency: "TRY", features: ["Kişiye özel program", "Haftalık check-in", "WhatsApp desteği"] },
    { id: "pro", name: "Kapsamlı", description: "", duration: 24, price: 6990, currency: "TRY", features: ["Kişiye özel program", "Haftalık check-in", "WhatsApp desteği", "Beslenme planı"] },
    { id: "elite", name: "Elit", description: "", duration: 12, price: 5990, currency: "TRY", features: ["Kişiye özel program", "Haftalık check-in", "Sınırsız iletişim", "Beslenme planı"] },
  ] satisfies LandingPackage[];
}

function useTourStep(stepCount: number) {
  const [activeStep, setActiveStep] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleScroll = () => {
      if (!containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      const progress = -rect.top / (rect.height - window.innerHeight);
      let step = Math.floor(progress * stepCount);
      if (step < 0) step = 0;
      if (step >= stepCount) step = stepCount - 1;
      setActiveStep(step);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, [stepCount]);

  return { activeStep, containerRef };
}

/* ─── Background ─── */
function Theme4Background() {
  return (
    <div className="pointer-events-none fixed inset-0 z-0 flex justify-center overflow-hidden">
      <div className="w-full max-w-[1400px] h-full border-x border-[#EAE4D9]/30 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:100px_100px]" />
      <div className="absolute top-0 w-full h-[500px] bg-gradient-to-b from-[#FBF9F6] to-transparent" />
    </div>
  );
}

/* ─── Navbar ─── */
export function Theme4Navbar({ content }: { content: LandingThemeContent }) {
  const variant = resolveNavbarVariant(content.landingConfig?.navbarVariant, "theme-4");
  return <UnifiedNavbar content={content} variant={variant} />;
}

/* ─── Hero Section ─── */
export function Theme4Hero({ content, variant }: SectionRendererProps) {
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
    <section data-landing-section="hero" className="relative min-h-[100svh] overflow-hidden bg-[#FAF7F2]">
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
      <HeroFullscreenImage content={content} themeBg="#FAF7F2" />

      <div className={`relative z-10 mx-auto max-w-7xl px-6 pt-40 pb-24 md:pt-44 md:pb-32 min-h-[100svh] flex items-center justify-center text-center`}>
        {/* Text */}
        <div className={`max-w-4xl w-full ${textAlign === "center" ? "mx-auto items-center text-center" : textAlign === "left" ? "mr-auto items-start text-left" : "ml-auto items-end text-right"} flex flex-col ${containerClass}`}>
          <FadeInScroll delay={200} duration={1200} direction="up" distance={30}>
            {texts?.heroHeadline ? (
              <h1 className={`text-[10vw] md:text-6xl lg:text-7xl ${headlineColor || headlineBg ? '' : 'text-white md:text-[#2C2A29]'} mb-6 leading-[1.05] tracking-tight ${weight ? '' : 'font-medium'}`} style={{ fontFamily: "var(--font-playfair), serif", color: headlineColor || undefined, fontWeight: weight, ...effectStyle }}>
                {headlineBg ? (
                  <span style={{ backgroundColor: headlineBg, padding: "0.1em 0.3em", display: "inline-block", boxDecorationBreak: "clone", WebkitBoxDecorationBreak: "clone" }}>{texts.heroHeadline}</span>
                ) : headlineColor ? (
                  <span className="italic">{texts.heroHeadline}</span>
                ) : (
                  <span className="italic text-[#dba882] md:text-[#8C6D53]">{texts.heroHeadline}</span>
                )}
              </h1>
            ) : (
              <h1 className={`text-[10vw] md:text-6xl lg:text-7xl text-white md:text-[#2C2A29] mb-6 leading-[1.05] tracking-tight ${weight ? '' : 'font-medium'}`} style={{ fontFamily: "var(--font-playfair), serif", fontWeight: weight, ...effectStyle }}>
                Koçluk deneyimini <br className="hidden md:block" />
                <span className="italic text-[#dba882] md:text-[#8C6D53]">yeniden </span>
                tasarladık.
              </h1>
            )}
          </FadeInScroll>

          <FadeInScroll delay={400} duration={1200} direction="up" distance={30}>
            <p className={`mt-6 max-w-xl leading-relaxed ${subtitleColor ? '' : 'text-white/80 md:text-[#7C726A]'} ${subtitleScale === 1 ? 'text-lg md:text-xl' : ''}`} style={{ color: subtitleColor || undefined, textShadow: subtitleBg ? undefined : "0 1px 10px rgba(0,0,0,0.4)", fontSize: subtitleScale !== 1 ? `${subtitleScale * 1.25}rem` : undefined }}>
              {subtitleBg ? (
                <span style={{ backgroundColor: subtitleBg, padding: "0.15em 0.4em", display: "inline-block", boxDecorationBreak: "clone", WebkitBoxDecorationBreak: "clone" }}>
                  {texts?.heroSubtitle || content.bio || "Fiziksel gelişiminizi sanata dönüştürüyoruz. Sadece bir program değil, tüm hedeflerinizi barındıran akıllı bir ekosistem."}
                </span>
              ) : (
                texts?.heroSubtitle || content.bio || "Fiziksel gelişiminizi sanata dönüştürüyoruz. Sadece bir program değil, tüm hedeflerinizi barındıran akıllı bir ekosistem."
              )}
            </p>
          </FadeInScroll>

          <FadeInScroll delay={600} duration={1000} direction="up">
            <div className="mt-12 flex flex-col sm:flex-row items-start gap-4">
              <a href="#paketler" className="inline-flex h-14 w-full sm:w-auto items-center justify-center rounded-2xl bg-[#D64C31] px-8 text-sm font-medium text-white shadow-[0_8px_30px_rgba(214,76,49,0.3)] transition-all hover:-translate-y-1 hover:shadow-[0_12px_40px_rgba(214,76,49,0.4)] group">
                {texts?.ctaPrimaryText || "Sistemi Keşfet"}
                <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
              </a>
              {content.whatsappNumber ? (
                <a href={content.whatsappUrl} target="_blank" rel="noreferrer" className="inline-flex h-14 w-full sm:w-auto items-center justify-center gap-2 rounded-2xl bg-white border border-[#EAE4D9] px-8 text-sm font-medium text-[#2C2A29] transition-all hover:bg-[#FBF9F6] shadow-sm hover:shadow-md">
                  <MessageCircle className="w-4 h-4 text-[#8C6D53]" />
                  {texts?.ctaSecondaryText || "WhatsApp ile Başla"}
                </a>
              ) : (
                <Link href={content.authUrl} className="inline-flex h-14 w-full sm:w-auto items-center justify-center gap-2 rounded-2xl bg-white border border-[#EAE4D9] px-8 text-sm font-medium text-[#2C2A29] transition-all hover:bg-[#FBF9F6] shadow-sm hover:shadow-md">
                  <Play className="w-4 h-4 fill-[#8C6D53] text-[#8C6D53]" />
                  {texts?.ctaSecondaryText || "Nasıl Çalışır?"}
                </Link>
              )}
            </div>
          </FadeInScroll>
        </div>
      </div>
    </section>
  );
}

/* ─── Interactive Tour (Theme-specific, monolithic mode only) ─── */
function Theme4Tour({ content }: { content: LandingThemeContent }) {
  const { activeStep, containerRef } = useTourStep(3);
  return (
    <section data-landing-section="hero" id="hakkimizda" ref={containerRef} className="relative h-[400vh] bg-[#FBF9F6] z-20">
      <div className="sticky top-0 h-screen w-full overflow-hidden flex flex-col md:flex-row items-center justify-center max-w-[1400px] mx-auto px-6">
        <div className="w-full md:w-[45%] h-1/2 md:h-full flex flex-col justify-center pr-0 md:pr-12 lg:pr-24 z-10 relative mt-16 md:mt-0">
          <div className="absolute left-0 w-1 h-32 bg-[#EAE4D9] rounded-full hidden md:block" />
          <div className="absolute left-0 w-1 bg-[#D64C31] rounded-full transition-all duration-500 hidden md:block" style={{ height: '33%', top: `${activeStep * 33.33}%` }} />
          <div className="pl-0 md:pl-8 transition-opacity duration-500">
            <span className="inline-flex items-center gap-2 text-[11px] font-bold text-[#D64C31] uppercase tracking-[0.2em] mb-4">Adım 0{activeStep + 1}</span>
            <h2 className="text-3xl md:text-5xl font-medium text-[#2C2A29] leading-[1.15] mb-6" style={{ fontFamily: "var(--font-playfair), serif" }}>
              {activeStep === 0 && "Kişiselleştirilmiş İdman Mimarisi"}
              {activeStep === 1 && "Makro Bazlı Beslenme Düzeni"}
              {activeStep === 2 && "Eksiksiz İlerleme Analizi"}
            </h2>
            <p className="text-base md:text-lg text-[#7C726A] leading-relaxed">
              {activeStep === 0 && "Seviyeniz, ekipmanınız ve hedefleriniz algoritma tarafından analiz edilir. Size özel, her hareketi videolu, set ve tempo detayları belirlenmiş programınız uygulamaya düşer."}
              {activeStep === 1 && "Hedefinize uygun kalori ve makro dağılımları. Sıkıcı diyetler yerine esnek, damak tadınıza uygun ve sürdürülebilir beslenme protokolleri."}
              {activeStep === 2 && "Gelişim asla tesadüf değildir. Haftalık fotoğraf kayıtları, ölçüm grafikleri ve check-in sistemi ile formunuzdaki en ufak değişimi milimetrik takip edin."}
            </p>
          </div>
        </div>

        <div className="w-full md:w-[55%] h-1/2 md:h-full flex items-center justify-center relative perspective-[2000px]">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] bg-gradient-to-br from-[#D64C31]/5 to-[#8C6D53]/10 rounded-full blur-3xl transition-transform duration-1000 scale-[1.2]" />
          <div className="relative w-full max-w-[550px] aspect-[4/3] md:aspect-[16/10] bg-white/60 backdrop-blur-2xl rounded-3xl border border-white/50 shadow-[0_20px_50px_rgba(0,0,0,0.05)] overflow-hidden transition-all duration-1000 rotate-y-[-5deg] rotate-x-[5deg] hover:rotate-y-0 hover:rotate-x-0 group">
            <div className="h-10 bg-white/80 border-b border-[#EAE4D9]/50 flex items-center px-4 gap-2">
              <div className="w-2.5 h-2.5 rounded-full bg-black/10" />
              <div className="w-2.5 h-2.5 rounded-full bg-black/10" />
              <div className="w-2.5 h-2.5 rounded-full bg-black/10" />
            </div>
            <div className="relative w-full h-[calc(100%-40px)] p-6 z-0 bg-gradient-to-br from-[#f8f9fa] to-white flex gap-6">
              <div className="w-16 h-full flex flex-col gap-4 border-r border-[#EAE4D9]/50 pr-4">
                <div className="w-8 h-8 rounded-lg bg-[#EAE4D9] mb-4" />
                <div className={`w-8 h-8 rounded-lg transition-colors duration-500 ${activeStep === 0 ? "bg-[#D64C31]/20 border border-[#D64C31]/30" : "bg-transparent border border-[#EAE4D9]"}`} />
                <div className={`w-8 h-8 rounded-lg transition-colors duration-500 ${activeStep === 1 ? "bg-[#D64C31]/20 border border-[#D64C31]/30" : "bg-transparent border border-[#EAE4D9]"}`} />
                <div className={`w-8 h-8 rounded-lg transition-colors duration-500 ${activeStep === 2 ? "bg-[#D64C31]/20 border border-[#D64C31]/30" : "bg-transparent border border-[#EAE4D9]"}`} />
              </div>
              <div className="flex-1 flex flex-col gap-4 relative overflow-hidden">
                <div className="absolute inset-0 transition-transform duration-500 ease-in-out" style={{ transform: `translateY(-${activeStep * 100}%)` }}>
                  <div className="w-full h-full flex flex-col gap-4 p-2">
                    <div className="w-1/2 h-6 bg-[#EAE4D9] rounded-md" />
                    <div className="flex gap-4">
                      <div className="flex-1 h-24 bg-white border border-[#EAE4D9] rounded-xl shadow-sm p-4 flex flex-col justify-between">
                        <div className="w-1/3 h-3 bg-[#EAE4D9] rounded" />
                        <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center"><Zap className="w-5 h-5 text-blue-500" /></div>
                      </div>
                      <div className="w-1/3 h-24 bg-blue-50 border border-blue-100 rounded-xl flex items-center justify-center">
                        <div className="w-16 h-16 rounded-full border-4 border-blue-200 border-t-blue-500" />
                      </div>
                    </div>
                    <div className="flex-1 bg-white border border-[#EAE4D9] rounded-xl shadow-sm overflow-hidden flex flex-col">
                      <div className="h-8 border-b border-[#EAE4D9] bg-[#f8f9fa]" />
                      <div className="p-4 space-y-3">
                        <div className="w-full h-8 bg-[#f8f9fa] rounded" />
                        <div className="w-full h-8 bg-[#f8f9fa] rounded" />
                        <div className="w-3/4 h-8 bg-[#f8f9fa] rounded" />
                      </div>
                    </div>
                  </div>
                  <div className="w-full h-full flex flex-col gap-4 p-2">
                    <div className="w-1/2 h-6 bg-[#EAE4D9] rounded-md" />
                    <div className="flex gap-4 items-end">
                      <div className="w-1/4 h-32 bg-green-50 border border-green-100 rounded-xl relative overflow-hidden">
                        <div className="absolute bottom-0 w-full h-[60%] bg-green-200" />
                      </div>
                      <div className="flex-1 space-y-2">
                        <div className="w-full h-10 bg-white border border-[#EAE4D9] rounded-lg flex items-center px-4"><Utensils className="w-4 h-4 text-green-600 mr-2" /><div className="w-1/2 h-2 bg-[#EAE4D9] rounded" /></div>
                        <div className="w-full h-10 bg-white border border-[#EAE4D9] rounded-lg flex items-center px-4"><Utensils className="w-4 h-4 text-orange-600 mr-2" /><div className="w-2/3 h-2 bg-[#EAE4D9] rounded" /></div>
                        <div className="w-full h-10 bg-white border border-[#EAE4D9] rounded-lg flex items-center px-4"><Utensils className="w-4 h-4 text-blue-600 mr-2" /><div className="w-1/3 h-2 bg-[#EAE4D9] rounded" /></div>
                      </div>
                    </div>
                    <div className="flex-1 bg-white border border-[#EAE4D9] rounded-xl p-4 flex gap-4">
                      <div className="w-24 h-24 bg-[#EAE4D9] rounded-lg" />
                      <div className="flex-1 space-y-2 py-2">
                        <div className="w-1/2 h-4 bg-[#EAE4D9] rounded" />
                        <div className="w-full h-2 bg-[#f8f9fa] rounded" />
                        <div className="w-full h-2 bg-[#f8f9fa] rounded" />
                      </div>
                    </div>
                  </div>
                  <div className="w-full h-full flex flex-col gap-4 p-2">
                    <div className="w-1/2 h-6 bg-[#EAE4D9] rounded-md" />
                    <div className="w-full h-32 bg-white border border-[#EAE4D9] rounded-xl flex items-end p-4 gap-2">
                      {[30, 45, 40, 60, 50, 80, 75, 100].map((h, i) => (
                        <div key={i} className="flex-1 bg-indigo-500/20 rounded-t-sm" style={{ height: `${h}%` }} />
                      ))}
                    </div>
                    <div className="flex gap-4 h-full flex-1">
                      <div className="flex-1 bg-white border border-[#EAE4D9] rounded-xl p-4 flex flex-col items-center justify-center">
                        <div className="text-3xl font-bold text-[#2C2A29]">-4.2</div>
                        <div className="w-1/2 h-2 bg-[#EAE4D9] rounded mt-2" />
                      </div>
                      <div className="flex-1 bg-white border border-[#EAE4D9] rounded-xl p-4 flex flex-col items-center justify-center">
                        <div className="text-3xl font-bold text-[#D64C31]">+12</div>
                        <div className="w-1/2 h-2 bg-[#EAE4D9] rounded mt-2" />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ─── Stats Section ─── */
export function Theme4Stats({ content, variant }: SectionRendererProps) {
  return (
    <section data-landing-section="stats" className="py-20 px-6 bg-white border-y border-[#EAE4D9] z-20 relative">
      <div className="max-w-[1400px] mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 text-center divide-y md:divide-y-0 md:divide-x divide-[#EAE4D9]">
          <FadeInScroll delay={100} duration={800}>
            <div className="pt-8 md:pt-0">
              <div className="text-5xl lg:text-7xl text-[#2C2A29] font-medium tracking-tighter" style={{ fontFamily: "var(--font-playfair), serif" }}>{content.landingTexts?.stat1Value || `${formatCount(content.studentCount || 1000)}+`}</div>
              <div className="mt-4 text-xs font-bold text-[#D64C31] uppercase tracking-[0.2em]">{content.landingTexts?.stat1Label || "Aktif Öğrenci"}</div>
            </div>
          </FadeInScroll>
          <FadeInScroll delay={300} duration={800}>
            <div className="pt-8 md:pt-0">
              <div className="text-5xl lg:text-7xl text-[#2C2A29] font-medium tracking-tighter" style={{ fontFamily: "var(--font-playfair), serif" }}>{content.landingTexts?.stat2Value || `${content.transformationCount || 10}+`}</div>
              <div className="mt-4 text-xs font-bold text-[#D64C31] uppercase tracking-[0.2em]">{content.landingTexts?.stat2Label || "Başarılı Dönüşüm"}</div>
            </div>
          </FadeInScroll>
          <FadeInScroll delay={500} duration={800}>
            <div className="pt-8 md:pt-0">
              <div className="text-5xl lg:text-7xl text-[#2C2A29] font-medium tracking-tighter" style={{ fontFamily: "var(--font-playfair), serif" }}>{content.landingTexts?.stat3Value || "5+"}</div>
              <div className="mt-4 text-xs font-bold text-[#D64C31] uppercase tracking-[0.2em]">{content.landingTexts?.stat3Label || "Yıl Deneyim"}</div>
            </div>
          </FadeInScroll>
        </div>
      </div>
    </section>
  );
}

/* ─── Transformations Section ─── */
export function Theme4Transformations({ content, variant }: SectionRendererProps) {
  if (content.transformations.length === 0) return null;
  return (
    <section data-landing-section="transformations" id="donusumler" className="py-32 px-6 bg-[#FBF9F6] relative z-20">
      <div className="mx-auto max-w-[1400px]">
        <FadeInScroll delay={200} duration={1200} direction="up" distance={20}>
          <div data-section-heading className="mb-20 text-center max-w-2xl mx-auto">
            <h2 className="text-4xl md:text-6xl text-[#2C2A29] mb-6 leading-tight" style={{ fontFamily: "var(--font-playfair), serif" }}>{content.landingTexts?.transformationsTitle || <>Gerçek <span className="italic text-[#8C6D53]">Eserler.</span></>}</h2>
            <p className="text-[#7C726A] text-lg">Platformumuzu kullananların ulaştığı kusursuz formlar, disiplin ve bilimin buluştuğu noktadaki kanıtlar.</p>
          </div>
        </FadeInScroll>

        <FadeInScroll delay={500} duration={1500} direction="up" distance={40}>
          <div className="mx-auto max-w-2xl">
            <TransformationCarousel items={content.transformations} variant="warm" />
          </div>
        </FadeInScroll>
      </div>
    </section>
  );
}

/* ─── Packages Section ─── */
export function Theme4Packages({ content, variant }: SectionRendererProps) {
  const packages = useMemo(() => normalizePackages(content.packages), [content.packages]);
  return (
    <section data-landing-section="packages" id="paketler" className="py-32 px-6 bg-white border-t border-[#EAE4D9] relative z-20">
      <div className="mx-auto max-w-[1400px]">
        <FadeInScroll delay={200} duration={1200} direction="up" distance={20}>
          <div data-section-heading className="text-center mb-20 max-w-2xl mx-auto">
            <span className="inline-flex items-center gap-2 text-[11px] font-bold text-[#D64C31] uppercase tracking-[0.2em] mb-4">Erken Erişim</span>
            <h2 className="text-4xl md:text-5xl text-[#2C2A29] mb-4" style={{ fontFamily: "var(--font-playfair), serif" }}>{content.landingTexts?.packagesTitle || <>Sisteme <span className="italic text-[#8C6D53]">Dahil Ol.</span></>}</h2>
          </div>
        </FadeInScroll>

        <div className="grid gap-8 md:grid-cols-3 items-stretch max-w-6xl mx-auto">
          {packages.map((pkg, i) => {
            const isPro = i === 1;
            return (
              <FadeInScroll key={pkg.id} delay={i * 300} duration={1200} direction="up" distance={30}>
                <article className={`h-full flex flex-col p-10 transition-all duration-700 relative overflow-hidden rounded-3xl ${isPro ? "bg-[#2C2A29] text-[#FDFBF7] shadow-[0_20px_50px_rgba(0,0,0,0.15)] scale-[1.02] z-10" : "bg-[#FBF9F6] text-[#2C2A29] border border-[#EAE4D9] hover:bg-white hover:shadow-xl"}`}>

                  {isPro && (
                    <div className="absolute top-0 right-0 p-8 opacity-10 pointer-events-none">
                      <Target className="w-32 h-32" />
                    </div>
                  )}

                  <div className="mb-10 relative z-10">
                    <div className="flex justify-between items-start mb-6">
                      <h3 className={`text-sm font-bold tracking-[0.2em] uppercase ${isPro ? "text-[#EAE4D9]" : "text-[#D64C31]"}`}>{pkg.name}</h3>
                      {isPro && <span className="px-3 py-1 bg-[#D64C31] text-white text-[10px] uppercase font-bold tracking-widest rounded-full">Pro</span>}
                    </div>
                    <div className="flex items-baseline">
                      <span className="text-5xl md:text-6xl tracking-tighter font-medium" style={{ fontFamily: "var(--font-playfair), serif" }}>{formatPackagePrice(pkg.price, pkg.currency)}</span>
                    </div>
                    <p className={`mt-2 text-xs font-medium uppercase tracking-widest ${isPro ? "text-[#EAE4D9]/50" : "text-[#7C726A]"}`}>/ Dönem</p>
                  </div>

                  <div className={`h-px w-full mb-10 ${isPro ? "bg-[#EAE4D9]/10" : "bg-[#EAE4D9]"}`} />

                  <ul className="flex-1 space-y-6 mb-12 relative z-10">
                    {withFallbackFeatures(pkg.features).map((f, idx) => (
                      <li key={idx} className="flex items-start gap-4">
                        <div className={`mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full ${isPro ? "bg-[#D64C31]" : "bg-[#8C6D53]"}`} />
                        <span className={`text-[15px] font-medium leading-relaxed ${isPro ? "text-[#EAE4D9]" : "text-[#4A3C31]"}`}>{f}</span>
                      </li>
                    ))}
                  </ul>

                  {(() => {
                    const cta = buildPackageInquiryUrl(content.brandName, pkg.name, content.whatsappNumber, content.email, content.authUrl);
                    const cls = `relative z-10 mt-auto inline-flex h-14 w-full items-center justify-center rounded-xl text-[13px] font-bold uppercase tracking-widest transition-all ${isPro ? "bg-white text-[#2C2A29] hover:bg-[#EAE4D9] hover:shadow-[0_0_20px_rgba(255,255,255,0.3)]" : "bg-transparent border border-[#EAE4D9] text-[#2C2A29] hover:bg-[#2C2A29] hover:text-white"}`;
                    return cta.external
                      ? <a href={cta.href} target="_blank" rel="noreferrer" className={cls}>Koça Yaz</a>
                      : <Link href={cta.href} className={cls}>Koça Yaz</Link>;
                  })()}
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
export function Theme4FAQ({ content, variant }: SectionRendererProps) {
  return (
    <section data-landing-section="faq" className="py-24 px-6 bg-[#FBF9F6] relative z-20">
      <div className="mx-auto max-w-[1400px]">
        <FadeInScroll delay={200} duration={1200} direction="up" distance={20}>
          <div data-section-heading className="text-center mb-16 max-w-2xl mx-auto">
            <h2 className="text-4xl md:text-5xl text-[#2C2A29] mb-4" style={{ fontFamily: "var(--font-playfair), serif" }}>{content.landingTexts?.faqTitle || <>Sık Sorulan <span className="italic text-[#8C6D53]">Sorular</span></>}</h2>
          </div>
        </FadeInScroll>
        <FAQAccordion
          variant={variant as 1 | 2}
          accentColor="text-[#D64C31]"
          textColor="text-[#2C2A29]"
          mutedColor="text-[#7C726A]"
          borderColor="border-[#EAE4D9]"
          hoverBg="hover:bg-white/50"
        />
      </div>
    </section>
  );
}

/* ─── Contact / Footer Section ─── */
export function Theme4Contact({ content, variant }: SectionRendererProps) {
  return (
    <footer data-landing-section="contact" id="iletisim" className="mt-auto border-t border-[#EAE4D9] bg-[#FBF9F6] pt-20 pb-10 px-6 relative z-20">
      <div className="mx-auto max-w-[1400px] flex flex-col md:flex-row justify-between items-end gap-10">
        <div>
          <div className="text-4xl text-[#2C2A29] mb-4" style={{ fontFamily: "var(--font-playfair), serif" }}>
            {content.brandName}
          </div>
          <p className="text-[#7C726A] text-sm max-w-xs">{content.landingTexts?.footerTagline || "Geleceğin koçluk mimarisi üzerine inşa edildi."}</p>
        </div>

        <div className="flex flex-col md:text-right gap-4 text-xs font-bold tracking-[0.2em] uppercase text-[#7C726A]">
          <a href={`mailto:${content.email}`} className="hover:text-[#2C2A29] transition-colors">Bize Ulaşın</a>
          {content.whatsappNumber && <a href={content.whatsappUrl} target="_blank" rel="noreferrer" className="hover:text-[#2C2A29] transition-colors">Canlı Destek</a>}
          <Link href={content.authUrl} className="hover:text-[#D64C31] transition-colors mt-4">Uygulamaya Giriş</Link>
        </div>
      </div>
      {content.socialLinks && (
        <div className="mx-auto max-w-[1400px] mt-12">
          <SocialIcons links={content.socialLinks} iconClassName="w-5 h-5 text-[#A8A19B] hover:text-[#D64C31] transition-colors" />
        </div>
      )}
      <div className="mx-auto max-w-[1400px] mt-8 pt-8 border-t border-[#EAE4D9] flex justify-between items-center text-[10px] uppercase font-bold tracking-widest text-[#A8A19B]">
        <p>&copy; {new Date().getFullYear()} Yazılım AŞ.</p>
        <p>V2.0</p>
      </div>
    </footer>
  );
}

/* ─── Main Component (backward compatible) ─── */
export function LandingTheme4({ content }: LandingThemeComponentProps) {
  return (
    <div className="relative min-h-screen bg-[#FBF9F6] text-[#2C2A29] selection:bg-[#EAE4D9] selection:text-[#2C2A29]" style={{ fontFamily: "var(--font-body, Inter, sans-serif)" }}>
      <Theme4Background />
      <div className="relative z-10 flex flex-col min-h-screen">
        <Theme4Navbar content={content} />
        <Theme4Hero content={content} variant={1} />
        <Theme4Tour content={content} />
        <Theme4Stats content={content} variant={1} />
        <Theme4Transformations content={content} variant={1} />
        <SystemHowSection content={content} variant={1} />
        <Theme4Packages content={content} variant={1} />
        <Theme4Contact content={content} variant={1} />
      </div>
    </div>
  );
}

/* ─── Layout Export (DynamicLandingRenderer için) ─── */
export const theme4Layout: ThemeLayout = {
  Wrapper: ({ children }) => (
    <div className="relative min-h-screen bg-[#FBF9F6] text-[#2C2A29] selection:bg-[#EAE4D9] selection:text-[#2C2A29]" style={{ fontFamily: "var(--font-body, Inter, sans-serif)" }}>
      <Theme4Background />
      <div className="relative z-10 flex flex-col min-h-screen">
        {children}
      </div>
    </div>
  ),
  Navbar: Theme4Navbar,
  sections: {
    hero: Theme4Hero,
    stats: Theme4Stats,
    transformations: Theme4Transformations,
    system: SystemHowSection,
    packages: Theme4Packages,
    faq: Theme4FAQ,
    contact: Theme4Contact,
  },
};
