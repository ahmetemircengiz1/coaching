"use client";

import React, { useState } from "react";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { GripVertical, MoreVertical, Eye, EyeOff } from "lucide-react";
import { useBuilderStore } from "./useBuilderStore";
import type { EliteSectionConfig } from "@/src/components/landing/elite-config";
import { CATEGORY_LABELS, getBlock } from "@/src/components/landing/blocks/manifest";

interface Props {
  section: EliteSectionConfig;
}

export function SectionListItem({ section }: Props) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: section.id });
  const selected = useBuilderStore((s) => s.selectedSectionId) === section.id;
  const selectSection = useBuilderStore((s) => s.selectSection);
  const toggle = useBuilderStore((s) => s.toggleSection);
  const remove = useBuilderStore((s) => s.removeSection);
  const duplicate = useBuilderStore((s) => s.duplicateSection);
  const reset = useBuilderStore((s) => s.resetSectionToCategoryDefault);

  const [menuOpen, setMenuOpen] = useState(false);
  const def = getBlock(section.blockId);
  const blockName = def?.name ?? section.blockId;

  const style: React.CSSProperties = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
    backgroundColor: selected ? "var(--dashboard-accent-soft, rgba(204,255,0,0.1))" : "var(--dashboard-main-bg)",
    borderColor: selected ? "var(--dashboard-accent)" : "var(--dashboard-card-border)",
  };

  const handleDelete = () => {
    if (confirm(`"${blockName}" bölümünü silmek istediğine emin misin? (Ctrl+Z ile geri alabilirsin)`)) {
      remove(section.id);
    }
    setMenuOpen(false);
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="group relative flex items-center gap-2 px-2 py-2 border rounded-md cursor-pointer"
      onClick={() => selectSection(section.id)}
    >
      <button
        type="button"
        {...attributes}
        {...listeners}
        className="cursor-grab active:cursor-grabbing text-zinc-400 hover:text-zinc-200 touch-none"
        aria-label="Sürükle"
        onClick={(e) => e.stopPropagation()}
      >
        <GripVertical className="w-4 h-4" />
      </button>

      <div className="flex-1 min-w-0">
        <div className="text-[10px] uppercase tracking-wide opacity-60" style={{ color: "var(--dashboard-main-text-muted)" }}>
          {CATEGORY_LABELS[section.category as keyof typeof CATEGORY_LABELS] ?? section.category}
        </div>
        <div className="text-sm font-medium truncate" style={{ color: "var(--dashboard-main-text)" }}>
          {blockName}
        </div>
      </div>

      <button
        type="button"
        className="p-1.5 rounded hover:bg-black/10 dark:hover:bg-white/10"
        onClick={(e) => {
          e.stopPropagation();
          toggle(section.id);
        }}
        aria-label={section.enabled ? "Gizle" : "Göster"}
        title={section.enabled ? "Gizle" : "Göster"}
        style={{ color: section.enabled ? "var(--dashboard-main-text)" : "var(--dashboard-main-text-muted)" }}
      >
        {section.enabled ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
      </button>

      <div className="relative">
        <button
          type="button"
          className="p-1.5 rounded hover:bg-black/10 dark:hover:bg-white/10"
          onClick={(e) => {
            e.stopPropagation();
            setMenuOpen((v) => !v);
          }}
          aria-label="Bölüm menüsü"
        >
          <MoreVertical className="w-4 h-4" />
        </button>
        {menuOpen && (
          <>
            <div className="fixed inset-0 z-10" onClick={() => setMenuOpen(false)} />
            <div
              className="absolute right-0 top-full mt-1 w-44 rounded-md shadow-lg z-20 overflow-hidden border"
              style={{ backgroundColor: "var(--dashboard-card-bg)", borderColor: "var(--dashboard-card-border)" }}
            >
              <MenuItem onClick={() => { duplicate(section.id); setMenuOpen(false); }}>Çoğalt</MenuItem>
              <MenuItem onClick={() => { reset(section.id); setMenuOpen(false); }}>Varsayılana sıfırla</MenuItem>
              <MenuItem onClick={handleDelete} danger>Sil</MenuItem>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

function MenuItem({ children, onClick, danger }: { children: React.ReactNode; onClick: () => void; danger?: boolean }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="w-full text-left px-3 py-2 text-sm hover:bg-black/5 dark:hover:bg-white/5 transition-colors"
      style={{ color: danger ? "#ef4444" : "var(--dashboard-main-text)" }}
    >
      {children}
    </button>
  );
}
