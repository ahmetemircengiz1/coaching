"use client";

import { useState, useCallback, useEffect, useRef } from "react";
import { ChevronUp, ChevronDown, Lock } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { updateCoachSettings } from "../actions";
import { notifyPreviewRefresh } from "@/src/lib/preview-bus";
import {
  type SectionConfig,
  type LandingConfig,
  type NavbarVariant,
  SECTION_LABELS,
  ALWAYS_ENABLED_SECTIONS,
  SECTION_VARIANT_COUNT,
  VARIANT_LABELS,
  DEFAULT_SECTIONS,
  NAVBAR_VARIANTS,
  NAVBAR_VARIANT_LABELS,
  NAVBAR_VARIANT_DESCRIPTIONS,
  DEFAULT_NAVBAR_BY_THEME,
  resolveLandingConfig,
} from "@/src/components/landing/config";
import type { LandingFeatures } from "@/src/lib/plan";

interface LandingPageSettingsProps {
  domain: string;
  initialLandingConfig: unknown;
  features: LandingFeatures;
  themeId: string;
  onSaved?: (saved: { landingConfig?: unknown }) => void;
}

export function LandingPageSettings({
  domain,
  initialLandingConfig,
  features,
  themeId,
  onSaved,
}: LandingPageSettingsProps) {
  const resolved = resolveLandingConfig(initialLandingConfig);
  const themeDefaultNavbar = DEFAULT_NAVBAR_BY_THEME[themeId] || "strip";
  const [sections, setSections] = useState<SectionConfig[]>(resolved.sections);
  const [navbarVariant, setNavbarVariant] = useState<NavbarVariant>(
    resolved.navbarVariant || themeDefaultNavbar,
  );
  const [saving, setSaving] = useState(false);
  const debounceRef = useRef<ReturnType<typeof setTimeout>>(null);
  const initialSectionsRef = useRef(JSON.stringify(resolved.sections));
  const initialNavbarRef = useRef<NavbarVariant>(resolved.navbarVariant || themeDefaultNavbar);

  // Debounced silent save when sections / navbar change
  useEffect(() => {
    const sectionsChanged = JSON.stringify(sections) !== initialSectionsRef.current;
    const navbarChanged = navbarVariant !== initialNavbarRef.current;
    if (!sectionsChanged && !navbarChanged) return;

    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(async () => {
      const landingConfig: LandingConfig = { sections, navbarVariant };
      await updateCoachSettings(domain, {
        landingConfig: landingConfig as unknown as Record<string, unknown>,
      });
      initialSectionsRef.current = JSON.stringify(sections);
      initialNavbarRef.current = navbarVariant;
      onSaved?.({ landingConfig });
      notifyPreviewRefresh();
    }, 1500);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sections, navbarVariant]);

  const moveSection = useCallback((index: number, direction: -1 | 1) => {
    setSections((prev) => {
      const next = [...prev];
      const target = index + direction;
      if (target < 0 || target >= next.length) return prev;
      [next[index], next[target]] = [next[target], next[index]];
      return next;
    });
  }, []);

  const toggleSection = useCallback((index: number) => {
    setSections((prev) => {
      const next = [...prev];
      const section = next[index];
      if (ALWAYS_ENABLED_SECTIONS.includes(section.id)) return prev;
      next[index] = { ...section, enabled: !section.enabled };
      return next;
    });
  }, []);

  const changeVariant = useCallback((index: number, variant: number) => {
    setSections((prev) => {
      const next = [...prev];
      next[index] = { ...next[index], variant };
      return next;
    });
  }, []);

  const handleSave = async () => {
    setSaving(true);
    const landingConfig: LandingConfig = { sections, navbarVariant };
    const result = await updateCoachSettings(domain, {
      landingConfig: landingConfig as unknown as Record<string, unknown>,
    });
    if (result?.success === false) {
      toast.error("error" in result ? (result as { error: string }).error : "Kaydetme hatasi");
    } else {
      toast.success("Landing sayfa ayarlari kaydedildi.");
      initialSectionsRef.current = JSON.stringify(sections);
      initialNavbarRef.current = navbarVariant;
      onSaved?.({ landingConfig });
      notifyPreviewRefresh();
    }
    setSaving(false);
  };

  const handleReset = () => {
    setSections([...DEFAULT_SECTIONS]);
    setNavbarVariant(themeDefaultNavbar);
  };

  return (
    <div className="space-y-6">
      {/* Navbar variant picker */}
      <Card style={{ backgroundColor: "var(--dashboard-card-bg)", borderColor: "var(--dashboard-card-border)", color: "var(--dashboard-main-text)" }}>
        <CardHeader>
          <CardTitle className="text-lg">Navbar Tasarimi</CardTitle>
          <p className="text-sm" style={{ color: "var(--dashboard-main-text-muted)" }}>
            Sitenizin ust kisminda gozukecek navigasyon cubugunun stilini secin. Secim temadan bagimsizdir.
          </p>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
            {NAVBAR_VARIANTS.map((v) => {
              const active = navbarVariant === v;
              return (
                <button
                  key={v}
                  type="button"
                  onClick={() => setNavbarVariant(v)}
                  className="flex flex-col items-start gap-2 rounded-lg border p-3 text-left transition"
                  style={{
                    borderColor: active ? "var(--dashboard-accent)" : "var(--dashboard-card-border)",
                    backgroundColor: active
                      ? "color-mix(in srgb, var(--dashboard-accent) 8%, var(--dashboard-card-bg))"
                      : "var(--dashboard-main-bg)",
                  }}
                >
                  <NavbarVariantPreview variant={v} active={active} />
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-semibold">{NAVBAR_VARIANT_LABELS[v]}</span>
                    {v === themeDefaultNavbar && (
                      <span className="text-[10px] px-1.5 py-0.5 rounded-full" style={{ backgroundColor: "var(--dashboard-main-bg)", border: "1px solid var(--dashboard-card-border)", color: "var(--dashboard-main-text-muted)" }}>
                        Tema varsayilani
                      </span>
                    )}
                  </div>
                  <span className="text-xs" style={{ color: "var(--dashboard-main-text-muted)" }}>
                    {NAVBAR_VARIANT_DESCRIPTIONS[v]}
                  </span>
                </button>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Section ordering */}
      <Card style={{ backgroundColor: "var(--dashboard-card-bg)", borderColor: "var(--dashboard-card-border)", color: "var(--dashboard-main-text)" }}>
        <CardHeader>
          <CardTitle className="text-lg">Landing Sayfa Bolumleri</CardTitle>
          <p className="text-sm" style={{ color: "var(--dashboard-main-text-muted)" }}>
            Bolumleri siralayabilir, acip kapatabilir ve varyant secebilirsiniz.
          </p>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {sections.map((section, index) => {
              const isAlwaysEnabled = ALWAYS_ENABLED_SECTIONS.includes(section.id);
              const variantCount = Math.min(SECTION_VARIANT_COUNT[section.id] || 1, features.maxVariant);
              const allLabels = VARIANT_LABELS[section.id] || [];
              const isFAQ = section.id === "faq";
              const faqLocked = isFAQ && !features.canEnableFAQ;
              const toggleDisabled = isAlwaysEnabled || !features.canToggleSections || faqLocked;

              return (
                <div
                  key={section.id}
                  className="flex items-center gap-3 rounded-lg border px-4 py-3 transition"
                  style={{
                    borderColor: section.enabled && !faqLocked ? "var(--dashboard-accent)" : "var(--dashboard-card-border)",
                    backgroundColor: section.enabled && !faqLocked
                      ? "color-mix(in srgb, var(--dashboard-accent) 5%, var(--dashboard-card-bg))"
                      : "var(--dashboard-main-bg)",
                    opacity: section.enabled && !faqLocked ? 1 : 0.6,
                  }}
                >
                  {/* Checkbox */}
                  <label className="flex items-center gap-2 cursor-pointer select-none min-w-[140px]">
                    <input
                      type="checkbox"
                      checked={section.enabled && !faqLocked}
                      disabled={toggleDisabled}
                      onChange={() => toggleSection(index)}
                      className="h-4 w-4 rounded accent-[var(--dashboard-accent)]"
                    />
                    <span className="text-sm font-medium">{SECTION_LABELS[section.id]}</span>
                    {isAlwaysEnabled && (
                      <span className="text-[10px] px-1.5 py-0.5 rounded-full" style={{ backgroundColor: "var(--dashboard-accent)", color: "var(--dashboard-accent-text)" }}>
                        Zorunlu
                      </span>
                    )}
                    {faqLocked && (
                      <span className="inline-flex items-center gap-1 text-[10px] px-1.5 py-0.5 rounded-full" style={{ backgroundColor: "var(--dashboard-main-bg)", border: "1px solid var(--dashboard-card-border)", color: "var(--dashboard-main-text-muted)" }}>
                        <Lock className="h-2.5 w-2.5" /> PRO
                      </span>
                    )}
                    {!features.canToggleSections && !isAlwaysEnabled && !faqLocked && (
                      <Lock className="h-3 w-3" style={{ color: "var(--dashboard-main-text-muted)" }} />
                    )}
                  </label>

                  {/* Variant dropdown */}
                  {variantCount > 1 && (
                    <select
                      value={Math.min(section.variant, variantCount)}
                      onChange={(e) => changeVariant(index, Number(e.target.value))}
                      className="rounded-md px-2 py-1 text-xs"
                      style={{
                        border: "1px solid var(--dashboard-card-border)",
                        backgroundColor: "var(--dashboard-main-bg)",
                        color: "var(--dashboard-main-text)",
                      }}
                    >
                      {Array.from({ length: variantCount }, (_, i) => i + 1).map((v) => (
                        <option key={v} value={v}>
                          {allLabels[v - 1] || `Varyant ${v}`}
                        </option>
                      ))}
                    </select>
                  )}
                  {variantCount <= 1 && (SECTION_VARIANT_COUNT[section.id] || 1) > 1 && (
                    <span className="inline-flex items-center gap-1 text-[10px] px-1.5 py-0.5 rounded" style={{ color: "var(--dashboard-main-text-muted)" }}>
                      <Lock className="h-2.5 w-2.5" /> Varyantlar PRO+
                    </span>
                  )}

                  {/* Spacer */}
                  <div className="flex-1" />

                  {/* Move buttons */}
                  <div className="flex items-center gap-1">
                    <button
                      type="button"
                      onClick={() => moveSection(index, -1)}
                      disabled={index === 0 || !features.canReorderSections}
                      className="rounded p-1 transition hover:opacity-80 disabled:opacity-30"
                      style={{ color: "var(--dashboard-main-text-muted)" }}
                    >
                      <ChevronUp className="h-4 w-4" />
                    </button>
                    <button
                      type="button"
                      onClick={() => moveSection(index, 1)}
                      disabled={index === sections.length - 1 || !features.canReorderSections}
                      className="rounded p-1 transition hover:opacity-80 disabled:opacity-30"
                      style={{ color: "var(--dashboard-main-text-muted)" }}
                    >
                      <ChevronDown className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

          {!features.canReorderSections && (
            <div className="mt-3 flex items-center gap-2 rounded-lg border p-3 text-xs" style={{ borderColor: "var(--dashboard-card-border)", backgroundColor: "var(--dashboard-main-bg)", color: "var(--dashboard-main-text-muted)" }}>
              <Lock className="h-3.5 w-3.5 flex-shrink-0" />
              Bolum siralama ve acma/kapama ozellikleri PRO ve ustu planlarda kullanilabilir.
            </div>
          )}
        </CardContent>
      </Card>

      {/* Actions */}
      <div className="flex items-center gap-3">
        <Button
          onClick={handleSave}
          disabled={saving}
          style={{
            backgroundColor: "var(--dashboard-accent)",
            color: "var(--dashboard-accent-text)",
          }}
          className="font-semibold hover:opacity-90"
        >
          {saving ? "Kaydediliyor..." : "Kaydet"}
        </Button>
        <Button
          onClick={handleReset}
          variant="outline"
          style={{
            borderColor: "var(--dashboard-card-border)",
            color: "var(--dashboard-main-text)",
            backgroundColor: "transparent",
          }}
        >
          Varsayilana Sifirla
        </Button>
      </div>
    </div>
  );
}

function NavbarVariantPreview({ variant, active }: { variant: NavbarVariant; active: boolean }) {
  const accent = active ? "var(--dashboard-accent)" : "var(--dashboard-main-text-muted)";
  const subtle = active ? "var(--dashboard-accent)" : "var(--dashboard-card-border)";
  const bg = "var(--dashboard-main-bg)";
  const pageBg = active
    ? "color-mix(in srgb, var(--dashboard-accent) 6%, var(--dashboard-card-bg))"
    : "var(--dashboard-card-bg)";

  if (variant === "strip") {
    return (
      <div className="w-full h-14 rounded-md relative overflow-hidden" style={{ backgroundColor: pageBg, border: `1px solid ${subtle}` }}>
        <div className="absolute top-0 inset-x-0 h-5 flex items-center justify-between px-2" style={{ backgroundColor: bg, borderBottom: `1px solid ${subtle}` }}>
          <div className="h-1.5 w-6 rounded-sm" style={{ backgroundColor: accent }} />
          <div className="flex items-center gap-1">
            <div className="h-1 w-4 rounded-sm" style={{ backgroundColor: subtle }} />
            <div className="h-1 w-4 rounded-sm" style={{ backgroundColor: subtle }} />
            <div className="h-1 w-4 rounded-sm" style={{ backgroundColor: subtle }} />
          </div>
          <div className="h-2 w-6 rounded-sm" style={{ backgroundColor: accent }} />
        </div>
      </div>
    );
  }

  if (variant === "pill") {
    return (
      <div className="w-full h-14 rounded-md relative overflow-hidden" style={{ backgroundColor: pageBg, border: `1px solid ${subtle}` }}>
        <div className="absolute top-1.5 left-2 right-2 h-5 rounded-full flex items-center justify-between px-2" style={{ backgroundColor: bg, border: `1px solid ${subtle}` }}>
          <div className="h-1.5 w-5 rounded-sm" style={{ backgroundColor: accent }} />
          <div className="flex items-center gap-1">
            <div className="h-1 w-3 rounded-sm" style={{ backgroundColor: subtle }} />
            <div className="h-1 w-3 rounded-sm" style={{ backgroundColor: subtle }} />
            <div className="h-1 w-3 rounded-sm" style={{ backgroundColor: subtle }} />
          </div>
          <div className="h-2 w-5 rounded-full" style={{ backgroundColor: accent }} />
        </div>
      </div>
    );
  }

  // integrated
  return (
    <div className="w-full h-14 rounded-md relative overflow-hidden" style={{ backgroundColor: pageBg, border: `1px solid ${subtle}` }}>
      <div className="absolute top-1.5 inset-x-2 h-5 flex items-center justify-between">
        <div className="flex items-center gap-1">
          <div className="h-3 w-3 rounded-sm" style={{ backgroundColor: accent }} />
          <div className="flex flex-col gap-0.5">
            <div className="h-1 w-5 rounded-sm" style={{ backgroundColor: accent }} />
            <div className="h-0.5 w-4 rounded-sm" style={{ backgroundColor: subtle }} />
          </div>
        </div>
        <div className="flex items-center gap-1">
          <div className="h-1 w-3 rounded-sm" style={{ backgroundColor: subtle }} />
          <div className="h-1 w-3 rounded-sm" style={{ backgroundColor: subtle }} />
          <div className="h-1 w-3 rounded-sm" style={{ backgroundColor: subtle }} />
        </div>
        <div className="h-2 w-6 rounded-sm" style={{ backgroundColor: bg, border: `1px solid ${accent}` }} />
      </div>
      <div className="absolute bottom-1 left-2 right-2 h-1 rounded-sm" style={{ backgroundColor: subtle, opacity: 0.5 }} />
    </div>
  );
}
