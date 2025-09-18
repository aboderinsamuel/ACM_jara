import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { cn } from "@/lib/utils";
import { Search, Bell, Menu, User } from "lucide-react";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { featured, rows } from "@/data/movies";

export default function SiteHeader() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
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
                <Link
                  to="/dashboard"
                  onClick={() => setMenuOpen(false)}
                  className="px-2 py-2 rounded hover:bg-white/5"
                >
                  Dashboard
                </Link>
                <Link
                  to="/pages"
                  onClick={() => setMenuOpen(false)}
                  className="px-2 py-2 rounded hover:bg-white/5"
                >
                  Pages
                </Link>
                <Link
                  to="/payment-links"
                  onClick={() => setMenuOpen(false)}
                  className="px-2 py-2 rounded hover:bg-white/5"
                >
                  Payment Links
                </Link>
                <Link
                  to="/ai"
                  onClick={() => setMenuOpen(false)}
                  className="px-2 py-2 rounded hover:bg-white/5"
                >
                  AI
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
        <Link to="/" className="flex items-center gap-2 shrink-0">
          <span className="inline-block h-6 w-6 bg-primary rotate-12" />
          <span className="font-extrabold tracking-wider text-white text-lg hidden sm:inline">
            JARA
          </span>
        </Link>
        <nav className="hidden md:flex items-center gap-4 text-sm text-white/80">
          <Link to="/" className="hover:text-white transition-colors">
            Home
          </Link>
          <Link to="/dashboard" className="hover:text-white transition-colors">
            Dashboard
          </Link>
          <Link to="/pages" className="hover:text-white transition-colors">
            Pages
          </Link>
          <Link
            to="/payment-links"
            className="hover:text-white transition-colors"
          >
            Payment Links
          </Link>
          <Link to="/ai" className="hover:text-white transition-colors">
            AI
          </Link>
        </nav>
        <div className="ml-auto flex items-center gap-4">
          <button
            aria-label="Search"
            className="text-white/80 hover:text-white"
          >
            <Search className="h-5 w-5" />
          </button>
          <button
            aria-label="Notifications"
            className="text-white/80 hover:text-white"
          >
            <Bell className="h-5 w-5" />
          </button>
          <div className="h-8 w-8 rounded bg-white/10 ring-1 ring-white/20 flex items-center justify-center text-white text-xs">
            SA
          </div>
        </div>
      </div>
    </header>
  );
}
