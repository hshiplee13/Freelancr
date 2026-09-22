"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { signup } from "@/lib/api";

export default function Signup() {
  const router = useRouter();
  const [form, setForm] = useState({
    username: "",
    email: "",
    password: "",
    role: "freelancer" as "freelancer" | "business",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  function update(field: string, value: string) {
    setForm((f) => ({ ...f, [field]: value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await signup(form);
      router.push("/workspace");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Couldn't create your account. Try again.");
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
            Get a clear scope of truth from every client call.
          </p>
          <p className="mt-4 text-paper/60 max-w-sm">
            Set up your workspace in a couple of minutes.
          </p>
        </div>
        <p className="text-sm text-paper/40">&copy; 2026 Freelancr</p>
      </div>

      <div className="flex items-center justify-center p-12">
        <form onSubmit={handleSubmit} className="w-full max-w-sm">
          <h1 className="font-display text-3xl text-ink mb-8">Sign up</h1>

          <label className="block text-sm text-ink/70 mb-1">Username</label>
          <input
            className="w-full border border-ink/20 rounded-sm px-3 py-2 mb-4 focus:outline-none focus:ring-2 focus:ring-moss"
            value={form.username}
            onChange={(e) => update("username", e.target.value)}
            required
          />

          <label className="block text-sm text-ink/70 mb-1">Email</label>
          <input
            type="email"
            className="w-full border border-ink/20 rounded-sm px-3 py-2 mb-4 focus:outline-none focus:ring-2 focus:ring-moss"
            value={form.email}
            onChange={(e) => update("email", e.target.value)}
            required
          />

          <label className="block text-sm text-ink/70 mb-1">Password</label>
          <input
            type="password"
            className="w-full border border-ink/20 rounded-sm px-3 py-2 mb-4 focus:outline-none focus:ring-2 focus:ring-moss"
            value={form.password}
            onChange={(e) => update("password", e.target.value)}
            minLength={8}
            required
          />

          <label className="block text-sm text-ink/70 mb-1">I am a</label>
          <select
            className="w-full border border-ink/20 rounded-sm px-3 py-2 mb-6 focus:outline-none focus:ring-2 focus:ring-moss"
            value={form.role}
            onChange={(e) => update("role", e.target.value)}
          >
            <option value="freelancer">Freelancer</option>
            <option value="business">Small business</option>
          </select>

          {error && <p className="text-clay text-sm mb-4">{error}</p>}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-moss text-paper py-2 rounded-sm hover:bg-ink transition-colors disabled:opacity-60"
          >
            {loading ? "Creating account..." : "Create account"}
          </button>

          <p className="text-sm text-ink/60 mt-6">
            Already have an account?{" "}
            <Link href="/login" className="text-moss hover:underline">
              Log in
            </Link>
          </p>
        </form>
      </div>
    </main>
  );
}
