import Image from "next/image";
import LeadForm from "@/ui/components/forms/lead-form";
import PropertyCarousel from "@/ui/widgets/property-carousel";
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

  const WHATSAPP = (property as any).whatsapp || process.env.NEXT_PUBLIC_WHATSAPP || "";

  return (
    <div className="max-w-5xl mx-auto p-6">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <div className="space-y-6">
        <div className="relative">
          <PropertyCarousel images={property.images || []} alt={property.title} />

          <div className="absolute top-4 left-4">
            <span className="inline-block bg-[var(--color-primary)] text-white px-3 py-1 rounded-full text-sm font-semibold capitalize">
              {property.type}
            </span>
          </div>

          {property.status === "sold" && (
            <div className="absolute top-4 right-4">
              <span className="inline-block bg-gray-800 text-white px-3 py-1 rounded-full text-sm font-semibold">Sold</span>
            </div>
          )}
        </div>

        <div className="md:flex md:items-start md:justify-between md:gap-6">
          <div className="md:flex-1">
            <h1 className="text-2xl md:text-3xl font-bold text-[var(--color-primary)]">{property.title}</h1>
            <p className="text-[var(--color-muted)] mt-1">{property.town ? `${property.town}, ` : ""}{property.county}</p>
            <p className="text-[var(--color-text)] font-bold text-xl mt-3">KES {property.price.toLocaleString()}</p>
          </div>

          <div className="mt-4 md:mt-0 md:w-72">
            <div className="flex gap-2">
              <a
                href={WHATSAPP ? `https://wa.me/${WHATSAPP}?text=${encodeURIComponent(`Hi, I’m interested in ${property.title} (KES ${property.price.toLocaleString()})`)}` : `#`}
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-primary flex-1 text-center"
              >
                WhatsApp
              </a>

              <a href="#contact" className="flex-1 text-center border border-[var(--color-primary)] rounded px-3 py-2 text-[var(--color-primary)] font-semibold hover:bg-[var(--color-primary)] hover:text-white transition">
                Contact
              </a>
            </div>

            <div className="mt-3 text-sm text-[var(--color-muted)]">
              <div>Area: {property.area || "—"}</div>
              <div>Type: {property.type}</div>
              <div>Posted: {new Date(property.created_at).toLocaleDateString()}</div>
            </div>
          </div>
        </div>

        <div className="mt-6 grid gap-6 md:grid-cols-2">
          <div className="bg-[var(--color-surface)] p-4 rounded-lg shadow">
            <h2 className="font-semibold text-lg mb-2">Description</h2>
            <p className="text-[var(--color-muted)]">{property.description}</p>
          </div>

          <div className="bg-[var(--color-surface)] p-4 rounded-lg shadow">
            <h2 className="font-semibold text-lg mb-2">Details</h2>
            <ul className="text-[var(--color-muted)] list-disc list-inside">
              <li>County: {property.county}</li>
              {property.town && <li>Town: {property.town}</li>}
              <li>Area: {property.area || "—"}</li>
              <li>Type: {property.type}</li>
            </ul>
          </div>
        </div>

        <div className="mt-6">
          <h2 className="font-semibold text-lg mb-2">Location</h2>
          {property.coordinates ? (
            <a
              href={`https://www.google.com/maps/search/?api=1&query=${property.coordinates.lat},${property.coordinates.lng}`}
              target="_blank"
              rel="noopener noreferrer"
              className="block w-full h-64 rounded-lg overflow-hidden shadow"
            >
              <iframe
                src={`https://www.google.com/maps?q=${property.coordinates.lat},${property.coordinates.lng}&z=15&output=embed`}
                className="w-full h-full border-0"
                loading="lazy"
                title="Property location"
              />
            </a>
          ) : (
            <div className="w-full h-64 rounded-lg bg-gray-100 flex items-center justify-center">Map not available</div>
          )}
        </div>

        <div id="contact" className="mt-6 bg-[var(--color-surface)] p-4 rounded-lg shadow">
          <h2 className="font-semibold text-lg mb-2">Contact Agent</h2>
          <LeadForm propertyId={property.id} />
        </div>
      </div>

      {/* Mobile sticky CTA */}
      <div className="md:hidden">
        <div className="fixed bottom-4 left-4 right-4 flex gap-3 z-50">
          <a
            href={WHATSAPP ? `https://wa.me/${WHATSAPP}?text=${encodeURIComponent(`Hi, I’m interested in ${property.title} (KES ${property.price.toLocaleString()})`)}` : `#`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex-1 text-center btn btn-primary rounded-full py-3"
          >
            WhatsApp
          </a>
          <a href="#contact" className="flex-1 text-center rounded-full border border-[var(--color-primary)] py-3 text-[var(--color-primary)] font-semibold">
            Contact
          </a>
        </div>
      </div>
    </div>
  );
}
