import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

export interface SectionHeaderProps {
  title: string;
  subtitle?: string;
  /** Optional eyebrow label above the title. */
  eyebrow?: string;
  /** Action(s) rendered at the opposite (start) side. */
  action?: ReactNode;
  className?: string;
}

/** Consistent heading block for sections and dashboard panels. */
export function SectionHeader({
  title,
  subtitle,
  eyebrow,
  action,
  className,
}: SectionHeaderProps) {
  return (
    <div className={cn("mb-4 flex items-end justify-between gap-4", className)}>
      <div>
        {eyebrow && (
          <p className="text-brand mb-1 text-xs font-bold tracking-wide">
            {eyebrow}
          </p>
        )}
        <h2 className="text-ink text-xl font-bold leading-tight">{title}</h2>
        {subtitle && <p className="text-muted mt-1 text-sm">{subtitle}</p>}
      </div>
      {action && <div className="shrink-0">{action}</div>}
    </div>
  );
}
