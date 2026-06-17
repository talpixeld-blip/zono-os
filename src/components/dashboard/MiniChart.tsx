import type { Tone } from "@/types";

const strokeFor: Record<Tone, string> = {
  purple: "#7c3aed",
  blue: "#6366f1",
  gold: "#f5c451",
  green: "#22c55e",
  red: "#ef4444",
};

interface MiniChartProps {
  series: number[]; // values 0–1
  type: "line" | "bar";
  tone: Tone;
  width?: number;
  height?: number;
}

/** Tiny dependency-free SVG sparkline / bar chart for stat cards. */
export function MiniChart({
  series,
  type,
  tone,
  width = 120,
  height = 40,
}: MiniChartProps) {
  const color = strokeFor[tone];
  const n = series.length;
  const pad = 3;
  const w = width - pad * 2;
  const h = height - pad * 2;

  if (type === "bar") {
    const gap = 3;
    const bw = (w - gap * (n - 1)) / n;
    return (
      <svg width={width} height={height} className="overflow-visible">
        {series.map((v, i) => {
          const bh = Math.max(2, v * h);
          return (
            <rect
              key={i}
              x={pad + i * (bw + gap)}
              y={pad + (h - bh)}
              width={bw}
              height={bh}
              rx={2}
              fill={color}
              opacity={0.45 + v * 0.55}
            />
          );
        })}
      </svg>
    );
  }

  const points = series.map((v, i) => {
    const x = pad + (i / (n - 1)) * w;
    const y = pad + (1 - v) * h;
    return [x, y] as const;
  });
  const linePath = points
    .map(([x, y], i) => `${i === 0 ? "M" : "L"} ${x.toFixed(1)} ${y.toFixed(1)}`)
    .join(" ");
  const areaPath = `${linePath} L ${points[n - 1][0].toFixed(1)} ${height - pad} L ${pad} ${height - pad} Z`;
  const gradId = `mc-${tone}-${n}`;

  return (
    <svg width={width} height={height} className="overflow-visible">
      <defs>
        <linearGradient id={gradId} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={color} stopOpacity="0.25" />
          <stop offset="100%" stopColor={color} stopOpacity="0" />
        </linearGradient>
      </defs>
      <path d={areaPath} fill={`url(#${gradId})`} />
      <path
        d={linePath}
        fill="none"
        stroke={color}
        strokeWidth={2.2}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <circle cx={points[n - 1][0]} cy={points[n - 1][1]} r={3} fill={color} />
    </svg>
  );
}
