export type PropertyType =
  | "land"
  | "house"
  | "apartment"
  | "commercial"
  | "vehicle"
  | "other";

export type PropertyStatus =
  | "available"
  | "sold"
  | "reserved"
  | "draft";

export interface Property {
  id: string;
  slug: string;

  title: string;
  description: string;

  type: PropertyType;
  status: PropertyStatus;

  price: number;
  currency: "KES";

  county: string;
  town?: string;
  area?: string;          // e.g. “1/8 acre”, “50x100”
  coordinates?: {
    lat: number;
    lng: number;
  };

  images: string[];

  is_featured: boolean;

  created_at: string;
  updated_at: string;
}
