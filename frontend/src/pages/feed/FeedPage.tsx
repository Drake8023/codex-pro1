import { useMemo } from "react";
import { useSearchParams } from "react-router-dom";
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
  const openComments = searchParams.get("comments") === "1";
  const posts = useMemo(() => postsQuery.data?.posts ?? [], [postsQuery.data?.posts]);

  return (
    <section className="page page--feed">
      <div className="hero glass-panel glass-panel--strong">
        <div>
          <p className="eyebrow">{t.feedEyebrow}</p>
          <h1>{t.feedTitle}</h1>
        </div>
        <div className="hero__meta">
          <StatusText>{currentUser ? t.signedInAs(currentUser.displayName) : t.joinPrompt}</StatusText>
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
          />
        ))}
      </div>
    </section>
  );
}
