"use client";

import Image from "next/image";
import Link from "next/link";
import { Property } from "@/domains/property/property.model";

interface PropertyCardProps {
  property: Property;
}

export default function PropertyCard({ property }: PropertyCardProps) {
  const whatsappNumber = (property as any).whatsapp || "";

  return (
    <article className="card rounded-lg overflow-hidden hover:shadow-lg transition-transform transform hover:scale-105">
      <div className="relative w-full h-48 bg-[var(--color-surface)]">
        {property.images && property.images.length ? (
          <Image
            src={property.images[0]}
            alt={property.title}
            fill
            className="object-cover"
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            priority={false}
          />
        ) : (
          <div className="h-48 bg-[var(--color-surface)] flex items-center justify-center text-[var(--color-muted)]">No image</div>
        )}

        <span className="absolute top-3 left-3 bg-[var(--color-primary)] text-white px-2 py-1 rounded text-xs font-semibold capitalize">
          {property.type}
        </span>
        {property.status === "sold" && (
          <span className="absolute top-3 right-3 bg-[var(--color-error)] text-white px-2 py-1 rounded text-xs font-semibold">Sold</span>
        )}
      </div>

      <div className="p-4">
        <h3 className="text-lg font-semibold text-[var(--color-text)] mb-1 truncate">{property.title}</h3>
        <p className="text-[var(--color-muted)] text-sm mb-2 truncate">{property.county}</p>
        <p className="text-[var(--color-text)] font-bold mb-3">KES {property.price.toLocaleString()}</p>

        <div className="flex gap-2">
          <Link
            href={`/properties/${property.slug}`}
            className="flex-1 text-center btn btn-primary text-white rounded px-3 py-2 font-semibold"
          >
            View
          </Link>

          <a
            href={whatsappNumber ? `https://wa.me/${whatsappNumber}?text=Hi%2C%20I%E2%80%99m%20interested%20in%20${encodeURIComponent(property.title)}` : "#"}
            target="_blank"
            rel="noopener noreferrer"
            className="flex-1 text-center border border-[var(--color-primary)] rounded px-3 py-2 text-[var(--color-primary)] font-semibold hover:bg-[var(--color-primary)] hover:text-white transition"
          >
            WhatsApp
          </a>
        </div>
      </div>
    </article>
  );
}
