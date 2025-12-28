import Link from "next/link";
import Image from "next/image";
import { getLatestProperties } from "@/domains/property/property.service";

const WHATSAPP = process.env.NEXT_PUBLIC_WHATSAPP || "";

export const metadata = {
  title: "Julin Real Estate — Land & Property in Kenya",
  description:
    "Find verified land and property listings across Kenya. Browse plots, compare prices, and contact sellers with confidence.",
  openGraph: {
    title: "Julin Real Estate — Land & Property in Kenya",
    description:
      "Find verified land and property listings across Kenya. Browse plots, compare prices, and contact sellers with confidence.",
    images: ["/assets/og-default.jpg"],
  },
};

export default async function HomePage() {
  const properties = await getLatestProperties(6);

  return (
    <div className="space-y-12">
      {/* Hero Section */}
      <section
        className="text-white p-10 rounded-lg overflow-hidden"
        style={{ background: "var(--color-primary-gradient)" }}
      >
        <div className="max-w-5xl mx-auto text-center">
          <h1 className="text-4xl sm:text-5xl font-bold mb-4 text-[var(--color-background)]">
            Find Your Perfect Land
          </h1>
          <p className="text-[var(--color-muted)] mb-6">
            Julin Real Estate — trusted property deals across Kenya
          </p>

          {/* Search / Quick filters (GET to properties) */}
          <form method="get" action="/properties" className="max-w-2xl mx-auto flex flex-col sm:flex-row gap-3 items-center">
            <input
              name="q"
              type="search"
              placeholder="Search by county, town, or keyword"
              className="flex-1 w-full px-4 py-3 rounded-lg border border-transparent focus:border-[var(--color-primary-light)] focus:shadow-sm"
            />
            <button className="px-6 py-3 rounded-lg font-semibold text-white bg-[var(--color-primary-gradient)] hover:opacity-95 transition">
              Explore Listings
            </button>
            <Link href="/contact" className="px-6 py-3 rounded-lg font-semibold text-[var(--color-primary)] border border-[var(--color-primary)] bg-white/10 hover:bg-[var(--color-primary)] hover:text-white transition">
              Contact Us
            </Link>
          </form>

          {/* Trust cues */}
          <div className="mt-6 flex justify-center gap-6 text-sm text-[var(--color-background)]/90">
            <span>Verified Listings</span>
            <span>&middot;</span>
            <span>Transparent Pricing</span>
            <span>&middot;</span>
            <span>Secure Transactions</span>
          </div>
        </div>
      </section>

      {/* Featured Properties */}
      <section>
        <h2 className="text-2xl font-bold mb-4">Featured Properties</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {properties.length === 0 && <p>No properties available yet.</p>}
          {properties.map((property) => (
            <div
              key={property.id}
              className="border rounded overflow-hidden shadow hover:shadow-lg transition"
            >
              {property.images?.[0] ? (
                <Image
                  src={property.images[0]}
                  alt={property.title}
                  width={400}
                  height={300}
                  className="w-full h-48 object-cover"
                  placeholder="blur"
                  blurDataURL="/assets/placeholder.png"
                />
              ) : (
                <div className="h-48 bg-gray-200 flex items-center justify-center">No Image</div>
              )}
              <div className="p-4">
                <h3 className="font-bold">{property.title}</h3>
                <p className="text-gray-500">{property.county}</p>
                <p className="text-blue-600 font-semibold">KES {property.price.toLocaleString()}</p>
                <Link href={`/properties/${property.slug}`} className="text-sm text-blue-500 hover:underline">
                  View Details
                </Link>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Floating WhatsApp CTA (visible when NEXT_PUBLIC_WHATSAPP is set) */}
      {WHATSAPP && (
        <a
          href={`https://wa.me/${WHATSAPP}?text=${encodeURIComponent("Hi%2C%20I%27m%20interested%20in%20your%20properties")}`}
          target="_blank"
          rel="noopener noreferrer"
          className="fixed bottom-4 right-4 bg-[var(--color-primary-gradient)] text-white px-4 py-3 rounded-full shadow-lg hover:scale-105 transition z-50"
        >
          WhatsApp
        </a>
      )}
    </div>
  );
}
