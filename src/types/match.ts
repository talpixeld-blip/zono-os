import type { ISODateString, UUID } from "./common";

/** Why a property matched a buyer — explainable AI breakdown. */
export interface MatchReason {
  /** Short label, e.g. "תקציב", "מספר חדרים", "אזור". */
  label: string;
  /** 0–1 contribution of this factor to the overall score. */
  weight: number;
  /** Whether this factor is a positive match or a concern. */
  positive: boolean;
  detail?: string;
}

/** Action the agent has taken on a match. */
export type MatchAction =
  | "new"
  | "presented" // הוצג ללקוח
  | "viewing_scheduled"
  | "viewed"
  | "rejected"
  | "offer_made";

/**
 * A scored pairing between a buyer and a property produced by the
 * matching engine. Surfaced as MatchCards in the UI.
 */
export interface Match {
  id: UUID;
  agencyId: UUID;
  buyerId: UUID;
  propertyId: UUID;

  /** Overall fit score, 0–100. */
  score: number;
  reasons: MatchReason[];

  action: MatchAction;
  /** True when the buyer's hard constraints are all satisfied. */
  meetsHardConstraints: boolean;

  createdAt: ISODateString;
  updatedAt: ISODateString;
}
