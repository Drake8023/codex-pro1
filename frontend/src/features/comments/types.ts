import type { User } from "../auth/types";

export type PostComment = {
  id: number;
  content: string;
  createdAt: string;
  updatedAt: string;
  author: User;
  parentCommentId: number | null;
  replyToUser: User | null;
  replies: PostComment[];
};

export type CommentPayload = {
  content: string;
  parentCommentId?: number;
  replyToUserId?: number;
};

export type ReplyTarget = {
  parentCommentId: number;
  user: User;
};
