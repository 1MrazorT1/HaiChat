"use client";

type Props = { role: "user" | "assistant"; content: string };

export default function MessageBubble({ role, content }: Props) {
  const isUser = role === "user";
  return (
    <div className={`w-full flex ${isUser ? "justify-end" : "justify-start"}`}>
      <div
        className={[
          "max-w-[80%] rounded-2xl px-4 py-2",
          isUser
            ? "text-white bg-gradient-to-br from-red-600 to-red-500 shadow-lg shadow-red-900/30"
            : "text-neutral-100 bg-neutral-900/60 border border-neutral-800 backdrop-blur"
        ].join(" ")}
      >
        {content}
      </div>
    </div>
  );
}
