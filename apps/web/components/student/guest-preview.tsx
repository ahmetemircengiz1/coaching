/**
 * Misafir modu — sayfa başına salt-okunur ÖRNEK içerik.
 *
 * Misafirin gerçek verisi olmadığı için panel boş görünmesin diye her sayfada
 * "Örnek" rozetli statik demo içerik gösterilir; hiçbir aksiyon butonu yoktur.
 * (Aksiyon güvenliği ayrıca server tarafında garanti: tüm mutasyonlar Student
 * kaydı arar, misafirlerde bulunmaz.)
 */

type GuestPage =
  | "dashboard"
  | "training"
  | "nutrition"
  | "nutrition-log"
  | "progress"
  | "checkin"
  | "settings";

function SampleBadge() {
  return (
    <span
      className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full shrink-0"
      style={{
        backgroundColor: "color-mix(in srgb, var(--dashboard-accent) 18%, transparent)",
        color: "var(--dashboard-accent)",
      }}
    >
      Örnek
    </span>
  );
}

function DemoCard({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div
      className="rounded-xl border p-5"
      style={{ backgroundColor: "var(--dashboard-card-bg)", borderColor: "var(--dashboard-card-border)" }}
    >
      <div className="flex items-center justify-between gap-3 mb-4">
        <h3 className="font-semibold" style={{ color: "var(--dashboard-main-text)" }}>
          {title}
        </h3>
        <SampleBadge />
      </div>
      {children}
    </div>
  );
}

function Muted({ children }: { children: React.ReactNode }) {
  return (
    <p className="text-sm" style={{ color: "var(--dashboard-main-text-muted)" }}>
      {children}
    </p>
  );
}

function DemoRow({ left, right }: { left: string; right: string }) {
  return (
    <div
      className="flex items-center justify-between py-2.5 border-b last:border-0"
      style={{ borderColor: "var(--dashboard-card-border)" }}
    >
      <span className="text-sm" style={{ color: "var(--dashboard-main-text)" }}>
        {left}
      </span>
      <span className="text-sm" style={{ color: "var(--dashboard-main-text-muted)" }}>
        {right}
      </span>
    </div>
  );
}

const PAGE_TITLES: Record<GuestPage, { title: string; intro: string }> = {
  dashboard: {
    title: "Ana Sayfa",
    intro: "Kayıt olduğunda burada o günkü antrenmanını, beslenme hedeflerini ve son check-in durumunu göreceksin.",
  },
  training: {
    title: "Antrenman",
    intro: "Koçunun sana özel hazırladığı program hafta hafta burada görünür.",
  },
  nutrition: {
    title: "Beslenme",
    intro: "Sana özel beslenme planın; öğünleri tamamlayıp alternatifler arasından seçim yapabilirsin.",
  },
  "nutrition-log": {
    title: "Yemek Günlüğü",
    intro: "Gün içinde yediklerini fotoğrafla kaydeder, koçun yorumlarını görürsün.",
  },
  progress: {
    title: "İlerleme",
    intro: "Kilo ve ölçülerin grafiklere dönüşür; önce/sonra fotoğraflarınla değişimini takip edersin.",
  },
  checkin: {
    title: "Check-in",
    intro: "Haftalık check-in ile kilo, ölçü, enerji ve fotoğraflarını koçunla paylaşırsın; koçun geri bildirim verir.",
  },
  settings: {
    title: "Ayarlar",
    intro: "Panel teması, menü konumu ve bildirim tercihleri kayıtlı öğrenciler için buradan yönetilir.",
  },
};

export function GuestPreview({ page }: { page: GuestPage }) {
  const meta = PAGE_TITLES[page];

  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-2xl font-bold" style={{ color: "var(--dashboard-main-text)" }}>
          {meta.title}
        </h1>
        <Muted>{meta.intro}</Muted>
      </div>

      {page === "dashboard" && (
        <>
          <DemoCard title="Bugünkü Programın">
            <DemoRow left="Göğüs Press (Bench)" right="4 × 8" />
            <DemoRow left="Incline Dumbbell Press" right="3 × 10" />
            <DemoRow left="Cable Fly" right="3 × 12" />
            <DemoRow left="Triceps Pushdown" right="4 × 12" />
          </DemoCard>
          <DemoCard title="Beslenme Hedefin">
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {[
                ["2.200", "kcal"],
                ["160g", "Protein"],
                ["220g", "Karbonhidrat"],
                ["70g", "Yağ"],
              ].map(([v, l]) => (
                <div
                  key={l}
                  className="rounded-lg border p-3 text-center"
                  style={{ borderColor: "var(--dashboard-card-border)" }}
                >
                  <p className="text-lg font-bold" style={{ color: "var(--dashboard-main-text)" }}>{v}</p>
                  <p className="text-xs" style={{ color: "var(--dashboard-main-text-muted)" }}>{l}</p>
                </div>
              ))}
            </div>
          </DemoCard>
        </>
      )}

      {page === "training" && (
        <>
          <DemoCard title="Hafta 1 · Gün 1 — Göğüs & Triceps">
            <DemoRow left="Göğüs Press (Bench)" right="4 × 8 · 60 sn dinlenme" />
            <DemoRow left="Incline Dumbbell Press" right="3 × 10" />
            <DemoRow left="Cable Fly" right="3 × 12" />
            <DemoRow left="Triceps Pushdown" right="4 × 12" />
            <DemoRow left="Overhead Extension" right="3 × 12" />
          </DemoCard>
          <DemoCard title="Hafta 1 · Gün 2 — Sırt & Biceps">
            <DemoRow left="Lat Pulldown" right="4 × 10" />
            <DemoRow left="Barbell Row" right="4 × 8" />
            <DemoRow left="Biceps Curl" right="3 × 12" />
          </DemoCard>
        </>
      )}

      {page === "nutrition" && (
        <>
          <DemoCard title="Kahvaltı · ~550 kcal">
            <DemoRow left="Yulaf ezmesi" right="80g" />
            <DemoRow left="Yumurta (haşlanmış)" right="3 adet" />
            <DemoRow left="Muz" right="1 adet" />
          </DemoCard>
          <DemoCard title="Öğle · ~700 kcal">
            <DemoRow left="Izgara tavuk göğsü" right="200g" />
            <DemoRow left="Pirinç pilavı" right="150g" />
            <DemoRow left="Yeşil salata + zeytinyağı" right="1 porsiyon" />
          </DemoCard>
          <DemoCard title="Akşam · ~650 kcal">
            <DemoRow left="Somon (fırın)" right="180g" />
            <DemoRow left="Tatlı patates" right="200g" />
          </DemoCard>
        </>
      )}

      {page === "nutrition-log" && (
        <DemoCard title="Bugünkü Kayıtlar">
          <DemoRow left="🍳 Kahvaltı — menemen + tam buğday ekmek" right="09:12" />
          <DemoRow left="🍗 Öğle — tavuklu bowl" right="13:40" />
          <DemoRow left="🥗 Akşam — ızgara köfte + salata" right="19:55" />
          <p className="text-xs mt-3" style={{ color: "var(--dashboard-main-text-muted)" }}>
            Kayıt olduğunda fotoğraf ekleyebilir, koçundan öğün bazında yorum alırsın.
          </p>
        </DemoCard>
      )}

      {page === "progress" && (
        <>
          <DemoCard title="Kilo Takibi (12 hafta)">
            <svg viewBox="0 0 300 80" className="w-full h-24" aria-hidden>
              <polyline
                fill="none"
                stroke="var(--dashboard-accent)"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                points="0,14 25,18 50,16 75,24 100,28 125,26 150,34 175,38 200,42 225,44 250,50 275,52 300,58"
              />
            </svg>
            <div className="flex justify-between text-xs" style={{ color: "var(--dashboard-main-text-muted)" }}>
              <span>86,4 kg</span>
              <span>−7,2 kg</span>
              <span>79,2 kg</span>
            </div>
          </DemoCard>
          <DemoCard title="Ölçümler">
            <DemoRow left="Bel" right="94 cm → 86 cm" />
            <DemoRow left="Göğüs" right="104 cm → 106 cm" />
            <DemoRow left="Kol" right="36 cm → 38 cm" />
          </DemoCard>
        </>
      )}

      {page === "checkin" && (
        <DemoCard title="Haftalık Check-in">
          <DemoRow left="Kilo" right="82,4 kg" />
          <DemoRow left="Enerji" right="8 / 10" />
          <DemoRow left="Uyku" right="7 saat ort." />
          <DemoRow left="Programa uyum" right="%90" />
          <DemoRow left="Fotoğraflar" right="Ön · Yan · Arka" />
          <p className="text-xs mt-3" style={{ color: "var(--dashboard-main-text-muted)" }}>
            Koçun her check-in&apos;ine kişisel geri bildirim yazar.
          </p>
        </DemoCard>
      )}

      {page === "settings" && (
        <DemoCard title="Kişiselleştirme">
          <DemoRow left="Panel teması" right="7 tema seçeneği" />
          <DemoRow left="Menü konumu" right="Alt / Sol / Sağ" />
          <DemoRow left="Bildirim tercihleri" right="Program, beslenme, yorum" />
        </DemoCard>
      )}

      <div
        className="rounded-xl border border-dashed p-5 text-center"
        style={{ borderColor: "color-mix(in srgb, var(--dashboard-accent) 40%, var(--dashboard-card-border))" }}
      >
        <p className="text-sm font-medium" style={{ color: "var(--dashboard-main-text)" }}>
          Bunların hepsi sana özel hazırlanır
        </p>
        <p className="text-xs mt-1" style={{ color: "var(--dashboard-main-text-muted)" }}>
          Koçundan kayıt kodu al, yukarıdaki alana gir — kendi programın, beslenmen ve ilerleme
          takibin dakikalar içinde burada olsun.
        </p>
      </div>
    </div>
  );
}
