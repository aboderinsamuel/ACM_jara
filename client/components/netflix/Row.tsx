import { useRef, useState, useEffect } from "react";
import type { Movie } from "@/data/movies";
import { ChevronLeft, ChevronRight, CirclePlus, Play } from "lucide-react";
import { Button } from "@/components/ui/button";

function MovieCard({
  movie,
  index,
  onPlay,
  onOpenDetails,
}: {
  movie: Movie;
  index: number;
  onPlay: (m: Movie) => void;
  onOpenDetails: (m: Movie) => void;
}) {
  // Only the first few thumbnails should be eager to avoid network congestion
  const isPriority = index < 8;
  const [loaded, setLoaded] = useState(false);
  return (
    <div
      role="button"
      tabIndex={0}
      onClick={() => onOpenDetails(movie)}
      className="group relative aspect-[2/3] w-32 sm:w-36 md:w-40 lg:w-44 shrink-0 rounded overflow-hidden transition-transform duration-300 hover:scale-105 hover:z-10"
    >
      {/* Shimmer placeholder */}
      <div
        aria-hidden
        className={`absolute inset-0 shimmer bg-neutral-800 ${loaded ? "opacity-0" : "opacity-100"} transition-opacity duration-300 pointer-events-none`}
      />
      <img
        src={movie.poster}
        alt={movie.title}
        className={`h-full w-full object-cover transition-opacity duration-300 ${loaded ? "opacity-100" : "opacity-0"}`}
        loading={isPriority ? "eager" : "lazy"}
        fetchPriority={isPriority ? "high" : "auto"}
        decoding="async"
        onLoad={() => setLoaded(true)}
        onError={() => setLoaded(true)}
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      <div className="absolute inset-x-2 bottom-2 flex items-center justify-between opacity-0 group-hover:opacity-100 transition-opacity duration-300">
        <div className="flex gap-1.5">
          <Button
            size="icon"
            className="h-8 w-8 bg-white text-black hover:bg-white/90 shadow-lg"
            onClick={(e) => {
              e.stopPropagation();
              onPlay(movie);
            }}
          >
            <Play className="h-3 w-3 ml-0.5" />
          </Button>
          <Button
            size="icon"
            className="h-8 w-8 bg-black/60 text-white hover:bg-black/80 border border-white/30"
          >
            <CirclePlus className="h-3 w-3" />
          </Button>
        </div>
      </div>
    </div>
  );
}

import Player from "./Player";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { Link } from "react-router-dom";
import { toast } from "sonner";

export default function Row({
  title,
  movies,
}: {
  title: string;
  movies: Movie[];
}) {
  const scrollerRef = useRef<HTMLDivElement>(null);
  const [current, setCurrent] = useState<Movie | null>(null);
  const [open, setOpen] = useState(false);
  const [detailsOpen, setDetailsOpen] = useState(false);
  const [showLeftArrow, setShowLeftArrow] = useState(false);
  const [showRightArrow, setShowRightArrow] = useState(true);
  // We repeat the movies so wide screens still have content to scroll.
  const [displayMovies, setDisplayMovies] = useState<Movie[]>(movies);

  // Helper to estimate responsive card width (matches the Tailwind classes on MovieCard)
  const getCardWidth = () => {
    if (typeof window === "undefined") return 144; // default for SSR
    const w = window.innerWidth;
    // w-32 (128) <640, w-36 (144) >=640, w-40 (160) >=768, w-44 (176) >=1024
    if (w >= 1024) return 176;
    if (w >= 768) return 160;
    if (w >= 640) return 144;
    return 128;
  };

  const handlePlay = (m: Movie) => {
    if (!m.trailer) {
      toast.error("No video available for this title yet.");
      return;
    }
    setCurrent(m);
    setOpen(true);
  };

  const openDetails = (m: Movie) => {
    setCurrent(m);
    setDetailsOpen(true);
  };

  const updateArrows = () => {
    const el = scrollerRef.current;
    if (!el) return;

    const isAtStart = el.scrollLeft <= 5;
    const isAtEnd = el.scrollLeft >= el.scrollWidth - el.clientWidth - 5;

    setShowLeftArrow(!isAtStart);
    setShowRightArrow(!isAtEnd);
  };

  useEffect(() => {
    const el = scrollerRef.current;
    if (!el) return;

    updateArrows();
    el.addEventListener("scroll", updateArrows);
    return () => el.removeEventListener("scroll", updateArrows);
  }, [movies]);

  // Ensure there's always enough cards to overflow horizontally (so the right side isn't empty)
  useEffect(() => {
    const updateDisplay = () => {
      const cw = getCardWidth();
      const gap = 12; // gap-3
      const px =
        typeof window !== "undefined" && window.innerWidth >= 1024
          ? 48 * 2
          : typeof window !== "undefined" && window.innerWidth >= 640
            ? 32 * 2
            : 16 * 2; // approximate left+right padding from px-4/sm:px-8/lg:px-12
      const vw = typeof window !== "undefined" ? window.innerWidth : 1200;
      const available = Math.max(0, vw - px);
      const visibleCards = Math.max(1, Math.floor(available / (cw + gap)));

      // We want at least a few more cards than visible to create scroll affordance
      const minCards = visibleCards + 6;
      const repeats = Math.max(
        1,
        Math.ceil(minCards / Math.max(1, movies.length)),
      );
      const extended = Array.from({ length: repeats }).flatMap(() => movies);
      setDisplayMovies(extended);
    };

    updateDisplay();
    window.addEventListener("resize", updateDisplay);
    return () => window.removeEventListener("resize", updateDisplay);
  }, [movies]);

  const scroll = (dir: -1 | 1) => () => {
    const el = scrollerRef.current;
    if (!el) return;

    // Calculate scroll amount based on responsive card width + gap
    const cardWidth = getCardWidth();
    const gap = 12; // gap-3 = 12px
    const scrollAmount = (cardWidth + gap) * 4 * dir; // Scroll 4 cards at a time

    el.scrollBy({ left: scrollAmount, behavior: "smooth" });
  };

  return (
    <section className="relative mb-8">
      {/* Heading keeps page padding */}
      <h2 className="mb-4 px-4 sm:px-8 lg:px-12 text-lg sm:text-xl font-semibold text-white">
        {title}
      </h2>
      {/* Full-bleed scroller area */}
      <div className="relative group">
        {/* Left scroll button */}
        <button
          aria-label="Scroll left"
          onClick={scroll(-1)}
          className={`absolute left-0 top-1/2 -translate-y-1/2 z-20 h-12 w-12 items-center justify-center rounded-full bg-black/70 text-white hover:bg-black/90 transition-all duration-300 shadow-lg ${
            showLeftArrow ? "opacity-100" : "opacity-0 pointer-events-none"
          } hidden md:flex`}
        >
          <ChevronLeft className="h-6 w-6" />
        </button>

        {/* Right scroll button */}
        <button
          aria-label="Scroll right"
          onClick={scroll(1)}
          className={`absolute right-0 top-1/2 -translate-y-1/2 z-20 h-12 w-12 items-center justify-center rounded-full bg-black/70 text-white hover:bg-black/90 transition-all duration-300 shadow-lg ${
            showRightArrow ? "opacity-100" : "opacity-0 pointer-events-none"
          } hidden md:flex`}
        >
          <ChevronRight className="h-6 w-6" />
        </button>

        {/* Movie cards container */}
        <div
          ref={scrollerRef}
          className="flex gap-3 overflow-x-auto scroll-smooth no-scrollbar px-4 sm:px-8 lg:px-12"
          style={{
            scrollbarWidth: "none",
            msOverflowStyle: "none",
            width: "100%",
          }}
        >
          {displayMovies.map((m, idx) => (
            <MovieCard
              key={`${m.id}-${idx}`}
              movie={m}
              index={idx}
              onPlay={handlePlay}
              onOpenDetails={openDetails}
            />
          ))}
        </div>
      </div>

      {current?.trailer ? (
        <Player
          open={open}
          onOpenChange={setOpen}
          title={current.title}
          src={current.trailer}
          poster={current.backdrop}
        />
      ) : null}

      {/* Details/Buy dialog */}
      <Dialog open={detailsOpen} onOpenChange={setDetailsOpen}>
        <DialogContent className="max-w-3xl bg-neutral-950 text-white ring-1 ring-white/10">
          <DialogTitle className="sr-only">{current?.title}</DialogTitle>
          {current ? (
            <div className="grid md:grid-cols-2 gap-4">
              <div className="relative aspect-video rounded overflow-hidden ring-1 ring-white/10">
                {current.trailer ? (
                  <video
                    src={current.trailer}
                    poster={current.poster || current.backdrop}
                    controls
                    playsInline
                    preload="auto"
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <img
                    src={current.poster || current.backdrop}
                    className="h-full w-full object-cover"
                    alt={current.title}
                  />
                )}
              </div>
              <div className="space-y-3">
                <h3 className="text-xl font-bold">{current.title}</h3>
                <div className="text-sm text-white/70 line-clamp-6">
                  {current.overview}
                </div>
                <div className="text-xs text-white/50">
                  {current.year ? `${current.year} • ` : ""}
                  {current.duration ? `${current.duration} • ` : ""}
                  {current.genres?.join(", ")}
                </div>
                <div className="flex items-center gap-3 pt-2">
                  <Button
                    onClick={() => {
                      setDetailsOpen(false);
                      setOpen(true);
                    }}
                    className="bg-white text-black hover:bg-white/90"
                  >
                    Watch bigger
                  </Button>
                  <Link
                    to={`/pay/${encodeURIComponent(current.id)}`}
                    className="inline-flex items-center rounded bg-primary px-4 py-2 font-semibold"
                  >
                    Buy • ₦500
                  </Link>
                </div>
              </div>
            </div>
          ) : null}
        </DialogContent>
      </Dialog>
    </section>
  );
}
