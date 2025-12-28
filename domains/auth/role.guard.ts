import { env } from "@/config/env";

export function isAdmin(email?: string | null): boolean {
  if (!email) return false;
  return env.adminEmails.includes(email);
}
