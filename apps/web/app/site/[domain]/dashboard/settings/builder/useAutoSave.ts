"use client";

import { useEffect, useRef, useState } from "react";
import { updateCoachSettings } from "../../actions";
import { notifyPreviewRefresh } from "@/src/lib/preview-bus";
import type { EliteLandingConfig } from "@/src/components/landing/elite-config";

export type SaveStatus = "idle" | "pending" | "saving" | "saved" | "error";

export function useAutoSave(domain: string, config: EliteLandingConfig) {
  const [status, setStatus] = useState<SaveStatus>("idle");
  const lastSavedRef = useRef<string>(JSON.stringify(config));
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const inflightRef = useRef<boolean>(false);

  useEffect(() => {
    // Boş config'i (0 bölüm) ASLA kaydetme. 0 bölüm geçerli bir landing page
    // değildir; yalnızca geçici/bozuk bir ara durumdur (ör. hot-reload sırasında
    // manifest bir an bozulup bölümler filtrelenince). Kaydedilirse koçun sitesi
    // kalıcı olarak silinir.
    if (!config.sections || config.sections.length === 0) {
      return;
    }
    const serialized = JSON.stringify(config);
    if (serialized === lastSavedRef.current) {
      return; // Strict-mode double mount fix: snapshot eşitse skip
    }
    setStatus("pending");
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(async () => {
      if (inflightRef.current) return;
      inflightRef.current = true;
      setStatus("saving");
      try {
        const result = await updateCoachSettings(domain, {
          eliteConfig: config as unknown as Record<string, unknown>,
        });
        if (result?.success === false) {
          setStatus("error");
        } else {
          lastSavedRef.current = JSON.stringify(config);
          setStatus("saved");
          notifyPreviewRefresh();
          // 1.5sn sonra 'saved' badge sönsün
          setTimeout(() => setStatus((s) => (s === "saved" ? "idle" : s)), 1500);
        }
      } catch {
        setStatus("error");
      } finally {
        inflightRef.current = false;
      }
    }, 1500);

    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, [config, domain]);

  return status;
}
