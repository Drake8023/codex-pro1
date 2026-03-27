import type { User } from "../auth/types";

export type PostImage = { id: number; url: string; sortOrder: number };
export type PostItem = {
  id: number;
  content: string;
  createdAt: string;
  updatedAt: string;
  author: User;
  images: PostImage[];
  likeCount: number;
  commentCount: number;
  likedByMe: boolean;
  likeUsers: User[];
};
