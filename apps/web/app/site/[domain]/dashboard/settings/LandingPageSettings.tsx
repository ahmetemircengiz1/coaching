"use client";

import { useState, useCallback, useEffect, useRef } from "react";
import { ChevronUp, ChevronDown } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { updateCoachSettings } from "../actions";
import {
  type SectionConfig,
  type LandingConfig,
  SECTION_LABELS,
  ALWAYS_ENABLED_SECTIONS,
  SECTION_VARIANT_COUNT,
  VARIANT_LABELS,
  DEFAULT_SECTIONS,
  resolveLandingConfig,
} from "@/src/components/landing/config";
import { FONT_OPTIONS, getFontById, DEFAULT_HEADING_FONT, DEFAULT_BODY_FONT } from "@/src/theme/fonts";
import type { LandingFeatures } from "@/src/lib/plan";
import { Lock } from "lucide-react";

interface LandingPageSettingsProps {
  domain: string;
  initialLandingConfig: unknown;
  initialHeadingFont: string | null;
  initialBodyFont: string | null;
  features: LandingFeatures;
  onSaved?: () => void;
}

export function LandingPageSettings({
  domain,
  initialLandingConfig,
  initialHeadingFont,
  initialBodyFont,
  features,
  onSaved,
}: LandingPageSettingsProps) {
  const resolved = resolveLandingConfig(initialLandingConfig);
  const [sections, setSections] = useState<SectionConfig[]>(resolved.sections);
  const [headingFont, setHeadingFont] = useState(initialHeadingFont || DEFAULT_HEADING_FONT);
  const [bodyFont, setBodyFont] = useState(initialBodyFont || DEFAULT_BODY_FONT);
  const [saving, setSaving] = useState(false);
  const debounceRef = useRef<ReturnType<typeof setTimeout>>(null);
  const mountedRef = useRef(false);

  // Auto-preview: debounced silent save when sections, fonts change
  useEffect(() => {
    if (!mountedRef.current) {
      mountedRef.current = true;
      return;
    }
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(async () => {
      const landingConfig: LandingConfig = { sections };
      await updateCoachSettings(domain, {
        landingConfig: landingConfig as unknown as Record<string, unknown>,
        headingFont,
        bodyFont,
      });
      onSaved?.();
    }, 600);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sections, headingFont, bodyFont]);

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
    const landingConfig: LandingConfig = { sections };
    const result = await updateCoachSettings(domain, {
      landingConfig: landingConfig as unknown as Record<string, unknown>,
      headingFont,
      bodyFont,
    });
    if (result?.success === false) {
      toast.error("error" in result ? (result as { error: string }).error : "Kaydetme hatasi");
    } else {
      toast.success("Landing sayfa ayarlari kaydedildi.");
      onSaved?.();
    }
    setSaving(false);
  };

  const handleReset = () => {
    setSections([...DEFAULT_SECTIONS]);
    setHeadingFont(DEFAULT_HEADING_FONT);
    setBodyFont(DEFAULT_BODY_FONT);
  };

  return (
    <div className="space-y-6">
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

      {/* Font selection */}
      <Card style={{ backgroundColor: "var(--dashboard-card-bg)", borderColor: "var(--dashboard-card-border)", color: "var(--dashboard-main-text)", opacity: features.canSelectFonts ? 1 : 0.7 }}>
        <CardHeader>
          <div className="flex items-center gap-2">
            <CardTitle className="text-lg">Fontlar</CardTitle>
            {!features.canSelectFonts && (
              <span className="inline-flex items-center gap-1 text-[10px] px-2 py-0.5 rounded-full" style={{ backgroundColor: "var(--dashboard-main-bg)", border: "1px solid var(--dashboard-card-border)", color: "var(--dashboard-main-text-muted)" }}>
                <Lock className="h-2.5 w-2.5" /> PRO
              </span>
            )}
          </div>
          <p className="text-sm" style={{ color: "var(--dashboard-main-text-muted)" }}>
            Landing sayfaniz icin baslik ve metin fontu secin.
          </p>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            {/* Heading font */}
            <div>
              <label className="mb-1.5 block text-sm font-medium">Baslik Fontu</label>
              <select
                value={headingFont}
                onChange={(e) => setHeadingFont(e.target.value)}
                disabled={!features.canSelectFonts}
                className="w-full rounded-md px-3 py-2 text-sm disabled:opacity-50"
                style={{
                  border: "1px solid var(--dashboard-card-border)",
                  backgroundColor: "var(--dashboard-main-bg)",
                  color: "var(--dashboard-main-text)",
                }}
              >
                {FONT_OPTIONS.map((font) => (
                  <option key={font.id} value={font.id}>
                    {font.name} ({font.category})
                  </option>
                ))}
              </select>
              <div
                className="mt-2 rounded-md border px-3 py-2 text-lg font-bold"
                style={{
                  borderColor: "var(--dashboard-card-border)",
                  backgroundColor: "var(--dashboard-main-bg)",
                  fontFamily: `"${getFontById(headingFont)?.name || "Inter"}", sans-serif`,
                }}
              >
                Aa Bb Cc 123
              </div>
            </div>

            {/* Body font */}
            <div>
              <label className="mb-1.5 block text-sm font-medium">Metin Fontu</label>
              <select
                value={bodyFont}
                onChange={(e) => setBodyFont(e.target.value)}
                disabled={!features.canSelectFonts}
                className="w-full rounded-md px-3 py-2 text-sm disabled:opacity-50"
                style={{
                  border: "1px solid var(--dashboard-card-border)",
                  backgroundColor: "var(--dashboard-main-bg)",
                  color: "var(--dashboard-main-text)",
                }}
              >
                {FONT_OPTIONS.map((font) => (
                  <option key={font.id} value={font.id}>
                    {font.name} ({font.category})
                  </option>
                ))}
              </select>
              <div
                className="mt-2 rounded-md border px-3 py-2 text-sm"
                style={{
                  borderColor: "var(--dashboard-card-border)",
                  backgroundColor: "var(--dashboard-main-bg)",
                  fontFamily: `"${getFontById(bodyFont)?.name || "Inter"}", sans-serif`,
                }}
              >
                Lorem ipsum dolor sit amet, consectetur adipiscing elit.
              </div>
            </div>
          </div>
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
