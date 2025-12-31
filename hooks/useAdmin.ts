import { useSession } from "next-auth/react";

const ADMIN_EMAILS = (process.env.NEXT_PUBLIC_ADMIN_EMAILS || "")
  .split(",")
  .map((s) => s.trim())
  .filter(Boolean);

export function useAdmin() {
  const { data: session } = useSession();
  return ADMIN_EMAILS.includes(session?.user?.email ?? "");
}

// hooks/useAdmin.ts

import { useAuth } from "./useAuth";
import { canPerform, Role } from "../config/permissions";

export function useAdmin() {
  const { isAdmin, isAuthenticated, userEmail } = useAuth();

  /**
   * Checks if admin can perform a given action
   * @param action Action string
   */
  const can = (action: string) => {
    if (!isAuthenticated || !isAdmin) return false;
    return canPerform("ADMIN" as Role, action);
  };

  return {
    isAdmin,
    isAuthenticated,
    userEmail,
    can,
  };
}
