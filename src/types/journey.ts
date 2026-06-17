import type { ISODateString, UUID } from "./common";

/** The canonical stages of a property's lifecycle in ZONO. */
export type JourneyStageKey =
  | "intake" // קליטת הנכס
  | "preparation" // הכנה לשיווק (צילום, תיאור)
  | "pricing" // תמחור
  | "marketing" // שיווק והפצה
  | "viewings" // סיורים
  | "negotiation" // משא ומתן
  | "contract" // חוזה וחתימות
  | "closing"; // סגירה והעברת בעלות

/** Status of a single stage. */
export type StageStatus = "completed" | "active" | "upcoming" | "blocked";

/**
 * One stage in a property's journey. Rendered by the JourneyTimeline.
 */
export interface JourneyStage {
  key: JourneyStageKey;
  /** Hebrew display label. */
  label: string;
  status: StageStatus;
  /** 0–100 progress within the stage. */
  progress: number;
  startedAt?: ISODateString;
  completedAt?: ISODateString;
  /** Number of open tasks remaining in this stage. */
  openTaskCount: number;
}

/** A concrete task within a journey stage. */
export interface JourneyTask {
  id: UUID;
  journeyId: UUID;
  stage: JourneyStageKey;
  title: string;
  done: boolean;
  /** True when ZONO can perform this automatically. */
  automatable: boolean;
  dueAt?: ISODateString;
  assigneeId?: UUID;
}

/** The full journey for a single property. */
export interface PropertyJourney {
  id: UUID;
  agencyId: UUID;
  propertyId: UUID;
  currentStage: JourneyStageKey;
  stages: JourneyStage[];
  tasks: JourneyTask[];
  /** Overall completion across all stages, 0–100. */
  overallProgress: number;
  createdAt: ISODateString;
  updatedAt: ISODateString;
}
