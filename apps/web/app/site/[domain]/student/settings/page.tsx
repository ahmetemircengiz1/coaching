"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { Check, Bell } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DASHBOARD_THEME_LIST } from "@/src/theme/dashboardThemes";
import { DashboardThemePreview } from "@/src/components/theme-preview/DashboardThemePreview";
import { getStudentSettings, updateStudentSettings } from "../actions";

const SIDEBAR_POSITIONS = [
  { value: "bottom", label: "Alt", icon: "▼" },
  { value: "left", label: "Sol", icon: "◀" },
  { value: "right", label: "Sağ", icon: "▶" },
] as const;

export default function StudentSettingsPage() {
  const params = useParams();
  const domain = params.domain as string;

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState("");
  const [selectedThemeId, setSelectedThemeId] = useState(1);
  const [sidebarPosition, setSidebarPosition] = useState("bottom");
  const [availableThemeIds, setAvailableThemeIds] = useState<number[]>([1, 2, 3, 4, 5]);
  const [notifPrefs, setNotifPrefs] = useState({
    programAssigned: true,
    feedbackReceived: true,
    messageReceived: true,
  });

  useEffect(() => {
    async function load() {
      const settings = await getStudentSettings(domain);
      setSelectedThemeId(settings.dashboardThemeId);
      setSidebarPosition(settings.sidebarPosition);
      setAvailableThemeIds(settings.availableThemeIds);
      if (settings.notificationPrefs) setNotifPrefs(settings.notificationPrefs);
      setLoading(false);
    }
    load();
  }, [domain]);

  const showSuccess = (msg: string) => {
    setSuccess(msg);
    setTimeout(() => setSuccess(""), 2800);
  };

  const handleThemeChange = async (themeId: number) => {
    if (saving || themeId === selectedThemeId) return;
    setSaving(true);
    const prev = selectedThemeId;
    setSelectedThemeId(themeId);

    const result = await updateStudentSettings(domain, { dashboardThemeId: themeId });
    if (!result.success) {
      setSelectedThemeId(prev);
    } else {
      showSuccess("Tema güncellendi. Sayfayı yenileyince aktif olacak.");
    }
    setSaving(false);
  };

  const handleNotifToggle = async (key: keyof typeof notifPrefs) => {
    if (saving) return;
    setSaving(true);
    const prev = { ...notifPrefs };
    const updated = { ...notifPrefs, [key]: !notifPrefs[key] };
    setNotifPrefs(updated);

    const result = await updateStudentSettings(domain, { notificationPrefs: updated });
    if (!result.success) {
      setNotifPrefs(prev);
    } else {
      showSuccess("Bildirim tercihleri güncellendi.");
    }
    setSaving(false);
  };

  const handleLayoutChange = async (position: string) => {
    if (saving || position === sidebarPosition) return;
    setSaving(true);
    const prev = sidebarPosition;
    setSidebarPosition(position);

    const result = await updateStudentSettings(domain, { sidebarPosition: position });
    if (!result.success) {
      setSidebarPosition(prev);
    } else {
      showSuccess("Düzen güncellendi. Sayfayı yenileyince aktif olacak.");
    }
    setSaving(false);
  };

  const availableSet = new Set(availableThemeIds);

  if (loading) {
    return (
      <div className="space-y-5 py-6">
        <h1 className="font-heading text-xl font-bold">Ayarlar</h1>
        <div className="h-64 animate-pulse rounded-lg" style={{ backgroundColor: "var(--dashboard-card-bg)" }} />
      </div>
    );
  }

  return (
    <div className="space-y-5 py-6">
      <h1 className="font-heading text-xl font-bold">Ayarlar</h1>

      {success && (
        <div className="rounded-md border border-green-500/30 bg-green-500/10 p-3 text-sm text-green-300">
          {success}
        </div>
      )}

      {/* Tema Seçimi */}
      <Card style={{ backgroundColor: "var(--dashboard-card-bg)", borderColor: "var(--dashboard-card-border)" }}>
        <CardHeader>
          <CardTitle className="text-lg">Panel Teması</CardTitle>
          <p className="text-sm" style={{ color: "var(--dashboard-main-text-muted)" }}>
            Dashboard görünümünüzü özelleştirin.
          </p>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-3">
            {DASHBOARD_THEME_LIST.map((theme) => {
              const isAvailable = availableSet.has(theme.id);
              const isSelected = selectedThemeId === theme.id;

              return (
                <button
                  type="button"
                  key={theme.id}
                  onClick={() => isAvailable && handleThemeChange(theme.id)}
                  disabled={!isAvailable || saving}
                  className="relative overflow-hidden rounded-xl border text-left transition"
                  style={{
                    borderColor: isSelected ? "var(--dashboard-accent)" : "var(--dashboard-card-border)",
                    opacity: isAvailable ? 1 : 0.5,
                  }}
                >
                  <div className="relative">
                    <DashboardThemePreview theme={theme} />
                    {isSelected && (
                      <div
                        className="absolute right-2 top-2 flex h-6 w-6 items-center justify-center rounded-full"
                        style={{ backgroundColor: "var(--dashboard-accent)" }}
                      >
                        <Check className="h-3.5 w-3.5" style={{ color: "var(--dashboard-accent-text)" }} />
                      </div>
                    )}
                  </div>
                  <div className="p-2">
                    <p className="text-xs font-semibold">{theme.name}</p>
                  </div>
                </button>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Bildirim Tercihleri */}
      <Card style={{ backgroundColor: "var(--dashboard-card-bg)", borderColor: "var(--dashboard-card-border)" }}>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <Bell className="h-4 w-4" />
            Bildirim Tercihleri
          </CardTitle>
          <p className="text-sm" style={{ color: "var(--dashboard-main-text-muted)" }}>
            Hangi durumlarda bildirim almak istediğinizi seçin.
          </p>
        </CardHeader>
        <CardContent className="space-y-3">
          {([
            { key: "programAssigned" as const, label: "Program Atandığında", desc: "Koçunuz yeni bir program atadığında bildirim alın" },
            { key: "feedbackReceived" as const, label: "Geri Bildirim Geldiğinde", desc: "Check-in'inize koçunuz geri bildirim yazdığında" },
            { key: "messageReceived" as const, label: "Mesaj Geldiğinde", desc: "Koçunuzdan yeni mesaj geldiğinde" },
          ]).map((item) => (
            <div
              key={item.key}
              className="flex items-center justify-between p-3 rounded-lg"
              style={{ backgroundColor: "var(--dashboard-main-bg)" }}
            >
              <div>
                <p className="text-sm font-medium">{item.label}</p>
                <p className="text-xs" style={{ color: "var(--dashboard-main-text-muted)" }}>{item.desc}</p>
              </div>
              <button
                type="button"
                onClick={() => handleNotifToggle(item.key)}
                disabled={saving}
                className="relative w-10 h-6 rounded-full transition-colors"
                style={{
                  backgroundColor: notifPrefs[item.key]
                    ? "var(--dashboard-accent)"
                    : "var(--dashboard-card-border)",
                }}
                aria-label={`${item.label} bildirimi ${notifPrefs[item.key] ? "kapat" : "aç"}`}
              >
                <span
                  className="absolute top-1 left-1 w-4 h-4 rounded-full bg-white transition-transform"
                  style={{
                    transform: notifPrefs[item.key] ? "translateX(16px)" : "translateX(0)",
                  }}
                />
              </button>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Panel Düzeni */}
      <Card style={{ backgroundColor: "var(--dashboard-card-bg)", borderColor: "var(--dashboard-card-border)" }}>
        <CardHeader>
          <CardTitle className="text-lg">Panel Düzeni</CardTitle>
          <p className="text-sm" style={{ color: "var(--dashboard-main-text-muted)" }}>
            Navigasyon menüsünün konumu.
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
                  onClick={() => handleLayoutChange(pos.value)}
                  disabled={saving}
                  className="rounded-xl border p-3 text-center transition"
                  style={{
                    borderColor: isSelected ? "var(--dashboard-accent)" : "var(--dashboard-card-border)",
                    backgroundColor: isSelected ? "color-mix(in srgb, var(--dashboard-accent) 10%, var(--dashboard-card-bg))" : "var(--dashboard-main-bg)",
                  }}
                >
                  <div
                    className="w-full aspect-[4/3] rounded-lg border mb-2 relative overflow-hidden"
                    style={{ borderColor: "var(--dashboard-card-border)", backgroundColor: "var(--dashboard-card-bg)" }}
                  >
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
                  <p className="text-xs font-medium">{pos.label}</p>
                  {isSelected && (
                    <Check className="h-3.5 w-3.5 mx-auto mt-1" style={{ color: "var(--dashboard-accent)" }} />
                  )}
                </button>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
