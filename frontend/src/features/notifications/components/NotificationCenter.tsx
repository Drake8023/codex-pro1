import { useState } from "react";
import { RightOutlined } from "@ant-design/icons";
import { Badge } from "antd";
import { useNavigate } from "react-router-dom";
import type { Dictionary, Language } from "../../../i18n";
import { formatTimestamp } from "../../../shared/lib/date";
import { Avatar } from "../../../shared/components/Avatar";
import { StatusText } from "../../../shared/components/StatusText";
import { Button } from "../../../shared/components/Button";
import { useMarkNotificationRead, useNotifications } from "../hooks/useNotifications";

export function NotificationCenter({ t, language, enabled }: { t: Dictionary; language: Language; enabled: boolean }) {
  const navigate = useNavigate();
  const notificationsQuery = useNotifications(enabled);
  const markRead = useMarkNotificationRead();
  const [selectedId, setSelectedId] = useState<number | null>(null);

  const notifications = notificationsQuery.data?.notifications ?? [];
  const unreadCount = notificationsQuery.data?.unreadCount ?? 0;

  const kindLabel = { like: t.like, comment: t.comments, reply: t.reply };

  const handleOpen = async (notificationId: number, postId: number, isRead: boolean) => {
    setSelectedId(notificationId);
    try {
      if (!isRead) {
        await markRead.mutateAsync(notificationId);
      }
      navigate(`/?post=${postId}&comments=1`);
    } finally {
      setSelectedId(null);
    }
  };

  if (!enabled) return null;
  if (notificationsQuery.isLoading) return <StatusText>{t.loadingNotifications}</StatusText>;
  if (notificationsQuery.isError) return <StatusText>{t.apiUnavailable}</StatusText>;

  return (
    <section className="notification-center glass-panel">
      <div className="notification-center__header">
        <h2>{t.notifications}</h2>
        <Badge count={unreadCount} overflowCount={99} className="notification-center__badge-wrap">
          <span className="notification-center__badge-label">{t.unread}</span>
        </Badge>
      </div>
      {notifications.length === 0 ? (
        <p className="notification-center__empty">{t.noNotifications}</p>
      ) : (
        <div className="notification-center__list">
          {notifications.map((notification) => (
            <Button
              key={notification.id}
              variant="ghost"
              className={`notification-card ${notification.isRead ? "" : "is-unread"}`}
              onClick={() => void handleOpen(notification.id, notification.postId, notification.isRead)}
            >
              <Avatar user={notification.actor} size="sm" />
              <div className="notification-card__body">
                <div className="notification-card__meta">
                  <strong>{notification.actor.displayName}</strong>
                  <span>{kindLabel[notification.kind]}</span>
                  <span>{formatTimestamp(notification.createdAt, language)}</span>
                </div>
                <p>{notification.body}</p>
              </div>
              <span className="notification-card__chevron">{selectedId === notification.id ? "..." : <RightOutlined />}</span>
            </Button>
          ))}
        </div>
      )}
    </section>
  );
}
