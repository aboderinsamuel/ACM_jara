import { useEffect, useMemo, useRef, useState } from "react";
import HeroVideo from "@/components/netflix/HeroVideo";
import Row from "@/components/netflix/Row";
import { rows as baseRows, type Movie } from "@/data/movies";
import { getPosterPool } from "@/lib/posters";

function mulberry32(a: number) {
  return function () {
    let t = (a += 0x6d2b79f5);
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function shuffle<T>(arr: T[], rng: () => number): T[] {
  const a = arr.slice();
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

async function discoverPosters(): Promise<string[]> {
  const exts = ["webp", "jpg", "jpeg", "png", "avif"] as const;
  const base = "/moviePosters/";
  const found: string[] = [];

  const test = (url: string) =>
    new Promise<boolean>((resolve) => {
      const img = new Image();
      img.onload = () => resolve(true);
      img.onerror = () => resolve(false);
      img.src = url;
    });

  // Note: do not include profile pictures in poster discovery

  for (let i = 1; i <= 60; i++) {
    let ok = false;
    for (const ext of exts) {
      const url = `${base}p${i}.${ext}`;
      if (await test(url)) {
        found.push(url);
        ok = true;
        break;
      }
    }
    if (!ok && i > 25 && found.length > 0) break;
  }

  for (let i = 1; i <= 30; i++) {
    let ok = false;
    for (const ext of exts) {
      const url = `${base}image${i}.${ext}`;
      if (await test(url)) {
        found.push(url);
        ok = true;
        break;
      }
    }
    if (!ok && i > 10 && found.length > 0) break;
  }

  const unique = Array.from(new Set(found));
  return unique;
}

export default function Home() {
  const POSTER_CACHE_KEY = "available_posters_v2";
  const POSTER_CACHE_VERSION = 4;

  const isBannedPoster = (url: string) =>
    /\/ProfilePic\//i.test(url) ||
    /Netflix%20Profile%20Meme/i.test(url) ||
    /Netflix Profile Meme/i.test(url);

  const [posters, setPosters] = useState<string[]>(() => {
    try {
      const rawV2 = localStorage.getItem(POSTER_CACHE_KEY);
      if (rawV2) {
        const parsed = JSON.parse(rawV2);
        if (
          parsed &&
          parsed.version === POSTER_CACHE_VERSION &&
          Array.isArray(parsed.list)
        ) {
          const cleaned = (parsed.list as string[]).filter(
            (u) => !isBannedPoster(u),
          );
          return cleaned;
        }
      }
    } catch {}
    return [];
  });

  // Ensure variety across devices: if discovery yields too few images,
  // augment with a diversified placeholder pool (remote seeds)
  const postersPool = useMemo(() => {
    const pool = posters.length >= 5 ? posters : getPosterPool();
    return pool.filter((u) => !isBannedPoster(u));
  }, [posters]);

  const [seed] = useState(() => {
    const s = localStorage.getItem("home_seed");
    if (s) return parseInt(s, 10) || Math.floor(Math.random() * 1e9);
    const n = Math.floor(Math.random() * 1e9);
    localStorage.setItem("home_seed", String(n));
    return n;
  });

  useEffect(() => {
    const stale = posters.length === 0;
    if (!stale) return;
    (async () => {
      const list = (await discoverPosters()).filter((u) => !isBannedPoster(u));
      setPosters(list);
      try {
        localStorage.setItem(
          POSTER_CACHE_KEY,
          JSON.stringify({ version: POSTER_CACHE_VERSION, list }),
        );
      } catch {}
    })();
  }, [posters]);

  useEffect(() => {
    if (posters.length > 5) return;
    let cancelled = false;
    (async () => {
      const list = (await discoverPosters()).filter((u) => !isBannedPoster(u));
      if (cancelled) return;
      if (list.length > posters.length) {
        setPosters(list);
        try {
          localStorage.setItem(
            POSTER_CACHE_KEY,
            JSON.stringify({ version: POSTER_CACHE_VERSION, list }),
          );
        } catch {}
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [posters]);

  const rng = useMemo(() => mulberry32(seed), [seed]);

  const rows = useMemo(() => {
    const prng = mulberry32(seed);
    return shuffle(baseRows, prng).map((r) => ({
      title: r.title,
      movies: shuffle(r.movies, prng).map((m, idx) =>
        withRandomPoster(
          m,
          postersPool[
            (idx + Math.floor(prng() * 1000)) % Math.max(1, postersPool.length)
          ],
        ),
      ),
    }));
  }, [postersPool, seed]);

  function withRandomPoster(movie: Movie, posterUrl?: string): Movie {
    if (!posterUrl) return movie;
    return { ...movie, poster: posterUrl };
  }

  // Explore scroller controls
  const exploreRef = useRef<HTMLDivElement | null>(null);
  const [showLeftArrow, setShowLeftArrow] = useState(false);
  const [showRightArrow, setShowRightArrow] = useState(true);

  const updateExploreArrows = () => {
    const el = exploreRef.current;
    if (!el) return;
    const isAtStart = el.scrollLeft <= 5;
    const isAtEnd = el.scrollLeft >= el.scrollWidth - el.clientWidth - 5;
    setShowLeftArrow(!isAtStart);
    setShowRightArrow(!isAtEnd);
  };

  useEffect(() => {
    const el = exploreRef.current;
    if (!el) return;
    updateExploreArrows();
    el.addEventListener("scroll", updateExploreArrows);
    return () => el.removeEventListener("scroll", updateExploreArrows);
  }, [postersPool.length]);

  const explorePosters = useMemo(
    () => shuffle(postersPool, rng).slice(0, Math.min(40, postersPool.length)),
    [postersPool, rng],
  );

  const scrollExplore = (dir: -1 | 1) => () => {
    const el = exploreRef.current;
    if (!el) return;
    const amount = Math.max(400, Math.floor(window.innerWidth * 0.8)) * dir;
    el.scrollBy({ left: amount, behavior: "smooth" });
  };

  return (
    <div className="bg-black text-white min-h-screen">
      <HeroVideo />
      {/* Netflix-style division between hero and content */}
      <div className="relative">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-black/30 to-black"></div>
        <div className="h-12 sm:h-14"></div>
      </div>
      {/* Explore row (horizontal scroll) */}
      {explorePosters.length > 0 ? (
        <section className="relative z-10 mb-10">
          <h2 className="mb-3 px-4 sm:px-8 lg:px-12 text-lg sm:text-xl font-semibold text-white">
            Explore
          </h2>
          <div className="relative group">
            {/* Left scroll button */}
            <button
              aria-label="Scroll left"
              onClick={scrollExplore(-1)}
              className={`absolute left-0 top-1/2 -translate-y-1/2 z-20 h-12 w-12 items-center justify-center rounded-full bg-black/70 text-white hover:bg-black/90 transition-all duration-300 shadow-lg ${
                showLeftArrow ? "opacity-100" : "opacity-0 pointer-events-none"
              } hidden md:flex`}
            >
              <svg
                viewBox="0 0 24 24"
                className="h-6 w-6"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path d="M15 18l-6-6 6-6" />
              </svg>
            </button>
            {/* Right scroll button */}
            <button
              aria-label="Scroll right"
              onClick={scrollExplore(1)}
              className={`absolute right-0 top-1/2 -translate-y-1/2 z-20 h-12 w-12 items-center justify-center rounded-full bg-black/70 text-white hover:bg-black/90 transition-all duration-300 shadow-lg ${
                showRightArrow ? "opacity-100" : "opacity-0 pointer-events-none"
              } hidden md:flex`}
            >
              <svg
                viewBox="0 0 24 24"
                className="h-6 w-6"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path d="M9 18l6-6-6-6" />
              </svg>
            </button>
            <div
              ref={exploreRef}
              className="flex gap-2 overflow-x-auto scroll-smooth no-scrollbar px-4 sm:px-8 lg:px-12"
              style={{
                scrollbarWidth: "none",
                msOverflowStyle: "none",
                width: "100%",
              }}
            >
              {explorePosters.map((src, i) => (
                <ExplorePoster key={`${src}-${i}`} src={src} index={i} />
              ))}
            </div>
          </div>
        </section>
      ) : null}
      <div className="relative z-10">
        {rows.map((r) => (
          <Row key={r.title} title={r.title} movies={r.movies} />
        ))}
      </div>
    </div>
  );
}

function ExplorePoster({ src, index }: { src: string; index: number }) {
  const [loaded, setLoaded] = useState(false);
  const isPriority = index < 10; // a few early posters can be eager
  return (
    <div className="relative aspect-[2/3] w-32 sm:w-36 md:w-40 lg:w-44 shrink-0 overflow-hidden rounded ring-1 ring-white/10">
      <div
        aria-hidden
        className={`absolute inset-0 shimmer bg-neutral-800 ${loaded ? "opacity-0" : "opacity-100"} transition-opacity duration-300 pointer-events-none`}
      />
      <img
        src={src}
        alt="Poster"
        className={`h-full w-full object-cover transition duration-500 hover:scale-105 ${loaded ? "opacity-100" : "opacity-0"}`}
        loading={isPriority ? "eager" : "lazy"}
        fetchPriority={isPriority ? "high" : "auto"}
        decoding="async"
        onLoad={() => setLoaded(true)}
        onError={() => setLoaded(true)}
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent opacity-0 hover:opacity-100 transition-opacity" />
    </div>
  );
}
