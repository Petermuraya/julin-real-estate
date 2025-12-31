// app/api/properties/route.ts
import { NextRequest, NextResponse } from "next/server";
import {
  getPublicProperties,
  getAllPropertiesAdmin,
  deleteProperty,
  getPropertyBySlug,
  getPropertiesPaginated,
} from "@/domains/property/property.repository";
import {
  createPropertyService,
  updatePropertyService,
} from "@/domains/property/property.service";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/infrastructure/auth/nextauth.config";
import { isAdmin } from "@/domains/auth/role.guard";
import { uploadImage } from "@/infrastructure/storage/cloudinary.client";

/* -----------------------------
   GET: Public & Admin fetch
   Supports cursor-based pagination for public
----------------------------- */
export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    const url = new URL(req.url);
    const slug = url.searchParams.get("slug");

    // Single property fetch by slug
    if (slug) {
      const property = await getPropertyBySlug(slug);
      return NextResponse.json(property);
    }

    // Admin fetch all
    if (session?.user?.email && isAdmin(session.user.email)) {
      const properties = await getAllPropertiesAdmin();
      return NextResponse.json(properties);
    }

    // Public fetch with optional filters + pagination
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

    const limit = url.searchParams.get("limit")
      ? Math.min(Number(url.searchParams.get("limit")), 50)
      : 10; // max 50
    const cursor = url.searchParams.get("cursor") || undefined;

    const { properties, nextCursor } = await getPropertiesPaginated(limit, cursor, filters);

    return NextResponse.json({ properties, nextCursor });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Internal Server Error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

/* -----------------------------
   POST: Admin create
----------------------------- */
export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email || !isAdmin(session.user.email))
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });

    const body = await req.json();

    if (Array.isArray(body.images) && body.images.length > 0) {
      body.images = await Promise.all(body.images.map((file: string) => uploadImage(file)));
    }

    const property = await createPropertyService(body);
    return NextResponse.json(property, { status: 201 });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Invalid request";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}

/* -----------------------------
   PATCH: Admin update
----------------------------- */
export async function PATCH(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email || !isAdmin(session.user.email))
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });

    const body = await req.json();
    const { id, images, ...payload } = body;

    if (!id) return NextResponse.json({ error: "Property ID required" }, { status: 400 });

    if (Array.isArray(images) && images.length > 0) {
      payload.images = await Promise.all(images.map((file: string) => uploadImage(file)));
    }

    const property = await updatePropertyService(id, payload);
    return NextResponse.json(property);
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Invalid request";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}

/* -----------------------------
   DELETE: Admin soft delete
----------------------------- */
export async function DELETE(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email || !isAdmin(session.user.email))
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });

    const id = new URL(req.url).searchParams.get("id");
    if (!id) return NextResponse.json({ error: "Property ID required" }, { status: 400 });

    await deleteProperty(id);
    return NextResponse.json({ success: true });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Internal Server Error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
