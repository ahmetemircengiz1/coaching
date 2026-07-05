"use client";

import { useCallback, useEffect, useState } from "react";

const STORAGE_KEY = "coachos.builder.favorites";

function readFavorites(): string[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed.filter((x) => typeof x === "string") : [];
  } catch {
    return [];
  }
}

function writeFavorites(list: string[]) {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
    // Aynı sekme içindeki diğer instance'lara haber ver
    window.dispatchEvent(new Event("coachos-favs-changed"));
  } catch {
    // localStorage kapalı/dolu — sessizce yut
  }
}

export function useFavorites() {
  const [favorites, setFavorites] = useState<string[]>([]);

  // İlk mount'ta hydrate
  useEffect(() => {
    setFavorites(readFavorites());
  }, []);

  // Diğer sekmelerden veya aynı sekme içinden gelen değişiklikleri dinle
  useEffect(() => {
    if (typeof window === "undefined") return;
    const onStorage = (e: StorageEvent) => {
      if (e.key === STORAGE_KEY) setFavorites(readFavorites());
    };
    const onLocal = () => setFavorites(readFavorites());
    window.addEventListener("storage", onStorage);
    window.addEventListener("coachos-favs-changed", onLocal);
    return () => {
      window.removeEventListener("storage", onStorage);
      window.removeEventListener("coachos-favs-changed", onLocal);
    };
  }, []);

  const isFavorite = useCallback((id: string) => favorites.includes(id), [favorites]);

  const toggle = useCallback((id: string) => {
    setFavorites((prev) => {
      const next = prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id];
      writeFavorites(next);
      return next;
    });
  }, []);

  return { favorites, isFavorite, toggle };
}
