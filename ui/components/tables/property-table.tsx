"use client";

import React, { useState } from "react";
import { useToast } from "@/ui/components/ui/toast";
import { Skeleton } from "@/ui/components/ui/skeleton";
import type { Property } from "@/domains/property/property.model";
import StatusBadge from "@/ui/components/status-badge";
import ConfirmModal from "@/ui/components/ui/confirm-modal";

export default function PropertyTable({ properties, onEdit, onDelete, isLoading = false }: {
  properties: Property[];
  onEdit?: (p: Property) => void;
  onDelete?: (p: Property) => Promise<void> | void;
  isLoading?: boolean;
}) {
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [target, setTarget] = useState<Property | null>(null);
  const toast = useToast();

  const handleDelete = (p: Property) => {
    setTarget(p);
    setConfirmOpen(true);
  };

  const confirmDelete = async () => {
    if (!target) return;
    setConfirmOpen(false);
    try {
      await onDelete?.(target);
      toast.push({ message: "Property deleted", type: "success" });
    } finally {
      setTarget(null);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow overflow-auto">
      <table className="min-w-full table-auto">
        <thead>
          <tr className="text-left border-b">
            <th className="px-4 py-3">Title</th>
            <th className="px-4 py-3">Type</th>
            <th className="px-4 py-3">Location</th>
            <th className="px-4 py-3">Price</th>
            <th className="px-4 py-3">Status</th>
            <th className="px-4 py-3">Actions</th>
          </tr>
        </thead>
        <tbody>
          {isLoading
            ? Array.from({ length: 5 }).map((_, i) => (
                <tr key={i}>
                  <td className="px-4 py-4"><Skeleton className="h-4 w-3/4 rounded" /></td>
                  <td className="px-4 py-4"><Skeleton className="h-4 w-1/2 rounded" /></td>
                  <td className="px-4 py-4"><Skeleton className="h-4 w-1/3 rounded" /></td>
                  <td className="px-4 py-4"><Skeleton className="h-4 w-1/4 rounded" /></td>
                  <td className="px-4 py-4"><Skeleton className="h-4 w-1/4 rounded" /></td>
                  <td className="px-4 py-4"><Skeleton className="h-4 w-16 rounded" /></td>
                </tr>
              ))
            : properties.map((p) => (
                <tr key={p.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3">{p.title}</td>
                  <td className="px-4 py-3"><span className="capitalize">{p.type}</span></td>
                  <td className="px-4 py-3">{p.county}</td>
                  <td className="px-4 py-3">KES {p.price.toLocaleString()}</td>
                  <td className="px-4 py-3"><StatusBadge type={p.type} status={p.status} /></td>
                  <td className="px-4 py-3">
                    <div className="flex gap-2">
                      <button onClick={() => onEdit?.(p)} className="px-2 py-1 rounded border text-sm">Edit</button>
                      <button onClick={() => handleDelete(p)} className="px-2 py-1 rounded border text-sm text-red-600">Delete</button>
                      <a href={`/properties/${p.slug}`} target="_blank" rel="noreferrer" className="px-2 py-1 rounded border text-sm">View</a>
                    </div>
                  </td>
                </tr>
              ))}
        </tbody>
      </table>

      <ConfirmModal
        open={confirmOpen}
        title="Delete property"
        message={target ? `Delete "${target.title}"? This cannot be undone.` : undefined}
        onCancel={() => setConfirmOpen(false)}
        onConfirm={confirmDelete}
      />
    </div>
  );
}
