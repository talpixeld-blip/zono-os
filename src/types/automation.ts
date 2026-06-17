import type { ISODateString, UUID } from "./common";

/** Event that can start an automation. */
export type AutomationTrigger =
  | "new_lead"
  | "lead_inactive" // ליד לא פעיל X ימים
  | "new_match"
  | "price_drop"
  | "viewing_completed"
  | "exclusivity_expiring"
  | "document_signed"
  | "stage_changed"
  | "scheduled"; // לפי לוח זמנים

/** Action an automation can perform. */
export type AutomationActionType =
  | "send_whatsapp"
  | "send_email"
  | "send_sms"
  | "create_task"
  | "create_followup"
  | "schedule_event"
  | "notify_agent"
  | "update_stage"
  | "generate_document";

/** A single step the automation executes. */
export interface AutomationAction {
  type: AutomationActionType;
  /** Template / payload reference for the action. */
  templateId?: string;
  /** Delay before running this action, in minutes. */
  delayMinutes?: number;
  config?: Record<string, unknown>;
}

/**
 * A no-code workflow: when {trigger} (and conditions) → run {actions}.
 * Powers ZONO's automation engine.
 */
export interface Automation {
  id: UUID;
  agencyId: UUID;
  agentId?: UUID; // null = agency-wide

  name: string;
  description?: string;
  enabled: boolean;

  trigger: AutomationTrigger;
  /** Simple key/op/value conditions, ANDed together. */
  conditions: AutomationCondition[];
  actions: AutomationAction[];

  /** Run stats. */
  lastRunAt?: ISODateString;
  runCount: number;

  createdAt: ISODateString;
  updatedAt: ISODateString;
}

/** A single condition gating an automation. */
export interface AutomationCondition {
  field: string; // e.g. "lead.score"
  operator: "eq" | "neq" | "gt" | "lt" | "gte" | "lte" | "contains";
  value: string | number | boolean;
}
