import { createLead } from "@/domains/lead/lead.repository";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const lead = await createLead(body);
    return new Response(JSON.stringify({ success: true, lead }), { status: 201 });
  } catch (error: unknown) {
    // Safely narrow the error type
    const message =
      error instanceof Error ? error.message : "An unexpected error occurred";
    return new Response(JSON.stringify({ error: message }), { status: 500 });
  }
}
