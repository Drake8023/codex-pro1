import { useQuery } from "@tanstack/react-query";
import { apiRequest } from "../api/client";

type HealthState = { status: "success" | "error"; message: string };

export function useHealth() {
  const query = useQuery({
    queryKey: ["health"],
    queryFn: () => apiRequest<{ status?: string }>("/api/health"),
  });

  if (query.isError) return { status: "error" as const, message: "API unavailable" } satisfies HealthState;
  return { status: "success" as const, message: `API ${query.data?.status ?? "ok"}` } satisfies HealthState;
}
