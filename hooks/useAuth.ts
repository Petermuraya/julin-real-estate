// hooks/useAuth.ts

import { useSession, signIn, signOut } from "next-auth/react";

export function useAuth() {
  const { data: session, status } = useSession();

  const isAuthenticated = status === "authenticated";
  const isAdmin = session?.user?.isAdmin ?? false;
  const userEmail = session?.user?.email ?? null;

  return {
    session,
    status,
    isAuthenticated,
    isAdmin,
    userEmail,
    login: (provider: string = "google") => signIn(provider),
    logout: () => signOut(),
  };
}
