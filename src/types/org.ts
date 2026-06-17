import type { ISODateString, Region, UUID } from "./common";

/** Subscription tier for an agency. */
export type PlanTier = "starter" | "pro" | "agency" | "enterprise";

/** A real-estate agency (the tenant in ZONO's multi-tenant model). */
export interface Agency {
  id: UUID;
  name: string;
  plan: PlanTier;
  regions: Region[];
  logoUrl?: string;
  createdAt: ISODateString;
}

/** Role of a user within an agency. */
export type UserRole = "owner" | "manager" | "agent" | "assistant";

/** An application user (agent or staff). */
export interface User {
  id: UUID;
  agencyId: UUID;
  fullName: string;
  email: string;
  phone?: string;
  role: UserRole;
  avatarUrl?: string;
  createdAt: ISODateString;
}
