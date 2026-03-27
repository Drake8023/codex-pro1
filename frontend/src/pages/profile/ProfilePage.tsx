import { useMemo } from "react";
import type { Dictionary, Language } from "../../i18n";
import { EmptyState } from "../../shared/components/EmptyState";
import { useSession } from "../../features/auth/hooks/useSession";
import { usePosts } from "../../features/posts/hooks/usePosts";
import { PostCard } from "../../features/posts/components/PostCard";
import { NotificationCenter } from "../../features/notifications/components/NotificationCenter";
import { Avatar } from "../../shared/components/Avatar";
import { formatShortDate } from "../../shared/lib/date";

export function ProfilePage({ t, language }: { t: Dictionary; language: Language }) {
  const { currentUser } = useSession();
  const postsQuery = usePosts();

  const ownPosts = useMemo(() => {
    if (!currentUser) return [];
    return (postsQuery.data?.posts ?? []).filter((post) => post.author.id === currentUser.id);
  }, [currentUser, postsQuery.data?.posts]);

  if (!currentUser) {
    return <EmptyState eyebrow={t.profileEyebrow} title={t.noSessionTitle} body={t.noSessionHint} />;
  }

  return (
    <section className="page page--profile">
      <div className="profile-hero glass-panel glass-panel--strong">
        <div className="profile-hero__main">
          <Avatar user={currentUser} size="lg" />
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
        </div>
      </div>
      <NotificationCenter t={t} language={language} enabled={Boolean(currentUser)} />
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
  );
}
