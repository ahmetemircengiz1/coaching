"use client";

import Link from "next/link";
import { Menu, MessageCircle, X, ArrowRight, Play, CheckCircle2 } from "lucide-react";
import { useMemo, useState, useEffect } from "react";
import { formatCount, formatPackagePrice, withFallbackFeatures } from "../helpers";
import { TransformationCarousel } from "../TransformationCarousel";
import type { LandingThemeComponentProps, LandingPackage, LandingThemeContent } from "../types";
import type { SectionRendererProps, ThemeLayout } from "../section-types";
import { FadeInScroll } from "../FadeInScroll";
import { FAQAccordion } from "../FAQSection";
import { SocialIcons } from "../SocialIcons";
import { HeroDesktopImage, HeroMobileImage, hasHeroImage } from "../HeroBackground";

/* ─── Theme 6 – "Dynamic Flow" ─── */

function normalizePackages(packages: LandingPackage[]) {
    if (packages.length > 0) return packages.slice(0, 3);
    return [
        { id: "starter", name: "Standart Plan", description: "", duration: 12, price: 3990, currency: "TRY", features: ["Kişiye özel idman", "Haftalık check-in", "WhatsApp asistan"] },
        { id: "pro", name: "Kapsamlı", description: "", duration: 24, price: 6990, currency: "TRY", features: ["Kişiye özel idman", "Haftalık check-in", "Kesintisiz iletişim", "Beslenme planı"] },
        { id: "elite", name: "Elit Seviye", description: "", duration: 12, price: 5990, currency: "TRY", features: ["Birebir planlama", "Haftalık videolu analiz", "Sınırsız mesajlaşma", "Beslenme & Makro"] },
    ] satisfies LandingPackage[];
}

const BG_IMAGES = [
    "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?q=80&w=2070&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?q=80&w=2070&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1517836357463-d25dfeac3438?q=80&w=2070&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1541534741688-6078c6bfb5c5?q=80&w=2069&auto=format&fit=crop"
];

/* ─── Navbar ─── */
export function Theme6Navbar({ content }: { content: LandingThemeContent }) {
    const [menuOpen, setMenuOpen] = useState(false);
    return (
        <>
            {/* Desktop header */}
            <header className="fixed top-0 left-0 right-0 z-50 h-20 items-center justify-between px-6 md:px-12 backdrop-blur-sm bg-black/20 border-b border-white/10 transition-colors duration-500 hidden md:flex">
                <span className="text-xl font-bold tracking-widest uppercase text-white">
                    {content.brandName}
                </span>

                <nav className="flex items-center gap-10">
                    <a href="#hakkimizda" className="text-[13px] font-medium tracking-widest uppercase text-white/70 hover:text-white transition-colors">Hakkımızda</a>
                    {content.transformations.length > 0 && <a href="#donusumler" className="text-[13px] font-medium tracking-widest uppercase text-white/70 hover:text-white transition-colors">Dönüşüm</a>}
                    <a href="#paketler" className="text-[13px] font-medium tracking-widest uppercase text-white/70 hover:text-white transition-colors">Paketler</a>
                </nav>

                <div className="flex items-center gap-6">
                    <Link href={content.authUrl} className="text-[13px] font-bold tracking-widest uppercase text-white hover:text-white/80 transition-colors">Giriş Yap</Link>
                </div>
            </header>

            {/* Mobile floating hamburger */}
            <button type="button" onClick={() => setMenuOpen(true)} className="fixed top-4 right-4 z-50 inline-flex h-11 w-11 items-center justify-center rounded-full bg-black/40 backdrop-blur-md text-white md:hidden shadow-lg border border-white/10" aria-label="Menu">
                <Menu size={20} />
            </button>

            {/* Mobile fullscreen menu */}
            {menuOpen && (
                <div className="fixed inset-0 z-50 bg-black/95 backdrop-blur-xl flex flex-col items-center justify-center md:hidden animate-in fade-in zoom-in-95">
                    <button onClick={() => setMenuOpen(false)} className="absolute top-4 right-4 h-11 w-11 inline-flex items-center justify-center rounded-full bg-white/5 border border-white/10 text-white" aria-label="Kapat"><X size={20} /></button>
                    <span className="text-xl font-bold tracking-widest uppercase text-white mb-10">{content.brandName}</span>
                    <div className="flex flex-col gap-8 text-center text-xl font-bold tracking-widest uppercase text-white">
                        <a href="#hakkimizda" onClick={() => setMenuOpen(false)}>Hakkımızda</a>
                        {content.transformations.length > 0 && <a href="#donusumler" onClick={() => setMenuOpen(false)}>Dönüşüm</a>}
                        <a href="#paketler" onClick={() => setMenuOpen(false)}>Paketler</a>
                        <Link href={content.authUrl} onClick={() => setMenuOpen(false)}>Giriş Yap</Link>
                    </div>
                </div>
            )}
        </>
    );
}

/* ─── Hero Section ─── */
export function Theme6Hero({ content, variant }: SectionRendererProps) {
    const withImage = hasHeroImage(content);

    return (
        <section className="relative min-h-[100svh] overflow-hidden bg-black">
            {/* Mobile background */}
            <HeroMobileImage content={content} />

            <div className={`relative z-10 mx-auto max-w-7xl px-6 md:px-12 pt-32 pb-20 md:pt-40 md:pb-24 min-h-[100svh] flex items-center ${withImage ? "md:grid md:grid-cols-2 md:gap-12" : ""}`}>
                {/* Left: Text */}
                <div className="max-w-5xl">
                    <FadeInScroll delay={200} duration={1200} direction="up" distance={50}>
                        <h1 className="text-4xl md:text-7xl lg:text-8xl font-black uppercase tracking-tighter text-white leading-[0.9] mb-8">
                            Limitleri <br />
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-white to-white/40">Yeniden Tanımla</span>
                        </h1>
                    </FadeInScroll>

                    <FadeInScroll delay={400} duration={1200} direction="up" distance={50}>
                        <p className="max-w-xl text-lg md:text-2xl text-white/70 font-light leading-relaxed mb-12 border-l-2 border-white/20 pl-6">
                            {content.bio || "Standart olan hiçbir şey mükemmel değildir. Bireysel analizin gücüyle inşa edilen, elit seviye fiziksel dönüşüm sistemi."}
                        </p>
                    </FadeInScroll>

                    <FadeInScroll delay={600} duration={1000} direction="up" distance={30}>
                        <div className="flex flex-col sm:flex-row gap-6">
                            <a href="#paketler" className="inline-flex h-16 items-center justify-center bg-white text-black px-10 rounded-full text-sm font-bold uppercase tracking-widest transition-transform hover:scale-105">
                                Sisteme Dahil Ol
                                <ArrowRight className="ml-3 w-5 h-5" />
                            </a>
                        </div>
                    </FadeInScroll>
                </div>

                {/* Right: Hero image (desktop) */}
                {withImage && (
                    <div className="hidden md:block relative h-[600px] lg:h-[700px]">
                        <HeroDesktopImage content={content} themeBg="#000000" accentColor="rgba(255,255,255,0.2)" />
                    </div>
                )}
            </div>
        </section>
    );
}

/* ─── Stats Section (Combined with Info) ─── */
export function Theme6Stats({ content, variant }: SectionRendererProps) {
    return (
        <section id="hakkimizda" className="relative min-h-screen flex items-center justify-center px-6 md:px-12 py-32">
            <div className="w-full max-w-[1400px] flex flex-col md:flex-row items-center gap-16 lg:gap-32">
                <div className="w-full md:w-1/2">
                    <FadeInScroll delay={200} duration={1000} direction="up" distance={60}>
                        <h2 className="text-4xl md:text-6xl font-black uppercase tracking-tighter leading-none mb-8">
                            Sonuç Odaklı <br />
                            <span className="text-white/40">Mühendislik</span>
                        </h2>
                        <p className="text-lg text-white/70 font-light leading-relaxed mb-10">
                            Başarı rastlantısal değildir. Kişiselleştirilmiş idman matematiği, milimetrik makro hesaplamaları ve sürekli analiz sayesinde gelişiminizi bir bilim dalına dönüştürüyoruz.
                        </p>

                        <div className="space-y-6">
                            <div className="flex items-center gap-4 border-b border-white/10 pb-6">
                                <div className="w-12 h-12 rounded-full border border-white/20 flex items-center justify-center shrink-0">
                                    <span className="font-bold text-lg">01</span>
                                </div>
                                <div>
                                    <h4 className="text-xl font-bold uppercase tracking-wider mb-1">Dinamik İdman Mimarisi</h4>
                                    <p className="text-sm text-white/50">Video destekli, set, tempo ve ağırlık ilerlemeleri kayıt altında.</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-4 border-b border-white/10 pb-6">
                                <div className="w-12 h-12 rounded-full border border-white/20 flex items-center justify-center shrink-0">
                                    <span className="font-bold text-lg">02</span>
                                </div>
                                <div>
                                    <h4 className="text-xl font-bold uppercase tracking-wider mb-1">Sürdürülebilir Beslenme</h4>
                                    <p className="text-sm text-white/50">Makro dengesi gözetilerek, yasaksız ve hedefe yönelik planlama.</p>
                                </div>
                            </div>
                        </div>
                    </FadeInScroll>
                </div>

                <div className="w-full md:w-1/2 flex justify-center md:justify-end">
                    <FadeInScroll delay={400} duration={1200} direction="left" distance={80}>
                        <div className="relative w-full max-w-md bg-black/40 backdrop-blur-xl border border-white/10 p-10 rounded-3xl overflow-hidden group">
                            <div className="absolute inset-0 bg-gradient-to-tr from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
                            <div className="relative z-10 text-center">
                                <p className="text-6xl font-black mb-4">{formatCount(content.studentCount || 1000)}+</p>
                                <p className="text-xs font-bold uppercase tracking-widest text-white/50 mb-12">Aktif Öğrenci Ağı</p>

                                <p className="text-6xl font-black mb-4">5+</p>
                                <p className="text-xs font-bold uppercase tracking-widest text-white/50 mb-12">Yıl Sektörel Deneyim</p>

                                <p className="text-6xl font-black mb-4">{content.transformationCount || 10}+</p>
                                <p className="text-xs font-bold uppercase tracking-widest text-white/50">Onaylı Dönüşüm</p>
                            </div>
                        </div>
                    </FadeInScroll>
                </div>
            </div>
        </section>
    );
}

/* ─── Transformations Section ─── */
export function Theme6Transformations({ content, variant }: SectionRendererProps) {
    if (content.transformations.length === 0) return null;
    return (
        <section id="donusumler" className="relative min-h-screen flex items-center justify-center px-6 md:px-12 py-32">
            <div className="w-full max-w-[1400px]">
                <FadeInScroll delay={200} duration={1000} direction="up" distance={40}>
                    <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-8">
                        <div>
                            <h2 className="text-4xl md:text-6xl font-black uppercase tracking-tighter leading-none mb-4">
                                Söz Değil <br />
                                <span className="text-white/40">Eserler</span>
                            </h2>
                            <p className="text-white/60 max-w-lg">
                                Disiplin ve tutkunun fiziksel bir forma bürünmüş hali. İşte sistemimizin gücünün en büyük kanıtları.
                            </p>
                        </div>
                    </div>
                </FadeInScroll>

                <FadeInScroll delay={400} duration={1500} direction="up" distance={60}>
                    <div className="w-full max-w-3xl mx-auto">
                        <div className="bg-black/40 backdrop-blur-xl border border-white/10 rounded-3xl p-4 md:p-8">
                            <TransformationCarousel items={content.transformations} variant="dark" />
                        </div>
                    </div>
                </FadeInScroll>
            </div>
        </section>
    );
}

/* ─── Packages Section ─── */
export function Theme6Packages({ content, variant }: SectionRendererProps) {
    const packages = useMemo(() => normalizePackages(content.packages), [content.packages]);
    return (
        <section id="paketler" className="relative min-h-screen flex items-center justify-center px-6 md:px-12 py-32">
            <div className="w-full max-w-[1400px]">
                <FadeInScroll delay={200} duration={1000} direction="up" distance={40}>
                    <div className="text-center mb-20">
                        <h2 className="text-4xl md:text-6xl font-black uppercase tracking-tighter leading-none mb-6">
                            Evrimi <br className="md:hidden" />
                            <span className="text-white/40">Başlat</span>
                        </h2>
                    </div>
                </FadeInScroll>

                <div className="grid gap-6 md:grid-cols-3 md:gap-8 max-w-5xl mx-auto">
                    {packages.map((pkg, i) => {
                        const isPro = i === 1;
                        return (
                            <FadeInScroll key={pkg.id} delay={i * 200 + 400} duration={1200} direction="up" distance={50}>
                                <article className={`relative h-full flex flex-col p-10 rounded-3xl overflow-hidden transition-all duration-500 hover:-translate-y-2 ${isPro ? "bg-white text-black scale-105 z-10 shadow-[0_0_50px_rgba(255,255,255,0.1)]" : "bg-black/60 backdrop-blur-xl border border-white/15 text-white"}`}>

                                    <div className="mb-8">
                                        <div className="flex justify-between items-center mb-6">
                                            <h3 className="text-sm font-black uppercase tracking-widest">{pkg.name}</h3>
                                            {isPro && <span className="bg-black text-white px-3 py-1 text-[10px] font-bold uppercase tracking-widest rounded-full">Tavsiye</span>}
                                        </div>
                                        <div className="flex items-baseline">
                                            <span className="text-4xl md:text-5xl font-black tracking-tighter">{formatPackagePrice(pkg.price, pkg.currency)}</span>
                                        </div>
                                        <p className={`mt-2 text-[10px] font-bold uppercase tracking-widest ${isPro ? "text-black/50" : "text-white/40"}`}>/ {pkg.duration} Hafta</p>
                                    </div>

                                    <ul className="flex-1 space-y-5 mb-10">
                                        {withFallbackFeatures(pkg.features).map((f, idx) => (
                                            <li key={idx} className="flex items-start gap-4">
                                                <CheckCircle2 className={`w-5 h-5 shrink-0 ${isPro ? "text-black" : "text-white/60"}`} />
                                                <span className={`text-sm font-medium leading-tight ${isPro ? "text-black/80" : "text-white/80"}`}>{f}</span>
                                            </li>
                                        ))}
                                    </ul>

                                    <Link href={`${content.authUrl}?package=${pkg.id}`} className={`mt-auto inline-flex h-14 w-full items-center justify-center rounded-full text-xs font-bold uppercase tracking-widest transition-colors ${isPro ? "bg-black text-white hover:bg-black/90" : "bg-white text-black hover:bg-white/90"}`}>
                                        Planı Seç
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
export function Theme6FAQ({ variant }: SectionRendererProps) {
    return (
        <section className="relative py-32 px-6 md:px-12">
            <div className="w-full max-w-[1400px] mx-auto">
                <FadeInScroll delay={200} duration={1000} direction="up" distance={40}>
                    <div className="mb-16">
                        <h2 className="text-4xl md:text-6xl font-black uppercase tracking-tighter leading-none mb-4">
                            Sık Sorulan <br className="md:hidden" />
                            <span className="text-white/40">Sorular</span>
                        </h2>
                    </div>
                </FadeInScroll>
                <FAQAccordion
                    variant={variant as 1 | 2}
                    accentColor="text-white"
                    textColor="text-white"
                    mutedColor="text-white/60"
                    borderColor="border-white/10"
                    hoverBg="hover:bg-white/[0.03]"
                />
            </div>
        </section>
    );
}

/* ─── Contact / Footer Section ─── */
export function Theme6Contact({ content, variant }: SectionRendererProps) {
    return (
        <footer id="iletisim" className="relative z-20 border-t border-white/10 bg-black/90 backdrop-blur-xl pt-20 pb-10 px-6 md:px-12">
            <div className="mx-auto max-w-[1400px] flex flex-col md:flex-row justify-between items-end gap-10">
                <div>
                    <div className="text-3xl font-black uppercase tracking-widest text-white mb-4">
                        {content.brandName}
                    </div>
                    <p className="text-white/40 text-sm max-w-xs font-light">Eksiksiz koçluk deneyimi, mükemmeli arayanlar için.</p>
                </div>

                <div className="flex flex-col md:text-right gap-4 text-[11px] font-bold tracking-widest uppercase text-white/60">
                    <a href={`mailto:${content.email}`} className="hover:text-white transition-colors">İletişim Kur</a>
                    <a href={content.whatsappUrl} target="_blank" rel="noreferrer" className="hover:text-white transition-colors">WhatsApp Destek</a>
                    <Link href={content.authUrl} className="hover:text-white transition-colors border-t border-white/10 pt-4 mt-2">Uygulamaya Giriş</Link>
                </div>
            </div>
            {content.socialLinks && (
                <div className="mx-auto max-w-[1400px] mt-12">
                    <SocialIcons links={content.socialLinks} iconClassName="w-5 h-5 text-white/40 hover:text-white transition-colors" />
                </div>
            )}
            <div className="mx-auto max-w-[1400px] mt-12 flex justify-between items-center text-[10px] uppercase font-bold tracking-widest text-white/30">
                <p>&copy; {new Date().getFullYear()} Tüm Hakları Saklıdır.</p>
                <p>V3.0</p>
            </div>
        </footer>
    );
}

/* ─── Main Component (backward compatible, with cinematic background) ─── */
export function LandingTheme6({ content }: LandingThemeComponentProps) {
    const [activeSection, setActiveSection] = useState(0);

    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        const index = Number(entry.target.getAttribute("data-section-index"));
                        if (!isNaN(index)) setActiveSection(index);
                    }
                });
            },
            { threshold: 0.4 }
        );
        const sections = document.querySelectorAll(".dynamic-section");
        sections.forEach((s) => observer.observe(s));
        return () => observer.disconnect();
    }, []);

    return (
        <div className="relative min-h-screen bg-black text-white selection:bg-white selection:text-black overflow-x-hidden" style={{ fontFamily: "var(--font-body, Inter, sans-serif)" }}>
            {/* Cinematic background - only in monolithic mode */}
            <div className="fixed inset-0 z-0 bg-black">
                {BG_IMAGES.map((img, index) => (
                    <div key={index} className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${activeSection === index ? "opacity-40" : "opacity-0"}`}>
                        <img src={img} alt="" className="w-full h-full object-cover" />
                    </div>
                ))}
                <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-black/40 to-black/90 mix-blend-multiply" />
            </div>

            <div className="relative z-10 flex flex-col min-h-screen">
                <Theme6Navbar content={content} />

                <div data-section-index="0" className="dynamic-section">
                    <Theme6Hero content={content} variant={1} />
                </div>
                <div data-section-index="1" className="dynamic-section">
                    <Theme6Stats content={content} variant={1} />
                </div>
                {content.transformations.length > 0 && (
                    <div data-section-index="2" className="dynamic-section">
                        <Theme6Transformations content={content} variant={1} />
                    </div>
                )}
                <div data-section-index="3" className="dynamic-section">
                    <Theme6Packages content={content} variant={1} />
                </div>
                <Theme6Contact content={content} variant={1} />
            </div>
        </div>
    );
}

/* ─── Layout Export (DynamicLandingRenderer için) ─── */
export const theme6Layout: ThemeLayout = {
    Wrapper: ({ children }) => (
        <div className="relative min-h-screen bg-black text-white selection:bg-white selection:text-black overflow-x-hidden" style={{ fontFamily: "var(--font-body, Inter, sans-serif)" }}>
            <div className="fixed inset-0 z-0 bg-black">
                <div className="absolute inset-0 opacity-40">
                    <img src={BG_IMAGES[0]} alt="" className="w-full h-full object-cover" />
                </div>
                <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-black/40 to-black/90 mix-blend-multiply" />
            </div>
            <div className="relative z-10 flex flex-col min-h-screen">
                {children}
            </div>
        </div>
    ),
    Navbar: Theme6Navbar,
    sections: {
        hero: Theme6Hero,
        stats: Theme6Stats,
        transformations: Theme6Transformations,
        packages: Theme6Packages,
        faq: Theme6FAQ,
        contact: Theme6Contact,
    },
};
