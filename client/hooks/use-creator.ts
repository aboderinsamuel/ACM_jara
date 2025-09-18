import { useEffect, useState } from "react";
import { api } from "@/lib/api";

export function useCreator() {
  const [creator, setCreator] = useState<any | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        setIsLoading(true);
        const res = await api.getCurrentCreator();
        if (!mounted) return;
        setCreator(res.creator);
      } catch (e: any) {
        if (!mounted) return;
        setError(e?.message || "Failed to load creator");
        setCreator(null);
      } finally {
        if (mounted) setIsLoading(false);
      }
    })();
    return () => {
      mounted = false;
    };
  }, []);

  return { creator, isLoading, error } as const;
}
