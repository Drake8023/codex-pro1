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
import type { NotificationItem } from "../types";

function buildTargetHref(notification: NotificationItem) {
  const search = new URLSearchParams({ post: String(notification.postId), comments: "1" });
  const targetCommentId = notification.commentId ?? notification.targetCommentId;
  if (targetCommentId) {
    search.set("comment", String(targetCommentId));
  }
  return `/?${search.toString()}`;
}

function NotificationDetails({ notification, t }: { notification: NotificationItem; t: Dictionary }) {
  if (notification.kind === "reply") {
    return (
      <div className="notification-card__details">
        {notification.commentExcerpt ? (
          <div className="notification-card__section">
            <span className="notification-card__section-label">{t.messageReplyContent}</span>
            <p>{notification.commentExcerpt}</p>
          </div>
        ) : null}
        {notification.targetCommentExcerpt ? (
          <div className="notification-card__section">
            <span className="notification-card__section-label">{t.messageReplyTarget}</span>
            <p>{notification.targetCommentExcerpt}</p>
          </div>
        ) : null}
      </div>
    );
  }

  if (notification.kind === "comment") {
    return (
      <div className="notification-card__details">
        {notification.commentExcerpt ? (
          <div className="notification-card__section">
            <span className="notification-card__section-label">{t.comments}</span>
            <p>{notification.commentExcerpt}</p>
          </div>
        ) : null}
      </div>
    );
  }

  if (!notification.postExcerpt) {
    return null;
  }

  return (
    <div className="notification-card__details">
      <div className="notification-card__section">
        <span className="notification-card__section-label">{t.messagePostContext}</span>
        <p>{notification.postExcerpt}</p>
      </div>
    </div>
  );
}

export function NotificationCenter({ t, language, enabled, showHeader = true }: { t: Dictionary; language: Language; enabled: boolean; showHeader?: boolean }) {
  const navigate = useNavigate();
  const notificationsQuery = useNotifications(enabled);
  const markRead = useMarkNotificationRead();
  const [selectedId, setSelectedId] = useState<number | null>(null);

  const notifications = (notificationsQuery.data?.notifications ?? []).filter((notification) => !notification.isRead);
  const unreadCount = notificationsQuery.data?.unreadCount ?? notifications.length;

  const kindLabel = {
    like: t.messageLiked,
    comment: t.messageCommented,
    reply: t.messageReplied,
  } as const;

  const handleOpen = async (notification: NotificationItem) => {
    setSelectedId(notification.id);
    try {
      if (!notification.isRead) {
        await markRead.mutateAsync(notification.id);
      }
      navigate(buildTargetHref(notification));
    } finally {
      setSelectedId(null);
    }
  };

  if (!enabled) return null;
  if (notificationsQuery.isLoading) return <StatusText>{t.loadingNotifications}</StatusText>;
  if (notificationsQuery.isError) return <StatusText>{t.apiUnavailable}</StatusText>;

  return (
    <section className="notification-center glass-panel">
      {showHeader ? (
        <div className="notification-center__header">
          <h2>{t.notifications}</h2>
          <Badge count={unreadCount} overflowCount={99} className="notification-center__badge-wrap">
            <span className="notification-center__badge-label">{t.unread}</span>
          </Badge>
        </div>
      ) : null}
      {notifications.length === 0 ? (
        <p className="notification-center__empty">{t.noNotifications}</p>
      ) : (
        <div className="notification-center__list">
          {notifications.map((notification) => (
            <Button
              key={notification.id}
              variant="ghost"
              className="notification-card is-unread"
              onClick={() => void handleOpen(notification)}
            >
              <Avatar user={notification.actor} size="sm" />
              <div className="notification-card__body">
                <div className="notification-card__meta">
                  <strong>{notification.actor.displayName}</strong>
                  <span>{kindLabel[notification.kind]}</span>
                  <span>{formatTimestamp(notification.createdAt, language)}</span>
                </div>
                <NotificationDetails notification={notification} t={t} />
              </div>
              <span className="notification-card__chevron">{selectedId === notification.id ? "..." : <RightOutlined />}</span>
            </Button>
          ))}
        </div>
      )}
    </section>
  );
}
