// domains/chatbot/chatbot.service.ts

import { getMongoDb } from "@/infrastructure/database/mongodb.client";
import { PropertyService } from "../property/property.service";
import { OpenAIClient } from "@/infrastructure/ai/openai.client";
import { ChatMessage, ChatSession } from "./chatbot.memory";

/**
 * ChatbotService handles both Public and Admin bot interactions
 */
export class ChatbotService {
  private openai: OpenAIClient;

  constructor() {
    this.openai = new OpenAIClient();
  }

  /**
   * Public chatbot interaction
   */
  async handlePublicMessage(sessionId: string, message: string): Promise<string> {
    const session = await this.getOrCreateSession(sessionId, "PUBLIC");

    // Build context
    const context = await this.buildContext(session);

    // Call LLM
    const response = await this.openai.query({
      prompt: this.buildPrompt(message, context),
      maxTokens: 500,
    });

    // Save to chat memory
    await this.saveMessage(session, message, response, "PUBLIC");

    return response;
  }

  /**
   * Admin chatbot interaction
   */
  async handleAdminMessage(sessionId: string, message: string, adminEmail: string): Promise<string> {
    const session = await this.getOrCreateSession(sessionId, "ADMIN", adminEmail);

    // Build context
    const context = await this.buildContext(session);

    // Call LLM with admin mode
    const response = await this.openai.query({
      prompt: this.buildPrompt(message, context, true),
      maxTokens: 700,
    });

    // Save to chat memory
    await this.saveMessage(session, message, response, "ADMIN", adminEmail);

    return response;
  }

  // -----------------------
  // SESSION / MEMORY
  // -----------------------
  private async getOrCreateSession(sessionId: string, userType: "PUBLIC" | "ADMIN", identity?: string): Promise<ChatSession> {
    const db = await getMongoDb();
    const collection = db.collection<ChatSession>("chat_sessions");

    let session = await collection.findOne({ sessionId });
    if (!session) {
      session = {
        sessionId,
        userType,
        identity: identity || null,
        messages: [],
        viewedProperties: [],
        lastIntent: null,
        journeyStage: null,
        createdAt: new Date(),
      };
      await collection.insertOne(session);
    }
    return session;
  }

  private async saveMessage(
    session: ChatSession,
    userMessage: string,
    botMessage: string,
    userType: "PUBLIC" | "ADMIN",
    identity?: string
  ) {
    const db = await getMongoDb();
    const collection = db.collection<ChatSession>("chat_sessions");

    const message: ChatMessage = {
      role: "user",
      content: userMessage,
      timestamp: new Date(),
    };
    const botReply: ChatMessage = {
      role: "assistant",
      content: botMessage,
      timestamp: new Date(),
    };

    await collection.updateOne(
      { sessionId: session.sessionId },
      {
        $push: { messages: { $each: [message, botReply] } },
        $set: { identity, userType },
      }
    );
  }

  // -----------------------
  // CONTEXT BUILDING
  // -----------------------
  private async buildContext(session: ChatSession) {
    const viewedProperties = session.viewedProperties || [];
    // Example: include property titles in context
    const propertiesContext = await Promise.all(
      viewedProperties.map(async (id) => {
        const property = await PropertyService.getById(id);
        return property ? `${property.title} - ${property.location.county}` : "";
      })
    );
    return propertiesContext.join("\n");
  }

  private buildPrompt(message: string, context: string, isAdmin: boolean = false): string {
    const roleInstructions = isAdmin
      ? "You are an admin assistant. Only suggest actions if allowed, confirm critical operations, never hallucinate."
      : "You are a public Kenyan real estate assistant. Always provide accurate, concise, and friendly guidance. Do not provide admin access.";
    return `${roleInstructions}\nContext:\n${context}\nUser: ${message}\nAnswer:`;
  }
}
