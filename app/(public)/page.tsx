import Link from "next/link";
import Image from "next/image";
import { getLatestProperties } from "@/domains/property/property.service";

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
      <section className="bg-blue-600 text-white p-12 rounded-lg text-center">
        <h1 className="text-4xl font-bold mb-4">
          Find Your Perfect Land or Property in Kenya
        </h1>
        <p className="mb-6">Browse land, houses, and commercial properties with ease.</p>
        <Link
          href="/properties"
          className="bg-white text-blue-600 px-6 py-3 rounded font-semibold"
        >
          Browse Listings
        </Link>
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
    </div>
  );
}
