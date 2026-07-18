"use client";

/**
 * Sayfa rehberi sistemi — GÖSTEREREK anlatan spotlight turu.
 *
 * - PageGuide: her panel sayfasının üstünde ince rehber barı + o sayfayı adım
 *   adım gezdiren spotlight turu. Her adım sayfadaki gerçek öğeyi (menü, buton,
 *   bölüm) vurgular ve kısa açıklamayı yanına koyar; hedefi olmayan adımlar
 *   ekran ortasında küçük bir kart olarak görünür. Sayfanın adımları bitince
 *   İleri butonu dashboard'u da bir sonraki sayfaya taşır ve tur orada sürer.
 *   İlk girişte tur kendiliğinden başlar.
 * - GuideSettingsCard: Ayarlar'da açılır/kapanır rehber ayarı — bar
 *   kapatılabilir (tüm sayfalarda kalkar) ve tur yeniden başlatılabilir.
 *
 * Tercihler localStorage'da tutulur (cihaz bazlı).
 */

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
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
  type GuideStep,
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

// ─── Sayfa üstü bar + spotlight turu ───

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
  const [stepIndex, setStepIndex] = useState(0);

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

  // Tur devam ediyorsa yeni sayfada otomatik aç; ilk girişte turu başlat.
  useEffect(() => {
    if (!page) return;
    setStepIndex(0);
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

  if (!mounted || !page) return null;

  const endTour = () => {
    localStorage.removeItem(tourKey(role));
    setTouring(false);
  };

  const closeGuide = () => {
    // Kapatınca tur da biter — yoksa her sayfa geçişinde yeniden açılırdı.
    endTour();
    setOpen(false);
  };

  const goToPage = (index: number) => {
    const target = pages[index];
    if (!target) return;
    localStorage.setItem(tourKey(role), "1");
    setTouring(true);
    router.push(base + target.href);
  };

  const step = page.steps[Math.min(stepIndex, page.steps.length - 1)];
  const isLastStep = stepIndex >= page.steps.length - 1;
  const isFirstStep = stepIndex === 0;
  const nextPage = pageIndex < pages.length - 1 ? pages[pageIndex + 1] : null;
  const prevPage = pageIndex > 0 ? pages[pageIndex - 1] : null;

  const handleNext = () => {
    if (!isLastStep) {
      setStepIndex((s) => s + 1);
      return;
    }
    if (touring && nextPage) {
      goToPage(pageIndex + 1);
      return;
    }
    closeGuide();
  };

  const handlePrev = () => {
    if (!isFirstStep) {
      setStepIndex((s) => s - 1);
      return;
    }
    if (touring && prevPage) {
      goToPage(pageIndex - 1);
    }
  };

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
            — {page.label}: bu sayfayı adım adım gezdireyim mi?
          </p>
          <button
            type="button"
            onClick={() => { setStepIndex(0); setOpen(true); }}
            className="shrink-0 rounded-lg px-3 py-1.5 text-xs font-semibold transition hover:opacity-85"
            style={{
              backgroundColor: "var(--dashboard-accent)",
              color: "var(--dashboard-accent-text)",
            }}
          >
            Göster
          </button>
        </div>
      )}

      {open && step && (
        <SpotlightStep
          key={`${pageIndex}-${stepIndex}`}
          step={step}
          pageLabel={page.label}
          pagePos={touring ? `${pageIndex + 1}/${pages.length}` : null}
          stepPos={`${Math.min(stepIndex, page.steps.length - 1) + 1}/${page.steps.length}`}
          canPrev={!isFirstStep || (touring && !!prevPage)}
          prevLabel={!isFirstStep ? "Geri" : prevPage ? prevPage.label : "Geri"}
          nextLabel={
            !isLastStep
              ? "İleri"
              : touring && nextPage
                ? `Sıradaki: ${nextPage.label}`
                : "Bitir"
          }
          onPrev={handlePrev}
          onNext={handleNext}
          onClose={closeGuide}
          touring={touring}
        />
      )}
    </>
  );
}

// ─── Tek adımın spotlight + balon görünümü ───

function SpotlightStep({
  step,
  pageLabel,
  pagePos,
  stepPos,
  canPrev,
  prevLabel,
  nextLabel,
  onPrev,
  onNext,
  onClose,
  touring,
}: {
  step: GuideStep;
  pageLabel: string;
  pagePos: string | null;
  stepPos: string;
  canPrev: boolean;
  prevLabel: string;
  nextLabel: string;
  onPrev: () => void;
  onNext: () => void;
  onClose: () => void;
  touring: boolean;
}) {
  const [rect, setRect] = useState<DOMRect | null>(null);
  const [ready, setReady] = useState(false);

  // Hedef öğeyi bul, gerekiyorsa tıklayıp aç, görünür yap ve konumunu izle
  useEffect(() => {
    let cancelled = false;

    // Adım bir grup/akordiyon açacaksa önce tıkla (zaten açıksa dokunma)
    const clickSel = step.clickTarget || (step.click ? step.target : null);
    if (clickSel) {
      const clickEl = document.querySelector(clickSel) as HTMLElement | null;
      if (clickEl && clickEl.getAttribute("aria-expanded") !== "true") {
        clickEl.click();
      }
    }

    // Tıklamanın açtığı içeriğin render olması için ufak gecikmeyle ölç
    const timer = setTimeout(() => {
      if (cancelled) return;
      const el = step.target ? document.querySelector(step.target) : null;
      if (el) {
        el.scrollIntoView({ behavior: "smooth", block: "center" });
        setTimeout(() => {
          if (!cancelled) {
            setRect(el.getBoundingClientRect());
            setReady(true);
          }
        }, 350);
      } else {
        // Hedefsiz adım: sayfanın başı görünür olsun (bar + içerik)
        window.scrollTo({ top: 0, behavior: "smooth" });
        setRect(null);
        setReady(true);
      }
    }, clickSel ? 250 : 0);

    const update = () => {
      const current = step.target ? document.querySelector(step.target) : null;
      if (current) setRect(current.getBoundingClientRect());
    };
    window.addEventListener("resize", update);
    window.addEventListener("scroll", update, true);
    return () => {
      cancelled = true;
      clearTimeout(timer);
      window.removeEventListener("resize", update);
      window.removeEventListener("scroll", update, true);
    };
  }, [step.target, step.click, step.clickTarget]);

  // Klavye: ESC kapat, ok/Enter ilerle
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowRight" || e.key === "Enter") onNext();
      if (e.key === "ArrowLeft") onPrev();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose, onNext, onPrev]);

  if (!ready) return null;

  const pad = 6;
  const hasTarget = !!rect;

  // Balon konumu: hedef varsa altına (sığmazsa üstüne), yatayda ekrana kıstır
  const CARD_W = 340;
  const cardStyle: React.CSSProperties = { position: "fixed", zIndex: 10002, width: CARD_W, maxWidth: "calc(100vw - 24px)" };
  if (hasTarget && rect) {
    const spaceBelow = window.innerHeight - rect.bottom;
    const left = Math.min(Math.max(12, rect.left), Math.max(12, window.innerWidth - CARD_W - 12));
    cardStyle.left = left;
    if (spaceBelow > 240) {
      cardStyle.top = rect.bottom + pad + 14;
    } else {
      cardStyle.bottom = window.innerHeight - rect.top + pad + 14;
    }
  } else {
    cardStyle.left = "50%";
    cardStyle.top = "50%";
    cardStyle.transform = "translate(-50%, -50%)";
  }

  return createPortal(
    <>
      {/* Karartma */}
      <div
        className="fixed inset-0 z-[10000] transition-opacity duration-300"
        style={{ backgroundColor: "rgba(0,0,0,0.62)" }}
        onClick={onClose}
      />

      {/* Spotlight halkası */}
      {hasTarget && rect && (
        <div
          className="pointer-events-none fixed z-[10001] rounded-xl transition-all duration-300"
          style={{
            top: rect.top - pad,
            left: rect.left - pad,
            width: rect.width + pad * 2,
            height: rect.height + pad * 2,
            boxShadow:
              "0 0 0 3px var(--dashboard-accent, #ccff00), 0 0 0 9999px rgba(0,0,0,0.62), 0 0 28px rgba(0,0,0,0.4)",
          }}
        />
      )}

      {/* Açıklama balonu */}
      <div
        className="animate-fade-in rounded-2xl border p-5 shadow-2xl"
        style={{
          ...cardStyle,
          backgroundColor: "var(--dashboard-card-bg, #1a1a2e)",
          borderColor: "var(--dashboard-card-border, rgba(255,255,255,0.1))",
          color: "var(--dashboard-main-text, #fff)",
        }}
        role="dialog"
        aria-modal="true"
        aria-label={`${pageLabel} rehberi`}
      >
        <div className="mb-2 flex items-center justify-between gap-3">
          <p className="text-[11px] font-semibold uppercase tracking-wider" style={{ color: "var(--dashboard-accent)" }}>
            {pageLabel}
            {pagePos && <span className="ml-1.5 opacity-70">· Sayfa {pagePos}</span>}
          </p>
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg p-1 transition hover:opacity-70"
            style={{ color: "var(--dashboard-main-text-muted)" }}
            aria-label="Kapat"
          >
            <X size={15} />
          </button>
        </div>

        <h3 className="text-base font-bold">{step.title}</h3>
        <p className="mt-1.5 text-sm leading-relaxed" style={{ color: "var(--dashboard-main-text-muted)" }}>
          {step.text}
        </p>

        <div className="mt-4 flex items-center justify-between gap-2">
          <span className="shrink-0 text-[11px]" style={{ color: "var(--dashboard-main-text-muted)" }}>
            {stepPos}
          </span>
          <div className="flex min-w-0 items-center gap-2">
            {touring && (
              <button
                type="button"
                onClick={onClose}
                className="shrink-0 text-[11px] transition hover:opacity-70"
                style={{ color: "var(--dashboard-main-text-muted)" }}
              >
                Turu bitir
              </button>
            )}
            {canPrev && (
              <button
                type="button"
                onClick={onPrev}
                className="flex shrink-0 items-center gap-1 rounded-lg px-2.5 py-1.5 text-xs font-medium transition hover:opacity-80"
                style={{
                  backgroundColor: "color-mix(in srgb, var(--dashboard-main-text) 10%, transparent)",
                  color: "var(--dashboard-main-text)",
                }}
              >
                <ChevronLeft size={13} />
                {prevLabel}
              </button>
            )}
            <button
              type="button"
              onClick={onNext}
              className="flex min-w-0 items-center gap-1 rounded-lg px-3 py-1.5 text-xs font-bold transition hover:opacity-85"
              style={{
                backgroundColor: "var(--dashboard-accent, #ccff00)",
                color: "var(--dashboard-accent-text, #000)",
              }}
            >
              <span className="truncate">{nextLabel}</span>
              <ChevronRight size={13} className="shrink-0" />
            </button>
          </div>
        </div>
      </div>
    </>,
    document.body
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
      data-guide="guide-settings-card"
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
                Açıkken her sayfanın üstünde o sayfanın rehberini başlatan bar görünür.
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
