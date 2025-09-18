import { featured, type Movie } from "@/data/movies";
import { Button } from "@/components/ui/button";
import { Info, Play } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

export default function Banner() {
  const m: Movie = featured;
  return (
    <section className="relative aspect-[16/9] w-full">
      <img
        src={m.backdrop}
        alt={m.title}
        className="absolute inset-0 h-full w-full object-cover"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-black/10" />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-8 h-full flex items-end pb-16">
        <div className="max-w-2xl">
          <h1 className="text-4xl sm:text-5xl font-extrabold drop-shadow-[0_2px_10px_rgba(0,0,0,0.6)]">
            {m.title}
          </h1>
          <p className="mt-3 text-white/80">{m.overview}</p>
          <div className="mt-6 flex flex-wrap gap-3">
            <Button
              variant="secondary"
              className="bg-white text-black hover:bg-white/90"
            >
              <Play className="mr-2" /> Play
            </Button>
            <Dialog>
              <DialogTrigger asChild>
                <Button
                  variant="ghost"
                  className="bg-white/10 hover:bg-white/20 text-white"
                >
                  <Info className="mr-2" /> More Info
                </Button>
              </DialogTrigger>
              <DialogContent className="bg-neutral-950 text-white border-white/10">
                <DialogHeader>
                  <DialogTitle className="text-xl">{m.title}</DialogTitle>
                  <DialogDescription className="text-white/70">
                    {m.year} • {m.rating} • {m.duration}
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-3">
                  <img
                    src={m.backdrop}
                    alt="Backdrop"
                    className="w-full rounded"
                  />
                  <p className="text-white/80">{m.overview}</p>
                  {m.genres?.length ? (
                    <p className="text-white/60">
                      Genres: {m.genres.join(", ")}
                    </p>
                  ) : null}
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </div>
      </div>
    </section>
  );
}
