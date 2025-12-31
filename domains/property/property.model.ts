// domains/property/property.model.ts
/**
 * Core Property domain model
 * - Land-first (Kenyan real estate)
 * - Extensible to vehicles & other assets
 * - UI, API, and DB agnostic
 */

export type PropertyType =
  | "land"
  | "house"
  | "apartment"
  | "commercial"
  | "vehicle"
  | "other";

export type PropertyStatus =
  | "draft"
  | "available"
  | "reserved"
  | "sold";

export type Currency = "KES";

export interface GeoCoordinates {
  lat: number;
  lng: number;
}

export interface Property {
  /** Identifiers */
  id: string;
  slug: string;

  /** Core content */
  title: string;
  description: string;

  /** Classification */
  type: PropertyType;
  status: PropertyStatus;

  /** Pricing */
  price: number;
  currency: Currency;

  /**
   * Location (Kenya-focused)
   * - county is mandatory
   * - others optional for flexibility
   */
  county: string;
  town?: string;
  area?: string; // e.g. "1/8 acre", "50x100"
  coordinates?: GeoCoordinates;

  /** Media */
  images: string[];

  /** Marketing */
  isFeatured: boolean;

  /** SEO */
  metaTitle?: string;
  metaDescription?: string;

  /** Audit */
  createdAt: string;
  updatedAt: string;
}
