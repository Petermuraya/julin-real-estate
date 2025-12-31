// infrastructure/auth/nextauth.config.ts
/**
 * Central NextAuth configuration
 * - JWT-based auth (required for middleware)
 * - Google OAuth provider
 * - Email-based admin RBAC
 * - NO UI assumptions
 */

import type { NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import { serverEnv } from "@/config/env";

export const authOptions: NextAuthOptions = {
  providers: [
    GoogleProvider({
      clientId: serverEnv.auth.googleClientId,
      clientSecret: serverEnv.auth.googleClientSecret,
    }),
  ],

  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },

  secret: serverEnv.auth.nextAuthSecret,

  callbacks: {
    /**
     * Persist identity & role into JWT
     * Used by middleware for RBAC
     */
    async jwt({ token, user }) {
      if (user?.email) {
        const email = user.email.toLowerCase();
        token.email = email;
        token.isAdmin = serverEnv.admin.emails.includes(email);
      }
      return token;
    },

    /**
     * Expose safe fields to client session
     */
    async session({ session, token }) {
      if (session.user) {
        session.user.email = token.email as string;
        (session.user as any).isAdmin = token.isAdmin as boolean;
      }
      return session;
    },

    /**
     * Allow login for any valid Google account
     * Authorization is enforced by middleware
     */
    async signIn({ user }) {
      return !!user?.email;
    },
  },

  pages: {
    signIn: "/login",
    error: "/error",
  },
};
