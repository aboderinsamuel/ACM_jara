/**
 * Shared code between client and server
 * Useful to share types between client and server
 * and/or small pure JS functions that can be used on both client and server
 */

/**
 * Example response type for /api/demo
 */
export interface DemoResponse {
  message: string;
}

import { API_URL } from "@shared/env";

export class ApiError extends Error {
  status: number;
  body?: string;
  constructor(status: number, message: string, body?: string) {
    super(message);
    this.status = status;
    this.body = body;
  }
}

// Minimal API client using the configured base URL
export async function api<T>(path: string, init?: RequestInit): Promise<T> {
  const base = API_URL || ""; // if empty, treat path as absolute or relative
  const url = path.startsWith("http") ? path : `${base}${path.startsWith("/") ? path : `/${path}`}`;
  const res = await fetch(url, {
    ...init,
    headers: {
      "Content-Type": "application/json",
      ...(init?.headers || {}),
    },
  });
  if (!res.ok) {
    const text = await res.text().catch(() => "");
    // Hide raw backend JSON in message; provide status-specific friendly message
    const friendly = res.status === 404
      ? "Requested resource was not found"
      : res.status === 401
      ? "You are not authorized. Please sign in."
      : res.status === 500
      ? "Something went wrong on the server"
      : res.statusText || "Request failed";
    throw new ApiError(res.status, friendly, text);
  }
  if (res.status === 204) return undefined as unknown as T;
  const ct = res.headers.get("content-type");
  if (ct && ct.includes("application/json")) {
    return (await res.json()) as T;
  }
  // @ts-ignore allow text fallback
  return (await res.text()) as T;
}

// API helper that attaches Supabase access token as Authorization Bearer
export async function apiAuth<T>(path: string, init?: RequestInit): Promise<T> {
  // Read token saved by our custom auth flow
  let token: string | undefined;
  try {
    token = localStorage.getItem("auth_token") || undefined;
  } catch {
    // SSR or storage not available
  }
  return api<T>(path, {
    ...init,
    headers: {
      ...(init?.headers || {}),
      Authorization: token ? `Bearer ${token}` : undefined,
    },
  });
}

// ---- Auth helpers (API-based) ----
export type AuthUser = {
  id?: string;
  email: string;
  [k: string]: unknown;
};

export type AuthResponse = {
  token: string;
  user: AuthUser;
};

function extractAuthResponse(obj: any): AuthResponse {
  // Accept a few common response shapes
  const token = obj?.token || obj?.accessToken || obj?.data?.token;
  const user = obj?.user || obj?.data?.user || obj?.profile || {};
  if (!token) throw new ApiError(500, "Auth token missing from response");
  const email = user?.email || obj?.email;
  return { token, user: { email, ...user } } as AuthResponse;
}

export async function loginUser(email: string, password: string): Promise<AuthResponse> {
  const res = await api<any>("/auth/login", {
    method: "POST",
    body: JSON.stringify({ email, password }),
  });
  return extractAuthResponse(res);
}

export async function registerUser(email: string, password: string): Promise<AuthResponse> {
  const res = await api<any>("/auth/register", {
    method: "POST",
    body: JSON.stringify({ email, password }),
  });
  return extractAuthResponse(res);
}

