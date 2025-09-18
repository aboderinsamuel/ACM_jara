import HeroVideo from "@/components/netflix/HeroVideo";
import Row from "@/components/netflix/Row";
import { rows } from "@/data/movies";

export default function Home() {
  return (
    <div className="bg-black text-white min-h-screen">
      <HeroVideo />
      {/* Netflix-style division between hero and content */}
      <div className="relative">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-black/30 to-black"></div>
        <div className="h-20"></div>
      </div>
      <div className="relative z-10">
        {rows.map((r) => (
          <Row key={r.title} title={r.title} movies={r.movies} />
        ))}
      </div>
    </div>
  );
}
