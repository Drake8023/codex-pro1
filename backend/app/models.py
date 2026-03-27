from __future__ import annotations

from datetime import datetime, timezone

from app.extensions import db


def utcnow() -> datetime:
    return datetime.now(timezone.utc)


class DemoCounter(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    count = db.Column(db.Integer, nullable=False, default=0)


class User(db.Model):
    __tablename__ = "users"

    id = db.Column(db.Integer, primary_key=True)
    email = db.Column(db.String(255), unique=True, nullable=False, index=True)
    password_hash = db.Column(db.String(255), nullable=False)
    display_name = db.Column(db.String(120), nullable=False)
    avatar_url = db.Column(db.String(512), nullable=True)
    bio = db.Column(db.Text, nullable=True)
    created_at = db.Column(db.DateTime(timezone=True), nullable=False, default=utcnow)
    updated_at = db.Column(db.DateTime(timezone=True), nullable=False, default=utcnow, onupdate=utcnow)

    posts = db.relationship("Post", back_populates="author", cascade="all, delete-orphan")
    post_likes = db.relationship("PostLike", back_populates="user", cascade="all, delete-orphan")
    post_comments = db.relationship("PostComment", foreign_keys="PostComment.user_id", back_populates="author", cascade="all, delete-orphan")
    comment_replies = db.relationship("PostComment", foreign_keys="PostComment.reply_to_user_id", back_populates="reply_to_user")
    received_notifications = db.relationship("Notification", foreign_keys="Notification.user_id", back_populates="user", cascade="all, delete-orphan", order_by="Notification.created_at.desc()")
    triggered_notifications = db.relationship("Notification", foreign_keys="Notification.actor_user_id", back_populates="actor")
    messages = db.relationship("Message", back_populates="sender", cascade="all, delete-orphan")
    conversation_participants = db.relationship("ConversationParticipant", back_populates="user", cascade="all, delete-orphan")


class Post(db.Model):
    __tablename__ = "posts"

    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey("users.id"), nullable=False, index=True)
    content = db.Column(db.Text, nullable=False, default="")
    created_at = db.Column(db.DateTime(timezone=True), nullable=False, default=utcnow, index=True)
    updated_at = db.Column(db.DateTime(timezone=True), nullable=False, default=utcnow, onupdate=utcnow)

    author = db.relationship("User", back_populates="posts")
    images = db.relationship("PostImage", back_populates="post", cascade="all, delete-orphan", order_by="PostImage.sort_order")
    likes = db.relationship("PostLike", back_populates="post", cascade="all, delete-orphan")
    comments = db.relationship("PostComment", back_populates="post", cascade="all, delete-orphan", order_by="PostComment.created_at")
    notifications = db.relationship("Notification", back_populates="post")


class PostImage(db.Model):
    __tablename__ = "post_images"

    id = db.Column(db.Integer, primary_key=True)
    post_id = db.Column(db.Integer, db.ForeignKey("posts.id"), nullable=False, index=True)
    image_url = db.Column(db.String(512), nullable=False)
    sort_order = db.Column(db.Integer, nullable=False, default=0)

    post = db.relationship("Post", back_populates="images")


class PostLike(db.Model):
    __tablename__ = "post_likes"
    __table_args__ = (db.UniqueConstraint("post_id", "user_id", name="uq_post_like_post_user"),)

    id = db.Column(db.Integer, primary_key=True)
    post_id = db.Column(db.Integer, db.ForeignKey("posts.id"), nullable=False, index=True)
    user_id = db.Column(db.Integer, db.ForeignKey("users.id"), nullable=False, index=True)
    created_at = db.Column(db.DateTime(timezone=True), nullable=False, default=utcnow)

    post = db.relationship("Post", back_populates="likes")
    user = db.relationship("User", back_populates="post_likes")


class PostComment(db.Model):
    __tablename__ = "post_comments"

    id = db.Column(db.Integer, primary_key=True)
    post_id = db.Column(db.Integer, db.ForeignKey("posts.id"), nullable=False, index=True)
    user_id = db.Column(db.Integer, db.ForeignKey("users.id"), nullable=False, index=True)
    parent_comment_id = db.Column(db.Integer, db.ForeignKey("post_comments.id"), nullable=True, index=True)
    reply_to_user_id = db.Column(db.Integer, db.ForeignKey("users.id"), nullable=True, index=True)
    content = db.Column(db.Text, nullable=False)
    created_at = db.Column(db.DateTime(timezone=True), nullable=False, default=utcnow)
    updated_at = db.Column(db.DateTime(timezone=True), nullable=False, default=utcnow, onupdate=utcnow)

    post = db.relationship("Post", back_populates="comments")
    author = db.relationship("User", foreign_keys=[user_id], back_populates="post_comments")
    parent_comment = db.relationship("PostComment", remote_side=[id], back_populates="replies")
    replies = db.relationship("PostComment", back_populates="parent_comment", cascade="all, delete-orphan", order_by="PostComment.created_at")
    reply_to_user = db.relationship("User", foreign_keys=[reply_to_user_id], back_populates="comment_replies")
    notifications = db.relationship("Notification", back_populates="comment")


class Notification(db.Model):
    __tablename__ = "notifications"

    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey("users.id"), nullable=False, index=True)
    actor_user_id = db.Column(db.Integer, db.ForeignKey("users.id"), nullable=False, index=True)
    post_id = db.Column(db.Integer, db.ForeignKey("posts.id"), nullable=False, index=True)
    comment_id = db.Column(db.Integer, db.ForeignKey("post_comments.id"), nullable=True, index=True)
    kind = db.Column(db.String(32), nullable=False)
    is_read = db.Column(db.Boolean, nullable=False, default=False, index=True)
    created_at = db.Column(db.DateTime(timezone=True), nullable=False, default=utcnow, index=True)

    user = db.relationship("User", foreign_keys=[user_id], back_populates="received_notifications")
    actor = db.relationship("User", foreign_keys=[actor_user_id], back_populates="triggered_notifications")
    post = db.relationship("Post", back_populates="notifications")
    comment = db.relationship("PostComment", back_populates="notifications")


class Conversation(db.Model):
    __tablename__ = "conversations"

    id = db.Column(db.Integer, primary_key=True)
    created_at = db.Column(db.DateTime(timezone=True), nullable=False, default=utcnow)
    updated_at = db.Column(db.DateTime(timezone=True), nullable=False, default=utcnow, onupdate=utcnow, index=True)

    participants = db.relationship("ConversationParticipant", back_populates="conversation", cascade="all, delete-orphan")
    messages = db.relationship("Message", back_populates="conversation", cascade="all, delete-orphan", order_by="Message.created_at")


class ConversationParticipant(db.Model):
    __tablename__ = "conversation_participants"
    __table_args__ = (db.UniqueConstraint("conversation_id", "user_id", name="uq_conversation_participant"),)

    id = db.Column(db.Integer, primary_key=True)
    conversation_id = db.Column(db.Integer, db.ForeignKey("conversations.id"), nullable=False, index=True)
    user_id = db.Column(db.Integer, db.ForeignKey("users.id"), nullable=False, index=True)

    conversation = db.relationship("Conversation", back_populates="participants")
    user = db.relationship("User", back_populates="conversation_participants")


class Message(db.Model):
    __tablename__ = "messages"

    id = db.Column(db.Integer, primary_key=True)
    conversation_id = db.Column(db.Integer, db.ForeignKey("conversations.id"), nullable=False, index=True)
    sender_id = db.Column(db.Integer, db.ForeignKey("users.id"), nullable=False, index=True)
    content = db.Column(db.Text, nullable=False)
    created_at = db.Column(db.DateTime(timezone=True), nullable=False, default=utcnow, index=True)

    conversation = db.relationship("Conversation", back_populates="messages")
    sender = db.relationship("User", back_populates="messages")
