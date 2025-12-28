"use client";

import React from "react";

export default function StatusBadge({ type, status }: { type?: string; status?: string }) {
  const typeClass = type === "land" ? "bg-[var(--color-primary)] text-white" : "bg-[var(--color-surface)] text-[var(--color-text)]";

  let statusClass = "bg-[var(--color-surface)] text-[var(--color-text)]";
  if (status === "available") statusClass = "bg-[var(--color-success)] text-white";
  if (status === "sold") statusClass = "bg-[var(--color-error)] text-white";
  if (status === "draft") statusClass = "bg-[var(--color-muted)] text-white";
  if ((status as any) === "reserved") statusClass = "bg-[var(--color-warning)] text-white";

  return (
    <div className="flex items-center gap-2">
      {type && <span className={`px-2 py-1 rounded-full text-xs font-semibold ${typeClass} capitalize`}>{type}</span>}
      {status && <span className={`px-2 py-1 rounded-full text-xs font-semibold ${statusClass} capitalize`}>{status}</span>}
    </div>
  );
}
