import {
  useEffect,
  useRef,
  useState,
  useEffect as ReactUseEffect,
} from "react";
import {
  getVideoUrls,
  listVideos,
  revokeUrls,
  saveVideo,
  type LocalVideoSummary,
} from "@shared/local-videos";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { Play } from "lucide-react";

export default function UploadVideo() {
  const videoRef = useRef<HTMLInputElement>(null);
  const imageRef = useRef<HTMLInputElement>(null);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [myVideos, setMyVideos] = useState<LocalVideoSummary[]>([]);
  const [previewId, setPreviewId] = useState<string | null>(null);
  const [previewUrls, setPreviewUrls] = useState<{
    videoUrl: string;
    imageUrl: string | null;
  } | null>(null);

  const refresh = async () => {
    const list = await listVideos();
    setMyVideos(list);
  };

  useEffect(() => {
    refresh();
  }, []);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      // Client-only validation for sizes
      const video = videoRef.current?.files?.[0];
      const image = imageRef.current?.files?.[0];
      if (!video) {
        alert("Please select a video file.");
        return;
      }
      if (video.size > 100 * 1024 * 1024) {
        alert("Video must be <= 100MB");
        return;
      }
      if (image && image.size > 5 * 1024 * 1024) {
        alert("Image must be <= 5MB");
        return;
      }
      await saveVideo({
        title,
        description,
        videoFile: video,
        imageFile: image || null,
      });
      await refresh();
      alert("Video saved locally (demo)");
      setTitle("");
      setDescription("");
      if (videoRef.current) videoRef.current.value = "";
      if (imageRef.current) imageRef.current.value = "";
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="px-4 sm:px-8 lg:px-12 py-10">
      <div className="max-w-7xl mx-auto grid gap-8 lg:grid-cols-12">
        {/* Left: Upload form */}
        <aside className="lg:col-span-4">
          <div className="sticky top-24 space-y-4">
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold">Upload Videos</h1>
              <p className="text-white/70 mt-1">
                Add new movies to your library. Files are stored locally for
                this demo.
              </p>
            </div>
            <form
              className="space-y-5 rounded-lg bg-white/[0.04] p-5 ring-1 ring-white/10"
              onSubmit={onSubmit}
            >
              <div>
                <label className="block text-sm text-white/80">
                  Video File *
                </label>
                <input
                  ref={videoRef}
                  type="file"
                  accept=".mp4,.mov,.avi,video/mp4,video/quicktime,video/x-msvideo"
                  className="mt-1 block w-full rounded border border-white/10 bg-black/50 p-2"
                />
                <div className="text-xs text-white/60 mt-1">
                  MP4, MOV, AVI up to 100MB
                </div>
              </div>
              <div>
                <label className="block text-sm text-white/80">
                  Cover Image (optional)
                </label>
                <input
                  ref={imageRef}
                  type="file"
                  accept=".jpg,.jpeg,.png,image/jpeg,image/png"
                  className="mt-1 block w-full rounded border border-white/10 bg-black/50 p-2"
                />
                <div className="text-xs text-white/60 mt-1">
                  JPG, PNG up to 5MB
                </div>
              </div>
              <div>
                <label className="block text-sm text-white/80">Title *</label>
                <input
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Enter video title"
                  className="mt-1 block w-full rounded border border-white/10 bg-black/50 p-2"
                  required
                />
              </div>
              <div>
                <label className="block text-sm text-white/80">
                  Description
                </label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Enter video description"
                  className="mt-1 block w-full min-h-28 rounded border border-white/10 bg-black/50 p-2"
                />
              </div>
              <button
                disabled={submitting}
                className="w-full rounded bg-primary px-5 py-2 font-semibold disabled:opacity-60"
                type="submit"
              >
                {submitting ? "Uploading…" : "Upload Video"}
              </button>
              <div className="text-xs text-white/60">
                Local-only demo: uploads stay on this device
              </div>
            </form>
          </div>
        </aside>

        {/* Right: Library grid */}
        <section className="lg:col-span-8">
          <div className="flex items-end justify-between">
            <div>
              <h2 className="text-xl font-semibold">My Library</h2>
              <div className="text-sm text-white/60">
                {myVideos.length} {myVideos.length === 1 ? "video" : "videos"}
              </div>
            </div>
          </div>
          {myVideos.length > 0 ? (
            <div className="mt-4 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
              {myVideos.map((v) => (
                <VideoCard
                  key={v.id}
                  v={v}
                  onOpen={async () => {
                    setPreviewId(v.id);
                    const urls = await getVideoUrls(v.id);
                    setPreviewUrls(urls);
                  }}
                />
              ))}
            </div>
          ) : (
            <div className="mt-6 text-white/60">
              No uploads yet. Add your first movie from the left panel.
            </div>
          )}
        </section>
      </div>
      <Dialog
        open={!!previewId}
        onOpenChange={(open) => {
          if (!open) {
            if (previewUrls) revokeUrls(previewUrls);
            setPreviewUrls(null);
            setPreviewId(null);
          }
        }}
      >
        <DialogContent className="max-w-3xl">
          <DialogTitle>Preview Upload</DialogTitle>
          {previewUrls ? (
            <div>
              <video
                src={previewUrls.videoUrl}
                className="mt-3 w-full rounded"
                controls
                preload="metadata"
              />
              <div className="mt-2 text-xs text-white/60">
                Local preview only (stored in this browser)
              </div>
            </div>
          ) : (
            <div className="text-white/60">Loading…</div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}

// Card component for library grid
function VideoCard({
  v,
  onOpen,
}: {
  v: LocalVideoSummary;
  onOpen: () => void | Promise<void>;
}) {
  const [thumbUrl, setThumbUrl] = useState<string | null>(null);

  // Try to resolve cover image URL only; immediately revoke video URL to avoid leaks
  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const urls = await getVideoUrls(v.id);
        if (cancelled) return;
        if (urls.imageUrl) setThumbUrl(urls.imageUrl);
        // Revoke video URL immediately; we'll fetch again when opening
        if (urls.videoUrl) URL.revokeObjectURL(urls.videoUrl);
      } catch {
        // ignore
      }
    })();
    return () => {
      cancelled = true;
      if (thumbUrl) URL.revokeObjectURL(thumbUrl);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [v.id]);

  return (
    <button
      onClick={onOpen}
      className="group overflow-hidden rounded-lg bg-white/[0.04] ring-1 ring-white/10 text-left hover:bg-white/[0.06] transition"
    >
      <div className="relative aspect-[16/9] w-full overflow-hidden">
        {thumbUrl ? (
          <img
            src={thumbUrl}
            alt="Cover"
            className="h-full w-full object-cover"
          />
        ) : (
          <div className="h-full w-full grid place-items-center bg-gradient-to-br from-white/10 to-white/5">
            <Play className="h-10 w-10 text-white/70" />
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
        <div className="absolute bottom-2 left-2 right-2 text-sm font-medium line-clamp-2">
          {v.title}
        </div>
      </div>
      <div className="p-3 text-xs text-white/60 flex items-center justify-between">
        <span>{new Date(v.createdAt).toLocaleDateString()}</span>
        <span>{(v.size / 1024 / 1024).toFixed(1)} MB</span>
      </div>
    </button>
  );
}
