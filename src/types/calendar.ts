import type { ISODateString, GeoLocation, UUID } from "./common";

/** Kind of calendar event in an agent's day. */
export type CalendarEventType =
  | "viewing" // סיור בנכס
  | "open_house" // בית פתוח
  | "meeting" // פגישה
  | "call" // שיחה
  | "signing" // חתימת חוזה
  | "valuation" // הערכת שווי
  | "task" // משימה אישית
  | "followup"; // מעקב

/** Confirmation status of an event. */
export type CalendarEventStatus =
  | "tentative"
  | "confirmed"
  | "completed"
  | "cancelled"
  | "no_show";

/** A scheduled item on the agent's calendar. */
export interface CalendarEvent {
  id: UUID;
  agencyId: UUID;
  agentId: UUID;

  type: CalendarEventType;
  status: CalendarEventStatus;

  title: string;
  notes?: string;

  startAt: ISODateString;
  endAt: ISODateString;
  /** All-day events ignore the time component. */
  allDay: boolean;

  location?: GeoLocation;

  /** Linked entities. */
  propertyId?: UUID;
  buyerId?: UUID;
  sellerId?: UUID;
  leadId?: UUID;

  /** True when ZONO created the event automatically. */
  createdByAi: boolean;
  createdAt: ISODateString;
}
