"use client";

import { useState } from "react";

interface Props {
  onChange: (filters: { county?: string; type?: string; minPrice?: number; maxPrice?: number }) => void;
}

export default function PropertyFilters({ onChange }: Props) {
  const [filters, setFilters] = useState({ county: "", type: "", minPrice: "", maxPrice: "" });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    const newFilters = { ...filters, [name]: value };
    setFilters(newFilters);

    // Convert number fields
    const formatted = {
      county: newFilters.county || undefined,
      type: newFilters.type || undefined,
      minPrice: newFilters.minPrice ? Number(newFilters.minPrice) : undefined,
      maxPrice: newFilters.maxPrice ? Number(newFilters.maxPrice) : undefined,
    };

    onChange(formatted);
  };

  return (
    <div className="flex flex-col md:flex-row gap-2 mb-4 p-2 bg-gray-100 rounded">
      <select name="county" value={filters.county} onChange={handleChange} className="p-2 border rounded">
        <option value="">All Counties</option>
        <option value="Nairobi">Nairobi</option>
        <option value="Kiambu">Kiambu</option>
        <option value="Mombasa">Mombasa</option>
        <option value="Kisumu">Kisumu</option>
        {/* Add more counties as needed */}
      </select>

      <select name="type" value={filters.type} onChange={handleChange} className="p-2 border rounded">
        <option value="">All Types</option>
        <option value="land">Land</option>
        <option value="house">House</option>
        <option value="commercial">Commercial</option>
        {/* Add more types as needed */}
      </select>

      <input
        type="number"
        name="minPrice"
        value={filters.minPrice}
        onChange={handleChange}
        placeholder="Min Price"
        className="p-2 border rounded"
      />
      <input
        type="number"
        name="maxPrice"
        value={filters.maxPrice}
        onChange={handleChange}
        placeholder="Max Price"
        className="p-2 border rounded"
      />
    </div>
  );
}
