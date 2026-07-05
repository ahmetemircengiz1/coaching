"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { updateCoachSettings } from "../actions";
import { notifyPreviewRefresh } from "@/src/lib/preview-bus";

const THEME_DEFAULTS: Record<number, { heroHeadline: string; heroSubtitle: string; ctaPrimaryText: string; ctaSecondaryText: string }> = {
  1: { heroHeadline: "Mükemmeliğe Ulaşın.", heroSubtitle: "", ctaPrimaryText: "Koleksiyonu İncele", ctaSecondaryText: "Başla" },
  2: { heroHeadline: "Derin Gelişim", heroSubtitle: "", ctaPrimaryText: "Keşfet", ctaSecondaryText: "" },
  3: { heroHeadline: "Potansiyelinizin en güçlü haline ulaşın.", heroSubtitle: "", ctaPrimaryText: "Programları İncele", ctaSecondaryText: "Başla" },
  4: { heroHeadline: "Koçluk deneyimini yeniden tasarladık.", heroSubtitle: "", ctaPrimaryText: "Sistemi Keşfet", ctaSecondaryText: "Nasıl Çalışır?" },
  5: { heroHeadline: "Evriminizi Hackleyin.", heroSubtitle: "", ctaPrimaryText: "Programları İncele", ctaSecondaryText: "Başla" },
  6: { heroHeadline: "Limitleri Yeniden Tanımla", heroSubtitle: "", ctaPrimaryText: "Sisteme Dahil Ol", ctaSecondaryText: "" },
};

// Aşama 1 (sadeleştirme): Basic UI'da gizlenmiş ileri seviye override anahtarları.
// Eski koçların DB'de bu değerleri olabilir; UI artık düzenlemiyor ama her save'de
// pass-through olarak geri yazılır, böylece silinmez. Elite (Section Builder)
// arayüzü ileride bu alanları açıkça düzenleyecek.
const PRESERVED_FIXED_KEYS = [
  "heroSubtitleColor",
  "heroSubtitleScale",
  "heroHeadlineBgColor",
  "heroSubtitleBgColor",
  "heroTextPositionMode",
  "heroTextPosX",
  "heroTextPosY",
  "packagesTitleFont",
  "packagesCardFont",
] as const;
const PRESERVED_SECTION_IDS = [
  "hero",
  "stats",
  "system",
  "transformations",
  "packages",
  "faq",
  "footer",
] as const;
const PRESERVED_STYLE_SUFFIXES = ["TextColor", "TextEffect", "TextAlign", "TextScale", "TextWeight"] as const;

interface LandingTextsSettingsProps {
  domain: string;
  initialLandingTexts: Record<string, string> | null;
  selectedThemeId: number;
  onSaved?: (saved: Record<string, string> | null) => void;
}

export function LandingTextsSettings({ domain, initialLandingTexts, selectedThemeId, onSaved }: LandingTextsSettingsProps) {
  const defaults = THEME_DEFAULTS[selectedThemeId] || THEME_DEFAULTS[1];

  // Hero text content
  const [heroHeadline, setHeroHeadline] = useState(initialLandingTexts?.heroHeadline || "");
  const [heroSubtitle, setHeroSubtitle] = useState(initialLandingTexts?.heroSubtitle || "");
  const [ctaPrimaryText, setCtaPrimaryText] = useState(initialLandingTexts?.ctaPrimaryText || "");
  const [ctaSecondaryText, setCtaSecondaryText] = useState(initialLandingTexts?.ctaSecondaryText || "");

  // Section texts
  const [stat1Label, setStat1Label] = useState(initialLandingTexts?.stat1Label || "");
  const [stat2Label, setStat2Label] = useState(initialLandingTexts?.stat2Label || "");
  const [stat3Label, setStat3Label] = useState(initialLandingTexts?.stat3Label || "");
  const [stat1Value, setStat1Value] = useState(initialLandingTexts?.stat1Value || "");
  const [stat2Value, setStat2Value] = useState(initialLandingTexts?.stat2Value || "");
  const [stat3Value, setStat3Value] = useState(initialLandingTexts?.stat3Value || "");
  const [systemTitle, setSystemTitle] = useState(initialLandingTexts?.systemTitle || "");
  const [systemSubtitle, setSystemSubtitle] = useState(initialLandingTexts?.systemSubtitle || "");
  const [system1Title, setSystem1Title] = useState(initialLandingTexts?.system1Title || "");
  const [system1Description, setSystem1Description] = useState(initialLandingTexts?.system1Description || "");
  const [system2Title, setSystem2Title] = useState(initialLandingTexts?.system2Title || "");
  const [system2Description, setSystem2Description] = useState(initialLandingTexts?.system2Description || "");
  const [system3Title, setSystem3Title] = useState(initialLandingTexts?.system3Title || "");
  const [system3Description, setSystem3Description] = useState(initialLandingTexts?.system3Description || "");
  const [transformationsTitle, setTransformationsTitle] = useState(initialLandingTexts?.transformationsTitle || "");
  const [packagesTitle, setPackagesTitle] = useState(initialLandingTexts?.packagesTitle || "");
  const [packagesSubtitle, setPackagesSubtitle] = useState(initialLandingTexts?.packagesSubtitle || "");
  const [faqTitle, setFaqTitle] = useState(initialLandingTexts?.faqTitle || "");
  const [footerTagline, setFooterTagline] = useState(initialLandingTexts?.footerTagline || "");

  // Mount sırasındaki advanced override snapshot'ı — save'de hep birlikte gönderilir.
  const preservedAdvancedTexts = useMemo<Record<string, string>>(() => {
    if (!initialLandingTexts) return {};
    const advanced: Record<string, string> = {};
    for (const k of PRESERVED_FIXED_KEYS) {
      const v = initialLandingTexts[k];
      if (v !== undefined && v !== "") advanced[k] = v;
    }
    for (const id of PRESERVED_SECTION_IDS) {
      for (const suffix of PRESERVED_STYLE_SUFFIXES) {
        const key = `${id}${suffix}`;
        const v = initialLandingTexts[key];
        if (v !== undefined && v !== "") advanced[key] = v;
      }
    }
    return advanced;
  }, [initialLandingTexts]);

  const initialRef = useRef(JSON.stringify(initialLandingTexts || {}));
  const debounceRef = useRef<ReturnType<typeof setTimeout>>(null);

  const getCurrentTexts = useCallback(() => {
    // Önce gizli advanced alanları geri yaz, sonra Basic UI alanları üzerine binsin.
    const texts: Record<string, string> = { ...preservedAdvancedTexts };

    if (heroHeadline.trim()) texts.heroHeadline = heroHeadline.trim().slice(0, 200);
    if (heroSubtitle.trim()) texts.heroSubtitle = heroSubtitle.trim().slice(0, 200);
    if (ctaPrimaryText.trim()) texts.ctaPrimaryText = ctaPrimaryText.trim().slice(0, 50);
    if (ctaSecondaryText.trim()) texts.ctaSecondaryText = ctaSecondaryText.trim().slice(0, 50);

    if (stat1Label.trim()) texts.stat1Label = stat1Label.trim().slice(0, 50);
    if (stat2Label.trim()) texts.stat2Label = stat2Label.trim().slice(0, 50);
    if (stat3Label.trim()) texts.stat3Label = stat3Label.trim().slice(0, 50);
    if (stat1Value.trim()) texts.stat1Value = stat1Value.trim().slice(0, 20);
    if (stat2Value.trim()) texts.stat2Value = stat2Value.trim().slice(0, 20);
    if (stat3Value.trim()) texts.stat3Value = stat3Value.trim().slice(0, 20);
    if (systemTitle.trim()) texts.systemTitle = systemTitle.trim().slice(0, 120);
    if (systemSubtitle.trim()) texts.systemSubtitle = systemSubtitle.trim().slice(0, 300);
    if (system1Title.trim()) texts.system1Title = system1Title.trim().slice(0, 80);
    if (system1Description.trim()) texts.system1Description = system1Description.trim().slice(0, 300);
    if (system2Title.trim()) texts.system2Title = system2Title.trim().slice(0, 80);
    if (system2Description.trim()) texts.system2Description = system2Description.trim().slice(0, 300);
    if (system3Title.trim()) texts.system3Title = system3Title.trim().slice(0, 80);
    if (system3Description.trim()) texts.system3Description = system3Description.trim().slice(0, 300);
    if (transformationsTitle.trim()) texts.transformationsTitle = transformationsTitle.trim().slice(0, 100);
    if (packagesTitle.trim()) texts.packagesTitle = packagesTitle.trim().slice(0, 100);
    if (packagesSubtitle.trim()) texts.packagesSubtitle = packagesSubtitle.trim().slice(0, 200);
    if (faqTitle.trim()) texts.faqTitle = faqTitle.trim().slice(0, 100);
    if (footerTagline.trim()) texts.footerTagline = footerTagline.trim().slice(0, 200);

    return Object.keys(texts).length > 0 ? texts : null;
  }, [
    preservedAdvancedTexts,
    heroHeadline, heroSubtitle, ctaPrimaryText, ctaSecondaryText,
    stat1Label, stat2Label, stat3Label, stat1Value, stat2Value, stat3Value,
    systemTitle, systemSubtitle,
    system1Title, system1Description, system2Title, system2Description, system3Title, system3Description,
    transformationsTitle, packagesTitle, packagesSubtitle, faqTitle, footerTagline,
  ]);

  useEffect(() => {
    const snapshot = getCurrentTexts();
    const current = JSON.stringify(snapshot || {});
    if (current === initialRef.current) return;

    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(async () => {
      await updateCoachSettings(domain, { landingTexts: snapshot });
      initialRef.current = current;
      notifyPreviewRefresh();
      onSaved?.(snapshot);
    }, 1500);
  }, [getCurrentTexts, domain, onSaved]);

  const inputStyle = { borderColor: "var(--dashboard-card-border)", color: "var(--dashboard-main-text)" };
  const inputClass = "w-full rounded-lg border px-3 py-2 text-sm bg-transparent outline-none transition focus:ring-2";

  return (
    <Card style={{ backgroundColor: "var(--dashboard-card-bg)", borderColor: "var(--dashboard-card-border)", color: "var(--dashboard-main-text)" }}>
      <CardHeader>
        <CardTitle className="text-lg">Landing Sayfa Metinleri</CardTitle>
        <p className="text-sm" style={{ color: "var(--dashboard-main-text-muted)" }}>
          Hero bölümündeki başlık, açıklama ve buton metinlerini özelleştirin. Boş bırakırsanız tema varsayılanları kullanılır.
        </p>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* ─── Hero Metin İçeriği ─── */}
        <div className="space-y-4">
          <h3 className="text-sm font-semibold uppercase tracking-wider" style={{ color: "var(--dashboard-main-text-muted)" }}>Hero Metinleri</h3>
          <div>
            <label className="block text-sm font-medium mb-1.5">Hero Başlık</label>
            <input type="text" value={heroHeadline} onChange={(e) => setHeroHeadline(e.target.value)} placeholder={defaults.heroHeadline} maxLength={200} className={inputClass} style={inputStyle} />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1.5">Hero Açıklama</label>
            <textarea value={heroSubtitle} onChange={(e) => setHeroSubtitle(e.target.value)} placeholder={defaults.heroSubtitle || "Bio metniniz kullanılacak"} maxLength={200} rows={2} className={`${inputClass} resize-none`} style={inputStyle} />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1.5">Birincil Buton</label>
              <input type="text" value={ctaPrimaryText} onChange={(e) => setCtaPrimaryText(e.target.value)} placeholder={defaults.ctaPrimaryText} maxLength={50} className={inputClass} style={inputStyle} />
            </div>
            {defaults.ctaSecondaryText && (
              <div>
                <label className="block text-sm font-medium mb-1.5">İkincil Buton</label>
                <input type="text" value={ctaSecondaryText} onChange={(e) => setCtaSecondaryText(e.target.value)} placeholder={defaults.ctaSecondaryText} maxLength={50} className={inputClass} style={inputStyle} />
              </div>
            )}
          </div>
        </div>

        {/* ─── Bölüm Başlıkları ─── */}
        <div className="space-y-4 border-t pt-6" style={{ borderColor: "var(--dashboard-card-border)" }}>
          <h3 className="text-sm font-semibold uppercase tracking-wider" style={{ color: "var(--dashboard-main-text-muted)" }}>Bölüm Başlıkları</h3>
          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="block text-xs font-medium mb-1">İstatistik 1 Etiket</label>
              <input type="text" value={stat1Label} onChange={(e) => setStat1Label(e.target.value)} placeholder="Aktif Öğrenci" maxLength={50} className={inputClass} style={inputStyle} />
            </div>
            <div>
              <label className="block text-xs font-medium mb-1">İstatistik 2 Etiket</label>
              <input type="text" value={stat2Label} onChange={(e) => setStat2Label(e.target.value)} placeholder="Başarılı Dönüşüm" maxLength={50} className={inputClass} style={inputStyle} />
            </div>
            <div>
              <label className="block text-xs font-medium mb-1">İstatistik 3 Etiket</label>
              <input type="text" value={stat3Label} onChange={(e) => setStat3Label(e.target.value)} placeholder="Yıl Deneyim" maxLength={50} className={inputClass} style={inputStyle} />
            </div>
            <div>
              <label className="block text-xs font-medium mb-1">İstatistik 1 Sayı</label>
              <input type="text" value={stat1Value} onChange={(e) => setStat1Value(e.target.value)} placeholder="500+" maxLength={20} className={inputClass} style={inputStyle} />
            </div>
            <div>
              <label className="block text-xs font-medium mb-1">İstatistik 2 Sayı</label>
              <input type="text" value={stat2Value} onChange={(e) => setStat2Value(e.target.value)} placeholder="10+" maxLength={20} className={inputClass} style={inputStyle} />
            </div>
            <div>
              <label className="block text-xs font-medium mb-1">İstatistik 3 Sayı</label>
              <input type="text" value={stat3Value} onChange={(e) => setStat3Value(e.target.value)} placeholder="5+" maxLength={20} className={inputClass} style={inputStyle} />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1.5">Dönüşüm Bölümü Başlığı</label>
            <input type="text" value={transformationsTitle} onChange={(e) => setTransformationsTitle(e.target.value)} placeholder="Tema varsayılanı" maxLength={100} className={inputClass} style={inputStyle} />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1.5">Paketler Başlığı</label>
              <input type="text" value={packagesTitle} onChange={(e) => setPackagesTitle(e.target.value)} placeholder="Tema varsayılanı" maxLength={100} className={inputClass} style={inputStyle} />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1.5">Paketler Açıklaması</label>
              <input type="text" value={packagesSubtitle} onChange={(e) => setPackagesSubtitle(e.target.value)} placeholder="Tema varsayılanı" maxLength={200} className={inputClass} style={inputStyle} />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1.5">SSS Başlığı</label>
            <input type="text" value={faqTitle} onChange={(e) => setFaqTitle(e.target.value)} placeholder="Sık Sorulan Sorular" maxLength={100} className={inputClass} style={inputStyle} />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1.5">Footer Açıklama</label>
            <input type="text" value={footerTagline} onChange={(e) => setFooterTagline(e.target.value)} placeholder="Tema varsayılanı" maxLength={200} className={inputClass} style={inputStyle} />
          </div>
        </div>

        {/* ─── Sistem Nasıl İşler Bölümü ─── */}
        <div className="space-y-4 border-t pt-6" style={{ borderColor: "var(--dashboard-card-border)" }}>
          <h3 className="text-sm font-semibold uppercase tracking-wider" style={{ color: "var(--dashboard-main-text-muted)" }}>Sistem Nasıl İşler Bölümü</h3>
          <div>
            <label className="block text-sm font-medium mb-1.5">Bölüm Başlığı</label>
            <input type="text" value={systemTitle} onChange={(e) => setSystemTitle(e.target.value)} placeholder="Sistem Nasıl İşler?" maxLength={120} className={inputClass} style={inputStyle} />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1.5">Bölüm Açıklaması</label>
            <textarea value={systemSubtitle} onChange={(e) => setSystemSubtitle(e.target.value)} placeholder="Koçluk sürecimizin üç adımlı yapısı." maxLength={300} rows={2} className={`${inputClass} resize-none`} style={inputStyle} />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <label className="block text-xs font-semibold uppercase tracking-wider" style={{ color: "var(--dashboard-main-text-muted)" }}>1. Kart</label>
              <input type="text" value={system1Title} onChange={(e) => setSystem1Title(e.target.value)} placeholder="Analiz & Planlama" maxLength={80} className={inputClass} style={inputStyle} />
              <textarea value={system1Description} onChange={(e) => setSystem1Description(e.target.value)} placeholder="İhtiyaçlarına özel plan." maxLength={300} rows={3} className={`${inputClass} resize-none`} style={inputStyle} />
            </div>
            <div className="space-y-2">
              <label className="block text-xs font-semibold uppercase tracking-wider" style={{ color: "var(--dashboard-main-text-muted)" }}>2. Kart</label>
              <input type="text" value={system2Title} onChange={(e) => setSystem2Title(e.target.value)} placeholder="Uygulama & Takip" maxLength={80} className={inputClass} style={inputStyle} />
              <textarea value={system2Description} onChange={(e) => setSystem2Description(e.target.value)} placeholder="Günlük destek ve haftalık check-in." maxLength={300} rows={3} className={`${inputClass} resize-none`} style={inputStyle} />
            </div>
            <div className="space-y-2">
              <label className="block text-xs font-semibold uppercase tracking-wider" style={{ color: "var(--dashboard-main-text-muted)" }}>3. Kart</label>
              <input type="text" value={system3Title} onChange={(e) => setSystem3Title(e.target.value)} placeholder="Optimizasyon & Sonuç" maxLength={80} className={inputClass} style={inputStyle} />
              <textarea value={system3Description} onChange={(e) => setSystem3Description(e.target.value)} placeholder="Sürekli iyileştirme ve ölçülebilir kazanımlar." maxLength={300} rows={3} className={`${inputClass} resize-none`} style={inputStyle} />
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
