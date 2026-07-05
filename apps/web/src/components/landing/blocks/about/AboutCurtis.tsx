"use client";

import React from "react";
import {
  Award,
  BadgeCheck,
  MapPin,
  ArrowUpRight,
  Instagram,
  Twitter,
  Facebook,
  Youtube,
  Linkedin,
  Music2,
} from "lucide-react";
import type { LandingThemeContent } from "../../types";
import type { EliteGlobalStyles } from "../../elite-config";
import { scrollToContactSection } from "../navbar/nav-helpers";
import { getSocialLinks, type SocialKey } from "../footer/footer-helpers";

interface EliteProps {
  content: LandingThemeContent;
  config?: EliteGlobalStyles;
}

function SocialGlyph({ k }: { k: SocialKey }) {
  switch (k) {
    case "instagram":
      return <Instagram className="h-4 w-4" />;
    case "facebook":
      return <Facebook className="h-4 w-4" />;
    case "youtube":
      return <Youtube className="h-4 w-4" />;
    case "linkedin":
      return <Linkedin className="h-4 w-4" />;
    case "tiktok":
      return <Music2 className="h-4 w-4" />;
    default:
      return <Twitter className="h-4 w-4" />;
  }
}

/**
 * AboutCurtis — açık zemin, ortalanmış başlık. 3 sütun: solda 2 rozet kartı +
 * lokasyon kartı, ortada büyük koç fotoğrafı, sağda isim + bio + sosyal +
 * "İletişime Geç" yeşil pill butonu.
 * inspiredBy: https://curtis.framer.media/
 */
export function AboutCurtis({ content, config }: EliteProps) {
  const texts = content.landingTexts;
  const accent = config?.primaryColor || "#a3e635";
  const bg = "#fafafa";
  const brand = content.title || content.brandName || "Koçum";
  const image =
    texts?.aboutImage ||
    content.heroImageDesktopUrl ||
    content.heroImageOriginalUrl ||
    null;
  const image2 = texts?.aboutImage2;
  const social = getSocialLinks(content);
  const eyebrow = texts?.aboutEyebrow || "Hakkımda";
  const heading = texts?.aboutTitle || "Koçunla Tanış";
  const subtitle =
    texts?.aboutBio2 ||
    "Bu seviyedeki ilerleme; kişiselleştirilmiş antrenman, stratejik beslenme ve her adımda sorumluluk bilinciyle mümkündür.";
  const bio1 =
    texts?.aboutBio1 ||
    "Fitness sektöründeki yıllarca süren tecrübemle gerçek güç inşa etmeye, kondisyonu geliştirmeye ve uzun vadeli fiziksel kapasiteyi büyütmeye odaklanıyorum. Yapılandırılmış programlama, teknik hassasiyet ve ölçülebilir ilerleme koçluğumun temelidir.";
  const bio2 =
    "Sağlam temellere, ilerleyici aşırı yüke ve amaca yönelik antrenmana öncelik veriyorum; dirençli ve kapasiteli bedenler inşa etmek için her programı kasıtlı, ilerleyici ve sürekli gelişim üzerine kuruyorum.";
  const badge1Title = texts?.aboutBadge1Title || "Profesyonel Sporcu";
  const badge1Sub = texts?.aboutBadge1Subtitle || "Eski Yarışmacı Atlet";
  const badge2Title = texts?.aboutBadge2Title || "Sertifikalı Koç";
  const badge2Sub = texts?.aboutBadge2Subtitle || "NASM & ACE Sertifikalı";
  const locTitle = brand;
  const locSubtitle = content.businessAddress || "Antrenman Merkezi";

  return (
    <section
      className="px-6 py-20"
      style={{ backgroundColor: bg, color: "#0a0a0a" }}
    >
      <div className="mx-auto max-w-7xl text-center">
        <span className="inline-block rounded-full border border-black/10 bg-white px-4 py-1 text-xs font-medium">
          {eyebrow}
        </span>
        <h2 className="mt-5 text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl">
          {heading}
        </h2>
        <p className="mx-auto mt-4 max-w-xl text-sm leading-relaxed text-black/55 sm:text-base">
          {subtitle}
        </p>

        <div className="mt-12 grid gap-5 text-left lg:grid-cols-[0.85fr_1fr_1.1fr]">
          {/* Sol: rozetler + lokasyon */}
          <div className="flex flex-col gap-5">
            <BadgeCard
              icon={<Award className="h-5 w-5" />}
              title={badge1Title}
              subtitle={badge1Sub}
            />
            <BadgeCard
              icon={<BadgeCheck className="h-5 w-5" />}
              title={badge2Title}
              subtitle={badge2Sub}
            />
            <LocationCard image={image2} title={locTitle} subtitle={locSubtitle} />
          </div>

          {/* Center: portre */}
          <div className="overflow-hidden rounded-2xl bg-black/5">
            {image ? (
              <img
                src={image}
                alt={brand}
                className="h-full min-h-[520px] w-full object-cover"
              />
            ) : (
              <div className="flex min-h-[520px] items-center justify-center text-sm text-black/40">
                Fotoğraf için Ayarlar → Hakkımda
              </div>
            )}
          </div>

          {/* Sağ: bio + sosyal + CTA */}
          <div className="flex flex-col rounded-2xl bg-white p-7 sm:p-8">
            <h3 className="text-2xl font-bold">{brand}</h3>
            <div className="mt-4 space-y-4 text-sm leading-relaxed text-black/65 sm:text-base">
              <p>{bio1}</p>
              <p>{bio2}</p>
            </div>
            <div className="mt-auto flex flex-wrap items-end justify-between gap-4 pt-8">
              <button
                onClick={() => scrollToContactSection(content)}
                className="group inline-flex items-center gap-2 rounded-full py-1.5 pl-5 pr-1.5 text-sm font-bold text-black transition-transform hover:scale-105"
                style={{ backgroundColor: accent }}
              >
                İletişime Geç
                <span className="flex h-8 w-8 items-center justify-center rounded-full bg-black text-white transition-transform group-hover:rotate-45">
                  <ArrowUpRight className="h-4 w-4" />
                </span>
              </button>
              {social.length > 0 && (
                <div className="text-right">
                  <span className="block text-xs text-black/55">Beni takip et:</span>
                  <div className="mt-2 flex gap-3">
                    {social.map((s) => (
                      <a
                        key={s.key}
                        href={s.url}
                        target="_blank"
                        rel="noreferrer"
                        aria-label={s.name}
                        className="text-black/70 transition-colors hover:text-black"
                      >
                        <SocialGlyph k={s.key} />
                      </a>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function BadgeCard({
  icon,
  title,
  subtitle,
}: {
  icon: React.ReactNode;
  title: string;
  subtitle: string;
}) {
  return (
    <div className="rounded-2xl bg-white p-6">
      <div className="flex h-10 w-10 items-center justify-center rounded-full border border-black/10 text-black/75">
        {icon}
      </div>
      <h4 className="mt-10 text-base font-bold">{title}</h4>
      <p className="mt-1 text-sm text-black/55">{subtitle}</p>
    </div>
  );
}

function LocationCard({
  image,
  title,
  subtitle,
}: {
  image?: string;
  title: string;
  subtitle: string;
}) {
  return (
    <div className="relative min-h-[180px] overflow-hidden rounded-2xl bg-black/10">
      {image ? (
        <img
          src={image}
          alt={title}
          className="h-full min-h-[180px] w-full object-cover"
        />
      ) : (
        <div
          className="h-full min-h-[180px] w-full"
          style={{ background: "linear-gradient(180deg, #4a4a4a, #111)" }}
        />
      )}
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
      <div className="absolute right-3 top-3 flex h-8 w-8 items-center justify-center rounded-full bg-white/90 text-black">
        <ArrowUpRight className="h-4 w-4" />
      </div>
      <div className="absolute bottom-0 left-0 right-0 p-5 text-white">
        <span className="inline-block rounded-full bg-white/30 px-2.5 py-0.5 text-[10px] uppercase tracking-wider backdrop-blur">
          Antrenman Merkezi
        </span>
        <h4 className="mt-2 text-lg font-bold">{title}</h4>
        <div className="flex items-center gap-1 text-xs text-white/75">
          <MapPin className="h-3 w-3" />
          <span className="line-clamp-1">{subtitle}</span>
        </div>
      </div>
    </div>
  );
}
