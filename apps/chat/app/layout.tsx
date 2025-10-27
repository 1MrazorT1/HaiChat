export const metadata = { title: "Chat LLM", description: "Next.js from scratch" };

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-dvh bg-white text-neutral-900">{children}</body>
    </html>
  );
}
