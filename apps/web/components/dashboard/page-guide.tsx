"use client";

/**
 * Sayfa rehberi sistemi.
 *
 * - PageGuide: her panel sayfasının üstünde duran ince rehber barı + o sayfanın
 *   detaylarını anlatan panel. Sayfalar arası gezen "tur" modu vardır: panel
 *   içindeki Önceki/Sonraki butonları dashboard'u da o sayfaya götürür ve panel
 *   yeni sayfada otomatik açık kalır. İlk girişte tur kendiliğinden başlar.
 * - GuideSettingsCard: Ayarlar'da yaşayan açılır/kapanır rehber ayarı — bar
 *   kapatılabilir (tüm sayfalarda kalkar) ve tur yeniden başlatılabilir.
 *
 * Tercihler localStorage'da tutulur (cihaz bazlı).
 */

import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import {
  BookOpen,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  X,
} from "lucide-react";
import {
  COACH_GUIDE_PAGES,
  STUDENT_GUIDE_PAGES,
  type GuidePageContent,
} from "./page-guide-content";

type GuideRole = "coach" | "student";

const BAR_KEY = "shred-guide-bar"; // "off" → bar tüm sayfalarda gizli
const BAR_EVENT = "shred-guide-bar-change";
const tourKey = (role: GuideRole) => `shred-guide-tour-${role}`;
const seenKey = (role: GuideRole) => `shred-guide-seen-${role}`;

function isBarEnabled(): boolean {
  if (typeof window === "undefined") return true;
  return localStorage.getItem(BAR_KEY) !== "off";
}

function guideBase(role: GuideRole, domain: string): string {
  return `/site/${domain}/${role === "coach" ? "dashboard" : "student"}`;
}

function findPageIndex(
  pages: GuidePageContent[],
  base: string,
  pathname: string
): number {
  const clean = pathname.replace(/\/+$/, "");
  if (clean === base) return pages.findIndex((p) => p.href === "");
  let best = -1;
  let bestLen = -1;
  pages.forEach((p, i) => {
    if (!p.href) return;
    const full = base + p.href;
    if ((clean === full || clean.startsWith(full + "/")) && p.href.length > bestLen) {
      best = i;
      bestLen = p.href.length;
    }
  });
  return best;
}

// ─── Sayfa üstü bar + rehber paneli ───

export function PageGuide({ role, domain }: { role: GuideRole; domain: string }) {
  const pathname = usePathname();
  const router = useRouter();
  const base = guideBase(role, domain);
  const pages = role === "coach" ? COACH_GUIDE_PAGES : STUDENT_GUIDE_PAGES;
  const pageIndex = findPageIndex(pages, base, pathname);
  const page = pageIndex >= 0 ? pages[pageIndex] : null;

  const [mounted, setMounted] = useState(false);
  const [barVisible, setBarVisible] = useState(true);
  const [open, setOpen] = useState(false);
  const [touring, setTouring] = useState(false);

  useEffect(() => {
    setMounted(true);
    setBarVisible(isBarEnabled());
    const sync = () => setBarVisible(isBarEnabled());
    window.addEventListener(BAR_EVENT, sync);
    window.addEventListener("storage", sync);
    return () => {
      window.removeEventListener(BAR_EVENT, sync);
      window.removeEventListener("storage", sync);
    };
  }, []);

  // Tur devam ediyorsa yeni sayfada paneli otomatik aç; ilk girişte turu başlat.
  useEffect(() => {
    if (!page) return;
    if (localStorage.getItem(tourKey(role)) === "1") {
      setTouring(true);
      setOpen(true);
      return;
    }
    if (!localStorage.getItem(seenKey(role)) && page.href === "") {
      localStorage.setItem(seenKey(role), "1");
      localStorage.setItem(tourKey(role), "1");
      setTouring(true);
      setOpen(true);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname, role]);

  // ESC ile kapat
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") closePanel();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, touring]);

  if (!mounted || !page) return null;

  const endTour = () => {
    localStorage.removeItem(tourKey(role));
    setTouring(false);
  };

  const closePanel = () => {
    // Panel kapatılınca tur da biter — yoksa her sayfa geçişinde yeniden açılırdı.
    endTour();
    setOpen(false);
  };

  const goTo = (index: number) => {
    const target = pages[index];
    if (!target) return;
    // Tur modunu aç ki hedef sayfada panel otomatik açılsın.
    localStorage.setItem(tourKey(role), "1");
    setTouring(true);
    router.push(base + target.href);
  };

  const prev = pageIndex > 0 ? pages[pageIndex - 1] : null;
  const next = pageIndex < pages.length - 1 ? pages[pageIndex + 1] : null;

  return (
    <>
      {barVisible && (
        <div
          className="mb-4 flex items-center gap-3 rounded-xl border px-4 py-2.5"
          style={{
            backgroundColor: "var(--dashboard-card-bg)",
            borderColor: "var(--dashboard-card-border)",
          }}
        >
          <BookOpen size={16} className="shrink-0" style={{ color: "var(--dashboard-accent)" }} />
          <p className="min-w-0 flex-1 truncate text-xs" style={{ color: "var(--dashboard-main-text-muted)" }}>
            <span className="font-semibold" style={{ color: "var(--dashboard-main-text)" }}>
              Rehber
            </span>{" "}
            — {page.label}: bu sayfada neler yapabileceğini öğren.
          </p>
          <button
            type="button"
            onClick={() => setOpen(true)}
            className="shrink-0 rounded-lg px-3 py-1.5 text-xs font-semibold transition hover:opacity-85"
            style={{
              backgroundColor: "var(--dashboard-accent)",
              color: "var(--dashboard-accent-text)",
            }}
          >
            Rehberi Aç
          </button>
        </div>
      )}

      {open && (
        <div className="fixed inset-0 z-[9000] flex items-center justify-center p-4">
          <button
            type="button"
            aria-label="Rehberi kapat"
            onClick={closePanel}
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
          />
          <div
            className="relative flex max-h-[85vh] w-full max-w-lg flex-col rounded-2xl border shadow-2xl"
            style={{
              backgroundColor: "var(--dashboard-card-bg)",
              borderColor: "var(--dashboard-card-border)",
              color: "var(--dashboard-main-text)",
            }}
            role="dialog"
            aria-modal="true"
            aria-label={`${page.label} rehberi`}
          >
            {/* Başlık */}
            <div
              className="flex items-start justify-between gap-4 border-b p-5"
              style={{ borderColor: "var(--dashboard-card-border)" }}
            >
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-wider" style={{ color: "var(--dashboard-accent)" }}>
                  Rehber {touring && `· ${pageIndex + 1}/${pages.length}`}
                </p>
                <h2 className="mt-1 text-lg font-bold">{page.label}</h2>
              </div>
              <button
                type="button"
                onClick={closePanel}
                className="rounded-lg p-1.5 transition hover:opacity-70"
                style={{ color: "var(--dashboard-main-text-muted)" }}
                aria-label="Kapat"
              >
                <X size={18} />
              </button>
            </div>

            {/* İçerik */}
            <div className="flex-1 space-y-5 overflow-y-auto p-5">
              <p className="text-sm leading-relaxed" style={{ color: "var(--dashboard-main-text-muted)" }}>
                {page.intro}
              </p>
              {page.sections.map((section) => (
                <div key={section.title}>
                  <h3 className="mb-2 text-sm font-semibold">{section.title}</h3>
                  <ul className="space-y-1.5">
                    {section.items.map((item, i) => (
                      <li key={i} className="flex gap-2 text-sm leading-relaxed" style={{ color: "var(--dashboard-main-text-muted)" }}>
                        <span className="mt-[7px] h-1.5 w-1.5 shrink-0 rounded-full" style={{ backgroundColor: "var(--dashboard-accent)" }} />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>

            {/* Alt gezinme */}
            <div
              className="flex items-center justify-between gap-2 border-t p-4"
              style={{ borderColor: "var(--dashboard-card-border)" }}
            >
              {prev ? (
                <button
                  type="button"
                  onClick={() => goTo(pageIndex - 1)}
                  className="flex min-w-0 items-center gap-1 rounded-lg border px-3 py-2 text-xs font-medium transition hover:opacity-80"
                  style={{ borderColor: "var(--dashboard-card-border)", color: "var(--dashboard-main-text)" }}
                >
                  <ChevronLeft size={14} className="shrink-0" />
                  <span className="truncate">{prev.label}</span>
                </button>
              ) : (
                <span />
              )}
              <button
                type="button"
                onClick={closePanel}
                className="shrink-0 text-xs transition hover:opacity-70"
                style={{ color: "var(--dashboard-main-text-muted)" }}
              >
                {touring ? "Turu bitir" : "Kapat"}
              </button>
              {next ? (
                <button
                  type="button"
                  onClick={() => goTo(pageIndex + 1)}
                  className="flex min-w-0 items-center gap-1 rounded-lg px-3 py-2 text-xs font-semibold transition hover:opacity-85"
                  style={{ backgroundColor: "var(--dashboard-accent)", color: "var(--dashboard-accent-text)" }}
                >
                  <span className="truncate">{next.label}</span>
                  <ChevronRight size={14} className="shrink-0" />
                </button>
              ) : (
                <button
                  type="button"
                  onClick={closePanel}
                  className="shrink-0 rounded-lg px-4 py-2 text-xs font-semibold transition hover:opacity-85"
                  style={{ backgroundColor: "var(--dashboard-accent)", color: "var(--dashboard-accent-text)" }}
                >
                  Bitir
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}

// ─── Ayarlar'daki açılır/kapanır rehber ayarı ───

export function GuideSettingsCard({ role, domain }: { role: GuideRole; domain: string }) {
  const router = useRouter();
  const [expanded, setExpanded] = useState(false);
  const [enabled, setEnabled] = useState(true);

  useEffect(() => {
    setEnabled(isBarEnabled());
  }, []);

  const toggleBar = () => {
    const next = !enabled;
    setEnabled(next);
    localStorage.setItem(BAR_KEY, next ? "on" : "off");
    window.dispatchEvent(new Event(BAR_EVENT));
  };

  const restartTour = () => {
    localStorage.setItem(tourKey(role), "1");
    router.push(guideBase(role, domain));
  };

  return (
    <div
      className="rounded-xl border"
      style={{
        backgroundColor: "var(--dashboard-card-bg)",
        borderColor: "var(--dashboard-card-border)",
        color: "var(--dashboard-main-text)",
      }}
    >
      <button
        type="button"
        onClick={() => setExpanded((e) => !e)}
        className="flex w-full items-center justify-between gap-3 p-4 text-left"
        aria-expanded={expanded}
      >
        <span className="flex items-center gap-2.5">
          <BookOpen size={17} style={{ color: "var(--dashboard-accent)" }} />
          <span className="text-sm font-semibold">Rehber</span>
        </span>
        <ChevronDown
          size={16}
          className={`transition-transform ${expanded ? "rotate-180" : ""}`}
          style={{ color: "var(--dashboard-main-text-muted)" }}
        />
      </button>

      {expanded && (
        <div className="space-y-4 border-t p-4" style={{ borderColor: "var(--dashboard-card-border)" }}>
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="text-sm font-medium">Sayfa üstü rehber barı</p>
              <p className="mt-0.5 text-xs" style={{ color: "var(--dashboard-main-text-muted)" }}>
                Açıkken her sayfanın üstünde o sayfanın rehberine açılan bar görünür.
                Kapatınca tüm sayfalardan kalkar.
              </p>
            </div>
            <button
              type="button"
              role="switch"
              aria-checked={enabled}
              onClick={toggleBar}
              className="relative h-6 w-11 shrink-0 rounded-full transition-colors"
              style={{
                backgroundColor: enabled ? "var(--dashboard-accent)" : "var(--dashboard-card-border)",
              }}
            >
              <span
                className="absolute top-0.5 h-5 w-5 rounded-full bg-white shadow transition-all"
                style={{ left: enabled ? "calc(100% - 22px)" : "2px" }}
              />
            </button>
          </div>

          <div className="border-t pt-3" style={{ borderColor: "var(--dashboard-card-border)" }}>
            <button
              type="button"
              onClick={restartTour}
              className="rounded-lg border px-3.5 py-2 text-xs font-semibold transition hover:opacity-80"
              style={{ borderColor: "var(--dashboard-card-border)", color: "var(--dashboard-main-text)", backgroundColor: "transparent" }}
            >
              Tanıtım turunu yeniden başlat
            </button>
            <p className="mt-2 text-xs" style={{ color: "var(--dashboard-main-text-muted)" }}>
              Tur, ana sayfadan başlayarak paneldeki her sayfayı adım adım gezdirir.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
