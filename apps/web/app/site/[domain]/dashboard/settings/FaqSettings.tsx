"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { updateCoachSettings } from "../actions";
import { notifyPreviewRefresh } from "@/src/lib/preview-bus";
import { DEFAULT_BLOCK_FAQS } from "@/src/components/landing/blocks/faq/faq-data";

/**
 * FaqSettings — koçun landing sayfasındaki SSS sorularını düzenlediği editör.
 *
 * Koç henüz soru girmediyse hazır varsayılan sorularla (DEFAULT_BLOCK_FAQS)
 * dolu gelir; koç düzenleyip kaydederek kendi sorularını oluşturur. Kaydedilen
 * sorular `landingFaqs` alanına yazılır ve FAQ blokları bunları gösterir.
 */
interface FaqItem {
  id: string;
  question: string;
  answer: string;
}

interface Props {
  domain: string;
  initialFaqs: FaqItem[] | null;
}

const DEFAULTS: FaqItem[] = DEFAULT_BLOCK_FAQS.map((f, i) => ({
  id: `faq-default-${i}`,
  question: f.q,
  answer: f.a,
}));

export function FaqSettings({ domain, initialFaqs }: Props) {
  const hasSaved = !!(initialFaqs && initialFaqs.length > 0);
  const [faqs, setFaqs] = useState<FaqItem[]>(hasSaved ? initialFaqs! : DEFAULTS);
  const [saving, setSaving] = useState(false);

  const update = (id: string, field: "question" | "answer", value: string) =>
    setFaqs((prev) => prev.map((f) => (f.id === id ? { ...f, [field]: value } : f)));

  const add = () =>
    setFaqs((prev) => [
      ...prev,
      { id: `faq-${Date.now()}`, question: "", answer: "" },
    ]);

  const remove = (id: string) =>
    setFaqs((prev) => prev.filter((f) => f.id !== id));

  const save = async () => {
    setSaving(true);
    const clean = faqs
      .map((f) => ({
        id: f.id,
        question: f.question.trim(),
        answer: f.answer.trim(),
      }))
      .filter((f) => f.question && f.answer);
    const res = await updateCoachSettings(domain, { landingFaqs: clean });
    setSaving(false);
    if (res && res.success === false) {
      toast.error(res.error || "Sorular kaydedilemedi.");
    } else {
      toast.success("Sıkça sorulan sorular kaydedildi.");
      notifyPreviewRefresh();
    }
  };

  const fieldStyle = {
    backgroundColor: "var(--dashboard-main-bg)",
    border: "1px solid var(--dashboard-card-border)",
    color: "var(--dashboard-main-text)",
  };

  return (
    <Card
      style={{
        backgroundColor: "var(--dashboard-card-bg)",
        borderColor: "var(--dashboard-card-border)",
        color: "var(--dashboard-main-text)",
      }}
    >
      <CardHeader>
        <CardTitle className="text-lg">Sıkça Sorulan Sorular</CardTitle>
        <p className="text-sm" style={{ color: "var(--dashboard-main-text-muted)" }}>
          {hasSaved
            ? "Landing sayfandaki SSS bölümünde görünen sorular."
            : "Şu an hazır varsayılan sorular gösteriliyor. Aşağıdan düzenleyip kaydederek kendi sorularını oluşturabilirsin."}
        </p>
      </CardHeader>
      <CardContent className="space-y-4">
        {faqs.map((f, i) => (
          <div
            key={f.id}
            className="space-y-3 rounded-lg border p-4"
            style={{ borderColor: "var(--dashboard-card-border)", backgroundColor: "var(--dashboard-main-bg)" }}
          >
            <div className="flex items-center justify-between">
              <span
                className="text-xs font-semibold uppercase tracking-wider"
                style={{ color: "var(--dashboard-main-text-muted)" }}
              >
                Soru {i + 1}
              </span>
              <button
                type="button"
                onClick={() => remove(f.id)}
                aria-label="Soruyu sil"
                className="rounded p-1 text-red-400/60 transition-colors hover:bg-red-400/10 hover:text-red-400"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
            <Input
              value={f.question}
              onChange={(e) => update(f.id, "question", e.target.value)}
              placeholder="Soru (örn: Programa nasıl başlarım?)"
              style={{
                backgroundColor: "var(--dashboard-card-bg)",
                borderColor: "var(--dashboard-card-border)",
                color: "var(--dashboard-main-text)",
              }}
            />
            <textarea
              value={f.answer}
              onChange={(e) => update(f.id, "answer", e.target.value)}
              placeholder="Cevap"
              rows={3}
              className="w-full rounded-md px-3 py-2 text-sm"
              style={fieldStyle}
            />
          </div>
        ))}

        {faqs.length === 0 && (
          <p className="text-sm" style={{ color: "var(--dashboard-main-text-muted)" }}>
            Henüz soru yok. Aşağıdaki butonla ekleyebilirsin.
          </p>
        )}

        <div className="flex gap-2">
          <Button
            onClick={add}
            variant="outline"
            style={{ borderColor: "var(--dashboard-card-border)", color: "var(--dashboard-main-text)", backgroundColor: "transparent" }}
          >
            <Plus className="mr-1 h-4 w-4" />
            Soru Ekle
          </Button>
          <Button
            onClick={save}
            disabled={saving}
            style={{ backgroundColor: "var(--dashboard-accent)", color: "var(--dashboard-accent-text)" }}
            className="font-semibold hover:opacity-90"
          >
            {saving ? "Kaydediliyor..." : "Kaydet"}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
