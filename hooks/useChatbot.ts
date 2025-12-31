// hooks/useChatbot.ts

import { useState } from "react";
import { publicEnv } from "../config/env";

export type ChatMessage = {
  id: string;
  role: "user" | "bot" | "system";
  content: string;
  timestamp: number;
};

export function useChatbot(apiEndpoint: string = `${publicEnv.NEXT_PUBLIC_API_DOMAIN}/chatbot`) {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const sendMessage = async (content: string) => {
    setLoading(true);
    setError(null);
    const newMessage: ChatMessage = {
      id: crypto.randomUUID(),
      role: "user",
      content,
      timestamp: Date.now(),
    };
    setMessages((prev) => [...prev, newMessage]);

    try {
      const res = await fetch(apiEndpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: content }),
      });

      if (!res.ok) throw new Error("Failed to send message");

      const data = await res.json();
      const botMessage: ChatMessage = {
        id: crypto.randomUUID(),
        role: "bot",
        content: data.reply,
        timestamp: Date.now(),
      };
      setMessages((prev) => [...prev, botMessage]);
    } catch (err: any) {
      setError(err.message || "Unknown error");
    } finally {
      setLoading(false);
    }
  };

  const resetChat = () => setMessages([]);

  return { messages, sendMessage, resetChat, loading, error };
}
