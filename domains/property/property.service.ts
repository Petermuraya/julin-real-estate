// domains/property/property.service.ts
/**
 * Property Service Layer
 * - Handles business logic for public and admin
 * - Validates input
 * - Enforces domain rules
 * - Uses repository layer for DB
 */

import { Property, PropertyStatus } from "./property.model";
import {
  createProperty,
  updateProperty,
  getPropertyBySlug,
  getPropertiesPaginated,
  getPropertyById,
  deleteProperty,
} from "./property.repository";
import { createPropertySchema, updatePropertySchema, validateStatusTransition } from "./property.validation";

/* =====================================================
   PUBLIC METHODS
   ===================================================== */

/**
 * Fetch latest properties for homepage or listings
 */
export async function getLatestProperties(limit = 6): Promise<Property[]> {
  const { properties } = await getPropertiesPaginated(limit);
  return properties;
}

/**
 * Fetch property by slug (public)
 */
export async function getPublicPropertyBySlug(slug: string): Promise<Property | null> {
  try {
    return await getPropertyBySlug(slug);
  } catch {
    return null; // not found
  }
}

/* =====================================================
   ADMIN METHODS
   ===================================================== */

/**
 * Create new property (ADMIN ONLY)
 */
export async function createPropertyService(input: unknown): Promise<Property> {
  // 1️⃣ Validate input
  const payload = createPropertySchema.parse(input);

  // 2️⃣ Ensure slug uniqueness
  try {
    const existing = await getPropertyBySlug(payload.slug);
    if (existing) throw new Error("Property slug already exists");
  } catch {
    // slug not found → OK
  }

  // 3️⃣ Business rules
  if (payload.type === "land" && !payload.area) {
    throw new Error("Land listings must include plot size / area");
  }

  // 4️⃣ Audit fields
  const property: Property = {
    ...payload,
    id: crypto.randomUUID(),
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    isFeatured: payload.isFeatured ?? false,
  };

  // 5️⃣ Save
  return await createProperty(property);
}

/**
 * Update existing property (ADMIN ONLY)
 */
export async function updatePropertyService(
  id: string,
  input: unknown
): Promise<Property> {
  // 1️⃣ Validate input (partial)
  const payload = updatePropertySchema.parse(input);

  // 2️⃣ Fetch existing property
  const existing = await getPropertyById(id);
  if (!existing) throw new Error("Property not found");

  // 3️⃣ Business rules
  if (payload.price !== undefined && payload.price <= 0) {
    throw new Error("Invalid price");
  }

  if (payload.status && payload.status !== existing.status) {
    validateStatusTransition(existing.status, payload.status);
  }

  // 4️⃣ Merge and update
  const updated: Property = {
    ...existing,
    ...payload,
    updatedAt: new Date().toISOString(),
  };

  return await updateProperty(id, updated);
}

/**
 * Soft delete property (ADMIN ONLY)
 */
export async function deletePropertyService(id: string): Promise<void> {
  const existing = await getPropertyById(id);
  if (!existing) throw new Error("Property not found");

  // Soft delete
  await deleteProperty(id);
}
