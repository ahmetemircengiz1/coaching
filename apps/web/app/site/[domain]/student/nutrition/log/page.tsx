import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getStudentMealLog } from "../meal-log-actions";
import { MealLogDayView } from "@/components/student/meal-log-day-view";
import { MealLogHistory } from "@/components/student/meal-log-history";

// Yeni güne geçişte "bugünkü yemekler" slot'larının sıfırlanması için cache bypass.
export const dynamic = "force-dynamic";

export default async function MealLogPage({
  params,
  searchParams,
}: {
  params: Promise<{ domain: string }>;
  searchParams: Promise<{ days?: string }>;
}) {
  const { domain } = await params;
  const sp = await searchParams;
  const daysBack = Math.min(Math.max(parseInt(sp.days || "30", 10) || 30, 7), 90);
  const window = await getStudentMealLog(domain, daysBack);

  const todayIso = new Date().toLocaleDateString("en-CA");
  const todayEntries = window.days.find((d) => d.date === todayIso)?.entries || [];

  return (
    <div className="space-y-5 py-6">
      <div className="flex items-center justify-between">
        <Link
          href={`/site/${domain}/student`}
          className="inline-flex items-center gap-1.5 text-sm hover:opacity-70"
          style={{ color: "var(--dashboard-main-text-muted)" }}
        >
          <ArrowLeft className="w-4 h-4" />
          Anasayfa
        </Link>
      </div>

      <div>
        <h1 className="font-heading text-2xl font-bold">Yemek Log&apos;u</h1>
        <p className="text-sm mt-1" style={{ color: "var(--dashboard-main-text-muted)" }}>
          Bugünkü öğünlerinin fotoğrafını yükle. Koçun gerçek beslenmeni görsün, doğru yönlendirme yapabilsin.
        </p>
      </div>

      {/* Bugünkü 4 öğün */}
      <Card
        className="border"
        style={{
          backgroundColor: "var(--dashboard-glass-bg, var(--dashboard-card-bg))",
          borderColor: "var(--dashboard-card-border)",
          borderRadius: "var(--dashboard-card-radius)",
          boxShadow: "var(--dashboard-card-shadow)",
        }}
      >
        <CardHeader>
          <CardTitle className="text-base">Bugün</CardTitle>
        </CardHeader>
        <CardContent>
          <MealLogDayView domain={domain} date={todayIso} entries={todayEntries} />
        </CardContent>
      </Card>

      {/* Geçmiş */}
      <Card
        className="border"
        style={{
          backgroundColor: "var(--dashboard-glass-bg, var(--dashboard-card-bg))",
          borderColor: "var(--dashboard-card-border)",
          borderRadius: "var(--dashboard-card-radius)",
          boxShadow: "var(--dashboard-card-shadow)",
        }}
      >
        <CardHeader>
          <CardTitle className="text-base">Son {daysBack} Gün</CardTitle>
        </CardHeader>
        <CardContent>
          <MealLogHistory window={window} />
        </CardContent>
      </Card>

      {daysBack < 90 && (
        <div className="text-center">
          <Link
            href={`/site/${domain}/student/nutrition/log?days=${Math.min(daysBack + 30, 90)}`}
            className="inline-block text-sm font-medium px-4 py-2 rounded-lg border hover:opacity-80"
            style={{
              borderColor: "var(--dashboard-card-border)",
              color: "var(--dashboard-main-text)",
            }}
          >
            Daha eski göster ({Math.min(daysBack + 30, 90)} gün)
          </Link>
        </div>
      )}
    </div>
  );
}
