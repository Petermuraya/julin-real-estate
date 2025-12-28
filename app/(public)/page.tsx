import Link from "next/link";
import Image from "next/image";
import Hero from "@/ui/components/Hero";
import PropertyCard from "@/ui/widgets/property-card";
import type { Property } from "@/domains/property/property.model";
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
      <Hero whatsapp={WHATSAPP} />

      {/* Featured Listings (UI-only placeholders) */}
      <section aria-labelledby="featured-listings-heading" className="mt-8 border-t border-white/5 pt-8">
        <div className="max-w-5xl mx-auto">
          <h2 id="featured-listings-heading" className="text-2xl font-bold mb-4">Featured Listings</h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {(function renderPlaceholders() {
              const samples: Property[] = Array.from({ length: 6 }).map((_, idx) => ({
                id: `sample-${idx + 1}`,
                slug: `sample-${idx + 1}`,
                title: `Sample Plot ${idx + 1}`,
                description: `Sample description for plot ${idx + 1}`,
                type: "land",
                status: "available",
                price: 1200000 + idx * 50000,
                currency: "KES",
                county: "Nairobi",
                town: "Kikuyu",
                area: "1 acre",
                images: [],
                is_featured: true,
                created_at: new Date().toISOString(),
                updated_at: new Date().toISOString(),
              }));

              return samples.map((p) => (
                <PropertyCard key={p.id} property={p} />
              ));
            })()}
          </div>
        </div>
      </section>

      {/* Search & Quick Filters */}
      <section aria-labelledby="search-heading" className="">
        <div className="max-w-5xl mx-auto">
          <h2 id="search-heading" className="sr-only">Search properties</h2>

          <form method="get" action="/properties" className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
            {/* Primary single-line search */}
            <label htmlFor="primary-search" className="sr-only">Search by county, town or keyword</label>
            <input
              id="primary-search"
              name="q"
              type="search"
              placeholder="County, town, or keyword (e.g. Nairobi, 1 acre)"
              className="flex-1 w-full px-4 py-3 rounded-lg border border-transparent focus:border-[var(--color-primary-light)] focus:ring-2 focus:ring-[var(--color-primary-light)] focus:ring-offset-2"
            />

            {/* Mobile: compact expandable filters using details */}
            <details className="sm:hidden">
              <summary className="px-4 py-3 rounded-lg bg-[var(--color-primary)]/10 text-[var(--color-text)] cursor-pointer">Filters</summary>
              <div className="mt-3 p-3 bg-[var(--color-surface)] rounded-lg space-y-3">
                <fieldset>
                  <legend className="text-sm font-medium text-[var(--color-text)] mb-2">Price (KES)</legend>
                  <div className="flex gap-2">
                    <input name="minPrice" type="number" placeholder="Min" className="flex-1 px-3 py-2 rounded-lg text-sm" />
                    <input name="maxPrice" type="number" placeholder="Max" className="flex-1 px-3 py-2 rounded-lg text-sm" />
                  </div>
                </fieldset>

                <fieldset>
                  <legend className="text-sm font-medium text-[var(--color-text)] mb-2">Land size</legend>
                  <div className="flex gap-2">
                    <input name="minSize" type="number" placeholder="Min" className="flex-1 px-3 py-2 rounded-lg text-sm" />
                    <input name="maxSize" type="number" placeholder="Max" className="flex-1 px-3 py-2 rounded-lg text-sm" />
                    <select name="sizeUnit" className="px-3 py-2 rounded-lg text-sm">
                      <option value="plots">Plots</option>
                      <option value="acres">Acres</option>
                    </select>
                  </div>
                </fieldset>
              </div>
            </details>

            {/* Desktop: inline compact filters */}
            <div className="hidden sm:flex items-center gap-2">
              <div className="flex items-center gap-2 bg-transparent">
                <input name="minPrice" type="number" placeholder="Min KES" className="w-28 px-3 py-2 rounded-lg text-sm" />
                <span className="text-[var(--color-muted)]">—</span>
                <input name="maxPrice" type="number" placeholder="Max KES" className="w-28 px-3 py-2 rounded-lg text-sm" />
              </div>

              <div className="flex items-center gap-2">
                <input name="minSize" type="number" placeholder="Min" className="w-20 px-3 py-2 rounded-lg text-sm" />
                <input name="maxSize" type="number" placeholder="Max" className="w-20 px-3 py-2 rounded-lg text-sm" />
                <select name="sizeUnit" className="px-3 py-2 rounded-lg text-sm">
                  <option value="plots">Plots</option>
                  <option value="acres">Acres</option>
                </select>
              </div>
            </div>

            <button type="submit" className="w-full sm:w-auto px-5 py-3 rounded-lg bg-[var(--color-primary-light)] text-white font-semibold shadow-sm hover:brightness-95">Search</button>
          </form>
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
                <div className="h-48 bg-[var(--color-surface)] flex items-center justify-center text-[var(--color-muted)]">No Image</div>
              )}
              <div className="p-4">
                <h3 className="font-bold">{property.title}</h3>
                <p className="text-[var(--color-muted)]">{property.county}</p>
                <p className="text-[var(--color-primary-dark)] font-semibold">KES {property.price.toLocaleString()}</p>
                <Link href={`/properties/${property.slug}`} className="text-sm text-[var(--color-primary)] hover:underline">
                  View Details
                </Link>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Trust & Verification */}
      <section aria-labelledby="trust-heading" className="mt-8">
        <div className="max-w-5xl mx-auto">
          <h2 id="trust-heading" className="text-lg font-semibold mb-3">Why buyers trust Julin</h2>

          <ul className="flex gap-4 overflow-x-auto pb-2 -mx-4 px-4 sm:mx-0 sm:px-0 sm:grid sm:grid-cols-2 lg:grid-cols-4 sm:gap-4">
            <li className="min-w-[220px] flex-shrink-0 sm:min-w-0 bg-[var(--color-surface)] rounded-lg p-4 border border-[var(--color-surface)]">
              <div className="flex items-start gap-3">
                <div className="text-2xl">✅</div>
                <div>
                  <p className="font-semibold">Verified Listings</p>
                  <p className="text-sm text-[var(--color-muted)]">Sellers verified and listings checked for legitimacy.</p>
                </div>
              </div>
            </li>

            <li className="min-w-[220px] flex-shrink-0 sm:min-w-0 bg-[var(--color-surface)] rounded-lg p-4 border border-[var(--color-surface)]">
              <div className="flex items-start gap-3">
                <div className="text-2xl">📜</div>
                <div>
                  <p className="font-semibold">Clear Titles</p>
                  <p className="text-sm text-[var(--color-muted)]">Focus on properties with documented title deeds and clear ownership.</p>
                </div>
              </div>
            </li>

            <li className="min-w-[220px] flex-shrink-0 sm:min-w-0 bg-[var(--color-surface)] rounded-lg p-4 border border-[var(--color-surface)]">
              <div className="flex items-start gap-3">
                <div className="text-2xl">💬</div>
                <div>
                  <p className="font-semibold">Transparent Pricing</p>
                  <p className="text-sm text-[var(--color-muted)]">Prices shown in KES with clear breakdowns where available.</p>
                </div>
              </div>
            </li>

            <li className="min-w-[220px] flex-shrink-0 sm:min-w-0 bg-[var(--color-surface)] rounded-lg p-4 border border-[var(--color-surface)]">
              <div className="flex items-start gap-3">
                <div className="text-2xl">🧭</div>
                <div>
                  <p className="font-semibold">Expert Guidance</p>
                  <p className="text-sm text-[var(--color-muted)]">Local expertise and buying guidance to help first-time land purchasers.</p>
                </div>
              </div>
            </li>
          </ul>
        </div>
      </section>

      {/* How It Works — 3 step flow (Search → Verify → Contact) */}
      <section aria-labelledby="how-heading" className="mt-8">
        <div className="max-w-5xl mx-auto">
          <h2 id="how-heading" className="text-lg font-semibold mb-4">How it works</h2>

          <ol className="flex flex-col sm:flex-row gap-4">
            <li className="flex-1 bg-[var(--color-surface)] rounded-lg p-4 flex items-start gap-3">
              <div className="text-2xl sm:text-3xl">🔎</div>
              <div>
                <p className="font-semibold">Search</p>
                <p className="text-sm text-[var(--color-muted)]">Search by county, town or keywords to find suitable plots and acreage.</p>
              </div>
            </li>

            <li className="flex-1 bg-[var(--color-surface)] rounded-lg p-4 flex items-start gap-3">
              <div className="text-2xl sm:text-3xl">📜</div>
              <div>
                <p className="font-semibold">Verify</p>
                <p className="text-sm text-[var(--color-muted)]">Check title deed info and verification badges provided on each listing.</p>
              </div>
            </li>

            <li className="flex-1 bg-[var(--color-surface)] rounded-lg p-4 flex items-start gap-3">
              <div className="text-2xl sm:text-3xl">💬</div>
              <div>
                <p className="font-semibold">Contact</p>
                <p className="text-sm text-[var(--color-muted)]">Reach sellers via contact form or WhatsApp to arrange viewings and next steps.</p>
              </div>
            </li>
          </ol>
        </div>
      </section>

      {/* Lead Capture / Primary CTA */}
      <section aria-labelledby="lead-heading" className="mt-8">
        <div className="max-w-5xl mx-auto">
          <h2 id="lead-heading" className="text-lg font-semibold mb-4">Get help finding land</h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 items-start">
            {/* Contact form (UI-only) */}
            <form className="bg-[var(--color-surface)] rounded-lg p-4 sm:p-6" aria-label="Contact form (placeholder)">
              <div className="space-y-3">
                <div>
                  <label htmlFor="lead-name" className="sr-only">Name</label>
                  <input id="lead-name" name="name" type="text" placeholder="Your name" className="w-full px-3 py-2 rounded-lg" />
                </div>

                <div>
                  <label htmlFor="lead-email" className="sr-only">Email</label>
                  <input id="lead-email" name="email" type="email" placeholder="Email address" className="w-full px-3 py-2 rounded-lg" />
                </div>

                <div>
                  <label htmlFor="lead-phone" className="sr-only">Phone</label>
                  <input id="lead-phone" name="phone" type="tel" placeholder="Phone (e.g. +2547XXXXXXXX)" className="w-full px-3 py-2 rounded-lg" />
                </div>

                <div>
                  <label htmlFor="lead-message" className="sr-only">Message</label>
                  <textarea id="lead-message" name="message" rows={4} placeholder="Tell us what you're looking for (county, size, budget)" className="w-full px-3 py-2 rounded-lg" />
                </div>

                <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
                  <button type="button" className="w-full sm:w-auto px-5 py-3 rounded-lg bg-[var(--color-primary-light)] text-white font-semibold">Send enquiry</button>
                  <p className="text-sm text-[var(--color-muted)]">No backend attached — placeholder form for UI only.</p>
                </div>
              </div>
            </form>

            {/* Prominent Contact CTAs */}
            <aside className="bg-[var(--color-surface)] rounded-lg p-4 sm:p-6 flex flex-col gap-4">
              <p className="font-semibold">Quick contact</p>
              <div className="flex flex-col gap-3">
                {WHATSAPP && (
                  <a href={`https://wa.me/${WHATSAPP}?text=${encodeURIComponent("Hi, I'm looking for land listings")}`} target="_blank" rel="noopener noreferrer" className="inline-flex items-center justify-center px-4 py-3 bg-[var(--color-success)] text-white rounded-lg font-medium">Message on WhatsApp</a>
                )}

                <a href="tel:+254700000000" className="inline-flex items-center justify-center px-4 py-3 bg-[var(--color-primary-light)] text-white rounded-lg font-medium">Call +254 700 000 000</a>

                <p className="text-sm text-[var(--color-muted)]">Prefer a call? Use the phone option — available during business hours.</p>
              </div>
            </aside>
          </div>
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
