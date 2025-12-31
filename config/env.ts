export const env = {
  adminEmails: (process.env.ADMIN_EMAILS || "")
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean),
};
// config/env.ts
/**
 * Centralized environment variable validation
 * - Prevents runtime crashes
 * - Enforces public vs server-only boundaries
 * - Makes hybrid architecture safe by default
 */

function required(name: string, value?: string) {
  if (!value) {
    throw new Error(`❌ Missing required environment variable: ${name}`);
  }
  return value;
}

/**
 * Public variables (safe for browser)
 * MUST be prefixed with NEXT_PUBLIC_
 */
export const publicEnv = {
  SUPABASE_URL: required(
    "NEXT_PUBLIC_SUPABASE_URL",
    process.env.NEXT_PUBLIC_SUPABASE_URL
  ),

  SUPABASE_ANON_KEY: required(
    "NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY",
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY
  ),

  DOMAIN: required(
    "NEXT_PUBLIC_DOMAIN",
    process.env.NEXT_PUBLIC_DOMAIN
  ),
};

/**
 * Server-only variables (never exposed to client)
 */
export const serverEnv = {
  // Auth
  NEXTAUTH_SECRET: required(
    "NEXTAUTH_SECRET",
    process.env.NEXTAUTH_SECRET
  ),

  NEXTAUTH_URL: required(
    "NEXTAUTH_URL",
    process.env.NEXTAUTH_URL
  ),

  // Supabase (server power)
  SUPABASE_SERVICE_ROLE_KEY: required(
    "SUPABASE_SERVICE_ROLE_KEY",
    process.env.SUPABASE_SERVICE_ROLE_KEY
  ),

  // MongoDB
  MONGODB_URI: required(
    "MONGODB_URL",
    process.env.MONGODB_URL
  ),

  // Google OAuth
  GOOGLE_CLIENT_ID: required(
    "GOOGLE_CLIENT_ID",
    process.env.GOOGLE_CLIENT_ID
  ),

  GOOGLE_CLIENT_SECRET: required(
    "GOOGLE_CLIENT_SECRET",
    process.env.GOOGLE_CLIENT_SECRET
  ),

  // Cloudinary
  CLOUDINARY: {
    CLOUD_NAME: required(
      "CLOUDINARY_CLOUD_NAME",
      process.env.CLOUDINARY_CLOUD_NAME
    ),
    API_KEY: required(
      "CLOUDINARY_API_KEY",
      process.env.CLOUDINARY_API_KEY
    ),
    API_SECRET: required(
      "CLOUDINARY_API_SECRET",
      process.env.CLOUDINARY_API_SECRET
    ),
  },

  // Admin enforcement
  ADMIN_EMAILS: required(
    "ADMIN_EMAILS",
    process.env.ADMIN_EMAILS
  )
    .split(",")
    .map(email => email.trim().toLowerCase()),
};

/**
 * Runtime guard
 * Prevent accidental serverEnv usage in browser
 */
export const isServer = typeof window === "undefined";
