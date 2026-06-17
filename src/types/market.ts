import type { ISODateString, Region, Shekels, UUID } from "./common";

/** Direction of a market trend. */
export type TrendDirection = "up" | "down" | "stable";

/** A geographic market the agent operates in (city/neighborhood). */
export interface MarketArea {
  id: UUID;
  name: string; // e.g. "פלורנטין, תל אביב"
  region: Region;
  city: string;
  neighborhood?: string;

  /** Median price per square meter (₪). */
  medianPricePerSqm: Shekels;
  /** Percent change over the last 12 months, e.g. 6.4. */
  yoyChangePct: number;
  trend: TrendDirection;

  /** Median days a listing stays on market. */
  medianDaysOnMarket: number;
  /** Active listings currently in the area. */
  activeListings: number;
  /** ZONO demand index 0–100 (buyer interest vs supply). */
  demandIndex: number;

  updatedAt: ISODateString;
}

/** Category of a notable market event. */
export type MarketEventType =
  | "new_project" // פרויקט חדש / תמ"א
  | "infrastructure" // תשתית (רכבת קלה, כביש)
  | "price_signal" // אות מחיר חריג
  | "regulation" // רגולציה / מיסוי
  | "transaction"; // עסקה משמעותית

/** A dated event affecting a market area. */
export interface MarketEvent {
  id: UUID;
  marketAreaId: UUID;
  type: MarketEventType;
  title: string;
  description?: string;
  /** Expected impact on local prices, -1..1. */
  impact: number;
  occurredAt: ISODateString;
}
