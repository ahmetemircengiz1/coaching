"use client";

import { useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { updateCoachSettings } from "../actions";
import type { SocialLinks } from "@/src/components/landing/config";
import { Lock } from "lucide-react";

const PLATFORMS = [
  { key: "instagram" as const, label: "Instagram", placeholder: "https://instagram.com/kullaniciadi", icon: "IG" },
  { key: "youtube" as const, label: "YouTube", placeholder: "https://youtube.com/@kanaladi", icon: "YT" },
  { key: "tiktok" as const, label: "TikTok", placeholder: "https://tiktok.com/@kullaniciadi", icon: "TT" },
  { key: "twitter" as const, label: "Twitter / X", placeholder: "https://x.com/kullaniciadi", icon: "X" },
  { key: "facebook" as const, label: "Facebook", placeholder: "https://facebook.com/sayfaadi", icon: "FB" },
  { key: "linkedin" as const, label: "LinkedIn", placeholder: "https://linkedin.com/in/kullaniciadi", icon: "LI" },
];

interface SocialLinksSettingsProps {
  domain: string;
  initialSocialLinks: unknown;
  maxLinks: number;
}

export function SocialLinksSettings({ domain, initialSocialLinks, maxLinks }: SocialLinksSettingsProps) {
  const initial = (initialSocialLinks && typeof initialSocialLinks === "object" ? initialSocialLinks : {}) as SocialLinks;
  const [links, setLinks] = useState<SocialLinks>({
    instagram: initial.instagram || "",
    youtube: initial.youtube || "",
    tiktok: initial.tiktok || "",
    twitter: initial.twitter || "",
    facebook: initial.facebook || "",
    linkedin: initial.linkedin || "",
  });
  const [saving, setSaving] = useState(false);

  const handleChange = (key: keyof SocialLinks, value: string) => {
    setLinks((prev) => ({ ...prev, [key]: value }));
  };

  const handleSave = async () => {
    setSaving(true);
    // Filter out empty strings
    const cleaned: Record<string, string> = {};
    for (const [key, value] of Object.entries(links)) {
      if (value && value.trim()) {
        cleaned[key] = value.trim();
      }
    }
    const socialLinks = Object.keys(cleaned).length > 0 ? cleaned : null;
    const result = await updateCoachSettings(domain, {
      socialLinks,
    });
    if (result?.success === false) {
      toast.error("Sosyal medya linkleri kaydedilemedi.");
    } else {
      toast.success("Sosyal medya linkleri kaydedildi.");
    }
    setSaving(false);
  };

  return (
    <div className="space-y-6">
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
                      borderColor: "var(--dashboard-card-border)",
                      backgroundColor: "var(--dashboard-main-bg)",
                      color: "var(--dashboard-main-text)",
                    }}
                  />
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
