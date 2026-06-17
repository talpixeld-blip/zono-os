/**
 * Shared primitives used across all ZONO domain types.
 */

/** ISO-8601 timestamp string, e.g. "2026-06-18T09:30:00Z". */
export type ISODateString = string;

/** UUID string (matches Supabase `uuid` columns). */
export type UUID = string;

/** Currency is NIS (₪) throughout the product. Stored as whole shekels. */
export type Shekels = number;

/** Israeli regions used for market segmentation. */
export type Region =
  | "tel_aviv"
  | "center"
  | "sharon"
  | "jerusalem"
  | "haifa_north"
  | "south"
  | "shfela"
  | "judea_samaria";

/** Property types common in the Israeli market. */
export type PropertyType =
  | "apartment" // דירה
  | "garden_apartment" // דירת גן
  | "penthouse" // פנטהאוז
  | "duplex" // דופלקס
  | "private_house" // בית פרטי
  | "cottage" // קוטג'
  | "studio" // סטודיו
  | "land" // מגרש
  | "commercial"; // מסחרי

/** A geo point plus a human-readable address. */
export interface GeoLocation {
  lat: number;
  lng: number;
  address: string;
  city: string;
  neighborhood?: string;
  region: Region;
}

/** Money range used for buyer budgets and search filters. */
export interface PriceRange {
  min: Shekels;
  max: Shekels;
}

/** Generic numeric range (rooms, size, floors). */
export interface NumberRange {
  min: number;
  max: number;
}
