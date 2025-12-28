// app/(admin)/layout.tsx
import { ReactNode } from "react";

export default function AdminLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-[var(--color-surface)]">
      <header className="p-4 bg-[var(--color-primary-dark)] text-white">Admin Panel</header>
      <main className="p-4">{children}</main>
    </div>
  );
}

// Add this line below the component to prefix all children routes
export const segmentPath = "admin";
