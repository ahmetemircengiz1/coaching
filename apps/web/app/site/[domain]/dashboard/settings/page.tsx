"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import {
  Check, ChevronDown, Lock, Plus, Trash2, Pencil, Copy, ExternalLink,
  Palette, FileText, Package, Phone, KeyRound,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  getCoachSettings,
  updateCoachSettings,
} from "../actions";
import {
  getCoachPackages,
  createCoachPackage,
  updateCoachPackage,
  deleteCoachPackage,
} from "../packages/actions";
import { DASHBOARD_THEME_LIST } from "@/src/theme/dashboardThemes";
import { LANDING_THEME_LIST } from "@/src/theme/landingThemes";
import { LandingThemePreview } from "@/src/components/theme-preview/LandingThemePreview";
import { DashboardThemePreview } from "@/src/components/theme-preview/DashboardThemePreview";
import { LandingPageSettings } from "./LandingPageSettings";
import { SocialLinksSettings } from "./SocialLinksSettings";
import { HeroImageSettings } from "./HeroImageSettings";
import { LandingTextsSettings } from "./LandingTextsSettings";
import { AboutTextSettings } from "./AboutTextSettings";
import { FaqSettings } from "./FaqSettings";
import { LandingPreviewPanel } from "./LandingPreviewPanel";
import { HeroVideoSettings } from "./HeroVideoSettings";
import { LandingBuilder } from "./builder/LandingBuilder";
import { ContactLegalSettings } from "./ContactLegalSettings";
import { logoutAction } from "@/app/site/[domain]/auth/logout-action";
import type { LandingFeatures } from "@/src/lib/plan";

// Konsolide edilmiş 5 ana grup. Her grup birden fazla "section" içerir,
// bölümler grubun içinde sırayla render edilir.
type SettingsGroupId =
  | "marka-site"
  | "site-icerigi"
  | "paketler-odeme"
  | "iletisim-yasal"
  | "hesap-guvenlik";

type SectionId =
  | "marka-kimligi"
  | "site-tasarim"
  | "sayfa-icerikleri"
  | "paketler"
  | "iletisim-sosyal"
  | "yasal"
  | "alan-adi"
  | "hesap"
  | "odeme";

type LandingSubTab = "gorsel" | "metinler" | "bolumler" | "sss" | "donusumler" | "yorumlar";

interface LandingSubTabDef {
  id: LandingSubTab;
  label: string;
  hint: string;
}

// Moda göre hangi sub-tab görünecek. S.S.S., Dönüşümler ve Yorumlar her iki modda
// da bağımsız sekmelerdir — böylece Görsel sekmesinin altında "yanlışlıkla" çıkmazlar.
const LANDING_SUB_TABS_TEMPLATE: LandingSubTabDef[] = [
  { id: "gorsel",     label: "Görsel",     hint: "Hero arka plan görseli" },
  { id: "metinler",   label: "Metinler",   hint: "Hazır şablonun metinleri" },
  { id: "sss",        label: "S.S.S.",     hint: "Sıkça sorulan sorular" },
  { id: "donusumler", label: "Dönüşümler", hint: "Müşteri dönüşüm hikayeleri" },
  { id: "yorumlar",   label: "Yorumlar",   hint: "Öğrenci yorumları" },
];

const LANDING_SUB_TABS_BUILDER: LandingSubTabDef[] = [
  { id: "gorsel",     label: "Görsel",     hint: "Hero arka plan görseli" },
  { id: "bolumler",   label: "Bölümler",   hint: "Section Builder düzenleyicisi" },
  { id: "sss",        label: "S.S.S.",     hint: "Sıkça sorulan sorular" },
  { id: "donusumler", label: "Dönüşümler", hint: "Müşteri dönüşüm hikayeleri" },
  { id: "yorumlar",   label: "Yorumlar",   hint: "Öğrenci yorumları" },
];

interface SettingsGroup {
  id: SettingsGroupId;
  label: string;
  description: string;
  Icon: LucideIcon;
  includes: SectionId[];
}

const SETTINGS_GROUPS: SettingsGroup[] = [
  {
    id: "marka-site",
    label: "Marka & Tasarım",
    description: "Marka adı, renkler, site modu ve tema",
    Icon: Palette,
    includes: ["marka-kimligi", "site-tasarim"],
  },
  {
    id: "site-icerigi",
    label: "Site İçeriği",
    description: "Hero, metinler, S.S.S., dönüşümler ve yorumlar — sekmelerden seç",
    Icon: FileText,
    includes: ["sayfa-icerikleri"],
  },
  {
    id: "paketler-odeme",
    label: "Paketler",
    description: "Koçluk paketleri ve alan adı bilgileri",
    Icon: Package,
    includes: ["paketler", "alan-adi"],
  },
  {
    id: "iletisim-yasal",
    label: "İletişim & Yasal",
    description: "WhatsApp, sosyal medya ve yasal sayfalar",
    Icon: Phone,
    includes: ["iletisim-sosyal", "yasal"],
  },
  {
    id: "hesap-guvenlik",
    label: "Hesap & Güvenlik",
    description: "E-posta, şifre ve oturum",
    Icon: KeyRound,
    includes: ["hesap"],
  },
];

function toThemeNumber(value: unknown): number {
  if (typeof value === "number" && value >= 1 && value <= 7) {
    return value;
  }

  if (typeof value === "string") {
    if (value.startsWith("theme-")) {
      const parsedTheme = Number(value.replace("theme-", ""));
      if (!Number.isNaN(parsedTheme) && parsedTheme >= 1 && parsedTheme <= 7) {
        return parsedTheme;
      }
    }

    if (value === "theme-elite" || value === "elite-builder") {
      return 7;
    }

    switch (value) {
      case "dark-gold":
      case "modern-teal":
        return 2;
      case "light-gold":
      case "fresh-light":
        return 3;
      case "dark-orange":
      case "clean-red":
        return 4;
      case "light-modern":
      case "sport-dark":
        return 5;
      case "dynamic-scroll":
        return 6;
      case "dark-teal":
      case "classic-dark":
      default:
        return 1;
    }
  }

  return 1;
}

interface PackageData {
  id: string;
  name: string;
  description: string;
  duration: number;
  price: number;
  currency: string;
  features: unknown;
  isActive: boolean;
  _count: { students: number };
}

const SIDEBAR_POSITIONS = [
  { value: "left", label: "Sol", icon: "◀" },
  { value: "bottom", label: "Alt", icon: "▼" },
  { value: "right", label: "Sağ", icon: "▶" },
] as const;

// ─── Accordion Card ───
// Marka & Tasarım grubundaki tüm düzenleme blokları varsayılan olarak kapalı;
// başlığa tıklanınca açılır ve görünüm alanına scroll edilir.
function AccordionCard({
  id,
  title,
  description,
  children,
  defaultOpen = false,
}: {
  id: string;
  title: string;
  description?: string;
  children: React.ReactNode;
  defaultOpen?: boolean;
}) {
  const [open, setOpen] = useState(defaultOpen);
  const ref = useRef<HTMLDivElement | null>(null);

  const toggle = () => {
    const next = !open;
    setOpen(next);
    if (next) {
      // Açılış animasyonu sonrası scroll — başlık her zaman üstte kalsın
      requestAnimationFrame(() => {
        ref.current?.scrollIntoView({ behavior: "smooth", block: "start" });
      });
    }
  };

  return (
    <Card
      ref={ref}
      id={`acc-${id}`}
      style={{
        backgroundColor: "var(--dashboard-card-bg)",
        borderColor: "var(--dashboard-card-border)",
        color: "var(--dashboard-main-text)",
      }}
    >
      <button
        type="button"
        onClick={toggle}
        aria-expanded={open}
        aria-controls={`acc-body-${id}`}
        className="w-full flex items-start justify-between gap-3 text-left px-6 py-4 hover:opacity-90 transition"
      >
        <div className="flex-1 min-w-0">
          <h3 className="text-lg font-semibold leading-tight" style={{ color: "var(--dashboard-main-text)" }}>
            {title}
          </h3>
          {description && (
            <p className="text-sm mt-1" style={{ color: "var(--dashboard-main-text-muted)" }}>
              {description}
            </p>
          )}
        </div>
        <ChevronDown
          className="h-5 w-5 shrink-0 mt-0.5 transition-transform"
          style={{
            color: "var(--dashboard-main-text-muted)",
            transform: open ? "rotate(180deg)" : "rotate(0deg)",
          }}
        />
      </button>
      {open && (
        <div id={`acc-body-${id}`} className="px-6 pb-6">
          {children}
        </div>
      )}
    </Card>
  );
}

export default function SettingsPage() {
  const params = useParams();
  const router = useRouter();
  const domain = params.domain as string;

  const [activeGroup, setActiveGroup] = useState<SettingsGroupId>("marka-site");
  const [landingSubTab, setLandingSubTab] = useState<LandingSubTab>("gorsel");
  const [loading, setLoading] = useState(true);
  const [savingBranding, setSavingBranding] = useState(false);
  const [savingLanding, setSavingLanding] = useState(false);
  const [savingDashboard, setSavingDashboard] = useState(false);
  const [savingLayout, setSavingLayout] = useState(false);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");

  const [branding, setBranding] = useState({
    brandName: "",
    bio: "",
    primaryColor: "#000000",
    secondaryColor: "#ccff00",
  });
  const [packageInfo, setPackageInfo] = useState({
    name: "",
    maxStudents: 0,
    subdomain: "",
    planId: "STARTER",
  });
  const [availableThemeIds, setAvailableThemeIds] = useState<number[]>([1]);
  const [selectedLandingThemeId, setSelectedLandingThemeId] = useState(1);
  const [selectedDashboardThemeId, setSelectedDashboardThemeId] = useState(1);
  const [sidebarPosition, setSidebarPosition] = useState("left");
  // Aşama 2: Site modu (TEMPLATE = 6 hazır şablon, BUILDER = Section Builder)
  const [siteMode, setSiteMode] = useState<"TEMPLATE" | "BUILDER">("TEMPLATE");
  const [savingSiteMode, setSavingSiteMode] = useState(false);
  // Aşama 3: Hesap grubu
  const [coachEmail, setCoachEmail] = useState<string>("");

  // Kademe 2 state
  const [landingConfig, setLandingConfig] = useState<unknown>(null);
  const [eliteConfig, setEliteConfig] = useState<unknown>(null);
  const [socialLinks, setSocialLinks] = useState<unknown>(null);
  const [landingFeatures, setLandingFeatures] = useState<LandingFeatures>({
    canReorderSections: false,
    canToggleSections: false,
    maxVariant: 1,
    canSelectFonts: false,
    maxSocialLinks: 3,
    canEnableFAQ: false,
  });

  // Preview auto-refreshes itself via LandingPreviewPanel's internal interval

  // Hero image state
  const [heroImageOriginalUrl, setHeroImageOriginalUrl] = useState("");
  const [heroImageDesktopUrl, setHeroImageDesktopUrl] = useState("");
  const [heroImageMobileUrl, setHeroImageMobileUrl] = useState("");
  const [heroImageBlurDataUrl, setHeroImageBlurDataUrl] = useState("");
  const [heroFocalX, setHeroFocalX] = useState(50);
  const [heroFocalY, setHeroFocalY] = useState(35);
  const [heroMode, setHeroMode] = useState<"photo" | "logo">("photo");
  const [heroImageDark, setHeroImageDark] = useState<boolean | null>(null);
  const [heroVideoUrl, setHeroVideoUrl] = useState("");
  const [landingTexts, setLandingTexts] = useState<Record<string, string> | null>(null);
  const [aboutText, setAboutText] = useState("");
  const [landingFaqs, setLandingFaqs] = useState<
    { id: string; question: string; answer: string }[] | null
  >(null);
  const [whatsappNumber, setWhatsappNumber] = useState<string | null>(null);

  // İletişim & Yasal state
  const [contactLegal, setContactLegal] = useState<{
    contactPhone: string | null;
    businessAddress: string | null;
    legalFullName: string | null;
    taxId: string | null;
    legalTexts: Record<string, string> | null;
  }>({
    contactPhone: null,
    businessAddress: null,
    legalFullName: null,
    taxId: null,
    legalTexts: null,
  });

  // Packages state
  const [packages, setPackages] = useState<PackageData[]>([]);
  const [editingPkgId, setEditingPkgId] = useState<string | null>(null);
  const [showPkgCreate, setShowPkgCreate] = useState(false);
  const [savingPkg, setSavingPkg] = useState(false);
  const [pkgName, setPkgName] = useState("");
  const [pkgDescription, setPkgDescription] = useState("");
  const [pkgDuration, setPkgDuration] = useState(4);
  const [pkgPrice, setPkgPrice] = useState(0);
  const [pkgCurrency, setPkgCurrency] = useState("TRY");
  const [pkgFeatures, setPkgFeatures] = useState("");
  const [pkgIsActive, setPkgIsActive] = useState(true);

  useEffect(() => {
    async function loadSettings() {
      const [settings, pkgData] = await Promise.all([
        getCoachSettings(domain),
        getCoachPackages(domain),
      ]);

      setBranding({
        brandName: settings.brandName,
        bio: settings.bio,
        primaryColor: settings.primaryColor,
        secondaryColor: settings.secondaryColor,
      });

      setSelectedLandingThemeId(toThemeNumber(settings.landingThemeId || settings.templateId));
      setSelectedDashboardThemeId(
        toThemeNumber(settings.dashboardThemeId || settings.dashboardTemplateId)
      );
      setAvailableThemeIds(
        Array.isArray(settings.availableThemeIds)
          ? settings.availableThemeIds.map((value: number | string) => toThemeNumber(value))
          : [1]
      );

      setSidebarPosition((settings as Record<string, unknown>).sidebarPosition as string || "left");
      setSiteMode(
        ((settings as Record<string, unknown>).siteMode as "TEMPLATE" | "BUILDER" | undefined) ?? "TEMPLATE",
      );
      setCoachEmail(((settings as Record<string, unknown>).email as string | undefined) ?? "");

      // Kademe 2
      setLandingConfig(settings.landingConfig ?? null);
      setEliteConfig(settings.eliteConfig ?? null);
      setSocialLinks(settings.socialLinks ?? null);
      if (settings.landingFeatures) {
        setLandingFeatures(settings.landingFeatures);
      }

      // Hero image
      setHeroImageOriginalUrl(settings.heroImageOriginalUrl || "");
      setHeroImageDesktopUrl(settings.heroImageDesktopUrl || "");
      setHeroImageMobileUrl(settings.heroImageMobileUrl || "");
      setHeroImageBlurDataUrl(settings.heroImageBlurDataUrl || "");
      setHeroFocalX(settings.heroFocalX ?? 50);
      setHeroFocalY(settings.heroFocalY ?? 35);
      setHeroMode(settings.heroMode === "logo" ? "logo" : "photo");
      setHeroImageDark(settings.heroImageDark ?? null);
      setHeroVideoUrl(
        ((settings as Record<string, unknown>).heroVideoUrl as string | null) || ""
      );
      setLandingTexts(settings.landingTexts as Record<string, string> | null ?? null);
      setAboutText(settings.aboutText || "");
      setLandingFaqs(
        ((settings as Record<string, unknown>).landingFaqs as
          | { id: string; question: string; answer: string }[]
          | null) ?? null
      );
      setWhatsappNumber(settings.whatsappNumber ?? null);

      const s = settings as Record<string, unknown>;
      setContactLegal({
        contactPhone: (s.contactPhone as string | null) ?? null,
        businessAddress: (s.businessAddress as string | null) ?? null,
        legalFullName: (s.legalFullName as string | null) ?? null,
        taxId: (s.taxId as string | null) ?? null,
        legalTexts: (s.legalTexts as Record<string, string> | null) ?? null,
      });

      setPackageInfo({
        name: settings.packageName,
        maxStudents: settings.maxStudents,
        subdomain: settings.subdomain,
        planId: settings.planId || "STARTER",
      });

      setPackages(pkgData as PackageData[]);
      setLoading(false);
    }

    loadSettings();
  }, [domain]);

  const availableThemeSet = useMemo(
    () => new Set<number>(availableThemeIds),
    [availableThemeIds]
  );

  const showSuccess = (message: string) => {
    toast.success(message);
  };

  const handleSaveBranding = async () => {
    setSavingBranding(true);
    setError("");

    const result = await updateCoachSettings(domain, {
      ...branding,
    });
    if (result?.success === false) {
      setError(result.error || "Marka ayarları kaydedilemedi.");
    } else {
      showSuccess("Marka ayarları kaydedildi.");
    }

    setSavingBranding(false);
  };

  const handleSaveLandingTheme = async (themeId: number) => {
    if (savingLanding || themeId === selectedLandingThemeId || !availableThemeSet.has(themeId)) {
      return;
    }

    const previous = selectedLandingThemeId;
    setSavingLanding(true);
    setError("");
    setSelectedLandingThemeId(themeId);

    const result = await updateCoachSettings(domain, { landingThemeId: themeId });
    if (result?.success === false) {
      setSelectedLandingThemeId(previous);
      setError(result.error || "Site teması güncellenemedi.");
    } else {
      showSuccess("Site teması güncellendi.");
    }

    setSavingLanding(false);
  };

  const handleSaveDashboardTheme = async (themeId: number) => {
    if (
      savingDashboard ||
      themeId === selectedDashboardThemeId ||
      !availableThemeSet.has(themeId)
    ) {
      return;
    }

    const previous = selectedDashboardThemeId;
    setSavingDashboard(true);
    setError("");
    setSelectedDashboardThemeId(themeId);

    const result = await updateCoachSettings(domain, { dashboardThemeId: themeId });
    if (result?.success === false) {
      setSelectedDashboardThemeId(previous);
      setError(result.error || "Panel teması güncellenemedi.");
    } else {
      showSuccess("Panel teması güncellendi.");
    }

    setSavingDashboard(false);
  };

  const planIsElite = (packageInfo.planId || "").toUpperCase() === "ELITE";

  const handleSaveSiteMode = async (next: "TEMPLATE" | "BUILDER") => {
    if (savingSiteMode || next === siteMode) return;
    if (next === "BUILDER" && !planIsElite) {
      toast.error("Section Builder yalnızca Elite paketle kullanılabilir.");
      return;
    }
    setSavingSiteMode(true);
    setError("");
    const previous = siteMode;
    setSiteMode(next);

    const result = await updateCoachSettings(domain, { siteMode: next });
    if (result?.success === false) {
      setSiteMode(previous);
      setError(result.error || "Site modu güncellenemedi.");
    } else {
      showSuccess(
        next === "BUILDER"
          ? "Section Builder moduna geçildi."
          : "Hazır şablon moduna geçildi.",
      );
    }
    setSavingSiteMode(false);
  };

  const handleSaveLayout = async (position: string) => {
    if (savingLayout || position === sidebarPosition) return;
    setSavingLayout(true);
    setError("");
    const previous = sidebarPosition;
    setSidebarPosition(position);

    const result = await updateCoachSettings(domain, { sidebarPosition: position } as Record<string, unknown>);
    if (result?.success === false) {
      setSidebarPosition(previous);
      setError(result.error || "Düzen ayarı güncellenemedi.");
    } else {
      showSuccess("Panel düzeni güncellendi. Sayfayı yenileyince aktif olacak.");
    }
    setSavingLayout(false);
  };

  // Package handlers
  const startPkgEdit = (pkg: PackageData) => {
    setEditingPkgId(pkg.id);
    setPkgName(pkg.name);
    setPkgDescription(pkg.description);
    setPkgDuration(pkg.duration);
    setPkgPrice(pkg.price);
    setPkgCurrency(pkg.currency);
    setPkgFeatures(Array.isArray(pkg.features) ? (pkg.features as string[]).join("\n") : "");
    setPkgIsActive(pkg.isActive);
    setShowPkgCreate(false);
  };

  const startPkgCreate = () => {
    setEditingPkgId(null);
    setPkgName("");
    setPkgDescription("");
    setPkgDuration(4);
    setPkgPrice(0);
    setPkgCurrency("TRY");
    setPkgFeatures("");
    setPkgIsActive(true);
    setShowPkgCreate(true);
  };

  const cancelPkgEdit = () => {
    setEditingPkgId(null);
    setShowPkgCreate(false);
  };

  const handleSavePkg = async () => {
    if (!pkgName.trim()) return;
    setSavingPkg(true);

    const featureList = pkgFeatures.split("\n").map((f) => f.trim()).filter(Boolean);
    const data = {
      name: pkgName.trim(),
      description: pkgDescription.trim(),
      duration: pkgDuration,
      price: pkgPrice,
      currency: pkgCurrency,
      features: featureList,
      isActive: pkgIsActive,
    };

    if (editingPkgId) {
      await updateCoachPackage(domain, editingPkgId, data);
    } else {
      await createCoachPackage(domain, data);
    }

    setEditingPkgId(null);
    setShowPkgCreate(false);
    setSavingPkg(false);

    const refreshed = await getCoachPackages(domain);
    setPackages(refreshed as PackageData[]);
  };

  const handleDeletePkg = async (id: string) => {
    const pkg = packages.find(p => p.id === id);
    const msg = pkg && pkg._count.students > 0
      ? `"${pkg.name}" paketinde ${pkg._count.students} öğrenci var. Silmek istediğine emin misin?`
      : `"${pkg?.name || "Bu paket"}" paketini silmek istediğine emin misin?`;
    if (!confirm(msg)) return;
    const result = await deleteCoachPackage(domain, id);
    if (!result.success) {
      toast.error("error" in result ? result.error : "Hata");
    } else {
      const refreshed = await getCoachPackages(domain);
      setPackages(refreshed as PackageData[]);
    }
  };

  const lockedThemeCount = Math.max(0, LANDING_THEME_LIST.length - availableThemeSet.size);
  const isPkgEditing = showPkgCreate || editingPkgId;

  // Moda göre Sayfa İçerikleri sub-tab listesi + geçersiz seçimde fallback
  const visibleLandingSubTabs = siteMode === "BUILDER" ? LANDING_SUB_TABS_BUILDER : LANDING_SUB_TABS_TEMPLATE;
  useEffect(() => {
    if (!visibleLandingSubTabs.some((t) => t.id === landingSubTab)) {
      setLandingSubTab(visibleLandingSubTabs[0].id);
    }
  }, [siteMode, visibleLandingSubTabs, landingSubTab]);

  if (loading) {
    return (
      <div className="max-w-5xl space-y-6">
        <h1 className="text-2xl font-semibold" style={{ color: "var(--dashboard-main-text)" }}>Ayarlar</h1>
        <div className="space-y-4">
          <div className="h-44 animate-pulse rounded-lg" style={{ backgroundColor: "var(--dashboard-card-bg)" }} />
          <div className="h-96 animate-pulse rounded-lg" style={{ backgroundColor: "var(--dashboard-card-bg)" }} />
          <div className="h-96 animate-pulse rounded-lg" style={{ backgroundColor: "var(--dashboard-card-bg)" }} />
          <div className="h-64 animate-pulse rounded-lg" style={{ backgroundColor: "var(--dashboard-card-bg)" }} />
        </div>
      </div>
    );
  }

  const currentGroup = SETTINGS_GROUPS.find((g) => g.id === activeGroup) || SETTINGS_GROUPS[0];
  const showSection = (sectionId: SectionId) => currentGroup.includes.includes(sectionId);

  return (
    <div className="max-w-[1600px] flex flex-col lg:flex-row gap-6 stagger-children transition-all">
      {/* Sol: Dikey sidebar (lg+) — mobilde select kutusu */}
      <aside className="lg:w-64 lg:shrink-0">
        <h1 className="text-2xl font-semibold mb-4 animate-fade-in" style={{ color: "var(--dashboard-main-text)" }}>Ayarlar</h1>

        {/* Mobil: native select (lg altı) */}
        <div className="lg:hidden">
          <select
            value={activeGroup}
            onChange={(e) => setActiveGroup(e.target.value as SettingsGroupId)}
            className="w-full rounded-lg border px-3 py-2 text-sm font-medium"
            style={{
              borderColor: "var(--dashboard-card-border)",
              backgroundColor: "var(--dashboard-card-bg)",
              color: "var(--dashboard-main-text)",
            }}
          >
            {SETTINGS_GROUPS.map(({ id, label }) => (
              <option key={id} value={id}>{label}</option>
            ))}
          </select>
        </div>

        {/* Masaüstü: dikey nav (lg+) */}
        <nav className="hidden lg:block rounded-xl border p-1 space-y-0.5 lg:sticky lg:top-4" style={{ borderColor: "var(--dashboard-card-border)", backgroundColor: "var(--dashboard-card-bg)" }}>
          {SETTINGS_GROUPS.map(({ id, label, Icon }) => {
            const active = activeGroup === id;
            return (
              <button
                key={id}
                type="button"
                onClick={() => setActiveGroup(id)}
                className="w-full flex items-center gap-2.5 rounded-lg px-3 py-2 text-sm font-medium transition text-left"
                style={{
                  backgroundColor: active ? "var(--dashboard-accent)" : "transparent",
                  color: active ? "var(--dashboard-accent-text)" : "var(--dashboard-main-text)",
                }}
              >
                <Icon className="h-4 w-4 shrink-0" />
                <span>{label}</span>
              </button>
            );
          })}
        </nav>
      </aside>

      {/* Sağ: Ana içerik */}
      <div className="flex-1 min-w-0 space-y-6">
        {/* Grup başlığı */}
        <div className="animate-fade-in">
          <h2 className="text-xl font-semibold" style={{ color: "var(--dashboard-main-text)" }}>
            {currentGroup.label}
          </h2>
          <p className="text-sm mt-1" style={{ color: "var(--dashboard-main-text-muted)" }}>
            {currentGroup.description}
          </p>
        </div>

      {success && (
        <div className="rounded-md border border-green-500/30 bg-green-500/10 p-3 text-sm text-green-300">
          {success}
        </div>
      )}

      {error && (
        <div className="rounded-md border border-red-500/30 bg-red-500/10 p-3 text-sm text-red-300">
          {error}
        </div>
      )}

      {/* Sayfa İçerikleri grubu — sub-tab'lar siteMode'a göre filtreli */}
      {showSection("sayfa-icerikleri") && (
        <div className="space-y-4">
          {/* Mod uyarısı */}
          <div className="rounded-lg border px-3 py-2 text-xs" style={{ borderColor: "var(--dashboard-card-border)", backgroundColor: "var(--dashboard-main-bg)", color: "var(--dashboard-main-text-muted)" }}>
            {siteMode === "BUILDER"
              ? "Section Builder modundasın — bölümler ve içindeki metinler Bölümler sekmesinden düzenlenir. Hazır şablonlar için Metinler sekmesi bu modda gizli."
              : "Hazır şablon modundasın — metin değişikliklerini Metinler sekmesinden yap. Section Builder bu modda gizli; etkinleştirmek için Site & Tasarım → Site Modu üzerinden geç."}
          </div>

          {/* Landing Sub-Tabs */}
          <div className="flex gap-1 overflow-x-auto rounded-lg border p-1" style={{ borderColor: "var(--dashboard-card-border)", backgroundColor: "color-mix(in srgb, var(--dashboard-card-bg) 60%, var(--dashboard-main-bg))" }}>
            {visibleLandingSubTabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setLandingSubTab(tab.id)}
                title={tab.hint}
                className="whitespace-nowrap rounded-md px-4 py-1.5 text-xs font-medium transition"
                style={{
                  backgroundColor: landingSubTab === tab.id
                    ? "color-mix(in srgb, var(--dashboard-accent) 20%, transparent)"
                    : "transparent",
                  color: landingSubTab === tab.id
                    ? "var(--dashboard-accent)"
                    : "var(--dashboard-main-text-muted)",
                  border: landingSubTab === tab.id
                    ? "1px solid color-mix(in srgb, var(--dashboard-accent) 40%, transparent)"
                    : "1px solid transparent",
                }}
              >
                {tab.label}
              </button>
            ))}
          </div>

          <div
            className={`grid grid-cols-1 gap-6 ${
              (landingSubTab === "gorsel" || landingSubTab === "metinler" || landingSubTab === "bolumler")
                ? "xl:grid-cols-[1fr_480px]"
                : ""
            }`}
          >
            {/* Left: Settings */}
            <div className="space-y-6">
              {landingSubTab === "gorsel" && (
                <>
                  <HeroImageSettings
                    key={heroImageDesktopUrl || "no-hero"}
                    domain={domain}
                    initialHeroImageOriginalUrl={heroImageOriginalUrl}
                    initialHeroImageDesktopUrl={heroImageDesktopUrl}
                    initialHeroImageMobileUrl={heroImageMobileUrl}
                    initialHeroImageBlurDataUrl={heroImageBlurDataUrl}
                    initialHeroFocalX={heroFocalX}
                    initialHeroFocalY={heroFocalY}
                    initialHeroMode={heroMode}
                    initialHeroImageDark={heroImageDark}
                  />
                  <HeroVideoSettings
                    key={`video-${heroVideoUrl || "none"}`}
                    domain={domain}
                    initialHeroVideoUrl={heroVideoUrl}
                  />
                </>
              )}
              {landingSubTab === "metinler" && (
                <>
                  <LandingTextsSettings
                    key={`texts-${selectedLandingThemeId}`}
                    domain={domain}
                    initialLandingTexts={landingTexts}
                    selectedThemeId={selectedLandingThemeId}
                    onSaved={(saved) => setLandingTexts(saved)}
                  />
                  <AboutTextSettings
                    domain={domain}
                    initialAboutText={aboutText}
                    onSaved={(text) => setAboutText(text)}
                  />
                  {/* S.S.S. ayrı bir sidebar grubunda — duplikat olmasın diye burada gösterilmiyor */}
                </>
              )}
              {/* Bölümler sub-tab yalnız BUILDER modunda görünür — Section Builder düzenleyicisi.
                  TEMPLATE modunda navbar varyantı + bölüm sırası "Site & Tasarım → Düzen & Bölümler" altında. */}
              {landingSubTab === "bolumler" && siteMode === "BUILDER" && (
                <LandingBuilder
                  domain={domain}
                  initialConfig={(eliteConfig as import("@/src/components/landing/elite-config").EliteLandingConfig | null) ?? null}
                />
              )}

              {/* S.S.S. — kendi sub-tab'ında */}
              {landingSubTab === "sss" && (
                <FaqSettings domain={domain} initialFaqs={landingFaqs} />
              )}

              {/* Dönüşümler — kendi sub-tab'ında, yönetimi ayrı sayfada */}
              {landingSubTab === "donusumler" && (
                <Card style={{ backgroundColor: "var(--dashboard-card-bg)", borderColor: "var(--dashboard-card-border)", color: "var(--dashboard-main-text)" }}>
                  <CardHeader>
                    <CardTitle className="text-lg">Dönüşümler</CardTitle>
                    <p className="text-sm" style={{ color: "var(--dashboard-main-text-muted)" }}>
                      Müşteri dönüşüm hikayelerinizi ayrı bir sayfada düzenleyin.
                    </p>
                  </CardHeader>
                  <CardContent>
                    <Button
                      type="button"
                      onClick={() => router.push(`/site/${domain}/dashboard/transformations`)}
                      style={{ backgroundColor: "var(--dashboard-accent)", color: "var(--dashboard-accent-text)" }}
                    >
                      Dönüşümleri Yönet
                    </Button>
                  </CardContent>
                </Card>
              )}

              {/* Yorumlar — kendi sub-tab'ında, yönetimi ayrı sayfada */}
              {landingSubTab === "yorumlar" && (
                <Card style={{ backgroundColor: "var(--dashboard-card-bg)", borderColor: "var(--dashboard-card-border)", color: "var(--dashboard-main-text)" }}>
                  <CardHeader>
                    <CardTitle className="text-lg">Yorumlar</CardTitle>
                    <p className="text-sm" style={{ color: "var(--dashboard-main-text-muted)" }}>
                      Danışan testimonialarınızı düzenleyin.
                    </p>
                  </CardHeader>
                  <CardContent>
                    <Button
                      type="button"
                      onClick={() => router.push(`/site/${domain}/dashboard/testimonials`)}
                      style={{ backgroundColor: "var(--dashboard-accent)", color: "var(--dashboard-accent-text)" }}
                    >
                      Yorumları Yönet
                    </Button>
                  </CardContent>
                </Card>
              )}
            </div>
            {/* Right: Live Preview — yalnız sayfa içeriği değişen sekmelerde göster */}
            {(landingSubTab === "gorsel" || landingSubTab === "metinler" || landingSubTab === "bolumler") && (
              <div className="hidden xl:block sticky top-2 self-start h-[calc(100vh-1rem)]">
                <LandingPreviewPanel domain={domain} />
              </div>
            )}
          </div>
        </div>
      )}

      {/* İletişim & Sosyal grubu — WhatsApp + sosyal medya linkleri.
          "İletişim & Resmi Bilgiler" (telefon/vergi no/adres) kartı kullanıcı
          isteğiyle kaldırıldı — koçların iletişimi WhatsApp + sosyal üzerinden
          yürür. Ödeme/fatura entegrasyonu kurulurken geri eklenebilir. */}
      {showSection("iletisim-sosyal") && (
        <SocialLinksSettings
          domain={domain}
          initialSocialLinks={socialLinks}
          initialWhatsappNumber={whatsappNumber}
          maxLinks={landingFeatures.maxSocialLinks}
        />
      )}

      {/* Yasal Sayfalar grubu — yalnız legal bölümü (6 sayfa CRUD) */}
      {showSection("yasal") && (
        <ContactLegalSettings
          domain={domain}
          initial={contactLegal}
          section="legal"
        />
      )}

      {/* Hesap grubu */}
      {showSection("hesap") && (
        <Card style={{ backgroundColor: "var(--dashboard-card-bg)", borderColor: "var(--dashboard-card-border)", color: "var(--dashboard-main-text)" }}>
          <CardHeader>
            <CardTitle className="text-lg">Hesap Bilgileri</CardTitle>
          </CardHeader>
          <CardContent className="space-y-5 text-sm">
            <div>
              <p className="text-xs mb-1" style={{ color: "var(--dashboard-main-text-muted)" }}>E-posta</p>
              <p className="font-mono">{coachEmail || "—"}</p>
              <p className="text-xs mt-1" style={{ color: "var(--dashboard-main-text-muted)" }}>
                E-postanı değiştirmek için destek ile iletişime geç.
              </p>
            </div>

            <div className="pt-4 border-t" style={{ borderColor: "var(--dashboard-card-border)" }}>
              <p className="text-xs mb-2" style={{ color: "var(--dashboard-main-text-muted)" }}>Şifre</p>
              <Button
                type="button"
                variant="outline"
                onClick={() => router.push(`/site/${domain}/auth?reset=1`)}
                style={{ borderColor: "var(--dashboard-card-border)", color: "var(--dashboard-main-text)", backgroundColor: "transparent" }}
              >
                Şifre Sıfırlama Sayfası
              </Button>
              <p className="text-xs mt-2" style={{ color: "var(--dashboard-main-text-muted)" }}>
                Giriş sayfasında "Şifremi Unuttum" akışını başlatır.
              </p>
            </div>

            <div className="pt-4 border-t" style={{ borderColor: "var(--dashboard-card-border)" }}>
              <p className="text-xs mb-2" style={{ color: "var(--dashboard-main-text-muted)" }}>Oturum</p>
              <Button
                type="button"
                onClick={() => logoutAction(domain)}
                style={{ backgroundColor: "#dc2626", color: "#ffffff" }}
                className="font-semibold hover:opacity-90"
              >
                Çıkış Yap
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Alan Adı grubu — Plan Bilgisi + subdomain bilgi kartı */}
      {showSection("alan-adi") && (
        <>
          {/* Plan */}
          <Card style={{ backgroundColor: "var(--dashboard-card-bg)", borderColor: "var(--dashboard-card-border)", color: "var(--dashboard-main-text)" }}>
            <CardHeader>
              <CardTitle className="text-lg">Plan Bilgisi</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span style={{ color: "var(--dashboard-main-text-muted)" }}>Paket</span>
                <span className="font-semibold">{packageInfo.name}</span>
              </div>
              <div className="flex justify-between">
                <span style={{ color: "var(--dashboard-main-text-muted)" }}>Plan</span>
                <span className="font-semibold">{packageInfo.planId}</span>
              </div>
              <div className="flex justify-between">
                <span style={{ color: "var(--dashboard-main-text-muted)" }}>Ogrenci Limiti</span>
                <span>
                  {packageInfo.maxStudents === 999 ? "Sinirsiz" : packageInfo.maxStudents}
                </span>
              </div>
              <div className="flex justify-between">
                <span style={{ color: "var(--dashboard-main-text-muted)" }}>Alt alan adi</span>
                <span className="font-mono text-sm">
                  {packageInfo.subdomain}.coachsite.com
                </span>
              </div>
              <div className="flex gap-2 mt-3 pt-3" style={{ borderTop: "1px solid var(--dashboard-card-border)" }}>
                <Button
                  onClick={() => {
                    const url = `${window.location.origin}/site/${domain}`;
                    navigator.clipboard.writeText(url);
                    toast.success("Site linki kopyalandi!");
                  }}
                  size="sm"
                  className="text-xs border rounded-md"
                  style={{ backgroundColor: "transparent", borderColor: "var(--dashboard-card-border)", color: "var(--dashboard-main-text)" }}
                >
                  <Copy className="h-3 w-3 mr-1" />
                  Linki Kopyala
                </Button>
                <Button
                  onClick={() => window.open(`/site/${domain}`, "_blank")}
                  size="sm"
                  className="text-xs border rounded-md"
                  style={{ backgroundColor: "transparent", borderColor: "var(--dashboard-card-border)", color: "var(--dashboard-main-text)" }}
                >
                  <ExternalLink className="h-3 w-3 mr-1" />
                  Landing Page&apos;i Gor
                </Button>
              </div>
            </CardContent>
          </Card>
        </>
      )}

      {/* Paketler grubu */}
      {showSection("paketler") && (
        <>
          {/* Kocluk Paketleri */}
          <Card style={{ backgroundColor: "var(--dashboard-card-bg)", borderColor: "var(--dashboard-card-border)", color: "var(--dashboard-main-text)" }}>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-lg">Kocluk Paketleri</CardTitle>
                  <p className="text-sm mt-1" style={{ color: "var(--dashboard-main-text-muted)" }}>
                    Landing page&apos;inizde gorunen paketleriniz
                  </p>
                </div>
                {!isPkgEditing && (
                  <Button
                    onClick={startPkgCreate}
                    size="sm"
                    style={{
                      backgroundColor: "var(--dashboard-accent)",
                      color: "var(--dashboard-accent-text)",
                    }}
                    className="font-semibold hover:opacity-90"
                  >
                    <Plus className="h-4 w-4 mr-1" />
                    Yeni Paket
                  </Button>
                )}
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {isPkgEditing && (
                <div className="rounded-lg border p-4 space-y-3" style={{ borderColor: "var(--dashboard-card-border)", backgroundColor: "var(--dashboard-main-bg)" }}>
                  <h3 className="font-semibold text-sm">
                    {editingPkgId ? "Paketi Duzenle" : "Yeni Paket Olustur"}
                  </h3>
                  <Input
                    value={pkgName}
                    onChange={(e) => setPkgName(e.target.value)}
                    placeholder="Paket adi (orn: Premium Kocluk)"
                    style={{ backgroundColor: "var(--dashboard-main-bg)", borderColor: "var(--dashboard-card-border)", color: "var(--dashboard-main-text)" }}
                  />
                  <textarea
                    value={pkgDescription}
                    onChange={(e) => setPkgDescription(e.target.value)}
                    placeholder="Paket aciklamasi"
                    rows={2}
                    className="w-full rounded-md px-3 py-2 text-sm"
                    style={{ backgroundColor: "var(--dashboard-main-bg)", border: "1px solid var(--dashboard-card-border)", color: "var(--dashboard-main-text)" }}
                  />
                  <div className="grid grid-cols-3 gap-3">
                    <div>
                      <label className="text-xs" style={{ color: "var(--dashboard-main-text-muted)" }}>Fiyat</label>
                      <Input
                        type="number"
                        value={pkgPrice}
                        onChange={(e) => setPkgPrice(Number(e.target.value))}
                        style={{ backgroundColor: "var(--dashboard-main-bg)", borderColor: "var(--dashboard-card-border)", color: "var(--dashboard-main-text)" }}
                        min={0}
                      />
                    </div>
                    <div>
                      <label className="text-xs" style={{ color: "var(--dashboard-main-text-muted)" }}>Para Birimi</label>
                      <select
                        value={pkgCurrency}
                        onChange={(e) => setPkgCurrency(e.target.value)}
                        className="w-full rounded-md px-3 py-2 text-sm"
                        style={{ backgroundColor: "var(--dashboard-main-bg)", border: "1px solid var(--dashboard-card-border)", color: "var(--dashboard-main-text)" }}
                      >
                        <option value="TRY">TRY</option>
                        <option value="USD">USD</option>
                        <option value="EUR">EUR</option>
                      </select>
                    </div>
                    <div>
                      <label className="text-xs" style={{ color: "var(--dashboard-main-text-muted)" }}>Sure (hafta)</label>
                      <Input
                        type="number"
                        value={pkgDuration}
                        onChange={(e) => setPkgDuration(Number(e.target.value))}
                        style={{ backgroundColor: "var(--dashboard-main-bg)", borderColor: "var(--dashboard-card-border)", color: "var(--dashboard-main-text)" }}
                        min={1}
                      />
                    </div>
                  </div>
                  <div>
                    <label className="text-xs" style={{ color: "var(--dashboard-main-text-muted)" }}>
                      Paket Icerikleri (her satir bir madde)
                    </label>
                    <textarea
                      value={pkgFeatures}
                      onChange={(e) => setPkgFeatures(e.target.value)}
                      placeholder={"Kisiye ozel antrenman programi\nHaftalik beslenme plani\n7/24 mesaj destegi"}
                      rows={4}
                      className="w-full rounded-md px-3 py-2 text-sm"
                      style={{ backgroundColor: "var(--dashboard-main-bg)", border: "1px solid var(--dashboard-card-border)", color: "var(--dashboard-main-text)" }}
                    />
                  </div>
                  {editingPkgId && (
                    <label className="flex items-center gap-2 text-sm">
                      <input
                        type="checkbox"
                        checked={pkgIsActive}
                        onChange={(e) => setPkgIsActive(e.target.checked)}
                        className="rounded"
                      />
                      <span style={{ color: "var(--dashboard-main-text-muted)" }}>Aktif (landing page&apos;de gorunsun)</span>
                    </label>
                  )}
                  <div className="flex gap-2">
                    <Button
                      onClick={handleSavePkg}
                      disabled={savingPkg || !pkgName.trim()}
                      style={{
                        backgroundColor: "var(--dashboard-accent)",
                        color: "var(--dashboard-accent-text)",
                      }}
                      className="font-semibold hover:opacity-90"
                    >
                      {savingPkg ? "..." : editingPkgId ? "Guncelle" : "Olustur"}
                    </Button>
                    <Button
                      onClick={cancelPkgEdit}
                      variant="outline"
                      style={{ borderColor: "var(--dashboard-card-border)", color: "var(--dashboard-main-text)", backgroundColor: "transparent" }}
                    >
                      Iptal
                    </Button>
                  </div>
                </div>
              )}

              {packages.length === 0 && !showPkgCreate ? (
                <div className="rounded-lg border border-dashed py-10 text-center" style={{ borderColor: "var(--dashboard-card-border)" }}>
                  <p className="mb-1" style={{ color: "var(--dashboard-main-text-muted)" }}>Henuz paket yok</p>
                  <p className="text-sm" style={{ color: "var(--dashboard-main-text-muted)", opacity: 0.7 }}>
                    Ogrencileriniz icin kocluk paketleri olusturun
                  </p>
                </div>
              ) : (
                <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                  {packages.map((pkg) => (
                    <div
                      key={pkg.id}
                      className="rounded-xl border p-4 transition"
                      style={{
                        borderColor: "var(--dashboard-card-border)",
                        backgroundColor: "var(--dashboard-card-bg)",
                        opacity: pkg.isActive ? 1 : 0.6,
                      }}
                    >
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <h3 className="font-semibold text-sm">{pkg.name}</h3>
                          {!pkg.isActive && (
                            <span className="text-[10px] px-2 py-0.5 rounded" style={{ backgroundColor: "var(--dashboard-main-bg)", color: "var(--dashboard-main-text-muted)" }}>
                              Pasif
                            </span>
                          )}
                        </div>
                        <div className="flex gap-1">
                          <button
                            onClick={() => startPkgEdit(pkg)}
                            className="p-1 rounded transition"
                            style={{ color: "var(--dashboard-main-text-muted)" }}
                          >
                            <Pencil className="h-3.5 w-3.5" />
                          </button>
                          <button
                            onClick={() => handleDeletePkg(pkg.id)}
                            className="text-red-400/50 hover:text-red-400 p-1 rounded hover:bg-red-400/10"
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </button>
                        </div>
                      </div>
                      <p
                        className="text-xl font-bold mb-1"
                        style={{ color: "var(--dashboard-accent)" }}
                      >
                        {pkg.price.toLocaleString("tr-TR")} {pkg.currency}
                      </p>
                      <p className="text-xs mb-2" style={{ color: "var(--dashboard-main-text-muted)" }}>{pkg.duration} hafta</p>
                      {pkg.description && (
                        <p className="text-xs mb-2 line-clamp-2" style={{ color: "var(--dashboard-main-text-muted)" }}>{pkg.description}</p>
                      )}
                      {Array.isArray(pkg.features) && (pkg.features as string[]).length > 0 && (
                        <ul className="space-y-0.5 mb-2">
                          {(pkg.features as string[]).slice(0, 3).map((f, i) => (
                            <li key={i} className="text-[11px] flex items-start gap-1" style={{ color: "var(--dashboard-main-text-muted)" }}>
                              <span style={{ color: "var(--dashboard-accent)" }}>✓</span> {f}
                            </li>
                          ))}
                          {(pkg.features as string[]).length > 3 && (
                            <li className="text-[11px]" style={{ color: "var(--dashboard-main-text-muted)", opacity: 0.6 }}>
                              +{(pkg.features as string[]).length - 3} daha
                            </li>
                          )}
                        </ul>
                      )}
                      <p className="text-[11px]" style={{ color: "var(--dashboard-main-text-muted)", opacity: 0.6 }}>{pkg._count.students} ogrenci</p>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

        </>
      )}

      {/* Marka Kimliği grubu */}
      {showSection("marka-kimligi") && (
        <AccordionCard id="marka-ayarlari" title="Marka Ayarları" description="Markanın adı ve gösterilen kimlik bilgileri">
          <div className="space-y-4">
            <div>
              <label className="mb-1 block text-sm" style={{ color: "var(--dashboard-main-text-muted)" }}>Marka adi</label>
              <Input
                value={branding.brandName}
                onChange={(event) =>
                  setBranding((previous) => ({ ...previous, brandName: event.target.value }))
                }
                style={{ borderColor: "var(--dashboard-card-border)", backgroundColor: "var(--dashboard-main-bg)", color: "var(--dashboard-main-text)" }}
              />
            </div>

            <Button
              onClick={handleSaveBranding}
              disabled={savingBranding}
              style={{
                backgroundColor: "var(--dashboard-accent)",
                color: "var(--dashboard-accent-text)",
              }}
              className="font-semibold hover:opacity-90"
            >
              {savingBranding ? "Kaydediliyor..." : "Kaydet"}
            </Button>
          </div>
        </AccordionCard>
      )}

      {/* Site & Tasarım grubu (Site Modu + tema + dashboard tema + düzen) */}
      {showSection("site-tasarim") && (
        <>
          {/* Site Modu — Aşama 2: TEMPLATE vs BUILDER ayrımı */}
          <AccordionCard id="site-modu" title="Site Modu" description="Sitenizi nasıl kurmak istersiniz? Mod değiştirildiğinde yalnızca seçili modun ayar arayüzü gösterilir.">
            <div>
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                {/* TEMPLATE */}
                <button
                  type="button"
                  onClick={() => handleSaveSiteMode("TEMPLATE")}
                  disabled={savingSiteMode}
                  className="text-left rounded-xl border p-5 transition"
                  style={{
                    borderColor: siteMode === "TEMPLATE" ? "var(--dashboard-accent)" : "var(--dashboard-card-border)",
                    backgroundColor: siteMode === "TEMPLATE"
                      ? "color-mix(in srgb, var(--dashboard-accent) 8%, var(--dashboard-card-bg))"
                      : "var(--dashboard-main-bg)",
                  }}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <h3 className="font-semibold mb-1">Hazır Şablon</h3>
                      <p className="text-xs" style={{ color: "var(--dashboard-main-text-muted)" }}>
                        6 hazır tasarımdan birini seçin, metinleri ve fotoğrafları kendinize göre düzenleyin. Tüm paketlerde kullanılabilir.
                      </p>
                    </div>
                    {siteMode === "TEMPLATE" && (
                      <Check className="h-5 w-5 flex-shrink-0" style={{ color: "var(--dashboard-accent)" }} />
                    )}
                  </div>
                </button>

                {/* BUILDER */}
                <button
                  type="button"
                  onClick={() => handleSaveSiteMode("BUILDER")}
                  disabled={savingSiteMode || !planIsElite}
                  className="text-left rounded-xl border p-5 transition relative"
                  style={{
                    borderColor: siteMode === "BUILDER" ? "var(--dashboard-accent)" : "var(--dashboard-card-border)",
                    backgroundColor: siteMode === "BUILDER"
                      ? "color-mix(in srgb, var(--dashboard-accent) 8%, var(--dashboard-card-bg))"
                      : "var(--dashboard-main-bg)",
                    opacity: planIsElite ? 1 : 0.7,
                  }}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <h3 className="font-semibold mb-1 flex items-center gap-2">
                        Section Builder
                        {!planIsElite && (
                          <span className="inline-flex items-center gap-1 text-[10px] px-2 py-0.5 rounded-full" style={{ backgroundColor: "var(--dashboard-main-bg)", border: "1px solid var(--dashboard-card-border)", color: "var(--dashboard-main-text-muted)" }}>
                            <Lock className="h-2.5 w-2.5" /> Elite
                          </span>
                        )}
                      </h3>
                      <p className="text-xs" style={{ color: "var(--dashboard-main-text-muted)" }}>
                        Sayfayı sıfırdan inşa edin: her bölüm için onlarca tasarımdan seçim, sürükle-bırak sıralama. Yalnız Elite paketinde.
                      </p>
                    </div>
                    {siteMode === "BUILDER" && (
                      <Check className="h-5 w-5 flex-shrink-0" style={{ color: "var(--dashboard-accent)" }} />
                    )}
                  </div>
                </button>
              </div>
              {!planIsElite && (
                <div className="mt-4 rounded-lg border p-3 text-xs" style={{ borderColor: "var(--dashboard-card-border)", backgroundColor: "var(--dashboard-main-bg)", color: "var(--dashboard-main-text-muted)" }}>
                  Section Builder Elite paketle birlikte gelir. Yükseltmek için <button type="button" className="underline" onClick={() => {
                    const appDomain = process.env.NEXT_PUBLIC_APP_DOMAIN;
                    const target = appDomain
                      ? `${window.location.protocol}//${appDomain}/pricing`
                      : "/platform/pricing";
                    window.open(target, "_blank");
                  }}>plan sayfasına bakın</button>.
                </div>
              )}
            </div>
          </AccordionCard>

          {siteMode === "BUILDER" ? (
            /* BUILDER aktifken Site Temasi gizlenir; bölüm düzenleme Landing > Bölümler'de */
            <AccordionCard id="builder-aktif" title="Section Builder Aktif" description="Site bölümlerini düzenlemek için Site İçeriği → Bölümler sekmesini kullanın.">
              <div className="text-sm space-y-3" style={{ color: "var(--dashboard-main-text-muted)" }}>
                <p>
                  Site bölümlerinizi düzenlemek için <strong style={{ color: "var(--dashboard-main-text)" }}>Site İçeriği → Bölümler</strong> sekmesini kullanın.
                </p>
                <Button
                  type="button"
                  onClick={() => {
                    setActiveGroup("site-icerigi");
                    setLandingSubTab("bolumler");
                  }}
                  style={{ backgroundColor: "var(--dashboard-accent)", color: "var(--dashboard-accent-text)" }}
                >
                  Bölümleri Düzenle
                </Button>
              </div>
            </AccordionCard>
          ) : (
          /* Landing Theme — yalnız TEMPLATE modunda */
          <AccordionCard id="site-temasi" title="Site Teması (Şablon Galerisi)" description="Hazır şablon galerisinden birini seçin. Tema değişiklikleri planınıza göre kontrol edilir.">
            <div>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {LANDING_THEME_LIST.filter((t) => t.id !== "theme-elite").map((theme) => {
                  const themeId = theme.id === "theme-elite" ? 7 : Number(theme.id.replace("theme-", ""));
                  const isAvailable = availableThemeSet.has(themeId);
                  const isSelected = selectedLandingThemeId === themeId;

                  return (
                    <button
                      type="button"
                      key={theme.id}
                      onClick={() => handleSaveLandingTheme(themeId)}
                      disabled={!isAvailable || savingLanding}
                      className="group relative overflow-hidden rounded-xl border text-left transition"
                      style={{
                        borderColor: isSelected ? "var(--dashboard-accent)" : "var(--dashboard-card-border)",
                        opacity: isAvailable ? 1 : 0.68,
                      }}
                    >
                      <div className="relative">
                        <LandingThemePreview themeId={theme.id} />
                        {!isAvailable && (
                          <div className="absolute inset-0 flex items-center justify-center rounded-lg bg-black/55">
                            <div className="inline-flex items-center gap-2 rounded-full border border-white/30 bg-black/45 px-3 py-1 text-xs font-semibold text-white">
                              <Lock className="h-3.5 w-3.5" />
                              Kilitli
                            </div>
                          </div>
                        )}
                        {isSelected && (
                          <div
                            className="absolute right-2 top-2 flex h-7 w-7 items-center justify-center rounded-full"
                            style={{ backgroundColor: "var(--dashboard-accent)" }}
                          >
                            <Check
                              className="h-4 w-4"
                              style={{ color: "var(--dashboard-accent-text)" }}
                            />
                          </div>
                        )}
                      </div>
                      <div className="space-y-1 p-3">
                        <p className="text-sm font-semibold">{theme.name}</p>
                        <p className="text-xs" style={{ color: "var(--dashboard-main-text-muted)" }}>{theme.description}</p>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          </AccordionCard>
          )}

          {/* Düzen & Bölümler — yalnız TEMPLATE modunda. Navbar varyantı + bölüm sırası/açma-kapama. */}
          {siteMode === "TEMPLATE" && (
            <AccordionCard id="duzen-bolumler" title="Düzen & Bölümler" description="Şablonun navbar varyantı, bölüm sırası ve görünürlüğü. (Section Builder ayrı bir mod — buradaki düzen yalnız hazır şablonlar için geçerli.)">
              <div>
                <LandingPageSettings
                  key={`sections-${selectedLandingThemeId}`}
                  domain={domain}
                  initialLandingConfig={landingConfig}
                  features={landingFeatures}
                  themeId={`theme-${selectedLandingThemeId}`}
                  onSaved={(saved) => {
                    if (saved.landingConfig !== undefined) setLandingConfig(saved.landingConfig);
                  }}
                />
              </div>
            </AccordionCard>
          )}

          {/* Dashboard Theme */}
          <AccordionCard id="panel-temasi" title="Panel Teması" description="Yönetim paneli için renk teması seçin.">
            <div>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {DASHBOARD_THEME_LIST.map((theme) => {
                  const isAvailable = availableThemeSet.has(theme.id);
                  const isSelected = selectedDashboardThemeId === theme.id;

                  return (
                    <button
                      type="button"
                      key={theme.id}
                      onClick={() => handleSaveDashboardTheme(theme.id)}
                      disabled={!isAvailable || savingDashboard}
                      className="group relative overflow-hidden rounded-xl border text-left transition"
                      style={{
                        borderColor: isSelected ? "var(--dashboard-accent)" : "var(--dashboard-card-border)",
                        opacity: isAvailable ? 1 : 0.68,
                      }}
                    >
                      <div className="relative">
                        <DashboardThemePreview theme={theme} />
                        {!isAvailable && (
                          <div className="absolute inset-0 flex items-center justify-center rounded-lg bg-black/55">
                            <div className="inline-flex items-center gap-2 rounded-full border border-white/30 bg-black/45 px-3 py-1 text-xs font-semibold text-white">
                              <Lock className="h-3.5 w-3.5" />
                              Kilitli
                            </div>
                          </div>
                        )}
                        {isSelected && (
                          <div
                            className="absolute right-2 top-2 flex h-7 w-7 items-center justify-center rounded-full"
                            style={{ backgroundColor: "var(--dashboard-accent)" }}
                          >
                            <Check
                              className="h-4 w-4"
                              style={{ color: "var(--dashboard-accent-text)" }}
                            />
                          </div>
                        )}
                      </div>
                      <div className="space-y-1 p-3">
                        <p className="text-sm font-semibold">{theme.name}</p>
                        <p className="text-xs" style={{ color: "var(--dashboard-main-text-muted)" }}>{theme.name}</p>
                      </div>
                    </button>
                  );
                })}
              </div>

              {lockedThemeCount > 0 && (
                <div className="mt-4 rounded-lg border p-3 text-sm" style={{ borderColor: "var(--dashboard-card-border)", backgroundColor: "var(--dashboard-main-bg)", color: "var(--dashboard-main-text-muted)" }}>
                  {lockedThemeCount} tema mevcut planinizda kilitli.
                  <div className="mt-2">
                    <Button
                      type="button"
                      variant="outline"
                      style={{ borderColor: "var(--dashboard-card-border)", color: "var(--dashboard-main-text)", backgroundColor: "transparent" }}
                      onClick={() => {
                        const appDomain = process.env.NEXT_PUBLIC_APP_DOMAIN;
                        const target = appDomain
                          ? `${window.location.protocol}//${appDomain}/pricing`
                          : "/platform/pricing";
                        window.open(target, "_blank");
                      }}
                    >
                      Plani Yukselt
                    </Button>
                  </div>
                </div>
              )}
            </div>
          </AccordionCard>

          {/* Panel Duzeni */}
          <AccordionCard id="panel-duzeni" title="Panel Düzeni" description="Navigasyon menüsünün konumunu seçin.">
            <div>
              <div className="grid grid-cols-3 gap-3">
                {SIDEBAR_POSITIONS.map((pos) => {
                  const isSelected = sidebarPosition === pos.value;
                  return (
                    <button
                      key={pos.value}
                      type="button"
                      onClick={() => handleSaveLayout(pos.value)}
                      disabled={savingLayout}
                      className="rounded-xl border p-4 text-center transition hover:opacity-90"
                      style={{
                        borderColor: isSelected ? "var(--dashboard-accent)" : "var(--dashboard-card-border)",
                        backgroundColor: isSelected ? "color-mix(in srgb, var(--dashboard-accent) 10%, var(--dashboard-card-bg))" : "var(--dashboard-main-bg)",
                      }}
                    >
                      <div className="w-full aspect-[4/3] rounded-lg border mb-2 relative overflow-hidden" style={{ borderColor: "var(--dashboard-card-border)", backgroundColor: "var(--dashboard-card-bg)" }}>
                        {pos.value === "left" && (
                          <>
                            <div className="absolute left-0 top-0 bottom-0 w-1/4 rounded-l-lg" style={{ backgroundColor: "var(--dashboard-sidebar-bg)" }} />
                            <div className="absolute left-1/4 top-0 right-0 h-[15%]" style={{ backgroundColor: "var(--dashboard-header-bg)" }} />
                          </>
                        )}
                        {pos.value === "bottom" && (
                          <>
                            <div className="absolute top-0 left-0 right-0 h-[15%]" style={{ backgroundColor: "var(--dashboard-header-bg)" }} />
                            <div className="absolute bottom-0 left-0 right-0 h-[18%] rounded-b-lg" style={{ backgroundColor: "var(--dashboard-sidebar-bg)" }} />
                          </>
                        )}
                        {pos.value === "right" && (
                          <>
                            <div className="absolute right-0 top-0 bottom-0 w-1/4 rounded-r-lg" style={{ backgroundColor: "var(--dashboard-sidebar-bg)" }} />
                            <div className="absolute left-0 top-0 right-1/4 h-[15%]" style={{ backgroundColor: "var(--dashboard-header-bg)" }} />
                          </>
                        )}
                      </div>
                      <p className="text-sm font-medium">{pos.label}</p>
                      {isSelected && (
                        <div className="flex justify-center mt-1">
                          <Check className="h-4 w-4" style={{ color: "var(--dashboard-accent)" }} />
                        </div>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          </AccordionCard>
        </>
      )}
      </div>
    </div>
  );
}
