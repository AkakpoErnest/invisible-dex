import { useQuery } from "@tanstack/react-query";

const apiUrl = typeof import.meta !== "undefined" && import.meta.env?.VITE_API_URL ? import.meta.env.VITE_API_URL : "/api";

export function useMarkets() {
  return useQuery({
    queryKey: ["markets"],
    queryFn: async () => {
      const res = await fetch(`${apiUrl}/markets`);
      if (!res.ok) throw new Error(await res.text());
      return res.json();
    },
  });
}
