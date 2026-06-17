import type { Property } from "@/types";
import { properties, getPropertyById } from "@/data/properties";

/**
 * Property data access. Currently backed by mock data; will be swapped to
 * Supabase queries (`supabase.from("properties")...`) without changing callers.
 */
export const propertyService = {
  async list(): Promise<Property[]> {
    return properties;
  },

  async getById(id: string): Promise<Property | null> {
    return getPropertyById(id) ?? null;
  },

  async listByStatus(status: Property["status"]): Promise<Property[]> {
    return properties.filter((p) => p.status === status);
  },
};
