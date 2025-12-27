import {
  createPropertySchema,
  updatePropertySchema,
} from "./property.validation";
import {
  createProperty,
  updateProperty,
  getPropertyBySlug,
  getPropertiesPaginated, // <-- new import
} from "./property.repository";
import { Property } from "./property.model";

/**
 * Create new property (ADMIN ONLY)
 */
export async function createPropertyService(
  input: unknown
): Promise<Property> {
  // 1️⃣ Validate input
  const payload = createPropertySchema.parse(input);

  // 2️⃣ Ensure slug uniqueness
  try {
    const existing = await getPropertyBySlug(payload.slug);
    if (existing) {
      throw new Error("Property slug already exists");
    }
  } catch {
    // slug not found → OK
  }

  // 3️⃣ Business rules (future expansion)
  if (payload.type === "land" && !payload.area) {
    throw new Error("Land listings must include plot size / area");
  }

  // 4️⃣ Save to database
  return await createProperty(payload);
}

/**
 * Update property (ADMIN ONLY)
 */
export async function updatePropertyService(
  id: string,
  input: unknown
): Promise<Property> {
  // 1️⃣ Validate input (partial)
  const payload = updatePropertySchema.parse(input);

  // 2️⃣ Business rules
  if (payload.price && payload.price <= 0) {
    throw new Error("Invalid price");
  }

  // 3️⃣ Save changes
  return await updateProperty(id, payload);
}

/**
 * Fetch latest properties for homepage
 */
export async function getLatestProperties(limit = 6): Promise<Property[]> {
  const { properties } = await getPropertiesPaginated(limit);
  return properties;
}
