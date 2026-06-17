"use client";

import { cn } from "@/lib/utils";
import type { MapPin, Tone } from "@/types";
import { Icon } from "./Icon";
import { motion } from "./motion";

const toneStyles: Record<Tone, { dot: string; chip: string; ring: string }> = {
  purple: {
    dot: "bg-brand text-brand",
    chip: "bg-brand text-white",
    ring: "ring-brand/30",
  },
  blue: {
    dot: "bg-indigo-500 text-indigo-500",
    chip: "bg-indigo-500 text-white",
    ring: "ring-indigo-500/30",
  },
  gold: {
    dot: "bg-warning text-warning",
    chip: "bg-warning text-ink",
    ring: "ring-warning/30",
  },
  green: {
    dot: "bg-success text-success",
    chip: "bg-success text-white",
    ring: "ring-success/30",
  },
  red: {
    dot: "bg-danger text-danger",
    chip: "bg-danger text-white",
    ring: "ring-danger/30",
  },
};

interface CityMapProps {
  pins?: MapPin[];
  className?: string;
  showControls?: boolean;
  showLegend?: boolean;
  /** "chip" = count chips (hero); "marker" = location markers (deals map). */
  pinStyle?: "chip" | "marker";
}

/**
 * A bright, real-estate-style city map drawn entirely with SVG + CSS —
 * no map API. Soft parks, a river, a street grid, and pulsing pins.
 */
export function CityMap({
  pins = [],
  className,
  showControls = true,
  showLegend = true,
  pinStyle = "chip",
}: CityMapProps) {
  return (
    <div
      className={cn(
        "relative h-full w-full overflow-hidden rounded-[26px]",
        className,
      )}
    >
      {/* Base map */}
      <svg
        viewBox="0 0 800 500"
        preserveAspectRatio="xMidYMid slice"
        className="absolute inset-0 h-full w-full"
        aria-hidden
      >
        <defs>
          <linearGradient id="mapBg" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#f6f4ff" />
            <stop offset="100%" stopColor="#eef2fb" />
          </linearGradient>
          <linearGradient id="river" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#cfe3ff" />
            <stop offset="100%" stopColor="#bcd6ff" />
          </linearGradient>
        </defs>

        <rect width="800" height="500" fill="url(#mapBg)" />

        {/* Parks */}
        <rect x="70" y="60" width="120" height="90" rx="20" fill="#dff3e4" />
        <rect x="560" y="330" width="150" height="110" rx="22" fill="#dff3e4" />
        <circle cx="300" cy="410" r="46" fill="#dff3e4" />

        {/* River */}
        <path
          d="M -20 150 C 180 120, 240 260, 420 250 S 720 340, 840 300 L 840 360 C 700 400, 520 320, 400 320 S 160 200, -20 220 Z"
          fill="url(#river)"
          opacity="0.8"
        />

        {/* Street grid */}
        <g stroke="#ffffff" strokeWidth="7" strokeLinecap="round" opacity="0.95">
          <line x1="0" y1="110" x2="800" y2="80" />
          <line x1="0" y1="250" x2="800" y2="250" />
          <line x1="0" y1="390" x2="800" y2="410" />
          <line x1="130" y1="0" x2="150" y2="500" />
          <line x1="350" y1="0" x2="350" y2="500" />
          <line x1="560" y1="0" x2="580" y2="500" />
        </g>
        <g stroke="#e7ebf5" strokeWidth="2.5" opacity="0.9">
          <line x1="0" y1="180" x2="800" y2="165" />
          <line x1="0" y1="320" x2="800" y2="330" />
          <line x1="240" y1="0" x2="245" y2="500" />
          <line x1="460" y1="0" x2="470" y2="500" />
          <line x1="680" y1="0" x2="690" y2="500" />
        </g>

        {/* Building blocks */}
        <g fill="#ffffff" opacity="0.7">
          <rect x="160" y="130" width="60" height="40" rx="8" />
          <rect x="380" y="120" width="70" height="46" rx="8" />
          <rect x="610" y="120" width="56" height="44" rx="8" />
          <rect x="170" y="280" width="58" height="46" rx="8" />
          <rect x="400" y="290" width="64" height="42" rx="8" />
          <rect x="630" y="200" width="60" height="44" rx="8" />
        </g>
      </svg>

      {/* Pins */}
      {pins.map((pin, i) => {
        const s = toneStyles[pin.tone];
        return (
          <motion.div
            key={pin.id}
            className="absolute -translate-x-1/2 -translate-y-1/2"
            style={{ left: `${pin.xPct}%`, top: `${pin.yPct}%` }}
            initial={{ opacity: 0, scale: 0.6 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 + i * 0.12, type: "spring", stiffness: 220 }}
          >
            {/* pulse halo */}
            <span
              className={cn(
                "zono-pulse absolute left-1/2 top-1/2 h-3 w-3 -translate-x-1/2 -translate-y-1/2 rounded-full",
                s.dot,
              )}
            />
            {pinStyle === "chip" ? (
              <div
                className={cn(
                  "relative flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-bold shadow-lg ring-4",
                  s.chip,
                  s.ring,
                )}
              >
                <span className="text-sm font-black">{pin.count}</span>
                {pin.label}
              </div>
            ) : (
              <div
                className={cn(
                  "relative grid h-8 w-8 place-items-center rounded-full text-white shadow-lg ring-4",
                  s.chip,
                  s.ring,
                )}
                title={pin.label}
              >
                <Icon name="Building2" size={15} strokeWidth={2.4} />
              </div>
            )}
          </motion.div>
        );
      })}

      {/* Zoom / locate controls */}
      {showControls && (
        <div className="absolute bottom-4 start-4 flex flex-col gap-2">
          <div className="bg-card/90 border-line flex flex-col overflow-hidden rounded-2xl border shadow-md backdrop-blur">
            <button className="text-muted hover:text-brand hover:bg-brand-soft grid h-9 w-9 place-items-center transition">
              <Icon name="Plus" size={18} />
            </button>
            <span className="bg-line h-px w-full" />
            <button className="text-muted hover:text-brand hover:bg-brand-soft grid h-9 w-9 place-items-center transition">
              <Icon name="Minus" size={18} />
            </button>
          </div>
          <button className="bg-card/90 border-line text-muted hover:text-brand grid h-9 w-9 place-items-center rounded-2xl border shadow-md backdrop-blur transition">
            <Icon name="Locate" size={18} />
          </button>
        </div>
      )}

      {/* Filter button */}
      {showControls && (
        <button className="bg-card/90 border-line text-ink hover:text-brand absolute top-4 start-4 inline-flex items-center gap-2 rounded-2xl border px-3 py-2 text-sm font-bold shadow-md backdrop-blur transition">
          <Icon name="Filter" size={16} />
          סינון
        </button>
      )}

      {/* Legend */}
      {showLegend && (
        <div className="bg-card/90 border-line absolute end-4 top-4 rounded-2xl border px-3.5 py-3 text-xs shadow-md backdrop-blur">
          <p className="text-muted mb-2 font-bold">מקרא</p>
          <ul className="flex flex-col gap-1.5">
            {[
              { t: "purple", l: "נכסים" },
              { t: "gold", l: "הזדמנויות" },
              { t: "green", l: "עסקאות" },
              { t: "red", l: "ירידות מחיר" },
            ].map((row) => (
              <li key={row.l} className="text-ink flex items-center gap-2 font-semibold">
                <span
                  className={cn(
                    "h-2.5 w-2.5 rounded-full",
                    toneStyles[row.t as Tone].dot,
                  )}
                />
                {row.l}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
