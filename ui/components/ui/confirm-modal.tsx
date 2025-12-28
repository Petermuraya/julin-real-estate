"use client";

import React from "react";

export default function ConfirmModal({ open, title, message, onCancel, onConfirm }: {
  open: boolean;
  title?: string;
  message?: string;
  onCancel: () => void;
  onConfirm: () => void;
}) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="bg-white rounded-lg p-6 w-full max-w-md">
        <h3 className="text-lg font-semibold mb-2">{title || "Confirm"}</h3>
        <p className="text-sm text-[var(--color-muted)] mb-4">{message || "Are you sure?"}</p>
        <div className="flex justify-end gap-3">
          <button onClick={onCancel} className="px-3 py-2 rounded border">Cancel</button>
          <button onClick={onConfirm} className="px-3 py-2 rounded bg-red-500 text-white">Delete</button>
        </div>
      </div>
    </div>
  );
}
