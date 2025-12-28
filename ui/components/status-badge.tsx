"use client";

import React from "react";

export default function StatusBadge({ type, status }: { type?: string; status?: string }) {
  const typeClass = type === "land" ? "bg-[var(--color-primary)] text-white" : "bg-gray-300 text-[var(--color-text)]";

  let statusClass = "bg-gray-200 text-[var(--color-text)]";
  if (status === "available") statusClass = "bg-green-500 text-white";
  if (status === "sold") statusClass = "bg-red-500 text-white";
  if (status === "draft") statusClass = "bg-gray-400 text-white";
  if ((status as any) === "reserved") statusClass = "bg-amber-500 text-white";

  return (
    <div className="flex items-center gap-2">
      {type && <span className={`px-2 py-1 rounded-full text-xs font-semibold ${typeClass} capitalize`}>{type}</span>}
      {status && <span className={`px-2 py-1 rounded-full text-xs font-semibold ${statusClass} capitalize`}>{status}</span>}
    </div>
  );
}
