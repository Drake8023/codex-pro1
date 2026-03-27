import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { getNotifications, markNotificationRead } from "../api";

export function useNotifications(enabled: boolean) {
  return useQuery({ queryKey: ["notifications"], queryFn: getNotifications, enabled });
}

export function useMarkNotificationRead() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: markNotificationRead,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notifications"] });
    },
  });
}
