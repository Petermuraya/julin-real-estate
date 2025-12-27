import { useSession } from "next-auth/react";

const ADMIN_EMAILS = (process.env.NEXT_PUBLIC_ADMIN_EMAILS || "")
  .split(",")
  .map((s) => s.trim())
  .filter(Boolean);

export function useAdmin() {
  const { data: session } = useSession();
  return ADMIN_EMAILS.includes(session?.user?.email ?? "");
}
