import { cn, clamp } from "@/lib/utils";

export interface ScoreCardProps {
  /** Score value, 0–100. */
  score: number;
  label: string;
  /** Smaller helper text under the label. */
  hint?: string;
  size?: "sm" | "md" | "lg";
  className?: string;
}

function toneForScore(score: number): { ring: string; text: string } {
  if (score >= 80) return { ring: "text-success", text: "text-success" };
  if (score >= 60) return { ring: "text-brand", text: "text-brand" };
  if (score >= 40) return { ring: "text-warning", text: "text-warning" };
  return { ring: "text-danger", text: "text-danger" };
}

const sizeMap = {
  sm: { box: 56, stroke: 5, font: "text-sm" },
  md: { box: 76, stroke: 6, font: "text-lg" },
  lg: { box: 104, stroke: 8, font: "text-2xl" },
} as const;

/**
 * Circular AI-score gauge (zonoScore, buying readiness, match score…).
 * Pure SVG, RTL-safe.
 */
export function ScoreCard({
  score,
  label,
  hint,
  size = "md",
  className,
}: ScoreCardProps) {
  const value = clamp(Math.round(score), 0, 100);
  const { ring, text } = toneForScore(value);
  const { box, stroke, font } = sizeMap[size];
  const radius = (box - stroke) / 2;
  const circumference = 2 * Math.PI * radius;
  const dash = (value / 100) * circumference;

  return (
    <div className={cn("flex items-center gap-3", className)}>
      <div className="relative" style={{ width: box, height: box }}>
        <svg width={box} height={box} className="-rotate-90">
          <circle
            cx={box / 2}
            cy={box / 2}
            r={radius}
            fill="none"
            strokeWidth={stroke}
            className="text-line"
            stroke="currentColor"
          />
          <circle
            cx={box / 2}
            cy={box / 2}
            r={radius}
            fill="none"
            strokeWidth={stroke}
            strokeLinecap="round"
            strokeDasharray={`${dash} ${circumference}`}
            className={ring}
            stroke="currentColor"
          />
        </svg>
        <span
          className={cn(
            "absolute inset-0 flex items-center justify-center font-bold",
            font,
            text,
          )}
        >
          {value}
        </span>
      </div>
      <div>
        <p className="text-ink text-sm font-semibold">{label}</p>
        {hint && <p className="text-muted text-xs">{hint}</p>}
      </div>
    </div>
  );
}
