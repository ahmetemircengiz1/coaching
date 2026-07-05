"use client";

import { useEffect } from "react";
import { useBuilderStore } from "./useBuilderStore";

export function useKeyboardShortcuts() {
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      // Sadece form alanı odaklı değilse çalış
      const target = e.target as HTMLElement | null;
      const tag = target?.tagName?.toLowerCase();
      if (tag === "input" || tag === "textarea" || tag === "select" || target?.isContentEditable) {
        return;
      }

      const meta = e.metaKey || e.ctrlKey;
      // Undo: Cmd/Ctrl+Z
      if (meta && !e.shiftKey && e.key.toLowerCase() === "z") {
        e.preventDefault();
        useBuilderStore.temporal.getState().undo();
        return;
      }
      // Redo: Cmd/Ctrl+Shift+Z VEYA Cmd/Ctrl+Y
      if ((meta && e.shiftKey && e.key.toLowerCase() === "z") || (meta && e.key.toLowerCase() === "y")) {
        e.preventDefault();
        useBuilderStore.temporal.getState().redo();
        return;
      }
      // Delete: seçili bölümü sil (confirm ile)
      if (e.key === "Delete" || (e.key === "Backspace" && meta)) {
        const selected = useBuilderStore.getState().selectedSectionId;
        if (selected) {
          if (confirm("Seçili bölümü silmek istediğine emin misin? (Ctrl+Z ile geri alabilirsin)")) {
            useBuilderStore.getState().removeSection(selected);
          }
        }
      }
    };

    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, []);
}
