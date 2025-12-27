import { z } from "zod";

export const propertyTypeEnum = z.enum([
  "land",
  "house",
  "apartment",
  "commercial",
  "vehicle",
  "other",
]);

export const propertyStatusEnum = z.enum([
  "available",
  "sold",
  "reserved",
  "draft",
]);

/**
 * Base property schema
 */
export const propertySchema = z.object({
  title: z.string().min(5, "Title is too short"),
  description: z.string().min(20, "Description is too short"),

  slug: z
    .string()
    .min(5)
    .regex(/^[a-z0-9-]+$/, "Slug must be URL friendly"),

  type: propertyTypeEnum,
  status: propertyStatusEnum.default("available"),

  price: z.number().positive("Price must be greater than zero"),
  currency: z.literal("KES"),

  county: z.string().min(3, "County is required"),
  town: z.string().optional(),
  area: z.string().optional(),

  coordinates: z
    .object({
      lat: z.number(),
      lng: z.number(),
    })
    .optional(),

  images: z.array(z.string().url()).min(1, "At least one image required"),

  is_featured: z.boolean().default(false),
});

/**
 * Admin create payload
 */
export const createPropertySchema = propertySchema;

/**
 * Admin update payload
 */
export const updatePropertySchema = propertySchema.partial();
