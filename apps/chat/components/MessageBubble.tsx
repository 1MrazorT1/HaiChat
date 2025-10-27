"use client";

type Props = { role: "user" | "assistant"; content: string };

export default function MessageBubble({ role, content }: Props) {
  const me = role === "user";
  return (
    <div className={`w-full flex ${me ? "justify-end" : "justify-start"}`}>
      <div
        className={[
          "max-w-[85%] rounded-2xl px-4 py-3 whitespace-pre-wrap leading-relaxed",
          me
            ? "text-white bg-[var(--accent)] shadow-[0_10px_30px_-10px_rgba(239,68,68,0.35)]"
            : "glass text-[var(--fg)]"
        ].join(" ")}
      >
        {content}
      </div>
    </div>
  );
}
