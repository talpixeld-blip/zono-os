import type { Opportunity } from "@/types";

/** Mock AI-surfaced opportunities for the agent's daily feed. */
export const opportunities: Opportunity[] = [
  {
    id: "opp_01",
    agencyId: "agc_01",
    agentId: "usr_01",
    type: "new_match",
    priority: "high",
    status: "open",
    title: "התאמה חדשה ברמת 94% לאורי שמש",
    summary:
      'הדירה בפלורנטין תואמת כמעט מושלם להעדפות של אורי — קונה "חם" עם אישור עקרוני.',
    suggestedAction: "שלח את הנכס בוואטסאפ",
    potentialValue: 65000,
    confidence: 94,
    propertyId: "prop_01",
    buyerId: "buy_01",
    createdAt: "2026-06-16T07:30:00Z",
    updatedAt: "2026-06-16T07:30:00Z",
  },
  {
    id: "opp_02",
    agencyId: "agc_01",
    agentId: "usr_01",
    type: "expiring_exclusivity",
    priority: "high",
    status: "open",
    title: "בלעדיות מסתיימת בעוד 12 ימים",
    summary:
      'הבלעדיות על דירת רמת גן של יוסי מזרחי מסתיימת ב-30/6. כדאי לחדש או לסגור עסקה.',
    suggestedAction: "קבע פגישת חידוש בלעדיות",
    confidence: 88,
    propertyId: "prop_02",
    sellerId: "sel_02",
    createdAt: "2026-06-18T06:00:00Z",
    updatedAt: "2026-06-18T06:00:00Z",
  },
  {
    id: "opp_03",
    agencyId: "agc_01",
    agentId: "usr_01",
    type: "price_drop",
    priority: "medium",
    status: "open",
    title: "ירידת מחיר רלוונטית למיכל ברק",
    summary:
      'הדירה בבאר שבע ירדה ל-₪1.85M ונכנסה לטווח התקציב של מיכל. הזדמנות תשואה.',
    suggestedAction: "עדכן את הלקוחה על המחיר החדש",
    potentialValue: 37000,
    confidence: 81,
    propertyId: "prop_04",
    buyerId: "buy_02",
    createdAt: "2026-06-14T10:00:00Z",
    updatedAt: "2026-06-14T10:00:00Z",
  },
  {
    id: "opp_04",
    agencyId: "agc_01",
    agentId: "usr_01",
    type: "buyer_reengage",
    priority: "medium",
    status: "open",
    title: "נועה גולן לא קיבלה עדכון 13 ימים",
    summary:
      'קונה "חמימה" שלא יצרת איתה קשר מאז 5/6. שווה לחזור אליה עם נכס מתאים.',
    suggestedAction: "שלח הודעת מעקב",
    confidence: 72,
    buyerId: "buy_04",
    createdAt: "2026-06-18T06:00:00Z",
    updatedAt: "2026-06-18T06:00:00Z",
  },
  {
    id: "opp_05",
    agencyId: "agc_01",
    agentId: "usr_01",
    type: "market_shift",
    priority: "low",
    status: "open",
    title: "עלייה של 6.4% במחירים בפלורנטין",
    summary:
      "מגמת עלייה באזור פעילות מרכזי שלך — הזדמנות לעדכן מוכרים על שווי הנכס.",
    suggestedAction: "צור דוח שווי למוכרים באזור",
    confidence: 69,
    createdAt: "2026-06-17T06:00:00Z",
    updatedAt: "2026-06-17T06:00:00Z",
  },
];

export const getOpenOpportunities = (): Opportunity[] =>
  opportunities.filter((o) => o.status === "open");
