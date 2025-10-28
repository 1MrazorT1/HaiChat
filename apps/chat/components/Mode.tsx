"use client";

import { useRouter } from "next/navigation";
import { useCallback } from "react";

type Mode = "online" | "offline";

export default function ModePage() {
  const router = useRouter();

  const choose = useCallback((m: Mode) => {
    localStorage.setItem("haichat:mode", m);
    router.push("/chatpage");
  }, [router]);

  return (
    <div className="mx-auto max-w-xl p-6">
      <h1 className="text-2xl font-semibold text-red-400">Choose your mode</h1>
      <p className="mt-2 text-sm text-neutral-400">
        Pick between local inference (offline) or cloud (online).
      </p>

      <div className="mt-6 grid gap-4 sm:grid-cols-2">
        <button
          onClick={() => choose("offline")}
          className="rounded-2xl border border-neutral-800 bg-neutral-950 p-5 text-left hover:border-red-700/60 hover:shadow-xl hover:shadow-red-900/20"
        >
          <div className="text-lg font-medium">Offline (vLLM)</div>
          <ul className="mt-2 list-disc pl-5 text-sm text-neutral-400">
            <li>Runs locally</li>
            <li>Best privacy</li>
          </ul>
        </button>

        <button
          onClick={() => choose("online")}
          className="rounded-2xl border border-neutral-800 bg-neutral-950 p-5 text-left hover:border-red-700/60 hover:shadow-xl hover:shadow-red-900/20"
        >
          <div className="text-lg font-medium">Online (Mistral)</div>
          <ul className="mt-2 list-disc pl-5 text-sm text-neutral-400">
            <li>Hosted models</li>
            <li>No local GPU needed</li>
          </ul>
        </button>
      </div>
    </div>
  );
}
