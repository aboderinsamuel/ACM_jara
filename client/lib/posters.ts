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

  // Fallback: curated remote seed posters (portrait-friendly crops)
  return dedupe(REMOTE_SEED_POSTERS);
}

export function randomPoster(seed?: number): string {
  const pool = getPosterPool();
  if (pool.length === 0) return "";
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

// Curated remote seed posters (vertical orientation or center-cropped)
// These are generic imagery, not branded movie posters.
const REMOTE_SEED_POSTERS: string[] = [
  // portraits and center crops
  "https://images.unsplash.com/photo-1513343041531-166e4c681b78?auto=format&fit=crop&w=700&q=80",
  "https://images.unsplash.com/photo-1525186402429-b4ff38bedbec?auto=format&fit=crop&w=700&q=80",
  "https://images.unsplash.com/photo-1520813792240-56fc4a3765a7?auto=format&fit=crop&w=700&q=80",
  "https://images.unsplash.com/photo-1517602302552-471fe67acf66?auto=format&fit=crop&w=700&q=80",
  "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=700&q=80",
  "https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=700&q=80",
  "https://images.unsplash.com/photo-1492486166140-c5f7b90fbbe0?auto=format&fit=crop&w=700&q=80",
  "https://images.unsplash.com/photo-1497032628192-86f99bcd76bc?auto=format&fit=crop&w=700&q=80",
  "https://images.unsplash.com/photo-1460472178825-e5240623afd5?auto=format&fit=crop&w=700&q=80",
  "https://images.unsplash.com/photo-1499951360447-b19be8fe80f5?auto=format&fit=crop&w=700&q=80",
  "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?auto=format&fit=crop&w=700&q=80",
  "https://images.unsplash.com/photo-1495461199391-8c39f6c6f75b?auto=format&fit=crop&w=700&q=80",
];
