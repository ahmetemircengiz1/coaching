import React from "react";
import type { LandingThemeContent } from "../../types";
import type { EliteGlobalStyles } from "../../elite-config";
import { ArrowRight } from "lucide-react";
import {
  priceParts,
  packageHref,
  durationLabel,
  highlightIndex,
} from "./pricing-helpers";

/**
 * PricingJimmentor — jimmentor esinli.
 *
 * Kimlik: tamamen ORTALANMIŞ içerik, ağır sıkışık (condensed) büyük-harf
 * tipografi, DEV fiyatlar. Alt buton YOK — CTA bir metin bağlantısı. Özellik
 * listesinde "ÖZELLİKLER:" başlığı + noktalı maddeler (tik değil). İki tonlu
 * ağır başlık sola hizalı. Ortadaki kart kenarlıkla öne çıkar.
 *
 * inspiredBy: https://jimmentor.framer.website/
 */
interface Props {
  content: LandingThemeContent;
  config?: EliteGlobalStyles;
}

export function PricingJimmentor({ content, config }: Props) {
  const packages = content.packages || [];
  if (packages.length === 0) return null;

  const texts = content.landingTexts;
  const primary = config?.primaryColor || "#b4f23a";
  const bg = config?.backgroundColor || "#0b1f1b";
  const headingColor = config?.textColor || "#ffffff";
  const condensed = 'var(--font-oswald), "Arial Narrow", sans-serif';
  const hi = highlightIndex(packages.length);

  const ink = "#ffffff";
  const line = "rgba(255,255,255,0.14)";

  const title = texts?.packagesTitle || "Sana En Uygun Paketi Seç";
  const parts = title.trim().split(/\s+/);
  const head = parts.length > 2 ? parts.slice(0, -2).join(" ") : "";
  const accent = parts.length > 2 ? parts.slice(-2).join(" ") : title;

  return (
    <section className="px-6 py-24 sm:py-32" style={{ backgroundColor: bg }}>
      <div className="mx-auto max-w-6xl">
        <div className="mb-16 max-w-3xl">
          <h2
            className="font-extrabold uppercase"
            style={{ fontFamily: condensed, fontSize: "clamp(2.6rem, 6vw, 5.2rem)", lineHeight: 0.95 }}
          >
            {head && <span style={{ color: headingColor }}>{head} </span>}
            <span style={{ color: primary }}>{accent}</span>
          </h2>
          <p className="mt-4 max-w-md text-sm leading-relaxed" style={{ color: `${headingColor}80` }}>
            {texts?.packagesSubtitle ||
              "Hedeflerine, bütçene ve antrenman tercihlerine en uygun paketi seç."}
          </p>
        </div>

        <div className="grid items-center gap-5 lg:grid-cols-3">
          {packages.map((pkg, idx) => {
            const on = idx === hi;
            const pr = priceParts(pkg);
            return (
              <div
                key={pkg.id}
                className={`flex flex-col rounded-2xl p-8 text-center transition-all duration-300 will-change-transform hover:-translate-y-2.5 hover:shadow-[0_30px_60px_-18px_rgba(0,0,0,0.6)] ${on ? "lg:scale-[1.05]" : ""}`}
                style={{
                  background: on ? "rgba(255,255,255,0.07)" : "rgba(255,255,255,0.025)",
                  border: `1.5px solid ${on ? primary : line}`,
                }}
              >
                <h3
                  className="text-2xl font-extrabold uppercase"
                  style={{ color: ink, fontFamily: condensed }}
                >
                  {pkg.name}
                </h3>
                {pkg.description && (
                  <p className="mx-auto mt-3 max-w-[15rem] text-sm leading-relaxed" style={{ color: `${ink}80` }}>
                    {pkg.description}
                  </p>
                )}

                {/* CTA — metin bağlantısı */}
                <a
                  href={packageHref(content, pkg)}
                  className="mt-5 inline-flex items-center justify-center gap-1.5 text-sm font-bold uppercase tracking-wide transition-opacity hover:opacity-75"
                  style={{ color: primary }}
                >
                  Yolculuğa Başla
                  <ArrowRight className="h-4 w-4" />
                </a>

                <div className="mt-6 flex items-end justify-center gap-1">
                  <span
                    className="font-extrabold"
                    style={{ color: ink, fontFamily: condensed, fontSize: "clamp(3.2rem, 6vw, 5rem)", lineHeight: 0.85 }}
                  >
                    {pr.before ? pr.symbol : ""}
                    {pr.amount}
                    {pr.before ? "" : ` ${pr.symbol}`}
                  </span>
                  {durationLabel(pkg) && (
                    <span className="pb-1.5 text-xs" style={{ color: `${ink}66` }}>
                      / {durationLabel(pkg)}
                    </span>
                  )}
                </div>

                {pkg.features.length > 0 && (
                  <div className="mt-7 border-t pt-6 text-left" style={{ borderColor: line }}>
                    <p
                      className="text-sm font-extrabold uppercase"
                      style={{ color: ink, fontFamily: condensed, letterSpacing: "0.05em" }}
                    >
                      Özellikler:
                    </p>
                    <ul className="mt-3 flex flex-col gap-2.5">
                      {pkg.features.map((f, i) => (
                        <li key={i} className="flex items-start gap-2.5 text-sm" style={{ color: `${ink}b3` }}>
                          <span
                            className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full"
                            style={{ background: primary }}
                          />
                          <span>{f}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
