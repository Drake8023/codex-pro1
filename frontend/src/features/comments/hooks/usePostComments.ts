import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { createComment, getComments } from "../api";
import type { CommentPayload } from "../types";

export function usePostComments(postId: number, enabled: boolean) {
  return useQuery({
    queryKey: ["comments", postId],
    queryFn: () => getComments(postId),
    enabled,
  });
}

export function useCreateComment(postId: number) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: CommentPayload) => createComment(postId, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["comments", postId] });
      queryClient.invalidateQueries({ queryKey: ["posts"] });
      queryClient.invalidateQueries({ queryKey: ["notifications"] });
    },
  });
}
