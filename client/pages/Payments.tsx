import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Payments() {
  const [movieId, setMovieId] = useState("");
  const nav = useNavigate();

  const go = (e: React.FormEvent) => {
    e.preventDefault();
    if (!movieId.trim()) return;
    nav(`/pay/${encodeURIComponent(movieId.trim())}`);
  };

  return (
    <div className="px-4 sm:px-8 lg:px-12 py-10">
      <div className="max-w-md mx-auto bg-black/60 ring-1 ring-white/10 rounded-lg p-6">
        <h1 className="text-2xl font-bold">Payment</h1>
        <p className="text-white/70 mt-1">Pay for a movie by its ID.</p>
        <form onSubmit={go} className="mt-6 grid gap-3">
          <input
            value={movieId}
            onChange={(e) => setMovieId(e.target.value)}
            placeholder="Enter Movie ID"
            className="rounded bg-white/5 px-4 py-3 ring-1 ring-white/10"
          />
          <button className="rounded bg-primary px-5 py-3 font-semibold">
            Continue
          </button>
        </form>
      </div>
    </div>
  );
}
