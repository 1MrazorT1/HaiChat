import Mode from "@/components/Mode";

export default function Page() {
  return (
    <main className="py-6">
      <header className="sticky top-0 z-10 -mx-4 px-4 py-4 glass">
        <div className="flex items-center justify-between">
          <h1 className="text-lg font-semibold tracking-tight">Chat LLM</h1>
          <span className="text-sm text-[var(--muted)]">Red & Black</span>
        </div>
      </header>
      <Mode />
    </main>
  );
}
