import type { Opportunity } from "@/types";
import { opportunities, getOpenOpportunities } from "@/data/opportunities";

/**
 * Opportunity feed access. Mock-backed for now; swap to Supabase later.
 */
export const opportunityService = {
  async list(): Promise<Opportunity[]> {
    return opportunities;
  },

  async listOpen(): Promise<Opportunity[]> {
    return getOpenOpportunities();
  },

  async listByPriority(
    priority: Opportunity["priority"],
  ): Promise<Opportunity[]> {
    return opportunities.filter((o) => o.priority === priority);
  },
};
