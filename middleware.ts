import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { getToken } from 'next-auth/jwt';

const ADMIN_ROUTES = ['/admin'];

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // Allow auth & internal Next.js routes
  if (
    pathname.startsWith('/api/auth') ||
    pathname.startsWith('/_next') ||
    pathname === '/favicon.ico'
  ) {
    return NextResponse.next();
  }

  // Protect admin routes
  if (ADMIN_ROUTES.some((route) => pathname.startsWith(route))) {
    const token = await getToken({
      req,
      secret: process.env.NEXTAUTH_SECRET,
    });

    // Not authenticated
    if (!token) {
      return NextResponse.redirect(new URL('/login', req.url));
    }

    // Not an admin
    if (
      !token.email ||
      !process.env.ADMIN_EMAILS?.split(',').includes(token.email)
    ) {
      return NextResponse.redirect(new URL('/', req.url));
    }
  }

  return NextResponse.next();
}

/**
 * Middleware config MUST be top-level
 */
export const config = {
  matcher: ['/admin/:path*'],
};
