import { useEffect, useState } from "react";
import Placeholder from "@/components/common/Placeholder";
import { apiAuth, ApiError } from "@shared/api";

type SubscriptionItem = {
  id: string;
  movieId: string;
  title?: string;
  poster?: string;
  purchasedAt?: string;
};

export default function Subscriptions() {
  const [items, setItems] = useState<SubscriptionItem[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        // Allow backend path override
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const path =
          (import.meta as any).env?.VITE_SUBSCRIPTIONS_PATH || "/subscriptions";
        const res = await apiAuth<SubscriptionItem[]>(path);
        if (!mounted) return;
        setItems(res);
      } catch (e: any) {
        if (!mounted) return;
        if (e instanceof ApiError && e.status === 404) {
          setItems([]);
          setError(null);
        } else {
          setError(e?.message || "Failed to load subscriptions");
        }
      } finally {
        if (mounted) setLoading(false);
      }
    })();
    return () => {
      mounted = false;
    };
  }, []);

  return (
    <Placeholder title="Subscriptions" description="Movies you have purchased.">
      {loading ? (
        <div className="text-white/70">Loading…</div>
      ) : error ? (
        <div className="text-red-400">{error}</div>
      ) : !items || items.length === 0 ? (
        <div className="rounded bg-white/5 p-4 ring-1 ring-white/10">
          No purchases yet.
        </div>
      ) : (
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {items.map((it) => (
            <div
              key={it.id}
              className="rounded-lg overflow-hidden ring-1 ring-white/10 bg-white/5"
            >
              {it.poster ? (
                <img src={it.poster} className="w-full h-40 object-cover" />
              ) : (
                <div className="w-full h-40 bg-white/10" />
              )}
              <div className="p-3">
                <div className="font-semibold truncate">
                  {it.title || it.movieId}
                </div>
                {it.purchasedAt ? (
                  <div className="text-xs text-white/60 mt-1">
                    Purchased {new Date(it.purchasedAt).toLocaleDateString()}
                  </div>
                ) : null}
              </div>
            </div>
          ))}
        </div>
      )}
    </Placeholder>
  );
}
