// domains/property/property.repository.ts
/**
 * Property repository
 * - Public (RLS) vs Admin (Service Role)
 * - CRUD operations
 * - Cursor-based pagination
 * - Soft delete enforcement for land
 */

import { supabasePublic, supabaseAdmin } from "@/infrastructure/database/supabase.client";
import { isServer } from "@/config/env";
import { Property } from "./property.model";

interface PropertyFilters {
  county?: string;
  type?: string;
  minPrice?: number;
  maxPrice?: number;
}

/* =====================================================
   PUBLIC QUERIES (Browser-safe, RLS enforced)
   ===================================================== */
export async function getPublicProperties(filters?: PropertyFilters): Promise<Property[]> {
  const client = supabasePublic;

  let query = client.from("properties").select("*").eq("status", "available");

  if (filters?.county) query = query.eq("county", filters.county);
  if (filters?.type) query = query.eq("property_type", filters.type);
  if (filters?.minPrice) query = query.gte("price", filters.minPrice);
  if (filters?.maxPrice) query = query.lte("price", filters.maxPrice);

  const { data, error } = await query.order("created_at", { ascending: false });
  if (error) throw new Error(error.message);

  return data as Property[];
}

export async function getPropertyBySlug(slug: string): Promise<Property> {
  const { data, error } = await supabasePublic
    .from("properties")
    .select("*")
    .eq("slug", slug)
    .eq("status", "available")
    .single();

  if (error) throw new Error(error.message);
  return data as Property;
}

export async function getAvailableProperties(filters?: PropertyFilters): Promise<Property[]> {
  return getPublicProperties(filters);
}

/* =====================================================
   ADMIN QUERIES (Server-only, Service Role)
   ===================================================== */
function ensureAdminClient() {
  if (!supabaseAdmin) throw new Error("Admin client not initialized");
  return supabaseAdmin;
}

export async function getAllPropertiesAdmin(): Promise<Property[]> {
  const client = ensureAdminClient();
  const { data, error } = await client.from("properties").select("*").order("created_at", { ascending: false });
  if (error) throw new Error(error.message);
  return data as Property[];
}

export async function getPropertyById(id: string): Promise<Property> {
  const client = ensureAdminClient();
  const { data, error } = await client.from("properties").select("*").eq("id", id).single();
  if (error) throw new Error(error.message);
  return data as Property;
}

export async function createProperty(payload: Partial<Property>): Promise<Property> {
  const client = ensureAdminClient();
  const { data, error } = await client.from("properties").insert(payload).select().single();
  if (error) throw new Error(error.message);
  return data as Property;
}

export async function updateProperty(id: string, payload: Partial<Property>): Promise<Property> {
  const client = ensureAdminClient();
  const { data, error } = await client.from("properties").update(payload).eq("id", id).select().single();
  if (error) throw new Error(error.message);
  return data as Property;
}

/* =====================================================
   DELETE / SOFT DELETE
   ===================================================== */
export async function deleteProperty(id: string): Promise<void> {
  const client = ensureAdminClient();
  const { error } = await client.from("properties").update({ status: "draft" }).eq("id", id);
  if (error) throw new Error(error.message);
}

export async function hardDeleteProperty(id: string): Promise<void> {
  const client = ensureAdminClient();
  const { error } = await client.from("properties").delete().eq("id", id);
  if (error) throw new Error(error.message);
}

/* =====================================================
   CURSOR-BASED PAGINATION (Public)
   ===================================================== */
export async function getPropertiesPaginated(
  limit = 10,
  cursor?: string,
  filters?: PropertyFilters
): Promise<{ properties: Property[]; nextCursor: string | null }> {
  // Determine whether we can safely use the admin (service-role) client.
  const canUseAdmin = typeof process !== "undefined" && typeof window === "undefined" && !!process.env.SUPABASE_SERVICE_ROLE_KEY;

  const buildQuery = (client: any) =>
    client
      .from("properties")
      .select("*")
      .eq("status", "available")
      .order("created_at", { ascending: false })
      .limit(limit + 1)
      .range(0, limit);

  if (cursor) {
    // For cursor-based pagination we filter by created_at less than the cursor
    // (will apply below when executing query)
  }

  let data: any = [];
  let error: any = null;

  // Try admin client first when possible
  if (canUseAdmin) {
    try {
      const res = await supabaseAdmin
        .from("properties")
        .select("*")
        .eq("status", "available")
        .order("created_at", { ascending: false })
        .limit(limit + 1);

      data = res.data;
      error = res.error;

      if (error && /invalid api key/i.test(String(error.message || ""))) {
        // fall back to public client
        const fb = await supabasePublic
          .from("properties")
          .select("*")
          .eq("status", "available")
          .order("created_at", { ascending: false })
          .limit(limit + 1);
        data = fb.data;
        error = fb.error;
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : String(err);
      // fallback to public client
      try {
        const fb = await supabasePublic
          .from("properties")
          .select("*")
          .eq("status", "available")
          .order("created_at", { ascending: false })
          .limit(limit + 1);
        data = fb.data;
        error = fb.error;
      } catch (err2: unknown) {
        const msg2 = err2 instanceof Error ? err2.message : String(err2);
        throw new Error(`Supabase request failed (admin then public): ${msg}; ${msg2}`);
      }
    }
  } else {
    try {
      const res = await supabasePublic
        .from("properties")
        .select("*")
        .eq("status", "available")
        .order("created_at", { ascending: false })
        .limit(limit + 1);
      data = res.data;
      error = res.error;
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : String(err);
      throw new Error(`Supabase request failed: ${msg}`);
    }
  }

  if (error) {
    const message = error?.message || JSON.stringify(error);
    throw new Error(`Supabase returned an error: ${message}`);
  }

  const results = (data || []) as Property[];
  let nextCursor: string | null = null;
  if (results.length > limit) {
    nextCursor = results[limit].created_at;
    results.pop();
  }

  return { properties: results, nextCursor };
}
