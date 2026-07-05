"use client";

import React, { useEffect, useState } from "react";
import { AlertTriangle } from "lucide-react";
import { onPreviewRefresh, getTabId } from "@/src/lib/preview-bus";
import type { SaveStatus } from "./useAutoSave";

interface ConflictBannerProps {
  saveStatus: SaveStatus;
  onReload: () => void;
}

/**
 * Başka bir sekmede save edildiyse ve burada düzenleme bekliyorsa
 * banner ile uyar — kullanıcı yenilemek ya da kendi değişikliğini saklayıp
 * üstüne yazmak isteyebilir.
 */
export function ConflictBanner({ saveStatus, onReload }: ConflictBannerProps) {
  const [conflict, setConflict] = useState(false);
  const myTabId = getTabId();

  useEffect(() => {
    return onPreviewRefresh((senderId) => {
      if (senderId && senderId !== myTabId) {
        // Başka bir sekme save etti
        if (saveStatus === "pending" || saveStatus === "saving") {
          setConflict(true);
        }
      }
    });
  }, [saveStatus, myTabId]);

  if (!conflict) return null;

  return (
    <div
      className="px-4 py-3 border-b flex items-center justify-between gap-3"
      style={{
        backgroundColor: "rgba(245, 158, 11, 0.1)",
        borderColor: "#f59e0b",
        color: "#fbbf24",
      }}
    >
      <div className="flex items-center gap-2 text-sm">
        <AlertTriangle className="w-4 h-4 flex-shrink-0" />
        <span>
          Bir başka sekmede landing sayfan güncellendi. Devam edersen kendi değişikliklerin onunkinin üzerine yazacak.
        </span>
      </div>
      <div className="flex items-center gap-2 flex-shrink-0">
        <button
          type="button"
          onClick={() => {
            onReload();
            setConflict(false);
          }}
          className="px-3 py-1 text-xs font-semibold rounded"
          style={{ backgroundColor: "#f59e0b", color: "#000" }}
        >
          Yenile
        </button>
        <button
          type="button"
          onClick={() => setConflict(false)}
          className="px-3 py-1 text-xs font-semibold rounded border"
          style={{ borderColor: "#f59e0b", color: "#fbbf24" }}
        >
          Devam et
        </button>
      </div>
    </div>
  );
}
