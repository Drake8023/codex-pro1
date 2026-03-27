import { apiRequest } from "../../shared/api/client";

export function getModeState() {
  return apiRequest<{ longingCount?: number; zenHits?: number }>("/api/modes/state");
}

export function tapLonging() {
  return apiRequest<{ longingCount?: number }>("/api/modes/longing", { method: "POST" });
}

export function tapZen() {
  return apiRequest<{ zenHits?: number }>("/api/modes/zen", { method: "POST" });
}
