const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api";

function getAccessToken(): string | null {
  if (typeof window === "undefined") return null;
  return window.localStorage.getItem("freelancr_access");
}

export function setTokens(access: string, refresh: string) {
  window.localStorage.setItem("freelancr_access", access);
  window.localStorage.setItem("freelancr_refresh", refresh);
}

export function clearTokens() {
  window.localStorage.removeItem("freelancr_access");
  window.localStorage.removeItem("freelancr_refresh");
}

export async function apiFetch(path: string, options: RequestInit = {}) {
  const token = getAccessToken();
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...(options.headers as Record<string, string>),
  };
  if (token) headers["Authorization"] = `Bearer ${token}`;

  const res = await fetch(`${API_BASE}${path}`, { ...options, headers });
  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw new Error(body.detail || `Request failed: ${res.status}`);
  }
  return res.json();
}

export async function signup(data: {
  username: string;
  email: string;
  password: string;
  first_name?: string;
  last_name?: string;
  role: "freelancer" | "business";
}) {
  const result = await apiFetch("/auth/signup/", {
    method: "POST",
    body: JSON.stringify(data),
  });
  setTokens(result.access, result.refresh);
  return result.user;
}

export async function login(username: string, password: string) {
  const result = await apiFetch("/auth/login/", {
    method: "POST",
    body: JSON.stringify({ username, password }),
  });
  setTokens(result.access, result.refresh);
  return result;
}

export async function getMe() {
  return apiFetch("/auth/me/");
}
