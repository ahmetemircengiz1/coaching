"use client";

import { Suspense, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Check, Lock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { createCoachSite, checkSubdomain } from "./actions";
import { DASHBOARD_THEME_LIST } from "@/src/theme/dashboardThemes";
import {
  LANDING_THEME_LIST,
  type LandingThemeId,
} from "@/src/theme/landingThemes";
import { allowedThemeIds, resolvePlanId } from "@/src/lib/plan";
import { LandingThemePreview } from "@/src/components/theme-preview/LandingThemePreview";
import { DashboardThemePreview } from "@/src/components/theme-preview/DashboardThemePreview";

type Step = "branding" | "themes" | "review" | "complete";

const STEPS: Step[] = ["branding", "themes", "review", "complete"];

const STEP_LABELS: Record<Step, string> = {
  branding: "Branding",
  themes: "Themes",
  review: "Review",
  complete: "Done",
};

export default function OnboardingPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="animate-pulse text-white/40">Yükleniyor...</div>
      </div>
    }>
      <OnboardingPageContent />
    </Suspense>
  );
}

function OnboardingPageContent() {
  const searchParams = useSearchParams();
  const tier = Number(searchParams.get("tier")) || 1;
  const tierKey = (tier >= 1 && tier <= 3 ? tier : 1) as 1 | 2 | 3;
  const planId = resolvePlanId(tierKey);
  const availableThemeIds = useMemo(() => allowedThemeIds(planId), [planId]);
  const availableLanding = useMemo(
    () =>
      new Set<LandingThemeId>(
        availableThemeIds.map((themeId) => `theme-${themeId}` as LandingThemeId)
      ),
    [availableThemeIds]
  );
  const availableDashboard = useMemo(
    () => new Set<number>(availableThemeIds),
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
  const [selectedDashboardTheme, setSelectedDashboardTheme] = useState(1);

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

    if (!availableDashboard.has(selectedDashboardTheme)) {
      setSelectedDashboardTheme(1);
    }
  }, [availableDashboard, availableLanding, selectedDashboardTheme, selectedLandingTheme]);

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
      const result = await createCoachSite({
        brandName,
        subdomain,
        landingThemeId: Number(selectedLandingTheme.replace("theme-", "")),
        dashboardThemeId: selectedDashboardTheme,
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
  const landingLockedCount = LANDING_THEME_LIST.length - availableLanding.size;
  const dashboardLockedCount =
    DASHBOARD_THEME_LIST.length - availableDashboard.size;
  const selectedLandingMeta = LANDING_THEME_LIST.find(
    (theme) => theme.id === selectedLandingTheme
  );
  const selectedDashboardMeta = DASHBOARD_THEME_LIST.find(
    (theme) => theme.id === selectedDashboardTheme
  );

  return (
    <div className="min-h-screen bg-black px-6 py-12 text-white">
      <div className="container mx-auto max-w-4xl">
        <div className="mb-8 text-center">
          <Link href="/platform" className="font-heading text-3xl font-bold tracking-wider">
            COACH<span className="text-[#ccff00]">OS</span>
          </Link>
          <h1 className="font-heading mt-6 text-2xl">Create Your Site</h1>
          <p className="mt-2 text-sm text-white/40">Plan: {planId}</p>
        </div>

        <div className="mb-12 flex items-center justify-center gap-4">
          {STEPS.map((stepValue, index) => (
            <div key={stepValue} className="flex items-center gap-2">
              <div className="flex flex-col items-center gap-1">
                <div
                  className={`flex h-8 w-8 items-center justify-center rounded-full text-sm font-bold ${
                    step === stepValue
                      ? "bg-[#ccff00] text-black"
                      : index < currentStepIndex
                      ? "bg-[#ccff00]/30 text-[#ccff00]"
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
          <Card className="border-white/10 bg-white/5 text-white">
            <CardHeader>
              <CardTitle className="font-heading text-xl">Branding and Domain</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <label className="mb-1 block text-sm text-white/60">Brand Name</label>
                <Input
                  value={brandName}
                  onChange={(event) => setBrandName(event.target.value)}
                  placeholder="Example: FitCoach Ahmet"
                  className="border-white/20 bg-white/10 text-white placeholder:text-white/30"
                />
              </div>

              <div>
                <label className="mb-1 block text-sm text-white/60">Subdomain</label>
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
                    placeholder="coachname"
                    className="border-white/20 bg-white/10 text-white placeholder:text-white/30"
                  />
                  <span className="whitespace-nowrap text-sm text-white/40">
                    .coachsite.com
                  </span>
                </div>

                {subdomainStatus.checked && subdomainStatus.available && (
                  <p className="mt-1 text-sm text-green-400">This subdomain is available.</p>
                )}

                {subdomainStatus.checked && !subdomainStatus.available && (
                  <p className="mt-1 text-sm text-red-400">
                    {subdomainStatus.error || "This subdomain is not available."}
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
                  {loading ? "Checking..." : "Check Availability"}
                </Button>
                <Button
                  type="button"
                  onClick={() => setStep("themes")}
                  disabled={!canProceedFromBranding}
                  className="bg-[#ccff00] font-semibold text-black hover:bg-[#b8e600]"
                >
                  Continue
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {step === "themes" && (
          <Card className="border-white/10 bg-white/5 text-white">
            <CardHeader>
              <CardTitle className="font-heading text-xl">Pick Initial Themes</CardTitle>
              <p className="text-sm text-white/40">
                You need to select one landing theme and one dashboard theme.
              </p>
            </CardHeader>
            <CardContent className="space-y-8">
              <section className="space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-semibold uppercase tracking-[0.12em] text-white/70">
                    Landing Theme
                  </h3>
                  <span className="text-xs text-white/50">
                    {availableLanding.size}/{LANDING_THEME_LIST.length} unlocked
                  </span>
                </div>
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                  {LANDING_THEME_LIST.map((theme) => {
                    const isAllowed = availableLanding.has(theme.id);
                    const isSelected = selectedLandingTheme === theme.id;

                    return (
                      <button
                        type="button"
                        key={theme.id}
                        onClick={() => isAllowed && setSelectedLandingTheme(theme.id)}
                        className="relative overflow-hidden rounded-xl border text-left transition"
                        style={{
                          borderColor: isSelected ? "#ccff00" : "rgba(255,255,255,0.16)",
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
                                Locked
                              </div>
                            </div>
                          )}
                          {isSelected && (
                            <div className="absolute right-2 top-2 flex h-7 w-7 items-center justify-center rounded-full bg-[#ccff00] text-black">
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
                    {landingLockedCount} landing theme locked on your current plan.
                    <Link
                      href="/platform/pricing"
                      className="ml-1 font-semibold text-[#ccff00] underline-offset-2 hover:underline"
                    >
                      Upgrade to unlock.
                    </Link>
                  </div>
                )}
              </section>

              <section className="space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-semibold uppercase tracking-[0.12em] text-white/70">
                    Dashboard Theme
                  </h3>
                  <span className="text-xs text-white/50">
                    {availableDashboard.size}/{DASHBOARD_THEME_LIST.length} unlocked
                  </span>
                </div>
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                  {DASHBOARD_THEME_LIST.map((theme) => {
                    const isAllowed = availableDashboard.has(theme.id);
                    const isSelected = selectedDashboardTheme === theme.id;

                    return (
                      <button
                        type="button"
                        key={theme.id}
                        onClick={() => isAllowed && setSelectedDashboardTheme(theme.id)}
                        className="relative overflow-hidden rounded-xl border text-left transition"
                        style={{
                          borderColor: isSelected ? "#ccff00" : "rgba(255,255,255,0.16)",
                          opacity: isAllowed ? 1 : 0.64,
                        }}
                        disabled={!isAllowed}
                      >
                        <div className="relative">
                          <DashboardThemePreview theme={theme} />
                          {!isAllowed && (
                            <div className="absolute inset-0 flex items-center justify-center rounded-lg bg-black/60">
                              <div className="inline-flex items-center gap-1 rounded-full border border-white/30 bg-black/40 px-3 py-1 text-xs font-semibold">
                                <Lock className="h-3.5 w-3.5" />
                                Locked
                              </div>
                            </div>
                          )}
                          {isSelected && (
                            <div className="absolute right-2 top-2 flex h-7 w-7 items-center justify-center rounded-full bg-[#ccff00] text-black">
                              <Check className="h-4 w-4" />
                            </div>
                          )}
                        </div>
                        <div className="space-y-1 p-3">
                          <p className="text-sm font-semibold">{theme.name}</p>
                          <p className="text-xs text-white/50">{theme.name}</p>
                        </div>
                      </button>
                    );
                  })}
                </div>
                {dashboardLockedCount > 0 && (
                  <div className="rounded-lg border border-white/15 bg-white/5 p-3 text-xs text-white/70">
                    {dashboardLockedCount} dashboard theme locked on your current plan.
                    <Link
                      href="/platform/pricing"
                      className="ml-1 font-semibold text-[#ccff00] underline-offset-2 hover:underline"
                    >
                      Upgrade to unlock.
                    </Link>
                  </div>
                )}
              </section>

              <div className="flex gap-3">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setStep("branding")}
                  className="border-white/20 text-white hover:bg-white/10"
                >
                  Back
                </Button>
                <Button
                  type="button"
                  className="bg-[#ccff00] font-semibold text-black hover:bg-[#b8e600]"
                  onClick={() => setStep("review")}
                >
                  Continue
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {step === "review" && (
          <Card className="border-white/10 bg-white/5 text-white">
            <CardHeader>
              <CardTitle className="font-heading text-xl">Review</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-3">
                <div className="flex justify-between border-b border-white/10 py-2">
                  <span className="text-white/60">Brand Name</span>
                  <span className="font-semibold">{brandName}</span>
                </div>
                <div className="flex justify-between border-b border-white/10 py-2">
                  <span className="text-white/60">Site URL</span>
                  <span className="font-semibold">{subdomain}.coachsite.com</span>
                </div>
                <div className="flex justify-between border-b border-white/10 py-2">
                  <span className="text-white/60">Landing Theme</span>
                  <span className="font-semibold">
                    {selectedLandingMeta?.name || selectedLandingTheme}
                  </span>
                </div>
                <div className="flex justify-between border-b border-white/10 py-2">
                  <span className="text-white/60">Dashboard Theme</span>
                  <span className="font-semibold">
                    {selectedDashboardMeta?.name || `Theme ${selectedDashboardTheme}`}
                  </span>
                </div>
                <div className="flex justify-between border-b border-white/10 py-2">
                  <span className="text-white/60">Plan</span>
                  <span className="font-semibold">{planId}</span>
                </div>
              </div>

              <div className="flex gap-3">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setStep("themes")}
                  className="border-white/20 text-white hover:bg-white/10"
                >
                  Back
                </Button>
                <Button
                  type="button"
                  onClick={handleSubmit}
                  disabled={loading}
                  className="flex-1 bg-[#ccff00] font-semibold text-black hover:bg-[#b8e600]"
                >
                  {loading ? "Creating Site..." : "Create My Site"}
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {step === "complete" && (
          <Card className="border-white/10 bg-white/5 text-white">
            <CardContent className="space-y-8 pb-8 pt-8">
              <div className="text-center">
                <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-[#ccff00]/20">
                  <svg
                    className="h-8 w-8 text-[#ccff00]"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2.5}
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <h2 className="font-heading text-2xl font-bold">Your Site Is Ready</h2>
                <p className="mt-2 text-sm text-white/50">
                  {brandName} has been created successfully.
                </p>
              </div>

              <div className="space-y-3 rounded-xl bg-white/5 p-4">
                <p className="text-sm text-white/50">Site URL</p>
                <div className="flex items-center gap-2">
                  <code className="flex-1 break-all rounded-lg bg-black/30 px-4 py-3 font-mono text-sm text-[#ccff00]">
                    {typeof window !== "undefined" && window.location.hostname !== "localhost"
                      ? `${createdSubdomain}.coachsite.com`
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
                          ? `https://${createdSubdomain}.coachsite.com`
                          : `${window.location.protocol}//${window.location.host}/site/${createdSubdomain}`;
                      navigator.clipboard.writeText(url);
                      setLinkCopied(true);
                      setTimeout(() => setLinkCopied(false), 2000);
                    }}
                  >
                    {linkCopied ? "Copied" : "Copy"}
                  </Button>
                </div>
              </div>

              <div className="space-y-3">
                <Link href={`/site/${createdSubdomain}/auth?tab=coach`} className="block">
                  <Button className="w-full bg-[#ccff00] font-semibold text-black hover:bg-[#b8e600]">
                    Open Coach Dashboard
                  </Button>
                </Link>
                <Link href={`/site/${createdSubdomain}`} className="block">
                  <Button
                    variant="outline"
                    className="w-full border-white/20 text-white hover:bg-white/10"
                  >
                    Open Landing Page
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
