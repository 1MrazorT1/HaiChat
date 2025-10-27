"use client";
type Props = { role: "user" | "assistant"; content: string };
export default function MessageBubble({ role, content }: Props) {
  const isUser = role === "user";
  return (
    <div className={`w-full flex ${isUser ? "justify-end" : "justify-start"}`}>
      <div
        className={`max-w-[80%] rounded-2xl px-4 py-2 ${
          isUser ? "bg-blue-600 text-white" : "bg-neutral-100 text-neutral-900"
        }`}
      >
        {content}
      </div>
    </div>
  );
}
