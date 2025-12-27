"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import PropertyFilters from "@/ui/components/forms/property-filters";

interface Property {
  id: string;
  title: string;
  slug?: string;
  type?: string;
  price: number;
  county: string;
  created_at?: string;
  images?: string[];
}

interface Filters {
  county?: string;
  type?: string;
  minPrice?: number;
  maxPrice?: number;
}

export default function PropertyListClient({
  initialProperties,
  initialNextCursor,
}: {
  initialProperties: Property[];
  initialNextCursor: string | null;
}) {
  const [properties, setProperties] = useState<Property[]>(initialProperties || []);
  const [loading, setLoading] = useState(false);
  const [nextCursor, setNextCursor] = useState<string | null>(initialNextCursor || null);
  const [filters, setFilters] = useState<Filters>({});

  const fetchProperties = async (append = false, appliedFilters: Filters = filters) => {
    try {
      setLoading(true);
      const params = new URLSearchParams({
        ...Object.entries(appliedFilters).reduce<Record<string, string>>((acc, [k, v]) => {
          if (v !== undefined) acc[k] = String(v);
          return acc;
        }, {}),
        cursor: append && nextCursor ? nextCursor : "",
        limit: "9",
      }).toString();

      const res = await fetch(`/api/properties?${params}`);
      if (!res.ok) throw new Error("Failed to fetch");
      const data = await res.json();

      if (append) {
        setProperties((prev) => [...prev, ...data.properties]);
      } else {
        setProperties(data.properties);
      }

      setNextCursor(data.nextCursor || null);
      setFilters(appliedFilters);
    } catch (err) {
      console.error("Failed to fetch properties:", err);
      if (!append) setProperties([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // keep initial server-rendered properties, but ensure state is in sync
    setProperties(initialProperties || []);
    setNextCursor(initialNextCursor || null);
  }, [initialProperties, initialNextCursor]);

  return (
    <div>
      <PropertyFilters onChange={(f) => fetchProperties(false, f)} />

      {loading && <p className="p-6">Loading properties...</p>}
      {!loading && !properties.length && <p className="p-6">No properties available.</p>}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {properties.map((p) => (
          <div key={p.id} className="border rounded overflow-hidden shadow hover:shadow-lg transition">
            {p.images && p.images[0] ? (
              <div className="relative w-full h-48">
                <Image src={p.images[0]} alt={p.title} fill className="object-cover" sizes="(max-width: 1024px) 100vw, 33vw" />
              </div>
            ) : (
              <div className="h-48 bg-gray-200 flex items-center justify-center">No Image</div>
            )}
            <div className="p-4">
              <h2 className="text-lg font-bold">{p.title}</h2>
              <p className="text-gray-500">{p.county}</p>
              <p className="text-blue-600 font-semibold">KES {p.price.toLocaleString()}</p>
            </div>
          </div>
        ))}
      </div>

      {nextCursor && (
        <div className="flex justify-center mt-6">
          <button onClick={() => fetchProperties(true)} disabled={loading} className="px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">
            {loading ? "Loading..." : "Load More"}
          </button>
        </div>
      )}
    </div>
  );
}
