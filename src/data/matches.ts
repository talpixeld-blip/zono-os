import type { Match } from "@/types";

/** Mock buyer↔property matches produced by the matching engine. */
export const matches: Match[] = [
  {
    id: "mat_01",
    agencyId: "agc_01",
    buyerId: "buy_01",
    propertyId: "prop_01",
    score: 94,
    meetsHardConstraints: true,
    action: "presented",
    reasons: [
      { label: "תקציב", weight: 0.3, positive: true, detail: "₪3.25M בתוך הטווח" },
      { label: "אזור", weight: 0.25, positive: true, detail: "פלורנטין — מועדף" },
      { label: "מספר חדרים", weight: 0.2, positive: true, detail: "4 חדרים" },
      { label: "מעלית", weight: 0.15, positive: true },
      { label: "חניה", weight: 0.1, positive: false, detail: "אין חניה" },
    ],
    createdAt: "2026-06-12T08:00:00Z",
    updatedAt: "2026-06-16T09:00:00Z",
  },
  {
    id: "mat_02",
    agencyId: "agc_01",
    buyerId: "buy_03",
    propertyId: "prop_03",
    score: 91,
    meetsHardConstraints: true,
    action: "viewing_scheduled",
    reasons: [
      { label: "תקציב", weight: 0.3, positive: true, detail: "₪5.6M בתוך הטווח" },
      { label: "סוג נכס", weight: 0.2, positive: true, detail: "פנטהאוז" },
      { label: 'ממ"ד', weight: 0.15, positive: true },
      { label: "מרחב חוץ", weight: 0.2, positive: true, detail: "מרפסת 60 מ\"ר" },
      { label: "אזור", weight: 0.15, positive: true, detail: "הרצליה פיתוח" },
    ],
    createdAt: "2026-06-10T08:00:00Z",
    updatedAt: "2026-06-14T11:00:00Z",
  },
  {
    id: "mat_03",
    agencyId: "agc_01",
    buyerId: "buy_02",
    propertyId: "prop_04",
    score: 82,
    meetsHardConstraints: true,
    action: "new",
    reasons: [
      { label: "תקציב", weight: 0.35, positive: true, detail: "₪1.85M בתוך הטווח" },
      { label: "אזור", weight: 0.25, positive: true, detail: "דרום — מתאים" },
      { label: "פוטנציאל תשואה", weight: 0.25, positive: true, detail: "מושכר לסטודנטים" },
      { label: "מעלית", weight: 0.15, positive: false, detail: "אין מעלית" },
    ],
    createdAt: "2026-06-15T08:00:00Z",
    updatedAt: "2026-06-15T08:00:00Z",
  },
  {
    id: "mat_04",
    agencyId: "agc_01",
    buyerId: "buy_04",
    propertyId: "prop_02",
    score: 68,
    meetsHardConstraints: false,
    action: "new",
    reasons: [
      { label: "תקציב", weight: 0.3, positive: true, detail: "₪2.2M בתוך הטווח" },
      { label: "חניה", weight: 0.25, positive: true },
      { label: "אזור", weight: 0.2, positive: true, detail: "רמת גן" },
      { label: "מספר חדרים", weight: 0.25, positive: true, detail: "3 חדרים" },
    ],
    createdAt: "2026-06-13T08:00:00Z",
    updatedAt: "2026-06-13T08:00:00Z",
  },
];

export const getMatchesForBuyer = (buyerId: string): Match[] =>
  matches.filter((m) => m.buyerId === buyerId);

export const getMatchesForProperty = (propertyId: string): Match[] =>
  matches.filter((m) => m.propertyId === propertyId);
