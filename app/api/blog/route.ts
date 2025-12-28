import { NextResponse } from "next/server";
import { publicBlogService, adminBlogService } from "@/domains/blog/blog.repository";
import { auth } from "next-auth";
import { isAdmin } from "@/domains/auth/role.guard";

export async function GET(req: Request) {
  try {
    const url = new URL(req.url);
    const wantAdmin = url.searchParams.get("admin") === "1";
    if (wantAdmin) {
      const session = await auth();
      if (!isAdmin(session?.user?.email)) {
        return NextResponse.json({ error: "Forbidden" }, { status: 403 });
      }
      const blogs = await adminBlogService.getAll();
      return NextResponse.json(blogs);
    }

    const blogs = await publicBlogService.getAll();
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
    const created = await adminBlogService.create(blog);
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
    const updated = await adminBlogService.update(id, data);
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
    await adminBlogService.delete(id);
    return NextResponse.json({ success: true });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || "Error deleting blog" }, { status: 500 });
  }
}
