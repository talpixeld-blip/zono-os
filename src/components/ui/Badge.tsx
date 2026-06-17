import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

export type BadgeTone =
  | "neutral"
  | "brand"
  | "success"
  | "warning"
  | "danger"
  | "accent";

export interface BadgeProps {
  tone?: BadgeTone;
  size?: "sm" | "md";
  leadingDot?: boolean;
  children: ReactNode;
  className?: string;
}

const toneClasses: Record<BadgeTone, string> = {
  neutral: "bg-line/70 text-ink",
  brand: "bg-brand-soft text-brand-strong",
  success: "bg-success-soft text-success",
  warning: "bg-warning-soft text-warning",
  danger: "bg-danger-soft text-danger",
  accent: "bg-sky-100 text-sky-700",
};

const dotClasses: Record<BadgeTone, string> = {
  neutral: "bg-muted",
  brand: "bg-brand",
  success: "bg-success",
  warning: "bg-warning",
  danger: "bg-danger",
  accent: "bg-accent",
};

/** Compact status / label pill. */
export function Badge({
  tone = "neutral",
  size = "md",
  leadingDot,
  children,
  className,
}: BadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full font-semibold",
        size === "sm" ? "px-2 py-0.5 text-xs" : "px-2.5 py-1 text-xs",
        toneClasses[tone],
        className,
      )}
    >
      {leadingDot && (
        <span className={cn("h-1.5 w-1.5 rounded-full", dotClasses[tone])} />
      )}
      {children}
    </span>
  );
}
