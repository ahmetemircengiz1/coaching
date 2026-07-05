"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import { X, Lock, Check, Search, Star, Eye } from "lucide-react";
import {
  ALL_CATEGORIES,
  CATEGORY_LABELS,
  BLOCKS,
  getBlocksByCategory,
  type BlockCategory,
  type BlockDefinition,
  type PlanTier,
} from "@/src/components/landing/blocks/manifest";
import { useBuilderStore } from "./useBuilderStore";
import { BlockThumbnail } from "./BlockThumbnail";
import { UpgradeModal } from "./UpgradeModal";
import { useFavorites } from "./useFavorites";

const PLAN_RANK: Record<PlanTier, number> = { starter: 1, pro: 2, elite: 3 };

// Arama için: blok adı + açıklama + kategori etiketi taranır.
function matchSearch(block: BlockDefinition, q: string): boolean {
  if (!q) return true;
  const haystack = `${block.name} ${block.description ?? ""} ${block.id} ${CATEGORY_LABELS[block.category]}`.toLowerCase();
  return q
    .toLowerCase()
    .split(/\s+/)
    .filter(Boolean)
    .every((token) => haystack.includes(token));
}

interface BlockPickerProps {
  open: boolean;
  onClose: () => void;
  /** "add" — yeni bölüm ekler, "swap" — seçili bölümün blok varyantını değiştirir */
  mode: "add" | "swap";
  /** swap modu için sabitlenmiş kategori */
  category?: BlockCategory;
  /** swap modu için seçili bölümün id'si */
  sectionId?: string;
  planTier?: PlanTier;
}

export function BlockPicker({ open, onClose, mode, category, sectionId, planTier = "elite" }: BlockPickerProps) {
  const addSection = useBuilderStore((s) => s.addSection);
  const setSectionBlock = useBuilderStore((s) => s.setSectionBlock);
  const sections = useBuilderStore((s) => s.config.sections);

  // "favorites" — özel pseudo-kategori
  const [activeCategory, setActiveCategory] = useState<BlockCategory | "favorites">(category ?? "hero");
  const [upsell, setUpsell] = useState<{ tier: PlanTier; name: string } | null>(null);
  const [search, setSearch] = useState("");
  const { favorites, isFavorite, toggle: toggleFavorite } = useFavorites();

  // Hover live preview: hangi bloğun üzerinde 250ms+ duruldu?
  const [previewBlockId, setPreviewBlockId] = useState<string | null>(null);
  const hoverTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const handleHoverStart = (id: string) => {
    if (hoverTimerRef.current) clearTimeout(hoverTimerRef.current);
    hoverTimerRef.current = setTimeout(() => setPreviewBlockId(id), 250);
  };
  const handleHoverEnd = () => {
    if (hoverTimerRef.current) clearTimeout(hoverTimerRef.current);
  };
  useEffect(() => {
    return () => {
      if (hoverTimerRef.current) clearTimeout(hoverTimerRef.current);
    };
  }, []);

  React.useEffect(() => {
    if (open && category) setActiveCategory(category);
  }, [open, category]);

  React.useEffect(() => {
    if (!open) setSearch(""); // her açılışta search temizle
  }, [open]);

  const planRank = PLAN_RANK[planTier];

  const blocks = useMemo<BlockDefinition[]>(() => {
    // Arama varsa kategori bypass — tüm bloklarda ara
    if (search.trim()) {
      const matched = BLOCKS.filter((b) => !b.deprecated && matchSearch(b, search));
      // Favorileri başa getir
      return matched.sort((a, b) => {
        const aFav = favorites.includes(a.id) ? -1 : 0;
        const bFav = favorites.includes(b.id) ? -1 : 0;
        return aFav - bFav;
      });
    }
    if (activeCategory === "favorites") {
      return BLOCKS.filter((b) => favorites.includes(b.id) && !b.deprecated);
    }
    return getBlocksByCategory(activeCategory);
  }, [activeCategory, search, favorites]);

  const currentBlockId = sectionId ? sections.find((s) => s.id === sectionId)?.blockId : undefined;

  if (!open) return null;

  const handlePick = (block: BlockDefinition) => {
    if (PLAN_RANK[block.planTier] > planRank) {
      // Plan yetersiz — upsell modal göster
      setUpsell({ tier: block.planTier, name: block.name });
      return;
    }
    if (mode === "add") {
      addSection(block.category, block.id);
    } else if (mode === "swap" && sectionId) {
      setSectionBlock(sectionId, block.id);
    }
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm" onClick={onClose}>
      <div
        className="w-full max-w-7xl max-h-[88vh] flex flex-col rounded-2xl border shadow-2xl overflow-hidden"
        style={{ backgroundColor: "var(--dashboard-card-bg)", borderColor: "var(--dashboard-card-border)" }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between px-6 py-4 border-b" style={{ borderColor: "var(--dashboard-card-border)" }}>
          <div>
            <h3 className="text-lg font-bold" style={{ color: "var(--dashboard-main-text)" }}>
              {mode === "add" ? "Bölüm Ekle" : "Tasarım Değiştir"}
            </h3>
            <p className="text-xs mt-0.5" style={{ color: "var(--dashboard-main-text-muted)" }}>
              {mode === "add"
                ? "Bir kategori seç ve eklemek istediğin tasarımı tıkla."
                : "Bu bölümü hangi tasarıma dönüştürmek istersin?"}
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-md hover:bg-black/5 dark:hover:bg-white/5"
            aria-label="Kapat"
          >
            <X className="w-5 h-5" style={{ color: "var(--dashboard-main-text)" }} />
          </button>
        </div>

        {/* Search — her modda gösterilir */}
        <div className="px-6 py-3 border-b" style={{ borderColor: "var(--dashboard-card-border)" }}>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 pointer-events-none" style={{ color: "var(--dashboard-main-text-muted)" }} />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder={`${BLOCKS.filter((b) => !b.deprecated).length} blok arasında ara — ör: "minimal" veya "split"`}
              className="w-full pl-10 pr-9 py-2 rounded-md text-sm"
              style={{
                backgroundColor: "var(--dashboard-main-bg)",
                color: "var(--dashboard-main-text)",
                border: "1px solid var(--dashboard-card-border)",
              }}
              autoFocus
            />
            {search && (
              <button
                type="button"
                onClick={() => setSearch("")}
                className="absolute right-2 top-1/2 -translate-y-1/2 p-1 rounded hover:opacity-70"
                style={{ color: "var(--dashboard-main-text-muted)" }}
                aria-label="Aramayı temizle"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>

        {mode === "add" && !search && (
          <div className="px-6 py-3 border-b overflow-x-auto" style={{ borderColor: "var(--dashboard-card-border)" }}>
            <div className="flex gap-2 min-w-max">
              {/* Favoriler tab'ı */}
              <button
                type="button"
                onClick={() => setActiveCategory("favorites")}
                className="inline-flex items-center gap-1 px-3 py-1.5 rounded-full text-xs font-semibold transition-colors whitespace-nowrap"
                style={{
                  backgroundColor: activeCategory === "favorites" ? "var(--dashboard-accent)" : "var(--dashboard-main-bg)",
                  color: activeCategory === "favorites" ? "var(--dashboard-accent-text)" : "var(--dashboard-main-text)",
                  border: activeCategory === "favorites" ? "none" : "1px solid var(--dashboard-card-border)",
                }}
              >
                <Star className="w-3.5 h-3.5" fill={activeCategory === "favorites" ? "currentColor" : "none"} />
                Favoriler
                {favorites.length > 0 && (
                  <span
                    className="ml-1 inline-flex items-center justify-center min-w-[18px] h-[18px] px-1 rounded-full text-[10px] font-bold"
                    style={{
                      backgroundColor: activeCategory === "favorites" ? "rgba(0,0,0,0.2)" : "var(--dashboard-card-bg)",
                      color: activeCategory === "favorites" ? "var(--dashboard-accent-text)" : "var(--dashboard-main-text-muted)",
                    }}
                  >
                    {favorites.length}
                  </span>
                )}
              </button>
              {ALL_CATEGORIES.map((cat) => {
                const isActive = cat === activeCategory;
                return (
                  <button
                    key={cat}
                    type="button"
                    onClick={() => setActiveCategory(cat)}
                    className="px-3 py-1.5 rounded-full text-xs font-semibold transition-colors whitespace-nowrap"
                    style={{
                      backgroundColor: isActive ? "var(--dashboard-accent)" : "var(--dashboard-main-bg)",
                      color: isActive ? "var(--dashboard-accent-text)" : "var(--dashboard-main-text)",
                      border: isActive ? "none" : "1px solid var(--dashboard-card-border)",
                    }}
                  >
                    {CATEGORY_LABELS[cat]}
                  </button>
                );
              })}
            </div>
          </div>
        )}

        <UpgradeModal
          open={!!upsell}
          onClose={() => setUpsell(null)}
          requiredTier={upsell?.tier ?? "elite"}
          blockName={upsell?.name}
        />

        <div className="flex-1 overflow-hidden flex">
          <div className="flex-1 overflow-y-auto p-6">
          {blocks.length === 0 ? (
            <div className="text-center py-12">
              {search ? (
                <>
                  <Search className="w-10 h-10 mx-auto mb-3 opacity-30" style={{ color: "var(--dashboard-main-text)" }} />
                  <p className="text-sm font-medium" style={{ color: "var(--dashboard-main-text)" }}>
                    "{search}" için sonuç bulunamadı
                  </p>
                  <p className="text-xs mt-1" style={{ color: "var(--dashboard-main-text-muted)" }}>
                    Farklı bir kelime dene veya kategoriden seç.
                  </p>
                </>
              ) : activeCategory === "favorites" ? (
                <>
                  <Star className="w-10 h-10 mx-auto mb-3 opacity-30" style={{ color: "var(--dashboard-main-text)" }} />
                  <p className="text-sm font-medium" style={{ color: "var(--dashboard-main-text)" }}>
                    Henüz favori blok yok
                  </p>
                  <p className="text-xs mt-1" style={{ color: "var(--dashboard-main-text-muted)" }}>
                    Bir bloğun üzerindeki ⭐ ikonuna tıklayarak favorilere ekleyebilirsin.
                  </p>
                </>
              ) : (
                <p className="text-sm" style={{ color: "var(--dashboard-main-text-muted)" }}>
                  Bu kategoride henüz blok bulunmuyor.
                </p>
              )}
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
              {blocks.map((block) => {
                const locked = PLAN_RANK[block.planTier] > planRank;
                const isCurrent = block.id === currentBlockId;
                const fav = isFavorite(block.id);
                return (
                  <div
                    key={block.id}
                    onMouseEnter={() => handleHoverStart(block.id)}
                    onMouseLeave={handleHoverEnd}
                    className={`group relative text-left rounded-xl overflow-hidden border-2 transition-all ${locked ? "opacity-90" : "hover:scale-[1.02] hover:shadow-xl"}`}
                    style={{
                      borderColor: isCurrent ? "var(--dashboard-accent)" : previewBlockId === block.id ? "var(--dashboard-accent)" : "var(--dashboard-card-border)",
                      backgroundColor: "var(--dashboard-main-bg)",
                    }}
                  >
                    <button
                      type="button"
                      onClick={() => handlePick(block)}
                      className="block w-full text-left"
                      title={locked ? `${block.planTier.toUpperCase()} planı gerekiyor` : block.description || block.name}
                    >
                      <div className="aspect-video relative overflow-hidden">
                        <BlockThumbnail block={block} />
                        {locked && (
                          <div className="absolute inset-0 flex items-center justify-center bg-black/60 backdrop-blur-sm">
                            <span className="inline-flex items-center gap-1 px-2 py-1 rounded text-[10px] font-bold uppercase" style={{ backgroundColor: "#fff", color: "#000" }}>
                              <Lock className="w-3 h-3" /> {block.planTier.toUpperCase()}
                            </span>
                          </div>
                        )}
                        {isCurrent && (
                          <div className="absolute top-2 left-2 inline-flex items-center gap-1 px-2 py-1 rounded text-[10px] font-bold uppercase" style={{ backgroundColor: "var(--dashboard-accent)", color: "var(--dashboard-accent-text)" }}>
                            <Check className="w-3 h-3" /> Aktif
                          </div>
                        )}
                      </div>
                      <div className="p-3 pr-10">
                        <div className="text-sm font-semibold" style={{ color: "var(--dashboard-main-text)" }}>
                          {block.name}
                        </div>
                        {block.description && (
                          <div className="text-xs mt-0.5 line-clamp-2" style={{ color: "var(--dashboard-main-text-muted)" }}>
                            {block.description}
                          </div>
                        )}
                        {/* Search modunda kategori rozeti */}
                        {search && (
                          <span
                            className="inline-block mt-1.5 text-[10px] uppercase tracking-wider px-1.5 py-0.5 rounded"
                            style={{
                              backgroundColor: "var(--dashboard-card-bg)",
                              color: "var(--dashboard-main-text-muted)",
                            }}
                          >
                            {CATEGORY_LABELS[block.category]}
                          </span>
                        )}
                      </div>
                    </button>

                    {/* Favori toggle */}
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleFavorite(block.id);
                      }}
                      className="absolute bottom-2 right-2 p-1.5 rounded-full transition opacity-60 hover:opacity-100"
                      style={{
                        backgroundColor: fav ? "var(--dashboard-accent)" : "var(--dashboard-card-bg)",
                        color: fav ? "var(--dashboard-accent-text)" : "var(--dashboard-main-text-muted)",
                      }}
                      title={fav ? "Favoriden çıkar" : "Favorilere ekle"}
                      aria-label={fav ? "Favoriden çıkar" : "Favorilere ekle"}
                    >
                      <Star className="w-3.5 h-3.5" fill={fav ? "currentColor" : "none"} />
                    </button>
                  </div>
                );
              })}
            </div>
          )}
          </div>

          {/* Sağ panel: Hover live preview (sadece geniş ekran) */}
          <div
            className="hidden lg:flex w-[420px] shrink-0 border-l flex-col"
            style={{ borderColor: "var(--dashboard-card-border)", backgroundColor: "var(--dashboard-main-bg)" }}
          >
            <HoverPreview blockId={previewBlockId} />
          </div>
        </div>
      </div>
    </div>
  );
}

function HoverPreview({ blockId }: { blockId: string | null }) {
  const [loaded, setLoaded] = useState(false);

  // blockId değişince loaded'ı resetle
  useEffect(() => {
    setLoaded(false);
  }, [blockId]);

  if (!blockId) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center p-8 text-center">
        <Eye className="w-10 h-10 mb-3 opacity-30" style={{ color: "var(--dashboard-main-text)" }} />
        <p className="text-sm font-medium" style={{ color: "var(--dashboard-main-text)" }}>
          Canlı önizleme
        </p>
        <p className="text-xs mt-1.5 leading-relaxed" style={{ color: "var(--dashboard-main-text-muted)" }}>
          Sol taraftaki bir bloğun üzerine 250 ms gel, gerçek görünümü burada göster.
        </p>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col p-3">
      <div
        className="text-[10px] font-mono mb-2 px-1 truncate"
        style={{ color: "var(--dashboard-main-text-muted)" }}
      >
        /dev/block-preview/{blockId}
      </div>
      <div
        className="relative flex-1 overflow-hidden rounded-lg border"
        style={{ borderColor: "var(--dashboard-card-border)", backgroundColor: "#000" }}
      >
        {!loaded && (
          <div className="absolute inset-0 flex items-center justify-center">
            <div
              className="w-6 h-6 border-2 border-current border-t-transparent rounded-full animate-spin opacity-40"
              style={{ color: "var(--dashboard-accent)" }}
            />
          </div>
        )}
        {/* iframe içerikleri sadece dev'de var (route /dev/block-preview/...) */}
        <iframe
          key={blockId}
          src={`/dev/block-preview/${blockId}`}
          className="w-full h-full"
          style={{
            border: "none",
            // 1280px geniş içeriği panele sığdırmak için scale
            transform: "scale(0.31)",
            transformOrigin: "top left",
            width: "1280px",
            height: "calc(100% / 0.31)",
          }}
          onLoad={() => setLoaded(true)}
          title={`${blockId} preview`}
          sandbox="allow-same-origin allow-scripts"
        />
      </div>
    </div>
  );
}
