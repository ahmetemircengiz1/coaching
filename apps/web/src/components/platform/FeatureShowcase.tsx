"use client";

import { type ReactNode } from "react";
import { motion, useReducedMotion } from "framer-motion";
import {
  Calendar,
  Check,
  Clock,
  Diamond,
  Dumbbell,
  Mail,
  Play,
  Star,
  Trash2,
} from "lucide-react";

/**
 * FeatureShowcase — platform ana sayfası "Özellikler" bölümü.
 *
 * Koyu sayfa zemininin üzerinde açık renkli, büyük ve açıklayıcı kartlar:
 * her kartın üstünde başlık + kısa açıklama, altında ürünün o özelliğini
 * anlatan canlı bir görsel kompozisyon (tarayıcı/telefon mockup'ı, egzersiz
 * listesi, makro grafiği, paket kartları vb.). Mockup'lar kod ile çizilir;
 * fotoğraf gereken yerlerde mevcut /marketing ekran görüntüleri ve Unsplash
 * stok karelerinden yararlanılır — istenirse tek satırla değiştirilebilir.
 */

const NAVY = "#0f1730";

/* Egzersiz listesi mockup'ı için stok kareler */
const EXERCISES = [
  {
    name: "Dumbbell Fly",
    meta: "4 Set • 12 Tekrar",
    img: "https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?q=60&w=120&auto=format&fit=crop",
  },
  {
    name: "Rope Pushdown",
    meta: "4 Set • 12 Tekrar",
    img: "https://images.unsplash.com/photo-1517836357463-d25dfeac3438?q=60&w=120&auto=format&fit=crop",
  },
  {
    name: "Goblet Squat",
    meta: "3 Set • 10 Tekrar",
    img: "https://images.unsplash.com/photo-1541534741688-6078c6bfb5c5?q=60&w=120&auto=format&fit=crop",
  },
];

/* Beslenme mockup'ı için stok kareler */
const MEALS = [
  {
    name: "Tavuklu Bowl",
    meta: "420 kcal • 38g protein",
    img: "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?q=60&w=120&auto=format&fit=crop",
  },
  {
    name: "Somon & Sebze",
    meta: "510 kcal • 34g protein",
    img: "https://images.unsplash.com/photo-1467003909585-2f8a72700288?q=60&w=120&auto=format&fit=crop",
  },
  {
    name: "Yulaf & Meyve",
    meta: "380 kcal • 14g protein",
    img: "https://images.unsplash.com/photo-1490645935967-10de6ba17061?q=60&w=120&auto=format&fit=crop",
  },
];

/* Komisyon kartı mockup'ındaki örnek paketler */
const PACKAGES = [
  { icon: Calendar, name: "3 AYLIK DEĞİŞİM PAKETİ", price: "4.500₺", time: "2 dakika önce", pos: "left-[4%] top-[8%] -rotate-2" },
  { icon: Star, name: "6 AYLIK PROFESYONEL", price: "9.230₺", time: "15 dakika önce", pos: "right-[3%] top-[4%] rotate-2" },
  { icon: Diamond, name: "3 AYLIK FIT PAKETİ", price: "2.999₺", time: "20 dakika önce", pos: "left-[10%] bottom-[6%] rotate-1" },
  { icon: Calendar, name: "6 AYLIK DEĞİŞİM PAKETİ", price: "7.809₺", time: "32 dakika önce", pos: "right-[8%] bottom-[10%] -rotate-1" },
];

function ShowcaseCard({
  title,
  desc,
  tint,
  delay,
  children,
}: {
  title: string;
  desc: string;
  tint: string;
  delay: number;
  children: ReactNode;
}) {
  const reduce = useReducedMotion();
  return (
    <motion.div
      initial={reduce ? false : { opacity: 0, y: 26 }}
      whileInView={reduce ? undefined : { opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.25 }}
      transition={{ duration: 0.7, delay, ease: [0.16, 1, 0.3, 1] }}
      className="group relative flex flex-col overflow-hidden rounded-[2.2rem] border border-white/10 bg-white shadow-[0_30px_80px_-30px_rgba(0,0,0,0.55)] transition-transform duration-300 hover:-translate-y-1"
    >
      {/* Alt bölüme doğru yumuşak renk yıkaması */}
      <div
        className="pointer-events-none absolute inset-0"
        style={{ background: `linear-gradient(180deg, #ffffff 0%, #ffffff 34%, ${tint} 100%)` }}
        aria-hidden
      />
      <div className="relative z-10 px-7 pt-9 text-center sm:px-10">
        <h3 className="text-2xl font-extrabold tracking-tight sm:text-[1.7rem]" style={{ color: NAVY }}>
          {title}
        </h3>
        <p className="mx-auto mt-2.5 max-w-sm text-[15px] leading-relaxed text-slate-500">{desc}</p>
      </div>
      <div className="relative z-10 mt-6 flex-1">{children}</div>
    </motion.div>
  );
}

/* ---------- 1) Marka web sitesi: tarayıcı + telefon mockup'ı ---------- */
function VisualWebsite() {
  return (
    <div className="relative h-[17rem] px-6 sm:px-10">
      {/* Tarayıcı çerçevesi */}
      <div className="absolute inset-x-6 top-2 overflow-hidden rounded-t-2xl border border-slate-200 bg-white shadow-[0_24px_60px_-24px_rgba(15,23,48,0.35)] sm:inset-x-10">
        <div className="flex items-center gap-2 border-b border-slate-100 bg-slate-50 px-4 py-2.5">
          <span className="h-2.5 w-2.5 rounded-full bg-[#ff5f57]" />
          <span className="h-2.5 w-2.5 rounded-full bg-[#febc2e]" />
          <span className="h-2.5 w-2.5 rounded-full bg-[#28c840]" />
          <span className="ml-3 flex-1 truncate rounded-full bg-white px-3 py-1 text-left text-[11px] font-medium text-slate-400 ring-1 ring-slate-200">
            atlasfit.shred.com.tr
          </span>
        </div>
        <img
          src="/marketing/brand-landing.webp"
          alt="Koç markası landing sayfası"
          loading="lazy"
          decoding="async"
          className="block h-[13.5rem] w-full object-cover object-top"
        />
      </div>
      {/* Öne eğik telefon */}
      <div className="absolute -bottom-3 right-3 w-[6.2rem] rotate-6 overflow-hidden rounded-[1.4rem] border-[5px] border-[#101828] bg-[#101828] shadow-[0_24px_50px_-18px_rgba(15,23,48,0.6)] sm:right-8 sm:w-[7rem]">
        <img
          src="/marketing/brand-landing-2.webp"
          alt="Aynı sitenin mobil görünümü"
          loading="lazy"
          decoding="async"
          className="block h-[11.5rem] w-full rounded-[1rem] object-cover object-left-top"
        />
      </div>
    </div>
  );
}

/* ---------- 2) Program oluşturucu: egzersiz listesi ---------- */
function VisualProgram() {
  return (
    <div className="relative h-[17rem] px-6 sm:px-12">
      {/* "Şablonların" rozeti + bağlantı çizgisi */}
      <div className="absolute right-8 top-0 z-10 sm:right-14">
        <span className="inline-flex items-center rounded-full px-4 py-1.5 text-xs font-bold text-white shadow-lg" style={{ backgroundColor: NAVY }}>
          Şablonların
        </span>
        <span className="absolute left-1/2 top-full h-4 w-px bg-slate-300" aria-hidden />
      </div>
      <div className="mt-7 space-y-2.5">
        {EXERCISES.map((ex) => (
          <div
            key={ex.name}
            className="flex items-center gap-3 rounded-2xl border border-slate-100 bg-white p-2.5 pr-4 shadow-[0_10px_30px_-16px_rgba(15,23,48,0.35)]"
          >
            <img
              src={ex.img}
              alt=""
              loading="lazy"
              decoding="async"
              className="h-12 w-16 shrink-0 rounded-xl object-cover"
            />
            <div className="min-w-0 flex-1 text-left">
              <p className="truncate text-sm font-bold" style={{ color: NAVY }}>
                {ex.name}
              </p>
              <p className="mt-0.5 flex items-center gap-1 text-[11px] font-medium text-slate-400">
                <Clock className="h-3 w-3" /> {ex.meta}
              </p>
            </div>
            <span className="flex h-7 w-7 items-center justify-center rounded-full bg-[#eef2ff] text-[#3d6fd1]">
              <Play className="h-3.5 w-3.5 fill-current" />
            </span>
            <Trash2 className="h-4 w-4 text-slate-300" />
          </div>
        ))}
      </div>
    </div>
  );
}

/* ---------- 3) Beslenme: makro halkası + öğünler ---------- */
function VisualNutrition() {
  // Halka segmentleri: protein / karbonhidrat / yağ
  const C = 2 * Math.PI * 40;
  const seg = (f: number) => `${f * C} ${C}`;
  return (
    <div className="relative flex h-[17rem] items-center gap-4 px-6 sm:gap-6 sm:px-10">
      {/* Makro halkası */}
      <div className="relative shrink-0">
        <svg viewBox="0 0 100 100" className="h-32 w-32 -rotate-90 sm:h-36 sm:w-36">
          <circle cx="50" cy="50" r="40" fill="none" stroke="#eef1f6" strokeWidth="12" />
          <circle cx="50" cy="50" r="40" fill="none" stroke="#3d6fd1" strokeWidth="12" strokeLinecap="round" strokeDasharray={seg(0.42)} />
          <circle cx="50" cy="50" r="40" fill="none" stroke="#f59e0b" strokeWidth="12" strokeLinecap="round" strokeDasharray={seg(0.26)} strokeDashoffset={-0.46 * C} />
          <circle cx="50" cy="50" r="40" fill="none" stroke="#10b981" strokeWidth="12" strokeLinecap="round" strokeDasharray={seg(0.16)} strokeDashoffset={-0.78 * C} />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-xl font-extrabold leading-none" style={{ color: NAVY }}>
            1.850
          </span>
          <span className="mt-1 text-[10px] font-bold uppercase tracking-wider text-slate-400">kcal</span>
        </div>
      </div>
      {/* Öğün satırları */}
      <div className="min-w-0 flex-1 space-y-2.5">
        {MEALS.map((m) => (
          <div
            key={m.name}
            className="flex items-center gap-3 rounded-2xl border border-slate-100 bg-white p-2 pr-3 shadow-[0_10px_30px_-16px_rgba(15,23,48,0.35)]"
          >
            <img
              src={m.img}
              alt=""
              loading="lazy"
              decoding="async"
              className="h-11 w-11 shrink-0 rounded-xl object-cover"
            />
            <div className="min-w-0 flex-1 text-left">
              <p className="truncate text-[13px] font-bold" style={{ color: NAVY }}>
                {m.name}
              </p>
              <p className="truncate text-[11px] font-medium text-slate-400">{m.meta}</p>
            </div>
            <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[#10b981] text-white">
              <Check className="h-3 w-3" strokeWidth={3} />
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ---------- 4) İlerleme: kilo grafiği ---------- */
function VisualProgress() {
  return (
    <div className="relative h-[17rem] px-6 sm:px-10">
      <div className="relative h-full overflow-hidden rounded-t-3xl border border-slate-100 bg-white shadow-[0_24px_60px_-24px_rgba(15,23,48,0.3)]">
        {/* Üst bilgi */}
        <div className="flex items-center justify-between px-5 pt-4">
          <div className="text-left">
            <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Kilo Takibi</p>
            <p className="text-lg font-extrabold" style={{ color: NAVY }}>
              82,4 kg
            </p>
          </div>
          <span className="rounded-full bg-[#e7f8f0] px-3 py-1 text-xs font-bold text-[#0e9f6e]">−6,2 kg</span>
        </div>
        {/* Grafik */}
        <svg viewBox="0 0 320 150" className="mt-2 w-full" preserveAspectRatio="none" aria-hidden>
          <defs>
            <linearGradient id="fs-area" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#3d6fd1" stopOpacity="0.28" />
              <stop offset="100%" stopColor="#3d6fd1" stopOpacity="0" />
            </linearGradient>
          </defs>
          {[30, 70, 110].map((y) => (
            <line key={y} x1="0" y1={y} x2="320" y2={y} stroke="#eef1f6" strokeWidth="1" />
          ))}
          <path
            d="M0 38 C 40 40, 60 58, 95 62 C 130 66, 150 52, 185 68 C 220 84, 240 92, 275 100 C 295 104, 308 108, 320 110 L 320 150 L 0 150 Z"
            fill="url(#fs-area)"
          />
          <path
            d="M0 38 C 40 40, 60 58, 95 62 C 130 66, 150 52, 185 68 C 220 84, 240 92, 275 100 C 295 104, 308 108, 320 110"
            fill="none"
            stroke="#3d6fd1"
            strokeWidth="3"
            strokeLinecap="round"
          />
          {[
            [0, 38],
            [95, 62],
            [185, 68],
            [275, 100],
          ].map(([x, y]) => (
            <circle key={x} cx={x} cy={y} r="4.5" fill="#fff" stroke="#3d6fd1" strokeWidth="3" />
          ))}
        </svg>
        {/* Hafta etiketleri */}
        <div className="flex justify-between px-5 text-[10px] font-semibold text-slate-400">
          <span>Hafta 1</span>
          <span>Hafta 4</span>
          <span>Hafta 8</span>
          <span>Hafta 12</span>
        </div>
        {/* Check-in rozeti */}
        <span
          className="absolute right-4 top-[46%] inline-flex items-center gap-1.5 rounded-full bg-white px-3 py-1.5 text-[11px] font-bold shadow-[0_10px_24px_-10px_rgba(15,23,48,0.4)] ring-1 ring-slate-100"
          style={{ color: NAVY }}
        >
          <Check className="h-3 w-3 text-[#0e9f6e]" strokeWidth={3} />
          Check-in alındı
        </span>
      </div>
    </div>
  );
}

/* ---------- 5) Bildirim: telefon + e-posta bildirimi ---------- */
function VisualNotification() {
  return (
    <div className="relative flex h-[17rem] justify-center overflow-hidden px-6">
      <div className="relative mt-1 w-full max-w-[21rem] overflow-hidden rounded-t-[2.4rem] border-[7px] border-b-0 border-[#101828] bg-[#101828] shadow-[0_30px_70px_-24px_rgba(15,23,48,0.6)]">
        {/* Canlı gradyan ekran */}
        <div
          className="relative h-full min-h-[16rem] rounded-t-[1.9rem] p-3 pt-9"
          style={{ background: "linear-gradient(160deg, #66a6ff 0%, #3d6fd1 45%, #7b5be6 100%)" }}
        >
          {/* Kamera adası */}
          <span className="absolute left-1/2 top-2.5 h-4 w-20 -translate-x-1/2 rounded-full bg-[#101828]" aria-hidden />
          {/* Bildirim kartı */}
          <div className="rounded-2xl bg-white/95 p-3.5 text-left shadow-xl backdrop-blur">
            <div className="flex items-center gap-2.5">
              <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-[#3d6fd1] text-white">
                <Mail className="h-[18px] w-[18px]" />
              </span>
              <div className="min-w-0 flex-1">
                <div className="flex items-baseline justify-between gap-2">
                  <p className="truncate text-[13px] font-extrabold" style={{ color: NAVY }}>
                    ATLAS FIT
                  </p>
                  <span className="shrink-0 text-[10px] font-medium text-slate-400">09:41</span>
                </div>
                <p className="mt-0.5 text-xs leading-snug text-slate-600">
                  Merhaba Emre, yeni programın hazırlandı. Hemen incele!
                </p>
              </div>
            </div>
          </div>
          {/* İkinci, yarım görünen bildirim */}
          <div className="mt-2.5 rounded-2xl bg-white/60 p-3.5 backdrop-blur-sm">
            <div className="flex items-center gap-2.5">
              <span className="h-9 w-9 shrink-0 rounded-xl bg-white/70" />
              <div className="flex-1 space-y-1.5">
                <span className="block h-2 w-24 rounded-full bg-white/80" />
                <span className="block h-2 w-36 rounded-full bg-white/60" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ---------- 6) Komisyon yok: satış/paket kartları ---------- */
function VisualCommission() {
  return (
    <div className="relative h-[17rem] overflow-hidden">
      {/* Ortadaki vurgulu satış kartı */}
      <div
        className="absolute left-1/2 top-1/2 z-10 w-56 -translate-x-1/2 -translate-y-1/2 rounded-2xl p-4 text-left shadow-[0_26px_60px_-20px_rgba(15,23,48,0.65)]"
        style={{ backgroundColor: NAVY }}
      >
        <div className="flex items-center gap-3">
          <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/10 text-[#7ee2a8]">
            <Dumbbell className="h-5 w-5" />
          </span>
          <div>
            <p className="text-[10px] font-bold uppercase tracking-wider text-white/60">Yeni Satış 🎉</p>
            <p className="text-lg font-extrabold text-white">2.999₺</p>
          </div>
        </div>
        <p className="mt-2.5 text-[11px] font-semibold text-white/70">3 AYDA FİT OL PAKETİ</p>
        <span className="mt-2 inline-flex items-center rounded-full bg-[#1f9d61]/20 px-2.5 py-1 text-[10px] font-bold text-[#7ee2a8]">
          %0 komisyon • tamamı sende
        </span>
      </div>
      {/* Etraftaki soluk paket kartları */}
      {PACKAGES.map((p) => (
        <div
          key={p.name}
          className={`absolute w-44 rounded-2xl border border-slate-100 bg-white/90 p-3 text-left shadow-[0_14px_36px_-18px_rgba(15,23,48,0.4)] ${p.pos}`}
        >
          <div className="flex items-center gap-2">
            <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-[#eef2ff]" style={{ color: NAVY }}>
              <p.icon className="h-3.5 w-3.5" />
            </span>
            <div className="min-w-0">
              <p className="truncate text-[10px] font-bold" style={{ color: NAVY }}>
                {p.name}
              </p>
              <p className="text-sm font-extrabold" style={{ color: NAVY }}>
                {p.price}
              </p>
            </div>
          </div>
          <p className="mt-1.5 flex items-center gap-1 text-[9px] font-medium text-slate-400">
            <Clock className="h-2.5 w-2.5" /> {p.time}
          </p>
        </div>
      ))}
    </div>
  );
}

export function FeatureShowcase() {
  const reduce = useReducedMotion();
  return (
    <div className="container mx-auto max-w-6xl">
      {/* Bölüm başlığı */}
      <motion.div
        initial={reduce ? false : { opacity: 0, y: 18 }}
        whileInView={reduce ? undefined : { opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.3 }}
        transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
        className="text-center"
      >
        <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-1.5 text-xs font-bold uppercase tracking-[0.2em] text-white/60">
          Özellikler
        </span>
        <h2 className="mt-5 text-4xl font-extrabold tracking-tight text-white md:text-6xl">
          Güçlü. Şık. <span className="text-white">Basit.</span>
        </h2>
        <p className="mx-auto mt-5 max-w-xl text-lg text-white/55">
          Koçluk işini büyütmen için gereken her araç — kutudan çıktığı gibi hazır.
        </p>
      </motion.div>

      {/* Kart ızgarası */}
      <div className="mt-14 grid gap-6 md:grid-cols-2 md:gap-7">
        <ShowcaseCard
          title="Tamamen Sana Ait"
          desc="Saniyeler içinde dilediğin tarzda web siteni oluştur; kendi adresinde, kendi markanla anında yayında."
          tint="#e8efff"
          delay={0}
        >
          <VisualWebsite />
        </ShowcaseCard>

        <ShowcaseCard
          title="Program Yaz"
          desc="Set arasındaki dinlenme süresine kadar her detayı planla; şablon kaydet, tek tıkla öğrencine ata."
          tint="#eef7df"
          delay={0.08}
        >
          <VisualProgram />
        </ShowcaseCard>

        <ShowcaseCard
          title="Makrolar Otomatik"
          desc="Kalori, protein, karbonhidrat ve yağ otomatik hesaplanır; öğrencin öğünlerini işaretler, sen izlersin."
          tint="#fff3e0"
          delay={0}
        >
          <VisualNutrition />
        </ShowcaseCard>

        <ShowcaseCard
          title="İlerleme Kendini Göstersin"
          desc="Check-in'ler, ölçüler ve fotoğraflar otomatik grafiklere dönüşür — gelişim tek bakışta ortada."
          tint="#f1ecff"
          delay={0.08}
        >
          <VisualProgress />
        </ShowcaseCard>

        <ShowcaseCard
          title="Öğrencin Hep Haberdar"
          desc="Yeni program ve check-in hatırlatmaları kaçırılmaması gereken anda öğrencinin cebine düşer."
          tint="#e6f4ff"
          delay={0}
        >
          <VisualNotification />
        </ShowcaseCard>

        <ShowcaseCard
          title="Komisyon Yok"
          desc="Paket fiyatını sen belirlersin, ödemeyi doğrudan sen alırsın — yaptığın satışların tamamı senin cebine girer."
          tint="#e4f7ee"
          delay={0.08}
        >
          <VisualCommission />
        </ShowcaseCard>
      </div>
    </div>
  );
}
