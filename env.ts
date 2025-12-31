/**
 * Centralized environment variable management
 * - Separates public vs server-only envs
 * - Fails fast on missing critical variables
 * - Safe for production usage
 */

function requireEnv(name: string): string {
  const value = process.env[name];
  if (!value) {
    throw new Error(`❌ Missing required environment variable: ${name}`);
  }
  return value;
}

/**
 * PUBLIC VARIABLES (safe to expose to browser)
 * Must always start with NEXT_PUBLIC_
 */
export const publicEnv = {
  supabase: {
    // Required for frontend Supabase usage
    projectId: requireEnv("NEXT_PUBLIC_SUPABASE_PROJECT_ID"),
    url: requireEnv("NEXT_PUBLIC_SUPABASE_URL"),
    anonKey: requireEnv("NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY"),
    enableRealtime: process.env.NEXT_PUBLIC_ENABLE_REALTIME === "true",
  },

  app: {
    domain: requireEnv("NEXT_PUBLIC_DOMAIN"),
    apiDomain: requireEnv("NEXT_PUBLIC_API_DOMAIN"),
  },

  admin: {
    emails: process.env.NEXT_PUBLIC_ADMIN_EMAILS
      ? process.env.NEXT_PUBLIC_ADMIN_EMAILS.split(",").map(e => e.trim())
      : [],
  },
};

/**
 * SERVER-ONLY SECRETS
 * NEVER import into client components
 */
export const serverEnv = {
  database: {
    mongodbUrl: requireEnv("MONGODB_URI"), // ensure matches your .env key
  },

  auth: {
    nextAuthUrl: requireEnv("NEXTAUTH_URL"),
    nextAuthSecret: requireEnv("NEXTAUTH_SECRET"),
    googleClientId: requireEnv("GOOGLE_CLIENT_ID"),
    googleClientSecret: requireEnv("GOOGLE_CLIENT_SECRET"),
  },

  storage: {
    cloudinaryCloudName: requireEnv("CLOUDINARY_CLOUD_NAME"),
    cloudinaryApiKey: requireEnv("CLOUDINARY_API_KEY"),
    cloudinaryApiSecret: requireEnv("CLOUDINARY_API_SECRET"),
  },

  admin: {
    emails: process.env.ADMIN_EMAILS
      ? process.env.ADMIN_EMAILS.split(",").map(e => e.trim())
      : [],
  },

  ai: {
    openaiApiKey: process.env.OPENAI_API_KEY || "",
  },
};
