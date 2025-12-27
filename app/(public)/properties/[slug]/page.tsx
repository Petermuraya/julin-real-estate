import Image from "next/image";
import LeadForm from "@/ui/components/forms/lead-form";
import { getPropertyBySlug } from "@/domains/property/property.repository";
import type { Metadata } from "next";

type Params = { slug: string };

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  try {
    const property = await getPropertyBySlug(params.slug);
    if (!property) return {};

    return {
      title: `${property.title} — Julin Real Estate`,
      description: `${property.title} — ${property.county}. Price: KES ${property.price.toLocaleString()}. Verified land & property listings in Kenya.`,
      openGraph: {
        title: `${property.title} — Julin Real Estate`,
        description: `${property.title} — ${property.county}. Price: KES ${property.price.toLocaleString()}.`,
        images: property.images && property.images.length ? [property.images[0]] : ["/assets/og-default.jpg"],
      },
    };
  } catch (err) {
    return {};
  }
}

export default async function PropertyDetailPage({ params }: { params: Params }) {
  const property = await getPropertyBySlug(params.slug);

  if (!property) {
    return <p className="p-6 text-red-500">Property not found.</p>;
  }

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": property.type === "house" ? "SingleFamilyResidence" : "Land",
    name: property.title,
    description: property.description,
    url: `${process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"}/properties/${property.slug}`,
    address: {
      "@type": "PostalAddress",
      addressLocality: property.town || property.county,
      addressRegion: property.county,
      addressCountry: "KE",
    },
    image: property.images && property.images.length ? property.images : ["/assets/og-default.jpg"],
    offers: {
      "@type": "Offer",
      priceCurrency: "KES",
      price: property.price,
      availability: "https://schema.org/InStock",
    },
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <h1 className="text-3xl font-bold mb-4">{property.title}</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-4">
          {property.images?.map((img, idx) => (
            <div key={idx} className="relative w-full h-64 md:h-80">
              <Image src={img} alt={`${property.title} image ${idx + 1}`} fill className="object-cover rounded shadow" />
            </div>
          ))}
        </div>

        <div className="space-y-4">
          <p className="text-gray-700">{property.description}</p>
          <p className="font-semibold">Price: KES {property.price.toLocaleString()}</p>
          <p>County: {property.county}</p>
          {property.town && <p>Town: {property.town}</p>}
          <p>Area: {property.area}</p>
          <p>Type: {property.type}</p>

          <LeadForm propertyId={property.id} />

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
