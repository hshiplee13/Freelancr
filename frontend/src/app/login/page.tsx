"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { login } from "@/lib/api";

export default function Login() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await login(username, password);
      router.push("/workspace");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Couldn't log in. Check your details and try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen grid md:grid-cols-2">
      <div className="bg-ink text-paper p-12 flex flex-col justify-between">
        <Link href="/" className="font-display text-2xl">Freelancr</Link>
        <div>
          <p className="font-display text-3xl leading-snug">
            Pick up right where your last call left off.
          </p>
          <p className="mt-4 text-paper/60 max-w-sm">
            Your clients, projects, and scope of truth are all waiting.
          </p>
        </div>
        <p className="text-sm text-paper/40">&copy; 2026 Freelancr</p>
      </div>

      <div className="flex items-center justify-center p-12">
        <form onSubmit={handleSubmit} className="w-full max-w-sm">
          <h1 className="font-display text-3xl text-ink mb-8">Log in</h1>

          <label className="block text-sm text-ink/70 mb-1">Username</label>
          <input
            className="w-full border border-ink/20 rounded-sm px-3 py-2 mb-4 focus:outline-none focus:ring-2 focus:ring-moss"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />

          <label className="block text-sm text-ink/70 mb-1">Password</label>
          <input
            type="password"
            className="w-full border border-ink/20 rounded-sm px-3 py-2 mb-4 focus:outline-none focus:ring-2 focus:ring-moss"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          {error && <p className="text-clay text-sm mb-4">{error}</p>}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-moss text-paper py-2 rounded-sm hover:bg-ink transition-colors disabled:opacity-60"
          >
            {loading ? "Logging in..." : "Log in"}
          </button>

          <p className="text-sm text-ink/60 mt-6">
            No account yet?{" "}
            <Link href="/signup" className="text-moss hover:underline">
              Sign up
            </Link>
          </p>
        </form>
      </div>
    </main>
  );
}
