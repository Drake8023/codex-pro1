import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { createPost, getPosts, toggleLike } from "../api";

export function usePosts() {
  return useQuery({ queryKey: ["posts"], queryFn: getPosts });
}

export function useCreatePost() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createPost,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["posts"] });
      queryClient.invalidateQueries({ queryKey: ["notifications"] });
    },
  });
}

export function useToggleLike() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: toggleLike,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["posts"] });
      queryClient.invalidateQueries({ queryKey: ["notifications"] });
    },
  });
}
