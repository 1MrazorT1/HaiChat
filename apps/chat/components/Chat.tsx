"use client";

import { useRef, useState } from "react";
import MessageBubble from "./MessageBubble";

type Msg = { role: "user" | "assistant"; content: string };

export default function Chat() {
  const [messages, setMessages] = useState<Msg[]>([
    { role: "assistant", content: "Hello there!\nHow can I help you today?" },
  ]);
  const [input, setInput] = useState("");
  const [pending, setPending] = useState(false);
  const abortRef = useRef<AbortController | null>(null);

  const quick = [
    "What are the advantages of Next.js?",
    "Write code to demo Dijkstra’s algorithm",
    "Help me write an essay about Silicon Valley",
    "What is the weather in San Francisco?",
  ];

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!input.trim() || pending) return;

    const next = [...messages, { role: "user" as const, content: input.trim() }];
    setMessages(next);
    setInput("");
    setPending(true);

    abortRef.current?.abort();
    const ctrl = new AbortController();
    abortRef.current = ctrl;

    try {
      const res = await fetch("http://localhost:8080/chat", {
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
    } catch (e) {
      console.error(e);
      setMessages(prev => [...prev, { role: "assistant", content: "Something went wrong." }]);
    } finally {
      setPending(false);
    }
  }

  return (
    <section className="mt-6">
      <div className="glass rounded-2xl p-4 sm:p-6">
        <div className="mb-8">
          <h2 className="text-2xl font-semibold">Hello there!</h2>
          <p className="text-[var(--muted)]">How can I help you today?</p>
        </div>

        <div className="mb-6 grid gap-3 sm:grid-cols-2">
          {quick.map((q) => (
            <button
              key={q}
              type="button"
              className="w-full rounded-full glass px-4 py-3 text-left text-sm hover:border-zinc-600 hover:bg-zinc-900/60"
              onClick={() => setInput(q)}
            >
              {q}
            </button>
          ))}
        </div>

        <div className="h-[44vh] sm:h-[50vh] overflow-y-auto space-y-3">
          {messages.map((m, i) => (
            <MessageBubble key={i} role={m.role} content={m.content} />
          ))}
        </div>

        <form onSubmit={onSubmit} className="mt-4 flex items-end gap-2">
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Send a message…"
            rows={1}
            className="input"
          />
          <button
            type="submit"
            disabled={pending || !input.trim()}
            className="btn btn-primary"
            title="Send"
          >
            ↵
          </button>
          {pending && (
            <button type="button" onClick={() => abortRef.current?.abort()} className="btn btn-plain" title="Stop">
              ■
            </button>
          )}
        </form>
      </div>
    </section>
  );
}
