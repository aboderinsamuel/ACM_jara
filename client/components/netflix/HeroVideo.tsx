import { useEffect, useRef, useState } from "react";
import { featured } from "@/data/movies";
import { Button } from "@/components/ui/button";
import { Info, Play, Volume2, VolumeX } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

const TRAILER_MP4 = "/videos/trailer1.mp4";

import Player from "./Player";

export default function HeroVideo() {
  const [muted, setMuted] = useState(true);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [showPlayer, setShowPlayer] = useState(false);

  // Pause autoplay preview when player opens; resume when closed
  useEffect(() => {
    const v = videoRef.current;
    if (!v) return;
    if (showPlayer) {
      try {
        v.pause();
      } catch {}
    } else {
      try {
        v.play();
      } catch {}
    }
  }, [showPlayer]);

  useEffect(() => {
    if (!TRAILER_MP4) return;
    const v = videoRef.current;
    if (!v) return;
    v.muted = muted;
    const play = async () => {
      try {
        await v.play();
      } catch {
        /* autoplay may require gesture on some browsers */
      }
    };
    play();
  }, [muted]);

  return (
    <section className="relative w-full h-[55vh] sm:h-[60vh] md:h-[70vh] min-h-[360px] max-h-[80vh] overflow-hidden">
      <div className="absolute inset-0">
        <video
          ref={videoRef}
          className="h-full w-full object-cover object-center bg-black"
          src={TRAILER_MP4}
          poster={featured.backdrop}
          autoPlay
          muted
          loop
          playsInline
          preload="auto"
        />
      </div>
      <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-black/10" />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-8 h-full flex items-end pb-8 sm:pb-12 md:pb-16">
        <div className="max-w-2xl">
          <h1 className="text-2xl sm:text-4xl md:text-5xl font-extrabold drop-shadow-[0_2px_10px_rgba(0,0,0,0.6)]">
            {featured.title}
          </h1>
          <p className="mt-3 text-white/80 hidden sm:block md:line-clamp-3">
            {featured.overview}
          </p>
          <div className="mt-6 flex flex-wrap gap-3 items-center">
            <Button
              variant="secondary"
              className="bg-white text-black hover:bg-white/90"
              onClick={() => setShowPlayer(true)}
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
                  <DialogTitle className="text-xl">
                    {featured.title}
                  </DialogTitle>
                  <DialogDescription className="text-white/70">
                    {featured.year} • {featured.rating} • {featured.duration}
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-3">
                  <img
                    src={featured.backdrop}
                    alt="Backdrop"
                    className="w-full rounded"
                  />
                  <p className="text-white/80">{featured.overview}</p>
                </div>
              </DialogContent>
            </Dialog>
            <button
              aria-label={muted ? "Unmute trailer" : "Mute trailer"}
              onClick={() => setMuted((m) => !m)}
              className="ml-2 inline-flex items-center justify-center rounded-full bg-black/60 text-white h-10 w-10 ring-1 ring-white/20 hover:bg-black/80"
            >
              {muted ? (
                <VolumeX className="h-5 w-5" />
              ) : (
                <Volume2 className="h-5 w-5" />
              )}
            </button>
          </div>
        </div>
      </div>
      {TRAILER_MP4 ? (
        <Player
          open={showPlayer}
          onOpenChange={setShowPlayer}
          title={featured.title}
          src={TRAILER_MP4}
          poster={featured.backdrop}
        />
      ) : null}
    </section>
  );
}
