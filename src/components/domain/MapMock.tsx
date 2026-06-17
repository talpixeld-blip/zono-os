import { cn } from "@/lib/utils";

export interface MapMarker {
  id: string;
  /** Position as percentages of the map area (0–100). */
  xPct: number;
  yPct: number;
  label?: string;
  tone?: "brand" | "success" | "warning" | "danger";
}

export interface MapMockProps {
  markers?: MapMarker[];
  /** Optional caption shown over the map. */
  caption?: string;
  className?: string;
}

const toneBg = {
  brand: "bg-brand",
  success: "bg-success",
  warning: "bg-warning",
  danger: "bg-danger",
} as const;

/**
 * A lightweight, dependency-free map placeholder for demos.
 * Swap for a real map (Mapbox / Google) when the data layer is live.
 */
export function MapMock({ markers = [], caption, className }: MapMockProps) {
  return (
    <div
      className={cn(
        "relative h-full min-h-48 w-full overflow-hidden rounded-card border border-line",
        className,
      )}
      style={{
        backgroundColor: "#eef2f7",
        backgroundImage:
          "linear-gradient(#dbe3ee 1px, transparent 1px), linear-gradient(90deg, #dbe3ee 1px, transparent 1px)",
        backgroundSize: "28px 28px",
      }}
      role="img"
      aria-label={caption ?? "מפה"}
    >
      {/* mock "roads" */}
      <div className="bg-white/70 absolute top-1/3 left-0 right-0 h-2" />
      <div className="bg-white/70 absolute top-0 bottom-0 start-1/2 w-2" />

      {markers.map((m) => (
        <div
          key={m.id}
          className="absolute -translate-x-1/2 -translate-y-1/2"
          style={{ left: `${m.xPct}%`, top: `${m.yPct}%` }}
        >
          <span
            className={cn(
              "block h-3.5 w-3.5 rounded-full ring-4 ring-white/70",
              toneBg[m.tone ?? "brand"],
            )}
          />
          {m.label && (
            <span className="bg-card text-ink absolute start-1/2 top-4 -translate-x-1/2 whitespace-nowrap rounded-md border border-line px-1.5 py-0.5 text-[11px] font-semibold shadow-sm">
              {m.label}
            </span>
          )}
        </div>
      ))}

      {caption && (
        <div className="bg-card/90 text-muted absolute bottom-2 start-2 rounded-md px-2 py-1 text-xs font-medium">
          {caption}
        </div>
      )}
    </div>
  );
}
