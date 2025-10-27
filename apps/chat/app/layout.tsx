export const metadata = { title: "Chat LLM", description: "Next.js from scratch" };

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="h-full">
      <body className="min-h-dvh bg-[var(--bg)] text-[var(--fg)] antialiased">
        <div className="mx-auto max-w-4xl">
          {children}
        </div>
      </body>
    </html>
  );
}
