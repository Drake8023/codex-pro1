import type { User } from "../auth/types";

export type NotificationItem = {
  id: number;
  kind: "like" | "comment" | "reply";
  isRead: boolean;
  createdAt: string;
  body: string;
  actor: User;
  postId: number;
  commentId: number | null;
};
