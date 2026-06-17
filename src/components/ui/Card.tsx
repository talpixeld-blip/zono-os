import type { HTMLAttributes, ReactNode } from "react";
import { cn } from "@/lib/utils";

export interface CardProps extends HTMLAttributes<HTMLDivElement> {
  /** Adds hover elevation + pointer affordance. */
  interactive?: boolean;
  padding?: "none" | "sm" | "md" | "lg";
}

const paddingClasses = {
  none: "",
  sm: "p-3",
  md: "p-5",
  lg: "p-6",
} as const;

/** Base surface container used across the product. */
export function Card({
  interactive,
  padding = "md",
  className,
  children,
  ...props
}: CardProps) {
  return (
    <div
      className={cn(
        "bg-card rounded-card border border-line shadow-card",
        interactive &&
          "cursor-pointer transition-shadow hover:shadow-lg focus-within:shadow-lg",
        paddingClasses[padding],
        className,
      )}
      {...props}
    >
      {children}
    </div>
  );
}

export function CardHeader({ children }: { children: ReactNode }) {
  return <div className="mb-3 flex items-start justify-between gap-3">{children}</div>;
}

export function CardTitle({ children }: { children: ReactNode }) {
  return <h3 className="text-ink text-base font-bold leading-tight">{children}</h3>;
}

export function CardBody({ children }: { children: ReactNode }) {
  return <div className="text-muted text-sm leading-relaxed">{children}</div>;
}
