import Chat from "@/components/Chat";

export default function Page() {
  return (
    <main className="p-4 sm:p-6">
      <header className="sticky top-0 z-10 -mx-4 sm:-mx-6 px-4 sm:px-6 py-4 backdrop-blur supports-[backdrop-filter]:bg-black/30 border-b border-neutral-800">
        <h1 className="text-xl font-semibold tracking-tight">Chat LLM</h1>
      </header>
      <Chat />
    </main>
  );
}
