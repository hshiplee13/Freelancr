"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { apiFetch, clearTokens, getMe } from "@/lib/api";

type Client = { id: string; name: string; company: string; email: string };
type Project = { id: string; title: string; status: string; client: string };

export default function Workspace() {
  const router = useRouter();
  const [user, setUser] = useState<{ email: string } | null>(null);
  const [clients, setClients] = useState<Client[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const me = await getMe();
        setUser(me);
        const [clientData, projectData] = await Promise.all([
          apiFetch("/clients/"),
          apiFetch("/projects/"),
        ]);
        setClients(clientData.results ?? clientData);
        setProjects(projectData.results ?? projectData);
      } catch {
        router.push("/login");
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [router]);

  function handleSignOut() {
    clearTokens();
    router.push("/login");
  }

  return (
    <main className="min-h-screen">
      <nav className="flex items-center justify-between px-8 py-6 border-b border-ink/10">
        <span className="font-display text-2xl text-ink">Freelancr</span>
        <div className="flex gap-6 items-center text-sm text-ink/70">
          <a href="#clients" className="hover:text-moss">Clients</a>
          <a href="#projects" className="hover:text-moss">Projects</a>
          <span>{user?.email}</span>
          <button onClick={handleSignOut} className="hover:text-clay">
            Sign out
          </button>
        </div>
      </nav>

      <div className="max-w-6xl mx-auto px-8 py-10">
        <h1 className="font-display text-3xl text-ink mb-8">Dashboard</h1>

        {loading ? (
          <p className="text-ink/50">Loading your workspace...</p>
        ) : (
          <div className="grid md:grid-cols-2 gap-10">
            <section id="clients">
              <div className="flex items-center justify-between mb-4">
                <h2 className="font-display text-xl text-ink">Clients</h2>
                <Link href="#" className="text-sm text-moss hover:underline">+ Add client</Link>
              </div>
              {clients.length === 0 ? (
                <p className="text-ink/50 text-sm">
                  No clients yet. Add your first client to start tracking projects.
                </p>
              ) : (
                <ul className="space-y-3">
                  {clients.map((c) => (
                    <li key={c.id} className="border border-ink/10 rounded-sm p-4">
                      <p className="font-medium text-ink">{c.name}</p>
                      <p className="text-sm text-ink/50">{c.company || c.email}</p>
                    </li>
                  ))}
                </ul>
              )}
            </section>

            <section id="projects">
              <div className="flex items-center justify-between mb-4">
                <h2 className="font-display text-xl text-ink">Projects</h2>
                <Link href="#" className="text-sm text-moss hover:underline">+ Add project</Link>
              </div>
              {projects.length === 0 ? (
                <p className="text-ink/50 text-sm">
                  No projects yet. Create one once you've added a client.
                </p>
              ) : (
                <ul className="space-y-3">
                  {projects.map((p) => (
                    <li key={p.id} className="border border-ink/10 rounded-sm p-4 flex justify-between">
                      <span className="font-medium text-ink">{p.title}</span>
                      <span className="text-sm text-ink/50 capitalize">{p.status}</span>
                    </li>
                  ))}
                </ul>
              )}
            </section>
          </div>
        )}
      </div>

      <footer className="max-w-6xl mx-auto px-8 py-12 text-sm text-ink/40">
        &copy; 2026 Freelancr
      </footer>
    </main>
  );
}
