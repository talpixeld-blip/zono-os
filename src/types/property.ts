import type {
  GeoLocation,
  ISODateString,
  PropertyType,
  Shekels,
  UUID,
} from "./common";

/** Lifecycle status of a listing inside ZONO. */
export type PropertyStatus =
  | "lead" // ליד ראשוני, טרם נחתם
  | "listed" // פעיל לשיווק
  | "under_offer" // התקבלה הצעה
  | "in_contract" // בחתימת חוזה
  | "sold" // נמכר
  | "withdrawn"; // הוסר מהשיווק

/** Whether the property is for sale or for rent. */
export type ListingKind = "sale" | "rent";

/** A single media asset attached to a property. */
export interface PropertyMedia {
  id: UUID;
  propertyId: UUID;
  kind: "photo" | "video" | "floorplan" | "tour_360" | "document";
  url: string;
  isCover: boolean;
  order: number;
}

/** A point in the property's price history. */
export interface PriceHistoryPoint {
  date: ISODateString;
  price: Shekels;
  reason?: "initial" | "reduction" | "increase" | "correction";
}

/**
 * A real-estate property managed in ZONO. Central entity of the system —
 * linked to a seller, journeys, matches, media and history.
 */
export interface Property {
  id: UUID;
  agencyId: UUID;
  agentId: UUID;
  sellerId?: UUID;

  title: string;
  description?: string;

  type: PropertyType;
  listingKind: ListingKind;
  status: PropertyStatus;

  price: Shekels;
  /** Monthly rent when listingKind === "rent". */
  monthlyRent?: Shekels;

  rooms: number;
  /** Built area in square meters. */
  sizeSqm: number;
  /** Garden / balcony area in square meters. */
  outdoorSqm?: number;
  floor?: number;
  totalFloors?: number;

  hasParking: boolean;
  hasElevator: boolean;
  hasBalcony: boolean;
  hasSafeRoom: boolean; // ממ"ד
  hasStorage: boolean; // מחסן
  isAccessible: boolean; // נגישות

  location: GeoLocation;

  /** AI-generated 0–100 desirability/marketability score. */
  zonoScore: number;
  /** AI estimate of days-to-sell at current price. */
  estimatedDaysToSell?: number;

  media: PropertyMedia[];
  priceHistory: PriceHistoryPoint[];

  listedAt?: ISODateString;
  createdAt: ISODateString;
  updatedAt: ISODateString;
}
