"use client";

import { useEffect, useState } from "react";

interface Property {
  id: string;
  title: string;
  type: string;
  status: "draft" | "available" | "reserved" | "sold";
  price: number;
  county: string;
  created_at: string;
}

export default function AdminPropertiesPage() {
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const fetchProperties = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/properties");
      if (!res.ok) throw new Error("Failed to fetch properties");
      const data: Property[] = await res.json();
      setProperties(data);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Something went wrong";
      console.error(err);
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProperties();
  }, []);

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this property?")) return;
    setDeletingId(id);
    try {
      const res = await fetch("/api/properties", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
      });
      if (!res.ok) throw new Error("Delete failed");
      setProperties(prev => prev.filter(p => p.id !== id));
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Delete failed";
      console.error(err);
      alert(msg);
    } finally {
      setDeletingId(null);
    }
  };

  if (loading) return <p className="p-6">Loading properties...</p>;
  if (error) return <p className="p-6 text-[var(--color-error)]">Error: {error}</p>;
  if (properties.length === 0) return <p className="p-6">No properties found.</p>;

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">All Properties</h1>

      <div className="overflow-x-auto">
        <table className="min-w-full border-collapse border">
          <thead>
            <tr className="bg-[var(--color-surface)]">
              <th className="border p-2 text-left">Title</th>
              <th className="border p-2">Type</th>
              <th className="border p-2">County</th>
              <th className="border p-2">Price (KES)</th>
              <th className="border p-2">Status</th>
              <th className="border p-2">Created</th>
              <th className="border p-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {properties.map(p => (
              <tr key={p.id}>
                <td className="border p-2">
                  <a
                    href={`/(admin)/properties/${p.id}`}
                    className="text-[var(--color-primary)] underline"
                  >
                    {p.title}
                  </a>
                </td>
                <td className="border p-2 capitalize">{p.type}</td>
                <td className="border p-2">{p.county}</td>
                <td className="border p-2">{p.price.toLocaleString()}</td>
                <td className="border p-2">{p.status}</td>
                <td className="border p-2">
                  {new Date(p.created_at).toLocaleDateString()}
                </td>
                <td className="border p-2 flex gap-2">
                  <a
                    href={`/(admin)/properties/${p.id}`}
                    className="text-white bg-[var(--color-primary)] px-3 py-1 rounded hover:bg-[var(--color-primary-dark)]"
                  >
                    Edit
                  </a>
                  <button
                    onClick={() => handleDelete(p.id)}
                    disabled={deletingId === p.id}
                    className="text-white bg-[var(--color-error)] px-3 py-1 rounded hover:brightness-90"
                  >
                    {deletingId === p.id ? "Deleting..." : "Delete"}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
