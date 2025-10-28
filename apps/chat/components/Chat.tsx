"use client";
import { useRef, useState, useEffect } from "react";
import MessageBubble from "./MessageBubble";

type Mode = "online" | "offline";
type Role = "user" | "assistant";
type Msg = { role: Role; content: string };

const ONLINE_ENDPOINT = "http://localhost:8090/response"
const OFFLINE_ENDPOINT = "http://localhost:8000/v1/chat/completions"
const OFFLINE_MODEL = "TinyLlama/TinyLlama-1.1B-Chat-v1.0"
const OFFLINE_API_KEY = "testingvllm"

export default function Chat() {
  const [mode, setMode] = useState<Mode>("online");
  const [messages, setMessages] = useState<Msg[]>([
    { role: "assistant", content: "Hello there!\nHow can I help you today?" },
  ]);
  const [input, setInput] = useState("");
  const [pending, setPending] = useState(false);
  const [banner, setBanner] = useState<string | null>(null);
  const abortRef = useRef<AbortController | null>(null);
  const formRef = useRef<HTMLFormElement | null>(null);

  useEffect(() => {
    const m = (localStorage.getItem("haichat:mode") as Mode) ?? "online";
    setMode(m);
  }, []);
  useEffect(() => () => abortRef.current?.abort(), []);

  function saveMode(next: Mode) {
    setMode(next);
    localStorage.setItem("haichat:mode", next);
  }
  function toggleMode() {
    if (pending) return;
    saveMode(mode === "online" ? "offline" : "online");
    setBanner(null);
  }
  function handleKeyDown(e: React.KeyboardEvent<HTMLTextAreaElement>) {
    if (e.key !== "Enter" || e.shiftKey || (e as any).isComposing) return;
    e.preventDefault();
    if (!pending && input.trim()) {
      formRef.current?.requestSubmit?.();
      if (!formRef.current?.requestSubmit) {
        formRef.current?.dispatchEvent(new Event("submit", { cancelable: true, bubbles: true }));
      }
    }
  }

  async function postOnline(userText: string, signal: AbortSignal) {
    const res = await fetch(ONLINE_ENDPOINT, {
      method: "POST",
      headers: { "Content-Type": "text/plain" },
      body: userText,
      signal,
    });
    const text = await res.text().catch(() => "");
    if (!res.ok) throw new Error(text || `HTTP ${res.status}`);
    return text;
  }

  async function postOffline(history: Msg[], signal: AbortSignal) {
    const headers: Record<string, string> = { "Content-Type": "application/json" };
    if (OFFLINE_API_KEY) headers.Authorization = `Bearer ${OFFLINE_API_KEY}`;
    const res = await fetch(OFFLINE_ENDPOINT, {
      method: "POST",
      headers,
      body: JSON.stringify({ model: OFFLINE_MODEL, messages: history }),
      signal,
    });
    const raw = await res.text().catch(() => "");
    if (!res.ok) throw new Error(raw || `HTTP ${res.status}`);
    try {
      const json = JSON.parse(raw);
      return (
        json?.choices?.[0]?.message?.content ??
        json?.choices?.[0]?.delta?.content ??
        String(raw)
      );
    } catch {
      return raw;
    }
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (pending) return;
    const userText = input.trim();
    if (!userText) return;

    const next = [...messages, { role: "user", content: userText } as Msg];
    setMessages(next);
    setInput("");
    setPending(true);
    setBanner(null);

    abortRef.current?.abort();
    const ctrl = new AbortController();
    abortRef.current = ctrl;

    try {
      const reply =
        mode === "offline"
          ? await postOffline(next, ctrl.signal)
          : await postOnline(userText, ctrl.signal);
      setMessages(prev => [...prev, { role: "assistant", content: reply }]);
    } catch (err: any) {
      setBanner(err?.message || "Something went wrong.");
    } finally {
      setPending(false);
    }
  }

  return (
    <section className="mt-6">
      <div className="glass rounded-2xl p-4 sm:p-6">
        <div className="mb-8 flex items-start justify-between gap-3">
          <div>
            <h2 className="text-2xl font-semibold">Hello there!</h2>
            <p className="text-[var(--muted)]">How can I help you today?</p>
          </div>
          <div className="flex items-center gap-2">
            <span className="font-mono text-xs sm:text-sm px-2 py-1 rounded-md bg-zinc-900/60 border border-zinc-700 text-red-500">
              MODE: {mode.toUpperCase()}
            </span>
            <button
              type="button"
              onClick={toggleMode}
              disabled={pending}
              className="btn btn-plain"
              title={`Switch to ${mode === "online" ? "offline" : "online"}`}
            >
              {mode === "online" ? "Go Offline" : "Go Online"}
            </button>
          </div>
        </div>

        {banner && (
          <div className="mb-4 rounded-md border border-amber-500 bg-amber-100/20 px-3 py-2 text-sm text-amber-300">
            {banner}
          </div>
        )}

        <div className="h-[44vh] sm:h-[50vh] overflow-y-auto space-y-3">
          {messages.map((m, i) => (
            <MessageBubble key={i} role={m.role} content={m.content} />
          ))}
        </div>

        <form ref={formRef} onSubmit={onSubmit} className="mt-4 flex items-end gap-2">
          <textarea
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
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
            <button
              type="button"
              onClick={() => abortRef.current?.abort()}
              className="btn btn-plain"
              title="Stop"
            >
              ■
            </button>
          )}
        </form>
      </div>
    </section>
  );
}
