
// domains/chatbot/chatbot.memory.ts

/**
 * Single message in a chat session
 */
export interface ChatMessage {
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
}

/**
 * Chat session stored in MongoDB
 */
export interface ChatSession {
  sessionId: string;
  userType: "PUBLIC" | "ADMIN";
  identity?: string | null;           // admin email if ADMIN
  viewedProperties: string[];         // property IDs
  lastIntent?: string | null;
  journeyStage?: string | null;       // e.g., "browsing", "comparison"
  messages: ChatMessage[];
  createdAt: Date;
}
