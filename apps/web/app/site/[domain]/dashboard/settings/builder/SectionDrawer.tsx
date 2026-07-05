"use client";

import React, { useState } from "react";
import { ArrowLeft, Wand2, Palette, Sparkles, Eye, EyeOff, Type } from "lucide-react";
import { useBuilderStore } from "./useBuilderStore";
import { GlobalStylePanel } from "./GlobalStylePanel";
import { BlockPicker } from "./BlockPicker";
import { BlockThumbnail } from "./BlockThumbnail";
import FileUpload from "@/components/ui/file-upload";
import { getBlock, getBlocksByCategory, CATEGORY_LABELS } from "@/src/components/landing/blocks/manifest";
import type { AnimationType, EliteSectionCategory, EliteSectionConfig } from "@/src/components/landing/elite-config";

type Tab = "variant" | "content" | "style" | "animation" | "visibility";

// Content tab artık tüm kategorilerde gösterilir (navbar hariç).
// Schema'sı boş olan kategorilerde "özelleştirilebilir metin yok" mesajı çıkar.
const CATEGORIES_WITH_CONTENT: EliteSectionCategory[] = [
  "hero",
  "features",
  "howItWorks",
  "stats",
  "transformations",
  "testimonials",
  "packages",
  "about",
  "faq",
  "cta",
  "footer",
];

export function SectionDrawer() {
  const selectedId = useBuilderStore((s) => s.selectedSectionId);
  const sections = useBuilderStore((s) => s.config.sections);

  if (!selectedId) {
    return (
      <div className="h-full flex flex-col">
        <GlobalStylePanel />
      </div>
    );
  }

  const section = sections.find((s) => s.id === selectedId);
  if (!section) {
    return (
      <div className="h-full flex flex-col">
        <GlobalStylePanel />
      </div>
    );
  }

  return <SectionDrawerInner sectionId={selectedId} />;
}

function SectionDrawerInner({ sectionId }: { sectionId: string }) {
  const sections = useBuilderStore((s) => s.config.sections);
  const section = sections.find((s) => s.id === sectionId)!;
  const def = getBlock(section.blockId);
  const [tab, setTab] = useState<Tab>("variant");
  const hasContentTab = CATEGORIES_WITH_CONTENT.includes(section.category);
  const requestedTab = useBuilderStore((s) => s.requestedTab);
  const setRequestedTab = useBuilderStore((s) => s.setRequestedTab);
  const selectSection = useBuilderStore((s) => s.selectSection);

  // Inline canvas-edit'ten gelen "şu sekmeyi aç" sinyalini uygula
  React.useEffect(() => {
    if (!requestedTab) return;
    const validTabs: Tab[] = ["variant", "content", "style", "animation", "visibility"];
    if (validTabs.includes(requestedTab as Tab)) {
      // İçerik sekmesi yoksa Variant'a düş
      if (requestedTab === "content" && !hasContentTab) {
        setTab("variant");
      } else {
        setTab(requestedTab as Tab);
      }
    }
    setRequestedTab(null);
  }, [requestedTab, hasContentTab, setRequestedTab]);

  return (
    <div className="h-full flex flex-col">
      {/* "Genel Stil'e Dön" — seçim iptali, GlobalStylePanel'i tekrar açar */}
      <button
        type="button"
        onClick={() => selectSection(null)}
        className="flex items-center gap-1.5 px-4 py-2 text-xs font-medium border-b transition hover:opacity-80"
        style={{
          borderColor: "var(--dashboard-card-border)",
          color: "var(--dashboard-main-text-muted)",
          backgroundColor: "var(--dashboard-main-bg)",
        }}
        title="Bölüm seçimini iptal et — genel stil paneline dön"
      >
        <ArrowLeft className="w-3.5 h-3.5" />
        Genel Stile Dön
      </button>
      <div className="px-4 py-3 border-b" style={{ borderColor: "var(--dashboard-card-border)" }}>
        <div className="text-[10px] uppercase tracking-wide" style={{ color: "var(--dashboard-main-text-muted)" }}>
          {CATEGORY_LABELS[section.category as keyof typeof CATEGORY_LABELS] ?? section.category} bölümü
        </div>
        <div className="text-sm font-bold" style={{ color: "var(--dashboard-main-text)" }}>
          {def?.name ?? section.blockId}
        </div>
      </div>

      <div className="flex border-b" style={{ borderColor: "var(--dashboard-card-border)" }}>
        <TabButton active={tab === "variant"} onClick={() => setTab("variant")} icon={<Wand2 className="w-3.5 h-3.5" />}>
          Tasarım
        </TabButton>
        {hasContentTab && (
          <TabButton active={tab === "content"} onClick={() => setTab("content")} icon={<Type className="w-3.5 h-3.5" />}>
            Metin
          </TabButton>
        )}
        <TabButton active={tab === "style"} onClick={() => setTab("style")} icon={<Palette className="w-3.5 h-3.5" />}>
          Stil
        </TabButton>
        <TabButton active={tab === "animation"} onClick={() => setTab("animation")} icon={<Sparkles className="w-3.5 h-3.5" />}>
          Anim.
        </TabButton>
        <TabButton active={tab === "visibility"} onClick={() => setTab("visibility")} icon={section.enabled ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}>
          Göster
        </TabButton>
      </div>

      <div className="flex-1 overflow-y-auto">
        {tab === "variant" && <VariantTab sectionId={sectionId} />}
        {tab === "content" && hasContentTab && <ContentTab sectionId={sectionId} />}
        {tab === "style" && <StyleTab sectionId={sectionId} />}
        {tab === "animation" && <AnimationTab sectionId={sectionId} />}
        {tab === "visibility" && <VisibilityTab sectionId={sectionId} />}
      </div>
    </div>
  );
}

function TabButton({ active, onClick, icon, children }: { active: boolean; onClick: () => void; icon: React.ReactNode; children: React.ReactNode }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="flex-1 inline-flex items-center justify-center gap-1 py-2 text-xs font-medium border-b-2 transition-colors"
      style={{
        borderColor: active ? "var(--dashboard-accent)" : "transparent",
        color: active ? "var(--dashboard-main-text)" : "var(--dashboard-main-text-muted)",
      }}
    >
      {icon}
      {children}
    </button>
  );
}

// ─── Variant Tab (blok değiştir) ───
function VariantTab({ sectionId }: { sectionId: string }) {
  const section = useBuilderStore((s) => s.config.sections.find((sc) => sc.id === sectionId)!);
  const setSectionBlock = useBuilderStore((s) => s.setSectionBlock);
  const variants = getBlocksByCategory(section.category);
  const [pickerOpen, setPickerOpen] = useState(false);

  return (
    <div className="p-4 space-y-3">
      <p className="text-xs" style={{ color: "var(--dashboard-main-text-muted)" }}>
        Bu kategoride {variants.length} farklı tasarım var. Birini seç:
      </p>
      <div className="grid grid-cols-2 gap-2">
        {variants.slice(0, 6).map((b) => {
          const active = b.id === section.blockId;
          return (
            <button
              key={b.id}
              type="button"
              onClick={() => setSectionBlock(sectionId, b.id)}
              className="text-left rounded-lg overflow-hidden border-2 transition-all hover:scale-[1.02]"
              style={{
                borderColor: active ? "var(--dashboard-accent)" : "var(--dashboard-card-border)",
                backgroundColor: "var(--dashboard-main-bg)",
              }}
            >
              <div className="aspect-video">
                <BlockThumbnail block={b} />
              </div>
              <div className="p-2 text-xs font-medium truncate" style={{ color: "var(--dashboard-main-text)" }}>
                {b.name}
              </div>
            </button>
          );
        })}
      </div>
      {variants.length > 6 && (
        <button
          type="button"
          onClick={() => setPickerOpen(true)}
          className="w-full text-xs px-3 py-2 rounded-md font-semibold"
          style={{ backgroundColor: "var(--dashboard-main-bg)", color: "var(--dashboard-main-text)", border: "1px solid var(--dashboard-card-border)" }}
        >
          Tümünü Gör ({variants.length})
        </button>
      )}
      <BlockPicker
        open={pickerOpen}
        onClose={() => setPickerOpen(false)}
        mode="swap"
        category={section.category}
        sectionId={sectionId}
      />
    </div>
  );
}

// ─── Style Tab ───
const SPACING_OPTIONS: Array<{ value: NonNullable<EliteSectionConfig["spacing"]>; label: string; hint: string }> = [
  { value: "compact", label: "Sıkı", hint: "Üst/alt boşluk yok" },
  { value: "normal", label: "Normal", hint: "Az boşluk" },
  { value: "comfortable", label: "Rahat", hint: "Orta boşluk" },
  { value: "spacious", label: "Geniş", hint: "Bol boşluk" },
];

function StyleTab({ sectionId }: { sectionId: string }) {
  const section = useBuilderStore((s) => s.config.sections.find((sc) => sc.id === sectionId)!);
  const setColors = useBuilderStore((s) => s.setSectionCustomColors);
  const setSpacing = useBuilderStore((s) => s.setSectionSpacing);
  const setBackground = useBuilderStore((s) => s.setSectionBackground);
  const cc = section.customColors;
  const enabled = cc?.enabled ?? false;
  const bg = section.background;

  const update = (patch: Partial<NonNullable<typeof cc>>) => {
    setColors(sectionId, {
      enabled: cc?.enabled ?? false,
      backgroundColor: cc?.backgroundColor ?? "#050505",
      textColor: cc?.textColor ?? "#ffffff",
      primaryColor: cc?.primaryColor ?? "#ccff00",
      ...patch,
    });
  };

  return (
    <div className="p-4 space-y-5">
      {/* Custom Colors */}
      <section className="space-y-3">
        <label className="flex items-start gap-2 cursor-pointer">
          <input
            type="checkbox"
            checked={enabled}
            onChange={(e) => update({ enabled: e.target.checked })}
            className="mt-1"
          />
          <div>
            <div className="text-sm font-medium" style={{ color: "var(--dashboard-main-text)" }}>
              Bu bölüm için özel renkler
            </div>
            <div className="text-xs" style={{ color: "var(--dashboard-main-text-muted)" }}>
              Aktif edilirse global stil yerine bu renkler kullanılır.
            </div>
          </div>
        </label>

        {enabled && cc && (
          <div className="space-y-3 pl-6">
            <ColorRow label="Vurgu Rengi" value={cc.primaryColor} onChange={(v) => update({ primaryColor: v })} />
            <ColorRow label="Arkaplan" value={cc.backgroundColor} onChange={(v) => update({ backgroundColor: v })} />
            <ColorRow label="Metin" value={cc.textColor} onChange={(v) => update({ textColor: v })} />
          </div>
        )}
      </section>

      {/* Spacing */}
      <section className="border-t pt-5 space-y-2" style={{ borderColor: "var(--dashboard-card-border)" }}>
        <div className="text-xs font-semibold uppercase tracking-wider" style={{ color: "var(--dashboard-main-text-muted)" }}>
          Bölüm İç Boşluğu
        </div>
        <p className="text-xs" style={{ color: "var(--dashboard-main-text-muted)" }}>
          Boş bırakırsan blok kendi varsayılan boşluğunu kullanır.
        </p>
        <div className="grid grid-cols-2 gap-2">
          <button
            type="button"
            onClick={() => setSpacing(sectionId, undefined)}
            className="text-left px-3 py-2 rounded-md text-xs border"
            style={{
              borderColor: !section.spacing ? "var(--dashboard-accent)" : "var(--dashboard-card-border)",
              borderWidth: !section.spacing ? 2 : 1,
              backgroundColor: "var(--dashboard-main-bg)",
              color: "var(--dashboard-main-text)",
            }}
          >
            <div className="font-medium">Otomatik</div>
            <div className="text-[10px] opacity-60">Bloğun kendi padding'i</div>
          </button>
          {SPACING_OPTIONS.map((s) => (
            <button
              key={s.value}
              type="button"
              onClick={() => setSpacing(sectionId, s.value)}
              className="text-left px-3 py-2 rounded-md text-xs border"
              style={{
                borderColor: section.spacing === s.value ? "var(--dashboard-accent)" : "var(--dashboard-card-border)",
                borderWidth: section.spacing === s.value ? 2 : 1,
                backgroundColor: "var(--dashboard-main-bg)",
                color: "var(--dashboard-main-text)",
              }}
            >
              <div className="font-medium">{s.label}</div>
              <div className="text-[10px] opacity-60">{s.hint}</div>
            </button>
          ))}
        </div>
      </section>

      {/* Background */}
      <section className="border-t pt-5 space-y-3" style={{ borderColor: "var(--dashboard-card-border)" }}>
        <div className="text-xs font-semibold uppercase tracking-wider" style={{ color: "var(--dashboard-main-text-muted)" }}>
          Bölüm Arkaplanı
        </div>
        <div className="grid grid-cols-2 gap-2">
          <BgStyleButton active={!bg || bg.style === "default"} onClick={() => setBackground(sectionId, undefined)} label="Varsayılan" hint="Bloğun kendi rengi" />
          <BgStyleButton active={bg?.style === "tinted"} onClick={() => setBackground(sectionId, { style: "tinted", gradientFrom: "#1a1410" })} label="Düz Renk" hint="Tek renk overlay" />
          <BgStyleButton active={bg?.style === "gradient"} onClick={() => setBackground(sectionId, { style: "gradient", gradientFrom: "#0a0a0a", gradientTo: "#1a1410", gradientAngle: 135 })} label="Gradient" hint="2 renkli geçiş" />
          <BgStyleButton active={bg?.style === "image"} onClick={() => setBackground(sectionId, { style: "image", imageUrl: "", overlayOpacity: 0.5 })} label="Görsel" hint="Arkaplan resmi" />
        </div>

        {bg?.style === "tinted" && (
          <ColorRow label="Renk" value={bg.gradientFrom || "#1a1410"} onChange={(v) => setBackground(sectionId, { ...bg, gradientFrom: v })} />
        )}

        {bg?.style === "gradient" && (
          <div className="space-y-2">
            <ColorRow label="Başlangıç" value={bg.gradientFrom || "#0a0a0a"} onChange={(v) => setBackground(sectionId, { ...bg, gradientFrom: v })} />
            <ColorRow label="Bitiş" value={bg.gradientTo || "#1a1410"} onChange={(v) => setBackground(sectionId, { ...bg, gradientTo: v })} />
            <div>
              <label className="text-xs font-medium block mb-1" style={{ color: "var(--dashboard-main-text-muted)" }}>
                Açı: {bg.gradientAngle ?? 135}°
              </label>
              <input
                type="range"
                min={0}
                max={360}
                value={bg.gradientAngle ?? 135}
                onChange={(e) => setBackground(sectionId, { ...bg, gradientAngle: Number(e.target.value) })}
                className="w-full"
              />
            </div>
          </div>
        )}

        {bg?.style === "image" && (
          <div className="space-y-2">
            <div>
              <label className="text-xs font-medium block mb-1" style={{ color: "var(--dashboard-main-text-muted)" }}>
                Görsel URL
              </label>
              <input
                type="url"
                value={bg.imageUrl || ""}
                onChange={(e) => setBackground(sectionId, { ...bg, imageUrl: e.target.value })}
                placeholder="https://..."
                className="w-full px-2 py-1.5 rounded text-xs"
                style={{
                  backgroundColor: "var(--dashboard-main-bg)",
                  color: "var(--dashboard-main-text)",
                  border: "1px solid var(--dashboard-card-border)",
                }}
              />
            </div>
            <div>
              <label className="text-xs font-medium block mb-1" style={{ color: "var(--dashboard-main-text-muted)" }}>
                Karartma: {Math.round((bg.overlayOpacity ?? 0.5) * 100)}%
              </label>
              <input
                type="range"
                min={0}
                max={100}
                value={Math.round((bg.overlayOpacity ?? 0.5) * 100)}
                onChange={(e) => setBackground(sectionId, { ...bg, overlayOpacity: Number(e.target.value) / 100 })}
                className="w-full"
              />
            </div>
          </div>
        )}
      </section>
    </div>
  );
}

function BgStyleButton({ active, onClick, label, hint }: { active: boolean; onClick: () => void; label: string; hint: string }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="text-left px-3 py-2 rounded-md text-xs border"
      style={{
        borderColor: active ? "var(--dashboard-accent)" : "var(--dashboard-card-border)",
        borderWidth: active ? 2 : 1,
        backgroundColor: "var(--dashboard-main-bg)",
        color: "var(--dashboard-main-text)",
      }}
    >
      <div className="font-medium">{label}</div>
      <div className="text-[10px] opacity-60">{hint}</div>
    </button>
  );
}

function ColorRow({ label, value, onChange }: { label: string; value: string; onChange: (v: string) => void }) {
  return (
    <div>
      <label className="text-xs font-medium block mb-1" style={{ color: "var(--dashboard-main-text-muted)" }}>
        {label}
      </label>
      <div className="flex items-center gap-2">
        <input
          type="color"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="w-9 h-9 rounded cursor-pointer"
          style={{ border: "1px solid var(--dashboard-card-border)", padding: 0 }}
        />
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="flex-1 px-2 py-1.5 rounded text-xs font-mono"
          style={{
            backgroundColor: "var(--dashboard-main-bg)",
            color: "var(--dashboard-main-text)",
            border: "1px solid var(--dashboard-card-border)",
          }}
        />
      </div>
    </div>
  );
}

// ─── Animation Tab ───
const ANIMATIONS: Array<{ value: AnimationType; label: string }> = [
  { value: "none", label: "Yok" },
  { value: "fade-in", label: "Yumuşak Belirme" },
  { value: "slide-up", label: "Aşağıdan Kayma" },
  { value: "slide-right", label: "Sağdan Kayma" },
  { value: "zoom-in", label: "Yakınlaşma" },
];

function AnimationTab({ sectionId }: { sectionId: string }) {
  const section = useBuilderStore((s) => s.config.sections.find((sc) => sc.id === sectionId)!);
  const setAnim = useBuilderStore((s) => s.setSectionAnimation);
  const current = section.animationType ?? "none";

  return (
    <div className="p-4 space-y-2">
      <p className="text-xs mb-3" style={{ color: "var(--dashboard-main-text-muted)" }}>
        Bu bölüm görüntülendiğinde nasıl belirsin?
      </p>
      {ANIMATIONS.map((a) => {
        const active = current === a.value;
        return (
          <button
            key={a.value}
            type="button"
            onClick={() => setAnim(sectionId, a.value)}
            className="w-full text-left px-3 py-2 rounded-md text-sm border transition-colors"
            style={{
              borderColor: active ? "var(--dashboard-accent)" : "var(--dashboard-card-border)",
              backgroundColor: active ? "var(--dashboard-accent-soft, rgba(204,255,0,0.1))" : "var(--dashboard-main-bg)",
              color: "var(--dashboard-main-text)",
            }}
          >
            {a.label}
          </button>
        );
      })}
    </div>
  );
}

// ─── Content Tab (per-section text override) ───
// Schema-driven: bloklar zaten landingTexts.{key} okuyor, override aynı key'lerle merge ediliyor.
// Yeni kategori eklerken sadece bu map'i genişletmek yeterli; blok kodu değişmez.
type ContentField = {
  key: string;
  label: string;
  multiline?: boolean;
  placeholder?: string;
  group?: string;
  image?: boolean;
  /** Yalnız bu blokId'lerde gösterilir. Atlanırsa tüm bloklarda görünür. */
  onlyForBlocks?: string[];
};

// "Sistem 3'lü kart" — features ve howItWorks blokları aynı key naming'i paylaşıyor.
// Foto alanları opsiyonel: boş bırakılırsa blok kendi ikonuna düşer (fotosuz varyant).
// 4. Kart alanları YALNIZ Bento bloğunda görünür (tek 4 karta sahip blok).
const SYSTEM_TRIPLE_FIELDS: ContentField[] = [
  { key: "systemTitle", label: "Bölüm başlığı", placeholder: "Sistem Nasıl Çalışır?" },
  { key: "system1Title", label: "1. Kart başlığı", placeholder: "Ön Değerlendirme", group: "Kart 1" },
  { key: "system1Description", label: "1. Kart açıklaması", multiline: true, placeholder: "Kısa açıklama...", group: "Kart 1" },
  { key: "system1Image", label: "1. Kart fotoğrafı (opsiyonel)", image: true, group: "Kart 1" },
  { key: "system2Title", label: "2. Kart başlığı", placeholder: "Sistemin Kurulması", group: "Kart 2" },
  { key: "system2Description", label: "2. Kart açıklaması", multiline: true, placeholder: "Kısa açıklama...", group: "Kart 2" },
  { key: "system2Image", label: "2. Kart fotoğrafı (opsiyonel)", image: true, group: "Kart 2" },
  { key: "system3Title", label: "3. Kart başlığı", placeholder: "Aksiyon ve Takip", group: "Kart 3" },
  { key: "system3Description", label: "3. Kart açıklaması", multiline: true, placeholder: "Kısa açıklama...", group: "Kart 3" },
  { key: "system3Image", label: "3. Kart fotoğrafı (opsiyonel)", image: true, group: "Kart 3" },
  { key: "system4Title", label: "4. Kart başlığı", placeholder: "Uzman Beslenme", group: "Kart 4", onlyForBlocks: ["feature-image-bento"] },
  { key: "system4Description", label: "4. Kart açıklaması", multiline: true, placeholder: "Kısa açıklama...", group: "Kart 4", onlyForBlocks: ["feature-image-bento"] },
  { key: "system4Image", label: "4. Kart fotoğrafı (opsiyonel)", image: true, group: "Kart 4", onlyForBlocks: ["feature-image-bento"] },
];

const CONTENT_FIELDS_BY_CATEGORY: Record<string, ContentField[]> = {
  hero: [
    { key: "heroHeadline", label: "Başlık", placeholder: "Hayalinizdeki forma kavuşun" },
    { key: "heroSubtitle", label: "Alt başlık", multiline: true, placeholder: "Kişiselleştirilmiş antrenman ve beslenme programı..." },
    { key: "ctaPrimaryText", label: "Ana buton metni", placeholder: "Başla" },
    { key: "ctaSecondaryText", label: "İkincil buton metni", placeholder: "Daha fazla bilgi" },
  ],
  features: SYSTEM_TRIPLE_FIELDS,
  howItWorks: SYSTEM_TRIPLE_FIELDS,
  stats: [
    { key: "stat1Label", label: "1. İstatistik etiketi", placeholder: "Aktif Öğrenci", group: "İstatistik 1" },
    { key: "stat1Value", label: "1. İstatistik değeri", placeholder: "1.2K+", group: "İstatistik 1" },
    { key: "stat2Label", label: "2. İstatistik etiketi", placeholder: "Başarı Oranı", group: "İstatistik 2" },
    { key: "stat2Value", label: "2. İstatistik değeri", placeholder: "%94", group: "İstatistik 2" },
    { key: "stat3Label", label: "3. İstatistik etiketi", placeholder: "Toplam Dönüşüm", group: "İstatistik 3" },
    { key: "stat3Value", label: "3. İstatistik değeri", placeholder: "500+", group: "İstatistik 3" },
  ],
  packages: [
    { key: "packagesTitle", label: "Bölüm başlığı", placeholder: "Paketler" },
    { key: "packagesSubtitle", label: "Bölüm alt başlığı", multiline: true, placeholder: "Hedeflerinize uygun planı seçin..." },
  ],
  transformations: [
    { key: "transformationsTitle", label: "Bölüm başlığı", placeholder: "Değişimin Kanıtı" },
  ],
  testimonials: [
    { key: "transformationsTitle", label: "Bölüm başlığı", placeholder: "Öğrenci Yorumları" },
  ],
  cta: [
    { key: "ctaEyebrow", label: "Üst etiket (opsiyonel)", placeholder: "Birlikte başaralım" },
    { key: "ctaHeadline", label: "Başlık", placeholder: "Hedeflerine ulaşmaya hazır mısın?" },
    { key: "ctaSubtitle", label: "Alt başlık (opsiyonel)", multiline: true, placeholder: "Kısa, motive edici bir cümle..." },
    { key: "ctaPrimaryText", label: "Buton metni", placeholder: "Hemen başla" },
    { key: "ctaImage", label: "Arkaplan görseli (opsiyonel)", image: true },
  ],
  faq: [
    { key: "faqTitle", label: "Bölüm başlığı", placeholder: "Sıkça Sorulan Sorular" },
    { key: "faqImage", label: "FAQ görseli (opsiyonel)", image: true },
  ],
  about: [
    { key: "aboutEyebrow", label: "Üst etiket (opsiyonel)", placeholder: "Hakkımda" },
    { key: "aboutTitle", label: "Bölüm başlığı", placeholder: "Koçunla tanış" },
    { key: "aboutTitleAccent", label: "Vurgu / İkinci satır (opsiyonel)", placeholder: "Farkımız." },
    { key: "aboutBio1", label: "Ana paragraf", multiline: true, placeholder: "Kısa biyografik metin..." },
    { key: "aboutBio2", label: "İkinci paragraf (opsiyonel)", multiline: true, placeholder: "Devamı..." },
    { key: "aboutRole", label: "Unvan / Rol", placeholder: "Kurucu / Antrenör" },
    { key: "aboutImage", label: "Ana fotoğraf (koç)", image: true },
    { key: "aboutImage2", label: "İkincil fotoğraf (opsiyonel)", image: true },
    { key: "aboutStat1Value", label: "İstatistik 1 — değer", placeholder: "10+" },
    { key: "aboutStat1Label", label: "İstatistik 1 — etiket", placeholder: "Yıl Tecrübe" },
    { key: "aboutStat2Value", label: "İstatistik 2 — değer", placeholder: "200+" },
    { key: "aboutStat2Label", label: "İstatistik 2 — etiket", placeholder: "Mutlu Danışan" },
    { key: "aboutStat3Value", label: "İstatistik 3 — değer", placeholder: "1.900+" },
    { key: "aboutStat3Label", label: "İstatistik 3 — etiket", placeholder: "Antrenman Saati" },
    { key: "aboutBadge1Title", label: "Rozet 1 — başlık (Curtis)", placeholder: "Sertifikalı Koç" },
    { key: "aboutBadge1Subtitle", label: "Rozet 1 — alt (Curtis)", placeholder: "NASM & ACE" },
    { key: "aboutBadge2Title", label: "Rozet 2 — başlık (Curtis)", placeholder: "Profesyonel Yaklaşım" },
    { key: "aboutBadge2Subtitle", label: "Rozet 2 — alt (Curtis)", placeholder: "Aktif Antrenör" },
  ],
  footer: [
    { key: "footerHeadline", label: "Footer başlığı (opsiyonel)", placeholder: "Yerini bul, yolculuğa burada başla" },
    { key: "footerTagline", label: "Footer açıklaması", multiline: true, placeholder: "Marka altı kısa bir slogan..." },
    { key: "footerBusinessHours", label: "Çalışma saatleri (opsiyonel)", multiline: true, placeholder: "Pazartesi – Cuma: 09:00 – 21:00\nCumartesi: 10:00 – 18:00" },
  ],
  navbar: [],
};

function ContentTab({ sectionId }: { sectionId: string }) {
  const section = useBuilderStore((s) => s.config.sections.find((sc) => sc.id === sectionId)!);
  const setOverrides = useBuilderStore((s) => s.setSectionContentOverrides);
  const allFields = CONTENT_FIELDS_BY_CATEGORY[section.category] ?? [];
  // Blok bazlı filtre — örn. system4* alanları yalnız feature-image-bento'da görünür.
  const fields = allFields.filter(
    (f) => !f.onlyForBlocks || f.onlyForBlocks.includes(section.blockId)
  );
  const overrides = (section.contentOverrides ?? {}) as Record<string, string | undefined>;

  const update = (key: string, value: string) => {
    setOverrides(sectionId, { ...overrides, [key]: value || undefined });
  };

  const clearAll = () => {
    setOverrides(sectionId, undefined);
  };

  const hasAny = Object.values(overrides).some((v) => v !== undefined && v !== "");

  // Field'ları grup'a göre düzenle (örn: "Kart 1", "İstatistik 2")
  const ungrouped = fields.filter((f) => !f.group);
  const groupedMap = new Map<string, ContentField[]>();
  for (const f of fields) {
    if (!f.group) continue;
    if (!groupedMap.has(f.group)) groupedMap.set(f.group, []);
    groupedMap.get(f.group)!.push(f);
  }

  if (fields.length === 0) {
    return (
      <div className="p-4">
        <p className="text-xs" style={{ color: "var(--dashboard-main-text-muted)" }}>
          Bu kategoride özelleştirilebilir metin yok. Görsel ve genel marka ayarlarını <em>Stil</em> sekmesinden değiştirebilirsin.
        </p>
      </div>
    );
  }

  return (
    <div className="p-4 space-y-5">
      <div>
        <h4 className="text-sm font-semibold mb-1" style={{ color: "var(--dashboard-main-text)" }}>
          Bu bölüme özel metinler
        </h4>
        <p className="text-xs" style={{ color: "var(--dashboard-main-text-muted)" }}>
          Boş bırakırsan global metinler kullanılır. Bu bölüm için farklı bir metin istersen aşağıya yaz.
        </p>
      </div>

      {/* Grup'a girmeyen alanlar (genelde başlık/alt başlık) */}
      {ungrouped.length > 0 && (
        <div className="space-y-3">
          {ungrouped.map((field) => (
            <FieldInput
              key={field.key}
              field={field}
              value={overrides[field.key] ?? ""}
              onChange={(v) => update(field.key, v)}
            />
          ))}
        </div>
      )}

      {/* Grup'a giren alanlar (Kart/İstatistik 1-2-3) */}
      {Array.from(groupedMap.entries()).map(([groupName, groupFields]) => (
        <div
          key={groupName}
          className="rounded-lg border p-3 space-y-3"
          style={{
            borderColor: "var(--dashboard-card-border)",
            backgroundColor: "color-mix(in srgb, var(--dashboard-card-bg) 70%, transparent)",
          }}
        >
          <p className="text-[11px] font-semibold uppercase tracking-wider" style={{ color: "var(--dashboard-main-text-muted)" }}>
            {groupName}
          </p>
          {groupFields.map((field) => (
            <FieldInput
              key={field.key}
              field={field}
              value={overrides[field.key] ?? ""}
              onChange={(v) => update(field.key, v)}
            />
          ))}
        </div>
      ))}

      {hasAny && (
        <button
          type="button"
          onClick={clearAll}
          className="w-full text-xs px-3 py-2 rounded-md border"
          style={{
            backgroundColor: "var(--dashboard-main-bg)",
            color: "var(--dashboard-main-text)",
            borderColor: "var(--dashboard-card-border)",
          }}
        >
          Tüm override'ları temizle (global'a dön)
        </button>
      )}
    </div>
  );
}

function FieldInput({
  field,
  value,
  onChange,
}: {
  field: ContentField;
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <div>
      <label className="text-xs font-medium block mb-1" style={{ color: "var(--dashboard-main-text-muted)" }}>
        {field.label}
      </label>
      {field.image ? (
        <FileUpload
          bucket="transformations"
          currentUrl={value || undefined}
          onUploaded={(url) => onChange(url)}
          label={field.label}
          aspectRatio="aspect-video"
        />
      ) : field.multiline ? (
        <textarea
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={field.placeholder}
          rows={3}
          className="w-full px-3 py-2 rounded-md text-sm resize-y"
          style={{
            backgroundColor: "var(--dashboard-main-bg)",
            color: "var(--dashboard-main-text)",
            border: "1px solid var(--dashboard-card-border)",
          }}
        />
      ) : (
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={field.placeholder}
          className="w-full px-3 py-2 rounded-md text-sm"
          style={{
            backgroundColor: "var(--dashboard-main-bg)",
            color: "var(--dashboard-main-text)",
            border: "1px solid var(--dashboard-card-border)",
          }}
        />
      )}
    </div>
  );
}

// ─── Visibility Tab ───
function VisibilityTab({ sectionId }: { sectionId: string }) {
  const section = useBuilderStore((s) => s.config.sections.find((sc) => sc.id === sectionId)!);
  const toggle = useBuilderStore((s) => s.toggleSection);

  return (
    <div className="p-4 space-y-3">
      <p className="text-xs" style={{ color: "var(--dashboard-main-text-muted)" }}>
        Bu bölümü canlı sayfanda görünür yap veya gizle.
      </p>
      <button
        type="button"
        onClick={() => toggle(sectionId)}
        className="w-full px-3 py-2 rounded-md text-sm font-semibold transition-opacity hover:opacity-90"
        style={{
          backgroundColor: section.enabled ? "var(--dashboard-main-bg)" : "var(--dashboard-accent)",
          color: section.enabled ? "var(--dashboard-main-text)" : "var(--dashboard-accent-text)",
          border: "1px solid var(--dashboard-card-border)",
        }}
      >
        {section.enabled ? "Şu an görünür — Gizle" : "Şu an gizli — Göster"}
      </button>
    </div>
  );
}
