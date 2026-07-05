"use client";

import { useEffect, useRef, useState, type ReactNode, type MouseEvent as ReactMouseEvent } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  ArrowRight,
  Check,
  X,
  Globe,
  Dumbbell,
  Apple,
  LineChart,
  Smartphone,
  MessageCircle,
  Palette,
  Mail,
  Wallet,
  Zap,
  ShieldCheck,
  Plus,
  UserPlus,
  Maximize2,
} from "lucide-react";
import { PlatformFooter } from "@/src/components/platform/PlatformFooter";
import { MediaSlot } from "@/src/components/platform/MediaSlot";
import { CosmicHeroBackground } from "@/src/components/platform/CosmicHeroBackground";
import { StarfieldJourney } from "@/src/components/platform/StarfieldJourney";
import {
  motion,
  AnimatePresence,
  useReducedMotion,
  useScroll,
  useTransform,
  type MotionValue,
} from "framer-motion";

const SIGNUP_HREF = "/platform/auth?mode=signup&tier=3";
const SUPPORT_EMAIL = "destek@reppanel.com";
const ACCENT = "#3d6fd1";

// Premium birincil buton: dikey gradyan + iç ışık halkası + yumuşak mavi glow
const PRIMARY_BTN =
  "ring-1 ring-inset ring-white/25 shadow-[0_8px_28px_-8px_rgba(61,111,209,0.55)] transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_14px_38px_-8px_rgba(61,111,209,0.78)] hover:brightness-[1.08]";
const PRIMARY_STYLE = { backgroundImage: "linear-gradient(180deg, #4d7ddb 0%, #2f57b8 100%)" };
// Camsı ikincil buton
const GLASS_BTN =
  "border border-white/12 bg-white/[0.06] text-white backdrop-blur-md transition-all duration-300 hover:border-white/25 hover:bg-white/[0.12]";

const NAV_LINKS = [
  { label: "Nasıl çalışır", href: "#nasilcalisir", id: "nasilcalisir" },
  { label: "Özellikler", href: "#ozellikler", id: "ozellikler" },
  { label: "S.S.S.", href: "#sss", id: "sss" },
  { label: "İletişim", href: "#iletisim", id: "iletisim" },
];

/** Scroll'da görünüme girince yumuşak fade-up (reduced-motion'da anında görünür). */
function Reveal({
  children,
  className,
  delay = 0,
}: {
  children: ReactNode;
  className?: string;
  delay?: number;
}) {
  const reduce = useReducedMotion();
  return (
    <motion.div
      className={className}
      initial={reduce ? false : { opacity: 0, y: 18 }}
      whileInView={reduce ? undefined : { opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.7, delay, ease: [0.16, 1, 0.3, 1] }}
    >
      {children}
    </motion.div>
  );
}

/** Derinlikten yaklaşma — bölüm uzaktan (küçük + bulanık) yakına gelir ("karşımıza geliyor" hissi). */
function DepthReveal({ children, className }: { children: ReactNode; className?: string }) {
  const reduce = useReducedMotion();
  if (reduce) return <div className={className}>{children}</div>;
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, scale: 0.78, filter: "blur(14px)" }}
      whileInView={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
      viewport={{ once: true, amount: 0.3 }}
      transition={{ duration: 0.95, ease: [0.16, 1, 0.3, 1] }}
    >
      {children}
    </motion.div>
  );
}

/**
 * Z-yolculuk sahnesi — scroll'a göre derinlikten (küçük+bulanık) merkeze gelir,
 * sonra büyüyüp yanından akar. Sayfa dikey kaymaz; kamera ileri ilerler.
 */
// Sahnenin scroll içindeki odak merkezi ve segment genişliği
const Z_DWELL = 0.16; // |u| <= bu: sahne net, sabit (duraksama)
const Z_TRANS = 0.34; // bu noktada sahne tamamen kaybolur; [TRANS, segment] arası saf yıldız boşluğu

function ZScene({
  progress,
  index,
  count,
  children,
}: {
  progress: MotionValue<number>;
  index: number;
  count: number;
  children: ReactNode;
}) {
  const fc = count > 1 ? index / (count - 1) : 0.5; // odak progress'i
  const seg = count > 1 ? 1 / (count - 1) : 1; // sahneler arası mesafe
  const u = (p: number) => (p - fc) / seg; // -: yaklaşıyor, 0: odak, +: uzaklaşıyor

  const scale = useTransform(progress, (p) => {
    const x = u(p);
    const ax = Math.abs(x);
    if (ax <= Z_DWELL) return 1;
    const t = Math.min((ax - Z_DWELL) / (Z_TRANS - Z_DWELL), 1);
    return x < 0 ? 1 - 0.45 * t : 1 + 1.1 * t; // uzakta küçük, yanından geçerken büyür
  });
  const opacity = useTransform(progress, (p) => {
    const ax = Math.abs(u(p));
    if (ax <= Z_DWELL) return 1;
    if (ax >= Z_TRANS) return 0;
    return 1 - (ax - Z_DWELL) / (Z_TRANS - Z_DWELL);
  });
  const filter = useTransform(progress, (p) => {
    const ax = Math.abs(u(p));
    if (ax <= Z_DWELL) return "blur(0px)";
    const t = Math.min((ax - Z_DWELL) / (Z_TRANS - Z_DWELL), 1);
    return `blur(${(t * 7).toFixed(2)}px)`;
  });
  const pointerEvents = useTransform(opacity, (o) => (o > 0.85 ? "auto" : "none"));

  return (
    <motion.div
      className="absolute inset-0 flex items-center justify-center"
      style={{ scale, opacity, filter, pointerEvents, zIndex: count - index }}
    >
      {children}
    </motion.div>
  );
}

/** Bölüm etiketi — başına minik lime nokta (beyaz metinde kontrollü marka ipliği). */
function Eyebrow({ children }: { children: ReactNode }) {
  return (
    <span className="inline-flex items-center gap-2 font-mono text-xs font-semibold uppercase tracking-[0.3em] text-white/55">
      <span className="h-1 w-1 rounded-full" style={{ backgroundColor: ACCENT }} aria-hidden />
      {children}
    </span>
  );
}

/** Kart üzerinde imleci takip eden yumuşak lime parıltı (yalnızca hover'da). */
function Spotlight() {
  return (
    <span
      aria-hidden
      className="pointer-events-none absolute inset-0 z-20 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
      style={{
        background:
          "radial-gradient(240px circle at var(--mx, 50%) var(--my, 50%), rgba(61,111,209,0.10), transparent 72%)",
      }}
    />
  );
}

/** İmleç konumunu CSS değişkenlerine yazar (Spotlight için). */
function handleSpotlight(e: ReactMouseEvent<HTMLElement>) {
  const el = e.currentTarget;
  const r = el.getBoundingClientRect();
  el.style.setProperty("--mx", `${e.clientX - r.left}px`);
  el.style.setProperty("--my", `${e.clientY - r.top}px`);
}

/** Sonsuz akan güven şeridi (reduced-motion'da sabit). */
function ValueMarquee({ items }: { items: string[] }) {
  const reduce = useReducedMotion();

  const Chip = ({ t }: { t: string }) => (
    <span className="flex items-center gap-2.5 whitespace-nowrap text-sm font-semibold uppercase tracking-wider text-white/55">
      <span className="h-1.5 w-1.5 rounded-full" style={{ backgroundColor: ACCENT }} />
      {t}
    </span>
  );

  if (reduce) {
    return (
      <div className="flex flex-wrap items-center justify-center gap-x-8 gap-y-3">
        {items.map((t) => (
          <Chip key={t} t={t} />
        ))}
      </div>
    );
  }

  const Row = () => (
    <div className="flex shrink-0 items-center gap-10 pr-10">
      {items.map((t) => (
        <Chip key={t} t={t} />
      ))}
    </div>
  );

  return (
    <div className="relative flex overflow-hidden [mask-image:linear-gradient(90deg,transparent,black_12%,black_88%,transparent)]">
      <motion.div
        className="flex"
        animate={{ x: ["0%", "-50%"] }}
        transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
      >
        <Row />
        <Row />
      </motion.div>
    </div>
  );
}

/** Stripe tarzı dönüşümlü özellik-detay satırı. */
function FeatureRow({
  eyebrow,
  title,
  desc,
  bullets,
  slot,
  reverse = false,
}: {
  eyebrow: string;
  title: string;
  desc: string;
  bullets: string[];
  slot: ReactNode;
  reverse?: boolean;
}) {
  return (
    <Reveal>
      <div className="grid items-center gap-10 md:grid-cols-2 md:gap-16">
        <div className={reverse ? "md:order-2" : ""}>
          <Eyebrow>{eyebrow}</Eyebrow>
          <h3 className="mt-4 text-3xl font-extrabold tracking-tight text-white md:text-4xl">
            {title}
          </h3>
          <p className="mt-5 text-lg leading-relaxed text-white/55">{desc}</p>
          <ul className="mt-8 space-y-3">
            {bullets.map((b) => (
              <li key={b} className="flex items-start gap-3 text-white/75">
                <span
                  className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full"
                  style={{ backgroundColor: `${ACCENT}22` }}
                >
                  <Check className="h-3.5 w-3.5" style={{ color: ACCENT }} />
                </span>
                <span className="text-base">{b}</span>
              </li>
            ))}
          </ul>
        </div>
        <div className={reverse ? "md:order-1" : ""}>
          <div className="relative">
            <div
              className="pointer-events-none absolute -inset-6 -z-10 rounded-[3rem] opacity-30 blur-3xl"
              style={{ background: `radial-gradient(circle at 50% 50%, ${ACCENT}, transparent 70%)` }}
            />
            {slot}
          </div>
        </div>
      </div>
    </Reveal>
  );
}

/** Tek görsel — hafif eğik (çapraz) kart; hover'da düzelir, tıklayınca büyür (lightbox). */
function ShowcaseImage({
  src,
  alt,
  tilt,
  onZoom,
}: {
  src: string;
  alt: string;
  tilt: string;
  onZoom: (src: string, alt: string) => void;
}) {
  return (
    <button
      type="button"
      onClick={() => onZoom(src, alt)}
      aria-label={`${alt} — büyüt`}
      className={`group relative block w-full overflow-hidden rounded-2xl border border-white/10 bg-[#0c0c0c] shadow-[0_30px_70px_-25px_rgba(0,0,0,0.85)] transition-transform duration-500 hover:rotate-0 hover:scale-[1.02] ${tilt}`}
      style={{ aspectRatio: "16/9" }}
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={src} alt={alt} loading="lazy" className="h-full w-full object-cover object-top" />
      <span className="pointer-events-none absolute right-3 top-3 flex h-9 w-9 items-center justify-center rounded-full bg-black/50 text-white/85 opacity-0 backdrop-blur-md transition-opacity duration-300 group-hover:opacity-100">
        <Maximize2 className="h-4 w-4" />
      </span>
    </button>
  );
}

/** İki landing tasarımı çapraz üst üste — dokununca öne gelir; öndekine tekrar dokununca büyür. */
function StackedLandings({
  images,
  onZoom,
}: {
  images: { src: string; alt: string }[];
  onZoom: (src: string, alt: string) => void;
}) {
  const [front, setFront] = useState(0);
  return (
    <div className="relative mx-auto aspect-[16/9] w-full">
      {images.map((img, i) => {
        const isFront = i === front;
        const backRotate = i === 0 ? -8 : 8;
        const backX = i === 0 ? "-6%" : "6%";
        return (
          <motion.button
            key={img.src}
            type="button"
            onClick={() => (isFront ? onZoom(img.src, img.alt) : setFront(i))}
            aria-label={isFront ? `${img.alt} — büyüt` : `${img.alt} — öne getir`}
            initial={false}
            animate={
              isFront
                ? { rotate: -1.5, scale: 1, x: "0%", y: "0%", opacity: 1, zIndex: 20 }
                : { rotate: backRotate, scale: 0.92, x: backX, y: "7%", opacity: 0.8, zIndex: 10 }
            }
            transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
            className="group absolute inset-0 overflow-hidden rounded-2xl border border-white/10 bg-[#0c0c0c] shadow-[0_30px_70px_-25px_rgba(0,0,0,0.85)]"
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={img.src} alt={img.alt} loading="lazy" className="h-full w-full object-cover object-top" />
            {isFront ? (
              <span className="pointer-events-none absolute right-3 top-3 flex h-9 w-9 items-center justify-center rounded-full bg-black/50 text-white/85 opacity-0 backdrop-blur-md transition-opacity duration-300 group-hover:opacity-100">
                <Maximize2 className="h-4 w-4" />
              </span>
            ) : (
              <span className="absolute inset-0 bg-black/35 transition-colors group-hover:bg-black/15" aria-hidden />
            )}
          </motion.button>
        );
      })}
      <span className="pointer-events-none absolute -bottom-8 left-0 right-0 text-center text-xs text-white/40">
        Kartlara dokun — öne getir &amp; büyüt
      </span>
    </div>
  );
}

type Feature = {
  icon: typeof Globe;
  title: string;
  desc: string;
  details: { label: string; text: string }[];
};

const FEATURES: Feature[] = [
  {
    icon: Globe,
    title: "Kendi Markalı Web Siten",
    desc: "Sana özel alan adı, profesyonel tasarım. Dakikalar içinde yayında.",
    details: [
      { label: "Hazır temalar", text: "Onlarca hazır tasarımdan seç; logonu, renklerini ve içeriğini gir." },
      { label: "Kendi alan adın", text: "koçadı.shred.com.tr ile başla, dilediğinde kendi alan adını bağla." },
      { label: "Anında yayında", text: "Yaptığın her değişiklik canlı sitende anında görünür." },
    ],
  },
  {
    icon: Dumbbell,
    title: "Antrenman Programı",
    desc: "Kapsamlı egzersiz kütüphanesiyle hızlıca program oluştur.",
    details: [
      { label: "Egzersiz kütüphanesi", text: "Yüzlerce hazır egzersiz; video ve açıklamalarla destekli." },
      { label: "Hızlı oluşturucu", text: "Programları dakikalar içinde kur, şablon olarak kaydet ve yeniden kullan." },
      { label: "Tek tıkla atama", text: "Hazırladığın programı öğrencine tek tıkla gönder." },
    ],
  },
  {
    icon: Apple,
    title: "Beslenme Planı",
    desc: "Kalori ve makro hesaplamalı öğün takibi.",
    details: [
      { label: "Makro hesaplama", text: "Kalori, protein, karbonhidrat ve yağ otomatik hesaplanır." },
      { label: "Besin veritabanı", text: "Geniş besin listesiyle öğünleri saniyeler içinde oluştur." },
      { label: "Öğün takibi", text: "Öğrencin günlük öğünlerini işaretler, sen ilerlemesini izlersin." },
    ],
  },
  {
    icon: LineChart,
    title: "Akıllı İlerleme",
    desc: "Gelişim grafikleri ve check-in'ler tek ekranda.",
    details: [
      { label: "Otomatik grafikler", text: "Kilo, ölçü ve performans verileri otomatik grafiklere dönüşür." },
      { label: "Haftalık check-in", text: "Öğrenci formu doldurur, veriler doğrudan paneline akar." },
      { label: "Fotoğraf takibi", text: "Önce/sonra fotoğraflarıyla görsel ilerlemeyi takip et." },
    ],
  },
  {
    icon: Smartphone,
    title: "Öğrenci Mobil Paneli",
    desc: "Öğrencilerin her şeye telefonundan ulaşır.",
    details: [
      { label: "Cepte her şey", text: "Program, beslenme ve check-in tek mobil deneyimde." },
      { label: "Senin markanla", text: "Öğrenci senin markanı görür — Shred'i değil." },
      { label: "Hatırlatmalar", text: "Yeni program ve check-in hatırlatmaları anında ulaşır." },
    ],
  },
  {
    icon: MessageCircle,
    title: "WhatsApp Entegrasyonu",
    desc: "Kesintisiz iletişim için tek tıkla ulaşım.",
    details: [
      { label: "Tek tık", text: "Öğrenci sitenden WhatsApp'a tek tıkla ulaşır." },
      { label: "Hazır mesaj", text: "Önceden tanımlı mesajla iletişim anında başlar." },
      { label: "Daha hızlı dönüş", text: "Soruları kaybetmeden, hızlıca yanıtla." },
    ],
  },
];

const WHY_CARDS = [
  {
    icon: Wallet,
    title: "Komisyon yok",
    desc: "Öğrencilerinden aldığın ücretin tamamı sende kalır. Shred araya girmez.",
  },
  {
    icon: Palette,
    title: "Tamamen senin markan",
    desc: "Logo, renk, alan adı — site baştan sona senin markanı yansıtır.",
  },
  {
    icon: Zap,
    title: "Dakikalar içinde",
    desc: "Kod yok, kurulum yok. Kaydol, markanı gir, anında yayında.",
  },
  {
    icon: ShieldCheck,
    title: "Türkçe & güvenli",
    desc: "Baştan sona Türkçe, iyzico altyapısına hazır, verilerin güvende.",
  },
];

const FAQ = [
  {
    q: "Kod veya teknik bilgi gerekiyor mu?",
    a: "Hayır. Site, panel ve öğrenci uygulaması hazır geliyor. Sen sadece marka bilgilerini girip yayına alıyorsun; tek bir satır kod yazmana gerek yok.",
  },
  {
    q: "Gerçekten ücretsiz mi?",
    a: "Evet. Şu an tüm özellikler herkese açık ve ücretsiz. İleride premium paketler ekleyeceğiz, ancak bugün kullandığın özellikler için sürpriz bir ücret çıkmayacak.",
  },
  {
    q: "Öğrencilerimden nasıl ödeme alırım?",
    a: "Ödemeyi kendi yöntemlerinle alırsın; Shred araya girmez ve komisyon kesmez. Belirlediğin ücretin tamamı sende kalır.",
  },
  {
    q: "Kendi alan adımı bağlayabilir miyim?",
    a: "Evet. Başlangıçta siten koçadı.shred.com.tr adresinde yayında olur; istediğin zaman kendi alan adını (ör. seninmarkan.com) bağlayabilirsin.",
  },
];

const JOURNEY_STEPS = [
  { icon: UserPlus, title: "Kaydol & markanı seç", desc: "E-postanla kaydol, marka adını ve site adresini seç." },
  { icon: Globe, title: "Siten yayına alınır", desc: "Tema, logo ve renk ekle; koçadı.shred.com.tr'de anında canlı." },
  { icon: Dumbbell, title: "Program & beslenme ver", desc: "Planı hazırla, tek tıkla öğrencilerine ata." },
  { icon: LineChart, title: "Check-in ile takip et", desc: "Check-in, foto ve ölçüler otomatik grafiklere döner." },
];

const MARQUEE_ITEMS = [
  "Komisyon yok",
  "Kendi alan adın",
  "Sınırsız öğrenci",
  "Antrenman & beslenme",
  "Otomatik takip",
  "Türkçe destek",
  "iyzico'ya hazır",
  "Kod gerekmez",
];

export default function PlatformHomePage() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [selectedFeature, setSelectedFeature] = useState<number | null>(null);
  const [zoomImg, setZoomImg] = useState<{ src: string; alt: string } | null>(null);
  const openZoom = (src: string, alt: string) => setZoomImg({ src, alt });
  const reduce = useReducedMotion();

  // Z-yolculuk: scroll, sahnelerin arasından geçen "kamerayı" ileri taşır (sayfa dikey kaymaz)
  const journeyRef = useRef<HTMLElement>(null);
  const { scrollYProgress: journeyProgress } = useScroll({
    target: journeyRef,
    offset: ["start start", "end end"],
  });

  // Yumuşak kaydırma + menü açıkken body kilidi & Escape
  useEffect(() => {
    document.documentElement.style.scrollBehavior = "smooth";
    return () => {
      document.documentElement.style.scrollBehavior = "";
    };
  }, []);

  useEffect(() => {
    const lock = menuOpen || selectedFeature !== null || zoomImg !== null;
    document.body.style.overflow = lock ? "hidden" : "";
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setMenuOpen(false);
        setSelectedFeature(null);
        setZoomImg(null);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onKey);
    };
  }, [menuOpen, selectedFeature, zoomImg]);

  const activeFeat = selectedFeature !== null ? FEATURES[selectedFeature] : null;

  // ===== Z-YOLCULUK SAHNELERİ (derinlikten gelir) =====
  const sceneHero = (
    <>
      <div className="absolute inset-0" aria-hidden>
        <CosmicHeroBackground />
      </div>
      <div className="relative z-10 mx-auto flex max-w-5xl translate-y-[2vh] flex-col items-center px-6 text-center">
        <h1 className="text-5xl font-extrabold leading-[1.05] tracking-tighter text-white md:text-7xl lg:text-8xl">
          Kendi koçluk markanı
          <br />
          <span className="text-white">dakikalar içinde</span> kur.
        </h1>
        {/* ufuk çizgisi bu boşluğun içinde kalır; iki yazı da çizgiye değmez */}
        <div aria-hidden className="h-[15vh] md:h-[17vh]" />
        <p className="mx-auto max-w-2xl -translate-y-[5vh] text-lg leading-relaxed text-white/65 md:text-xl">
          Sana özel marka web siten, güçlü antrenman & beslenme oluşturucu ve otomatik
          takip sistemi. Tüm öğrencilerini tek panelde profesyonelce yönet.
        </p>
      </div>
    </>
  );

  const sceneFlow = (
    <div className="mx-auto max-w-5xl px-6 text-center">
      <Eyebrow>Nasıl çalışır</Eyebrow>
      <h2 className="mt-4 text-4xl font-extrabold tracking-tight text-white md:text-6xl">
        Kayıttan takibe, tek akış.
      </h2>
      <p className="mx-auto mt-5 max-w-xl text-lg text-white/55">
        Bir online koçun günlük işi baştan sona burada. Her adım birbirine bağlı, hepsi tek panelde.
      </p>
      <div className="relative mt-16">
        {/* sıralı akışı bağlayan yatay çizgi */}
        <div
          className="absolute left-[12%] right-[12%] top-8 hidden h-px md:block"
          style={{ background: `linear-gradient(90deg, transparent, ${ACCENT}66 18%, ${ACCENT}66 82%, transparent)` }}
          aria-hidden
        />
        <div className="grid grid-cols-2 gap-x-6 gap-y-10 md:grid-cols-4">
          {JOURNEY_STEPS.map((s, i) => (
            <div key={s.title} className="relative flex flex-col items-center px-2 text-center">
              <div
                className="relative z-10 flex h-16 w-16 items-center justify-center rounded-full border bg-[#0a0a0a] shadow-[0_8px_24px_-8px_rgba(61,111,209,0.5)]"
                style={{ borderColor: `${ACCENT}55`, color: ACCENT }}
              >
                <s.icon className="h-6 w-6" />
                <span
                  className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full text-[10px] font-bold text-white"
                  style={{ backgroundColor: ACCENT }}
                >
                  {i + 1}
                </span>
              </div>
              <h3 className="mt-4 text-base font-bold tracking-tight text-white">{s.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-white/55">{s.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const sceneFeatures = (
    <div className="mx-auto max-w-5xl px-6 text-center">
      <Eyebrow>Özellikler</Eyebrow>
      <h2 className="mt-4 text-4xl font-extrabold tracking-tight text-white md:text-6xl">
        Güçlü. Şık. <span className="text-white">Basit.</span>
      </h2>
      <p className="mx-auto mt-5 max-w-xl text-lg text-white/55">
        İşini büyütmen için tasarlanmış profesyonel araçlar. Detay için bir karta dokun.
      </p>
      <div className="mt-12 grid grid-cols-2 gap-3 sm:grid-cols-3">
        {FEATURES.map((f, i) => (
          <button
            key={f.title}
            type="button"
            onClick={() => setSelectedFeature(i)}
            aria-label={`${f.title} — detayları gör`}
            className="group flex flex-col items-center gap-3 rounded-2xl border border-white/10 bg-white/[0.03] p-5 text-center backdrop-blur-sm transition-all hover:border-white/25 hover:bg-white/[0.06]"
          >
            <div
              className="flex h-12 w-12 items-center justify-center rounded-xl border border-white/10 bg-[#0c0c0c] transition-transform group-hover:scale-110"
              style={{ color: ACCENT }}
            >
              <f.icon className="h-6 w-6" />
            </div>
            <h3 className="text-sm font-bold tracking-tight text-white">{f.title}</h3>
          </button>
        ))}
      </div>
    </div>
  );

  const sceneWhy = (
    <div className="mx-auto max-w-5xl px-6 text-center">
      <h2 className="text-4xl font-extrabold tracking-tighter text-white md:text-6xl lg:text-7xl">
        Neden <span className="text-white">SHRED</span>?
      </h2>
    </div>
  );

  const SCENES = [sceneHero, sceneFlow, sceneFeatures, sceneWhy];

  return (
    <div className="relative min-h-screen bg-[#050505] font-sans text-white selection:bg-[#3d6fd1]/30 selection:text-white">
      {/* ============ SCROLL'A KİLİTLİ YILDIZ YOLCULUĞU (sabit, tüm sayfa arkası) ============ */}
      <StarfieldJourney />

      {/* ============ ORTAK AMBİYANS ZEMİN (statik renk parıltıları) ============ */}
      <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden" aria-hidden>
        <div
          className="absolute inset-0 opacity-[0.05]"
          style={{ backgroundImage: "radial-gradient(#ffffff 1px, transparent 1px)", backgroundSize: "42px 42px" }}
        />
        <div
          className="absolute left-[-12%] top-[28%] h-[680px] w-[680px] rounded-full opacity-[0.13] blur-[160px]"
          style={{ backgroundColor: ACCENT }}
        />
        <div
          className="absolute right-[-14%] top-[56%] h-[720px] w-[720px] rounded-full opacity-[0.11] blur-[170px]"
          style={{ backgroundColor: ACCENT }}
        />
        <div
          className="absolute bottom-[6%] left-[26%] h-[620px] w-[620px] rounded-full opacity-[0.10] blur-[160px]"
          style={{ backgroundColor: ACCENT }}
        />
      </div>

      {/* ============ HEADER (minimal: SHRED solda, menü sağda) ============ */}
      <motion.nav
        initial={reduce ? false : { y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        className="absolute top-0 z-50 w-full py-6"
      >
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between rounded-2xl bg-transparent px-2 py-2">
            <Link href="/platform" className="group flex items-center">
              <span className="text-2xl font-extrabold tracking-tighter text-white transition-colors group-hover:text-[#3d6fd1]">
                SHRED
              </span>
            </Link>

            {/* Şık hamburger menü butonu */}
            <button
              type="button"
              onClick={() => setMenuOpen(true)}
              aria-label="Menüyü aç"
              aria-expanded={menuOpen}
              className="group flex h-11 items-center gap-3 rounded-full border border-white/12 bg-white/[0.06] pl-5 pr-4 backdrop-blur-md transition-all duration-300 hover:border-white/25 hover:bg-white/[0.12]"
            >
              <span className="text-sm font-medium tracking-tight text-white/80 transition-colors group-hover:text-white">
                Menü
              </span>
              <span className="flex flex-col items-end gap-[5px]" aria-hidden>
                <span className="block h-[2px] w-5 rounded-full bg-white/90 transition-all duration-300 group-hover:w-3.5" />
                <span className="block h-[2px] w-3.5 rounded-full bg-white/90 transition-all duration-300 group-hover:w-5" />
              </span>
            </button>
          </div>
        </div>
      </motion.nav>

      {/* ============ TAM EKRAN MENÜ ============ */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="fixed inset-0 z-[60] flex flex-col bg-[#050505]/95 px-6 pb-12 pt-7 backdrop-blur-2xl"
          >
            {/* Üst çubuk */}
            <div className="mx-auto flex w-full max-w-5xl items-center justify-between">
              <span className="text-2xl font-extrabold tracking-tighter text-white">
                SHRED
              </span>
              <button
                type="button"
                onClick={() => setMenuOpen(false)}
                aria-label="Menüyü kapat"
                className="flex h-11 w-11 items-center justify-center rounded-full border border-white/12 bg-white/[0.06] text-white/80 backdrop-blur-md transition-all duration-300 hover:border-white/25 hover:bg-white/[0.12] hover:text-white"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Menü bağlantıları (ortalı) */}
            <nav className="mx-auto flex w-full max-w-md flex-1 flex-col items-center justify-center gap-1">
              {NAV_LINKS.map((item, i) => (
                <motion.a
                  key={item.id}
                  href={item.href}
                  onClick={() => setMenuOpen(false)}
                  initial={reduce ? false : { opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: 0.05 + i * 0.06, ease: [0.16, 1, 0.3, 1] }}
                  className="py-3 text-3xl font-bold tracking-tight text-white/70 transition-colors hover:text-white md:text-4xl"
                >
                  {item.label}
                </motion.a>
              ))}
              <motion.div
                initial={reduce ? false : { opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.05 + NAV_LINKS.length * 0.06, ease: [0.16, 1, 0.3, 1] }}
              >
                <Link
                  href="/platform/pricing"
                  onClick={() => setMenuOpen(false)}
                  className="block py-3 text-3xl font-bold tracking-tight text-white/70 transition-colors hover:text-white md:text-4xl"
                >
                  Fiyatlandırma
                </Link>
              </motion.div>
            </nav>

            {/* Alt aksiyonlar */}
            <div className="mx-auto flex w-full max-w-sm flex-col gap-3">
              <Link href="/platform/auth" onClick={() => setMenuOpen(false)}>
                <Button
                  variant="ghost"
                  className={`h-14 w-full rounded-xl text-base font-semibold ${GLASS_BTN}`}
                >
                  Giriş
                </Button>
              </Link>
              <Link href={SIGNUP_HREF} onClick={() => setMenuOpen(false)}>
                <Button
                  className={`h-14 w-full rounded-xl text-base font-semibold text-white ${PRIMARY_BTN}`}
                  style={PRIMARY_STYLE}
                >
                  Ücretsiz Başla
                </Button>
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ============ ÖZELLİK DETAY MODAL'I ============ */}
      <AnimatePresence>
        {activeFeat && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-[70] flex items-center justify-center p-4 sm:p-6"
          >
            <div
              className="absolute inset-0 bg-black/75 backdrop-blur-sm"
              onClick={() => setSelectedFeature(null)}
              aria-hidden
            />
            <motion.div
              initial={reduce ? { opacity: 0 } : { opacity: 0, scale: 0.95, y: 24 }}
              animate={reduce ? { opacity: 1 } : { opacity: 1, scale: 1, y: 0 }}
              exit={reduce ? { opacity: 0 } : { opacity: 0, scale: 0.97, y: 12 }}
              transition={{ duration: 0.28, ease: [0.16, 1, 0.3, 1] }}
              role="dialog"
              aria-modal="true"
              aria-label={activeFeat.title}
              className="relative z-10 max-h-[88vh] w-full max-w-2xl overflow-y-auto overflow-x-hidden rounded-3xl border border-white/10 bg-[#0a0a0a] shadow-[0_40px_120px_-20px_rgba(0,0,0,0.9)]"
            >
              {/* Görsel başlık */}
              <div className="relative h-36 w-full overflow-hidden border-b border-white/5 bg-[#0a0a0a]">
                <div
                  className="absolute inset-0"
                  style={{ background: `radial-gradient(circle at 50% 130%, ${ACCENT}33, transparent 60%)` }}
                />
                <div
                  className="absolute inset-0 opacity-[0.05]"
                  style={{ backgroundImage: "radial-gradient(#fff 1px, transparent 1px)", backgroundSize: "22px 22px" }}
                />
                <div className="absolute inset-0 flex items-center justify-center">
                  <div
                    className="flex h-20 w-20 items-center justify-center rounded-3xl border border-white/10 bg-[#0c0c0c] shadow-[0_16px_40px_-16px_rgba(0,0,0,0.9)]"
                    style={{ color: ACCENT }}
                  >
                    <activeFeat.icon className="h-10 w-10" />
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setSelectedFeature(null)}
                  aria-label="Kapat"
                  className="absolute right-4 top-4 flex h-10 w-10 items-center justify-center rounded-full border border-white/10 bg-black/40 text-white/70 backdrop-blur-md transition-colors hover:bg-black/60 hover:text-white"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              {/* İçerik */}
              <div className="p-8">
                <h3 className="text-2xl font-extrabold tracking-tight text-white">{activeFeat.title}</h3>
                <p className="mt-3 text-base leading-relaxed text-white/55">{activeFeat.desc}</p>

                <ul className="mt-6 space-y-4">
                  {activeFeat.details.map((d) => (
                    <li key={d.label} className="flex gap-3">
                      <span
                        className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full"
                        style={{ backgroundColor: ACCENT }}
                        aria-hidden
                      />
                      <p className="text-[15px] leading-relaxed text-white/70">
                        <span className="font-semibold text-white">
                          {d.label}:
                        </span>{" "}
                        {d.text}
                      </p>
                    </li>
                  ))}
                </ul>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ============ GÖRSEL BÜYÜTME (LIGHTBOX) ============ */}
      <AnimatePresence>
        {zoomImg && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-[80] flex items-center justify-center bg-black/85 p-4 backdrop-blur-sm sm:p-8"
            onClick={() => setZoomImg(null)}
          >
            <button
              type="button"
              onClick={() => setZoomImg(null)}
              aria-label="Kapat"
              className="absolute right-5 top-5 flex h-11 w-11 items-center justify-center rounded-full border border-white/15 bg-black/50 text-white/80 backdrop-blur-md transition-colors hover:bg-black/70 hover:text-white"
            >
              <X className="h-5 w-5" />
            </button>
            <motion.img
              src={zoomImg.src}
              alt={zoomImg.alt}
              initial={reduce ? { opacity: 0 } : { opacity: 0, scale: 0.94 }}
              animate={reduce ? { opacity: 1 } : { opacity: 1, scale: 1 }}
              exit={reduce ? { opacity: 0 } : { opacity: 0, scale: 0.97 }}
              transition={{ duration: 0.28, ease: [0.16, 1, 0.3, 1] }}
              onClick={(e) => e.stopPropagation()}
              className="max-h-[90vh] max-w-[94vw] rounded-xl border border-white/10 shadow-[0_40px_120px_-20px_rgba(0,0,0,0.9)]"
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* ============ İÇERİK (ambiyansın üstünde) ============ */}
      <div className="relative z-10">
      {/* ============ Z-YOLCULUK: Hero → Nasıl çalışır → Özellikler → Neden SHRED ============ */}
      {reduce ? (
        /* reduced-motion: sahneler normal dikey bölümler (3D yok) */
        <div id="nasilcalisir" className="scroll-mt-24">
          <section className="relative flex min-h-[100svh] items-center justify-center overflow-hidden">
            {sceneHero}
          </section>
          <section className="relative flex min-h-screen items-center justify-center py-24">
            {sceneFlow}
          </section>
          <section className="relative flex min-h-screen items-center justify-center py-24">
            {sceneFeatures}
          </section>
          <section className="relative flex min-h-screen items-center justify-center py-24">
            {sceneWhy}
          </section>
        </div>
      ) : (
        /* Sabit sahne — scroll kamerayı sahnelerin arasından ileri taşır (sayfa dikey kaymaz) */
        <section
          id="nasilcalisir"
          ref={journeyRef}
          className="relative"
          style={{ height: `${SCENES.length * 135}vh` }}
        >
          <div className="sticky top-0 h-[100svh] overflow-hidden">
            {SCENES.map((node, i) => (
              <ZScene key={i} progress={journeyProgress} index={i} count={SCENES.length}>
                {node}
              </ZScene>
            ))}
          </div>
        </section>
      )}

      {/* ============ ÖZELLİK-DETAY SATIRLARI ============ */}
      <section id="ozellikler" className="scroll-mt-24 space-y-28 px-6 py-12 md:py-20">
        <div className="container mx-auto max-w-6xl space-y-28">
          <FeatureRow
            eyebrow="Marka web siten"
            title="Kendi markanla, profesyonel bir site."
            desc="Logonu, renklerini ve içeriğini gir; sana özel bir landing page dakikalar içinde yayında. Öğrencilerin senin markandan kayıt olur, paket satın alır."
            bullets={[
              "Hazır şablonlar veya tam özelleştirme",
              "koçadı.shred.com.tr adresinde anında canlı",
              "Kendi alan adını bağlama imkânı",
            ]}
            slot={
              <StackedLandings
                onZoom={openZoom}
                images={[
                  { src: "/marketing/brand-landing.png", alt: "Koç markası landing tasarımı — Güç" },
                  { src: "/marketing/brand-landing-2.png", alt: "Koç markası landing tasarımı — Unbreakable" },
                ]}
              />
            }
          />
          <FeatureRow
            reverse
            eyebrow="Program & beslenme"
            title="Antrenman ve beslenmeyi tek yerden kur."
            desc="Geniş egzersiz kütüphanesi ve makro hesaplı öğün planlarıyla saniyeler içinde program hazırla, tek tıkla öğrencilerine ata."
            bullets={[
              "Yüzlerce hazır egzersiz ve besin",
              "Sürükle-bırak program oluşturucu",
              "Tek tıkla öğrenciye atama",
            ]}
            slot={
              <StackedLandings
                onZoom={openZoom}
                images={[
                  { src: "/marketing/panel-programlar.png", alt: "Antrenman programı paneli" },
                  { src: "/marketing/panel-beslenme.png", alt: "Beslenme planı paneli" },
                ]}
              />
            }
          />
          <FeatureRow
            eyebrow="Otomatik takip"
            title="İlerlemeyi sen yormadan takip et."
            desc="Haftalık check-in'ler, fotoğraflar ve ölçüler otomatik grafiklere dönüşür. Hangi öğrencinin ilgiye ihtiyacı olduğunu bir bakışta gör."
            bullets={[
              "Otomatik gelişim grafikleri",
              "Check-in ve fotoğraf takibi",
              "Tüm öğrenciler tek panelde",
            ]}
            slot={
              <ShowcaseImage
                onZoom={openZoom}
                src="/marketing/panel-ogrenciler.png"
                alt="Tüm öğrencilerin tek panelde takip edildiği ekran"
                tilt="rotate-2"
              />
            }
          />
        </div>
      </section>

      {/* ============ ÖĞRENCİ DENEYİMİ (MOBİL) ============ */}
      <section className="px-6 py-24">
        <div className="container mx-auto grid max-w-6xl items-center gap-12 md:grid-cols-2 md:gap-16">
          <Reveal>
            <Eyebrow>Öğrenci deneyimi</Eyebrow>
            <h2 className="mt-4 text-3xl font-extrabold tracking-tight text-white md:text-4xl">
              Öğrencilerin her şeyi cebinde taşır.
            </h2>
            <p className="mt-5 text-lg leading-relaxed text-white/55">
              Programlar, beslenme, check-in ve ilerleme — hepsi öğrencinin telefonunda,
              senin markanla. Pürüzsüz bir deneyim, daha bağlı danışanlar.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              {["Antrenman görüntüleme", "Öğün takibi", "Haftalık check-in", "İlerleme grafiği"].map((t) => (
                <span
                  key={t}
                  className="flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm font-medium text-white/70"
                >
                  <Smartphone className="h-4 w-4" style={{ color: ACCENT }} />
                  {t}
                </span>
              ))}
            </div>
          </Reveal>
          <Reveal delay={0.1} className="flex justify-center">
            <div className="relative">
              <div
                className="pointer-events-none absolute -inset-8 -z-10 rounded-full opacity-25 blur-3xl"
                style={{ background: `radial-gradient(circle, ${ACCENT}, transparent 70%)` }}
              />
              <MediaSlot frame="phone" label="Öğrenci mobil ekranı" hint="Telefon görüntüsü buraya" />
            </div>
          </Reveal>
        </div>
      </section>

      {/* ============ S.S.S. ============ */}
      <section id="sss" className="relative scroll-mt-24 px-6 py-28">
        <div className="absolute left-0 right-0 top-0 h-px bg-gradient-to-r from-transparent via-[#3d6fd1]/15 to-transparent" />
        <div className="container mx-auto max-w-3xl">
          <Reveal className="mb-16 text-center">
            <h2 className="text-3xl font-extrabold tracking-tight text-white md:text-5xl">
              Sıkça Sorulan Sorular
            </h2>
          </Reveal>
          <Reveal className="space-y-4">
            {FAQ.map((item) => (
              <details
                key={item.q}
                className="group rounded-3xl border border-white/10 bg-white/5 p-6 transition-all duration-300 open:border-white/20 hover:border-white/20"
              >
                <summary className="flex cursor-pointer list-none select-none items-center justify-between gap-4 text-lg font-bold text-white">
                  {item.q}
                  <span className="relative flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-white/10 text-white/50 transition-all duration-300 group-open:rotate-45 group-open:text-white">
                    <span
                      className="absolute inset-0 rounded-full opacity-0 transition-opacity duration-300 group-open:opacity-100"
                      style={{ backgroundColor: ACCENT }}
                      aria-hidden
                    />
                    <span className="relative">+</span>
                  </span>
                </summary>
                <p className="mt-4 border-t border-white/10 pt-4 text-base leading-relaxed text-white/60">
                  {item.a}
                </p>
              </details>
            ))}
          </Reveal>
        </div>
      </section>

      {/* ============ KAPANIŞ CTA ============ */}
      <section className="px-4 pb-20 pt-10 md:px-6">
        <div className="container mx-auto max-w-6xl">
          <Reveal>
            <div className="relative overflow-hidden rounded-[3rem] border border-white/10 bg-[#0a0a0a] px-6 py-24 text-center shadow-2xl md:px-12 md:py-32">
              <div
                className="absolute inset-0 opacity-50 mix-blend-screen"
                style={{ background: `radial-gradient(circle at 50% 0%, ${ACCENT}33 0%, transparent 60%)` }}
              />
              <div
                className="absolute bottom-0 left-1/2 h-px w-3/4 -translate-x-1/2 opacity-50"
                style={{ background: `linear-gradient(90deg, transparent, ${ACCENT}, transparent)` }}
              />
              <div className="relative z-10 flex flex-col items-center">
                <div className="mb-8 inline-flex items-center rounded-full border border-white/10 bg-white/5 px-4 py-1.5 backdrop-blur-sm">
                  <span className="text-xs font-semibold uppercase tracking-widest text-white/80">
                    Sınırları kaldır
                  </span>
                </div>
                <h2 className="mx-auto max-w-3xl text-4xl font-extrabold tracking-tighter text-white md:text-6xl lg:text-7xl">
                  Koçluğunu bir sonraki
                  <br />
                  <span className="text-white">seviyeye taşı.</span>
                </h2>
                <p className="mx-auto mt-6 max-w-xl text-lg text-white/50 md:text-xl">
                  Birkaç dakika içinde markan yayında, öğrencilerin tek panelde. Kurulum ücretsiz.
                </p>
                <div className="mt-12 w-full max-w-md">
                  <Link href={SIGNUP_HREF} className="block">
                    <Button
                      className={`group h-14 w-full rounded-xl px-8 text-base font-semibold text-white ${PRIMARY_BTN}`}
                      style={PRIMARY_STYLE}
                    >
                      <span className="flex items-center justify-center">
                        Hemen Başla
                        <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
                      </span>
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ============ İLETİŞİM ============ */}
      <section id="iletisim" className="scroll-mt-24 px-6 pb-32">
        <div className="container mx-auto max-w-4xl">
          <Reveal>
            <div className="group relative overflow-hidden rounded-[2.5rem] border border-white/10 bg-[#0a0a0a] p-10 text-center transition-all hover:border-white/20 md:p-16">
              <div
                className="mx-auto mb-8 flex h-20 w-20 items-center justify-center rounded-3xl border border-white/10 bg-[#111] text-white transition-transform duration-500 group-hover:-rotate-3 group-hover:scale-110"
              >
                <Mail className="h-8 w-8" />
              </div>
              <h2 className="text-3xl font-extrabold tracking-tight text-white md:text-4xl">
                Soruların mı var?
              </h2>
              <p className="mx-auto mt-4 max-w-md text-lg text-white/50">
                Ekibimiz sana yardımcı olmak için hazır. Çekinmeden bize yazabilirsin.
              </p>
              <a
                href={`mailto:${SUPPORT_EMAIL}`}
                className="mt-8 inline-flex items-center gap-2 text-xl font-bold text-white transition-colors hover:text-white/80"
              >
                {SUPPORT_EMAIL}
              </a>
            </div>
          </Reveal>
        </div>
      </section>

      <PlatformFooter />
      </div>
    </div>
  );
}
