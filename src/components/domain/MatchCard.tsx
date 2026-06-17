import type { Match } from "@/types";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { cn } from "@/lib/utils";

export interface MatchCardProps {
  match: Match;
  /** Display names resolved by the caller from buyer/property data. */
  buyerName?: string;
  propertyTitle?: string;
  onClick?: () => void;
  className?: string;
}

function scoreTone(score: number) {
  if (score >= 85) return "success" as const;
  if (score >= 70) return "brand" as const;
  return "warning" as const;
}

/** Buyer↔property match with explainable score breakdown. */
export function MatchCard({
  match,
  buyerName,
  propertyTitle,
  onClick,
  className,
}: MatchCardProps) {
  return (
    <Card
      interactive={!!onClick}
      onClick={onClick}
      className={cn("flex flex-col gap-3", className)}
    >
      <div className="flex items-start justify-between gap-3">
        <div>
          <h3 className="text-ink text-base font-bold leading-snug">
            {buyerName ?? "קונה"} ↔ {propertyTitle ?? "נכס"}
          </h3>
          {!match.meetsHardConstraints && (
            <p className="text-warning mt-1 text-xs font-semibold">
              לא עומד בכל אילוצי החובה
            </p>
          )}
        </div>
        <div className="text-center">
          <span className="text-ink text-2xl font-extrabold leading-none">
            {match.score}
          </span>
          <p className="text-muted text-[11px]">ציון התאמה</p>
        </div>
      </div>

      {/* Score bar */}
      <div className="bg-line h-1.5 w-full overflow-hidden rounded-full">
        <div
          className={cn(
            "h-full rounded-full",
            match.score >= 85
              ? "bg-success"
              : match.score >= 70
                ? "bg-brand"
                : "bg-warning",
          )}
          style={{ width: `${match.score}%` }}
        />
      </div>

      {/* Reasons */}
      <div className="flex flex-wrap gap-1.5">
        {match.reasons.slice(0, 5).map((r) => (
          <Badge
            key={r.label}
            tone={r.positive ? scoreTone(match.score) : "danger"}
            size="sm"
          >
            {r.positive ? "✓" : "✕"} {r.label}
          </Badge>
        ))}
      </div>
    </Card>
  );
}
