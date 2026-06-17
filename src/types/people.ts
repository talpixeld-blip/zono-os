import type {
  ISODateString,
  NumberRange,
  PriceRange,
  PropertyType,
  Region,
  UUID,
} from "./common";

/** Preferred contact channel for a person. */
export type ContactChannel = "phone" | "whatsapp" | "email" | "sms";

/** How warm a buyer/lead is, AI-scored. */
export type Temperature = "hot" | "warm" | "cold";

/** Shared contact fields for buyers and sellers. */
export interface ContactBase {
  id: UUID;
  agencyId: UUID;
  agentId: UUID;
  fullName: string;
  phone: string;
  email?: string;
  preferredChannel: ContactChannel;
  notes?: string;
  createdAt: ISODateString;
  updatedAt: ISODateString;
}

/** A buyer's search criteria, used by the matching engine. */
export interface BuyerPreferences {
  budget: PriceRange;
  rooms: NumberRange;
  sizeSqm: NumberRange;
  propertyTypes: PropertyType[];
  regions: Region[];
  /** Free-text neighborhoods the buyer is interested in. */
  neighborhoods: string[];
  mustHaveParking: boolean;
  mustHaveElevator: boolean;
  mustHaveSafeRoom: boolean;
  /** Notes like "near schools", "ground floor", "investment". */
  lifestyleNotes?: string;
}

/** A prospective buyer tracked in ZONO. */
export interface Buyer extends ContactBase {
  preferences: BuyerPreferences;
  temperature: Temperature;
  /** AI readiness-to-buy score, 0–100. */
  buyingReadiness: number;
  /** Whether the buyer has mortgage pre-approval (אישור עקרוני). */
  hasMortgagePreApproval: boolean;
  /** IDs of properties already shown / saved for this buyer. */
  viewedPropertyIds: UUID[];
  savedPropertyIds: UUID[];
  lastContactedAt?: ISODateString;
}

/** Motivation level of a seller, AI-inferred. */
export type SellerMotivation = "urgent" | "motivated" | "exploring";

/** A property owner selling through ZONO. */
export interface Seller extends ContactBase {
  motivation: SellerMotivation;
  /** Property IDs this seller owns / has listed. */
  propertyIds: UUID[];
  /** Whether the agent holds an exclusivity agreement (בלעדיות). */
  hasExclusivity: boolean;
  exclusivityEndsAt?: ISODateString;
  /** The price the seller hopes to achieve. */
  expectedPrice?: number;
}
