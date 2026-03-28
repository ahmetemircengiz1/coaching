"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Check, Lock, Plus, Trash2, Pencil, Copy, ExternalLink } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  getCoachSettings,
  updateCoachSettings,
  updatePaymentSettings,
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
import { LandingPreviewPanel } from "./LandingPreviewPanel";
import type { LandingFeatures } from "@/src/lib/plan";

type SettingsTab = "genel" | "temalar" | "landing" | "sosyal" | "odeme";

const TABS: { id: SettingsTab; label: string }[] = [
  { id: "genel", label: "Genel" },
  { id: "temalar", label: "Temalar" },
  { id: "landing", label: "Landing Sayfa" },
  { id: "sosyal", label: "Sosyal Medya" },
  { id: "odeme", label: "Odeme" },
];

function toThemeNumber(value: unknown): number {
  if (typeof value === "number" && value >= 1 && value <= 6) {
    return value;
  }

  if (typeof value === "string") {
    if (value.startsWith("theme-")) {
      const parsedTheme = Number(value.replace("theme-", ""));
      if (!Number.isNaN(parsedTheme) && parsedTheme >= 1 && parsedTheme <= 6) {
        return parsedTheme;
      }
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

export default function SettingsPage() {
  const params = useParams();
  const router = useRouter();
  const domain = params.domain as string;

  const [activeTab, setActiveTab] = useState<SettingsTab>("genel");
  const [loading, setLoading] = useState(true);
  const [savingBranding, setSavingBranding] = useState(false);
  const [savingLanding, setSavingLanding] = useState(false);
  const [savingDashboard, setSavingDashboard] = useState(false);
  const [savingPayment, setSavingPayment] = useState(false);
  const [savingLayout, setSavingLayout] = useState(false);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");

  const [branding, setBranding] = useState({
    brandName: "",
    bio: "",
    primaryColor: "#000000",
    secondaryColor: "#ccff00",
  });
  const [payment, setPayment] = useState({
    provider: "iyzico",
    iyzicoApiKey: "",
    iyzicoSecretKey: "",
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

  // Kademe 2 state
  const [landingConfig, setLandingConfig] = useState<unknown>(null);
  const [socialLinks, setSocialLinks] = useState<unknown>(null);
  const [headingFont, setHeadingFont] = useState<string | null>(null);
  const [bodyFont, setBodyFont] = useState<string | null>(null);
  const [landingFeatures, setLandingFeatures] = useState<LandingFeatures>({
    canReorderSections: false,
    canToggleSections: false,
    maxVariant: 1,
    canSelectFonts: false,
    maxSocialLinks: 3,
    canEnableFAQ: false,
  });

  // Preview refresh
  const [previewRefreshKey, setPreviewRefreshKey] = useState(0);
  const refreshPreview = useCallback(() => setPreviewRefreshKey((k) => k + 1), []);

  // Hero image state
  const [heroImageOriginalUrl, setHeroImageOriginalUrl] = useState("");
  const [heroImageDesktopUrl, setHeroImageDesktopUrl] = useState("");
  const [heroImageMobileUrl, setHeroImageMobileUrl] = useState("");
  const [heroImageBlurDataUrl, setHeroImageBlurDataUrl] = useState("");
  const [heroFocalX, setHeroFocalX] = useState(50);
  const [heroFocalY, setHeroFocalY] = useState(35);
  const [heroMode, setHeroMode] = useState<"photo" | "logo">("photo");

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

      // Kademe 2
      setLandingConfig(settings.landingConfig ?? null);
      setSocialLinks(settings.socialLinks ?? null);
      setHeadingFont(settings.headingFont ?? null);
      setBodyFont(settings.bodyFont ?? null);
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

      setPayment({
        provider: "iyzico",
        iyzicoApiKey: settings.iyzicoApiKey,
        iyzicoSecretKey: settings.iyzicoSecretKey,
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

  const handleSavePayment = async () => {
    setSavingPayment(true);
    setError("");

    await updatePaymentSettings(domain, {
      iyzicoApiKey: payment.iyzicoApiKey,
      iyzicoSecretKey: payment.iyzicoSecretKey,
    });
    showSuccess("Ödeme ayarları kaydedildi.");

    setSavingPayment(false);
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
      alert("error" in result ? result.error : "Hata");
    } else {
      const refreshed = await getCoachPackages(domain);
      setPackages(refreshed as PackageData[]);
    }
  };

  const lockedThemeCount = Math.max(0, LANDING_THEME_LIST.length - availableThemeSet.size);
  const isPkgEditing = showPkgCreate || editingPkgId;

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

  return (
    <div className={`${activeTab === "landing" ? "max-w-[1600px]" : "max-w-5xl"} space-y-6 stagger-children transition-all`}>
      <h1 className="text-2xl font-semibold animate-fade-in" style={{ color: "var(--dashboard-main-text)" }}>Ayarlar</h1>

      {/* Tab Navigation */}
      <div className="flex gap-1 overflow-x-auto rounded-lg border p-1" style={{ borderColor: "var(--dashboard-card-border)", backgroundColor: "var(--dashboard-main-bg)" }}>
        {TABS.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className="whitespace-nowrap rounded-md px-4 py-2 text-sm font-medium transition"
            style={{
              backgroundColor: activeTab === tab.id ? "var(--dashboard-accent)" : "transparent",
              color: activeTab === tab.id ? "var(--dashboard-accent-text)" : "var(--dashboard-main-text-muted)",
            }}
          >
            {tab.label}
          </button>
        ))}
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

      {/* Landing Sayfa Tab */}
      {activeTab === "landing" && (
        <div className="grid grid-cols-1 xl:grid-cols-[1fr_480px] gap-6">
          {/* Left: Settings */}
          <div className="space-y-6">
            <HeroImageSettings
              domain={domain}
              initialHeroImageOriginalUrl={heroImageOriginalUrl}
              initialHeroImageDesktopUrl={heroImageDesktopUrl}
              initialHeroImageMobileUrl={heroImageMobileUrl}
              initialHeroImageBlurDataUrl={heroImageBlurDataUrl}
              initialHeroFocalX={heroFocalX}
              initialHeroFocalY={heroFocalY}
              initialHeroMode={heroMode}
              onSaved={refreshPreview}
            />
            <LandingPageSettings
              domain={domain}
              initialLandingConfig={landingConfig}
              initialHeadingFont={headingFont}
              initialBodyFont={bodyFont}
              features={landingFeatures}
              onSaved={refreshPreview}
            />
          </div>
          {/* Right: Live Preview */}
          <div className="hidden xl:block sticky top-4 h-[calc(100vh-8rem)]">
            <LandingPreviewPanel domain={domain} refreshKey={previewRefreshKey} />
          </div>
        </div>
      )}

      {/* Sosyal Medya Tab */}
      {activeTab === "sosyal" && (
        <SocialLinksSettings
          domain={domain}
          initialSocialLinks={socialLinks}
          maxLinks={landingFeatures.maxSocialLinks}
        />
      )}

      {/* Odeme Tab */}
      {activeTab === "odeme" && (
        <>
          {/* Payment */}
          <Card style={{ backgroundColor: "var(--dashboard-card-bg)", borderColor: "var(--dashboard-card-border)", color: "var(--dashboard-main-text)" }}>
            <CardHeader>
              <CardTitle className="text-lg">Odeme Entegrasyonu</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="mb-1 block text-sm" style={{ color: "var(--dashboard-main-text-muted)" }}>Saglayici</label>
                <select
                  value={payment.provider}
                  onChange={(event) =>
                    setPayment((previous) => ({ ...previous, provider: event.target.value }))
                  }
                  className="w-full rounded-md px-3 py-2 text-sm"
                  style={{ border: "1px solid var(--dashboard-card-border)", backgroundColor: "var(--dashboard-main-bg)", color: "var(--dashboard-main-text)" }}
                >
                  <option value="iyzico">iyzico</option>
                  <option value="stripe">stripe</option>
                </select>
              </div>

              <div>
                <label className="mb-1 block text-sm" style={{ color: "var(--dashboard-main-text-muted)" }}>iyzico API Key</label>
                <Input
                  type="password"
                  value={payment.iyzicoApiKey}
                  onChange={(event) =>
                    setPayment((previous) => ({ ...previous, iyzicoApiKey: event.target.value }))
                  }
                  style={{ borderColor: "var(--dashboard-card-border)", backgroundColor: "var(--dashboard-main-bg)", color: "var(--dashboard-main-text)" }}
                />
              </div>

              <div>
                <label className="mb-1 block text-sm" style={{ color: "var(--dashboard-main-text-muted)" }}>iyzico Secret Key</label>
                <Input
                  type="password"
                  value={payment.iyzicoSecretKey}
                  onChange={(event) =>
                    setPayment((previous) => ({
                      ...previous,
                      iyzicoSecretKey: event.target.value,
                    }))
                  }
                  style={{ borderColor: "var(--dashboard-card-border)", backgroundColor: "var(--dashboard-main-bg)", color: "var(--dashboard-main-text)" }}
                />
              </div>

              <Button
                onClick={handleSavePayment}
                disabled={savingPayment}
                style={{
                  backgroundColor: "var(--dashboard-accent)",
                  color: "var(--dashboard-accent-text)",
                }}
                className="font-semibold hover:opacity-90"
              >
                {savingPayment ? "Kaydediliyor..." : "Kaydet"}
              </Button>
            </CardContent>
          </Card>
        </>
      )}

      {/* Genel Tab */}
      {activeTab === "genel" && (
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

          {/* Marka Ayarlari */}
          <Card style={{ backgroundColor: "var(--dashboard-card-bg)", borderColor: "var(--dashboard-card-border)", color: "var(--dashboard-main-text)" }}>
            <CardHeader>
              <CardTitle className="text-lg">Marka Ayarlari</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
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

              <div>
                <label className="mb-1 block text-sm" style={{ color: "var(--dashboard-main-text-muted)" }}>Hakkimda</label>
                <textarea
                  value={branding.bio}
                  onChange={(event) =>
                    setBranding((previous) => ({ ...previous, bio: event.target.value }))
                  }
                  className="min-h-[100px] w-full rounded-md px-3 py-2 text-sm"
                  style={{ border: "1px solid var(--dashboard-card-border)", backgroundColor: "var(--dashboard-main-bg)", color: "var(--dashboard-main-text)" }}
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
            </CardContent>
          </Card>
        </>
      )}

      {/* Temalar Tab */}
      {activeTab === "temalar" && (
        <>
          {/* Landing Theme */}
          <Card style={{ backgroundColor: "var(--dashboard-card-bg)", borderColor: "var(--dashboard-card-border)", color: "var(--dashboard-main-text)" }}>
            <CardHeader>
              <CardTitle className="text-lg">Site Temasi</CardTitle>
              <p className="text-sm" style={{ color: "var(--dashboard-main-text-muted)" }}>
                Tema degisiklikleri planiniza gore kontrol edilir.
              </p>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {LANDING_THEME_LIST.map((theme) => {
                  const themeId = Number(theme.id.replace("theme-", ""));
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
            </CardContent>
          </Card>

          {/* Dashboard Theme */}
          <Card style={{ backgroundColor: "var(--dashboard-card-bg)", borderColor: "var(--dashboard-card-border)", color: "var(--dashboard-main-text)" }}>
            <CardHeader>
              <CardTitle className="text-lg">Panel Temasi</CardTitle>
              <p className="text-sm" style={{ color: "var(--dashboard-main-text-muted)" }}>
                Yonetim paneli icin renk temasi secin.
              </p>
            </CardHeader>
            <CardContent>
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
            </CardContent>
          </Card>

          {/* Panel Duzeni */}
          <Card style={{ backgroundColor: "var(--dashboard-card-bg)", borderColor: "var(--dashboard-card-border)", color: "var(--dashboard-main-text)" }}>
            <CardHeader>
              <CardTitle className="text-lg">Panel Duzeni</CardTitle>
              <p className="text-sm" style={{ color: "var(--dashboard-main-text-muted)" }}>
                Navigasyon menusunun konumunu secin.
              </p>
            </CardHeader>
            <CardContent>
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
            </CardContent>
          </Card>
        </>
      )}
    </div>
  );
}
