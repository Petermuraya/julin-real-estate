import GoogleProvider from "next-auth/providers/google";
import { NextAuthOptions } from "next-auth";

const ADMIN_EMAILS = process.env.ADMIN_EMAILS?.split(",") || [];

export const authOptions: NextAuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
  ],
  secret: process.env.NEXTAUTH_SECRET,
  pages: {
    signIn: "/login",
    error: "/error",
  },
  callbacks: {
    async session({ session }) {
      if (session.user && ADMIN_EMAILS.includes(session.user.email!)) {
        (session.user as any).isAdmin = true;
      } else {
        (session.user as any).isAdmin = false;
      }
      return session;
    },
  },
};
 