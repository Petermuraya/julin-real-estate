"use client";

import { useState } from "react";
import { useToast } from "@/ui/components/ui/toast";

interface Props {
  propertyId: string;
}

export default function LeadForm({ propertyId }: Props) {
  const toast = useToast();
  const [form, setForm] = useState({ name: "", email: "", phone: "", message: "" });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch("/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, property_id: propertyId }),
      });
      if (!res.ok) throw new Error("Failed to submit lead");
      setSuccess(true);
      setForm({ name: "", email: "", phone: "", message: "" });
      toast.push({ message: "Inquiry submitted — we will contact you soon.", type: "success" });
    } catch (err) {
      console.error(err);
      toast.push({ message: "Failed to submit inquiry", type: "error" });
    } finally {
      setLoading(false);
    }
  };

  if (success) return <p className="text-[var(--color-success)]">Your inquiry has been submitted!</p>;

  return (
    <form onSubmit={handleSubmit} className="space-y-4 border p-4 rounded shadow">
      <input
        type="text"
        name="name"
        value={form.name}
        onChange={handleChange}
        placeholder="Your Name"
        required
        className="w-full p-2 border rounded"
      />
      <input
        type="email"
        name="email"
        value={form.email}
        onChange={handleChange}
        placeholder="Your Email"
        required
        className="w-full p-2 border rounded"
      />
      <input
        type="tel"
        name="phone"
        value={form.phone}
        onChange={handleChange}
        placeholder="Phone Number"
        required
        className="w-full p-2 border rounded"
      />
      <textarea
        name="message"
        value={form.message}
        onChange={handleChange}
        placeholder="Your Message (optional)"
        className="w-full p-2 border rounded"
      />
      <button type="submit" disabled={loading} className="px-4 py-2 bg-[var(--color-primary)] text-white rounded">
        {loading ? "Sending..." : "Submit Inquiry"}
      </button>
    </form>
  );
}
