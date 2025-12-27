import { auth } from "next-auth";
import { isAdmin } from "@/domains/auth/role.guard";
import { NextResponse } from "next/server";

export async function GET() {
  const session = await auth();

  if (!isAdmin(session?.user?.email)) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  return NextResponse.json({ status: "OK" });
}
