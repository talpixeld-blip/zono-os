import type { JourneyStage, StageStatus } from "@/types";
import { cn } from "@/lib/utils";

export interface JourneyTimelineProps {
  stages: JourneyStage[];
  /** "horizontal" for wide panels, "vertical" for sidebars. */
  orientation?: "horizontal" | "vertical";
  className?: string;
}

const statusStyle: Record<
  StageStatus,
  { dot: string; ring: string; text: string }
> = {
  completed: { dot: "bg-success", ring: "border-success", text: "text-ink" },
  active: { dot: "bg-brand", ring: "border-brand", text: "text-brand-strong" },
  upcoming: { dot: "bg-line", ring: "border-line", text: "text-muted" },
  blocked: { dot: "bg-danger", ring: "border-danger", text: "text-danger" },
};

/** Visualizes a property's lifecycle stages. */
export function JourneyTimeline({
  stages,
  orientation = "horizontal",
  className,
}: JourneyTimelineProps) {
  const isH = orientation === "horizontal";

  return (
    <ol
      className={cn(
        "flex",
        isH ? "flex-row items-start" : "flex-col gap-4",
        className,
      )}
    >
      {stages.map((stage, i) => {
        const s = statusStyle[stage.status];
        const isLast = i === stages.length - 1;
        return (
          <li
            key={stage.key}
            className={cn(
              "relative flex",
              isH ? "flex-1 flex-col items-center text-center" : "flex-row gap-3",
            )}
          >
            {/* Connector line */}
            {!isLast && (
              <span
                className={cn(
                  "bg-line absolute",
                  isH
                    ? "top-2.5 h-0.5 w-full start-1/2"
                    : "start-2.5 top-6 h-full w-0.5",
                  stage.status === "completed" && "bg-success",
                )}
                aria-hidden
              />
            )}

            {/* Dot */}
            <span
              className={cn(
                "relative z-10 grid h-5 w-5 shrink-0 place-items-center rounded-full border-2 bg-card",
                s.ring,
              )}
            >
              <span className={cn("h-2 w-2 rounded-full", s.dot)} />
            </span>

            <div className={cn(isH ? "mt-2" : "")}>
              <p className={cn("text-sm font-semibold", s.text)}>
                {stage.label}
              </p>
              {stage.status === "active" && (
                <p className="text-muted text-xs">{stage.progress}% הושלם</p>
              )}
              {stage.openTaskCount > 0 && (
                <p className="text-warning text-xs font-medium">
                  {stage.openTaskCount} משימות פתוחות
                </p>
              )}
            </div>
          </li>
        );
      })}
    </ol>
  );
}
