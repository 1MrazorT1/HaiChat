"use client";

import { useRef, useState } from "react";
import MessageBubble from "./MessageBubble";

type Msg = { role: "user" | "assistant"; content: string };

export default function Chat() {
  const [messages, setMessages] = useState<Msg[]>([
    { role: "assistant", content: "Hi! Ask me anything." },
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
      const res = await fetch("/api/chat", {
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
    } catch {
      setMessages(prev => [...prev, { role: "assistant", content: "Request failed." }]);
    } finally {
      setPending(false);
    }
  }

  return (
    <div className="mx-auto w-full max-w-3xl h-[100dvh] flex flex-col">
      <div className="flex-1 overflow-y-auto space-y-3 p-4">
        {messages.map((m, i) => <MessageBubble key={i} role={m.role} content={m.content} />)}
      </div>
      <form onSubmit={onSubmit} className="p-4 border-t">
        <div className="flex gap-2">
          <textarea
            value={input}
            onChange={e => setInput(e.target.value)}
            placeholder="Type your message…"
            className="flex-1 resize-none rounded-xl border px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            rows={1}
          />
          <button type="submit" disabled={pending || !input.trim()} className="rounded-xl px-4 py-2 bg-blue-600 text-white disabled:opacity-50">
            Send
          </button>
          {pending && <button type="button" onClick={() => abortRef.current?.abort()} className="rounded-xl px-4 py-2 border">Stop</button>}
        </div>
      </form>
    </div>
  );
}
