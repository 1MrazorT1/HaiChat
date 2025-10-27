import type { Config } from "tailwindcss";

export default {
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./pages/**/*.{ts,tsx}",
    "./src/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        bg: "#0b0b0f",
        panel: "#111316",
        fg: "#e5e7eb",
        muted: "#a1a1aa",
        accent: "#ef4444",
        accent600: "#dc2626",
        ring: "#f87171",
      },
      boxShadow: {
        "red-glow": "0 10px 30px -10px rgba(239,68,68,0.35)",
      },
      borderRadius: {
        xl2: "1.25rem",
      },
    },
  },
  plugins: [],
} satisfies Config;
