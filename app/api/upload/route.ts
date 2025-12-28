import { NextResponse } from "next/server";
import { uploadImage } from "@/infrastructure/storage/cloudinary.client";

export async function POST(req: Request) {
  try {
    const { data, folder } = await req.json();
    if (!data) return NextResponse.json({ error: "Missing data" }, { status: 400 });

    const url = await uploadImage(data as string, folder || "uploads");
    return NextResponse.json({ url }, { status: 201 });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || "Upload failed" }, { status: 500 });
  }
}
