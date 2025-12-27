import { createClient, SupabaseClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey =
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
  process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl) {
  throw new Error("Missing environment variable NEXT_PUBLIC_SUPABASE_URL");
}

if (!supabaseAnonKey) {
  throw new Error(
    "Missing environment variable NEXT_PUBLIC_SUPABASE_ANON_KEY or NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY"
  );
}

/**
 * Browser-safe client (PUBLIC READS ONLY)
 */
export const supabaseBrowser: SupabaseClient = createClient(
  supabaseUrl,
  supabaseAnonKey
);

/**
 * Server-side admin client (FULL ACCESS)
 * ⚠️ NEVER expose this to the browser
 * If the service role key is not provided we'll export `null` so callers
 * can guard against missing admin access.
 */
export const supabaseServer: SupabaseClient | null =
  supabaseServiceRoleKey && supabaseServiceRoleKey.length
    ? createClient(supabaseUrl, supabaseServiceRoleKey)
    : null;
