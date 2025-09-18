import { useRef, useState, useEffect } from "react";
import type { Movie } from "@/data/movies";
import { ChevronLeft, ChevronRight, CirclePlus, Play } from "lucide-react";
import { Button } from "@/components/ui/button";

function MovieCard({
  movie,
  onPlay,
}: {
  movie: Movie;
  onPlay: (m: Movie) => void;
}) {
  return (
    <div className="group relative aspect-[2/3] w-32 sm:w-36 md:w-40 lg:w-44 shrink-0 rounded overflow-hidden transition-transform duration-300 hover:scale-105 hover:z-10">
      <img
        src={movie.poster}
        alt={movie.title}
        className="h-full w-full object-cover"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      <div className="absolute inset-x-2 bottom-2 flex items-center justify-between opacity-0 group-hover:opacity-100 transition-opacity duration-300">
        <div className="flex gap-1.5">
          <Button
            size="icon"
            className="h-8 w-8 bg-white text-black hover:bg-white/90 shadow-lg"
            onClick={() => onPlay(movie)}
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
  const [showLeftArrow, setShowLeftArrow] = useState(false);
  const [showRightArrow, setShowRightArrow] = useState(true);

  const handlePlay = (m: Movie) => {
    if (!m.trailer) {
      toast.error("No video available for this title yet.");
      return;
    }
    setCurrent(m);
    setOpen(true);
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

  const scroll = (dir: -1 | 1) => () => {
    const el = scrollerRef.current;
    if (!el) return;

    // Calculate scroll amount based on card width + gap
    const cardWidth = 144; // w-36 = 144px
    const gap = 12; // gap-3 = 12px
    const scrollAmount = (cardWidth + gap) * 4 * dir; // Scroll 4 cards at a time

    el.scrollBy({ left: scrollAmount, behavior: "smooth" });
  };

  return (
    <section className="relative mb-8">
      <div className="px-4 sm:px-8 lg:px-12">
        <h2 className="mb-4 text-lg sm:text-xl font-semibold text-white">
          {title}
        </h2>
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
            className="flex gap-3 overflow-x-auto scroll-smooth no-scrollbar"
            style={{
              scrollbarWidth: "none",
              msOverflowStyle: "none",
              width: "100%",
            }}
          >
            {movies.map((m) => (
              <MovieCard key={m.id} movie={m} onPlay={handlePlay} />
            ))}
          </div>
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
    </section>
  );
}
