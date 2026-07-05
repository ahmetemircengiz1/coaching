"use client";

import React, { useState } from "react";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { Plus } from "lucide-react";
import { useBuilderStore } from "./useBuilderStore";
import { SectionListItem } from "./SectionListItem";
import { BlockPicker } from "./BlockPicker";

export function SectionList() {
  const sections = useBuilderStore((s) => s.config.sections);
  const reorderSections = useBuilderStore((s) => s.reorderSections);
  const [pickerOpen, setPickerOpen] = useState(false);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates }),
  );

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;
    const oldIndex = sections.findIndex((s) => s.id === active.id);
    const newIndex = sections.findIndex((s) => s.id === over.id);
    if (oldIndex < 0 || newIndex < 0) return;
    const next = arrayMove(sections, oldIndex, newIndex).map((s) => s.id);
    reorderSections(next);
  };

  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center justify-between px-3 py-2 border-b" style={{ borderColor: "var(--dashboard-card-border)" }}>
        <h4 className="text-xs font-semibold uppercase tracking-wide" style={{ color: "var(--dashboard-main-text-muted)" }}>
          Bölümler ({sections.length})
        </h4>
      </div>
      <div className="flex-1 overflow-y-auto p-2 space-y-1.5">
        <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
          <SortableContext items={sections.map((s) => s.id)} strategy={verticalListSortingStrategy}>
            {sections.map((section) => (
              <SectionListItem key={section.id} section={section} />
            ))}
          </SortableContext>
        </DndContext>
        {sections.length === 0 && (
          <div className="text-center py-12 px-4 text-sm" style={{ color: "var(--dashboard-main-text-muted)" }}>
            Henüz bölüm yok. Aşağıdaki butondan ilk bölümünü ekle.
          </div>
        )}
      </div>
      <div className="p-2 border-t" style={{ borderColor: "var(--dashboard-card-border)" }}>
        <button
          type="button"
          onClick={() => setPickerOpen(true)}
          className="w-full inline-flex items-center justify-center gap-2 px-3 py-2 rounded-md text-sm font-semibold transition-opacity hover:opacity-90"
          style={{ backgroundColor: "var(--dashboard-accent)", color: "var(--dashboard-accent-text)" }}
        >
          <Plus className="w-4 h-4" />
          Bölüm Ekle
        </button>
      </div>
      <BlockPicker open={pickerOpen} onClose={() => setPickerOpen(false)} mode="add" />
    </div>
  );
}
