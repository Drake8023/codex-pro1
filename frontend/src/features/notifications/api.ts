import { apiRequest } from "../../shared/api/client";
import type { NotificationItem } from "./types";

export function getNotifications() {
  return apiRequest<{ notifications: NotificationItem[]; unreadCount: number }>("/api/notifications");
}

export function markNotificationRead(notificationId: number) {
  return apiRequest<{ message: string }>(`/api/notifications/${notificationId}/read`, { method: "POST" });
}
