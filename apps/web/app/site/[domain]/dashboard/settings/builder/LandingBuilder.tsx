"use client";

import React, { useEffect, useRef, useState } from "react";
import { useBuilderStore } from "./useBuilderStore";
import { useAutoSave } from "./useAutoSave";
import { useKeyboardShortcuts } from "./useKeyboardShortcuts";
import { Toolbar } from "./Toolbar";
import { SectionList } from "./SectionList";
import { SectionDrawer } from "./SectionDrawer";
import { ConflictBanner } from "./ConflictBanner";
import { LandingPreviewPanel } from "../LandingPreviewPanel";
import { DEFAULT_ELITE_CONFIG, type EliteLandingConfig } from "@/src/components/landing/elite-config";
import { getBlock } from "@/src/components/landing/blocks/manifest";

interface LandingBuilderProps {
  domain: string;
  initialConfig: EliteLandingConfig | null;
}

/**
 * Section Builder ana composition root'u. Sadece theme-elite (landingThemeId === 7)
 * koçları için yüklenir; diğerleri klasik LandingPageSettings görür.
 */
export function LandingBuilder({ domain, initialConfig }: LandingBuilderProps) {
  const config = useBuilderStore((s) => s.config);
  const setConfig = useBuilderStore((s) => s.setConfig);
  const selectSection = useBuilderStore((s) => s.selectSection);
  const setRequestedTab = useBuilderStore((s) => s.setRequestedTab);
  const selectedSectionId = useBuilderStore((s) => s.selectedSectionId);
  const initializedRef = useRef(false);

  // Mobilde 3 kolon alt alta yığılıp builder kullanılmaz hale geliyordu:
  // tek seferde tek panel göster, lg+ eski 3 kolonlu grid'e döner.
  const [mobilePane, setMobilePane] = useState<"sections" | "preview" | "editor">("sections");
  // Bir bölüm seçilince (listeden veya önizlemeye dokununca) editöre geç
  useEffect(() => {
    if (selectedSectionId) setMobilePane("editor");
  }, [selectedSectionId]);

  // Inline canvas-edit: preview iframe'den gelen "section'a tıklandı" mesajını dinle
  useEffect(() => {
    const handler = (e: MessageEvent) => {
      const data = e.data;
      if (!data || typeof data !== "object") return;
      if (data.type !== "builder:select-section") return;
      if (typeof data.sectionId !== "string") return;
      selectSection(data.sectionId);
      if (typeof data.tab === "string") setRequestedTab(data.tab);
    };
    window.addEventListener("message", handler);
    return () => window.removeEventListener("message", handler);
  }, [selectSection, setRequestedTab]);

  // İlk yüklemede mevcut config'i store'a aktar; bilinmeyen blockId'leri canonical'a çevir.
  useEffect(() => {
    if (initializedRef.current) return;
    initializedRef.current = true;

    const source = initialConfig ?? DEFAULT_ELITE_CONFIG;
    let sections = (source.sections ?? [])
      .map((s) => {
        const def = getBlock(s.blockId);
        if (!def) return null;
        return { ...s, blockId: def.id, category: def.category };
      })
      .filter(Boolean) as typeof source.sections;

    // Kayıtlı config boş/bozuksa (0 geçerli bölüm) varsayılan bölümlere düş —
    // kendini onarır. globalStyles korunur.
    if (sections.length === 0) {
      sections = DEFAULT_ELITE_CONFIG.sections;
    }

    setConfig({
      sections,
      globalStyles: source.globalStyles ?? DEFAULT_ELITE_CONFIG.globalStyles,
    });
    // Temporal history'yi temizle ki ilk hydration undo'da kaybolmasın
    useBuilderStore.temporal.getState().clear();
  }, [initialConfig, setConfig]);

  const saveStatus = useAutoSave(domain, config);
  useKeyboardShortcuts();

  const handleReload = () => {
    if (typeof window !== "undefined") window.location.reload();
  };

  return (
    <div className="w-full">
      <Toolbar domain={domain} saveStatus={saveStatus} />
      <ConflictBanner saveStatus={saveStatus} onReload={handleReload} />
      {/* Mobil panel seçici (lg+ gizli) */}
      <div
        className="flex lg:hidden border-x border-t"
        style={{ borderColor: "var(--dashboard-card-border)", backgroundColor: "var(--dashboard-card-bg)" }}
      >
        {(
          [
            { key: "sections", label: "Bölümler" },
            { key: "preview", label: "Önizleme" },
            { key: "editor", label: "Düzenle" },
          ] as const
        ).map((p) => (
          <button
            key={p.key}
            type="button"
            onClick={() => setMobilePane(p.key)}
            className="flex-1 h-10 text-xs font-semibold transition-colors border-b-2"
            style={{
              color: mobilePane === p.key ? "var(--dashboard-accent)" : "var(--dashboard-main-text-muted)",
              borderColor: mobilePane === p.key ? "var(--dashboard-accent)" : "transparent",
            }}
          >
            {p.label}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[260px_1fr_320px] gap-0 border rounded-b-lg overflow-hidden" style={{ borderColor: "var(--dashboard-card-border)", minHeight: "70vh" }}>
        {/* Sol: Bölüm listesi */}
        <aside
          className={`${mobilePane === "sections" ? "block" : "hidden"} lg:block border-r`}
          style={{ borderColor: "var(--dashboard-card-border)", backgroundColor: "var(--dashboard-card-bg)" }}
        >
          <SectionList />
        </aside>

        {/* Orta: Canlı önizleme (edit modunda section'lara tıklayınca drawer açılır) */}
        <main
          className={`${mobilePane === "preview" ? "flex" : "hidden"} lg:flex min-h-[70vh] flex-col`}
          style={{ backgroundColor: "var(--dashboard-main-bg)" }}
        >
          <LandingPreviewPanel domain={domain} refreshKey={config.sections.length} editMode={true} />
        </main>

        {/* Sağ: Drawer */}
        <aside
          className={`${mobilePane === "editor" ? "block" : "hidden"} lg:block border-l`}
          style={{ borderColor: "var(--dashboard-card-border)", backgroundColor: "var(--dashboard-card-bg)" }}
        >
          <SectionDrawer />
        </aside>
      </div>
    </div>
  );
}
