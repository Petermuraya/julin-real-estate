// infrastructure/database/supabase.client.ts
import { createClient, SupabaseClient } from "@supabase/supabase-js";
import { publicEnv } from "@/config/env";

/**
 * ------------------------------------------------------------
 * PUBLIC SUPABASE CLIENT
 * ------------------------------------------------------------
 * - Safe for browser and server usage
 * - Uses ANON (publishable) key
 * - Fully governed by Supabase RLS
 */
export const supabasePublic: SupabaseClient = createClient(
  publicEnv.SUPABASE_URL,
  publicEnv.SUPABASE_ANON_KEY,
  {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
      detectSessionInUrl: false,
    },
  }
);

/**
 * Alias for convenience in read-only or RLS-protected operations
 */
export const supabase = supabasePublic;

/**
 * ------------------------------------------------------------
 * SERVER-ONLY ADMIN SUPABASE CLIENT
 * ------------------------------------------------------------
 * - Uses SERVICE ROLE key
 * - Full database access (bypasses RLS)
 * - MUST NEVER be imported into client components
 */
export const supabaseAdmin: SupabaseClient = (() => {
  if (typeof window !== "undefined") {
    throw new Error("❌ Supabase admin client cannot run in the browser");
  }

  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!serviceRoleKey) {
    throw new Error(
      "❌ Missing SUPABASE_SERVICE_ROLE_KEY for admin Supabase access"
    );
  }

  return createClient(publicEnv.SUPABASE_URL, serviceRoleKey, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
    },
  });
})();
