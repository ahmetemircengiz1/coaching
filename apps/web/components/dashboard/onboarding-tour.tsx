"use client";

import { createContext, useCallback, useContext, useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { X, ChevronRight, ChevronLeft, RotateCcw } from "lucide-react";

// ── Tour Step Definition ──

export interface TourStep {
  /** CSS selector to highlight (e.g. "[data-tour='sidebar-students']") */
  target: string;
  /** Title of the step */
  title: string;
  /** Description text */
  description: string;
  /** Which side to place the tooltip */
  placement?: "top" | "bottom" | "left" | "right";
}

// ── Tour Steps Data ──

const DASHBOARD_TOUR_STEPS: TourStep[] = [
  {
    target: "[data-tour='sidebar-brand']",
    title: "Hoş Geldin!",
    description: "Burası senin koç panelin. Üstteki marka adıyla öğrencilerin seni tanır. Bu kısa tur seni 1 dakikada tanıştıracak.",
    placement: "right",
  },
  {
    target: "[data-tour='sidebar-students']",
    title: "Öğrencileriniz",
    description: "Tüm öğrencilerini buradan yönet — yeni öğrenci davet et, ilerlemelerini ve check-in'lerini takip et.",
    placement: "right",
  },
  {
    target: "[data-tour='sidebar-programs']",
    title: "Programlar",
    description: "Antrenman programları oluştur ve öğrencilerine ata. Hazır şablonları kopyalayabilir, kendi programlarını sıfırdan inşa edebilirsin.",
    placement: "right",
  },
  {
    target: "[data-tour='sidebar-nutrition']",
    title: "Beslenme",
    description: "Beslenme planları hazırla — öğün listeleri, kalori/makro hedefleri. Aynı planı birden fazla öğrenciye atayabilirsin.",
    placement: "right",
  },
  {
    target: "[data-tour='sidebar-settings']",
    title: "Ayarlar",
    description: "Site tasarımı, içerik (hero, metinler, dönüşümler, yorumlar), paketler, iletişim ve hesabın — hepsi tek yerden yönetilir.",
    placement: "right",
  },
];

// ── Tour Context ──

interface TourContextValue {
  isActive: boolean;
  currentStep: number;
  totalSteps: number;
  startTour: () => void;
  endTour: () => void;
  nextStep: () => void;
  prevStep: () => void;
  hasCompletedTour: boolean;
}

const TourContext = createContext<TourContextValue>({
  isActive: false,
  currentStep: 0,
  totalSteps: 0,
  startTour: () => {},
  endTour: () => {},
  nextStep: () => {},
  prevStep: () => {},
  hasCompletedTour: false,
});

export function useTour() {
  return useContext(TourContext);
}

const STORAGE_KEY = "coach-os-tour-completed";

// ── Tour Provider ──

export function TourProvider({ children }: { children: React.ReactNode }) {
  const [isActive, setIsActive] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [hasCompletedTour, setHasCompletedTour] = useState(true); // default true to avoid flash

  useEffect(() => {
    const completed = localStorage.getItem(STORAGE_KEY);
    if (!completed) {
      setHasCompletedTour(false);
      // Auto-start tour for first-time users after a short delay
      const timer = setTimeout(() => setIsActive(true), 1500);
      return () => clearTimeout(timer);
    }
    setHasCompletedTour(true);
  }, []);

  const startTour = useCallback(() => {
    setCurrentStep(0);
    setIsActive(true);
  }, []);

  const endTour = useCallback(() => {
    setIsActive(false);
    setCurrentStep(0);
    localStorage.setItem(STORAGE_KEY, "1");
    setHasCompletedTour(true);
  }, []);

  const nextStep = useCallback(() => {
    if (currentStep < DASHBOARD_TOUR_STEPS.length - 1) {
      setCurrentStep((s) => s + 1);
    } else {
      endTour();
    }
  }, [currentStep, endTour]);

  const prevStep = useCallback(() => {
    if (currentStep > 0) {
      setCurrentStep((s) => s - 1);
    }
  }, [currentStep]);

  return (
    <TourContext.Provider
      value={{
        isActive,
        currentStep,
        totalSteps: DASHBOARD_TOUR_STEPS.length,
        startTour,
        endTour,
        nextStep,
        prevStep,
        hasCompletedTour,
      }}
    >
      {children}
      {isActive && <TourOverlay step={DASHBOARD_TOUR_STEPS[currentStep]} stepIndex={currentStep} totalSteps={DASHBOARD_TOUR_STEPS.length} onNext={nextStep} onPrev={prevStep} onClose={endTour} />}
    </TourContext.Provider>
  );
}

// ── Tour Button (header'da gösterilecek) ──

export function TourButton() {
  const { startTour, hasCompletedTour } = useTour();

  // #17: Tour tamamlanmış koçlar için buton gizlenir — bilişsel yükü azaltır.
  if (hasCompletedTour) return null;

  return (
    <button
      type="button"
      onClick={startTour}
      className="relative inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all hover:scale-105"
      style={{
        backgroundColor: "var(--dashboard-accent)",
        color: "var(--dashboard-accent-text)",
      }}
      title="Tanıtım turunu başlat"
    >
      <RotateCcw size={13} />
      <span className="hidden sm:inline">Rehber</span>
      <span className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-red-500 animate-pulse" />
    </button>
  );
}

// ── Tour Overlay (spotlight + tooltip) ──

function TourOverlay({
  step,
  stepIndex,
  totalSteps,
  onNext,
  onPrev,
  onClose,
}: {
  step: TourStep;
  stepIndex: number;
  totalSteps: number;
  onNext: () => void;
  onPrev: () => void;
  onClose: () => void;
}) {
  const [targetRect, setTargetRect] = useState<DOMRect | null>(null);
  const tooltipRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = document.querySelector(step.target);
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "nearest" });
      // Small delay for scroll to complete
      const timer = setTimeout(() => {
        setTargetRect(el.getBoundingClientRect());
      }, 300);
      return () => clearTimeout(timer);
    }
    setTargetRect(null);
  }, [step.target]);

  // Recalculate on resize/scroll
  useEffect(() => {
    const update = () => {
      const el = document.querySelector(step.target);
      if (el) setTargetRect(el.getBoundingClientRect());
    };
    window.addEventListener("resize", update);
    window.addEventListener("scroll", update, true);
    return () => {
      window.removeEventListener("resize", update);
      window.removeEventListener("scroll", update, true);
    };
  }, [step.target]);

  // Keyboard navigation
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowRight" || e.key === "Enter") onNext();
      if (e.key === "ArrowLeft") onPrev();
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [onClose, onNext, onPrev]);

  if (!targetRect) return null;

  const pad = 6;
  const spotlightStyle = {
    top: targetRect.top - pad,
    left: targetRect.left - pad,
    width: targetRect.width + pad * 2,
    height: targetRect.height + pad * 2,
  };

  // Calculate tooltip position
  const placement = step.placement || "right";
  const tooltipStyle: React.CSSProperties = { position: "fixed" as const, zIndex: 10002 };
  const gap = 16;

  if (placement === "right") {
    tooltipStyle.top = targetRect.top;
    tooltipStyle.left = targetRect.right + gap;
  } else if (placement === "left") {
    tooltipStyle.top = targetRect.top;
    tooltipStyle.right = window.innerWidth - targetRect.left + gap;
  } else if (placement === "bottom") {
    tooltipStyle.top = targetRect.bottom + gap;
    tooltipStyle.left = targetRect.left;
  } else {
    tooltipStyle.bottom = window.innerHeight - targetRect.top + gap;
    tooltipStyle.left = targetRect.left;
  }

  const isLast = stepIndex === totalSteps - 1;

  return createPortal(
    <>
      {/* Dark overlay with spotlight cutout */}
      <div
        className="fixed inset-0 z-[10000] transition-opacity duration-300"
        style={{ backgroundColor: "rgba(0,0,0,0.65)" }}
        onClick={onClose}
      />

      {/* Spotlight hole */}
      <div
        className="fixed z-[10001] rounded-xl transition-all duration-300 pointer-events-none"
        style={{
          ...spotlightStyle,
          boxShadow: "0 0 0 3px var(--dashboard-accent, #ccff00), 0 0 30px rgba(204,255,0,0.3)",
        }}
      />

      {/* Tooltip */}
      <div
        ref={tooltipRef}
        className="fixed z-[10002] w-80 max-w-[calc(100vw-2rem)] rounded-2xl p-5 shadow-2xl animate-fade-in"
        style={{
          ...tooltipStyle,
          backgroundColor: "#1a1a2e",
          border: "1px solid rgba(255,255,255,0.1)",
          color: "#ffffff",
        }}
      >
        {/* Step indicator */}
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-1.5">
            {Array.from({ length: totalSteps }).map((_, i) => (
              <div
                key={i}
                className="h-1.5 rounded-full transition-all duration-300"
                style={{
                  width: i === stepIndex ? 20 : 6,
                  backgroundColor: i === stepIndex
                    ? "var(--dashboard-accent, #ccff00)"
                    : "rgba(255,255,255,0.2)",
                }}
              />
            ))}
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1 rounded-lg hover:bg-white/10 transition-colors text-white/50 hover:text-white"
          >
            <X size={16} />
          </button>
        </div>

        {/* Content */}
        <h3 className="text-base font-bold mb-1.5">{step.title}</h3>
        <p className="text-sm text-white/70 leading-relaxed mb-4">{step.description}</p>

        {/* Navigation */}
        <div className="flex items-center justify-between">
          <span className="text-xs text-white/40">
            {stepIndex + 1} / {totalSteps}
          </span>
          <div className="flex items-center gap-2">
            {stepIndex > 0 && (
              <button
                type="button"
                onClick={onPrev}
                className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-medium bg-white/10 hover:bg-white/20 text-white transition-colors"
              >
                <ChevronLeft size={14} />
                Geri
              </button>
            )}
            <button
              type="button"
              onClick={onNext}
              className="flex items-center gap-1 px-4 py-1.5 rounded-lg text-xs font-bold transition-all hover:scale-105"
              style={{
                backgroundColor: "var(--dashboard-accent, #ccff00)",
                color: "var(--dashboard-accent-text, #000)",
              }}
            >
              {isLast ? "Tamamla" : "Sonraki"}
              {!isLast && <ChevronRight size={14} />}
            </button>
          </div>
        </div>
      </div>
    </>,
    document.body,
  );
}
