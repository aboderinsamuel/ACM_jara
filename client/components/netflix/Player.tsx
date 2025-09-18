import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogClose,
} from "@/components/ui/dialog";
import { X } from "lucide-react";

export interface PlayerProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  src: string;
  poster?: string;
}

export default function Player({
  open,
  onOpenChange,
  title,
  src,
  poster,
}: PlayerProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="left-0 top-0 translate-x-0 translate-y-0 w-screen h-screen max-w-none p-0 bg-black border-0 rounded-none">
        <DialogTitle className="sr-only">{title}</DialogTitle>
        <DialogClose asChild>
          <button
            aria-label="Close"
            className="absolute right-4 top-4 z-10 inline-flex h-10 w-10 items-center justify-center rounded-full bg-black/70 text-white ring-1 ring-white/20 hover:bg-black/80"
          >
            <X className="h-5 w-5" />
          </button>
        </DialogClose>
        <div className="relative w-full h-full bg-black">
          <video
            src={src}
            poster={poster}
            controls
            autoPlay
            playsInline
            className="h-full w-full object-contain md:object-contain bg-black"
          />
          <div className="absolute bottom-14 sm:bottom-16 left-0 right-0 p-4 sm:p-6 bg-gradient-to-t from-black/60 via-black/10 to-transparent pointer-events-none">
            <h3 className="text-white text-base sm:text-lg font-semibold line-clamp-2">
              {title}
            </h3>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
