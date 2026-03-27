import { useMemo, useState } from "react";
import { BellOutlined } from "@ant-design/icons";
import { Badge } from "antd";
import type { Dictionary, Language } from "../../i18n";
import { EmptyState } from "../../shared/components/EmptyState";
import { useSession } from "../../features/auth/hooks/useSession";
import { usePosts } from "../../features/posts/hooks/usePosts";
import { PostCard } from "../../features/posts/components/PostCard";
import { NotificationCenter } from "../../features/notifications/components/NotificationCenter";
import { useNotifications } from "../../features/notifications/hooks/useNotifications";
import { Avatar } from "../../shared/components/Avatar";
import { Button } from "../../shared/components/Button";
import { formatShortDate } from "../../shared/lib/date";
import { AvatarPickerModal } from "../../features/auth/components/AvatarPickerModal";

export function ProfilePage({ t, language }: { t: Dictionary; language: Language }) {
  const { currentUser } = useSession();
  const postsQuery = usePosts();
  const notificationsQuery = useNotifications(Boolean(currentUser));
  const [avatarModalOpen, setAvatarModalOpen] = useState(false);
  const [messagesOpen, setMessagesOpen] = useState(false);

  const ownPosts = useMemo(() => {
    if (!currentUser) return [];
    return (postsQuery.data?.posts ?? []).filter((post) => post.author.id === currentUser.id);
  }, [currentUser, postsQuery.data?.posts]);

  const unreadCount = notificationsQuery.data?.unreadCount ?? 0;

  if (!currentUser) {
    return <EmptyState eyebrow={t.profileEyebrow} title={t.noSessionTitle} body={t.noSessionHint} />;
  }

  return (
    <>
      <section className="page page--profile">
        <div className="profile-hero glass-panel glass-panel--strong">
          <div className="profile-hero__main">
            <div className="profile-hero__avatar-stack">
              <Avatar user={currentUser} size="lg" />
              <Button variant="ghost" size="sm" className="profile-hero__avatar-edit" onClick={() => setAvatarModalOpen(true)}>
                {t.editAvatar}
              </Button>
            </div>
            <div>
              <p className="eyebrow">{t.profileEyebrow}</p>
              <h1>{currentUser.displayName}</h1>
              <p>{currentUser.bio || currentUser.email}</p>
            </div>
          </div>
          <div className="profile-hero__stats">
            <div className="stat-card">
              <span>{t.posts}</span>
              <strong>{ownPosts.length}</strong>
            </div>
            <div className="stat-card">
              <span>{t.joined}</span>
              <strong>{formatShortDate(currentUser.createdAt, language)}</strong>
            </div>
            <Button
              variant="ghost"
              className={`profile-messages-trigger ${messagesOpen ? "is-active" : ""}`}
              onClick={() => setMessagesOpen((value) => !value)}
              icon={<BellOutlined />}
            >
              <span className="profile-messages-trigger__copy">
                <Badge dot={unreadCount > 0} offset={[2, 2]}>
                  <span className="profile-messages-trigger__label">{t.notifications}</span>
                </Badge>
                <span className="profile-messages-trigger__meta">{messagesOpen ? t.hideMessages : t.openMessages(unreadCount)}</span>
              </span>
            </Button>
          </div>
        </div>
        {messagesOpen ? <NotificationCenter t={t} language={language} enabled={Boolean(currentUser)} showHeader={false} /> : null}
        {ownPosts.length === 0 ? (
          <EmptyState eyebrow={t.emptyArchiveEyebrow} title={t.emptyArchiveTitle} body={t.emptyArchiveBody} />
        ) : (
          <div className="post-list">
            {ownPosts.map((post) => (
              <PostCard key={post.id} post={post} t={t} language={language} currentUserId={currentUser.id} />
            ))}
          </div>
        )}
      </section>
      <AvatarPickerModal open={avatarModalOpen} onClose={() => setAvatarModalOpen(false)} user={currentUser} t={t} />
    </>
  );
}
