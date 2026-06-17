import type { Seller } from "@/types";

/**
 * Mock sellers. IDs are stable so other mock files can reference them.
 * Replace with Supabase queries once the data layer is live.
 */
export const sellers: Seller[] = [
  {
    id: "sel_01",
    agencyId: "agc_01",
    agentId: "usr_01",
    fullName: "דנה לוי",
    phone: "050-1234567",
    email: "dana.levi@example.com",
    preferredChannel: "whatsapp",
    notes: "מעוניינת למכור לפני מעבר לחו\"ל בספטמבר.",
    motivation: "urgent",
    propertyIds: ["prop_01"],
    hasExclusivity: true,
    exclusivityEndsAt: "2026-08-15T00:00:00Z",
    expectedPrice: 3350000,
    createdAt: "2026-04-02T08:00:00Z",
    updatedAt: "2026-06-10T08:00:00Z",
  },
  {
    id: "sel_02",
    agencyId: "agc_01",
    agentId: "usr_01",
    fullName: "יוסי מזרחי",
    phone: "052-7654321",
    preferredChannel: "phone",
    motivation: "motivated",
    propertyIds: ["prop_02"],
    hasExclusivity: true,
    exclusivityEndsAt: "2026-06-30T00:00:00Z",
    expectedPrice: 2200000,
    createdAt: "2026-03-18T08:00:00Z",
    updatedAt: "2026-06-12T08:00:00Z",
  },
  {
    id: "sel_03",
    agencyId: "agc_01",
    agentId: "usr_01",
    fullName: "משפחת אזולאי",
    phone: "054-9988776",
    email: "azoulay.family@example.com",
    preferredChannel: "email",
    motivation: "exploring",
    propertyIds: ["prop_03"],
    hasExclusivity: false,
    expectedPrice: 5600000,
    createdAt: "2026-05-20T08:00:00Z",
    updatedAt: "2026-06-09T08:00:00Z",
  },
  {
    id: "sel_04",
    agencyId: "agc_01",
    agentId: "usr_01",
    fullName: "רונית כהן",
    phone: "058-3344556",
    preferredChannel: "whatsapp",
    motivation: "motivated",
    propertyIds: ["prop_04"],
    hasExclusivity: true,
    exclusivityEndsAt: "2026-09-01T00:00:00Z",
    expectedPrice: 1850000,
    createdAt: "2026-05-01T08:00:00Z",
    updatedAt: "2026-06-15T08:00:00Z",
  },
];

export const getSellerById = (id: string): Seller | undefined =>
  sellers.find((s) => s.id === id);
