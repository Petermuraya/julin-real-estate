"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Image from "next/image";
import LeadForm from "@/ui/components/forms/lead-form";

interface Property {
  id: string;
  title: string;
  description: string;
  price: number;
  county: string;
  town?: string;
  area: string;
  images: string[];
  type: string;
}

export default function PropertyDetailPage() {
  const { slug } = useParams();
  const [property, setProperty] = useState<Property | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProperty = async () => {
      try {
        const res = await fetch(`/api/properties?slug=${slug}`);
        const data = await res.json();
        setProperty(data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    if (slug) fetchProperty();
  }, [slug]);

  if (loading) return <p className="p-6">Loading...</p>;
  if (!property) return <p className="p-6 text-red-500">Property not found.</p>;

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-4">{property.title}</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Images */}
        <div className="space-y-4">
          {property.images.map((img, idx) => (
            <div key={idx} className="relative w-full h-64 md:h-80">
              <Image
                src={img}
                alt={`${property.title} image ${idx + 1}`}
                fill
                className="object-cover rounded shadow"
              />
            </div>
          ))}
        </div>

        {/* Details + Lead Form */}
        <div className="space-y-4">
          <p className="text-gray-700">{property.description}</p>
          <p className="font-semibold">Price: KES {property.price.toLocaleString()}</p>
          <p>County: {property.county}</p>
          {property.town && <p>Town: {property.town}</p>}
          <p>Area: {property.area}</p>
          <p>Type: {property.type}</p>

          {/* Lead Capture Form */}
          <LeadForm propertyId={property.id} />

          {/* WhatsApp CTA */}
          <a
            href={`https://wa.me/254700471113?text=Hello, I am interested in property "${property.title}" (KES ${property.price.toLocaleString()})`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block mt-4 px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
          >
            Contact via WhatsApp
          </a>
        </div>
      </div>
    </div>
  );
}
