import { useEffect, useState } from "react";
import { Button } from "../../../shared/components/Button";
import { useSession } from "../../auth/hooks/useSession";
import { StatusText } from "../../../shared/components/StatusText";
import { Avatar } from "../../../shared/components/Avatar";
import type { Dictionary, Language } from "../../../i18n";
import { formatTimestamp } from "../../../shared/lib/date";
import { useCreateComment, usePostComments } from "../hooks/usePostComments";
import type { PostComment, ReplyTarget } from "../types";

type CommentsPanelProps = {
  postId: number;
  t: Dictionary;
  language: Language;
  isOpen: boolean;
  targetCommentId?: number;
};

type CommentItemProps = {
  comment: PostComment;
  t: Dictionary;
  language: Language;
  onReply: (target: ReplyTarget) => void;
  canReply: boolean;
  targetCommentId?: number;
};

function CommentItem({ comment, t, language, onReply, canReply, targetCommentId }: CommentItemProps) {
  const isTarget = comment.id === targetCommentId;

  return (
    <div id={`comment-${comment.id}`} className={`comment-item ${comment.parentCommentId ? "comment-item--reply" : ""} ${isTarget ? "is-target" : ""}`.trim()}>
      <div className="comment-item__head">
        <div className="comment-item__meta">
          <Avatar user={comment.author} size="sm" />
          <div>
            <strong>{comment.author.displayName}</strong>
            <span>{formatTimestamp(comment.createdAt, language)}</span>
          </div>
        </div>
        {canReply ? (
          <Button variant="ghost" size="sm" className="comment-item__reply" onClick={() => onReply({ parentCommentId: comment.parentCommentId ?? comment.id, user: comment.author })}>
            {t.reply}
          </Button>
        ) : null}
      </div>
      <p className="comment-item__content">
        {comment.replyToUser ? <span className="comment-item__reply-target">@{comment.replyToUser.displayName} </span> : null}
        {comment.content}
      </p>
      {comment.replies.length > 0 ? (
        <div className="comment-item__replies">
          {comment.replies.map((reply) => (
            <CommentItem key={reply.id} comment={reply} t={t} language={language} onReply={onReply} canReply={canReply} targetCommentId={targetCommentId} />
          ))}
        </div>
      ) : null}
    </div>
  );
}

export function CommentsPanel({ postId, t, language, isOpen, targetCommentId }: CommentsPanelProps) {
  const [draft, setDraft] = useState("");
  const [replyTarget, setReplyTarget] = useState<ReplyTarget | null>(null);
  const { currentUser } = useSession();
  const commentsQuery = usePostComments(postId, isOpen);
  const createComment = useCreateComment(postId);
  const comments = commentsQuery.data?.comments ?? [];

  useEffect(() => {
    if (!isOpen || !targetCommentId || comments.length === 0) {
      return;
    }

    const frame = window.requestAnimationFrame(() => {
      document.getElementById(`comment-${targetCommentId}`)?.scrollIntoView({ behavior: "smooth", block: "center" });
    });

    return () => window.cancelAnimationFrame(frame);
  }, [comments, isOpen, targetCommentId]);

  const handleSubmit = async () => {
    const content = draft.trim();
    if (!content) return;
    await createComment.mutateAsync({
      content,
      parentCommentId: replyTarget?.parentCommentId,
      replyToUserId: replyTarget?.user.id,
    });
    setDraft("");
    setReplyTarget(null);
  };

  if (!isOpen) return null;

  return (
    <section className="comments-panel">
      {commentsQuery.isLoading ? <StatusText>{t.loadingComments}</StatusText> : null}
      {commentsQuery.isError ? <StatusText>{t.commentsLoadFailed}</StatusText> : null}
      {!commentsQuery.isLoading && !commentsQuery.isError && comments.length === 0 ? <StatusText>{t.noComments}</StatusText> : null}
      {comments.length > 0 ? (
        <div className="comments-panel__list">
          {comments.map((comment) => (
            <CommentItem
              key={comment.id}
              comment={comment}
              t={t}
              language={language}
              canReply={Boolean(currentUser)}
              onReply={setReplyTarget}
              targetCommentId={targetCommentId}
            />
          ))}
        </div>
      ) : null}
      {currentUser ? (
        <div className="comment-form">
          {replyTarget ? (
            <div className="reply-banner">
              <div>
                <strong>{t.replyingTo(replyTarget.user.displayName)}</strong>
                <span>{t.replyPlaceholder(replyTarget.user.displayName)}</span>
              </div>
              <Button variant="ghost" size="sm" className="reply-banner__cancel" onClick={() => setReplyTarget(null)}>
                {t.cancelReply}
              </Button>
            </div>
          ) : null}
          <textarea
            value={draft}
            onChange={(event) => setDraft(event.target.value)}
            placeholder={replyTarget ? t.replyPlaceholder(replyTarget.user.displayName) : t.commentPlaceholder}
            rows={4}
          />
          <div className="comment-form__footer">
            <StatusText>{createComment.isError ? t.commentFailed : ""}</StatusText>
            <Button variant="primary" onClick={() => void handleSubmit()} disabled={createComment.isPending || !draft.trim()}>
              {createComment.isPending ? t.sendingComment : t.publishComment}
            </Button>
          </div>
        </div>
      ) : (
        <StatusText>{t.signInToComment}</StatusText>
      )}
    </section>
  );
}
