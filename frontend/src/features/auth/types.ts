export type User = {
  id: number;
  email: string;
  displayName: string;
  avatarUrl: string | null;
  bio: string | null;
  createdAt: string;
  updatedAt: string;
};

export type AuthPayload = { email: string; password: string };
export type RegisterPayload = AuthPayload & { displayName: string };
