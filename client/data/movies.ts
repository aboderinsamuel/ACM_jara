export type Movie = {
  id: string;
  title: string;
  overview: string;
  year?: number;
  rating?: string;
  duration?: string;
  poster: string; // portrait
  backdrop: string; // landscape
  genres?: string[];
  trailer?: string; // local video path like /trailers/<id>.mp4
};

const u = (id: string, w = 1200) =>
  `https://images.unsplash.com/${id}?auto=format&fit=crop&w=${w}&q=80`;

// Placeholder poster for all movie cards
const placeholderPoster = "/moviePosters/image1.webp";

export const featured: Movie = {
  id: "ftd-1",
  title: "30 Days in Atlanta",
  overview:
    "When Akpos manages to bag a prize that includes a thirty-day trip to the American city of Atlanta, he decides to take his cousin along. Hilarity soon follows suit.",
  year: 2025,
  rating: "PG-13",
  duration: "2h 06m",
  poster: u("photo-1512429330140-8a4240fcb711", 700),
  backdrop: u("photo-1524985069026-dd778a71c7b4", 1800),
  genres: ["Sci‑Fi", "Thriller", "Drama"],
};

export const rows: { title: string; movies: Movie[] }[] = [
  {
    title: "Trending Now",
    movies: [
      {
        id: "m1",
        title: "Crimson Tide",
        overview:
          "Rival captains clash aboard a submarine as a global crisis erupts above the waves.",
        poster: placeholderPoster,
        backdrop: u("photo-1521305916504-4a1121188589", 1400),
        year: 2024,
        rating: "PG-13",
        duration: "1h 58m",
        genres: ["Thriller", "Action"],
      },
      {
        id: "m2",
        title: "Neon Nights",
        overview:
          "A fixer with nothing left to lose dives into the underbelly of a city that never sleeps.",
        poster: placeholderPoster,
        backdrop: u("photo-1517604931442-7e88f9a7f7fa", 1400),
        year: 2023,
        rating: "R",
        duration: "2h 12m",
        genres: ["Crime", "Noir"],
      },
      {
        id: "m3",
        title: "Echoes",
        overview:
          "Two timelines collide when a cold case is reopened by a rookie detective.",
        poster: placeholderPoster,
        backdrop: u("photo-1512429330140-8a4240fcb711", 1400),
        year: 2022,
        rating: "PG-13",
        duration: "1h 49m",
        genres: ["Mystery", "Drama"],
      },
      {
        id: "m4",
        title: "Afterlight",
        overview:
          "A crew of salvagers discover a signal from a ship lost decades ago—still broadcasting.",
        poster: placeholderPoster,
        backdrop: u("photo-1524985069026-dd778a71c7b4", 1400),
        year: 2021,
        rating: "PG-13",
        duration: "2h 04m",
        genres: ["Sci‑Fi", "Adventure"],
      },
      {
        id: "m5",
        title: "Wild Card",
        overview:
          "A master card mechanic is forced into one last game when his past resurfaces.",
        poster: placeholderPoster,
        backdrop: u("photo-1521305916504-4a1121188589", 1400),
        year: 2020,
        rating: "PG-13",
        duration: "1h 41m",
        genres: ["Drama", "Thriller"],
      },
    ],
  },
  {
    title: "Top Picks for You",
    movies: [
      {
        id: "m6",
        title: "Skybound",
        overview:
          "An ex-aviator haunted by tragedy must pilot a daring rescue above a raging wildfire.",
        poster: placeholderPoster,
        backdrop: u("photo-1512429330140-8a4240fcb711", 1400),
        year: 2023,
        rating: "PG-13",
        duration: "1h 56m",
        genres: ["Action", "Drama"],
      },
      {
        id: "m7",
        title: "Silent Harbor",
        overview:
          "On a remote island, a sound engineer discovers a frequency that drives people mad.",
        poster: placeholderPoster,
        backdrop: u("photo-1520931737571-8ae8d49f92d2", 1400),
        year: 2022,
        rating: "R",
        duration: "1h 43m",
        genres: ["Horror", "Mystery"],
      },
      {
        id: "m8",
        title: "Paper Crown",
        overview:
          "A disgraced journalist follows a story that could topple a kingdom built on lies.",
        poster: placeholderPoster,
        backdrop: u("photo-1478720568477-152d9b164e26", 1400),
        year: 2024,
        rating: "PG",
        duration: "2h 10m",
        genres: ["Drama", "Political"],
      },
      {
        id: "m9",
        title: "Iron Shore",
        overview:
          "A retired diver returns to the depths for a mission that may cost him everything.",
        poster: placeholderPoster,
        backdrop: u("photo-1524985069026-dd778a71c7b4", 1400),
        year: 2021,
        rating: "PG-13",
        duration: "1h 52m",
        genres: ["Adventure", "Thriller"],
      },
      {
        id: "m10",
        title: "Small Hours",
        overview:
          "A night-shift paramedic navigates a city teetering on the edge of blackout.",
        poster: placeholderPoster,
        backdrop: u("photo-1517604931442-7e88f9a7f7fa", 1400),
        year: 2020,
        rating: "PG-13",
        duration: "1h 38m",
        genres: ["Drama"],
      },
    ],
  },
  {
    title: "New & Popular",
    movies: [
      {
        id: "m11",
        title: "Starless",
        overview:
          "An astronomer vanishes after predicting a cosmic event no one else can see.",
        poster: placeholderPoster,
        backdrop: u("photo-1524984701171-999e1aa8e3d8", 1400),
        year: 2025,
        rating: "PG-13",
        duration: "2h 15m",
        genres: ["Sci‑Fi"],
      },
      {
        id: "m12",
        title: "Run Riot",
        overview:
          "A courier and a coder team up to outrun a syndicate controlling the grid.",
        poster: placeholderPoster,
        backdrop: u("photo-1521120098171-1f7f6b63f0e3", 1400),
        year: 2024,
        rating: "PG-13",
        duration: "1h 47m",
        genres: ["Action"],
      },
      {
        id: "m13",
        title: "The Long Drift",
        overview:
          "Adrift in the Pacific, four strangers discover their lives are bound by a single choice.",
        poster: placeholderPoster,
        backdrop: u("photo-1505682634904-d7c83d64034b", 1400),
        year: 2023,
        rating: "PG",
        duration: "2h 03m",
        genres: ["Drama"],
      },
      {
        id: "m14",
        title: "Cipher",
        overview:
          "A cryptographer races to decode a message that could avert a global catastrophe.",
        poster: placeholderPoster,
        backdrop: u("photo-1478720568477-152d9b164e26", 1400),
        year: 2022,
        rating: "PG-13",
        duration: "1h 59m",
        genres: ["Thriller"],
      },
      {
        id: "m15",
        title: "Rain City",
        overview:
          "A washed-up detective is dragged back into a case that drowned his career.",
        poster: placeholderPoster,
        backdrop: u("photo-1517604931442-7e88f9a7f7fa", 1400),
        year: 2021,
        rating: "R",
        duration: "1h 44m",
        genres: ["Crime", "Drama"],
      },
    ],
  },
  {
    title: "Because you watched Sci‑Fi",
    movies: [
      {
        id: "m16",
        title: "Signal Fire",
        overview:
          "A deep-space relay erupts, sending garbled warnings from a colony gone dark.",
        poster: placeholderPoster,
        backdrop: u("photo-1524984701171-999e1aa8e3d8", 1400),
        year: 2020,
        rating: "PG-13",
        duration: "2h 01m",
        genres: ["Sci‑Fi", "Mystery"],
      },
      {
        id: "m17",
        title: "Overclock",
        overview:
          "A prodigy hacker discovers a backdoor that rewrites more than code.",
        poster: placeholderPoster,
        backdrop: u("photo-1521305916504-4a1121188589", 1400),
        year: 2022,
        rating: "PG-13",
        duration: "1h 36m",
        genres: ["Sci‑Fi", "Thriller"],
      },
      {
        id: "m18",
        title: "Eventide",
        overview:
          "A small town experiences time at different speeds after a failed experiment.",
        poster: placeholderPoster,
        backdrop: u("photo-1520931737571-8ae8d49f92d2", 1400),
        year: 2021,
        rating: "PG",
        duration: "1h 50m",
        genres: ["Drama", "Sci‑Fi"],
      },
      {
        id: "m19",
        title: "Null Zone",
        overview:
          "An astronaut awakens on an empty station where the AI refuses to let her leave.",
        poster: placeholderPoster,
        backdrop: u("photo-1521305916504-4a1121188589", 1400),
        year: 2023,
        rating: "PG-13",
        duration: "1h 57m",
        genres: ["Sci‑Fi"],
      },
      {
        id: "m20",
        title: "The Last Broadcast",
        overview:
          "A radio host receives transmissions from a future that begs to be avoided.",
        poster: placeholderPoster,
        backdrop: u("photo-1524984701171-999e1aa8e3d8", 1400),
        year: 2020,
        rating: "PG",
        duration: "1h 42m",
        genres: ["Mystery", "Sci‑Fi"],
      },
    ],
  },
];
