"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { updateStudentNotes } from "@/app/site/[domain]/dashboard/students/assign-actions";

export function StudentNotes({
  domain,
  studentId,
  initialNotes,
  embedded,
}: {
  domain: string;
  studentId: string;
  initialNotes: string;
  embedded?: boolean;
}) {
  const router = useRouter();
  const [notes, setNotes] = useState(initialNotes);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  const handleSave = async () => {
    setSaving(true);
    await updateStudentNotes(domain, studentId, notes);
    setSaving(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
    router.refresh(); // Async background refresh
  };

  const content = (
    <div className="space-y-3">
      <p className="text-xs" style={{ color: "var(--dashboard-main-text-muted)" }}>
        Bu notlar sadece size görünür, öğrenci görmez.
      </p>
      <textarea
        value={notes}
        onChange={(e) => setNotes(e.target.value)}
        placeholder="Bu öğrenci hakkında notlarınızı yazın..."
        rows={4}
        className="w-full rounded-md px-3 py-2 text-sm resize-y"
        style={{
          backgroundColor: "var(--dashboard-main-bg)",
          border: "1px solid var(--dashboard-card-border)",
          color: "var(--dashboard-main-text)",
        }}
      />
      <Button
        onClick={handleSave}
        disabled={saving}
        style={{ backgroundColor: "var(--dashboard-accent)", color: "var(--dashboard-accent-text)" }}
        className="font-semibold text-sm hover:opacity-90"
      >
        {saving ? "Kaydediliyor..." : saved ? "Kaydedildi!" : "Notları Kaydet"}
      </Button>
    </div>
  );

  if (embedded) return content;

  return (
    <Card style={{ backgroundColor: "var(--dashboard-card-bg)", borderColor: "var(--dashboard-card-border)" }}>
      <CardHeader>
        <CardTitle className="text-lg">Koç Notları</CardTitle>
      </CardHeader>
      <CardContent>{content}</CardContent>
    </Card>
  );
}
