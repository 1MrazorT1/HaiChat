"use client";

import { useRef, useState } from "react";
import MessageBubble from "./MessageBubble";

type Msg = { role: "user" | "assistant"; content: string };

export default function Chat() {
  const [messages, setMessages] = useState<Msg[]>([
    { role: "assistant", content: "Hi! I'm your local AI assistant. How can I help you today ?" },
  ]);
  const [input, setInput] = useState("");
  const [pending, setPending] = useState(false);
  const abortRef = useRef<AbortController | null>(null);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!input.trim() || pending) return;

    const next = [...messages, { role: "user" as const, content: input }];
    setMessages(next);
    setInput("");
    setPending(true);

    abortRef.current?.abort();
    const ctrl = new AbortController();
    abortRef.current = ctrl;

    try {
      const res = await fetch("http://localhost:3001/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: next }),
        signal: ctrl.signal,
      });

      if (!res.ok || !res.body) throw new Error(await res.text());

      setMessages(prev => [...prev, { role: "assistant", content: "" }]);

      const reader = res.body.getReader();
      const decoder = new TextDecoder();

      while (true) {
        const { value, done } = await reader.read();
        if (done) break;
        const chunk = decoder.decode(value, { stream: true });
        setMessages(prev => {
          const last = prev[prev.length - 1];
          if (!last || last.role !== "assistant") return prev;
          return [...prev.slice(0, -1), { ...last, content: last.content + chunk }];
        });
      }
    } catch (err) {
      console.error("Chat request failed:", err);
      setMessages(prev => [...prev, { role: "assistant", content: "ERROR" }]);
    } finally {
      setPending(false);
    }
  }

  return (
    <div className="mx-auto w-full max-w-3xl h-[calc(100dvh-6rem)] flex flex-col rounded-2xl border border-neutral-800 bg-[var(--panel)]/50 backdrop-blur">
      {/* messages */}
      <div className="flex-1 overflow-y-auto space-y-3 p-4 sm:p-6">
        {messages.map((m, i) => (
          <MessageBubble key={i} role={m.role} content={m.content} />
        ))}
      </div>

      {/* input bar */}
      <form onSubmit={onSubmit} className="sticky bottom-0 p-3 sm:p-4 border-t border-neutral-800 bg-[#0d0f12]/80 backdrop-blur">
        <div className="flex gap-2">
          <textarea
            value={input}
            onChange={e => setInput(e.target.value)}
            placeholder="Type your message…"
            className="flex-1 resize-none rounded-xl border border-neutral-800 bg-neutral-950/60 px-3 py-2 text-[var(--fg)] placeholder:text-[var(--muted)] focus:outline-none focus:ring-2 focus:ring-[var(--ring)] focus:border-[var(--accent)]"
            rows={1}
          />
          <button
            type="submit"
            disabled={pending || !input.trim()}
            className="rounded-xl px-4 py-2 bg-[var(--accent)] hover:bg-[var(--accent-600)] text-white disabled:opacity-50"
          >
            Send
          </button>
          {pending && (
            <button
              type="button"
              onClick={() => abortRef.current?.abort()}
              className="rounded-xl px-4 py-2 border border-neutral-700 text-[var(--fg)] hover:bg-neutral-900/60"
            >
              Stop
            </button>
          )}
        </div>
      </form>
    </div>
  );
}
