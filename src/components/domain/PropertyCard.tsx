import type { Property, PropertyStatus } from "@/types";
import { Card } from "@/components/ui/Card";
import { Badge, type BadgeTone } from "@/components/ui/Badge";
import { cn, formatShekels } from "@/lib/utils";

export interface PropertyCardProps {
  property: Property;
  onClick?: () => void;
  className?: string;
}

const statusMeta: Record<PropertyStatus, { label: string; tone: BadgeTone }> = {
  lead: { label: "ליד", tone: "neutral" },
  listed: { label: "פעיל", tone: "success" },
  under_offer: { label: "התקבלה הצעה", tone: "warning" },
  in_contract: { label: "בחוזה", tone: "brand" },
  sold: { label: "נמכר", tone: "neutral" },
  withdrawn: { label: "הוסר", tone: "danger" },
};

/** Listing summary card for grids and lists. */
export function PropertyCard({ property, onClick, className }: PropertyCardProps) {
  const status = statusMeta[property.status];

  return (
    <Card
      interactive={!!onClick}
      padding="none"
      onClick={onClick}
      className={cn("overflow-hidden", className)}
    >
      {/* Cover placeholder (mock data has no real images yet) */}
      <div className="bg-brand-soft relative flex h-36 items-center justify-center">
        <span className="text-brand-strong/40 text-4xl font-black">ZONO</span>
        <div className="absolute top-3 start-3 flex gap-2">
          <Badge tone={status.tone} leadingDot>
            {status.label}
          </Badge>
        </div>
        <div className="absolute top-3 end-3">
          <Badge tone="brand">ציון {property.zonoScore}</Badge>
        </div>
      </div>

      <div className="p-4">
        <h3 className="text-ink line-clamp-1 text-base font-bold">
          {property.title}
        </h3>
        <p className="text-muted mt-0.5 text-sm">
          {property.location.neighborhood
            ? `${property.location.neighborhood}, ${property.location.city}`
            : property.location.city}
        </p>

        <p className="text-brand-strong mt-3 text-lg font-extrabold">
          {formatShekels(property.price)}
        </p>

        <div className="text-muted mt-3 flex items-center gap-4 text-sm">
          <span>{property.rooms} חד׳</span>
          <span>{property.sizeSqm} מ״ר</span>
          {property.floor != null && <span>קומה {property.floor}</span>}
        </div>
      </div>
    </Card>
  );
}
