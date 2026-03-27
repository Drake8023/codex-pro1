import { apiRequest } from "../../shared/api/client";
import type { PostItem } from "./types";

export function getPosts() {
  return apiRequest<{ posts: PostItem[] }>("/api/posts");
}

export function createPost(payload: { content: string; imageUrls: string[] }) {
  return apiRequest<{ post: PostItem }>("/api/posts", { method: "POST", body: JSON.stringify(payload) });
}

export function toggleLike(postId: number) {
  return apiRequest<{ likeCount: number; likedByMe: boolean }>(`/api/posts/${postId}/likes/toggle`, { method: "POST" });
}
