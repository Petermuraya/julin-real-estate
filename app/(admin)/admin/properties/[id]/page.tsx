"use client";

import { useEffect, useState } from "react";
import { useToast } from "@/ui/components/ui/toast";
import { useParams, useRouter } from "next/navigation";
import { propertySchema } from "@/domains/property/property.validation";

// 1️⃣ Define proper type for property
interface PropertyForm {
  id: string;
  title: string;
  description: string;
  price: number;
  status: "draft" | "available" | "reserved" | "sold";
}

export default function EditPropertyPage() {
  const { id } = useParams();
  const router = useRouter();

  const [form, setForm] = useState<PropertyForm | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // 2️⃣ Fetch property
  useEffect(() => {
    if (!id) return;
    fetch(`/api/properties?id=${id}`)
      .then(res => res.json())
      .then((data: PropertyForm) => setForm(data))
      .catch(() => setError("Failed to load property"))
      .finally(() => setLoading(false));
  }, [id]);

  // 3️⃣ Handle input changes
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;

    if (!form) return;

    setForm(prev => prev ? { ...prev, [name]: name === "price" ? Number(value) : value } : null);
  };

  // 4️⃣ Submit changes
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form) return;

    setSaving(true);
    setError(null);

    try {
      propertySchema.partial().parse(form);

      const res = await fetch("/api/properties", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to update property");
      toast.push({ message: "Property updated", type: "success" });
      router.push("/(admin)/properties");
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Unknown error occurred";
      setError(msg);
      toast.push({ message: msg, type: "error" });
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <p className="p-6">Loading...</p>;
  if (!form) return <p className="p-6 text-[var(--color-error)]">Not found</p>;

  return (
    <div className="max-w-3xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">Edit Property</h1>
      {error && <p className="text-[var(--color-error)] mb-4">{error}</p>}

      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          name="title"
          value={form.title}
          onChange={handleChange}
          className="w-full px-3 py-2 rounded-md border border-[var(--color-surface)] focus:border-[var(--color-primary-light)] focus:shadow-sm"
        />

        <textarea
          name="description"
          value={form.description}
          onChange={handleChange}
          className="w-full px-3 py-2 rounded-md border border-[var(--color-surface)] focus:border-[var(--color-primary-light)] focus:shadow-sm"
        />

        <input
          type="number"
          name="price"
          value={form.price}
          onChange={handleChange}
          className="w-full px-3 py-2 rounded-md border border-[var(--color-surface)] focus:border-[var(--color-primary-light)] focus:shadow-sm"
        />

        <select
          name="status"
          value={form.status}
          onChange={handleChange}
          className="w-full px-3 py-2 rounded-md border border-[var(--color-surface)] focus:border-[var(--color-primary-light)] focus:shadow-sm"
        >
          <option value="draft">Draft</option>
          <option value="available">Available</option>
          <option value="reserved">Reserved</option>
          <option value="sold">Sold</option>
        </select>

        <button
          type="submit"
          disabled={saving}
          className="btn btn-primary w-full justify-center disabled:opacity-60"
        >
          {saving ? "Saving..." : "Save Changes"}
        </button>
      </form>
    </div>
  );
}
