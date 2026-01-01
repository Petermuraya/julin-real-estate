import { NextRequest, NextResponse } from "next/server";
import { ChatbotService } from "@/domains/chatbot/chatbot.service";

const service = new ChatbotService();

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const message = body?.message;
    const sessionId = body?.sessionId || (req.headers.get("x-session-id") ?? "anonymous");

    if (!message) {
      return NextResponse.json({ error: "message required" }, { status: 400 });
    }

    const reply = await service.handlePublicMessage(sessionId, String(message));

    return NextResponse.json({ reply });
  } catch (err) {
    console.error("/api/chatbot error", err);
    return NextResponse.json({ error: "internal" }, { status: 500 });
  }
}
