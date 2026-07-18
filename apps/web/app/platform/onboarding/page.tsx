"use client";

import { Suspense, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Check, Lock, Maximize2, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { createCoachSite, checkSubdomain } from "./actions";
import { createClient } from "@/lib/supabase/client";
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
  const [previewTheme, setPreviewTheme] = useState<LandingThemeId | null>(null);

  // Önizleme modalı ESC ile kapansın
  useEffect(() => {
    if (!previewTheme) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setPreviewTheme(null);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [previewTheme]);

  const [subdomainStatus, setSubdomainStatus] = useState<{
    checked: boolean;
    available: boolean;
    error?: string;
  }>({ checked: false, available: false });

  const router = useRouter();

  // Onboarding yalnız doğrulanmış oturumla açılır; oturum yoksa kayıt sayfasına dön.
  // (E-posta doğrulama açıkken doğrulanmamış kullanıcıya Supabase session vermez;
  // createCoachSite ayrıca sunucuda email_confirmed_at kontrolü yapar.)
  useEffect(() => {
    const supabase = createClient();
    supabase.auth.getUser().then(({ data }) => {
      if (!data.user) {
        router.replace(`/platform/auth?mode=signup&tier=${tierKey}`);
      }
    });
  }, [router, tierKey]);

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
      {/* Arka plan: platform ana sayfasıyla aynı ambiyans — nokta grid + mavi ışık lekeleri */}
      <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden" aria-hidden>
        <div
          className="absolute inset-0 opacity-[0.05]"
          style={{ backgroundImage: "radial-gradient(#ffffff 1px, transparent 1px)", backgroundSize: "42px 42px" }}
        />
        <div className="absolute left-[-12%] top-[28%] h-[680px] w-[680px] rounded-full bg-[#3d6fd1] opacity-[0.13] blur-[160px]" />
        <div className="absolute right-[-14%] top-[56%] h-[720px] w-[720px] rounded-full bg-[#3d6fd1] opacity-[0.11] blur-[170px]" />
        <div className="absolute bottom-[6%] left-[26%] h-[620px] w-[620px] rounded-full bg-[#3d6fd1] opacity-[0.10] blur-[160px]" />
      </div>
      <div className="container relative z-10 mx-auto max-w-4xl">
        <div className="mb-8 text-center">
          <Link href="/platform" className="font-heading text-3xl font-bold tracking-wider hover:scale-105 transition-transform inline-block">
            SHRED<span className="text-[#3d6fd1]">.</span>
          </Link>
          <h1 className="font-heading mt-6 text-2xl font-bold tracking-tight">Siteni Oluştur</h1>
          <p className="mt-2 text-sm text-white/40">Birkaç adımda markanı yayına al — tüm özellikler ücretsiz açık</p>
        </div>

        <div className="mb-12 flex items-center justify-center gap-4">
          {STEPS.map((stepValue, index) => {
            // Site oluşturulduktan sonra geri dönülemez; öncesinde tamamlanan
            // adımlara tıklayarak geri gidilebilir.
            const canJumpBack = step !== "complete" && index < currentStepIndex;
            return (
              <div key={stepValue} className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => canJumpBack && setStep(stepValue)}
                  disabled={!canJumpBack}
                  className={`flex flex-col items-center gap-1 ${canJumpBack ? "cursor-pointer" : "cursor-default"}`}
                  aria-label={`${index + 1}. adım: ${STEP_LABELS[stepValue]}`}
                >
                  <span
                    className={`flex h-8 w-8 items-center justify-center rounded-full text-sm font-bold transition ${
                      step === stepValue
                        ? "bg-[#3d6fd1] text-white"
                        : index < currentStepIndex
                        ? "bg-[#3d6fd1]/30 text-[#3d6fd1] hover:bg-[#3d6fd1]/50"
                        : "bg-white/10 text-white/40"
                    }`}
                  >
                    {index + 1}
                  </span>
                  <span className="text-xs text-white/40">{STEP_LABELS[stepValue]}</span>
                </button>
                {index < STEPS.length - 1 && <div className="mb-5 h-0.5 w-12 bg-white/10" />}
              </div>
            );
          })}
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
                  className="border-white/20 bg-transparent text-white hover:bg-white/10 hover:text-white"
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
                Sitenin görünümünü belirleyen şablonu seç. Her kartın köşesindeki{" "}
                <span className="text-white/70">Önizle</span> butonuyla şablonu büyütüp
                yakından inceleyebilirsin.
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
                      <div
                        key={theme.id}
                        role="button"
                        tabIndex={isAllowed ? 0 : -1}
                        aria-pressed={isSelected}
                        aria-disabled={!isAllowed}
                        onClick={() => isAllowed && setSelectedLandingTheme(theme.id)}
                        onKeyDown={(e) => {
                          if (isAllowed && (e.key === "Enter" || e.key === " ")) {
                            e.preventDefault();
                            setSelectedLandingTheme(theme.id);
                          }
                        }}
                        className={`relative overflow-hidden rounded-xl border text-left transition ${
                          isAllowed ? "cursor-pointer" : "cursor-not-allowed"
                        }`}
                        style={{
                          borderColor: isSelected ? "#3d6fd1" : "rgba(255,255,255,0.16)",
                          opacity: isAllowed ? 1 : 0.64,
                        }}
                      >
                        <div className="relative">
                          <LandingThemePreview themeId={theme.id} />
                          {/* Büyütülmüş önizleme */}
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              setPreviewTheme(theme.id);
                            }}
                            className="absolute left-2 top-2 inline-flex items-center gap-1.5 rounded-full border border-white/25 bg-black/60 px-2.5 py-1 text-[11px] font-semibold text-white backdrop-blur-sm transition hover:border-white/50 hover:bg-black/80"
                          >
                            <Maximize2 className="h-3 w-3" />
                            Önizle
                          </button>
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
                      </div>
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

              <div className="rounded-lg border border-[#3d6fd1]/25 bg-[#3d6fd1]/[0.07] p-4 text-xs leading-relaxed text-white/70">
                <span className="font-semibold text-white">Bu yalnızca bir başlangıç seçimi.</span>{" "}
                Siten yayına aldıktan sonra panelindeki <span className="text-white">Ayarlar</span> bölümünden
                şablonunu istediğin zaman değiştirebilir; renkleri, fotoğrafları, paketleri ve tüm içerikleri
                düzenleyebilir, hatta siteni bölüm bölüm sıfırdan kurgulayabilirsin. Hiçbir seçim kalıcı değil.
              </div>

              <div className="flex gap-3">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setStep("branding")}
                  className="border-white/20 bg-transparent text-white hover:bg-white/10 hover:text-white"
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
                  className="border-white/20 bg-transparent text-white hover:bg-white/10 hover:text-white"
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

              <div className="space-y-3 rounded-xl border border-white/10 bg-white/5 p-4">
                <p className="text-sm font-semibold text-white/70">Kurulum özeti</p>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between gap-4 border-b border-white/10 pb-2">
                    <span className="text-white/50">Marka Adı</span>
                    <span className="font-semibold">{brandName}</span>
                  </div>
                  <div className="flex justify-between gap-4 border-b border-white/10 pb-2">
                    <span className="text-white/50">Şablon</span>
                    <span className="font-semibold">
                      {selectedLandingMeta?.name || selectedLandingTheme}
                    </span>
                  </div>
                  <div className="flex justify-between gap-4">
                    <span className="text-white/50">Erişim</span>
                    <span className="font-semibold">Tüm özellikler açık</span>
                  </div>
                </div>
                <p className="text-xs text-white/40">
                  Şablon dahil tüm seçimleri daha sonra panelindeki Ayarlar bölümünden
                  değiştirebilirsin.
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
                    className="shrink-0 border-white/20 bg-transparent text-white hover:bg-white/10 hover:text-white"
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
                    className="w-full border-white/20 bg-transparent text-white hover:bg-white/10 hover:text-white"
                  >
                    Landing Sayfamı Gör
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        )}
      </div>

      {/* ─── Şablon büyütülmüş önizleme modalı ─── */}
      {previewTheme && (() => {
        const meta = LANDING_THEME_LIST.find((theme) => theme.id === previewTheme);
        const previewAllowed = availableLanding.has(previewTheme);
        return (
          <div
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            role="dialog"
            aria-modal="true"
            aria-label={`${meta?.name || "Şablon"} önizlemesi`}
          >
            <button
              type="button"
              aria-label="Önizlemeyi kapat"
              onClick={() => setPreviewTheme(null)}
              className="absolute inset-0 bg-black/75 backdrop-blur-sm"
            />
            <div className="relative max-h-[90vh] w-full max-w-3xl overflow-y-auto rounded-3xl border border-white/10 bg-[#0a0a0a] p-6 shadow-[0_40px_120px_-20px_rgba(0,0,0,0.9)]">
              <button
                type="button"
                onClick={() => setPreviewTheme(null)}
                className="absolute right-4 top-4 flex h-9 w-9 items-center justify-center rounded-full border border-white/15 bg-white/5 text-white/70 transition hover:bg-white/10 hover:text-white"
                aria-label="Kapat"
              >
                <X className="h-4 w-4" />
              </button>
              <div className="flex flex-col items-center gap-6 md:flex-row md:items-start">
                <div className="shrink-0">
                  <ZoomedThemePreview themeId={previewTheme} />
                </div>
                <div className="flex min-w-0 flex-1 flex-col gap-4 md:pt-2">
                  <div>
                    <h3 className="font-heading text-2xl font-bold">{meta?.name}</h3>
                    <p className="mt-2 text-sm leading-relaxed text-white/60">{meta?.description}</p>
                  </div>
                  <p className="text-xs leading-relaxed text-white/40">
                    Bu, şablonun renk ve yerleşim düzenini gösteren şematik bir önizlemedir.
                    Marka adın, fotoğrafların ve paketlerin siteye otomatik yerleşir; tüm
                    renk ve içerikleri sonradan panelinden değiştirebilirsin.
                  </p>
                  <div className="mt-auto flex flex-col gap-2 sm:flex-row">
                    <Button
                      type="button"
                      disabled={!previewAllowed}
                      onClick={() => {
                        setSelectedLandingTheme(previewTheme);
                        setPreviewTheme(null);
                      }}
                      className="bg-[#3d6fd1] font-semibold text-white hover:bg-[#2f57b8]"
                    >
                      {previewAllowed ? "Bu Şablonu Seç" : "Bu Şablon Kilitli"}
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => setPreviewTheme(null)}
                      className="border-white/20 bg-transparent text-white hover:bg-white/10 hover:text-white"
                    >
                      Kapat
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );
      })()}
    </div>
  );
}

// LandingThemePreview sabit piksel ölçülü mini bir mockup olduğundan büyütmeyi
// CSS transform ile yapıyoruz (genişletmek yalnız boşlukları büyütürdü).
function ZoomedThemePreview({ themeId }: { themeId: LandingThemeId }) {
  return (
    <>
      {/* Masaüstü: 1.5x büyütme (280x350 → 420x525) */}
      <div className="relative hidden overflow-hidden rounded-xl border border-white/10 sm:block" style={{ width: 420, height: 525 }}>
        <div className="absolute left-0 top-0 origin-top-left" style={{ width: 280, transform: "scale(1.5)" }}>
          <LandingThemePreview themeId={themeId} />
        </div>
      </div>
      {/* Mobil: dar ekrana sığan boyut */}
      <div className="relative overflow-hidden rounded-xl border border-white/10 sm:hidden" style={{ width: 252, height: 315 }}>
        <div className="absolute left-0 top-0 origin-top-left" style={{ width: 280, transform: "scale(0.9)" }}>
          <LandingThemePreview themeId={themeId} />
        </div>
      </div>
    </>
  );
}
