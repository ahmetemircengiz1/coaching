"use client";

import { useState, useEffect } from "react";
import { toast } from "sonner";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { deleteProgram, duplicateProgram, importProgramFromFile, updateProgram } from "@/app/site/[domain]/dashboard/programs/actions";
import { ImportDialog, PROGRAM_FORMAT_EXAMPLE } from "@/components/dashboard/import-dialog";
import { ConfirmDialog, useConfirmDialog } from "@/components/dashboard/confirm-dialog";
import { AssignToStudentsModal } from "@/components/dashboard/assign-to-students-modal";
import { NewProgramWizard } from "@/components/dashboard/new-program-wizard";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Pencil } from "lucide-react";

interface ProgramData {
  id: string;
  name: string;
  description: string | null;
  weeks: number;
  assignedStudents: number;
  assignedStudentsPreview: { id: string; name: string }[];
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

  const [showWizard, setShowWizard] = useState(false);
  const [showImportDialog, setShowImportDialog] = useState(false);
  const [assignTarget, setAssignTarget] = useState<{ id: string; name: string } | null>(null);
  const { confirm, dialogProps } = useConfirmDialog();
  // Program rename state
  const [renamingId, setRenamingId] = useState<string | null>(null);
  const [renameDraft, setRenameDraft] = useState("");

  const savePrgRename = async (prg: ProgramData) => {
    const next = renameDraft.trim();
    if (!next || next === prg.name) {
      setRenamingId(null);
      return;
    }
    setLocalPrograms((prev) => prev.map((p) => (p.id === prg.id ? { ...p, name: next } : p)));
    setRenamingId(null);
    const result = await updateProgram(domain, prg.id, {
      name: next,
      description: prg.description || undefined,
      weeks: prg.weeks,
    });
    if (!result.success) {
      toast.error(("error" in result && result.error) || "Program adı güncellenemedi");
      setLocalPrograms((prev) => prev.map((p) => (p.id === prg.id ? { ...p, name: prg.name } : p)));
    } else {
      router.refresh();
    }
  };

  const handleDelete = async (id: string) => {
    const program = localPrograms.find(p => p.id === id);
    const desc = program && program.assignedStudents > 0
      ? `"${program.name}" programi ${program.assignedStudents} ogrenciye atanmis. Bu islem geri alinamaz.`
      : `"${program?.name || "Bu program"}" programi kalici olarak silinecek.`;
    const confirmed = await confirm({
      title: "Programi Sil",
      description: desc,
      confirmText: "Sil",
      variant: "danger",
    });
    if (!confirmed) return;

    setLocalPrograms(prev => prev.filter(p => p.id !== id));

    const result = await deleteProgram(domain, id);
    if (!result.success) {
      toast.error("error" in result ? result.error : "Hata olustu");
      setLocalPrograms(programs);
    }
  };

  const handleDuplicate = async (id: string) => {
    const result = await duplicateProgram(domain, id);
    if (result.success && "programId" in result) {
      router.push(`/site/${domain}/dashboard/programs/${result.programId}`);
    } else {
      toast.error("error" in result ? result.error : "Kopyalama hatası");
    }
  };

  return (
    <div className="space-y-6 py-6" style={{ color: "var(--dashboard-main-text)" }}>
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-heading text-xl font-bold">Programlar</h1>
          <p className="text-sm mt-1" style={{ color: "var(--dashboard-main-text-muted)" }}>{localPrograms.length} program</p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => setShowImportDialog(true)}
            className="text-xs underline transition-opacity hover:opacity-70"
            style={{ color: "var(--dashboard-main-text-muted)" }}
          >
            Dosyadan aktar
          </button>
          <Button
            onClick={() => setShowWizard(true)}
            style={{ backgroundColor: "var(--dashboard-accent)", color: "var(--dashboard-accent-text)" }}
            className="font-semibold hover:opacity-90"
          >
            + Program Oluştur
          </Button>
        </div>
      </div>

      {/* Program Listesi */}
      {localPrograms.length === 0 ? (
        <Card className="animate-fade-in" style={{ backgroundColor: "var(--dashboard-card-bg)", borderColor: "var(--dashboard-card-border)" }}>
          <CardContent className="py-16 text-center">
            <p className="text-4xl mb-3">📋</p>
            <p className="text-lg font-medium mb-1" style={{ color: "var(--dashboard-main-text-muted)" }}>
              Henüz program yok
            </p>
            <p className="text-sm mb-6 max-w-md mx-auto" style={{ color: "var(--dashboard-main-text-muted)", opacity: 0.7 }}>
              Hazır şablonlardan başla veya sıfırdan oluştur — sihirbaz seni yönlendirir.
            </p>
            <Button
              onClick={() => setShowWizard(true)}
              style={{ backgroundColor: "var(--dashboard-accent)", color: "var(--dashboard-accent-text)" }}
              className="font-semibold hover:opacity-90"
            >
              + Program Oluştur
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4 stagger-children">
          {localPrograms.map((program) => (
            <Card
              key={program.id}
              className="transition hover:opacity-90 animate-fade-in-up dashboard-card-hover"
              style={{ backgroundColor: "var(--dashboard-card-bg)", borderColor: "var(--dashboard-card-border)" }}
            >
              <CardHeader className="pb-2">
                <div className="flex items-start justify-between">
                  {renamingId === program.id ? (
                    <Input
                      autoFocus
                      value={renameDraft}
                      onChange={(e) => setRenameDraft(e.target.value)}
                      onBlur={() => savePrgRename(program)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") savePrgRename(program);
                        if (e.key === "Escape") setRenamingId(null);
                      }}
                      className="text-lg font-semibold h-auto py-1 px-2 flex-1 mr-2"
                      style={{
                        backgroundColor: "var(--dashboard-main-bg)",
                        borderColor: "var(--dashboard-card-border)",
                        color: "var(--dashboard-main-text)",
                      }}
                    />
                  ) : (
                    <CardTitle
                      className="text-lg inline-flex items-center gap-2 group cursor-pointer"
                      style={{ color: "var(--dashboard-main-text)" }}
                      onClick={() => {
                        setRenameDraft(program.name);
                        setRenamingId(program.id);
                      }}
                      title="Tıklayıp adı değiştir"
                    >
                      {program.name}
                      <Pencil className="h-3 w-3 opacity-0 group-hover:opacity-60 transition-opacity" />
                    </CardTitle>
                  )}
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
                <div className="flex items-center justify-between text-sm mb-4" style={{ color: "var(--dashboard-main-text-muted)", opacity: 0.7 }}>
                  <span>{program.weeks} hafta</span>
                  {program.assignedStudents > 0 ? (
                    <div className="flex items-center gap-1.5">
                      <div className="flex -space-x-2">
                        {program.assignedStudentsPreview.map((s) => (
                          <div
                            key={s.id}
                            title={s.name}
                            className="w-6 h-6 rounded-full border-2 flex items-center justify-center text-[10px] font-semibold"
                            style={{
                              backgroundColor: "color-mix(in srgb, var(--dashboard-accent) 20%, var(--dashboard-card-bg))",
                              color: "var(--dashboard-accent)",
                              borderColor: "var(--dashboard-card-bg)",
                            }}
                          >
                            {s.name.charAt(0).toUpperCase()}
                          </div>
                        ))}
                      </div>
                      {program.assignedStudents > program.assignedStudentsPreview.length && (
                        <span className="text-xs opacity-80">
                          +{program.assignedStudents - program.assignedStudentsPreview.length}
                        </span>
                      )}
                    </div>
                  ) : (
                    <span className="text-xs opacity-60">Atanmamış</span>
                  )}
                </div>
                <div className="flex gap-2">
                  <Link href={`/site/${domain}/dashboard/programs/${program.id}`} className="flex-1">
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
                  <Button
                    onClick={() => setAssignTarget({ id: program.id, name: program.name })}
                    className="text-sm font-semibold hover:opacity-90"
                    style={{ backgroundColor: "var(--dashboard-accent)", color: "var(--dashboard-accent-text)" }}
                  >
                    Ata
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      <NewProgramWizard
        domain={domain}
        open={showWizard}
        onClose={() => setShowWizard(false)}
      />

      <ImportDialog
        open={showImportDialog}
        onClose={() => setShowImportDialog(false)}
        onImport={async (raw) => {
          const result = await importProgramFromFile(domain, raw);
          if (result.success) router.refresh();
          return result;
        }}
        title="Antrenman Programı İçe Aktar"
        description="Düz metin, Excel/CSV veya JSON formatında hazır programını kütüphanene ekle."
        formatExample={PROGRAM_FORMAT_EXAMPLE}
        kind="program"
      />
      <ConfirmDialog {...dialogProps} />

      <AssignToStudentsModal
        domain={domain}
        kind="program"
        planId={assignTarget?.id ?? ""}
        planName={assignTarget?.name ?? ""}
        open={!!assignTarget}
        onClose={() => setAssignTarget(null)}
        onAssigned={() => {
          router.refresh();
        }}
      />
    </div>
  );
}
