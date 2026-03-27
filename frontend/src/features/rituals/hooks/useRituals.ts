import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { getModeState, tapLonging, tapZen } from "../api";

export function useRitualState() {
  return useQuery({ queryKey: ["ritual-state"], queryFn: getModeState });
}

export function useTapLonging() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: tapLonging,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["ritual-state"] }),
  });
}

export function useTapZen() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: tapZen,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["ritual-state"] }),
  });
}
