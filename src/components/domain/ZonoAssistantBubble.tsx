import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

export interface ZonoAssistantBubbleProps {
  /** "zono" = AI message, "user" = the agent's message. */
  author?: "zono" | "user";
  children: ReactNode;
  /** Optional quick-reply / action chips under the bubble. */
  actions?: ReactNode;
  /** Shows an animated typing indicator instead of children. */
  typing?: boolean;
  className?: string;
}

/** Chat bubble for the ZONO AI assistant surface. */
export function ZonoAssistantBubble({
  author = "zono",
  children,
  actions,
  typing,
  className,
}: ZonoAssistantBubbleProps) {
  const isZono = author === "zono";

  return (
    <div
      className={cn(
        "flex items-end gap-2",
        isZono ? "flex-row" : "flex-row-reverse",
        className,
      )}
    >
      {isZono && (
        <div className="bg-brand text-white grid h-8 w-8 shrink-0 place-items-center rounded-full text-xs font-black">
          Z
        </div>
      )}
      <div
        className={cn(
          "max-w-[80%] rounded-2xl px-4 py-2.5 text-sm leading-relaxed",
          isZono
            ? "bg-card border border-line text-ink rounded-es-sm"
            : "bg-brand text-white rounded-ee-sm",
        )}
      >
        {typing ? (
          <span className="flex gap-1 py-1">
            <Dot /> <Dot delay="150ms" /> <Dot delay="300ms" />
          </span>
        ) : (
          children
        )}
        {actions && !typing && (
          <div className="mt-2 flex flex-wrap gap-1.5">{actions}</div>
        )}
      </div>
    </div>
  );
}

function Dot({ delay = "0ms" }: { delay?: string }) {
  return (
    <span
      className="bg-muted inline-block h-1.5 w-1.5 animate-bounce rounded-full"
      style={{ animationDelay: delay }}
    />
  );
}
