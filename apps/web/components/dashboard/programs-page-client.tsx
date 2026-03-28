"use client";

import { useState, useTransition, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { createProgram, deleteProgram, duplicateProgram, importTemplateProgram } from "@/app/site/[domain]/dashboard/programs/actions";
import { PROGRAM_TEMPLATES, LEVEL_LABELS, LEVEL_COLORS } from "@/lib/data/program-templates";
import { useRouter } from "next/navigation";
import Link from "next/link";

interface ProgramData {
  id: string;
  name: string;
  description: string | null;
  weeks: number;
  assignedStudents: number;
}

export default function ProgramsPageClient({
  domain,
  programs,
}: {
  domain: string;
  programs: ProgramData[];
}) {
  const router = useRouter();

  const [localPrograms, setLocalPrograms] = useState<ProgramData[]>(programs);
  useEffect(() => {
    setLocalPrograms(programs);
  }, [programs]);

  const [showCreate, setShowCreate] = useState(false);
  const [showTemplates, setShowTemplates] = useState(false);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [weeks, setWeeks] = useState(4);
  const [loading, setLoading] = useState(false);
  const [importing, setImporting] = useState<string | null>(null);

  const handleCreate = async () => {
    if (!name.trim()) return;
    setLoading(true);
    const result = await createProgram(domain, {
      name: name.trim(),
      description: description.trim() || undefined,
      weeks,
    });
    setLoading(false);
    if (result.success) {
      router.push(`/site/${domain}/dashboard/programs/${result.programId}`);
    }
  };

  const handleDelete = async (id: string) => {
    const program = localPrograms.find(p => p.id === id);
    const msg = program && program.assignedStudents > 0
      ? `"${program.name}" programı ${program.assignedStudents} öğrenciye atanmış. Silmek istediğine emin misin?`
      : `"${program?.name || "Bu program"}" programını silmek istediğine emin misin?`;
    if (!confirm(msg)) return;

    // Optimistic delete
    setLocalPrograms(prev => prev.filter(p => p.id !== id));

    const result = await deleteProgram(domain, id);
    if (!result.success) {
      alert("error" in result ? result.error : "Hata oluştu");
      setLocalPrograms(programs); // Revert
    }
  };

  const handleDuplicate = async (id: string) => {
    const result = await duplicateProgram(domain, id);
    if (result.success && "programId" in result) {
      router.push(`/site/${domain}/dashboard/programs/${result.programId}`);
    } else {
      alert("error" in result ? result.error : "Kopyalama hatası");
    }
  };

  const handleImportTemplate = async (templateId: string) => {
    setImporting(templateId);
    const result = await importTemplateProgram(domain, templateId);
    if (result.success && "programId" in result) {
      router.push(`/site/${domain}/dashboard/programs/${result.programId}`);
    } else {
      alert("error" in result ? result.error : "İçe aktarma hatası");
    }
    setImporting(null);
  };

  return (
    <div className="space-y-6 py-6" style={{ color: "var(--dashboard-main-text)" }}>
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-heading text-xl font-bold">Program Şablonları</h1>
          <p className="text-sm mt-1" style={{ color: "var(--dashboard-main-text-muted)" }}>{localPrograms.length} program</p>
        </div>
        <div className="flex gap-2">
          <Button
            onClick={() => { setShowTemplates(!showTemplates); setShowCreate(false); }}
            className="font-medium text-sm border rounded-md px-4 py-2"
            style={{
              backgroundColor: "transparent",
              borderColor: "var(--dashboard-card-border)",
              color: "var(--dashboard-main-text)",
            }}
          >
            Hazır Şablonlar
          </Button>
          <Button
            onClick={() => { setShowCreate(!showCreate); setShowTemplates(false); }}
            style={{ backgroundColor: "var(--dashboard-accent)", color: "var(--dashboard-accent-text)" }}
            className="font-semibold hover:opacity-90"
          >
            + Yeni Program
          </Button>
        </div>
      </div>

      {/* Hazır Şablonlar */}
      {showTemplates && (
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <h2 className="text-sm font-semibold" style={{ color: "var(--dashboard-main-text-muted)" }}>Hazır Program Şablonları</h2>
            <span className="text-[10px] bg-blue-500/20 text-blue-300 px-2 py-0.5 rounded-full">
              Tek tıkla içe aktar
            </span>
          </div>
          <div className="grid md:grid-cols-3 gap-4 stagger-children">
            {PROGRAM_TEMPLATES.map((t) => (
              <Card key={t.id} className="animate-fade-in-up dashboard-card-hover" style={{ backgroundColor: "var(--dashboard-card-bg)", borderColor: "var(--dashboard-card-border)" }}>
                <CardContent className="p-4 space-y-3">
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="font-semibold text-sm" style={{ color: "var(--dashboard-main-text)" }}>{t.name}</h3>
                      <span className={`inline-block mt-1 text-[10px] px-2 py-0.5 rounded-full border ${LEVEL_COLORS[t.level]}`}>
                        {LEVEL_LABELS[t.level]}
                      </span>
                    </div>
                  </div>
                  <p className="text-xs" style={{ color: "var(--dashboard-main-text-muted)" }}>{t.description}</p>
                  <div className="flex gap-3 text-xs" style={{ color: "var(--dashboard-main-text-muted)", opacity: 0.7 }}>
                    <span>{t.weeks} hafta</span>
                    <span>{t.daysPerWeek} gün/hafta</span>
                  </div>
                  <div className="text-[11px]" style={{ color: "var(--dashboard-main-text-muted)", opacity: 0.6 }}>
                    Hedef: {t.goal}
                  </div>

                  {/* Örnek günler */}
                  <div className="space-y-1">
                    {t.template[0].workouts.slice(0, 3).map((w, i) => (
                      <div key={i} className="flex items-center gap-2 text-[11px]">
                        <span style={{ color: "var(--dashboard-main-text-muted)", opacity: 0.5 }} className="w-12">
                          {["Pzt", "Sal", "Çar", "Per", "Cum", "Cmt", "Paz"][w.dayOfWeek - 1]}
                        </span>
                        <span style={{ color: "var(--dashboard-main-text-muted)" }}>{w.name}</span>
                        <span style={{ color: "var(--dashboard-main-text-muted)", opacity: 0.5 }}>({w.exercises.length} egz.)</span>
                      </div>
                    ))}
                    {t.template[0].workouts.length > 3 && (
                      <p className="text-[10px]" style={{ color: "var(--dashboard-main-text-muted)", opacity: 0.5 }}>+{t.template[0].workouts.length - 3} gün daha</p>
                    )}
                  </div>

                  <Button
                    onClick={() => handleImportTemplate(t.id)}
                    disabled={importing === t.id}
                    className="w-full bg-blue-500/20 text-blue-300 hover:bg-blue-500/30 border border-blue-500/20 text-sm"
                  >
                    {importing === t.id ? "İçe aktarılıyor..." : "Kütüphaneme Ekle"}
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* Program Oluşturma Formu */}
      {showCreate && (
        <Card style={{ backgroundColor: "var(--dashboard-card-bg)", borderColor: "var(--dashboard-card-border)" }}>
          <CardContent className="p-4 space-y-3">
            <h3 className="font-semibold" style={{ color: "var(--dashboard-main-text)" }}>Yeni Program Oluştur</h3>
            <Input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Program adı (örn: Başlangıç Full Body)"
              disabled={loading}
              style={{ backgroundColor: "var(--dashboard-card-bg)", borderColor: "var(--dashboard-card-border)", color: "var(--dashboard-main-text)" }}
            />
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Açıklama (opsiyonel)"
              rows={2}
              disabled={loading}
              className="w-full rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 disabled:opacity-50"
              style={{
                backgroundColor: "var(--dashboard-card-bg)",
                borderColor: "var(--dashboard-card-border)",
                color: "var(--dashboard-main-text)",
                border: "1px solid var(--dashboard-card-border)",
              }}
            />
            <div className="flex items-center gap-2">
              <label className="text-sm" style={{ color: "var(--dashboard-main-text-muted)" }}>Hafta sayısı:</label>
              <Input
                type="number"
                value={weeks}
                onChange={(e) => setWeeks(Number(e.target.value))}
                className="w-20"
                disabled={loading}
                style={{ backgroundColor: "var(--dashboard-card-bg)", borderColor: "var(--dashboard-card-border)", color: "var(--dashboard-main-text)" }}
                min={1}
                max={52}
              />
            </div>
            <div className="flex gap-2">
              <Button
                onClick={handleCreate}
                disabled={loading || !name.trim()}
                style={{ backgroundColor: "var(--dashboard-accent)", color: "var(--dashboard-accent-text)" }}
                className="font-semibold hover:opacity-90"
              >
                {loading ? "Oluşturuluyor..." : "Oluştur ve Düzenle"}
              </Button>
              <Button
                onClick={() => setShowCreate(false)}
                disabled={loading}
                className="border rounded-md px-4 py-2"
                style={{
                  backgroundColor: "transparent",
                  borderColor: "var(--dashboard-card-border)",
                  color: "var(--dashboard-main-text)",
                }}
              >
                İptal
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Program Listesi */}
      {localPrograms.length === 0 && !showCreate && !showTemplates ? (
        <Card className="animate-fade-in" style={{ backgroundColor: "var(--dashboard-card-bg)", borderColor: "var(--dashboard-card-border)" }}>
          <CardContent className="py-16 text-center">
            <p className="text-4xl mb-3">📋</p>
            <p className="text-lg font-medium mb-1" style={{ color: "var(--dashboard-main-text-muted)" }}>
              Henüz program şablonu yok
            </p>
            <p className="text-sm mb-6 max-w-md mx-auto" style={{ color: "var(--dashboard-main-text-muted)", opacity: 0.7 }}>
              Hazır şablonları kullanarak hızlıca başlayın veya sıfırdan oluşturun
            </p>
            <div className="flex gap-3 justify-center">
              <Button
                onClick={() => setShowTemplates(true)}
                className="border rounded-md px-4 py-2"
                style={{
                  backgroundColor: "transparent",
                  borderColor: "var(--dashboard-card-border)",
                  color: "var(--dashboard-main-text)",
                }}
              >
                Hazır Şablonları Gör
              </Button>
              <Button
                onClick={() => setShowCreate(true)}
                style={{ backgroundColor: "var(--dashboard-accent)", color: "var(--dashboard-accent-text)" }}
                className="font-semibold hover:opacity-90"
              >
                + Sıfırdan Oluştur
              </Button>
            </div>
          </CardContent>
        </Card>
      ) : localPrograms.length > 0 ? (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4 stagger-children">
          {localPrograms.map((program) => (
            <Card
              key={program.id}
              className="transition hover:opacity-90 animate-fade-in-up dashboard-card-hover"
              style={{ backgroundColor: "var(--dashboard-card-bg)", borderColor: "var(--dashboard-card-border)" }}
            >
              <CardHeader className="pb-2">
                <div className="flex items-start justify-between">
                  <CardTitle className="text-lg" style={{ color: "var(--dashboard-main-text)" }}>{program.name}</CardTitle>
                  <div className="flex gap-1">
                    <button
                      onClick={(e) => { e.preventDefault(); handleDuplicate(program.id); }}
                      className="text-xs px-2 py-1 rounded transition"
                      style={{ color: "var(--dashboard-main-text-muted)" }}
                    >
                      Kopyala
                    </button>
                    <button
                      onClick={(e) => { e.preventDefault(); handleDelete(program.id); }}
                      className="text-xs text-red-400/50 hover:text-red-400 px-2 py-1"
                    >
                      Sil
                    </button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-sm mb-4" style={{ color: "var(--dashboard-main-text-muted)" }}>
                  {program.description || "Açıklama yok"}
                </p>
                <div className="flex justify-between text-sm mb-4" style={{ color: "var(--dashboard-main-text-muted)", opacity: 0.7 }}>
                  <span>{program.weeks} hafta</span>
                  <span>{program.assignedStudents} öğrenci</span>
                </div>
                <Link href={`/site/${domain}/dashboard/programs/${program.id}`}>
                  <Button
                    className="w-full text-sm border rounded-md"
                    style={{
                      backgroundColor: "transparent",
                      borderColor: "var(--dashboard-card-border)",
                      color: "var(--dashboard-main-text)",
                    }}
                  >
                    Düzenle
                  </Button>
                </Link>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : null}
    </div>
  );
}
