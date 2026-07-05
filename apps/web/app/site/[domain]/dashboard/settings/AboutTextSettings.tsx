"use client";

import { useEffect, useRef, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { updateCoachSettings } from "../actions";
import { notifyPreviewRefresh } from "@/src/lib/preview-bus";

interface AboutTextSettingsProps {
  domain: string;
  initialAboutText: string;
  onSaved?: (text: string) => void;
}

export function AboutTextSettings({ domain, initialAboutText, onSaved }: AboutTextSettingsProps) {
  const [text, setText] = useState(initialAboutText);
  const debounceRef = useRef<ReturnType<typeof setTimeout>>(null);
  const initialRef = useRef(initialAboutText);

  useEffect(() => {
    if (text === initialRef.current) return;

    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(async () => {
      await updateCoachSettings(domain, { aboutText: text || null });
      initialRef.current = text;
      notifyPreviewRefresh();
      onSaved?.(text);
    }, 1500);
  }, [text, domain, onSaved]);

  return (
    <Card style={{ backgroundColor: "var(--dashboard-card-bg)", borderColor: "var(--dashboard-card-border)", color: "var(--dashboard-main-text)" }}>
      <CardHeader>
        <CardTitle className="text-lg">Hakkimizda Metni</CardTitle>
        <p className="text-sm" style={{ color: "var(--dashboard-main-text-muted)" }}>
          Navbar&apos;daki &quot;Hakkimizda&quot; linkine tiklandiginda acilacak sayfada gorunecek metin.
          Bos birakirsaniz bio metniniz gosterilir.
        </p>
      </CardHeader>
      <CardContent>
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Kendinizden, koçluk felsefenizden, deneyimlerinizden bahsedin..."
          rows={8}
          maxLength={5000}
          className="w-full rounded-lg border px-4 py-3 text-sm bg-transparent outline-none resize-y"
          style={{
            borderColor: "var(--dashboard-card-border)",
            color: "var(--dashboard-main-text)",
          }}
        />
        <div className="flex items-center justify-between mt-2">
          <span className="text-xs" style={{ color: "var(--dashboard-main-text-muted)" }}>
            {text.length}/5000
          </span>
          <span className="text-xs" style={{ color: "var(--dashboard-main-text-muted)" }}>
            Otomatik kaydedilir
          </span>
        </div>
      </CardContent>
    </Card>
  );
}
