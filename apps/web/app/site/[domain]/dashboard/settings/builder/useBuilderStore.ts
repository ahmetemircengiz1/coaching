"use client";

import { create } from "zustand";
import { temporal } from "zundo";
import type { TemporalState } from "zundo";
import { useStore } from "zustand";
import type {
  EliteLandingConfig,
  EliteSectionConfig,
  EliteGlobalStyles,
  AnimationType,
} from "@/src/components/landing/elite-config";
import type { BlockCategory } from "@/src/components/landing/blocks/manifest";
import { getBlock } from "@/src/components/landing/blocks/manifest";

interface BuilderState {
  config: EliteLandingConfig;
  selectedSectionId: string | null;
  /** Inline canvas-edit veya başka kaynaklardan gelen "şu sekmeyi aç" sinyali */
  requestedTab: string | null;
  // Aksiyonlar
  setConfig: (config: EliteLandingConfig) => void;
  selectSection: (id: string | null) => void;
  setRequestedTab: (tab: string | null) => void;
  reorderSections: (orderedIds: string[]) => void;
  addSection: (category: BlockCategory, blockId: string) => string;
  removeSection: (id: string) => void;
  duplicateSection: (id: string) => string | null;
  toggleSection: (id: string) => void;
  setSectionBlock: (id: string, blockId: string) => void;
  setSectionCustomColors: (id: string, colors: EliteSectionConfig["customColors"]) => void;
  setSectionAnimation: (id: string, animation: AnimationType | undefined) => void;
  setSectionContentOverrides: (id: string, overrides: EliteSectionConfig["contentOverrides"]) => void;
  setSectionSpacing: (id: string, spacing: EliteSectionConfig["spacing"]) => void;
  setSectionBackground: (id: string, bg: EliteSectionConfig["background"]) => void;
  resetSectionToCategoryDefault: (id: string) => void;
  setGlobalStyles: (patch: Partial<EliteGlobalStyles>) => void;
}

function genId(category: BlockCategory) {
  return `${category}-${Math.random().toString(36).slice(2, 10)}`;
}

export const useBuilderStore = create<BuilderState>()(
  temporal(
    (set, get) => ({
      config: { sections: [], globalStyles: undefined },
      selectedSectionId: null,
      requestedTab: null,

      setConfig: (config) => set({ config }),

      selectSection: (id) => set({ selectedSectionId: id }),

      setRequestedTab: (tab) => set({ requestedTab: tab }),

      reorderSections: (orderedIds) =>
        set((state) => {
          const map = new Map(state.config.sections.map((s) => [s.id, s]));
          const reordered = orderedIds
            .map((id) => map.get(id))
            .filter((s): s is EliteSectionConfig => Boolean(s));
          return { config: { ...state.config, sections: reordered } };
        }),

      addSection: (category, blockId) => {
        const id = genId(category);
        const newSection: EliteSectionConfig = {
          id,
          category,
          blockId,
          enabled: true,
        };
        set((state) => ({
          config: { ...state.config, sections: [...state.config.sections, newSection] },
          selectedSectionId: id,
        }));
        return id;
      },

      removeSection: (id) =>
        set((state) => {
          const next = state.config.sections.filter((s) => s.id !== id);
          return {
            config: { ...state.config, sections: next },
            selectedSectionId: state.selectedSectionId === id ? null : state.selectedSectionId,
          };
        }),

      duplicateSection: (id) => {
        const section = get().config.sections.find((s) => s.id === id);
        if (!section) return null;
        const newId = genId(section.category);
        const clone: EliteSectionConfig = JSON.parse(JSON.stringify({ ...section, id: newId }));
        set((state) => {
          const idx = state.config.sections.findIndex((s) => s.id === id);
          const sections = [...state.config.sections];
          sections.splice(idx + 1, 0, clone);
          return { config: { ...state.config, sections }, selectedSectionId: newId };
        });
        return newId;
      },

      toggleSection: (id) =>
        set((state) => ({
          config: {
            ...state.config,
            sections: state.config.sections.map((s) =>
              s.id === id ? { ...s, enabled: !s.enabled } : s
            ),
          },
        })),

      setSectionBlock: (id, blockId) =>
        set((state) => {
          const def = getBlock(blockId);
          if (!def) return state;
          return {
            config: {
              ...state.config,
              sections: state.config.sections.map((s) =>
                s.id === id ? { ...s, blockId: def.id, category: def.category } : s
              ),
            },
          };
        }),

      setSectionCustomColors: (id, colors) =>
        set((state) => ({
          config: {
            ...state.config,
            sections: state.config.sections.map((s) =>
              s.id === id ? { ...s, customColors: colors } : s
            ),
          },
        })),

      setSectionAnimation: (id, animation) =>
        set((state) => ({
          config: {
            ...state.config,
            sections: state.config.sections.map((s) =>
              s.id === id ? { ...s, animationType: animation } : s
            ),
          },
        })),

      setSectionContentOverrides: (id, overrides) =>
        set((state) => ({
          config: {
            ...state.config,
            sections: state.config.sections.map((s) => {
              if (s.id !== id) return s;
              // Boş alanları temizle ki "" override'ı kaydetmesin
              const cleaned = overrides
                ? Object.fromEntries(Object.entries(overrides).filter(([, v]) => v !== undefined && v !== ""))
                : undefined;
              return {
                ...s,
                contentOverrides:
                  cleaned && Object.keys(cleaned).length > 0
                    ? (cleaned as EliteSectionConfig["contentOverrides"])
                    : undefined,
              };
            }),
          },
        })),

      setSectionSpacing: (id, spacing) =>
        set((state) => ({
          config: {
            ...state.config,
            sections: state.config.sections.map((s) =>
              s.id === id ? { ...s, spacing } : s
            ),
          },
        })),

      setSectionBackground: (id, bg) =>
        set((state) => ({
          config: {
            ...state.config,
            sections: state.config.sections.map((s) =>
              s.id === id ? { ...s, background: bg } : s
            ),
          },
        })),

      resetSectionToCategoryDefault: (id) =>
        set((state) => {
          const section = state.config.sections.find((s) => s.id === id);
          if (!section) return state;
          // Bu kategoride manifest'teki ilk blok = default
          const { getBlocksByCategory } = require("@/src/components/landing/blocks/manifest") as typeof import("@/src/components/landing/blocks/manifest");
          const list = getBlocksByCategory(section.category);
          const first = list[0];
          if (!first) return state;
          return {
            config: {
              ...state.config,
              sections: state.config.sections.map((s) =>
                s.id === id
                  ? { ...s, blockId: first.id, customColors: undefined, animationType: undefined }
                  : s
              ),
            },
          };
        }),

      setGlobalStyles: (patch) =>
        set((state) => ({
          config: {
            ...state.config,
            globalStyles: { ...(state.config.globalStyles || ({} as EliteGlobalStyles)), ...patch },
          },
        })),
    }),
    {
      // Yalnızca config snapshot'larını history'de tut
      partialize: (state) => ({ config: state.config }),
      limit: 50,
      // Eşit config'leri yığma
      equality: (a, b) => JSON.stringify(a.config) === JSON.stringify(b.config),
    }
  )
);

// Temporal store'a kolay erişim
export const useBuilderTemporal = <T,>(selector: (state: TemporalState<{ config: EliteLandingConfig }>) => T) =>
  useStore(useBuilderStore.temporal, selector);
