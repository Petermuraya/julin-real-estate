// domains/chatbot/prompt.builder.ts

import { ChatSession } from "./chatbot.memory";

/**
 * Build a structured prompt for the LLM
 * @param session Current chat session
 * @param userMessage Message from user/admin
 * @param isAdmin Whether the message is from admin
 * @returns Prompt string ready for LLM
 */
export function buildPrompt(session: ChatSession, userMessage: string, isAdmin: boolean = false): string {
  const baseInstructions = isAdmin
    ? "You are an admin assistant. Only suggest actions if allowed. Confirm critical operations. Do not hallucinate. Provide clear reasoning."
    : "You are a friendly Kenyan real estate assistant. Always provide accurate, concise guidance. Do not give admin access. Always respect privacy.";

  const context = [
    `Session ID: ${session.sessionId}`,
    `User Type: ${session.userType}`,
    session.identity ? `Identity: ${session.identity}` : "",
    session.lastIntent ? `Last Intent: ${session.lastIntent}` : "",
    session.journeyStage ? `Journey Stage: ${session.journeyStage}` : "",
    session.viewedProperties.length > 0
      ? `Viewed Properties: ${session.viewedProperties.join(", ")}`
      : "",
  ]
    .filter(Boolean)
    .join("\n");

  return `
${baseInstructions}

Context:
${context}

User Message:
${userMessage}

Answer:`;
}
