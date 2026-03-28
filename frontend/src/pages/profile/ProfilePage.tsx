import { useEffect, useMemo, useState } from "react";
import { BellOutlined } from "@ant-design/icons";
import { Badge } from "antd";
import { useParams } from "react-router-dom";
import type { Dictionary, Language } from "../../i18n";
import { EmptyState } from "../../shared/components/EmptyState";
import { useSession, useUpdateBio, useUserProfile } from "../../features/auth/hooks/useSession";
import { usePosts } from "../../features/posts/hooks/usePosts";
import { PostCard } from "../../features/posts/components/PostCard";
import { NotificationCenter } from "../../features/notifications/components/NotificationCenter";
import { useNotifications } from "../../features/notifications/hooks/useNotifications";
import { Avatar } from "../../shared/components/Avatar";
import { Button } from "../../shared/components/Button";
import { formatShortDate } from "../../shared/lib/date";
import { AvatarPickerModal } from "../../features/auth/components/AvatarPickerModal";
import { StatusText } from "../../shared/components/StatusText";

export function ProfilePage({ t, language }: { t: Dictionary; language: Language }) {
  const { userId } = useParams();
  const { currentUser } = useSession();
  const parsedUserId = userId ? Number(userId) : null;
  const profileUserId = typeof parsedUserId === "number" && Number.isFinite(parsedUserId) ? parsedUserId : null;
  const isOwnProfile = profileUserId === null || profileUserId === currentUser?.id;
  const postsQuery = usePosts();
  const profileQuery = useUserProfile(!isOwnProfile && profileUserId !== null ? profileUserId : null);
  const notificationsQuery = useNotifications(Boolean(currentUser));
  const [avatarModalOpen, setAvatarModalOpen] = useState(false);
  const [messagesOpen, setMessagesOpen] = useState(false);
  const [bioDraft, setBioDraft] = useState("");
  const updateBio = useUpdateBio();

  const profileUser = isOwnProfile ? currentUser : profileQuery.data?.user ?? null;
  const profilePosts = useMemo(() => {
    if (isOwnProfile) {
      if (!currentUser) return [];
      return (postsQuery.data?.posts ?? []).filter((post) => post.author.id === currentUser.id);
    }
    return profileQuery.data?.posts ?? [];
  }, [currentUser, isOwnProfile, postsQuery.data?.posts, profileQuery.data?.posts]);

  const unreadCount = notificationsQuery.data?.unreadCount ?? 0;

  useEffect(() => {
    setBioDraft(profileUser?.bio ?? "");
  }, [profileUser?.bio]);

  if (isOwnProfile && !currentUser) {
    return <EmptyState eyebrow={t.profileEyebrow} title={t.noSessionTitle} body={t.noSessionHint} />;
  }

  if (!isOwnProfile && profileQuery.isLoading) {
    return <StatusText>{t.loadingPosts}</StatusText>;
  }

  if (!profileUser) {
    return <EmptyState eyebrow={t.profileEyebrow} title={t.noSessionTitle} body={t.feedUnavailable} />;
  }

  const slogan = profileUser.bio?.trim() || `${profileUser.displayName} · ${profileUser.email}`;

  const handleBioSave = async () => {
    await updateBio.mutateAsync(bioDraft.trim() || null);
  };

  return (
    <>
      <section className="page page--profile">
        <div className="profile-hero glass-panel glass-panel--strong">
          <div className="profile-hero__main">
            <div className="profile-hero__avatar-stack">
              <Avatar user={profileUser} size="lg" />
              {isOwnProfile ? (
                <Button variant="ghost" size="sm" className="profile-hero__avatar-edit" onClick={() => setAvatarModalOpen(true)}>
                  {t.editAvatar}
                </Button>
              ) : null}
            </div>
            <div>
              <p className="eyebrow">{t.profileEyebrow}</p>
              <h1>{profileUser.displayName}</h1>
              <p className="profile-hero__slogan">{slogan}</p>
              <p>{profileUser.email}</p>
            </div>
          </div>
          <div className="profile-hero__stats">
            <div className="stat-card">
              <span>{t.posts}</span>
              <strong>{profilePosts.length}</strong>
            </div>
            <div className="stat-card">
              <span>{t.joined}</span>
              <strong>{formatShortDate(profileUser.createdAt, language)}</strong>
            </div>
            {isOwnProfile ? (
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
            ) : null}
          </div>
        </div>
        {isOwnProfile ? (
          <div className="profile-slogan-editor glass-panel">
            <div className="profile-slogan-editor__head">
              <strong>{t.profileSloganTitle}</strong>
              <StatusText>{t.profileSloganHint}</StatusText>
            </div>
            <textarea value={bioDraft} onChange={(event) => setBioDraft(event.target.value)} rows={3} placeholder={t.profileSloganPlaceholder} />
            <div className="profile-slogan-editor__footer">
              <StatusText>{updateBio.isError ? t.profileSloganSaveFailed : updateBio.isSuccess ? t.saved : ""}</StatusText>
              <Button variant="primary" onClick={() => void handleBioSave()} disabled={updateBio.isPending}>
                {updateBio.isPending ? t.working : t.profileSloganSave}
              </Button>
            </div>
          </div>
        ) : null}
        {isOwnProfile && messagesOpen ? <NotificationCenter t={t} language={language} enabled={Boolean(currentUser)} showHeader={false} /> : null}
        {profilePosts.length === 0 ? (
          <EmptyState eyebrow={t.emptyArchiveEyebrow} title={t.emptyArchiveTitle} body={t.emptyArchiveBody} />
        ) : (
          <div className="post-list">
            {profilePosts.map((post) => (
              <PostCard key={post.id} post={post} t={t} language={language} currentUserId={currentUser?.id} />
            ))}
          </div>
        )}
      </section>
      {isOwnProfile ? <AvatarPickerModal open={avatarModalOpen} onClose={() => setAvatarModalOpen(false)} user={profileUser} t={t} /> : null}
    </>
  );
}
