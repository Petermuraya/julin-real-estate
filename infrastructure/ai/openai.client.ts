// infrastructure/ai/openai.client.ts

import OpenAI from "openai";

export interface LLMQuery {
  prompt: string;
  maxTokens?: number;
  temperature?: number;
}

export class OpenAIClient {
  private client: OpenAI;

  constructor() {
    if (!process.env.OPENAI_API_KEY) {
      throw new Error("OPENAI_API_KEY is not defined in environment variables");
    }
    this.client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
  }

  /**
   * Query the LLM
   * @param options Prompt, maxTokens, temperature
   * @returns Text output from LLM
   */
  async query(options: LLMQuery): Promise<string> {
    const response = await this.client.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [{ role: "user", content: options.prompt }],
      max_tokens: options.maxTokens || 500,
      temperature: options.temperature ?? 0.7,
    });

    const content = response.choices?.[0]?.message?.content;
    if (!content) throw new Error("No content returned from LLM");
    return content;
  }
}
