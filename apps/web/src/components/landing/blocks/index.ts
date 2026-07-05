// Section Builder block exports — sadece manifest re-export'u
//
// HER BLOK kaydı `manifest.ts` dosyasındadır (tek doğru kaynak).
// Server action'lar `manifest-meta.ts`'i kullanmalı (component bundle'ı yok).

export type { BlockCategory, BlockDefinition, PlanTier } from "./manifest";
export {
  BLOCKS,
  ALL_CATEGORIES,
  CATEGORY_LABELS,
  CATEGORY_COLORS,
  getBlock,
  getBlocksByCategory,
  validateBlockId,
  resolveBlockId,
  getCategoryColor,
} from "./manifest";
