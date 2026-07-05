"use client";

import { Suspense, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Check, Lock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { createCoachSite, checkSubdomain } from "./actions";
import {
  LANDING_THEME_LIST,
  type LandingThemeId,
} from "@/src/theme/landingThemes";
import { allowedThemeIds, resolvePlanId } from "@/src/lib/plan";
import { LandingThemePreview } from "@/src/components/theme-preview/LandingThemePreview";

// Onboarding'de yalnız hazır şablonlar gösterilir. Section Builder (theme-elite)
// ayrı bir mod — Elite plan koçları kayıt sonrası Ayarlar → Site Modu'ndan seçer.
// Dashboard teması da burada sorulmaz; sonradan Ayarlar → Panel Teması'ndan
// değiştirilir. İlk kayıt akışını yalın tutar.
type Step = "branding" | "themes" | "review" | "complete";

const STEPS: Step[] = ["branding", "themes", "review", "complete"];

const STEP_LABELS: Record<Step, string> = {
  branding: "Marka",
  themes: "Şablon",
  review: "Onay",
  complete: "Tamam",
};

export default function OnboardingPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-[#050505] text-white flex items-center justify-center">
        <div className="animate-pulse text-white/40">Yükleniyor...</div>
      </div>
    }>
      <OnboardingPageContent />
    </Suspense>
  );
}

function OnboardingPageContent() {
  const searchParams = useSearchParams();
  // Lansman döneminde tüm özellikler ücretsiz açık → varsayılan tier 3 (tüm temalar).
  const tier = Number(searchParams.get("tier")) || 3;
  const tierKey = (tier >= 1 && tier <= 3 ? tier : 3) as 1 | 2 | 3;
  const planId = resolvePlanId(tierKey);
  const availableThemeIds = useMemo(() => allowedThemeIds(planId), [planId]);
  // Section Builder (theme-elite) bilinçli olarak onboarding'de gösterilmez —
  // koç hazır şablonla başlar, isterse sonra Ayarlar'dan BUILDER moduna geçer.
  const availableLanding = useMemo(
    () =>
      new Set<LandingThemeId>(
        availableThemeIds
          .filter((id) => id !== 7)
          .map((id) => `theme-${id}` as LandingThemeId)
      ),
    [availableThemeIds]
  );

  const [step, setStep] = useState<Step>("branding");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [createdSubdomain, setCreatedSubdomain] = useState("");
  const [linkCopied, setLinkCopied] = useState(false);

  const [brandName, setBrandName] = useState("");
  const [subdomain, setSubdomain] = useState("");
  const [selectedLandingTheme, setSelectedLandingTheme] =
    useState<LandingThemeId>("theme-1");

  const [subdomainStatus, setSubdomainStatus] = useState<{
    checked: boolean;
    available: boolean;
    error?: string;
  }>({ checked: false, available: false });

  const router = useRouter();

  useEffect(() => {
    if (!availableLanding.has(selectedLandingTheme)) {
      setSelectedLandingTheme("theme-1");
    }
  }, [availableLanding, selectedLandingTheme]);

  const handleCheckSubdomain = async () => {
    if (!subdomain || subdomain.length < 3) {
      return;
    }

    setLoading(true);
    const result = await checkSubdomain(subdomain);
    setSubdomainStatus({
      checked: true,
      available: result.available,
      error: result.error,
    });
    setLoading(false);
  };

  const handleSubmit = async () => {
    setLoading(true);
    setError("");

    try {
      // Dashboard teması burada sorulmaz — landing tema ID'sini dashboard için de
      // varsayılan olarak geçiyoruz; koç sonradan Ayarlar'dan istediğini seçer.
      const landingThemeNumber = Number(selectedLandingTheme.replace("theme-", "")) || 1;
      const result = await createCoachSite({
        brandName,
        subdomain,
        landingThemeId: landingThemeNumber,
        dashboardThemeId: landingThemeNumber,
        tier: tierKey,
      });

      if (result.error) {
        setError(result.error);
        if (result.subdomain) {
          setTimeout(() => router.push(`/site/${result.subdomain}/dashboard`), 1500);
        }
        setLoading(false);
        return;
      }

      if (result.success && result.subdomain) {
        setCreatedSubdomain(result.subdomain);
        setStep("complete");
      }
    } catch (submitError) {
      setError(
        submitError instanceof Error ? submitError.message : "Site creation failed."
      );
    }

    setLoading(false);
  };

  const canProceedFromBranding =
    brandName.trim().length > 0 && subdomainStatus.available;
  const currentStepIndex = STEPS.indexOf(step);
  // Onboarding'de yalnız hazır şablonlar listelendiğinden Section Builder
  // (theme-elite) toplam sayımdan da hariç tutulur.
  const visibleLandingThemes = useMemo(
    () => LANDING_THEME_LIST.filter((t) => t.id !== "theme-elite"),
    []
  );
  const landingLockedCount = visibleLandingThemes.length - availableLanding.size;
  const selectedLandingMeta = LANDING_THEME_LIST.find(
    (theme) => theme.id === selectedLandingTheme
  );

  return (
    <div className="relative min-h-screen bg-[#050505] px-6 py-12 text-white overflow-hidden selection:bg-[#3d6fd1]/30 selection:text-white">
      {/* Arka plan: ince grid + mavi ışıltı */}
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.008)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.008)_1px,transparent_1px)] bg-[size:36px_36px]" />
        <div className="absolute top-[-10%] left-1/2 -translate-x-1/2 h-[420px] w-[520px] rounded-full bg-[#3d6fd1]/[0.06] blur-[130px]" />
      </div>
      <div className="container relative mx-auto max-w-4xl">
        <div className="mb-8 text-center">
          <Link href="/platform" className="font-heading text-3xl font-bold tracking-wider hover:scale-105 transition-transform inline-block">
            SHRED<span className="text-[#3d6fd1]">.</span>
          </Link>
          <h1 className="font-heading mt-6 text-2xl font-bold tracking-tight">Siteni Oluştur</h1>
          <p className="mt-2 text-sm text-white/40">Birkaç adımda markanı yayına al — tüm özellikler ücretsiz açık</p>
        </div>

        <div className="mb-12 flex items-center justify-center gap-4">
          {STEPS.map((stepValue, index) => (
            <div key={stepValue} className="flex items-center gap-2">
              <div className="flex flex-col items-center gap-1">
                <div
                  className={`flex h-8 w-8 items-center justify-center rounded-full text-sm font-bold ${
                    step === stepValue
                      ? "bg-[#3d6fd1] text-white"
                      : index < currentStepIndex
                      ? "bg-[#3d6fd1]/30 text-[#3d6fd1]"
                      : "bg-white/10 text-white/40"
                  }`}
                >
                  {index + 1}
                </div>
                <span className="text-xs text-white/40">{STEP_LABELS[stepValue]}</span>
              </div>
              {index < STEPS.length - 1 && <div className="mb-5 h-0.5 w-12 bg-white/10" />}
            </div>
          ))}
        </div>

        {error && (
          <div className="mb-6 rounded-md border border-red-500/30 bg-red-500/10 p-3 text-center text-sm text-red-300">
            {error}
          </div>
        )}

        {step === "branding" && (
          <Card className="border-white/[0.08] bg-[#0a0a0a]/70 backdrop-blur-xl text-white shadow-[0_25px_60px_rgba(0,0,0,0.5)]">
            <CardHeader>
              <CardTitle className="font-heading text-xl">Marka ve Site Adresi</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <label className="mb-1 block text-sm text-white/60">Marka Adı</label>
                <Input
                  value={brandName}
                  onChange={(event) => setBrandName(event.target.value)}
                  placeholder="Örn: FitCoach Ahmet"
                  className="border-white/20 bg-white/10 text-white placeholder:text-white/30"
                />
              </div>

              <div>
                <label className="mb-1 block text-sm text-white/60">Site Adresi</label>
                <div className="flex items-center gap-2">
                  <Input
                    value={subdomain}
                    onChange={(event) => {
                      const normalized = event.target.value
                        .toLowerCase()
                        .replace(/ç/g, "c")
                        .replace(/ğ/g, "g")
                        .replace(/ı/g, "i")
                        .replace(/ö/g, "o")
                        .replace(/ş/g, "s")
                        .replace(/ü/g, "u")
                        .replace(/[^a-z0-9-]/g, "");
                      setSubdomain(normalized);
                      setSubdomainStatus({ checked: false, available: false });
                    }}
                    placeholder="markaadi"
                    className="border-white/20 bg-white/10 text-white placeholder:text-white/30"
                  />
                  <span className="whitespace-nowrap text-sm text-white/40">
                    .shred.com.tr
                  </span>
                </div>

                {subdomainStatus.checked && subdomainStatus.available && (
                  <p className="mt-1 text-sm text-green-400">Bu adres müsait.</p>
                )}

                {subdomainStatus.checked && !subdomainStatus.available && (
                  <p className="mt-1 text-sm text-red-400">
                    {subdomainStatus.error || "Bu adres kullanılamıyor."}
                  </p>
                )}
              </div>

              <div className="flex flex-wrap gap-3">
                <Button
                  type="button"
                  onClick={handleCheckSubdomain}
                  disabled={!subdomain || subdomain.length < 3 || loading}
                  variant="outline"
                  className="border-white/20 text-white hover:bg-white/10"
                >
                  {loading ? "Kontrol ediliyor..." : "Müsaitlik Kontrol Et"}
                </Button>
                <Button
                  type="button"
                  onClick={() => setStep("themes")}
                  disabled={!canProceedFromBranding}
                  className="bg-[#3d6fd1] font-semibold text-white hover:bg-[#2f57b8]"
                >
                  Devam Et
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {step === "themes" && (
          <Card className="border-white/[0.08] bg-[#0a0a0a]/70 backdrop-blur-xl text-white shadow-[0_25px_60px_rgba(0,0,0,0.5)]">
            <CardHeader>
              <CardTitle className="font-heading text-xl">Landing Şablonunu Seç</CardTitle>
              <p className="text-sm text-white/40">
                Sitenin görünümünü belirleyen şablonu seç. Panel teması ve diğer ayarları
                daha sonra dashboard içinden değiştirebilirsin.
              </p>
            </CardHeader>
            <CardContent className="space-y-8">
              <section className="space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-semibold uppercase tracking-[0.12em] text-white/70">
                    Hazır Şablonlar
                  </h3>
                  <span className="text-xs text-white/50">
                    {availableLanding.size}/{visibleLandingThemes.length} açık
                  </span>
                </div>
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                  {visibleLandingThemes.map((theme) => {
                    const isAllowed = availableLanding.has(theme.id);
                    const isSelected = selectedLandingTheme === theme.id;

                    return (
                      <button
                        type="button"
                        key={theme.id}
                        onClick={() => isAllowed && setSelectedLandingTheme(theme.id)}
                        className="relative overflow-hidden rounded-xl border text-left transition"
                        style={{
                          borderColor: isSelected ? "#3d6fd1" : "rgba(255,255,255,0.16)",
                          opacity: isAllowed ? 1 : 0.64,
                        }}
                        disabled={!isAllowed}
                      >
                        <div className="relative">
                          <LandingThemePreview themeId={theme.id} />
                          {!isAllowed && (
                            <div className="absolute inset-0 flex items-center justify-center rounded-lg bg-black/60">
                              <div className="inline-flex items-center gap-1 rounded-full border border-white/30 bg-black/40 px-3 py-1 text-xs font-semibold">
                                <Lock className="h-3.5 w-3.5" />
                                Kilitli
                              </div>
                            </div>
                          )}
                          {isSelected && (
                            <div className="absolute right-2 top-2 flex h-7 w-7 items-center justify-center rounded-full bg-[#3d6fd1] text-white">
                              <Check className="h-4 w-4" />
                            </div>
                          )}
                        </div>
                        <div className="space-y-1 p-3">
                          <p className="text-sm font-semibold">{theme.name}</p>
                          <p className="text-xs text-white/50">{theme.description}</p>
                        </div>
                      </button>
                    );
                  })}
                </div>
                {landingLockedCount > 0 && (
                  <div className="rounded-lg border border-white/15 bg-white/5 p-3 text-xs text-white/70">
                    Mevcut planında {landingLockedCount} şablon kilitli.
                    <Link
                      href="/platform/pricing"
                      className="ml-1 font-semibold text-[#3d6fd1] underline-offset-2 hover:underline"
                    >
                      Planını yükselterek aç.
                    </Link>
                  </div>
                )}
              </section>

              <div className="rounded-lg border border-white/10 bg-white/5 p-3 text-xs text-white/60">
                Panel teması ve diğer görsel ayarlar dashboard içinden değiştirilebilir —
                ilk kayıtta sade tutuyoruz.
              </div>

              <div className="flex gap-3">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setStep("branding")}
                  className="border-white/20 text-white hover:bg-white/10"
                >
                  Geri
                </Button>
                <Button
                  type="button"
                  className="bg-[#3d6fd1] font-semibold text-white hover:bg-[#2f57b8]"
                  onClick={() => setStep("review")}
                >
                  Devam Et
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {step === "review" && (
          <Card className="border-white/[0.08] bg-[#0a0a0a]/70 backdrop-blur-xl text-white shadow-[0_25px_60px_rgba(0,0,0,0.5)]">
            <CardHeader>
              <CardTitle className="font-heading text-xl">Özet</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-3">
                <div className="flex justify-between border-b border-white/10 py-2">
                  <span className="text-white/60">Marka Adı</span>
                  <span className="font-semibold">{brandName}</span>
                </div>
                <div className="flex justify-between border-b border-white/10 py-2">
                  <span className="text-white/60">Site Adresi</span>
                  <span className="font-semibold">{subdomain}.shred.com.tr</span>
                </div>
                <div className="flex justify-between border-b border-white/10 py-2">
                  <span className="text-white/60">Şablon</span>
                  <span className="font-semibold">
                    {selectedLandingMeta?.name || selectedLandingTheme}
                  </span>
                </div>
                <div className="flex justify-between border-b border-white/10 py-2">
                  <span className="text-white/60">Erişim</span>
                  <span className="font-semibold">Tüm özellikler açık</span>
                </div>
              </div>

              <div className="flex gap-3">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setStep("themes")}
                  className="border-white/20 text-white hover:bg-white/10"
                >
                  Geri
                </Button>
                <Button
                  type="button"
                  onClick={handleSubmit}
                  disabled={loading}
                  className="flex-1 bg-[#3d6fd1] font-semibold text-white hover:bg-[#2f57b8]"
                >
                  {loading ? "Site oluşturuluyor..." : "Sitemi Oluştur"}
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {step === "complete" && (
          <Card className="border-white/[0.08] bg-[#0a0a0a]/70 backdrop-blur-xl text-white shadow-[0_25px_60px_rgba(0,0,0,0.5)]">
            <CardContent className="space-y-8 pb-8 pt-8">
              <div className="text-center">
                <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-[#3d6fd1]/20">
                  <svg
                    className="h-8 w-8 text-[#3d6fd1]"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2.5}
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <h2 className="font-heading text-2xl font-bold">Siteniz Hazır</h2>
                <p className="mt-2 text-sm text-white/50">
                  {brandName} başarıyla oluşturuldu.
                </p>
              </div>

              <div className="space-y-3 rounded-xl bg-white/5 p-4">
                <p className="text-sm text-white/50">Site adresiniz</p>
                <div className="flex items-center gap-2">
                  <code className="flex-1 break-all rounded-lg bg-black/30 px-4 py-3 font-mono text-sm text-[#3d6fd1]">
                    {typeof window !== "undefined" && window.location.hostname !== "localhost"
                      ? `${createdSubdomain}.shred.com.tr`
                      : `localhost:3002/site/${createdSubdomain}`}
                  </code>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    className="shrink-0 border-white/20 text-white hover:bg-white/10"
                    onClick={() => {
                      const url =
                        typeof window !== "undefined" &&
                        window.location.hostname !== "localhost"
                          ? `https://${createdSubdomain}.shred.com.tr`
                          : `${window.location.protocol}//${window.location.host}/site/${createdSubdomain}`;
                      navigator.clipboard.writeText(url);
                      setLinkCopied(true);
                      setTimeout(() => setLinkCopied(false), 2000);
                    }}
                  >
                    {linkCopied ? "Kopyalandı" : "Kopyala"}
                  </Button>
                </div>
              </div>

              <div className="space-y-3">
                <Link href={`/site/${createdSubdomain}/dashboard`} className="block">
                  <Button className="w-full bg-[#3d6fd1] font-semibold text-white hover:bg-[#2f57b8]">
                    Dashboard'a Git
                  </Button>
                </Link>
                <Link href={`/site/${createdSubdomain}`} className="block">
                  <Button
                    variant="outline"
                    className="w-full border-white/20 text-white hover:bg-white/10"
                  >
                    Landing Sayfamı Gör
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
