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
            tick={{ fill: "var(--muted)", fontSize: 12 }}
          />
          <YAxis
            allowDecimals={false}
            tickLine={false}
            axisLine={false}
            tick={{ fill: "var(--muted)", fontSize: 12 }}
          />
          <Tooltip
            cursor={{ fill: "rgba(99,102,241,0.08)" }}
            contentStyle={{
              borderRadius: 12,
              border: "1px solid var(--glass-border)",
              background: "var(--glass)",
              backdropFilter: "blur(12px)",
            }}
          />
          <Bar dataKey="value" fill="#6366F1" radius={[8, 8, 4, 4]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
