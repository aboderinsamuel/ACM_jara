// Utilities for providing a diversified set of poster images across the app.

const POSTER_CACHE_KEY = "available_posters_v2";

export function getPosterPool(): string[] {
  // Try to read discovered posters cached by Home.tsx logic
  try {
    const raw = localStorage.getItem(POSTER_CACHE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (parsed && Array.isArray(parsed.list)) {
        const list: string[] = parsed.list;
        if (list.length > 0) return dedupe(list);
      }
    }
  } catch {}

  // Fallback: return only the local default if cache not ready yet
  // This will be replaced quickly once App preloads and caches real posters
  return ["/moviePosters/image1.webp"];
}

export function randomPoster(seed?: number): string {
  const pool = getPosterPool();
  if (pool.length === 0) return "/moviePosters/image1.webp";
  const idx = seededIndex(pool.length, seed);
  return pool[idx];
}

function seededIndex(n: number, seed?: number): number {
  if (typeof seed !== "number") return Math.floor(Math.random() * n);
  // simple LCG for stable index from seed
  const a = 1664525;
  const c = 1013904223;
  const m = 2 ** 32;
  const next = (a * (seed >>> 0) + c) % m;
  return next % n;
}

function dedupe(arr: string[]): string[] {
  return Array.from(new Set(arr));
}
