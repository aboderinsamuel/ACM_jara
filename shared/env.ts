// Read environment variables in a way that works on both client (Vite) and server (Node)
const getEnv = (key: string): string | undefined => {
  // Vite exposes variables on import.meta.env
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const viteEnv = typeof import.meta !== "undefined" ? (import.meta as any).env : undefined;
  // @ts-ignore process may not exist on the client, but the OR short-circuit protects it at runtime
  return (viteEnv && viteEnv[key]) || (typeof process !== "undefined" ? process.env?.[key] : undefined);
};

export const API_URL = getEnv("VITE_API_URL")?.replace(/\/?$/, "") || "";
export const SUPABASE_URL = getEnv("VITE_SUPABASE_URL") || "";
export const SUPABASE_ANON_KEY = getEnv("VITE_SUPABASE_ANON_KEY") || "";

export const env = {
  API_URL,
  SUPABASE_URL,
  SUPABASE_ANON_KEY,
};

export function assertEnv() {
  if (!API_URL) {
    console.warn("[env] VITE_API_URL is not set. API helpers will use relative paths.");
  }
}
