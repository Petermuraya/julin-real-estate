"use client";

import { useState } from "react";
import { useToast } from "@/ui/components/ui/toast";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { propertySchema } from "@/domains/property/property.validation";

export default function AddPropertyPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Form state
  const [form, setForm] = useState({
    title: "",
    slug: "",
    description: "",
    county: "",
    town: "",
    area: "",
    price: 0,
    images: [] as string[], // base64 images
    type: "land" as const,
    currency: "KES" as const,
    is_featured: false,
  });

  // Preview URLs
  const [previewImages, setPreviewImages] = useState<string[]>([]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;

    setForm(prev => ({
      ...prev,
      [name]: name === "price" ? Number(value) : value,
    }));
  };

  const handleFileChange = async (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    if (!e.target.files) return;

    const files = Array.from(e.target.files);

    const base64Files = await Promise.all(
      files.map(
        file =>
          new Promise<string>((resolve, reject) => {
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = () => resolve(reader.result as string);
            reader.onerror = reject;
          })
      )
    );

    setForm(prev => ({
      ...prev,
      images: base64Files,
    }));

    setPreviewImages(base64Files);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      // Client-side validation
      propertySchema.parse(form);

      const res = await fetch("/api/properties", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(form),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Failed to create property");
      }

      toast.push({ message: "Property created", type: "success" });
      router.push("/(admin)/properties");
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Unexpected error";
      setError(msg);
      toast.push({ message: msg, type: "error" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">Add New Land</h1>

      {error && <p className="text-red-500 mb-4">{error}</p>}

      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          name="title"
          placeholder="Title"
          value={form.title}
          onChange={handleChange}
          className="w-full px-3 py-2 rounded-md border border-gray-300 focus:border-[var(--color-primary-light)] focus:shadow-sm"
          required
        />

        <input
          name="slug"
          placeholder="Slug"
          value={form.slug}
          onChange={handleChange}
          className="w-full px-3 py-2 rounded-md border border-gray-300 focus:border-[var(--color-primary-light)] focus:shadow-sm"
          required
        />

        <textarea
          name="description"
          placeholder="Description"
          value={form.description}
          onChange={handleChange}
          className="w-full px-3 py-2 rounded-md border border-gray-300 focus:border-[var(--color-primary-light)] focus:shadow-sm"
          required
        />

        <input
          name="county"
          placeholder="County"
          value={form.county}
          onChange={handleChange}
          className="w-full px-3 py-2 rounded-md border border-gray-300 focus:border-[var(--color-primary-light)] focus:shadow-sm"
          required
        />

        <input
          name="town"
          placeholder="Town"
          value={form.town}
          onChange={handleChange}
          className="w-full px-3 py-2 rounded-md border border-gray-300 focus:border-[var(--color-primary-light)] focus:shadow-sm"
        />

        <input
          name="area"
          placeholder="Area / Plot size"
          value={form.area}
          onChange={handleChange}
          className="w-full px-3 py-2 rounded-md border border-gray-300 focus:border-[var(--color-primary-light)] focus:shadow-sm"
          required
        />

        <input
          type="number"
          name="price"
          placeholder="Price (KES)"
          value={form.price}
          onChange={handleChange}
          className="w-full px-3 py-2 rounded-md border border-gray-300 focus:border-[var(--color-primary-light)] focus:shadow-sm"
          required
        />

        <input
          type="file"
          accept="image/*"
          multiple
          onChange={handleFileChange}
          className="w-full px-3 py-2 rounded-md border border-gray-300 focus:border-[var(--color-primary-light)] focus:shadow-sm"
        />

        {/* Image previews */}
        {previewImages.length > 0 && (
          <div className="flex gap-2 flex-wrap">
            {previewImages.map((img, idx) => (
              <div key={idx} className="relative w-24 h-24">
                <Image
                  src={img}
                  alt={`Preview ${idx}`}
                  fill
                  className="object-cover rounded"
                />
              </div>
            ))}
          </div>
        )}

        <button
          type="submit"
          disabled={loading}
          className="btn btn-primary w-full justify-center disabled:opacity-60"
        >
          {loading ? "Saving..." : "Add Property"}
        </button>
      </form>
    </div>
  );
}
