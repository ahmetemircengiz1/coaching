"use client";

import { useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { updateCoachSettings } from "../actions";
import { notifyPreviewRefresh } from "@/src/lib/preview-bus";
import type { SocialLinks } from "@/src/components/landing/config";
import { Lock } from "lucide-react";

const PLATFORMS = [
  { key: "instagram" as const, label: "Instagram", placeholder: "https://instagram.com/kullaniciadi", icon: "IG", domain: "instagram.com" },
  { key: "youtube" as const, label: "YouTube", placeholder: "https://youtube.com/@kanaladi", icon: "YT", domain: "youtube.com" },
  { key: "tiktok" as const, label: "TikTok", placeholder: "https://tiktok.com/@kullaniciadi", icon: "TT", domain: "tiktok.com" },
  { key: "twitter" as const, label: "Twitter / X", placeholder: "https://x.com/kullaniciadi", icon: "X", domain: "twitter.com|x.com" },
  { key: "facebook" as const, label: "Facebook", placeholder: "https://facebook.com/sayfaadi", icon: "FB", domain: "facebook.com|fb.com" },
  { key: "linkedin" as const, label: "LinkedIn", placeholder: "https://linkedin.com/in/kullaniciadi", icon: "LI", domain: "linkedin.com" },
];

function normalizeUrl(input: string): string | null {
  const v = input.trim();
  if (!v) return "";
  // Eğer http(s):// yoksa ekle
  const withProto = /^https?:\/\//i.test(v) ? v : `https://${v}`;
  try {
    const u = new URL(withProto);
    if (u.hostname.length < 3 || !u.hostname.includes(".")) return null;
    return u.toString();
  } catch {
    return null;
  }
}

function validatePlatformUrl(value: string, allowedDomain: string): { ok: true; normalized: string } | { ok: false; error: string } {
  if (!value || !value.trim()) return { ok: true, normalized: "" };
  const normalized = normalizeUrl(value);
  if (!normalized) return { ok: false, error: "Geçerli bir URL girin (ör. https://instagram.com/...)" };
  try {
    const host = new URL(normalized).hostname.toLowerCase().replace(/^www\./, "");
    const allowed = allowedDomain.split("|").map((d) => d.toLowerCase());
    const matches = allowed.some((d) => host === d || host.endsWith(`.${d}`));
    if (!matches) return { ok: false, error: `URL ${allowed.join(" / ")} alanından olmalı` };
  } catch {
    return { ok: false, error: "Geçersiz URL" };
  }
  return { ok: true, normalized };
}

interface SocialLinksSettingsProps {
  domain: string;
  initialSocialLinks: unknown;
  initialWhatsappNumber: string | null;
  maxLinks: number;
}

export function SocialLinksSettings({ domain, initialSocialLinks, initialWhatsappNumber, maxLinks }: SocialLinksSettingsProps) {
  const initial = (initialSocialLinks && typeof initialSocialLinks === "object" ? initialSocialLinks : {}) as SocialLinks;
  const [links, setLinks] = useState<SocialLinks>({
    instagram: initial.instagram || "",
    youtube: initial.youtube || "",
    tiktok: initial.tiktok || "",
    twitter: initial.twitter || "",
    facebook: initial.facebook || "",
    linkedin: initial.linkedin || "",
  });
  const [whatsappNumber, setWhatsappNumber] = useState(initialWhatsappNumber || "");
  const [saving, setSaving] = useState(false);
  const [savingWhatsapp, setSavingWhatsapp] = useState(false);
  const [errors, setErrors] = useState<Partial<Record<keyof SocialLinks, string>>>({});

  const handleChange = (key: keyof SocialLinks, value: string) => {
    setLinks((prev) => ({ ...prev, [key]: value }));
    // Anlık doğrulama
    const platform = PLATFORMS.find((p) => p.key === key);
    if (!platform) return;
    const result = validatePlatformUrl(value, platform.domain);
    setErrors((prev) => ({ ...prev, [key]: result.ok ? undefined : result.error }));
  };

  const handleSave = async () => {
    // Tüm doğrulamaları yeniden çalıştır
    const newErrors: Partial<Record<keyof SocialLinks, string>> = {};
    const cleaned: Record<string, string> = {};
    for (const platform of PLATFORMS) {
      const value = links[platform.key] || "";
      const result = validatePlatformUrl(value, platform.domain);
      if (!result.ok) {
        newErrors[platform.key] = result.error;
      } else if (result.normalized) {
        cleaned[platform.key] = result.normalized;
      }
    }
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      toast.error("Lütfen geçersiz URL'leri düzeltin.");
      return;
    }
    setErrors({});

    setSaving(true);
    const socialLinks = Object.keys(cleaned).length > 0 ? cleaned : null;
    const result = await updateCoachSettings(domain, {
      socialLinks,
    });
    if (result?.success === false) {
      toast.error("Sosyal medya linkleri kaydedilemedi.");
    } else {
      toast.success("Sosyal medya linkleri kaydedildi.");
      notifyPreviewRefresh();
    }
    setSaving(false);
  };

  const handleSaveWhatsapp = async () => {
    setSavingWhatsapp(true);
    const cleaned = whatsappNumber.replace(/[^+\d]/g, "").trim();
    const result = await updateCoachSettings(domain, {
      whatsappNumber: cleaned || null,
    });
    if (result?.success === false) {
      toast.error("WhatsApp numarasi kaydedilemedi.");
    } else {
      toast.success("WhatsApp numarasi kaydedildi.");
      notifyPreviewRefresh();
    }
    setSavingWhatsapp(false);
  };

  return (
    <div className="space-y-6">
      {/* WhatsApp */}
      <Card style={{ backgroundColor: "var(--dashboard-card-bg)", borderColor: "var(--dashboard-card-border)", color: "var(--dashboard-main-text)" }}>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <span className="flex h-7 w-7 items-center justify-center rounded-lg text-xs font-bold" style={{ backgroundColor: "#25D366", color: "#fff" }}>WA</span>
            WhatsApp Iletisim
          </CardTitle>
          <p className="text-sm" style={{ color: "var(--dashboard-main-text-muted)" }}>
            Ogrencilerin ve ziyaretcilerin sizinle dogrudan iletisime gecebilmesi icin WhatsApp numaranizi ekleyin.
            Landing sayfanizda ve ogrenci panelinde WhatsApp butonu gorunecektir.
          </p>
        </CardHeader>
        <CardContent className="space-y-3">
          <div>
            <label className="mb-1 block text-xs font-medium" style={{ color: "var(--dashboard-main-text-muted)" }}>
              Telefon Numarasi (ulke kodu dahil)
            </label>
            <Input
              value={whatsappNumber}
              onChange={(e) => setWhatsappNumber(e.target.value)}
              placeholder="+905xxxxxxxxx"
              style={{
                borderColor: "var(--dashboard-card-border)",
                backgroundColor: "var(--dashboard-main-bg)",
                color: "var(--dashboard-main-text)",
              }}
            />
            <p className="text-xs mt-1" style={{ color: "var(--dashboard-main-text-muted)" }}>
              Ornek: +905321234567 — Ulke kodu ile baslayan tam numara girin.
            </p>
          </div>
          <Button
            onClick={handleSaveWhatsapp}
            disabled={savingWhatsapp}
            size="sm"
            style={{
              backgroundColor: "#25D366",
              color: "#fff",
            }}
            className="font-semibold hover:opacity-90"
          >
            {savingWhatsapp ? "Kaydediliyor..." : "WhatsApp Numarasini Kaydet"}
          </Button>
        </CardContent>
      </Card>

      {/* Sosyal Medya */}
      <Card style={{ backgroundColor: "var(--dashboard-card-bg)", borderColor: "var(--dashboard-card-border)", color: "var(--dashboard-main-text)" }}>
        <CardHeader>
          <CardTitle className="text-lg">Sosyal Medya Linkleri</CardTitle>
          <p className="text-sm" style={{ color: "var(--dashboard-main-text-muted)" }}>
            Landing sayfanizin navbar ve footer alaninda gorunecek sosyal medya hesaplariniz.
          </p>
        </CardHeader>
        <CardContent className="space-y-4">
          {PLATFORMS.map((platform, index) => {
            const isLocked = index >= maxLinks;
            return (
              <div key={platform.key} className="flex items-center gap-3" style={{ opacity: isLocked ? 0.5 : 1 }}>
                <div
                  className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-lg text-xs font-bold"
                  style={{
                    backgroundColor: "var(--dashboard-main-bg)",
                    border: "1px solid var(--dashboard-card-border)",
                    color: "var(--dashboard-main-text-muted)",
                  }}
                >
                  {platform.icon}
                </div>
                <div className="flex-1">
                  <label className="mb-1 flex items-center gap-1.5 text-xs font-medium" style={{ color: "var(--dashboard-main-text-muted)" }}>
                    {platform.label}
                    {isLocked && (
                      <span className="inline-flex items-center gap-0.5 text-[10px] px-1.5 py-0.5 rounded-full" style={{ backgroundColor: "var(--dashboard-main-bg)", border: "1px solid var(--dashboard-card-border)" }}>
                        <Lock className="h-2.5 w-2.5" /> PRO
                      </span>
                    )}
                  </label>
                  <Input
                    value={links[platform.key] || ""}
                    onChange={(e) => handleChange(platform.key, e.target.value)}
                    placeholder={platform.placeholder}
                    disabled={isLocked}
                    style={{
                      borderColor: errors[platform.key] ? "#ef4444" : "var(--dashboard-card-border)",
                      backgroundColor: "var(--dashboard-main-bg)",
                      color: "var(--dashboard-main-text)",
                    }}
                  />
                  {errors[platform.key] && (
                    <p className="mt-1 text-xs" style={{ color: "#ef4444" }}>
                      {errors[platform.key]}
                    </p>
                  )}
                </div>
              </div>
            );
          })}
        </CardContent>
      </Card>

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
    </div>
  );
}
