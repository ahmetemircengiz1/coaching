"use client";

import { Activity, Target, Trophy } from "lucide-react";
import type { SectionRendererProps } from "../section-types";

const DEFAULTS = {
  title: "SİSTEM NASIL İŞLER?",
  subtitle: "Başarı şansa bırakılmaz. Bilimsel döngü, sürekli analiz ve mükemmel sonuç.",
  steps: [
    {
      title: "ANALİZ & PLANLAMA",
      description: "Detaylı anamnez formu ile metabolik durumun, yaşam tarzın ve hedeflerin analiz edilir.",
      Icon: Activity,
    },
    {
      title: "UYGULAMA & TAKİP",
      description: "Antrenman ve beslenme programın başlar. Haftalık check-inler ile formun kontrol altında tutulur.",
      Icon: Target,
    },
    {
      title: "OPTİMİZASYON & SONUÇ",
      description: "Vücudunun verdiği tepkilere göre program revize edilir. Sürekli gelişim sağlanır.",
      Icon: Trophy,
    },
  ],
} as const;

export function SystemHowSection({ content }: SectionRendererProps) {
  const t = content.landingTexts;
  const steps = [
    {
      number: "01",
      title: t?.system1Title || DEFAULTS.steps[0].title,
      description: t?.system1Description || DEFAULTS.steps[0].description,
      Icon: DEFAULTS.steps[0].Icon,
    },
    {
      number: "02",
      title: t?.system2Title || DEFAULTS.steps[1].title,
      description: t?.system2Description || DEFAULTS.steps[1].description,
      Icon: DEFAULTS.steps[1].Icon,
    },
    {
      number: "03",
      title: t?.system3Title || DEFAULTS.steps[2].title,
      description: t?.system3Description || DEFAULTS.steps[2].description,
      Icon: DEFAULTS.steps[2].Icon,
    },
  ];

  return (
    <section
      data-landing-section="system"
      id="sistem"
      className="relative py-24 px-6 lg:px-12"
      style={{
        backgroundColor: "color-mix(in srgb, var(--landing-bg, #0A0A0C) 92%, transparent)",
      }}
    >
      <div className="max-w-[1400px] mx-auto">
        <div data-section-heading className="text-center mb-16">
          <h2
            className="text-3xl md:text-5xl font-black tracking-tighter uppercase mb-4"
            style={{ color: "var(--landing-text, #fff)" }}
          >
            {t?.systemTitle || DEFAULTS.title}
          </h2>
          <p
            className="text-base md:text-lg max-w-2xl mx-auto"
            style={{ color: "var(--landing-text-muted, rgba(255,255,255,0.6))" }}
          >
            {t?.systemSubtitle || DEFAULTS.subtitle}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {steps.map(({ number, title, description, Icon }) => (
            <div
              key={number}
              className="group relative rounded-2xl p-8 transition-all duration-500 hover:-translate-y-2 overflow-hidden cursor-default"
              style={{
                backgroundColor: "color-mix(in srgb, var(--landing-surface, rgba(255,255,255,0.04)) 100%, transparent)",
                borderWidth: 1,
                borderColor: "var(--landing-border, rgba(255,255,255,0.08))",
              }}
            >
              <div
                className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
                style={{
                  background:
                    "radial-gradient(circle at 30% 20%, color-mix(in srgb, var(--landing-accent, #ffffff) 18%, transparent) 0%, transparent 70%)",
                  boxShadow:
                    "inset 0 0 30px color-mix(in srgb, var(--landing-accent, #ffffff) 20%, transparent)",
                }}
              />
              <div
                className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
                style={{
                  boxShadow:
                    "0 20px 60px -20px color-mix(in srgb, var(--landing-accent, #ffffff) 55%, transparent)",
                }}
              />

              <div className="relative z-10 flex items-start justify-between mb-6">
                <div
                  className="h-14 w-14 rounded-xl flex items-center justify-center transition-transform duration-500 group-hover:scale-110"
                  style={{
                    backgroundColor:
                      "color-mix(in srgb, var(--landing-accent, #ffffff) 18%, transparent)",
                    color: "var(--landing-accent, #ffffff)",
                  }}
                >
                  <Icon size={24} strokeWidth={2.25} />
                </div>
                <span
                  className="text-5xl font-black tracking-tighter opacity-20 group-hover:opacity-40 transition-opacity"
                  style={{ color: "var(--landing-text, #ffffff)" }}
                >
                  {number}
                </span>
              </div>

              <h3
                className="relative z-10 text-xl md:text-2xl font-black uppercase tracking-tight mb-3"
                style={{ color: "var(--landing-text, #ffffff)" }}
              >
                {title}
              </h3>
              <p
                className="relative z-10 text-sm md:text-base leading-relaxed"
                style={{ color: "var(--landing-text-muted, rgba(255,255,255,0.6))" }}
              >
                {description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
