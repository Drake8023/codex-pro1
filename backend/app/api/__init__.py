from __future__ import annotations

from functools import wraps
from io import BytesIO
from pathlib import Path
from uuid import uuid4

from flask import Blueprint, Response, current_app, jsonify, redirect, request, send_from_directory, session
from PIL import Image
from pillow_heif import register_heif_opener
from sqlalchemy.orm import selectinload
from werkzeug.security import check_password_hash, generate_password_hash
from werkzeug.utils import secure_filename

from app.extensions import db
from app.models import Conversation, ConversationParticipant, DemoCounter, Message, Notification, Post, PostComment, PostImage, PostLike, User, utcnow

api_bp = Blueprint("api", __name__)
register_heif_opener()

LONGING_COUNTER_ID = 1
ZEN_COUNTER_ID = 2
ALLOWED_IMAGE_EXTENSIONS = {"png", "jpg", "jpeg", "gif", "webp", "avif", "jfif", "heic", "heif"}
ALLOWED_IMAGE_MIME_TYPES = {
    "image/png": "png",
    "image/jpeg": "jpg",
    "image/pjpeg": "jpg",
    "image/gif": "gif",
    "image/webp": "webp",
    "image/avif": "avif",
    "image/heic": "heic",
    "image/heif": "heif",
    "image/heic-sequence": "heic",
    "image/heif-sequence": "heif",
}
AVATAR_PRESETS = {
    "aurora": {
        "bg": ("#7c9dff", "#ffd4b6"),
        "shape": "<circle cx='160' cy='132' r='84' fill='rgba(255,255,255,0.28)' /><circle cx='238' cy='84' r='42' fill='rgba(255,255,255,0.22)' />",
    },
    "pebble": {
        "bg": ("#6ab7a8", "#d9f0c7"),
        "shape": "<rect x='54' y='58' width='204' height='156' rx='78' fill='rgba(255,255,255,0.24)' /><circle cx='124' cy='114' r='34' fill='rgba(255,255,255,0.22)' />",
    },
    "sunset": {
        "bg": ("#ff9e7a", "#ffd66b"),
        "shape": "<circle cx='160' cy='112' r='76' fill='rgba(255,255,255,0.26)' /><path d='M42 210C90 154 230 154 278 210V320H42Z' fill='rgba(255,255,255,0.18)' />",
    },
    "iris": {
        "bg": ("#8d7bff", "#d9c8ff"),
        "shape": "<circle cx='102' cy='102' r='46' fill='rgba(255,255,255,0.22)' /><circle cx='218' cy='126' r='66' fill='rgba(255,255,255,0.18)' />",
    },
    "mint": {
        "bg": ("#6ccfbd", "#c6f4dc"),
        "shape": "<path d='M52 204C96 154 224 146 272 204V320H52Z' fill='rgba(255,255,255,0.2)' /><circle cx='160' cy='118' r='54' fill='rgba(255,255,255,0.24)' />",
    },
    "ember": {
        "bg": ("#ff7b7b", "#ffb86b"),
        "shape": "<circle cx='160' cy='118' r='70' fill='rgba(255,255,255,0.22)' /><circle cx='102' cy='88' r='30' fill='rgba(255,255,255,0.18)' /><circle cx='226' cy='160' r='26' fill='rgba(255,255,255,0.18)' />",
    },
}


def _avatar_preset_svg(preset_id: str) -> str | None:
    preset = AVATAR_PRESETS.get(preset_id)
    if preset is None:
        return None

    start, end = preset["bg"]
    shape = preset["shape"]
    return f"""<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 320 320' role='img' aria-label='{preset_id} avatar'>
  <defs>
    <linearGradient id='g' x1='0%' y1='0%' x2='100%' y2='100%'>
      <stop offset='0%' stop-color='{start}' />
      <stop offset='100%' stop-color='{end}' />
    </linearGradient>
  </defs>
  <rect width='320' height='320' rx='88' fill='url(#g)' />
  {shape}
</svg>"""


def _json_error(message: str, status: int):
    return jsonify(message=message), status


def _resolve_upload_extension(file) -> str | None:
    original_name = file.filename or ""
    extension = Path(original_name).suffix.lower().lstrip(".")
    mimetype = (file.mimetype or "").lower()

    if extension in ALLOWED_IMAGE_EXTENSIONS:
        return extension

    return ALLOWED_IMAGE_MIME_TYPES.get(mimetype)


def _save_uploaded_file(file, destination: Path, extension: str) -> None:
    if extension not in {"heic", "heif"}:
        file.save(destination)
        return

    file.stream.seek(0)
    with Image.open(file.stream) as image:
        converted = image.convert("RGB")
        buffer = BytesIO()
        converted.save(buffer, format="JPEG", quality=92)
        destination.write_bytes(buffer.getvalue())


def _get_or_create_counter(counter_id: int) -> DemoCounter:
    counter = db.session.get(DemoCounter, counter_id)
    if counter is None:
        counter = DemoCounter(id=counter_id, count=0)
        db.session.add(counter)
    return counter


def _read_counter(counter_id: int) -> int:
    return _get_or_create_counter(counter_id).count


def _increment_counter(counter_id: int) -> int:
    counter = _get_or_create_counter(counter_id)
    counter.count += 1
    db.session.commit()
    return counter.count


def _get_current_user() -> User | None:
    user_id = session.get("user_id")
    if not user_id:
        return None
    return db.session.get(User, user_id)


def _serialize_user(user: User) -> dict[str, object]:
    return {
        "id": user.id,
        "email": user.email,
        "displayName": user.display_name,
        "avatarUrl": user.avatar_url,
        "bio": user.bio,
        "createdAt": user.created_at.isoformat(),
        "updatedAt": user.updated_at.isoformat(),
    }


def _serialize_post_image(image: PostImage) -> dict[str, object]:
    return {"id": image.id, "url": image.image_url, "sortOrder": image.sort_order}


def _serialize_post_comment(comment: PostComment) -> dict[str, object]:
    return {
        "id": comment.id,
        "content": comment.content,
        "createdAt": comment.created_at.isoformat(),
        "updatedAt": comment.updated_at.isoformat(),
        "author": _serialize_user(comment.author),
        "parentCommentId": comment.parent_comment_id,
        "replyToUser": _serialize_user(comment.reply_to_user) if comment.reply_to_user is not None else None,
        "replies": [_serialize_post_comment(reply) for reply in comment.replies],
    }


def _serialize_post(post: Post, current_user: User | None = None) -> dict[str, object]:
    liked_by_me = False
    if current_user is not None:
        liked_by_me = any(like.user_id == current_user.id for like in post.likes)

    return {
        "id": post.id,
        "content": post.content,
        "createdAt": post.created_at.isoformat(),
        "updatedAt": post.updated_at.isoformat(),
        "author": _serialize_user(post.author),
        "images": [_serialize_post_image(image) for image in post.images],
        "likeCount": len(post.likes),
        "commentCount": len(post.comments),
        "likedByMe": liked_by_me,
        "likeUsers": [_serialize_user(like.user) for like in post.likes],
    }


def _serialize_message(message: Message) -> dict[str, object]:
    return {
        "id": message.id,
        "content": message.content,
        "createdAt": message.created_at.isoformat(),
        "sender": _serialize_user(message.sender),
    }


def _excerpt(value: str, limit: int = 120) -> str:
    normalized = " ".join(value.split())
    if len(normalized) <= limit:
        return normalized
    return f"{normalized[: limit - 1].rstrip()}?"


def _serialize_notification(notification: Notification) -> dict[str, object]:
    actor_name = notification.actor.display_name
    if notification.kind == "like":
        body = f"{actor_name} liked your post"
    elif notification.kind == "reply":
        body = f"{actor_name} replied to your comment"
    else:
        body = f"{actor_name} commented on your post"

    comment_excerpt = _excerpt(notification.comment.content) if notification.comment is not None else None
    target_comment = notification.comment.parent_comment if notification.kind == "reply" and notification.comment is not None else None
    target_comment_excerpt = _excerpt(target_comment.content) if target_comment is not None else None
    post_excerpt = _excerpt(notification.post.content) if notification.post.content else None

    return {
        "id": notification.id,
        "kind": notification.kind,
        "isRead": notification.is_read,
        "createdAt": notification.created_at.isoformat(),
        "body": body,
        "actor": _serialize_user(notification.actor),
        "postId": notification.post_id,
        "commentId": notification.comment_id,
        "targetCommentId": target_comment.id if target_comment is not None else notification.comment_id,
        "commentExcerpt": comment_excerpt,
        "targetCommentExcerpt": target_comment_excerpt,
        "postExcerpt": post_excerpt,
    }


def _create_notification(*, user: User, actor: User, post: Post, kind: str, comment: PostComment | None = None) -> None:
    if user.id == actor.id:
        return

    existing = db.session.execute(
        db.select(Notification).where(
            Notification.user_id == user.id,
            Notification.actor_user_id == actor.id,
            Notification.post_id == post.id,
            Notification.comment_id == (comment.id if comment is not None else None),
            Notification.kind == kind,
        )
    ).scalar_one_or_none()
    if existing is not None and kind == "like":
        existing.created_at = utcnow()
        existing.is_read = False
        return

    db.session.add(Notification(user=user, actor=actor, post=post, comment=comment, kind=kind, is_read=False))


def _serialize_conversation(conversation: Conversation, current_user: User) -> dict[str, object]:
    other_participants = [participant.user for participant in conversation.participants if participant.user_id != current_user.id]
    latest_message = conversation.messages[-1] if conversation.messages else None
    return {
        "id": conversation.id,
        "participants": [_serialize_user(user) for user in other_participants],
        "latestMessage": _serialize_message(latest_message) if latest_message else None,
        "updatedAt": conversation.updated_at.isoformat(),
    }


def _login_user(user: User) -> None:
    session.clear()
    session.permanent = True
    session["user_id"] = user.id


def login_required(view):
    @wraps(view)
    def wrapped(*args, **kwargs):
        user = _get_current_user()
        if user is None:
            return _json_error("Authentication required", 401)
        return view(user, *args, **kwargs)

    return wrapped


def _get_post_or_404(post_id: int) -> Post | tuple[object, int]:
    post = db.session.execute(
        db.select(Post)
        .options(selectinload(Post.author), selectinload(Post.images), selectinload(Post.likes), selectinload(Post.comments))
        .where(Post.id == post_id)
    ).scalar_one_or_none()
    if post is None:
        return _json_error("Post not found", 404)
    return post


def _get_post_comment_or_404(comment_id: int) -> PostComment | tuple[object, int]:
    comment = db.session.execute(
        db.select(PostComment)
        .options(
            selectinload(PostComment.author),
            selectinload(PostComment.reply_to_user),
            selectinload(PostComment.replies).selectinload(PostComment.author),
            selectinload(PostComment.replies).selectinload(PostComment.reply_to_user),
        )
        .where(PostComment.id == comment_id)
    ).scalar_one_or_none()
    if comment is None:
        return _json_error("Comment not found", 404)
    return comment


def _get_post_comment_threads(post_id: int) -> list[PostComment]:
    comments = db.session.execute(
        db.select(PostComment)
        .options(
            selectinload(PostComment.author),
            selectinload(PostComment.reply_to_user),
            selectinload(PostComment.replies).selectinload(PostComment.author),
            selectinload(PostComment.replies).selectinload(PostComment.reply_to_user),
        )
        .where(PostComment.post_id == post_id, PostComment.parent_comment_id.is_(None))
        .order_by(PostComment.created_at.asc())
    ).scalars().all()
    return comments


def _get_conversation_for_user_or_404(conversation_id: int, current_user: User) -> Conversation | tuple[object, int]:
    conversation = db.session.execute(
        db.select(Conversation)
        .options(
            selectinload(Conversation.participants).selectinload(ConversationParticipant.user),
            selectinload(Conversation.messages).selectinload(Message.sender),
        )
        .where(Conversation.id == conversation_id)
    ).scalar_one_or_none()
    if conversation is None:
        return _json_error("Conversation not found", 404)
    if not any(participant.user_id == current_user.id for participant in conversation.participants):
        return _json_error("Conversation not found", 404)
    return conversation


@api_bp.get("/health")
def health_check():
    return jsonify(status="ok")


@api_bp.get("/auth/me")
def get_auth_me():
    user = _get_current_user()
    return jsonify(authenticated=user is not None, user=_serialize_user(user) if user else None)


@api_bp.post("/auth/register")
def register_user():
    data = request.get_json(silent=True) or {}
    email = str(data.get("email", "")).strip().lower()
    password = str(data.get("password", ""))
    display_name = str(data.get("displayName", "")).strip()
    avatar_url = str(data.get("avatarUrl", "")).strip() or None
    bio = str(data.get("bio", "")).strip() or None

    if not email or not password or not display_name:
        return _json_error("Display name, email, and password are required", 400)
    if len(password) < 6:
        return _json_error("Password must be at least 6 characters", 400)

    existing_user = db.session.execute(db.select(User).where(User.email == email)).scalar_one_or_none()
    if existing_user is not None:
        return _json_error("Email is already registered", 409)

    user = User(email=email, password_hash=generate_password_hash(password), display_name=display_name, avatar_url=avatar_url, bio=bio)
    db.session.add(user)
    db.session.commit()
    _login_user(user)
    return jsonify(message="Registered", user=_serialize_user(user)), 201


@api_bp.post("/auth/login")
def login_user():
    data = request.get_json(silent=True) or {}
    email = str(data.get("email", "")).strip().lower()
    password = str(data.get("password", ""))

    user = db.session.execute(db.select(User).where(User.email == email)).scalar_one_or_none()
    if user is None or not check_password_hash(user.password_hash, password):
        return _json_error("Invalid email or password", 401)

    _login_user(user)
    return jsonify(message="Signed in", user=_serialize_user(user))


@api_bp.post("/auth/logout")
def logout_user():
    session.clear()
    return jsonify(message="Signed out")


@api_bp.get("/avatar-presets")
def get_avatar_presets():
    return jsonify(presets=[{"id": preset_id, "url": f"/api/avatar-presets/{preset_id}.svg"} for preset_id in AVATAR_PRESETS])


@api_bp.get("/avatar-presets/<string:preset_id>.svg")
def get_avatar_preset_svg(preset_id: str):
    svg = _avatar_preset_svg(preset_id)
    if svg is None:
        return _json_error("Avatar preset not found", 404)
    return Response(svg, mimetype="image/svg+xml")


@api_bp.put("/profile/avatar")
@login_required
def update_profile_avatar(current_user: User):
    data = request.get_json(silent=True) or {}
    avatar_url = str(data.get("avatarUrl", "")).strip() or None
    current_user.avatar_url = avatar_url
    db.session.commit()
    return jsonify(message="Avatar updated", user=_serialize_user(current_user))


@api_bp.get("/posts")
def get_posts():
    current_user = _get_current_user()
    posts = db.session.execute(
        db.select(Post)
        .options(
            selectinload(Post.author),
            selectinload(Post.images),
            selectinload(Post.likes).selectinload(PostLike.user),
            selectinload(Post.comments),
        )
        .order_by(Post.created_at.desc())
    ).scalars().all()
    return jsonify(posts=[_serialize_post(post, current_user) for post in posts])


@api_bp.get("/posts/<int:post_id>")
def get_post(post_id: int):
    current_user = _get_current_user()
    post = _get_post_or_404(post_id)
    if isinstance(post, tuple):
        return post
    return jsonify(post=_serialize_post(post, current_user))


@api_bp.post("/posts")
@login_required
def create_post(current_user: User):
    data = request.get_json(silent=True) or {}
    content = str(data.get("content", "")).strip()
    image_urls = [str(url).strip() for url in data.get("imageUrls", []) if str(url).strip()]

    if not content and not image_urls:
        return _json_error("Write something or attach at least one image", 400)

    post = Post(author=current_user, content=content)
    db.session.add(post)
    db.session.flush()

    for index, image_url in enumerate(image_urls):
        db.session.add(PostImage(post=post, image_url=image_url, sort_order=index))

    db.session.commit()

    fresh_post = db.session.execute(
        db.select(Post)
        .options(
            selectinload(Post.author),
            selectinload(Post.images),
            selectinload(Post.likes).selectinload(PostLike.user),
            selectinload(Post.comments),
        )
        .where(Post.id == post.id)
    ).scalar_one()
    return jsonify(message="Post created", post=_serialize_post(fresh_post, current_user)), 201


@api_bp.post("/posts/<int:post_id>/likes/toggle")
@login_required
def toggle_post_like(current_user: User, post_id: int):
    post = _get_post_or_404(post_id)
    if isinstance(post, tuple):
        return post

    like = db.session.execute(
        db.select(PostLike).where(PostLike.post_id == post.id, PostLike.user_id == current_user.id)
    ).scalar_one_or_none()

    liked = False
    if like is None:
        new_like = PostLike(post=post, user=current_user)
        db.session.add(new_like)
        _create_notification(user=post.author, actor=current_user, post=post, kind="like")
        liked = True
    else:
        db.session.delete(like)

    db.session.commit()

    updated_post = _get_post_or_404(post.id)
    if isinstance(updated_post, tuple):
        return updated_post
    return jsonify(likeCount=len(updated_post.likes), likedByMe=liked)


@api_bp.get("/posts/<int:post_id>/comments")
def get_post_comments(post_id: int):
    post = _get_post_or_404(post_id)
    if isinstance(post, tuple):
        return post
    return jsonify(comments=[_serialize_post_comment(comment) for comment in _get_post_comment_threads(post.id)])


@api_bp.post("/posts/<int:post_id>/comments")
@login_required
def create_post_comment(current_user: User, post_id: int):
    post = _get_post_or_404(post_id)
    if isinstance(post, tuple):
        return post

    data = request.get_json(silent=True) or {}
    content = str(data.get("content", "")).strip()
    parent_comment_id = data.get("parentCommentId")
    reply_to_user_id = data.get("replyToUserId")
    if not content:
        return _json_error("Comment cannot be empty", 400)

    parent_comment: PostComment | None = None
    if parent_comment_id is not None:
        if not isinstance(parent_comment_id, int):
            return _json_error("parentCommentId must be an integer", 400)
        found_comment = _get_post_comment_or_404(parent_comment_id)
        if isinstance(found_comment, tuple):
            return found_comment
        parent_comment = found_comment
        if parent_comment.post_id != post.id:
            return _json_error("Comment does not belong to this post", 400)
        if parent_comment.parent_comment_id is not None:
            return _json_error("Only two levels of comments are supported", 400)

    reply_to_user: User | None = None
    if parent_comment is not None:
        target_user_id = parent_comment.user_id if reply_to_user_id is None else reply_to_user_id
        if not isinstance(target_user_id, int):
            return _json_error("replyToUserId must be an integer", 400)
        reply_to_user = db.session.get(User, target_user_id)
        if reply_to_user is None:
            return _json_error("Reply target user not found", 404)

    comment = PostComment(post=post, author=current_user, content=content, parent_comment=parent_comment, reply_to_user=reply_to_user)
    db.session.add(comment)
    db.session.flush()

    if parent_comment is not None:
        _create_notification(user=parent_comment.author, actor=current_user, post=post, kind="reply", comment=comment)
    else:
        _create_notification(user=post.author, actor=current_user, post=post, kind="comment", comment=comment)

    db.session.commit()

    fresh_comment = _get_post_comment_or_404(comment.id)
    if isinstance(fresh_comment, tuple):
        return fresh_comment
    comment_count = db.session.execute(db.select(db.func.count(PostComment.id)).where(PostComment.post_id == post.id)).scalar_one()
    return jsonify(message="Comment created", comment=_serialize_post_comment(fresh_comment), commentCount=comment_count), 201


@api_bp.post("/conversations")
@login_required
def create_or_get_conversation(current_user: User):
    data = request.get_json(silent=True) or {}
    target_user_id = data.get("targetUserId")
    if not isinstance(target_user_id, int):
        return _json_error("targetUserId is required", 400)
    if target_user_id == current_user.id:
        return _json_error("Cannot create a conversation with yourself", 400)

    target_user = db.session.get(User, target_user_id)
    if target_user is None:
        return _json_error("User not found", 404)

    current_conversation_ids = set(db.session.execute(db.select(ConversationParticipant.conversation_id).where(ConversationParticipant.user_id == current_user.id)).scalars().all())
    target_conversation_ids = set(db.session.execute(db.select(ConversationParticipant.conversation_id).where(ConversationParticipant.user_id == target_user_id)).scalars().all())
    shared_ids = current_conversation_ids.intersection(target_conversation_ids)

    conversation = None
    for conversation_id in shared_ids:
        participant_count = db.session.execute(db.select(db.func.count(ConversationParticipant.id)).where(ConversationParticipant.conversation_id == conversation_id)).scalar_one()
        if participant_count == 2:
            conversation = db.session.execute(
                db.select(Conversation)
                .options(
                    selectinload(Conversation.participants).selectinload(ConversationParticipant.user),
                    selectinload(Conversation.messages).selectinload(Message.sender),
                )
                .where(Conversation.id == conversation_id)
            ).scalar_one()
            break

    created = False
    if conversation is None:
        conversation = Conversation()
        db.session.add(conversation)
        db.session.flush()
        db.session.add(ConversationParticipant(conversation=conversation, user=current_user))
        db.session.add(ConversationParticipant(conversation=conversation, user=target_user))
        db.session.commit()
        created = True
        conversation = db.session.execute(
            db.select(Conversation)
            .options(
                selectinload(Conversation.participants).selectinload(ConversationParticipant.user),
                selectinload(Conversation.messages).selectinload(Message.sender),
            )
            .where(Conversation.id == conversation.id)
        ).scalar_one()

    return jsonify(conversation=_serialize_conversation(conversation, current_user), created=created)


@api_bp.get("/conversations")
@login_required
def get_conversations(current_user: User):
    conversation_ids = db.session.execute(
        db.select(ConversationParticipant.conversation_id).where(ConversationParticipant.user_id == current_user.id)
    ).scalars().all()

    if not conversation_ids:
        return jsonify(conversations=[])

    conversations = db.session.execute(
        db.select(Conversation)
        .options(
            selectinload(Conversation.participants).selectinload(ConversationParticipant.user),
            selectinload(Conversation.messages).selectinload(Message.sender),
        )
        .where(Conversation.id.in_(conversation_ids))
        .order_by(Conversation.updated_at.desc())
    ).scalars().all()
    return jsonify(conversations=[_serialize_conversation(conversation, current_user) for conversation in conversations])


@api_bp.get("/conversations/<int:conversation_id>/messages")
@login_required
def get_conversation_messages(current_user: User, conversation_id: int):
    conversation = _get_conversation_for_user_or_404(conversation_id, current_user)
    if isinstance(conversation, tuple):
        return conversation
    return jsonify(messages=[_serialize_message(message) for message in conversation.messages])


@api_bp.post("/conversations/<int:conversation_id>/messages")
@login_required
def create_message(current_user: User, conversation_id: int):
    conversation = _get_conversation_for_user_or_404(conversation_id, current_user)
    if isinstance(conversation, tuple):
        return conversation

    data = request.get_json(silent=True) or {}
    content = str(data.get("content", "")).strip()
    if not content:
        return _json_error("Message cannot be empty", 400)

    message = Message(conversation=conversation, sender=current_user, content=content)
    conversation.updated_at = utcnow()
    db.session.add(message)
    db.session.commit()

    fresh_message = db.session.execute(
        db.select(Message).options(selectinload(Message.sender)).where(Message.id == message.id)
    ).scalar_one()
    return jsonify(message=_serialize_message(fresh_message)), 201


@api_bp.post("/uploads/images")
@login_required
def upload_images(_current_user: User):
    files = request.files.getlist("images")
    if not files:
        return _json_error("No images uploaded", 400)

    upload_dir = Path(current_app.config["UPLOAD_FOLDER"])
    upload_dir.mkdir(parents=True, exist_ok=True)
    saved_images: list[dict[str, object]] = []

    for file in files:
        original_name = file.filename or ""
        extension = _resolve_upload_extension(file)
        if not original_name or extension is None:
            return _json_error("Only png, jpg, jpeg, gif, webp, avif, jfif, heic, and heif images are allowed", 400)

        stem = secure_filename(Path(original_name).stem) or "image"
        stored_extension = "jpg" if extension in {"heic", "heif"} else extension
        stored_name = f"{uuid4().hex}-{stem}.{stored_extension}"
        try:
            _save_uploaded_file(file, upload_dir / stored_name, extension)
        except Exception:
            return _json_error("Image conversion failed. Please try another photo.", 400)
        saved_images.append({"name": stored_name, "url": f"/api/uploads/{stored_name}"})

    return jsonify(message="Images uploaded", images=saved_images), 201


@api_bp.get("/notifications")
@login_required
def get_notifications(current_user: User):
    notifications = db.session.execute(
        db.select(Notification)
        .options(
            selectinload(Notification.actor),
            selectinload(Notification.post),
            selectinload(Notification.comment).selectinload(PostComment.parent_comment),
        )
        .where(Notification.user_id == current_user.id)
        .order_by(Notification.created_at.desc())
        .limit(50)
    ).scalars().all()
    unread_count = sum(1 for notification in notifications if not notification.is_read)
    return jsonify(notifications=[_serialize_notification(notification) for notification in notifications], unreadCount=unread_count)


@api_bp.post("/notifications/<int:notification_id>/read")
@login_required
def mark_notification_read(current_user: User, notification_id: int):
    notification = db.session.execute(
        db.select(Notification).where(Notification.id == notification_id, Notification.user_id == current_user.id)
    ).scalar_one_or_none()
    if notification is None:
        return _json_error("Notification not found", 404)

    notification.is_read = True
    db.session.commit()
    return jsonify(message="Notification marked as read")


@api_bp.get("/uploads/<path:filename>")
def serve_uploaded_image(filename: str):
    upload_dir = Path(current_app.config["UPLOAD_FOLDER"])
    local_file = upload_dir / filename
    if local_file.exists():
        return send_from_directory(upload_dir, filename, max_age=3600)

    remote_base_url = current_app.config.get("REMOTE_UPLOAD_BASE_URL", "")
    if remote_base_url:
        return redirect(f"{remote_base_url}/{filename}", code=307)

    return _json_error("Image not found", 404)


@api_bp.get("/modes/state")
def get_modes_state():
    longing_count = _read_counter(LONGING_COUNTER_ID)
    zen_hits = _read_counter(ZEN_COUNTER_ID)
    return jsonify(longingCount=longing_count, zenHits=zen_hits)


@api_bp.post("/modes/longing")
def increment_longing():
    longing_count = _increment_counter(LONGING_COUNTER_ID)
    return jsonify(longingCount=longing_count, message="Longing count recorded")


@api_bp.post("/modes/zen")
def increment_zen():
    zen_hits = _increment_counter(ZEN_COUNTER_ID)
    return jsonify(zenHits=zen_hits, message="Pain -1")


@api_bp.get("/demo-click")
def get_demo_click():
    longing_count = _read_counter(LONGING_COUNTER_ID)
    return jsonify(count=longing_count, message="Loaded from database")


@api_bp.post("/demo-click")
def increment_demo_click():
    count = _increment_counter(LONGING_COUNTER_ID)
    return jsonify(count=count, message="Click recorded in database")
