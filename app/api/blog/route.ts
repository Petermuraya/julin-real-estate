import { NextResponse } from "next/server";
import { blogRepository } from "@/domains/blog/blog.repository";
import { auth } from "next-auth";
import { isAdmin } from "@/domains/auth/role.guard";

export async function GET() {
  try {
    const blogs = await blogRepository.getAll();
    return NextResponse.json(blogs);
  } catch (err: any) {
    return NextResponse.json({ error: err.message || "Error" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  const session = await auth();
  if (!isAdmin(session?.user?.email)) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const blog = await req.json();
  try {
    const created = await blogRepository.create(blog);
    return NextResponse.json(created, { status: 201 });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || "Error creating blog" }, { status: 400 });
  }
}

export async function PUT(req: Request) {
  const session = await auth();
  if (!isAdmin(session?.user?.email)) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const { id, ...data } = await req.json();
  try {
    const updated = await blogRepository.update(id, data);
    return NextResponse.json(updated);
  } catch (err: any) {
    return NextResponse.json({ error: err.message || "Error updating blog" }, { status: 400 });
  }
}

export async function DELETE(req: Request) {
  const session = await auth();
  if (!isAdmin(session?.user?.email)) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const { id } = await req.json();
  try {
    await blogRepository.delete(id);
    return NextResponse.json({ success: true });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || "Error deleting blog" }, { status: 500 });
  }
}
