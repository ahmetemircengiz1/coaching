/**
 * Basit CSV parser. Türk Excel'ini destekler (noktalı virgül veya virgül ayırıcı,
 * tırnak içinde virgül/noktalı virgül kabul, UTF-8 BOM otomatik temizlenir).
 *
 * Dependency yok — küçük dosyalar için yeterli (max ~5000 satır, 256KB).
 */

export function detectDelimiter(firstLine: string): "," | ";" {
  const commas = (firstLine.match(/,/g) || []).length;
  const semis = (firstLine.match(/;/g) || []).length;
  return semis > commas ? ";" : ",";
}

export function parseCsv(input: string): string[][] {
  // BOM temizle
  let text = input;
  if (text.charCodeAt(0) === 0xfeff) text = text.slice(1);

  // İlk gerçek satırdan ayırıcıyı bul
  const firstLine = text.split(/\r?\n/).find((l) => l.trim()) ?? "";
  const delim = detectDelimiter(firstLine);

  const rows: string[][] = [];
  let row: string[] = [];
  let cell = "";
  let inQuotes = false;

  for (let i = 0; i < text.length; i++) {
    const c = text[i];
    const next = text[i + 1];

    if (inQuotes) {
      if (c === '"' && next === '"') {
        // Escaped quote
        cell += '"';
        i++;
      } else if (c === '"') {
        inQuotes = false;
      } else {
        cell += c;
      }
      continue;
    }

    if (c === '"') {
      inQuotes = true;
      continue;
    }
    if (c === delim) {
      row.push(cell);
      cell = "";
      continue;
    }
    if (c === "\r") continue;
    if (c === "\n") {
      row.push(cell);
      if (row.some((v) => v.trim())) rows.push(row);
      row = [];
      cell = "";
      continue;
    }
    cell += c;
  }
  // Son hücre
  if (cell.length > 0 || row.length > 0) {
    row.push(cell);
    if (row.some((v) => v.trim())) rows.push(row);
  }
  return rows;
}

/** Tek satırı CSV güvenli string'e çevir (gerekirse tırnak içine al). */
export function toCsvCell(value: string | number | undefined | null): string {
  if (value === undefined || value === null) return "";
  const s = String(value);
  if (s.includes(",") || s.includes(";") || s.includes('"') || s.includes("\n")) {
    return `"${s.replace(/"/g, '""')}"`;
  }
  return s;
}

export function toCsvRow(values: (string | number | undefined | null)[], delim: "," | ";" = ","): string {
  return values.map(toCsvCell).join(delim);
}

/** UTF-8 BOM ekleyerek Excel'de Türkçe karakter doğru görünsün. */
export function withBom(text: string): string {
  return "﻿" + text;
}

/** Tarayıcıda dosya olarak indir. */
export function downloadCsv(filename: string, csv: string): void {
  const blob = new Blob([withBom(csv)], { type: "text/csv;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  setTimeout(() => {
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }, 0);
}
