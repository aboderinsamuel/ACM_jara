import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { cn } from "@/lib/utils";
import {
  Search,
  Bell,
  Menu,
  User,
  CheckCircle2,
  Ticket,
  Sparkles,
} from "lucide-react";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { featured, rows } from "@/data/movies";
import { useAuth } from "@/hooks/use-auth";

export default function SiteHeader() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const { user, signOut } = useAuth();
  const [avatarSrc, setAvatarSrc] = useState<string>(
    "/ProfilePic/Netflix%20Profile%20Meme.jpg",
  );
  const [creatorType, setCreatorType] = useState<string | null>(null);
  const [searchOpen, setSearchOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    // Read survey preference to decide nav links
    try {
      const raw = localStorage.getItem("experience_survey");
      if (raw) {
        const parsed = JSON.parse(raw);
        setCreatorType(parsed?.creatorType || null);
      }
    } catch {
      // ignore
    }
  }, []);

  useEffect(() => {
    // Load custom profile picture if present in creator_profile
    try {
      const raw = localStorage.getItem("creator_profile");
      if (raw) {
        const parsed = JSON.parse(raw);
        if (parsed?.image && typeof parsed.image === "string") {
          setAvatarSrc(parsed.image);
        }
      }
    } catch {
      // ignore
    }
  }, []);

  useEffect(() => {
    if (menuOpen) {
      const prev = document.body.style.overflow;
      document.body.style.overflow = "hidden";
      return () => {
        document.body.style.overflow = prev;
      };
    }
  }, [menuOpen]);

  return (
    <header
      className={cn(
        "fixed inset-x-0 top-0 z-40 transition-colors",
        scrolled
          ? "bg-black/80 backdrop-blur supports-[backdrop-filter]:bg-black/60"
          : "bg-gradient-to-b from-black/70 to-transparent",
      )}
    >
      <div className="px-4 sm:px-8 max-w-7xl mx-auto h-16 flex items-center gap-6">
        <Sheet open={menuOpen} onOpenChange={setMenuOpen}>
          <SheetTrigger asChild>
            <button
              aria-label="Open menu"
              className="text-white/80 hover:text-white"
            >
              <Menu className="h-6 w-6" />
            </button>
          </SheetTrigger>
          <SheetContent
            side="left"
            className="w-80 sm:w-96 p-0 bg-neutral-950 text-white border-white/10 overflow-y-auto overscroll-contain"
          >
            <div className="p-4 border-b border-white/10">
              <Command>
                <CommandInput placeholder="Search movies..." />
                <CommandList className="max-h-[50vh]">
                  <CommandEmpty>No results found.</CommandEmpty>
                  <CommandGroup heading="Movies">
                    {[featured, ...rows.flatMap((r) => r.movies)].map((m) => (
                      <CommandItem key={m.id} value={m.title} className="gap-2">
                        <img
                          src={m.poster}
                          alt=""
                          className="h-8 w-6 object-cover rounded"
                        />
                        <span className="truncate">{m.title}</span>
                        {m.year ? (
                          <span className="ml-auto text-white/50 text-xs">
                            {m.year}
                          </span>
                        ) : null}
                      </CommandItem>
                    ))}
                  </CommandGroup>
                </CommandList>
              </Command>
            </div>
            <div className="p-4 border-b border-white/10 space-y-2">
              <div className="text-xs uppercase tracking-wide text-white/60">
                Navigation
              </div>
              <nav className="grid">
                <Link
                  to="/"
                  onClick={() => setMenuOpen(false)}
                  className="px-2 py-2 rounded hover:bg-white/5"
                >
                  Home
                </Link>
                {/* Always show Movies; show Upload Video when producer */}
                <Link
                  to="/movies"
                  onClick={() => setMenuOpen(false)}
                  className="px-2 py-2 rounded hover:bg-white/5"
                >
                  Movies
                </Link>
                {creatorType === "producer" ? (
                  <Link
                    to="/videos/upload"
                    onClick={() => setMenuOpen(false)}
                    className="px-2 py-2 rounded hover:bg-white/5"
                  >
                    Upload Video
                  </Link>
                ) : null}
                <Link
                  to="/payments"
                  onClick={() => setMenuOpen(false)}
                  className="px-2 py-2 rounded hover:bg-white/5"
                >
                  Payment
                </Link>
                <Link
                  to="/subscriptions"
                  onClick={() => setMenuOpen(false)}
                  className="px-2 py-2 rounded hover:bg-white/5"
                >
                  Subscriptions
                </Link>
                <Link
                  to="/ai"
                  onClick={() => setMenuOpen(false)}
                  className="px-2 py-2 rounded hover:bg-white/5"
                >
                  AI
                </Link>
                <Link
                  to="/u/demo"
                  onClick={() => setMenuOpen(false)}
                  className="px-2 py-2 rounded hover:bg-white/5"
                >
                  Demo Creator
                </Link>
              </nav>
            </div>
            <div className="p-4 space-y-3">
              <div className="text-xs uppercase tracking-wide text-white/60">
                Accounts
              </div>
              <div className="flex items-center gap-3">
                <div className="h-8 w-8 rounded bg-white/10 ring-1 ring-white/20 grid place-items-center">
                  <User className="h-4 w-4" />
                </div>
                <div>
                  <div className="text-sm">Samuel</div>
                  <div className="text-white/50 text-xs">Owner</div>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="h-8 w-8 rounded bg-white/10 ring-1 ring-white/20 grid place-items-center">
                  <User className="h-4 w-4" />
                </div>
                <div>
                  <div className="text-sm">Kids</div>
                  <div className="text-white/50 text-xs">Profile</div>
                </div>
              </div>
            </div>
          </SheetContent>
        </Sheet>
        <Link
          to={user ? "/home" : "/"}
          className="flex items-center gap-2 shrink-0"
        >
          <span className="inline-block h-6 w-6 bg-primary rotate-12" />
          <span className="font-extrabold tracking-wider text-white text-lg hidden sm:inline">
            JARA
          </span>
        </Link>
        <nav className="hidden md:flex items-center gap-4 text-sm text-white/80">
          <Link
            to={user ? "/home" : "/"}
            className="hover:text-white transition-colors"
          >
            Home
          </Link>
          <Link to="/movies" className="hover:text-white transition-colors">
            Movies
          </Link>
          {creatorType === "producer" ? (
            <Link
              to="/videos/upload"
              className="hover:text-white transition-colors"
            >
              Upload Video
            </Link>
          ) : null}
          <Link to="/payments" className="hover:text-white transition-colors">
            Payment
          </Link>
          <Link
            to="/subscriptions"
            className="hover:text-white transition-colors"
          >
            Subscriptions
          </Link>
          <Link to="/dashboard" className="hover:text-white transition-colors">
            Dashboard
          </Link>
          <Link to="/u/demo" className="hover:text-white transition-colors">
            Demo Creator
          </Link>
        </nav>
        <div className="ml-auto flex items-center gap-4">
          <button
            aria-label="Search"
            className="text-white/80 hover:text-white"
            onClick={() => setSearchOpen(true)}
          >
            <Search className="h-5 w-5" />
          </button>
          <button
            aria-label="Notifications"
            className="text-white/80 hover:text-white"
            onClick={() => setNotificationsOpen(true)}
          >
            <Bell className="h-5 w-5" />
          </button>
          {user ? (
            <div className="flex items-center gap-3">
              <Link to="/settings" className="inline-flex items-center">
                <img
                  src={avatarSrc}
                  alt="Profile"
                  className="h-8 w-8 rounded object-cover ring-1 ring-white/20 hover:ring-white/40 transition"
                  onError={() =>
                    setAvatarSrc("/ProfilePic/Netflix%20Profile%20Meme.jpg")
                  }
                />
              </Link>
              <button
                onClick={() => signOut()}
                className="text-sm text-white/80 hover:text-white"
              >
                Sign out
              </button>
            </div>
          ) : (
            <Link
              to="/auth/login"
              className="text-sm text-white/80 hover:text-white"
            >
              Sign in
            </Link>
          )}
        </div>

        {/* Global Search dialog */}
        <Dialog open={searchOpen} onOpenChange={setSearchOpen}>
          <DialogContent className="sm:max-w-2xl p-0 overflow-hidden bg-neutral-950 text-white border-white/10">
            <DialogTitle className="sr-only">Search</DialogTitle>
            <div className="p-2 border-b border-white/10">
              <Command>
                <CommandInput placeholder="Search movies…" />
                <CommandList className="max-h-[60vh]">
                  <CommandEmpty>No results found.</CommandEmpty>
                  <CommandGroup heading="Movies">
                    {[featured, ...rows.flatMap((r) => r.movies)].map((m) => (
                      <Link
                        key={m.id}
                        to={`/pay/${encodeURIComponent(m.id)}`}
                        onClick={() => setSearchOpen(false)}
                        className="flex items-center gap-3 px-3 py-2 hover:bg-white/5"
                      >
                        <img
                          src={m.poster}
                          className="h-10 w-7 object-cover rounded"
                        />
                        <div className="min-w-0">
                          <div className="truncate font-medium">{m.title}</div>
                          <div className="text-xs text-white/60 truncate">
                            {(m.year ? `${m.year} • ` : "") +
                              (m.genres?.join(", ") || "")}
                          </div>
                        </div>
                      </Link>
                    ))}
                  </CommandGroup>
                </CommandList>
              </Command>
            </div>
          </DialogContent>
        </Dialog>

        {/* Notifications panel */}
        <Sheet open={notificationsOpen} onOpenChange={setNotificationsOpen}>
          <SheetContent
            side="right"
            className="w-[420px] max-w-[92vw] p-0 bg-neutral-950/95 text-white border-white/10 backdrop-blur-md"
          >
            <div className="relative p-4 border-b border-white/10">
              <div className="absolute inset-0 pointer-events-none [background:radial-gradient(600px_200px_at_100%_-20%,rgba(255,0,0,.15),transparent_60%)]" />
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Sparkles className="h-5 w-5 text-primary" />
                  <h3 className="font-semibold">Notifications</h3>
                </div>
                <button className="text-xs text-white/70 hover:text-white">
                  Mark all as read
                </button>
              </div>
            </div>
            <div className="p-3 space-y-3">
              <div className="rounded-lg bg-white/[0.04] ring-1 ring-white/10 p-3 hover:bg-white/[0.06] transition">
                <div className="flex items-start gap-3">
                  <Ticket className="h-5 w-5 text-primary shrink-0" />
                  <div className="min-w-0">
                    <div className="text-sm">
                      Special offer: Get 20% off your next rental.
                    </div>
                    <div className="text-xs text-white/60 mt-1">Just now</div>
                  </div>
                </div>
              </div>
              <div className="rounded-lg bg-white/[0.04] ring-1 ring-white/10 p-3 hover:bg-white/[0.06] transition">
                <div className="flex items-start gap-3">
                  <CheckCircle2 className="h-5 w-5 text-green-400 shrink-0" />
                  <div className="min-w-0">
                    <div className="text-sm">
                      Payment successful for “Crimson Tide”.
                    </div>
                    <div className="text-xs text-white/60 mt-1">2h ago</div>
                  </div>
                </div>
              </div>
              <div className="rounded-lg bg-white/[0.04] ring-1 ring-white/10 p-3 hover:bg-white/[0.06] transition">
                <div className="flex items-start gap-3">
                  <Sparkles className="h-5 w-5 text-fuchsia-400 shrink-0" />
                  <div className="min-w-0">
                    <div className="text-sm">
                      New recommendation: “Neon Nights”.
                    </div>
                    <div className="text-xs text-white/60 mt-1">Yesterday</div>
                  </div>
                </div>
              </div>
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </header>
  );
}
