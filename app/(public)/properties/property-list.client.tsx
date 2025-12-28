"use client";

import React, { useEffect, useState } from "react";
import PropertyFilters from "@/ui/components/forms/property-filters";
import { Skeleton } from "@/ui/components/ui/skeleton";
import PropertyCard from "@/ui/widgets/property-card";
import type { Property } from "@/domains/property/property.model";

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

      {loading && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="rounded overflow-hidden">
              <Skeleton className="h-48 w-full rounded" />
              <div className="p-4">
                <Skeleton className="h-4 w-3/4 mb-2 rounded" />
                <Skeleton className="h-3 w-1/2 mb-2 rounded" />
                <Skeleton className="h-4 w-1/3 rounded" />
              </div>
            </div>
          ))}
        </div>
      )}

      {!loading && !properties.length && <p className="p-6">No properties available.</p>}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {properties.map((p) => (
          <PropertyCard key={p.id} property={p} />
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
