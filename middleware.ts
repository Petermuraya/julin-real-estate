// middleware.ts
/**
 * Global security middleware
 * - Protects admin UI and admin APIs
 * - Enforces authentication
 * - Enforces email-based Admin RBAC
 * - App Router compatible (route groups ignored correctly)
 */

import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";
import { serverEnv } from "@/config/env";

/**
 * Paths that require ADMIN access
 * NOTE:
 * - Route groups like (admin) are NOT visible here
 * - We must match the actual URL paths
 */
const ADMIN_PATH_PREFIXES = [
  "/admin",
  "/api/admin",
  "/api/properties",
  "/api/blog",
  "/api/leads",
];

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  const isAdminPath = ADMIN_PATH_PREFIXES.some(prefix =>
    pathname.startsWith(prefix)
  );

  // Public routes pass through
  if (!isAdminPath) {
    return NextResponse.next();
  }

  const token = await getToken({
    req,
    secret: serverEnv.auth.nextAuthSecret,
  });

  // Not authenticated
  if (!token || !token.email) {
    const loginUrl = new URL("/login", req.url);
    loginUrl.searchParams.set("reason", "auth_required");
    return NextResponse.redirect(loginUrl);
  }

  const email = token.email.toLowerCase();
  const isAdmin = serverEnv.admin.emails.includes(email);

  // Authenticated but NOT admin
  if (!isAdmin) {
    const errorUrl = new URL("/error", req.url);
    errorUrl.searchParams.set("reason", "unauthorized");
    return NextResponse.redirect(errorUrl);
  }

  // Authenticated & authorized
  return NextResponse.next();
}

/**
 * Limit middleware execution scope
 * (Performance + safety)
 */
export const config = {
  matcher: [
    "/admin/:path*",
    "/api/admin/:path*",
    "/api/properties/:path*",
    "/api/blog/:path*",
    "/api/leads/:path*",
  ],
};
