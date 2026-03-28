"use client";

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

interface WeightDataPoint {
  week: number;
  date: string;
  weight: number;
}

interface MeasurementDataPoint {
  week: number;
  date: string;
  chest?: number | null;
  waist?: number | null;
  hips?: number | null;
  arms?: number | null;
  thighs?: number | null;
  bodyFat?: number | null;
}

export function WeightChart({ data }: { data: WeightDataPoint[] }) {
  if (data.length < 2) return null;

  return (
    <div className="w-full h-[220px] mt-2">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data} margin={{ top: 5, right: 10, left: -10, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="var(--dashboard-card-border)" />
          <XAxis
            dataKey="week"
            tick={{ fontSize: 11, fill: "var(--dashboard-main-text-muted)" }}
            tickFormatter={(v) => `H${v}`}
            stroke="var(--dashboard-card-border)"
          />
          <YAxis
            domain={["dataMin - 1", "dataMax + 1"]}
            tick={{ fontSize: 11, fill: "var(--dashboard-main-text-muted)" }}
            tickFormatter={(v) => `${v}kg`}
            stroke="var(--dashboard-card-border)"
          />
          <Tooltip
            contentStyle={{
              backgroundColor: "var(--dashboard-card-bg)",
              border: "1px solid var(--dashboard-card-border)",
              borderRadius: 8,
              fontSize: 12,
              color: "var(--dashboard-main-text)",
            }}
            formatter={(value: any) => [`${value} kg`, "Kilo"]}
            labelFormatter={(label) => `Hafta ${label}`}
          />
          <Line
            type="monotone"
            dataKey="weight"
            stroke="var(--dashboard-accent)"
            strokeWidth={2}
            dot={{ r: 4, fill: "var(--dashboard-accent)" }}
            activeDot={{ r: 6 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}

const MEASUREMENT_LINES = [
  { key: "chest", label: "Göğüs", color: "#3b82f6" },
  { key: "waist", label: "Bel", color: "#ef4444" },
  { key: "hips", label: "Kalça", color: "#a855f7" },
  { key: "arms", label: "Kol", color: "#22c55e" },
  { key: "thighs", label: "Bacak", color: "#f59e0b" },
] as const;

export function MeasurementsChart({ data }: { data: MeasurementDataPoint[] }) {
  if (data.length < 2) return null;

  // Hangi ölçüm türleri var?
  const activeLines = MEASUREMENT_LINES.filter((line) =>
    data.some((d) => d[line.key] != null)
  );

  if (activeLines.length === 0) return null;

  return (
    <div className="w-full h-[220px] mt-2">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data} margin={{ top: 5, right: 10, left: -10, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="var(--dashboard-card-border)" />
          <XAxis
            dataKey="week"
            tick={{ fontSize: 11, fill: "var(--dashboard-main-text-muted)" }}
            tickFormatter={(v) => `H${v}`}
            stroke="var(--dashboard-card-border)"
          />
          <YAxis
            tick={{ fontSize: 11, fill: "var(--dashboard-main-text-muted)" }}
            tickFormatter={(v) => `${v}cm`}
            stroke="var(--dashboard-card-border)"
          />
          <Tooltip
            contentStyle={{
              backgroundColor: "var(--dashboard-card-bg)",
              border: "1px solid var(--dashboard-card-border)",
              borderRadius: 8,
              fontSize: 12,
              color: "var(--dashboard-main-text)",
            }}
            formatter={(value: any, name: any) => {
              const line = activeLines.find((l) => l.key === name);
              return [`${value} cm`, line?.label || name];
            }}
            labelFormatter={(label) => `Hafta ${label}`}
          />
          {activeLines.map((line) => (
            <Line
              key={line.key}
              type="monotone"
              dataKey={line.key}
              stroke={line.color}
              strokeWidth={2}
              dot={{ r: 3, fill: line.color }}
              connectNulls
            />
          ))}
        </LineChart>
      </ResponsiveContainer>
      {/* Legend */}
      <div className="flex flex-wrap gap-3 mt-2 justify-center">
        {activeLines.map((line) => (
          <div key={line.key} className="flex items-center gap-1 text-xs" style={{ color: "var(--dashboard-main-text-muted)" }}>
            <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: line.color }} />
            {line.label}
          </div>
        ))}
      </div>
    </div>
  );
}
