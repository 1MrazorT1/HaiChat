import "./globals.css";

export const metadata = { title: "HaiChat", description: "Sleek red & black chat" };

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="h-full">
      <body className="min-h-dvh text-[var(--fg)]">
        <div className="mx-auto max-w-5xl px-4">{children}</div>
      </body>
    </html>
  );
}
