import type { Match } from "@/types";
import {
  matches,
  getMatchesForBuyer,
  getMatchesForProperty,
} from "@/data/matches";

/**
 * Match-engine access. Mock-backed for now; the real engine will live
 * server-side and persist results to Supabase.
 */
export const matchService = {
  async list(): Promise<Match[]> {
    return matches;
  },

  async forBuyer(buyerId: string): Promise<Match[]> {
    return getMatchesForBuyer(buyerId);
  },

  async forProperty(propertyId: string): Promise<Match[]> {
    return getMatchesForProperty(propertyId);
  },
};
