"use client";

import {
  Bar,
  BarChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

export default function WeeklyBarInner({
  data,
}: {
  data: { label: string; value: number }[];
}) {
  return (
    <div className="h-48 w-full" role="img" aria-label="Weekly habit completions">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} margin={{ top: 8, right: 8, left: -20, bottom: 0 }}>
          <XAxis
            dataKey="label"
            tickLine={false}
            axisLine={false}
            tick={{ fill: "var(--on-surface-variant)", fontSize: 12 }}
          />
          <YAxis
            allowDecimals={false}
            tickLine={false}
            axisLine={false}
            tick={{ fill: "var(--on-surface-variant)", fontSize: 12 }}
          />
          <Tooltip
            cursor={{ fill: "color-mix(in srgb, var(--primary) 16%, transparent)" }}
            contentStyle={{
              borderRadius: 12,
              border: "1px solid var(--card-border)",
              background: "var(--surface-container-lowest)",
            }}
          />
          <Bar dataKey="value" fill="var(--primary)" radius={[8, 8, 4, 4]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
