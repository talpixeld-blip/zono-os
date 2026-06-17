import type {
  Opportunity,
  OpportunityPriority,
  OpportunityType,
} from "@/types";
import { Card } from "@/components/ui/Card";
import { Badge, type BadgeTone } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { cn, formatShekelsCompact } from "@/lib/utils";

export interface OpportunityCardProps {
  opportunity: Opportunity;
  onAct?: (id: string) => void;
  onDismiss?: (id: string) => void;
  className?: string;
}

const priorityMeta: Record<
  OpportunityPriority,
  { label: string; tone: BadgeTone }
> = {
  high: { label: "דחוף", tone: "danger" },
  medium: { label: "בינוני", tone: "warning" },
  low: { label: "מעקב", tone: "neutral" },
};

const typeLabels: Record<OpportunityType, string> = {
  price_drop: "ירידת מחיר",
  new_match: "התאמה חדשה",
  stale_listing: "נכס תקוע",
  expiring_exclusivity: "בלעדיות מסתיימת",
  buyer_reengage: "חידוש קשר — קונה",
  seller_reengage: "חידוש קשר — מוכר",
  market_shift: "שינוי שוק",
  cross_sell: "עסקה משלימה",
  referral: "פוטנציאל הפניה",
};

/** AI-surfaced opportunity in the agent's daily feed. */
export function OpportunityCard({
  opportunity,
  onAct,
  onDismiss,
  className,
}: OpportunityCardProps) {
  const priority = priorityMeta[opportunity.priority];

  return (
    <Card className={cn("flex flex-col gap-3", className)}>
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <Badge tone={priority.tone} leadingDot>
            {priority.label}
          </Badge>
          <Badge tone="brand">{typeLabels[opportunity.type]}</Badge>
        </div>
        <span className="text-muted text-xs font-medium">
          ביטחון {opportunity.confidence}%
        </span>
      </div>

      <div>
        <h3 className="text-ink text-base font-bold leading-snug">
          {opportunity.title}
        </h3>
        <p className="text-muted mt-1 text-sm leading-relaxed">
          {opportunity.summary}
        </p>
      </div>

      {opportunity.potentialValue != null && (
        <p className="text-success text-sm font-semibold">
          פוטנציאל: {formatShekelsCompact(opportunity.potentialValue)}
        </p>
      )}

      <div className="mt-1 flex items-center gap-2">
        {onAct && (
          <Button size="sm" onClick={() => onAct(opportunity.id)}>
            {opportunity.suggestedAction ?? "פעל עכשיו"}
          </Button>
        )}
        {onDismiss && (
          <Button
            size="sm"
            variant="ghost"
            onClick={() => onDismiss(opportunity.id)}
          >
            התעלם
          </Button>
        )}
      </div>
    </Card>
  );
}
