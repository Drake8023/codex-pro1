import { useMemo } from "react";
import { Link, useSearchParams } from "react-router-dom";
import type { Dictionary, Language } from "../../i18n";
import { EmptyState } from "../../shared/components/EmptyState";
import { StatusText } from "../../shared/components/StatusText";
import { usePosts } from "../../features/posts/hooks/usePosts";
import { useSession } from "../../features/auth/hooks/useSession";
import { PostCard } from "../../features/posts/components/PostCard";

export function FeedPage({ t, language }: { t: Dictionary; language: Language }) {
  const postsQuery = usePosts();
  const { currentUser } = useSession();
  const [searchParams] = useSearchParams();
  const highlightPostId = Number(searchParams.get("post") ?? 0);
  const highlightCommentId = Number(searchParams.get("comment") ?? 0);
  const openComments = searchParams.get("comments") === "1";
  const posts = useMemo(() => postsQuery.data?.posts ?? [], [postsQuery.data?.posts]);

  return (
    <section className="page page--feed">
      <div className="hero glass-panel glass-panel--strong">
        <div className="hero__copy">
          <p className="eyebrow">{t.feedEyebrow}</p>
          <h1>{t.feedTitle}</h1>
          <p className="hero__hint">{t.feedMobileHint}</p>
        </div>
        <div className="hero__meta">
          <StatusText>{currentUser ? t.signedInAs(currentUser.displayName) : t.joinPrompt}</StatusText>
          <div className="hero__actions">
            <Link className="app-link-button app-link-button--primary" to="/create">{t.feedCreateEntry}</Link>
            <Link className="app-link-button" to="/features">{t.feedFeatureEntry}</Link>
          </div>
        </div>
      </div>
      {postsQuery.isLoading ? <StatusText>{t.loadingPosts}</StatusText> : null}
      {postsQuery.isError ? <StatusText>{t.feedUnavailable}</StatusText> : null}
      {!postsQuery.isLoading && !postsQuery.isError && posts.length === 0 ? (
        <EmptyState eyebrow={t.noPostsEyebrow} title={t.noPostsTitle} body={t.noPostsBody} />
      ) : null}
      <div className="post-list">
        {posts.map((post) => (
          <PostCard
            key={post.id}
            post={post}
            t={t}
            language={language}
            currentUserId={currentUser?.id}
            highlight={post.id === highlightPostId}
            autoOpenComments={openComments && post.id === highlightPostId}
            targetCommentId={post.id === highlightPostId && highlightCommentId > 0 ? highlightCommentId : undefined}
          />
        ))}
      </div>
    </section>
  );
}
