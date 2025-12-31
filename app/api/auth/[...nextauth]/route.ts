// app/api/auth/[...nextauth]/route.ts
/**
 * NextAuth App Router entry point
 * - Wires authOptions into Next.js API layer
 * - Supports GET & POST
 * - Fully compatible with middleware + JWT
 */

import NextAuth from "next-auth";
import { authOptions } from "@/infrastructure/auth/nextauth.config";

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
