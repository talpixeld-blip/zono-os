import type { MarketArea, MarketEvent } from "@/types";

/** Mock market areas the demo agent operates in. */
export const marketAreas: MarketArea[] = [
  {
    id: "mkt_01",
    name: "פלורנטין, תל אביב",
    region: "tel_aviv",
    city: "תל אביב",
    neighborhood: "פלורנטין",
    medianPricePerSqm: 38500,
    yoyChangePct: 6.4,
    trend: "up",
    medianDaysOnMarket: 41,
    activeListings: 73,
    demandIndex: 84,
    updatedAt: "2026-06-15T00:00:00Z",
  },
  {
    id: "mkt_02",
    name: "מרכז, רמת גן",
    region: "center",
    city: "רמת גן",
    neighborhood: "מרכז",
    medianPricePerSqm: 31200,
    yoyChangePct: 3.1,
    trend: "up",
    medianDaysOnMarket: 53,
    activeListings: 112,
    demandIndex: 71,
    updatedAt: "2026-06-15T00:00:00Z",
  },
  {
    id: "mkt_03",
    name: "הרצליה פיתוח",
    region: "sharon",
    city: "הרצליה",
    neighborhood: "הרצליה פיתוח",
    medianPricePerSqm: 52000,
    yoyChangePct: -1.2,
    trend: "down",
    medianDaysOnMarket: 78,
    activeListings: 39,
    demandIndex: 58,
    updatedAt: "2026-06-15T00:00:00Z",
  },
  {
    id: "mkt_04",
    name: "באר שבע",
    region: "south",
    city: "באר שבע",
    medianPricePerSqm: 13400,
    yoyChangePct: 8.7,
    trend: "up",
    medianDaysOnMarket: 47,
    activeListings: 204,
    demandIndex: 76,
    updatedAt: "2026-06-15T00:00:00Z",
  },
];

/** Mock market events affecting the areas above. */
export const marketEvents: MarketEvent[] = [
  {
    id: "evt_01",
    marketAreaId: "mkt_01",
    type: "infrastructure",
    title: "הקו הסגול של הרכבת הקלה נכנס לפעילות",
    description: "צפי לעלייה בביקוש לנכסים בקרבת התחנות החדשות.",
    impact: 0.4,
    occurredAt: "2026-05-28T00:00:00Z",
  },
  {
    id: "evt_02",
    marketAreaId: "mkt_04",
    type: "new_project",
    title: 'פרויקט פינוי-בינוי חדש בשכונה ד\'',
    description: "אלפי יח\"ד חדשות מתוכננות — לחץ כלפי מעלה על מחירי הקרקע.",
    impact: 0.3,
    occurredAt: "2026-06-02T00:00:00Z",
  },
  {
    id: "evt_03",
    marketAreaId: "mkt_03",
    type: "price_signal",
    title: "ירידה במחירי יוקרה בהרצליה פיתוח",
    description: "האטה בעסקאות מעל ₪5M ברבעון האחרון.",
    impact: -0.25,
    occurredAt: "2026-06-08T00:00:00Z",
  },
];

export const getMarketAreaById = (id: string): MarketArea | undefined =>
  marketAreas.find((m) => m.id === id);
