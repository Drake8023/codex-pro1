import { apiRequest } from "../../shared/api/client";
import type { AuthPayload, RegisterPayload, User } from "./types";

export function getSession() {
  return apiRequest<{ authenticated: boolean; user: User | null }>("/api/auth/me");
}

export function login(payload: AuthPayload) {
  return apiRequest<{ user: User }>("/api/auth/login", { method: "POST", body: JSON.stringify(payload) });
}

export function register(payload: RegisterPayload) {
  return apiRequest<{ user: User }>("/api/auth/register", { method: "POST", body: JSON.stringify(payload) });
}

export function logout() {
  return apiRequest<{ message: string }>("/api/auth/logout", { method: "POST" });
}

export function updateAvatar(avatarUrl: string | null) {
  return apiRequest<{ user: User }>("/api/profile/avatar", { method: "PUT", body: JSON.stringify({ avatarUrl }) });
}
