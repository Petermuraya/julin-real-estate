import {
  supabaseBrowser,
  supabaseServer,
} from "@/infrastructure/database/supabase.client";
import { Property } from "./property.model";

/* =====================================================
   PUBLIC QUERIES (Browser-safe, RLS enforced)
   ===================================================== */

/**
 * PUBLIC: Fetch all published properties with optional filters
 * Used on:
 *  - Home page
 *  - Public listings
 */
export async function getPublicProperties(filters?: {
  county?: string;
  type?: string;
  minPrice?: number;
  maxPrice?: number;
}): Promise<Property[]> {
  const isServer = typeof window === "undefined";
  const client = isServer && supabaseServer ? supabaseServer : supabaseBrowser;

  let query = client.from("properties").select("*").eq("status", "available");

  if (filters?.county) query = query.eq("county", filters.county);
  if (filters?.type) query = query.eq("property_type", filters.type);
  if (filters?.minPrice) query = query.gte("price", filters.minPrice);
  if (filters?.maxPrice) query = query.lte("price", filters.maxPrice);

  const { data, error } = await query.order("created_at", { ascending: false });

  if (error) {
    throw new Error(error.message);
  }

  return data as Property[];
}

/**
 * PUBLIC: Fetch single property by slug
 * Used on:
 *  - /properties/[slug]
 */
export async function getPropertyBySlug(slug: string): Promise<Property> {
  const isServer = typeof window === "undefined";
  const client = isServer && supabaseServer ? supabaseServer : supabaseBrowser;

  const { data, error } = await client
    .from("properties")
    .select("*")
    .eq("slug", slug)
    .eq("status", "available")
    .single();

  if (error) {
    throw new Error(error.message);
  }

  return data as Property;
}

/**
 * PUBLIC: Fetch available properties (alias for optional filters)
 */
export async function getAvailableProperties(filters?: {
  county?: string;
  type?: string;
  minPrice?: number;
  maxPrice?: number;
}): Promise<Property[]> {
  return getPublicProperties(filters);
}

/* =====================================================
   ADMIN QUERIES (Server-only, Service Role)
   ===================================================== */

/**
 * ADMIN: Fetch ALL properties (any status)
 * Used on:
 *  - Admin properties table
 */
export async function getAllPropertiesAdmin(): Promise<Property[]> {
  if (!supabaseServer) {
    throw new Error("Admin client not initialized");
  }

  const { data, error } = await supabaseServer
    .from("properties")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    throw new Error(error.message);
  }

  return data as Property[];
}

/**
 * ADMIN: Fetch single property by ID
 * Used on:
 *  - Edit property page
 */
export async function getPropertyById(id: string): Promise<Property> {
  if (!supabaseServer) {
    throw new Error("Admin client not initialized");
  }

  const { data, error } = await supabaseServer
    .from("properties")
    .select("*")
    .eq("id", id)
    .single();

  if (error) {
    throw new Error(error.message);
  }

  return data as Property;
}

/**
 * ADMIN: Create new property
 * Used on:
 *  - Admin add property form
 */
export async function createProperty(
  payload: Partial<Property>
): Promise<Property> {
  if (!supabaseServer) {
    throw new Error("Admin client not initialized");
  }

  const { data, error } = await supabaseServer
    .from("properties")
    .insert(payload)
    .select()
    .single();

  if (error) {
    throw new Error(error.message);
  }

  return data as Property;
}

/**
 * ADMIN: Update existing property
 * Used on:
 *  - Edit property
 *  - Status toggle (available / sold / draft)
 */
export async function updateProperty(
  id: string,
  payload: Partial<Property>
): Promise<Property> {
  if (!supabaseServer) {
    throw new Error("Admin client not initialized");
  }

  const { data, error } = await supabaseServer
    .from("properties")
    .update(payload)
    .eq("id", id)
    .select()
    .single();

  if (error) {
    throw new Error(error.message);
  }

  return data as Property;
}

/* =====================================================
   DELETE / SOFT DELETE
   ===================================================== */

/**
 * ADMIN: Soft delete property (recommended)
 * We NEVER hard delete land records
 */
export async function deleteProperty(id: string): Promise<void> {
  if (!supabaseServer) {
    throw new Error("Admin client not initialized");
  }

  const { error } = await supabaseServer
    .from("properties")
    .update({ status: "draft" })
    .eq("id", id);

  if (error) {
    throw new Error(error.message);
  }
}

/**
 * ADMIN: Hard delete property (use with extreme caution)
 * Only for non-land properties if needed
 */
export async function hardDeleteProperty(id: string): Promise<void> {
  if (!supabaseServer) {
    throw new Error("Admin client not initialized");
  }

  const { error } = await supabaseServer
    .from("properties")
    .delete()
    .eq("id", id);

  if (error) {
    throw new Error(error.message);
  }
}

/* =====================================================
   CURSOR-BASED PAGINATION (Public)
   ===================================================== */

/**
 * Fetch properties with cursor-based pagination
 */
export async function getPropertiesPaginated(
  limit = 10,
  cursor?: string,
  filters?: {
    county?: string;
    type?: string;
    minPrice?: number;
    maxPrice?: number;
  }
) {
  // Choose Supabase client: prefer server client when running on the server
  const isServer = typeof window === "undefined";
  const client = isServer && supabaseServer ? supabaseServer : supabaseBrowser;

  let query = client
    .from("properties")
    .select("*")
    .eq("status", "available")
    .order("created_at", { ascending: false })
    .limit(limit + 1); // fetch one extra to check for next cursor

  if (cursor) query = query.gt("created_at", cursor);
  if (filters?.county) query = query.eq("county", filters.county);
  if (filters?.type) query = query.eq("property_type", filters.type);
  if (filters?.minPrice) query = query.gte("price", filters.minPrice);
  if (filters?.maxPrice) query = query.lte("price", filters.maxPrice);

  let data: any;
  let error: any;
  try {
    const res = await query;
    data = res.data;
    error = res.error;
  } catch (err: any) {
    throw new Error(
      `Supabase request failed (${isServer && supabaseServer ? "server" : "browser"} client): ${
        err?.message || String(err)
      }`
    );
  }

  if (error) {
    throw new Error(
      `Supabase error (${isServer && supabaseServer ? "server" : "browser"} client): ${
        error.message || JSON.stringify(error)
      }`
    );
  }

  let nextCursor: string | null = null;
  if (data.length > limit) {
    nextCursor = data[limit - 1].created_at;
    data.pop();
  }

  return { properties: data as Property[], nextCursor };
}
