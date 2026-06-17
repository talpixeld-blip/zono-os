import type { ISODateString, UUID } from "./common";

/** Severity / tone of an alert. */
export type AlertLevel = "info" | "success" | "warning" | "critical";

/** What triggered the alert. */
export type AlertCategory =
  | "task_due" // משימה לביצוע
  | "followup_due" // מעקב נדרש
  | "price_change"
  | "new_lead"
  | "document_pending" // מסמך ממתין לחתימה
  | "exclusivity_expiring"
  | "market_event"
  | "system";

/**
 * A time-sensitive notification for the agent. Lighter-weight than an
 * Opportunity — alerts are about "something happened / is due", not a
 * recommended business action.
 */
export interface Alert {
  id: UUID;
  agencyId: UUID;
  agentId: UUID;

  level: AlertLevel;
  category: AlertCategory;

  title: string;
  body?: string;

  isRead: boolean;
  /** Deep-link target inside the app. */
  href?: string;

  /** Related entities. */
  propertyId?: UUID;
  buyerId?: UUID;
  sellerId?: UUID;
  leadId?: UUID;

  dueAt?: ISODateString;
  createdAt: ISODateString;
}
