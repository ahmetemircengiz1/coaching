"use client";

import Link from "next/link";
import { useState } from "react";
import { Menu, X, ArrowUpRight } from "lucide-react";
import type { LandingThemeContent } from "../types";
import type { NavbarVariant } from "../config";

interface UnifiedNavbarProps {
  content: LandingThemeContent;
  variant: NavbarVariant;
}

function navLinks(content: LandingThemeContent) {
  const links = [
    { href: `/site/${content.domain}/hakkimizda`, label: "Hakkımızda" },
  ];
  if (content.transformations.length > 0) {
    links.push({ href: "#donusumler", label: "Dönüşüm" });
  }
  links.push({ href: "#paketler", label: "Paketler" });
  links.push({ href: "#iletisim", label: "İletişim" });
  return links;
}

function ctaHref(content: LandingThemeContent): string {
  return content.whatsappNumber ? content.whatsappUrl : content.authUrl;
}

function MobileHamburger({
  onOpen,
  borderColor,
  bg,
  accent,
}: {
  onOpen: () => void;
  borderColor: string;
  bg: string;
  accent: string;
}) {
  return (
    <button
      type="button"
      onClick={onOpen}
      className="fixed top-4 right-4 z-50 inline-flex h-11 w-11 items-center justify-center rounded-full backdrop-blur-md md:hidden shadow-lg"
      style={{ backgroundColor: bg, borderWidth: 1, borderColor, color: accent }}
      aria-label="Menu"
    >
      <Menu size={20} />
    </button>
  );
}

function MobileMenu({
  open,
  onClose,
  content,
}: {
  open: boolean;
  onClose: () => void;
  content: LandingThemeContent;
}) {
  if (!open) return null;
  const links = navLinks(content);
  return (
    <div
      className="fixed inset-0 z-50 backdrop-blur-3xl flex flex-col items-center justify-center md:hidden"
      style={{ backgroundColor: "color-mix(in srgb, var(--landing-bg, #000) 92%, transparent)" }}
    >
      <button
        type="button"
        onClick={onClose}
        className="absolute top-4 right-4 h-11 w-11 inline-flex items-center justify-center rounded-full"
        style={{
          backgroundColor: "var(--landing-surface, rgba(255,255,255,0.05))",
          borderWidth: 1,
          borderColor: "var(--landing-border, rgba(255,255,255,0.1))",
          color: "var(--landing-accent, #fff)",
        }}
        aria-label="Kapat"
      >
        <X size={20} />
      </button>
      <span
        className="text-lg font-black tracking-widest uppercase mb-10"
        style={{ color: "var(--landing-accent, #fff)", letterSpacing: "0.2em" }}
      >
        {content.brandName}
      </span>
      <div
        className="flex flex-col gap-6 text-sm font-semibold tracking-widest uppercase text-center"
        style={{ color: "var(--landing-text-muted, rgba(255,255,255,0.7))" }}
      >
        {links.map((l) => (
          <a key={l.href} href={l.href} onClick={onClose}>
            {l.label}
          </a>
        ))}
        <Link href={content.authUrl} onClick={onClose}>
          Giriş Yap
        </Link>
        <a
          href={ctaHref(content)}
          target={content.whatsappNumber ? "_blank" : undefined}
          rel={content.whatsappNumber ? "noreferrer" : undefined}
          style={{ color: "var(--landing-accent, #fff)" }}
        >
          Başla
        </a>
      </div>
    </div>
  );
}

function StripNavbar({ content }: { content: LandingThemeContent }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const links = navLinks(content);
  return (
    <>
      <header
        className="fixed top-0 w-full z-50 backdrop-blur-2xl transition-all duration-300 hidden md:block"
        style={{
          backgroundColor: "color-mix(in srgb, var(--landing-bg, #0A0A0C) 65%, transparent)",
          borderBottom: "1px solid var(--landing-border, rgba(255,255,255,0.08))",
        }}
      >
        <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-6 lg:px-8">
          <span
            className="text-lg font-black tracking-widest uppercase"
            style={{ color: "var(--landing-accent, #fff)", letterSpacing: "0.2em" }}
          >
            {content.brandName}
          </span>

          <nav className="flex items-center gap-10">
            {links.map((l) => (
              <a
                key={l.href}
                href={l.href}
                className="text-xs font-semibold uppercase tracking-widest transition-all hover:opacity-100"
                style={{ color: "var(--landing-text-muted, rgba(255,255,255,0.5))" }}
              >
                {l.label}
              </a>
            ))}
          </nav>

          <div className="flex items-center gap-5">
            <Link
              href={content.authUrl}
              className="text-sm font-semibold transition-colors"
              style={{ color: "var(--landing-text-muted, rgba(255,255,255,0.7))" }}
            >
              Giriş Yap
            </Link>
            <a
              href={ctaHref(content)}
              target={content.whatsappNumber ? "_blank" : undefined}
              rel={content.whatsappNumber ? "noreferrer" : undefined}
              className="inline-flex h-10 items-center justify-center rounded-full px-6 text-xs font-bold transition-all hover:scale-105"
              style={{
                backgroundColor: "var(--landing-accent, #fff)",
                color: "var(--landing-bg, #000)",
              }}
            >
              Başla
            </a>
          </div>
        </div>
      </header>

      <MobileHamburger
        onOpen={() => setMenuOpen(true)}
        borderColor="var(--landing-border, rgba(255,255,255,0.1))"
        bg="color-mix(in srgb, var(--landing-bg, #000) 55%, transparent)"
        accent="var(--landing-accent, #fff)"
      />
      <MobileMenu open={menuOpen} onClose={() => setMenuOpen(false)} content={content} />
    </>
  );
}

function PillNavbar({ content }: { content: LandingThemeContent }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const links = navLinks(content);
  return (
    <>
      <nav className="fixed top-4 w-full z-50 px-4 md:px-8 hidden md:block">
        <div
          className="mx-auto flex h-[72px] max-w-6xl items-center justify-between rounded-[2rem] px-6 sm:px-8 shadow-sm backdrop-blur-xl"
          style={{
            backgroundColor: "color-mix(in srgb, var(--landing-surface, #fff) 85%, transparent)",
            borderWidth: 1,
            borderColor: "var(--landing-border, rgba(0,0,0,0.1))",
          }}
        >
          <span className="text-xl font-extrabold tracking-tight" style={{ color: "var(--landing-accent-strong, var(--landing-accent, #000))" }}>
            {content.brandName}
          </span>

          <nav className="flex items-center gap-8">
            {links.map((l) => (
              <a
                key={l.href}
                href={l.href}
                className="text-[15px] font-semibold transition-colors"
                style={{ color: "var(--landing-text-muted, rgba(0,0,0,0.6))" }}
              >
                {l.label}
              </a>
            ))}
          </nav>

          <div className="flex items-center gap-3">
            <Link
              href={content.authUrl}
              className="text-[15px] font-semibold px-5 py-2.5 rounded-full transition-colors"
              style={{
                color: "var(--landing-accent-strong, var(--landing-accent, #000))",
                backgroundColor: "color-mix(in srgb, var(--landing-accent, #000) 10%, transparent)",
              }}
            >
              Giriş Yap
            </Link>
            <a
              href={ctaHref(content)}
              target={content.whatsappNumber ? "_blank" : undefined}
              rel={content.whatsappNumber ? "noreferrer" : undefined}
              className="inline-flex items-center gap-2 rounded-full px-6 py-2.5 text-[15px] font-bold shadow-md transition-all hover:-translate-y-0.5 hover:shadow-lg"
              style={{
                backgroundColor: "var(--landing-accent, #000)",
                color: "var(--landing-bg, #fff)",
              }}
            >
              Başla
            </a>
          </div>
        </div>
      </nav>

      <MobileHamburger
        onOpen={() => setMenuOpen(true)}
        borderColor="var(--landing-border, rgba(0,0,0,0.1))"
        bg="color-mix(in srgb, var(--landing-surface, #fff) 80%, transparent)"
        accent="var(--landing-accent, #000)"
      />
      <MobileMenu open={menuOpen} onClose={() => setMenuOpen(false)} content={content} />
    </>
  );
}

function IntegratedNavbar({ content }: { content: LandingThemeContent }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const links = navLinks(content);

  // Theme-aware readability shadow: inverts against the theme background so dark
  // text on light themes gets a light halo (Theme 3/4) and vice versa on dark themes.
  const readabilityShadow =
    "0 0 6px color-mix(in srgb, var(--landing-bg, #0A0A0C) 70%, transparent), 0 1px 2px rgba(0,0,0,0.35)";

  return (
    <>
      <header className="absolute top-0 left-0 right-0 z-50 hidden md:block">
        <div className="mx-auto flex h-20 max-w-[1400px] items-center justify-between px-6 lg:px-12">
          <span
            className="text-sm font-black tracking-[0.2em] uppercase"
            style={{
              color: "var(--landing-text, #fff)",
              textShadow: readabilityShadow,
            }}
          >
            {content.brandName.toUpperCase()}
          </span>

          <nav className="flex items-center gap-10">
            {links.map((l) => (
              <a
                key={l.href}
                href={l.href}
                className="text-xs font-bold uppercase tracking-[0.25em] transition-colors hover:opacity-80"
                style={{
                  color: "var(--landing-text, #fff)",
                  textShadow: readabilityShadow,
                }}
              >
                {l.label}
              </a>
            ))}
          </nav>

          <a
            href={ctaHref(content)}
            target={content.whatsappNumber ? "_blank" : undefined}
            rel={content.whatsappNumber ? "noreferrer" : undefined}
            className="inline-flex h-12 items-center gap-2 rounded-md px-6 text-xs font-bold uppercase tracking-[0.2em] transition-all hover:scale-[1.02] backdrop-blur-sm"
            style={{
              backgroundColor: "color-mix(in srgb, var(--landing-accent, #fff) 14%, transparent)",
              borderWidth: 1,
              borderColor: "color-mix(in srgb, var(--landing-accent, #fff) 45%, transparent)",
              color: "var(--landing-text, #fff)",
              textShadow: readabilityShadow,
            }}
          >
            <ArrowUpRight size={14} />
            {content.whatsappNumber ? "İletişim" : "Giriş Yap"}
          </a>
        </div>
      </header>

      <MobileHamburger
        onOpen={() => setMenuOpen(true)}
        borderColor="var(--landing-border, rgba(255,255,255,0.15))"
        bg="color-mix(in srgb, var(--landing-bg, #000) 45%, transparent)"
        accent="var(--landing-text, #fff)"
      />
      <MobileMenu open={menuOpen} onClose={() => setMenuOpen(false)} content={content} />
    </>
  );
}

export function UnifiedNavbar({ content, variant }: UnifiedNavbarProps) {
  switch (variant) {
    case "pill":
      return <PillNavbar content={content} />;
    case "integrated":
      return <IntegratedNavbar content={content} />;
    case "strip":
    default:
      return <StripNavbar content={content} />;
  }
}
