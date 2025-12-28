import { withAuth } from "next-auth/middleware";
import { isAdmin } from "@/domains/auth/role.guard";

export default withAuth({
  callbacks: {
    async authorized({ token, req }) {
      const pathname = req.nextUrl.pathname;

      // Allow public & auth routes
      if (pathname.startsWith("/login") || pathname.startsWith("/api/auth")) {
        return true;
      }

      // Protect admin routes
      if (pathname.startsWith("/admin")) {
        return isAdmin((token as any)?.email as string);
      }

      return true;
    },
  },
});

export const config = {
  matcher: ["/admin/:path*"],
};
