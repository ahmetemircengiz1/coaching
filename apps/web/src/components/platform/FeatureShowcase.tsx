"use client";

import { type ReactNode } from "react";
import {
  Calendar,
  Check,
  Clock,
  Dumbbell,
  Mail,
  Play,
  Star,
} from "lucide-react";

/**
 * FeatureShowcase — platform ana sayfası "Özellikler" sahnesinin kart ızgarası.
 *
 * Yıldız yolculuğundaki sahnenin İÇİNDE yaşar; bu yüzden tek ekrana sığacak
 * kadar kompakttır: masaüstünde 3 sütun × 2 satır, mobilde 2 sütun × 3 satır.
 * Koyu zeminde açık renkli kartlar; her kartta başlık + kısa açıklama ve o
 * özelliği anlatan minik canlı bir mockup (tarayıcı/telefon, egzersiz listesi,
 * makro halkası, kilo grafiği, bildirim, satış kartı). Mockup'lar kod ile
 * çizilir; fotoğraflar /marketing ekran görüntüleri + Unsplash stok kareleri.
 * Giriş animasyonu bilinçli yok — sahne geçişini yolculuk kamerası yapıyor.
 */

const NAVY = "#0f1730";

const EXERCISES: { name: string; meta: string; img: string; desktopOnly?: boolean }[] = [
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
    desktopOnly: true,
  },
];

const MEALS = [
  {
    name: "Tavuklu Bowl",
    meta: "420 kcal",
    img: "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?q=60&w=120&auto=format&fit=crop",
  },
  {
    name: "Somon & Sebze",
    meta: "510 kcal",
    img: "https://images.unsplash.com/photo-1467003909585-2f8a72700288?q=60&w=120&auto=format&fit=crop",
  },
];

function Card({
  title,
  desc,
  tint,
  children,
}: {
  title: string;
  desc: string;
  tint: string;
  children: ReactNode;
}) {
  return (
    <div className="group relative flex flex-col overflow-hidden rounded-2xl border border-white/10 bg-white text-left shadow-[0_24px_60px_-28px_rgba(0,0,0,0.6)] transition-transform duration-300 hover:-translate-y-1 md:rounded-3xl">
      {/* Alta doğru yumuşak renk yıkaması */}
      <div
        className="pointer-events-none absolute inset-0"
        style={{ background: `linear-gradient(180deg, #ffffff 0%, #ffffff 30%, ${tint} 100%)` }}
        aria-hidden
      />
      <div className="relative z-10 px-3.5 pt-3.5 text-center md:px-5 md:pt-5">
        <h3 className="text-sm font-extrabold tracking-tight md:text-lg" style={{ color: NAVY }}>
          {title}
        </h3>
        <p className="mx-auto mt-1 hidden max-w-[16rem] text-xs leading-snug text-slate-500 sm:block">
          {desc}
        </p>
      </div>
      <div className="relative z-10 mt-2.5 h-28 flex-1 md:mt-3 md:h-44">{children}</div>
    </div>
  );
}

/* 1) Marka web sitesi: tarayıcı + minik telefon */
function VisualWebsite() {
  return (
    <div className="relative h-full px-3 pb-2.5 md:px-5 md:pb-4">
      <div className="flex h-full flex-col overflow-hidden rounded-lg border border-slate-200 bg-white shadow-[0_16px_40px_-18px_rgba(15,23,48,0.35)] md:rounded-xl">
        <div className="flex shrink-0 items-center gap-1 border-b border-slate-100 bg-slate-50 px-2 py-1 md:gap-1.5 md:px-3 md:py-1.5">
          <span className="h-1.5 w-1.5 rounded-full bg-[#ff5f57]" />
          <span className="h-1.5 w-1.5 rounded-full bg-[#febc2e]" />
          <span className="h-1.5 w-1.5 rounded-full bg-[#28c840]" />
          <span className="ml-1.5 flex-1 truncate rounded-full bg-white px-2 py-0.5 text-left text-[8px] font-medium text-slate-400 ring-1 ring-slate-200 md:text-[10px]">
            atlasfit.shred.com.tr
          </span>
        </div>
        <img
          src="/marketing/brand-landing.webp"
          alt="Koç markası landing sayfası"
          loading="lazy"
          decoding="async"
          className="block min-h-0 w-full flex-1 object-cover object-top"
        />
      </div>
      {/* Öğrenci panelinin mobil ekran görüntüsüyle telefon */}
      <div className="absolute bottom-1 right-4 z-10 w-11 rotate-6 overflow-hidden rounded-lg border-[3px] border-[#101828] bg-[#101828] shadow-[0_14px_30px_-12px_rgba(15,23,48,0.6)] md:bottom-2 md:right-8 md:w-16 md:rounded-xl">
        <img
          src="/marketing/mobil-anasayfa.png"
          alt="Öğrenci panelinin mobil görünümü"
          loading="lazy"
          decoding="async"
          className="block h-16 w-full rounded-[5px] object-cover object-top md:h-[6.7rem] md:rounded-lg"
        />
      </div>
    </div>
  );
}

/* 2) Program oluşturucu: egzersiz listesi */
function VisualProgram() {
  return (
    <div className="relative h-full px-3 md:px-6">
      <div className="absolute right-4 top-0 z-10 md:right-8">
        <span
          className="inline-flex items-center rounded-full px-2.5 py-0.5 text-[8px] font-bold text-white shadow-md md:px-3 md:py-1 md:text-[10px]"
          style={{ backgroundColor: NAVY }}
        >
          Şablonların
        </span>
        <span className="absolute left-1/2 top-full h-2 w-px bg-slate-300" aria-hidden />
      </div>
      <div className="mt-5 space-y-1.5 md:mt-7 md:space-y-2">
        {EXERCISES.map((ex) => (
          <div
            key={ex.name}
            className={`${ex.desktopOnly ? "hidden md:flex" : "flex"} items-center gap-2 rounded-xl border border-slate-100 bg-white p-1.5 pr-2.5 shadow-[0_8px_22px_-12px_rgba(15,23,48,0.35)] md:gap-2.5 md:p-2`}
          >
            <img
              src={ex.img}
              alt=""
              loading="lazy"
              decoding="async"
              className="h-7 w-9 shrink-0 rounded-lg object-cover md:h-9 md:w-12"
            />
            <div className="min-w-0 flex-1">
              <p className="truncate text-[10px] font-bold md:text-xs" style={{ color: NAVY }}>
                {ex.name}
              </p>
              <p className="mt-px flex items-center gap-1 text-[8px] font-medium text-slate-400 md:text-[10px]">
                <Clock className="h-2 w-2 md:h-2.5 md:w-2.5" /> {ex.meta}
              </p>
            </div>
            <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[#eef2ff] text-[#3d6fd1] md:h-6 md:w-6">
              <Play className="h-2.5 w-2.5 fill-current" />
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

/* 3) Beslenme: makro halkası + öğünler */
function VisualNutrition() {
  const C = 2 * Math.PI * 40;
  const seg = (f: number) => `${f * C} ${C}`;
  return (
    <div className="flex h-full items-center gap-2 px-3 pb-2.5 md:gap-3 md:px-5 md:pb-4">
      <div className="relative shrink-0">
        <svg viewBox="0 0 100 100" className="h-16 w-16 -rotate-90 md:h-28 md:w-28">
          <circle cx="50" cy="50" r="40" fill="none" stroke="#eef1f6" strokeWidth="13" />
          <circle cx="50" cy="50" r="40" fill="none" stroke="#3d6fd1" strokeWidth="13" strokeLinecap="round" strokeDasharray={seg(0.42)} />
          <circle cx="50" cy="50" r="40" fill="none" stroke="#f59e0b" strokeWidth="13" strokeLinecap="round" strokeDasharray={seg(0.26)} strokeDashoffset={-0.46 * C} />
          <circle cx="50" cy="50" r="40" fill="none" stroke="#10b981" strokeWidth="13" strokeLinecap="round" strokeDasharray={seg(0.16)} strokeDashoffset={-0.78 * C} />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-[11px] font-extrabold leading-none md:text-sm" style={{ color: NAVY }}>
            1.850
          </span>
          <span className="mt-0.5 text-[6px] font-bold uppercase tracking-wider text-slate-400 md:text-[8px]">
            kcal
          </span>
        </div>
      </div>
      <div className="min-w-0 flex-1 space-y-1.5 md:space-y-2">
        {MEALS.map((m) => (
          <div
            key={m.name}
            className="flex items-center gap-1.5 rounded-xl border border-slate-100 bg-white p-1.5 pr-2 shadow-[0_8px_22px_-12px_rgba(15,23,48,0.35)] md:gap-2"
          >
            <img
              src={m.img}
              alt=""
              loading="lazy"
              decoding="async"
              className="h-7 w-7 shrink-0 rounded-lg object-cover md:h-8 md:w-8"
            />
            <div className="min-w-0 flex-1">
              <p className="truncate text-[9px] font-bold md:text-[11px]" style={{ color: NAVY }}>
                {m.name}
              </p>
              <p className="truncate text-[8px] font-medium text-slate-400 md:text-[9px]">{m.meta}</p>
            </div>
            <span className="flex h-3.5 w-3.5 shrink-0 items-center justify-center rounded-full bg-[#10b981] text-white md:h-4 md:w-4">
              <Check className="h-2 w-2" strokeWidth={3.5} />
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

/* 4) İlerleme: kilo grafiği */
function VisualProgress() {
  return (
    <div className="relative h-full px-3 pb-2.5 md:px-5 md:pb-4">
      <div className="relative flex h-full flex-col overflow-hidden rounded-xl border border-slate-100 bg-white shadow-[0_16px_40px_-18px_rgba(15,23,48,0.3)]">
        <div className="flex shrink-0 items-center justify-between px-2.5 pt-1.5 md:px-4 md:pt-2.5">
          <div>
            <p className="text-[7px] font-bold uppercase tracking-wider text-slate-400 md:text-[9px]">
              Kilo Takibi
            </p>
            <p className="text-xs font-extrabold leading-tight md:text-base" style={{ color: NAVY }}>
              82,4 kg
            </p>
          </div>
          <span className="rounded-full bg-[#e7f8f0] px-1.5 py-0.5 text-[8px] font-bold text-[#0e9f6e] md:px-2.5 md:text-[11px]">
            −6,2 kg
          </span>
        </div>
        <svg viewBox="0 0 320 120" className="mt-0.5 min-h-0 w-full flex-1 md:mt-1" preserveAspectRatio="none" aria-hidden>
          <defs>
            <linearGradient id="fs-area" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#3d6fd1" stopOpacity="0.28" />
              <stop offset="100%" stopColor="#3d6fd1" stopOpacity="0" />
            </linearGradient>
          </defs>
          {[30, 65, 100].map((y) => (
            <line key={y} x1="0" y1={y} x2="320" y2={y} stroke="#eef1f6" strokeWidth="1" />
          ))}
          <path
            d="M0 28 C 40 30, 60 46, 95 50 C 130 54, 150 42, 185 56 C 220 70, 240 78, 275 86 C 295 90, 308 94, 320 96 L 320 120 L 0 120 Z"
            fill="url(#fs-area)"
          />
          <path
            d="M0 28 C 40 30, 60 46, 95 50 C 130 54, 150 42, 185 56 C 220 70, 240 78, 275 86 C 295 90, 308 94, 320 96"
            fill="none"
            stroke="#3d6fd1"
            strokeWidth="3"
            strokeLinecap="round"
          />
          {[
            [0, 28],
            [95, 50],
            [185, 56],
            [275, 86],
          ].map(([x, y]) => (
            <circle key={x} cx={x} cy={y} r="4.5" fill="#fff" stroke="#3d6fd1" strokeWidth="3" />
          ))}
        </svg>
        <span
          className="absolute right-2 top-[52%] inline-flex items-center gap-1 rounded-full bg-white px-1.5 py-0.5 text-[7px] font-bold shadow-[0_8px_18px_-8px_rgba(15,23,48,0.4)] ring-1 ring-slate-100 md:px-2.5 md:py-1 md:text-[10px]"
          style={{ color: NAVY }}
        >
          <Check className="h-2 w-2 text-[#0e9f6e] md:h-2.5 md:w-2.5" strokeWidth={3.5} />
          Check-in alındı
        </span>
      </div>
    </div>
  );
}

/* 5) Bildirim: telefon + e-posta bildirimi */
function VisualNotification() {
  return (
    <div className="flex h-full justify-center px-3 pb-2.5 md:pb-4">
      <div className="h-full w-full max-w-[10rem] overflow-hidden rounded-xl border-[3px] border-[#101828] bg-[#101828] shadow-[0_20px_46px_-18px_rgba(15,23,48,0.6)] md:max-w-[12rem] md:rounded-2xl md:border-4">
        <div
          className="relative h-full rounded-lg p-1.5 pt-4 md:rounded-xl md:p-2 md:pt-6"
          style={{ background: "linear-gradient(160deg, #66a6ff 0%, #3d6fd1 45%, #7b5be6 100%)" }}
        >
          <span className="absolute left-1/2 top-1.5 h-2 w-10 -translate-x-1/2 rounded-full bg-[#101828] md:h-2.5 md:w-12" aria-hidden />
          <div className="rounded-xl bg-white/95 p-2 shadow-lg backdrop-blur md:p-2.5">
            <div className="flex items-start gap-1.5 md:gap-2">
              <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-md bg-[#3d6fd1] text-white md:h-6 md:w-6 md:rounded-lg">
                <Mail className="h-2.5 w-2.5 md:h-3 md:w-3" />
              </span>
              <div className="min-w-0 flex-1">
                <div className="flex items-baseline justify-between gap-1">
                  <p className="truncate text-[8px] font-extrabold md:text-[10px]" style={{ color: NAVY }}>
                    ATLAS FIT
                  </p>
                  <span className="shrink-0 text-[6px] font-medium text-slate-400 md:text-[8px]">09:41</span>
                </div>
                <p className="mt-px text-[7px] leading-snug text-slate-600 md:text-[9px]">
                  Merhaba Emre, yeni programın hazırlandı. Hemen incele!
                </p>
              </div>
            </div>
          </div>
          <div className="mt-1.5 rounded-xl bg-white/55 p-2 backdrop-blur-sm md:p-2.5">
            <div className="flex items-center gap-1.5">
              <span className="h-5 w-5 shrink-0 rounded-md bg-white/70 md:h-6 md:w-6" />
              <div className="flex-1 space-y-1">
                <span className="block h-1 w-12 rounded-full bg-white/80 md:h-1.5" />
                <span className="block h-1 w-20 rounded-full bg-white/60 md:h-1.5" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/* 6) Komisyon yok: satış kartı + arkada paketler */
function VisualCommission() {
  return (
    <div className="relative h-full">
      {/* Arkadaki soluk paket kartları */}
      <div className="absolute left-2 top-0 w-24 -rotate-3 rounded-xl border border-slate-100 bg-white/90 p-1.5 shadow-[0_10px_26px_-14px_rgba(15,23,48,0.4)] md:left-4 md:top-1 md:w-32 md:p-2">
        <div className="flex items-center gap-1.5">
          <span className="flex h-4 w-4 shrink-0 items-center justify-center rounded-md bg-[#eef2ff] md:h-5 md:w-5" style={{ color: NAVY }}>
            <Calendar className="h-2 w-2 md:h-2.5 md:w-2.5" />
          </span>
          <div className="min-w-0">
            <p className="truncate text-[6px] font-bold md:text-[8px]" style={{ color: NAVY }}>
              3 AYLIK DEĞİŞİM
            </p>
            <p className="text-[9px] font-extrabold md:text-[11px]" style={{ color: NAVY }}>
              4.500₺
            </p>
          </div>
        </div>
      </div>
      <div className="absolute bottom-2.5 right-2 w-24 rotate-2 rounded-xl border border-slate-100 bg-white/90 p-1.5 shadow-[0_10px_26px_-14px_rgba(15,23,48,0.4)] md:bottom-4 md:right-4 md:w-32 md:p-2">
        <div className="flex items-center gap-1.5">
          <span className="flex h-4 w-4 shrink-0 items-center justify-center rounded-md bg-[#eef2ff] md:h-5 md:w-5" style={{ color: NAVY }}>
            <Star className="h-2 w-2 md:h-2.5 md:w-2.5" />
          </span>
          <div className="min-w-0">
            <p className="truncate text-[6px] font-bold md:text-[8px]" style={{ color: NAVY }}>
              6 AYLIK PRO
            </p>
            <p className="text-[9px] font-extrabold md:text-[11px]" style={{ color: NAVY }}>
              9.230₺
            </p>
          </div>
        </div>
      </div>
      {/* Ortadaki vurgulu satış kartı */}
      <div
        className="absolute left-1/2 top-1/2 z-10 w-32 -translate-x-1/2 -translate-y-1/2 rounded-xl p-2 shadow-[0_18px_44px_-16px_rgba(15,23,48,0.65)] md:w-44 md:rounded-2xl md:p-3"
        style={{ backgroundColor: NAVY }}
      >
        <div className="flex items-center gap-1.5 md:gap-2.5">
          <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-lg bg-white/10 text-[#7ee2a8] md:h-8 md:w-8">
            <Dumbbell className="h-3 w-3 md:h-4 md:w-4" />
          </span>
          <div className="min-w-0">
            <p className="text-[6px] font-bold uppercase tracking-wider text-white/60 md:text-[8px]">
              Yeni Satış 🎉
            </p>
            <p className="text-xs font-extrabold text-white md:text-base">2.999₺</p>
          </div>
        </div>
        <span className="mt-1.5 inline-flex items-center rounded-full bg-[#1f9d61]/25 px-1.5 py-0.5 text-[6px] font-bold text-[#7ee2a8] md:mt-2 md:px-2 md:text-[8px]">
          %0 komisyon • tamamı sende
        </span>
      </div>
    </div>
  );
}

export function FeatureShowcase() {
  return (
    <div className="grid grid-cols-2 gap-2.5 md:grid-cols-3 md:gap-4">
      <Card
        title="Tamamen Sana Ait"
        desc="Dilediğin tarzda web siten kendi adresinde saniyeler içinde yayında."
        tint="#e8efff"
      >
        <VisualWebsite />
      </Card>
      <Card
        title="Program Yaz"
        desc="Set ve tekrara kadar planla; şablon kaydet, tek tıkla ata."
        tint="#eef7df"
      >
        <VisualProgram />
      </Card>
      <Card
        title="Makrolar Otomatik"
        desc="Kalori ve makrolar otomatik hesaplanır, öğünler işaretlenir."
        tint="#fff3e0"
      >
        <VisualNutrition />
      </Card>
      <Card
        title="İlerleme Görünür"
        desc="Check-in'ler ve ölçüler otomatik grafiklere dönüşür."
        tint="#f1ecff"
      >
        <VisualProgress />
      </Card>
      <Card
        title="Öğrencin Haberdar"
        desc="Yeni program ve hatırlatmalar öğrencinin cebine düşer."
        tint="#e6f4ff"
      >
        <VisualNotification />
      </Card>
      <Card
        title="Komisyon Yok"
        desc="Fiyatı sen belirlersin; satışların tamamı senin cebine girer."
        tint="#e4f7ee"
      >
        <VisualCommission />
      </Card>
    </div>
  );
}
