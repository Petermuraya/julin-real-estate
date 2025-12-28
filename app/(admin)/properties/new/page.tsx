"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useToast } from "@/ui/components/ui/toast";

export default function NewPropertyPage() {
  const router = useRouter();
  const toast = useToast();
  const [title, setTitle] = useState("");
  const [price, setPrice] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    const res = await fetch("/api/properties", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title, price: Number(price) }),
    });

    if (res.ok) {
      toast.push({ message: "Property created", type: "success" });
      router.push("/admin/properties");
    } else {
      toast.push({ message: "Error creating property", type: "error" });
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4 p-4">
      <input
        type="text"
        placeholder="Title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        className="w-full px-3 py-2 rounded-md border border-[var(--color-surface)] focus:border-[var(--color-primary-light)] focus:shadow-sm"
      />
      <input
        type="number"
        placeholder="Price"
        value={price}
        onChange={(e) => setPrice(e.target.value)}
        className="w-full px-3 py-2 rounded-md border border-[var(--color-surface)] focus:border-[var(--color-primary-light)] focus:shadow-sm"
      />
      <button type="submit" className="btn btn-primary px-4 py-2 w-full justify-center">
        Create
      </button>
    </form>
  );
}
