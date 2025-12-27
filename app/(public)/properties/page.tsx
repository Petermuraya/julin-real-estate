"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import PropertyFilters from "@/ui/components/forms/property-filters";

interface Property {
  id: string;
  title: string;
  slug: string;
  type: string;
  price: number;
  county: string;
  created_at: string;
  images: string[];
}

interface PropertyFiltersType {
  county?: string;
  type?: string;
  minPrice?: number;
  maxPrice?: number;
}

export default function PropertiesPage() {
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);
  const [nextCursor, setNextCursor] = useState<string | null>(null);
  const [filters, setFilters] = useState<PropertyFiltersType>({});

  const fetchProperties = async (append = false, appliedFilters: PropertyFiltersType = filters) => {
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
      const data = await res.json();

      if (append) {
        setProperties((prev) => [...prev, ...data.properties]);
      } else {
        setProperties(data.properties);
      }

      setNextCursor(data.nextCursor || null);
      setFilters(appliedFilters);
    } catch (error) {
      console.error("Failed to fetch properties:", error);
      if (!append) setProperties([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProperties();
  }, []);

  return (
    <div className="max-w-6xl mx-auto p-6">
      {/* Filters */}
      <PropertyFilters onChange={(f) => fetchProperties(false, f)} />

      {/* Loading & empty states */}
      {loading && <p className="p-6">Loading properties...</p>}
      {!loading && !properties.length && <p className="p-6">No properties available.</p>}

      {/* Properties Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {properties.map((p) => (
          <div
            key={p.id}
            className="border rounded overflow-hidden shadow hover:shadow-lg transition"
          >
            {p.images[0] && (
              <div className="relative w-full h-48">
                <Image
                  src={p.images[0]}
                  alt={p.title}
                  fill
                  className="object-cover"
                  sizes="(max-width: 1024px) 100vw, 33vw"
                  priority
                />
              </div>
            )}
            <div className="p-4">
              <h2 className="text-lg font-bold">{p.title}</h2>
              <p className="text-gray-500">{p.county}</p>
              <p className="text-blue-600 font-semibold">
                KES {p.price.toLocaleString()}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Load More Button */}
      {nextCursor && (
        <div className="flex justify-center mt-6">
          <button
            onClick={() => fetchProperties(true)}
            disabled={loading}
            className="px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            {loading ? "Loading..." : "Load More"}
          </button>
        </div>
      )}
    </div>
  );
}
