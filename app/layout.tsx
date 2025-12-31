"use client";

import React, { useEffect, useState, useMemo } from "react";
import Link from "next/link";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [collapsed, setCollapsed] = useState(false);

  // Admin email allowlist
  const ADMIN_EMAILS = useMemo(
    () =>
      (process.env.NEXT_PUBLIC_ADMIN_EMAILS || "")
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean),
    []
  );

  // Redirect if not authenticated or not admin
  useEffect(() => {
    if (status === "unauthenticated" || !session?.user?.email || !ADMIN_EMAILS.includes(session.user.email)) {
      router.push("/login");
    }
  }, [status, session, router, ADMIN_EMAILS]);

  if (status === "loading" || !session || !session.user?.email || !ADMIN_EMAILS.includes(session.user.email)) {
    return <div>Loading...</div>;
  }

  return (
    <div className="flex h-screen bg-[var(--color-surface)] text-[var(--color-text)]">
      {/* Sidebar */}
      <aside className={`flex flex-col p-4 text-white ${collapsed ? "w-20" : "w-64"} transition-all bg-[var(--color-primary)]`}>
        <div className="flex items-center justify-between mb-6">
          <h2 className={`text-lg font-bold ${collapsed ? "truncate" : ""}`}>Julin Admin</h2>
          <button onClick={() => setCollapsed((c) => !c)} className="opacity-90 hover:opacity-100">
            {collapsed ? "›" : "‹"}
          </button>
        </div>

        <nav className="flex flex-col gap-2">
          <Link href="/(admin)/admin/dashboard" className="px-2 py-2 rounded hover:bg-[var(--color-primary-light)]/20 transition">Dashboard</Link>
          <Link href="/(admin)/admin/properties" className="px-2 py-2 rounded hover:bg-[var(--color-primary-light)]/20 transition">Properties</Link>
          <Link href="/(admin)/admin/blog" className="px-2 py-2 rounded hover:bg-[var(--color-primary-light)]/20 transition">Blog</Link>
          <Link href="/(admin)/admin/leads" className="px-2 py-2 rounded hover:bg-[var(--color-primary-light)]/20 transition">Leads</Link>
          <Link href="/(admin)/admin/settings" className="px-2 py-2 rounded hover:bg-[var(--color-primary-light)]/20 transition">Settings</Link>
        </nav>

        <div className="mt-auto text-sm text-white/80">Signed in as {session.user.email}</div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto">
        <header className="flex items-center justify-between p-4 border-b bg-white">
          <div>
            <h1 className="text-xl font-semibold">Admin</h1>
            <p className="text-sm text-[var(--color-muted)]">Manage properties, leads and content</p>
          </div>
          <div className="flex items-center gap-3">
            <Link href="/(admin)/admin/properties/new" className="btn btn-primary">Add Property</Link>
            <button className="px-3 py-2 rounded border hover:bg-[var(--color-primary)] hover:text-white transition">Invite</button>
          </div>
        </header>

        <div className="p-6">{children}</div>
      </main>
    </div>
  );
}
