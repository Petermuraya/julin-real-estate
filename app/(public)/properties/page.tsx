import type { Metadata } from "next";
import PropertyListClient from "../../../ui/components/property-list.client";
import { getPropertiesPaginated } from "@/domains/property/property.repository";

export const metadata: Metadata = {
  title: "Properties — Julin Real Estate",
  description: "Browse property and land listings across Kenya. Server-rendered initial results for SEO.",
};

export default async function PropertiesPage() {
  const { properties, nextCursor } = await getPropertiesPaginated(9);

  return (
    <div className="max-w-6xl mx-auto p-6">
      {/* Client-side interactive list */}
      {/* @ts-expect-error Server component passing props to client */}
      <PropertyListClient initialProperties={properties} initialNextCursor={nextCursor} />
    </div>
  );
}
