"use client";

export function ProgressRing({
  value,
  size = 120,
  stroke = 10,
  label,
}: {
  value: number;
  size?: number;
  stroke?: number;
  label?: string;
}) {
  const r = (size - stroke) / 2;
  const c = 2 * Math.PI * r;
  const pct = Math.max(0, Math.min(100, value));
  const offset = c - (pct / 100) * c;
  const compact = size < 72;

  return (
    <div
      className="relative inline-flex items-center justify-center drop-shadow-[0_0_8px_rgba(70,72,212,0.3)]"
      style={{ width: size, height: size }}
    >
      <svg width={size} height={size} className="-rotate-90" aria-hidden>
        <circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          fill="none"
          stroke="var(--surface-container-low)"
          strokeWidth={stroke}
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          fill="none"
          stroke="var(--primary)"
          strokeWidth={stroke}
          strokeLinecap="round"
          strokeDasharray={c}
          strokeDashoffset={offset}
          className="transition-all duration-700 ease-out"
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span
          className={
            compact
              ? "text-[0.6875rem] font-bold tabular text-primary"
              : "text-2xl font-bold tabular text-on-surface"
          }
        >
          {pct}%
        </span>
        {label && !compact ? (
          <span className="text-xs text-on-surface-variant">{label}</span>
        ) : null}
      </div>
    </div>
  );
}
