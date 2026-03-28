import { useEffect, useState } from "react";
import { CommentOutlined, HeartFilled, HeartOutlined } from "@ant-design/icons";
import { Avatar } from "../../../shared/components/Avatar";
import { StatusText } from "../../../shared/components/StatusText";
import { ActionButton } from "../../../shared/components/ActionButton";
import { useToggleLike } from "../hooks/usePosts";
import { PostImageGallery } from "./PostImageGallery";
import { CommentsPanel } from "../../comments/components/CommentsPanel";
import type { Dictionary, Language } from "../../../i18n";
import { formatTimestamp } from "../../../shared/lib/date";
import type { PostItem } from "../types";
import { UserLink } from "../../../shared/components/UserLink";

type PostCardProps = {
  post: PostItem;
  t: Dictionary;
  language: Language;
  currentUserId?: number;
  highlight?: boolean;
  autoOpenComments?: boolean;
  targetCommentId?: number;
};

export function PostCard({ post, t, language, currentUserId, highlight = false, autoOpenComments = false, targetCommentId }: PostCardProps) {
  const [likeError, setLikeError] = useState("");
  const [commentsOpen, setCommentsOpen] = useState(autoOpenComments);
  const toggleLike = useToggleLike();

  useEffect(() => {
    if (autoOpenComments) {
      setCommentsOpen(true);
    }
  }, [autoOpenComments]);

  const handleLike = async () => {
    if (!currentUserId) {
      setLikeError(t.authRequiredAction);
      return;
    }
    setLikeError("");
    try {
      await toggleLike.mutateAsync(post.id);
    } catch {
      setLikeError(t.likeFailed);
    }
  };

  return (
    <article className={`post-card glass-panel ${highlight ? "post-card--highlight" : ""}`} id={`post-${post.id}`}>
      <div className="post-card__header">
        <div className="post-card__author">
          <UserLink user={post.author} className="user-link user-link--avatar">
            <Avatar user={post.author} size="md" />
          </UserLink>
          <div className="post-card__author-copy">
            <UserLink user={post.author} className="user-link user-link--name">
            <strong>{post.author.displayName}</strong>
            </UserLink>
            <span>{formatTimestamp(post.createdAt, language)}</span>
          </div>
        </div>
      </div>
      <p className="post-card__content">{post.content}</p>
      {post.images.length > 0 ? <PostImageGallery images={post.images} postLabel={post.author.displayName} t={t} /> : null}
      {post.likeUsers.length > 0 ? (
        <div className="post-card__likes">
          <span>{t.likedBy}</span>
          <div className="post-card__like-users">
            {post.likeUsers.map((user) => (
              <span className="post-card__like-chip" key={user.id}>{user.displayName}</span>
            ))}
          </div>
        </div>
      ) : null}
      <div className="post-card__actions">
        <ActionButton
          icon={post.likedByMe ? <HeartFilled /> : <HeartOutlined />}
          label={post.likedByMe ? t.liked : t.like}
          count={post.likeCount}
          active={post.likedByMe}
          onClick={() => void handleLike()}
        />
        <ActionButton
          icon={<CommentOutlined />}
          label={t.comments}
          count={post.commentCount}
          active={commentsOpen}
          onClick={() => setCommentsOpen((value) => !value)}
        />
      </div>
      {likeError ? <StatusText>{likeError}</StatusText> : null}
      <CommentsPanel postId={post.id} t={t} language={language} isOpen={commentsOpen} targetCommentId={targetCommentId} />
    </article>
  );
}
