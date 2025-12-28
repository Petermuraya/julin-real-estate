"use client";

import React from "react";

export function Skeleton({ className = "", children }: { className?: string; children?: React.ReactNode }) {
  return (
    <div className={`animate-pulse bg-[var(--color-surface)] ${className}`}>{children}</div>
  );
}
