"use client";

import { useEffect, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { X, FileText, Copy, Sparkles, ArrowLeft, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ValidatedInput } from "@/components/dashboard/validated-input";
import { Input } from "@/components/ui/input";
import {
  createProgram,
  duplicateProgram,
  importTemplateProgram,
  getCoachProgramsList,
} from "@/app/site/[domain]/dashboard/programs/actions";
import { PROGRAM_TEMPLATES, LEVEL_LABELS, LEVEL_COLORS } from "@/lib/data/program-templates";

type Step = "choose" | "template" | "copy" | "scratch";

type CoachProgram = {
  id: string;
  name: string;
  description: string | null;
  weeks: number;
  workoutCount: number;
};

export function NewProgramWizard({
  domain,
  open,
  onClose,
}: {
  domain: string;
  open: boolean;
  onClose: () => void;
}) {
  const router = useRouter();
  const [step, setStep] = useState<Step>("choose");
  const [busy, setBusy] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [_, startTransition] = useTransition();

  // Scratch form state
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [weeks, setWeeks] = useState(4);

  // Template search
  const [templateSearch, setTemplateSearch] = useState("");

  // Copy mode
  const [coachPrograms, setCoachPrograms] = useState<CoachProgram[] | null>(null);
  const [copySearch, setCopySearch] = useState("");

  useEffect(() => {
    if (!open) {
      setStep("choose");
      setError(null);
      setBusy(null);
      setName("");
      setDescription("");
      setWeeks(4);
      setTemplateSearch("");
      setCopySearch("");
      setCoachPrograms(null);
    }
  }, [open]);

  useEffect(() => {
    if (step === "copy" && coachPrograms === null) {
      getCoachProgramsList(domain)
        .then((rows) => setCoachPrograms(rows))
        .catch(() => setError("Programlar yüklenemedi"));
    }
  }, [step, coachPrograms, domain]);

  if (!open) return null;

  const handleTemplate = (templateId: string) => {
    setBusy(templateId);
    setError(null);
    startTransition(async () => {
      const result = await importTemplateProgram(domain, templateId);
      if (result.success && "programId" in result) {
        onClose();
        router.push(`/site/${domain}/dashboard/programs/${result.programId}`);
      } else {
        setError(("error" in result && result.error) || "İçe aktarma başarısız");
        setBusy(null);
      }
    });
  };

  const handleCopy = (programId: string) => {
    setBusy(programId);
    setError(null);
    startTransition(async () => {
      const result = await duplicateProgram(domain, programId);
      if (result.success && "programId" in result) {
        onClose();
        router.push(`/site/${domain}/dashboard/programs/${result.programId}`);
      } else {
        setError(("error" in result && result.error) || "Kopyalama başarısız");
        setBusy(null);
      }
    });
  };

  const handleScratch = () => {
    if (!name.trim()) return;
    setBusy("create");
    setError(null);
    startTransition(async () => {
      const result = await createProgram(domain, {
        name: name.trim(),
        description: description.trim() || undefined,
        weeks,
      });
      if (result.success && "programId" in result) {
        onClose();
        router.push(`/site/${domain}/dashboard/programs/${result.programId}`);
      } else {
        setError(("error" in result && result.error) || "Oluşturma başarısız");
        setBusy(null);
      }
    });
  };

  const filteredTemplates = PROGRAM_TEMPLATES.filter((t) => {
    if (!templateSearch.trim()) return true;
    const q = templateSearch.toLowerCase();
    return (
      t.name.toLowerCase().includes(q) ||
      t.goal.toLowerCase().includes(q) ||
      (LEVEL_LABELS[t.level] || "").toLowerCase().includes(q)
    );
  });

  const filteredOwnPrograms = (coachPrograms || []).filter((p) => {
    if (!copySearch.trim()) return true;
    const q = copySearch.toLowerCase();
    return (
      p.name.toLowerCase().includes(q) ||
      (p.description || "").toLowerCase().includes(q)
    );
  });

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ backgroundColor: "rgba(0,0,0,0.6)" }}
      onClick={onClose}
    >
      <div
        className="w-full max-w-3xl rounded-2xl shadow-2xl flex flex-col max-h-[88vh]"
        style={{
          backgroundColor: "var(--dashboard-card-bg)",
          borderColor: "var(--dashboard-card-border)",
          borderWidth: "1px",
          color: "var(--dashboard-main-text)",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div
          className="flex items-center justify-between p-5 border-b"
          style={{ borderColor: "var(--dashboard-card-border)" }}
        >
          <div className="flex items-center gap-3 min-w-0">
            {step !== "choose" && (
              <button
                onClick={() => setStep("choose")}
                className="p-1 rounded hover:bg-white/10 transition-colors"
                aria-label="Geri"
              >
                <ArrowLeft className="h-4 w-4" />
              </button>
            )}
            <div className="min-w-0">
              <h2 className="text-lg font-semibold">
                {step === "choose" && "Yeni Program"}
                {step === "template" && "Hazır Şablondan Başla"}
                {step === "copy" && "Mevcut Programı Kopyala"}
                {step === "scratch" && "Sıfırdan Oluştur"}
              </h2>
              <p
                className="mt-0.5 text-xs"
                style={{ color: "var(--dashboard-main-text-muted)" }}
              >
                {step === "choose" && "Nasıl başlamak istersin?"}
                {step === "template" && "Şablon seç, otomatik kütüphanene eklensin"}
                {step === "copy" && "Mevcut bir programını çoğalt, düzenle"}
                {step === "scratch" && "Boş bir programdan başla"}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg hover:bg-white/10 transition-colors"
            aria-label="Kapat"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto p-5">
          {step === "choose" && (
            <div className="grid gap-3 sm:grid-cols-3">
              <PathCard
                icon={<FileText className="h-5 w-5" />}
                title="Hazır şablondan"
                description={`${PROGRAM_TEMPLATES.length} hazır şablon — başlangıç, hipertrofi, yağ yakım vs.`}
                onClick={() => setStep("template")}
                accent
              />
              <PathCard
                icon={<Copy className="h-5 w-5" />}
                title="Programımı kopyala"
                description="Daha önce oluşturduğun bir programı çoğalt, üzerinde değişiklik yap."
                onClick={() => setStep("copy")}
              />
              <PathCard
                icon={<Sparkles className="h-5 w-5" />}
                title="Sıfırdan başla"
                description="Boş bir programla başla, her şeyi sen tasarla."
                onClick={() => setStep("scratch")}
              />
            </div>
          )}

          {step === "template" && (
            <div className="space-y-3">
              <SearchBar
                value={templateSearch}
                onChange={setTemplateSearch}
                placeholder="Şablon ara... (örn: kuvvet, yeni başlayan)"
              />
              <div className="grid gap-3 sm:grid-cols-2">
                {filteredTemplates.length === 0 ? (
                  <p
                    className="col-span-full text-center text-sm py-10"
                    style={{ color: "var(--dashboard-main-text-muted)" }}
                  >
                    Eşleşen şablon yok.
                  </p>
                ) : (
                  filteredTemplates.map((t) => (
                    <button
                      key={t.id}
                      onClick={() => handleTemplate(t.id)}
                      disabled={busy !== null}
                      className="text-left p-4 rounded-lg border transition-all hover:scale-[1.01] hover:shadow-md disabled:opacity-50 disabled:cursor-wait"
                      style={{
                        borderColor: "var(--dashboard-card-border)",
                        backgroundColor: "color-mix(in srgb, var(--dashboard-main-text) 3%, transparent)",
                      }}
                    >
                      <div className="flex items-start justify-between gap-2 mb-1">
                        <h3 className="font-semibold text-sm">{t.name}</h3>
                        <span
                          className={`shrink-0 text-[10px] px-2 py-0.5 rounded-full border ${LEVEL_COLORS[t.level] || ""}`}
                        >
                          {LEVEL_LABELS[t.level]}
                        </span>
                      </div>
                      <p
                        className="text-xs mb-2 line-clamp-2"
                        style={{ color: "var(--dashboard-main-text-muted)" }}
                      >
                        {t.description}
                      </p>
                      <div
                        className="flex gap-3 text-[11px]"
                        style={{ color: "var(--dashboard-main-text-muted)", opacity: 0.7 }}
                      >
                        <span>{t.weeks} hafta</span>
                        <span>{t.daysPerWeek} gün/hafta</span>
                        <span>Hedef: {t.goal}</span>
                      </div>
                      {busy === t.id && (
                        <p
                          className="mt-2 text-xs"
                          style={{ color: "var(--dashboard-accent)" }}
                        >
                          İçe aktarılıyor...
                        </p>
                      )}
                    </button>
                  ))
                )}
              </div>
            </div>
          )}

          {step === "copy" && (
            <div className="space-y-3">
              <SearchBar
                value={copySearch}
                onChange={setCopySearch}
                placeholder="Programlarımda ara..."
              />
              {coachPrograms === null ? (
                <p
                  className="text-center text-sm py-10"
                  style={{ color: "var(--dashboard-main-text-muted)" }}
                >
                  Yükleniyor...
                </p>
              ) : filteredOwnPrograms.length === 0 ? (
                <p
                  className="text-center text-sm py-10"
                  style={{ color: "var(--dashboard-main-text-muted)" }}
                >
                  {coachPrograms.length === 0
                    ? "Henüz bir programın yok. \"Hazır şablondan\" veya \"Sıfırdan\" başla."
                    : "Eşleşen program yok."}
                </p>
              ) : (
                <ul className="space-y-2">
                  {filteredOwnPrograms.map((p) => (
                    <li key={p.id}>
                      <button
                        onClick={() => handleCopy(p.id)}
                        disabled={busy !== null}
                        className="w-full text-left p-3 rounded-lg border transition hover:bg-white/5 disabled:opacity-50 disabled:cursor-wait"
                        style={{ borderColor: "var(--dashboard-card-border)" }}
                      >
                        <div className="flex items-start justify-between gap-2">
                          <div className="min-w-0">
                            <p className="text-sm font-semibold">{p.name}</p>
                            {p.description && (
                              <p
                                className="mt-0.5 text-xs line-clamp-1"
                                style={{ color: "var(--dashboard-main-text-muted)" }}
                              >
                                {p.description}
                              </p>
                            )}
                            <div
                              className="mt-1 flex gap-3 text-[11px]"
                              style={{ color: "var(--dashboard-main-text-muted)", opacity: 0.7 }}
                            >
                              <span>{p.weeks} hafta</span>
                              <span>{p.workoutCount} antrenman</span>
                            </div>
                          </div>
                          {busy === p.id && (
                            <span
                              className="text-xs"
                              style={{ color: "var(--dashboard-accent)" }}
                            >
                              Kopyalanıyor...
                            </span>
                          )}
                        </div>
                      </button>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          )}

          {step === "scratch" && (
            <div className="space-y-3 max-w-md">
              <div>
                <label
                  className="block text-sm mb-1 font-medium"
                  style={{ color: "var(--dashboard-main-text-muted)" }}
                >
                  Program adı
                </label>
                <ValidatedInput
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Örn: Başlangıç Full Body"
                  error={!name.trim() ? "Program adi zorunludur" : undefined}
                  disabled={busy === "create"}
                  style={{
                    backgroundColor: "var(--dashboard-card-bg)",
                    borderColor: "var(--dashboard-card-border)",
                    color: "var(--dashboard-main-text)",
                  }}
                />
              </div>
              <div>
                <label
                  className="block text-sm mb-1 font-medium"
                  style={{ color: "var(--dashboard-main-text-muted)" }}
                >
                  Açıklama (opsiyonel)
                </label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Programın kısa tanımı..."
                  rows={2}
                  disabled={busy === "create"}
                  className="w-full rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 disabled:opacity-50"
                  style={{
                    backgroundColor: "var(--dashboard-card-bg)",
                    borderColor: "var(--dashboard-card-border)",
                    color: "var(--dashboard-main-text)",
                    border: "1px solid var(--dashboard-card-border)",
                  }}
                />
              </div>
              <div className="flex items-center gap-2">
                <label
                  className="text-sm"
                  style={{ color: "var(--dashboard-main-text-muted)" }}
                >
                  Hafta sayısı:
                </label>
                <Input
                  type="number"
                  value={weeks}
                  onChange={(e) => setWeeks(Number(e.target.value))}
                  className="w-20"
                  disabled={busy === "create"}
                  style={{
                    backgroundColor: "var(--dashboard-card-bg)",
                    borderColor: "var(--dashboard-card-border)",
                    color: "var(--dashboard-main-text)",
                  }}
                  min={1}
                  max={52}
                />
              </div>
              <div className="pt-2">
                <Button
                  onClick={handleScratch}
                  disabled={busy === "create" || !name.trim()}
                  className="font-semibold hover:opacity-90"
                  style={{
                    backgroundColor: "var(--dashboard-accent)",
                    color: "var(--dashboard-accent-text)",
                  }}
                >
                  {busy === "create" ? "Oluşturuluyor..." : "Oluştur ve Düzenle"}
                </Button>
              </div>
            </div>
          )}
        </div>

        {/* Footer (only when error) */}
        {error && (
          <div
            className="px-5 py-3 border-t text-sm"
            style={{ borderColor: "var(--dashboard-card-border)", color: "#ef4444" }}
          >
            {error}
          </div>
        )}
      </div>
    </div>
  );
}

function PathCard({
  icon,
  title,
  description,
  onClick,
  accent = false,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
  onClick: () => void;
  accent?: boolean;
}) {
  return (
    <button
      onClick={onClick}
      className="text-left p-4 rounded-xl border transition-all hover:scale-[1.02] hover:shadow-md"
      style={{
        borderColor: accent ? "var(--dashboard-accent)" : "var(--dashboard-card-border)",
        backgroundColor: accent
          ? "color-mix(in srgb, var(--dashboard-accent) 8%, transparent)"
          : "color-mix(in srgb, var(--dashboard-main-text) 3%, transparent)",
      }}
    >
      <div
        className="mb-3 inline-flex h-10 w-10 items-center justify-center rounded-full"
        style={{
          backgroundColor: "color-mix(in srgb, var(--dashboard-accent) 18%, transparent)",
          color: "var(--dashboard-accent)",
        }}
      >
        {icon}
      </div>
      <h3 className="font-semibold text-sm mb-1">{title}</h3>
      <p
        className="text-xs"
        style={{ color: "var(--dashboard-main-text-muted)" }}
      >
        {description}
      </p>
    </button>
  );
}

function SearchBar({
  value,
  onChange,
  placeholder,
}: {
  value: string;
  onChange: (v: string) => void;
  placeholder: string;
}) {
  return (
    <div className="relative">
      <Search
        className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 opacity-50"
        style={{ color: "var(--dashboard-main-text-muted)" }}
      />
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full pl-10 pr-3 py-2 rounded-lg outline-none text-sm border"
        style={{
          backgroundColor: "color-mix(in srgb, var(--dashboard-main-text) 4%, transparent)",
          borderColor: "var(--dashboard-card-border)",
          color: "var(--dashboard-main-text)",
        }}
      />
    </div>
  );
}
