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
  Wallet,
  Zap,
  ShieldCheck,
  Plus,
  UserPlus,
  Maximize2,
} from "lucide-react";
import { PlatformFooter } from "@/src/components/platform/PlatformFooter";
import { CosmicHeroBackground } from "@/src/components/platform/CosmicHeroBackground";
import { StarfieldJourney } from "@/src/components/platform/StarfieldJourney";
import {
  motion,
  AnimatePresence,
  useReducedMotion,
  useScroll,
  useTransform,
  useMotionValueEvent,
  type MotionValue,
} from "framer-motion";

const SIGNUP_HREF = "/platform/auth?mode=signup&tier=3";
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
// Sahnenin scroll içindeki odak merkezi ve segment genişliği.
// Duraklamayı artık "tek savuruş = tek sahne" kuralı sağlıyor; bu yüzden dwell minik —
// geçiş tüm mesafeye yayılır, ortada sıkışıp "hop" hissi vermez.
const Z_DWELL = 0.05; // |u| <= bu: sahne odakta net, sabit
const Z_TRANS = 0.5; // eski sahne tam kaybolurken yenisi belirmeye başlar — arada boş yıldız alanı yok
// Uçlarda sıfır hız (smoothstep): geçişler yumuşak başlar, yumuşak biter — atlama hissi yok
const zEase = (t: number) => t * t * (3 - 2 * t);
// Sahne başına scroll mesafesi (vh) — tek kaydırışta geçilecek kadar kısa,
// sahneler uçuşup gitmeyecek kadar uzun
const SCENE_VH = 100;

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
    const t = zEase(Math.min((ax - Z_DWELL) / (Z_TRANS - Z_DWELL), 1));
    return x < 0 ? 1 - 0.3 * t : 1 + 0.7 * t; // uzakta küçük, yanından geçerken büyür (ölçülü)
  });
  const opacity = useTransform(progress, (p) => {
    const ax = Math.abs(u(p));
    if (ax <= Z_DWELL) return 1;
    if (ax >= Z_TRANS) return 0;
    return 1 - zEase((ax - Z_DWELL) / (Z_TRANS - Z_DWELL));
  });
  const pointerEvents = useTransform(opacity, (o) => (o > 0.85 ? "auto" : "none"));
  // Görünmez sahne hiç boyanmasın (hero'nun yıldız katmanları dahil) — büyük performans kazancı.
  // Not: blur() animasyonu bilinçli olarak yok; scale+opacity GPU'da ucuz, filter her karede repaint demek.
  const visibility = useTransform(opacity, (o) => (o < 0.005 ? "hidden" : "visible"));

  return (
    <motion.div
      className="absolute inset-0 flex items-center justify-center"
      style={{
        scale,
        opacity,
        pointerEvents,
        visibility,
        zIndex: count - index,
        willChange: "transform, opacity",
      }}
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
/** Öğrenci mobil deneyimi — telefon ekranları. */
const PHONE_SCREENS = [
  { src: "/marketing/mobil-anasayfa.png", alt: "Öğrenci mobil ana sayfası — günün programı ve öğünler" },
  { src: "/marketing/mobil-antrenman.png", alt: "Öğrenci antrenman programı ekranı" },
  { src: "/marketing/mobil-beslenme.png", alt: "Öğrenci beslenme programı ekranı — makrolar ve öğünler" },
  { src: "/marketing/mobil-checkin.png", alt: "Öğrenci haftalık check-in ekranı — ölçümler" },
];

/** Telefon ekranları çapraz üst üste — arkadakine dokununca öne gelir, öndekine dokununca büyür. */
function PhoneStack({ onZoom }: { onZoom: (src: string, alt: string) => void }) {
  const [front, setFront] = useState(0);
  return (
    <div className="flex flex-col items-center gap-8">
      <div className="relative w-[200px] sm:w-[230px]" style={{ aspectRatio: "9/19" }}>
        {PHONE_SCREENS.map((img, i) => {
          const isFront = i === front;
          // Arkadaki telefonları merkez etrafına sağlı sollu yelpaze gibi diz
          const spread = i - (PHONE_SCREENS.length - 1) / 2;
          const backRotate = spread === 0 ? 8 : spread * 7;
          const backX = `${spread * 20}%`;
          const backZ = 20 - Math.round(Math.abs(spread) * 4);
          return (
            <motion.button
              key={img.src}
              type="button"
              onClick={() => (isFront ? onZoom(img.src, img.alt) : setFront(i))}
              aria-label={isFront ? `${img.alt} — büyüt` : `${img.alt} — öne getir`}
              initial={false}
              animate={
                isFront
                  ? { rotate: -1.5, scale: 1, x: "0%", y: "0%", opacity: 1, zIndex: 30 }
                  : { rotate: backRotate, scale: 0.9, x: backX, y: "5%", opacity: 0.75, zIndex: backZ }
              }
              transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
              className="group absolute inset-0 overflow-hidden rounded-[2rem] border-[5px] border-[#1a1a1a] bg-[#f7f7f7] shadow-[0_30px_60px_-20px_rgba(0,0,0,0.8)]"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={img.src} alt={img.alt} loading="lazy" className="h-full w-full object-cover object-top" />
              {isFront ? (
                <span className="pointer-events-none absolute right-2.5 top-2.5 flex h-8 w-8 items-center justify-center rounded-full bg-black/50 text-white/85 opacity-0 backdrop-blur-md transition-opacity duration-300 group-hover:opacity-100">
                  <Maximize2 className="h-4 w-4" />
                </span>
              ) : (
                <span className="absolute inset-0 bg-black/35 transition-colors group-hover:bg-black/15" aria-hidden />
              )}
            </motion.button>
          );
        })}
      </div>
    </div>
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
        // Arkadaki kartları merkez etrafına yelpaze gibi diz (2 veya 3 kart)
        const spread = i - (images.length - 1) / 2;
        const backRotate = spread === 0 ? 10 : spread * 8;
        const backX = spread === 0 ? "0%" : `${spread * 6}%`;
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
    q: "Teknik bilgi gerekiyor mu?",
    a: "Hayır. Web siten, koç panelin ve öğrenci paneli hazır olarak geliyor. Marka adını ve tarzını seçiyorsun; siten dakikalar içinde kendi adresinde yayında — tek satır kod yazmadan.",
  },
  {
    q: "Gerçekten ücretsiz mi? Sonradan ücret çıkacak mı?",
    a: "Şu an tüm özellikler herkese açık ve ücretsiz. İleride premium planlar eklenecek; ancak bugün kullandığın özellikler için sürpriz bir fatura çıkmayacak ve erken katılan koçlar her zaman avantajlı olacak.",
  },
  {
    q: "Öğrencilerimden ödemeyi nasıl alırım, komisyon var mı?",
    a: "Ödemeyi doğrudan sen alırsın — havale, IBAN veya dilediğin yöntemle. Shred araya girmez ve kazancından komisyon almaz; belirlediğin ücretin tamamı sende kalır.",
  },
  {
    q: "Öğrencilerim siteme nasıl kayıt olur?",
    a: "Kontrol tamamen sende. Panelinden tek tıkla kayıt kodu üretir, öğrencine gönderirsin; öğrencin bu kodla senin sitenden kayıt olur ve anında programını, beslenme planını ve ilerleme takibini görmeye başlar.",
  },
  {
    q: "Kendi alan adımı bağlayabilir miyim?",
    a: "Evet. Siten önce koçadı.shred.com.tr adresinde yayına girer; istediğin zaman kendi alan adını (ör. seninmarkan.com) bağlayıp tamamen kendi markanla devam edersin.",
  },
  {
    q: "Sitemin tasarımını sonradan değiştirebilir miyim?",
    a: "İstediğin an. Hazır şablonlar arasında geçiş yapabilir, bölümleri açıp kapatabilir; metinleri, fotoğrafları ve renkleri site kurucudan saniyeler içinde güncelleyebilirsin. Değişiklikler anında yayına yansır.",
  },
  {
    q: "Verilerim ve öğrencilerimin verileri güvende mi?",
    a: "Evet. Her koçun verisi diğerlerinden tamamen izole tutulur; öğrenci fotoğrafları gizli depolamada saklanır ve yalnızca yetkili kişiler görebilir. İstediğin an hesabını kapatıp tüm verilerini kalıcı olarak silebilirsin.",
  },
  {
    q: "Telefondan kullanabilir miyim?",
    a: "Tamamen. Hem koç paneli hem öğrenci paneli mobil öncelikli tasarlandı; program atamaktan check-in incelemeye her şeyi telefonundan yönetebilirsin.",
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

/* "Nasıl çalışır" — yatay serpantin S rotası (viewBox 1000×420, 3 şerit) */
const FLOW_PATH =
  "M 40 40 L 820 40 C 960 40, 960 200, 820 200 L 180 200 C 40 200, 40 340, 180 340 L 760 340";
/* Adımların rota üzerindeki konumları (%) + ışığın adıma varış anına göre gecikmeler (sn) */
const FLOW_ANCHORS = [
  { x: 16, y: 9.5, delay: 0.4 },
  { x: 58, y: 9.5, delay: 1.4 },
  { x: 40, y: 47.6, delay: 2.9 },
  { x: 64, y: 81, delay: 4.4 },
];
const FLOW_DRAW_SECONDS = 5;

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

  // "Nasıl çalışır" S-çizgisi: sahne odağa yaklaşınca ışık baştan sona yavaşça akar.
  // Hero'ya geri dönülürse sıfırlanır (tekrar gelişte yeniden oynar).
  const [flowStarted, setFlowStarted] = useState(false);
  useMotionValueEvent(journeyProgress, "change", (v) => {
    if (v > 0.2) setFlowStarted(true);
    else if (v < 0.08) setFlowStarted(false);
  });

  // Yumuşak kaydırma. CSS snap yalnızca dokunmatik cihazlarda: masaüstünde kaydırmayı
  // aşağıdaki wheel devralma yönetir; CSS snap programatik animasyonla çakışırdı.
  useEffect(() => {
    document.documentElement.style.scrollBehavior = "smooth";
    const coarse = window.matchMedia("(pointer: coarse)").matches;
    if (coarse) document.documentElement.style.scrollSnapType = "y proximity";
    return () => {
      document.documentElement.style.scrollBehavior = "";
      document.documentElement.style.scrollSnapType = "";
    };
  }, []);

  // YOLCULUK KAYDIRMA MOTORU (masaüstü tekerlek/touchpad):
  // - Aşağı: tek savuruş = tek sahne (~950ms animasyon). Varıştan sonra savuruşun
  //   momentum kuyruğu yutulur; yeni bir bilinçli itiş (artan delta veya kısa bir es)
  //   anında kabul edilir — touchpad'de "kaydırıyorum ama gitmiyor" hissi bırakmaz.
  // - Yukarı: duraklamasız ama TİTREMESİZ — girdi hedefe yazılır, sayfa rAF ile
  //   kare-kare yumuşak süzülür (event zamanlamasından bağımsız; touchpad'in
  //   düzensiz event akışı görüntüye yansımaz).
  useEffect(() => {
    if (reduce) return;
    const sec = journeyRef.current;
    if (!sec) return;

    let animating = false;
    let eatMomentum = false; // varıştan sonra aynı savuruşun kuyruğunu yut
    let lastEaten = Infinity; // yutulan son delta büyüklüğü (sönüm/yeni-itiş ayrımı)
    let acc = 0;
    let lastT = 0;
    let sceneRaf = 0;
    let glideTarget: number | null = null; // yukarı süzülme hedefi
    let glideRaf = 0;

    // Sine: tepe hızı düşük, kalkış/varış nazik — "düşme" hissi vermez
    const easeInOutSine = (t: number) => -(Math.cos(Math.PI * t) - 1) / 2;

    const stopGlide = () => {
      if (glideRaf) cancelAnimationFrame(glideRaf);
      glideRaf = 0;
      glideTarget = null;
    };

    const glideStep = () => {
      if (glideTarget === null) {
        glideRaf = 0;
        return;
      }
      const cur = window.scrollY;
      const diff = glideTarget - cur;
      if (Math.abs(diff) < 0.75) {
        window.scrollTo({ top: glideTarget, behavior: "instant" });
        glideRaf = 0;
        glideTarget = null;
        return;
      }
      // Üstel yaklaşım: her karede kalan mesafenin %14'ü — pürüzsüz sönümlenme
      window.scrollTo({ top: cur + diff * 0.14, behavior: "instant" });
      glideRaf = requestAnimationFrame(glideStep);
    };

    const animateTo = (targetY: number) => {
      stopGlide();
      animating = true;
      const startY = window.scrollY;
      const dist = targetY - startY;
      const dur = 950;
      const t0 = performance.now();
      const step = (now: number) => {
        const t = Math.min((now - t0) / dur, 1);
        window.scrollTo({ top: startY + dist * easeInOutSine(t), behavior: "instant" });
        if (t < 1) {
          sceneRaf = requestAnimationFrame(step);
        } else {
          animating = false;
          eatMomentum = true;
          lastEaten = Infinity;
          acc = 0;
        }
      };
      sceneRaf = requestAnimationFrame(step);
    };

    const onWheel = (e: WheelEvent) => {
      // Menü/modal/lightbox açıkken karışma (içerideki scroll çalışsın)
      if (document.body.style.overflow === "hidden") return;
      // Touchpad pinch-zoom (ctrl+wheel) bizim işimiz değil
      if (e.ctrlKey) return;

      const range = sec.offsetHeight - window.innerHeight;
      if (range <= 0) return;
      const secTop = window.scrollY + sec.getBoundingClientRect().top;
      const y = window.scrollY - secTop;
      if (y < -1 || y > range + 1) return; // yolculuk dışında: doğal scroll

      let delta = e.deltaY;
      if (e.deltaMode === 1) delta *= 33;
      else if (e.deltaMode === 2) delta *= window.innerHeight;
      const dir = Math.sign(delta);
      if (dir === 0) return;

      // ===== YUKARI: duraklamasız, rAF ile yumuşatılmış süzülme =====
      if (dir < 0) {
        if (animating) {
          cancelAnimationFrame(sceneRaf);
          animating = false;
        }
        eatMomentum = false;
        acc = 0;
        e.preventDefault();
        const base = glideTarget ?? window.scrollY;
        glideTarget = Math.max(base + delta, 0);
        if (!glideRaf) glideRaf = requestAnimationFrame(glideStep);
        return;
      }

      // ===== AŞAĞI: tek savuruş = tek sahne =====
      const now = performance.now();
      const gap = now - lastT;
      lastT = now;
      stopGlide();

      if (animating) {
        e.preventDefault();
        return;
      }
      if (eatMomentum) {
        const a = Math.abs(delta);
        // Yeni itiş: kısa bir es verildi VEYA delta sönmek yerine belirgin arttı
        const freshGesture = gap > 150 || (a > 15 && a > lastEaten * 1.5);
        if (!freshGesture) {
          lastEaten = Math.max(a, 1);
          e.preventDefault();
          return; // aynı savuruşun sönmekte olan kuyruğu
        }
        eatMomentum = false;
      }

      // Son sahnedeyse doğal scroll'a bırak (yolculuktan çıkış)
      const seg = range / (SCENES.length - 1);
      const f = y / seg;
      const target = Math.ceil(f + 0.02);
      if (target > SCENES.length - 1) return;

      e.preventDefault(); // aşağı yönde kaydırmayı biz yönetiyoruz
      if (gap > 300) acc = 0;
      acc += delta;
      if (acc >= 30) {
        acc = 0;
        animateTo(secTop + target * seg);
      }
    };

    window.addEventListener("wheel", onWheel, { passive: false });
    return () => {
      window.removeEventListener("wheel", onWheel);
      if (sceneRaf) cancelAnimationFrame(sceneRaf);
      if (glideRaf) cancelAnimationFrame(glideRaf);
    };
    // SCENES.length sabit; journeyRef non-reduce dalında bağlı
  }, [reduce]);

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
    <div className="mx-auto w-full max-w-5xl px-6 text-center">
      <Eyebrow>Nasıl çalışır</Eyebrow>
      <h2 className="mt-4 text-4xl font-extrabold tracking-tight text-white md:text-6xl">
        Kayıttan takibe, tek akış.
      </h2>
      <p className="mx-auto mt-5 max-w-xl text-lg text-white/55">
        Bir online koçun günlük işi baştan sona burada. Her adım birbirine bağlı, hepsi tek panelde.
      </p>

      {/* md+: yatay geniş S-rota — sahne görününce ışık baştan sona yavaşça akar, adımlar sırayla belirir */}
      <div className="relative mx-auto mt-12 hidden w-full md:block" style={{ aspectRatio: "1000/420" }}>
        <svg viewBox="0 0 1000 420" preserveAspectRatio="none" className="absolute inset-0 h-full w-full" aria-hidden>
          {/* soluk rota (hedef yol) */}
          <path
            d={FLOW_PATH}
            fill="none"
            stroke="rgba(255,255,255,0.09)"
            strokeWidth={2}
            vectorEffect="non-scaling-stroke"
          />
          {/* parıltı: geniş, yarı saydam ikiz çizgi (drop-shadow filtresinden çok daha ucuz) */}
          <motion.path
            d={FLOW_PATH}
            fill="none"
            stroke={ACCENT}
            strokeWidth={8}
            strokeLinecap="round"
            opacity={0.25}
            vectorEffect="non-scaling-stroke"
            initial={false}
            animate={{ pathLength: flowStarted || reduce ? 1 : 0 }}
            transition={
              flowStarted && !reduce
                ? { duration: FLOW_DRAW_SECONDS, ease: "easeInOut" }
                : { duration: 0 }
            }
          />
          {/* baştan sona yavaşça akan ışık */}
          <motion.path
            d={FLOW_PATH}
            fill="none"
            stroke={ACCENT}
            strokeWidth={2.5}
            strokeLinecap="round"
            vectorEffect="non-scaling-stroke"
            initial={false}
            animate={{ pathLength: flowStarted || reduce ? 1 : 0 }}
            transition={
              flowStarted && !reduce
                ? { duration: FLOW_DRAW_SECONDS, ease: "easeInOut" }
                : { duration: 0 }
            }
          />
        </svg>
        {JOURNEY_STEPS.map((s, i) => (
          <motion.div
            key={s.title}
            className="absolute w-44 -translate-x-1/2"
            style={{ left: `${FLOW_ANCHORS[i].x}%`, top: `${FLOW_ANCHORS[i].y}%` }}
            initial={false}
            animate={{ opacity: flowStarted || reduce ? 1 : 0 }}
            transition={
              flowStarted && !reduce
                ? { duration: 0.6, delay: FLOW_ANCHORS[i].delay, ease: "easeOut" }
                : { duration: 0 }
            }
          >
            <div className="flex -translate-y-8 flex-col items-center">
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
              <h3 className="mt-3 whitespace-nowrap text-base font-bold tracking-tight text-white">{s.title}</h3>
              <p className="mt-1.5 text-sm leading-relaxed text-white/55">{s.desc}</p>
            </div>
          </motion.div>
        ))}
      </div>

      {/* mobil: kompakt grid (S-rota dar ekrana sığmaz) */}
      <div className="mt-14 grid grid-cols-2 gap-x-6 gap-y-10 md:hidden">
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
          style={{ height: `${SCENES.length * SCENE_VH}vh` }}
        >
          {/* Sahne odak noktaları: kaydırma bırakılınca sayfa en yakın sahneye yumuşakça oturur.
              snapStop "always": hızlı bir savuruş sahnelerin üzerinden uçamaz — her sahnede durur,
              kullanıcı inceleyip bir sonraki kaydırışla devam eder. */}
          {SCENES.map((_, i) => (
            <div
              key={`snap-${i}`}
              aria-hidden
              className="absolute left-0 h-px w-px"
              style={{
                top: `calc(${i} * ((${SCENES.length * SCENE_VH}vh - 100svh) / ${SCENES.length - 1}))`,
                scrollSnapAlign: "start",
                scrollSnapStop: "always",
              }}
            />
          ))}
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
                  { src: "/marketing/brand-landing.webp", alt: "Koç markası landing tasarımı — Güç" },
                  { src: "/marketing/panel-site-builder.webp", alt: "Section Builder — siteni bölüm bölüm özelleştir" },
                  { src: "/marketing/brand-landing-2.webp", alt: "Koç markası landing tasarımı — Unbreakable" },
                ]}
              />
            }
          />
          <FeatureRow
            reverse
            eyebrow="Program, beslenme & takip"
            title="Antrenman, beslenme ve takibi tek yerden yönet."
            desc="Geniş egzersiz kütüphanesi ve makro hesaplı öğün planlarıyla saniyeler içinde program hazırla, tek tıkla ata; check-in'ler, ölçüler ve fotoğraflar otomatik grafiklere dönüşsün."
            bullets={[
              "Yüzlerce hazır egzersiz ve besin",
              "Tek tıkla öğrenciye atama",
              "Check-in ve fotoğraflarla otomatik ilerleme takibi",
            ]}
            slot={
              <StackedLandings
                onZoom={openZoom}
                images={[
                  { src: "/marketing/panel-programlar.png", alt: "Antrenman programı paneli" },
                  { src: "/marketing/panel-ogrenci-detay.png", alt: "Öğrenci detayı — check-in, ölçüm ve fotoğraf takibi tek ekranda" },
                  { src: "/marketing/panel-beslenme.png", alt: "Beslenme planı paneli" },
                ]}
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
              <PhoneStack onZoom={openZoom} />
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

      {/* ============ KAPANIŞ CTA — ufuk sahnesi ============ */}
      {/* Hero'nun kardeşi ama kopyası değil: sayfaya özel, statik ve sade bir ufuk.
          Üstte ince yıldız tozu, ufkun ardından yükselen mavi ışık, tepe çizgisi
          aydınlanan dev bir gezegen yayı — içerik yayın üzerinde durur. */}
      <section className="relative overflow-hidden">
        <div className="pointer-events-none absolute inset-0" aria-hidden>
          {/* İnce yıldız tozu — yalnızca ufkun üstünde, kenarlara doğru söner */}
          <div
            className="absolute inset-x-0 top-0 h-[420px] opacity-70"
            style={{
              backgroundImage: `radial-gradient(1px 1px at 12% 32%, rgba(255,255,255,0.9), transparent 55%),
                radial-gradient(1px 1px at 28% 68%, rgba(255,255,255,0.7), transparent 55%),
                radial-gradient(1.5px 1.5px at 44% 22%, rgba(210,228,255,0.9), transparent 55%),
                radial-gradient(1px 1px at 58% 55%, rgba(255,255,255,0.65), transparent 55%),
                radial-gradient(1.5px 1.5px at 71% 30%, rgba(255,255,255,0.85), transparent 55%),
                radial-gradient(1px 1px at 84% 62%, rgba(210,228,255,0.7), transparent 55%),
                radial-gradient(1px 1px at 93% 25%, rgba(255,255,255,0.8), transparent 55%),
                radial-gradient(1.5px 1.5px at 6% 74%, rgba(255,255,255,0.6), transparent 55%),
                radial-gradient(1px 1px at 37% 84%, rgba(255,255,255,0.55), transparent 55%),
                radial-gradient(1px 1px at 66% 78%, rgba(210,228,255,0.6), transparent 55%)`,
              maskImage: "linear-gradient(180deg, transparent 0%, black 25%, black 70%, transparent 100%)",
              WebkitMaskImage: "linear-gradient(180deg, transparent 0%, black 25%, black 70%, transparent 100%)",
            }}
          />
          {/* Ufkun ardından yükselen ışık */}
          <div
            className="absolute left-1/2 top-[130px] h-[340px] w-[900px] max-w-none -translate-x-1/2 blur-3xl"
            style={{
              background: `radial-gradient(ellipse at 50% 100%, ${ACCENT}40 0%, rgba(190,215,255,0.1) 45%, transparent 72%)`,
            }}
          />
          {/* Gezegen yayı — tepe çizgisi ışıklı dev elips */}
          <div
            className="absolute left-1/2 top-[240px] h-[2000px] w-[300vw] -translate-x-1/2 rounded-[50%] sm:w-[240vw]"
            style={{
              background: "linear-gradient(180deg, #0a101f 0%, #070a13 20%, #050505 60%)",
              border: "1px solid rgba(190,215,255,0.28)",
              boxShadow: `0 -8px 28px -6px rgba(190,215,255,0.3), 0 -30px 90px -12px ${ACCENT}4d, 0 -90px 220px -20px ${ACCENT}26`,
            }}
          />
          {/* Tepe merkezinde güçlenen rim ışığı */}
          <div
            className="absolute left-1/2 top-[229px] h-[24px] w-[520px] -translate-x-1/2 rounded-full blur-xl"
            style={{
              background: `radial-gradient(ellipse, rgba(222,236,255,0.55) 0%, ${ACCENT}38 55%, transparent 78%)`,
            }}
          />
        </div>
        <div className="relative z-10 mx-auto flex max-w-4xl flex-col items-center px-6 pb-32 pt-[340px] text-center md:pb-40">
          <Reveal className="flex flex-col items-center">
            <h2 className="mx-auto max-w-3xl text-4xl font-extrabold tracking-tighter text-white md:text-6xl lg:text-7xl">
              Koçluk senin işin.
              <br />
              Gerisi bizde.
            </h2>
            <div className="mt-12 w-full max-w-xs">
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
          </Reveal>
        </div>
      </section>

      <PlatformFooter />
      </div>
    </div>
  );
}
