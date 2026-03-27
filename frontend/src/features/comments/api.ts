import { apiRequest } from "../../shared/api/client";
import type { CommentPayload, PostComment } from "./types";

export function getComments(postId: number) {
  return apiRequest<{ comments: PostComment[] }>(`/api/posts/${postId}/comments`);
}

export function createComment(postId: number, payload: CommentPayload) {
  return apiRequest<{ comment: PostComment; commentCount: number }>(`/api/posts/${postId}/comments`, { method: "POST", body: JSON.stringify(payload) });
}
