"use client";

import { useState } from "react";
import { useChatbot } from "@/hooks/useChatbot";

export default function Chatbot() {
  const { messages, sendMessage, loading, error } = useChatbot("/api/chatbot");
  const [open, setOpen] = useState(false);
  const [text, setText] = useState("");

  const submit = async () => {
    if (!text.trim()) return;
    await sendMessage(text.trim());
    setText("");
  };

  return (
    <div>
      <div className="fixed right-4 bottom-4 z-50">
        {open && (
          <div className="w-80 max-w-full bg-white shadow-lg rounded-lg overflow-hidden mb-2">
            <div className="p-3 border-b font-semibold">Chat with Julin</div>
            <div className="p-3 h-64 overflow-auto space-y-2 bg-[var(--color-surface)]">
              {messages.length === 0 && <div className="text-sm text-[var(--color-muted)]">Hi — ask me about properties.</div>}
              {messages.map((m) => (
                <div key={m.id} className={`text-sm ${m.role === "user" ? "text-right" : "text-left"}`}>
                  <div className={`inline-block px-3 py-2 rounded ${m.role === "user" ? "bg-[var(--color-primary)] text-white" : "bg-white text-[var(--color-text)]"}`}>{m.content}</div>
                </div>
              ))}
              {error && <div className="text-xs text-[var(--color-error)]">{error}</div>}
            </div>
            <div className="p-3 border-t flex gap-2">
              <input value={text} onChange={(e) => setText(e.target.value)} className="flex-1 px-3 py-2 rounded border" placeholder="Ask about pricing, location, or availability" />
              <button onClick={submit} disabled={loading} className="px-3 py-2 bg-[var(--color-primary)] text-white rounded">{loading ? "..." : "Send"}</button>
            </div>
          </div>
        )}

        <button
          onClick={() => setOpen((v) => !v)}
          aria-label="Open chat"
          className="w-12 h-12 rounded-full bg-[var(--color-primary)] text-white shadow-lg flex items-center justify-center"
        >
          💬
        </button>
      </div>
    </div>
  );
}
