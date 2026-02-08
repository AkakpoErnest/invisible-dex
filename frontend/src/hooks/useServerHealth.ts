import { useEffect, useState } from "react";
import { apiBase } from "../services/api";

type Health = {
  yellow?: { connected?: boolean };
  sui?: { connected?: boolean; network?: string };
};

export function useServerHealth() {
  const apiUrl = apiBase(import.meta.env.VITE_API_URL ?? "/api");
  const baseUrl = apiUrl.endsWith("/api") ? apiUrl.slice(0, -4) : apiUrl;
  const [health, setHealth] = useState<Health | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    fetch(`${baseUrl}/health`)
      .then((res) => (res.ok ? res.json() : Promise.reject(new Error("Health check failed"))))
      .then((data) => {
        if (!cancelled) setHealth(data as Health);
      })
      .catch((err) => {
        if (!cancelled) setError(err instanceof Error ? err.message : "Health check failed");
      });

    return () => {
      cancelled = true;
    };
  }, [baseUrl]);

  return {
    health,
    yellowConnected: Boolean(health?.yellow?.connected),
    error,
  };
}
