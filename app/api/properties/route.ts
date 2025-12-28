import { NextRequest, NextResponse } from "next/server";
import {
  getPublicProperties,
  getAllPropertiesAdmin,
  deleteProperty,
  getPropertyBySlug,
} from "@/domains/property/property.repository";
import {
  createPropertyService,
  updatePropertyService,
} from "@/domains/property/property.service";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/infrastructure/auth/nextauth.config";
import { isAdmin } from "@/domains/auth/role.guard";
import { auth } from "next-auth";
import { uploadImage } from "@/infrastructure/storage/cloudinary.client";

/** Admin allowlist enforced via `isAdmin` guard */

/** Payload types */
interface CreatePropertyPayload {
  title: string;
  description?: string;
  price?: number;
  location?: string;
  county?: string;
  property_type: "land" | "house" | "apartment" | "commercial";
  status?: "available" | "sold" | "pending" | "draft";
  images?: string[];
  [key: string]: unknown;
}

interface UpdatePropertyPayload {
  id: string;
  images?: string[];
  [key: string]: unknown;
}

/** ---------------------- */
/** GET: Public & Admin fetch or single property by slug */
/** ---------------------- */
export async function GET(req: NextRequest) {
  const session = await getServerSession(authOptions);

  try {
    const url = new URL(req.url);
    const slug = url.searchParams.get("slug");

    // Single property fetch by slug
    if (slug) {
      const property = await getPropertyBySlug(slug);
      return NextResponse.json(property);
    }

    // Admin: fetch all properties (server-side check)
    if (session?.user?.email && isAdmin(session.user.email)) {
      const properties = await getAllPropertiesAdmin();
      return NextResponse.json(properties);
    }

    // Public fetch with optional filters
    const filters = {
      county: url.searchParams.get("county") || undefined,
      type: url.searchParams.get("type") || undefined,
      minPrice: url.searchParams.get("minPrice")
        ? Number(url.searchParams.get("minPrice"))
        : undefined,
      maxPrice: url.searchParams.get("maxPrice")
        ? Number(url.searchParams.get("maxPrice"))
        : undefined,
    };

    const properties = await getPublicProperties(filters);
    return NextResponse.json(properties);
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Internal Server Error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

/** ---------------------- */
/** POST: Admin create property */
/** ---------------------- */
export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session?.user?.email)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  if (!isAdmin(session.user.email))
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const body = (await req.json()) as CreatePropertyPayload;

  try {
    if (Array.isArray(body.images) && body.images.length > 0) {
      const uploadedUrls: string[] = [];
      for (const file of body.images) {
        const url = await uploadImage(file);
        uploadedUrls.push(url);
      }
      body.images = uploadedUrls;
    }

    const property = await createPropertyService(body);
    return NextResponse.json(property, { status: 201 });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Invalid request data";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}

/** ---------------------- */
/** PATCH: Admin update property */
/** ---------------------- */
export async function PATCH(req: NextRequest) {
  const session = await auth();
  if (!session?.user?.email)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  if (!isAdmin(session.user.email))
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const body = (await req.json()) as UpdatePropertyPayload;
  const { id, images, ...payload } = body;

  if (!id)
    return NextResponse.json({ error: "Property ID is required" }, { status: 400 });

  try {
    if (Array.isArray(images) && images.length > 0) {
      const uploadedUrls: string[] = [];
      for (const file of images) {
        const url = await uploadImage(file);
        uploadedUrls.push(url);
      }
      payload.images = uploadedUrls;
    }

    const property = await updatePropertyService(id, payload);
    return NextResponse.json(property);
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Invalid request data";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}

/** ---------------------- */
/** DELETE: Admin delete property */
/** ---------------------- */
export async function DELETE(req: NextRequest) {
  const session = await auth();
  if (!session?.user?.email)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  if (!isAdmin(session.user.email))
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const { searchParams } = new URL(req.url);
  const id = searchParams.get("id");
  if (!id)
    return NextResponse.json({ error: "Property ID required" }, { status: 400 });

  try {
    await deleteProperty(id);
    return NextResponse.json({ success: true });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Internal Server Error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
