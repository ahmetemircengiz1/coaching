"use client";

import { motion, useReducedMotion } from "framer-motion";
import { UserPlus, Globe, Dumbbell, LineChart } from "lucide-react";

const ACCENT = "#3d6fd1";
const SECTION_BG = "#050505";

const FLOW = [
  {
    icon: UserPlus,
    title: "Kaydol & markanı seç",
    desc: "E-postanla kaydol, markanın adını ve site adresini seç. Yaklaşık 2 dakika.",
  },
  {
    icon: Globe,
    title: "Siten yayına alınır",
    desc: "Tema, logo ve renklerini ekle. Siten koçadı.shred.com.tr adresinde anında canlı.",
  },
  {
    icon: Dumbbell,
    title: "Program & beslenme ver",
    desc: "Antrenman ve beslenme planını hazırla, tek tıkla öğrencilerine ata.",
  },
  {
    icon: LineChart,
    title: "Check-in ile takip et",
    desc: "Haftalık check-in, fotoğraf ve ölçüler otomatik grafiklere dönüşür.",
  },
];

const LABELS = ["SİTEN KURULUR", "ÖĞRENCİLERİN KATILIR", "İLERLEME OTOMATİK"];

/** Soldan sağa (veya tersi) S-eğrisi çizen bağlantı çubuğu — scroll'da çizilir. */
function Connector({ fromLeft, label }: { fromLeft: boolean; label: string }) {
  const reduce = useReducedMotion();
  const d = fromLeft
    ? "M250,2 C250,55 750,45 750,98"
    : "M750,2 C750,55 250,45 250,98";
  return (
    <div className="relative hidden h-28 w-full md:block">
      <svg
        viewBox="0 0 1000 100"
        preserveAspectRatio="none"
        className="absolute inset-0 h-full w-full"
      >
        <motion.path
          d={d}
          fill="none"
          stroke={ACCENT}
          strokeWidth={2}
          strokeLinecap="round"
          vectorEffect="non-scaling-stroke"
          initial={reduce ? { pathLength: 1 } : { pathLength: 0 }}
          whileInView={{ pathLength: 1 }}
          viewport={{ once: true, amount: 0.6 }}
          transition={{ duration: reduce ? 0 : 1, ease: "easeInOut" }}
        />
      </svg>
      <span
        className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 whitespace-nowrap px-3 font-mono text-[11px] font-semibold uppercase tracking-[0.22em] text-white/45"
        style={{ backgroundColor: SECTION_BG }}
      >
        {label}
      </span>
    </div>
  );
}

export function PlatformFlow() {
  return (
    <section
      id="nasil"
      className="relative overflow-hidden px-6 py-28 text-white"
    >
      <div className="container mx-auto max-w-4xl">
        <motion.div
          className="mb-16 text-center"
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{ duration: 0.6 }}
        >
          <span className="inline-flex items-center gap-2 font-mono text-xs font-semibold uppercase tracking-[0.3em] text-white/55">
            <span className="h-1 w-1 rounded-full" style={{ backgroundColor: ACCENT }} aria-hidden />
            Nasıl çalışır
          </span>
          <h2 className="mt-4 text-3xl font-extrabold tracking-tight md:text-5xl">
            Kayıttan takibe, tek akış.
          </h2>
          <p className="mx-auto mt-5 max-w-xl text-lg text-white/55">
            Bir online koçun günlük işi baştan sona burada. Her adım birbirine bağlı,
            hepsi tek panelde.
          </p>
        </motion.div>

        <div className="relative">
          {/* Mobil dikey çizgi */}
          <div
            className="absolute left-1/2 top-2 bottom-2 w-px -translate-x-1/2 md:hidden"
            style={{ backgroundColor: `${ACCENT}40` }}
            aria-hidden
          />

          {FLOW.map((step, i) => {
            const isLeft = i % 2 === 0;
            return (
              <div key={step.title}>
                <div
                  className={
                    isLeft
                      ? "flex justify-center md:justify-start"
                      : "flex justify-center md:justify-end"
                  }
                >
                  <motion.div
                    className="w-full max-w-sm text-center md:w-1/2"
                    initial={{ opacity: 0, y: 24, scale: 0.97 }}
                    whileInView={{ opacity: 1, y: 0, scale: 1 }}
                    viewport={{ once: true, amount: 0.5 }}
                    transition={{ duration: 0.5 }}
                  >
                    <div
                      className="inline-flex items-center gap-2.5 rounded-full px-6 py-3 text-sm font-bold text-white shadow-[0_12px_30px_-10px_rgba(61,111,209,0.45)]"
                      style={{ backgroundColor: ACCENT }}
                    >
                      <step.icon className="h-4 w-4" />
                      {step.title}
                    </div>
                    <p className="mx-auto mt-4 max-w-xs text-sm leading-relaxed text-white/55">
                      {step.desc}
                    </p>
                  </motion.div>
                </div>

                {i < FLOW.length - 1 && (
                  <>
                    <Connector fromLeft={isLeft} label={LABELS[i]} />
                    {/* Mobil etiket */}
                    <div className="flex justify-center py-7 md:hidden">
                      <span
                        className="px-3 font-mono text-[10px] font-semibold uppercase tracking-[0.2em] text-white/40"
                        style={{ backgroundColor: SECTION_BG }}
                      >
                        {LABELS[i]}
                      </span>
                    </div>
                  </>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
