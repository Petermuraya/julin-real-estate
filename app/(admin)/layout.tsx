"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const { data: session, status } = useSession();
  const router = useRouter();

  if (status === "loading") return <div>Loading...</div>;

  if (!session || !session.user || !session.user.email) {
    router.push("/login");
    return null;
  }

  // Client-side allowlist check (UI hint only)
  const ADMIN_EMAILS = (process.env.NEXT_PUBLIC_ADMIN_EMAILS || "")
    .split(',')
    .map(s => s.trim())
    .filter(Boolean);

  if (!ADMIN_EMAILS.includes(session.user.email)) {
    router.push("/login");
    return null;
  }

  return <div className="min-h-screen flex flex-col">{children}</div>;
}
