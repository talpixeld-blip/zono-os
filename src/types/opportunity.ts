import type { ISODateString, Shekels, UUID } from "./common";

/** Category of an AI-detected opportunity. */
export type OpportunityType =
  | "price_drop" // ירידת מחיר רלוונטית ללקוח
  | "new_match" // נכס חדש שמתאים לקונה
  | "stale_listing" // נכס תקוע שכדאי לרענן
  | "expiring_exclusivity" // בלעדיות שמסתיימת
  | "buyer_reengage" // קונה שכדאי לחזור אליו
  | "seller_reengage" // מוכר שכדאי לחזור אליו
  | "market_shift" // שינוי שוק באזור פעילות
  | "cross_sell" // הזדמנות עסקה משלימה
  | "referral"; // פוטנציאל הפניה

/** How urgent / time-sensitive the opportunity is. */
export type OpportunityPriority = "high" | "medium" | "low";

/** Lifecycle of an opportunity card. */
export type OpportunityStatus = "open" | "snoozed" | "acted" | "dismissed";

/**
 * A proactive, AI-surfaced action ZONO recommends to the agent.
 * Drives the "opportunities" feed and OpportunityCard components.
 */
export interface Opportunity {
  id: UUID;
  agencyId: UUID;
  agentId: UUID;

  type: OpportunityType;
  priority: OpportunityPriority;
  status: OpportunityStatus;

  title: string;
  /** One-line rationale shown on the card. */
  summary: string;
  /** Suggested next action label, e.g. "שלח הצעה ללקוח". */
  suggestedAction?: string;

  /** Estimated value/commission upside if acted upon. */
  potentialValue?: Shekels;
  /** AI confidence in the opportunity, 0–100. */
  confidence: number;

  /** Related entities the opportunity references. */
  propertyId?: UUID;
  buyerId?: UUID;
  sellerId?: UUID;
  leadId?: UUID;

  snoozedUntil?: ISODateString;
  createdAt: ISODateString;
  updatedAt: ISODateString;
}
