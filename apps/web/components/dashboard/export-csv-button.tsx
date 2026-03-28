"use client";

interface CheckInRow {
  weekNumber: number;
  date: string;
  weight: number | null;
  bodyFat: number | null;
  chest: number | null;
  waist: number | null;
  hips: number | null;
  arms: number | null;
  thighs: number | null;
  energyLevel: number | null;
  sleepQuality: number | null;
  stressLevel: number | null;
  compliance: number | null;
  notes: string | null;
}

export function ExportCSVButton({
  studentName,
  checkIns,
}: {
  studentName: string;
  checkIns: CheckInRow[];
}) {
  const handleExport = () => {
    const headers = [
      "Hafta", "Tarih", "Kilo (kg)", "Yağ (%)", "Göğüs (cm)",
      "Bel (cm)", "Kalça (cm)", "Kol (cm)", "Bacak (cm)",
      "Enerji", "Uyku", "Stres", "Uyum (%)", "Notlar",
    ];

    const rows = checkIns.map((c) => [
      c.weekNumber,
      new Date(c.date).toLocaleDateString("tr-TR"),
      c.weight ?? "",
      c.bodyFat ?? "",
      c.chest ?? "",
      c.waist ?? "",
      c.hips ?? "",
      c.arms ?? "",
      c.thighs ?? "",
      c.energyLevel ?? "",
      c.sleepQuality ?? "",
      c.stressLevel ?? "",
      c.compliance ?? "",
      (c.notes || "").replace(/"/g, '""'),
    ]);

    const csvContent = [
      headers.join(","),
      ...rows.map((r) => r.map((v) => `"${v}"`).join(",")),
    ].join("\n");

    const BOM = "\uFEFF";
    const blob = new Blob([BOM + csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `${studentName.replace(/\s+/g, "_")}_checkin_verileri.csv`;
    link.click();
    URL.revokeObjectURL(url);
  };

  if (checkIns.length === 0) return null;

  return (
    <button
      onClick={handleExport}
      className="text-xs px-3 py-1.5 rounded-lg border transition hover:opacity-80"
      style={{
        borderColor: "var(--dashboard-card-border)",
        color: "var(--dashboard-main-text-muted)",
        backgroundColor: "var(--dashboard-card-bg)",
      }}
    >
      CSV Olarak İndir
    </button>
  );
}
