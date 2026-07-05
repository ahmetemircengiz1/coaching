"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { AlertTriangle, X } from "lucide-react";

interface ConfirmDialogProps {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  description: string;
  confirmText?: string;
  cancelText?: string;
  variant?: "danger" | "warning";
  loading?: boolean;
}

export function ConfirmDialog({
  open,
  onClose,
  onConfirm,
  title,
  description,
  confirmText = "Sil",
  cancelText = "Iptal",
  variant = "danger",
  loading = false,
}: ConfirmDialogProps) {
  const confirmRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (open) {
      const timer = setTimeout(() => confirmRef.current?.focus(), 100);
      return () => clearTimeout(timer);
    }
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [open, onClose]);

  if (!open) return null;

  const accentColor = variant === "danger" ? "#ef4444" : "#f59e0b";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
      <div
        className="relative w-full max-w-sm rounded-2xl border shadow-2xl overflow-hidden animate-fade-in"
        style={{
          backgroundColor: "var(--dashboard-card-bg)",
          borderColor: "var(--dashboard-card-border)",
          color: "var(--dashboard-main-text)",
        }}
      >
        <div className="px-6 py-5 space-y-4">
          <div className="flex items-start gap-3">
            <div
              className="shrink-0 w-10 h-10 rounded-full flex items-center justify-center"
              style={{ backgroundColor: `${accentColor}15` }}
            >
              <AlertTriangle size={20} style={{ color: accentColor }} />
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="text-base font-bold">{title}</h3>
              <p className="text-sm mt-1 leading-relaxed" style={{ color: "var(--dashboard-main-text-muted)" }}>
                {description}
              </p>
            </div>
            <button type="button" onClick={onClose} className="p-1.5 rounded-lg hover:bg-white/10 transition shrink-0">
              <X size={16} />
            </button>
          </div>
        </div>

        <div className="flex items-center justify-end gap-3 px-6 py-4 border-t" style={{ borderColor: "var(--dashboard-card-border)" }}>
          <button
            type="button"
            onClick={onClose}
            disabled={loading}
            className="px-4 py-2 rounded-lg text-sm font-medium hover:bg-white/10 transition"
          >
            {cancelText}
          </button>
          <button
            ref={confirmRef}
            type="button"
            onClick={onConfirm}
            disabled={loading}
            className="px-5 py-2 rounded-lg text-sm font-bold transition hover:opacity-90 disabled:opacity-40"
            style={{
              backgroundColor: accentColor,
              color: "#ffffff",
            }}
          >
            {loading ? "Siliniyor..." : confirmText}
          </button>
        </div>
      </div>
    </div>
  );
}

// Hook for easier usage
export function useConfirmDialog() {
  const [state, setState] = useState<{
    open: boolean;
    title: string;
    description: string;
    confirmText?: string;
    variant?: "danger" | "warning";
    resolve?: (confirmed: boolean) => void;
  }>({ open: false, title: "", description: "" });

  const confirm = useCallback(
    (opts: { title: string; description: string; confirmText?: string; variant?: "danger" | "warning" }) =>
      new Promise<boolean>((resolve) => {
        setState({ ...opts, open: true, resolve });
      }),
    []
  );

  const handleClose = useCallback(() => {
    state.resolve?.(false);
    setState((s) => ({ ...s, open: false }));
  }, [state]);

  const handleConfirm = useCallback(() => {
    state.resolve?.(true);
    setState((s) => ({ ...s, open: false }));
  }, [state]);

  const dialogProps = {
    open: state.open,
    onClose: handleClose,
    onConfirm: handleConfirm,
    title: state.title,
    description: state.description,
    confirmText: state.confirmText,
    variant: state.variant,
  };

  return { confirm, dialogProps };
}
