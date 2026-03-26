from __future__ import annotations

from functools import wraps
from pathlib import Path
from uuid import uuid4

from flask import Blueprint, current_app, jsonify, request, send_from_directory, session
from sqlalchemy.orm import selectinload
from werkzeug.security import check_password_hash, generate_password_hash
from werkzeug.utils import secure_filename

from app.extensions import db
from app.models import Conversation, ConversationParticipant, DemoCounter, Message, Post, PostComment, PostImage, PostLike, User

api_bp = Blueprint("api", __name__)

LONGING_COUNTER_ID = 1
ZEN_COUNTER_ID = 2
ALLOWED_IMAGE_EXTENSIONS = {"png", "jpg", "jpeg", "gif", "webp"}


def _json_error(message: str, status: int):
    return jsonify(message=message), status


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
    }


def _serialize_message(message: Message) -> dict[str, object]:
    return {
        "id": message.id,
        "content": message.content,
        "createdAt": message.created_at.isoformat(),
        "sender": _serialize_user(message.sender),
    }


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


@api_bp.get("/posts")
def get_posts():
    current_user = _get_current_user()
    posts = db.session.execute(
        db.select(Post)
        .options(
            selectinload(Post.author),
            selectinload(Post.images),
            selectinload(Post.likes),
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
            selectinload(Post.likes),
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
        db.session.add(PostLike(post=post, user=current_user))
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

    comments = db.session.execute(
        db.select(PostComment)
        .options(selectinload(PostComment.author))
        .where(PostComment.post_id == post.id)
        .order_by(PostComment.created_at.asc())
    ).scalars().all()
    return jsonify(comments=[_serialize_post_comment(comment) for comment in comments])


@api_bp.post("/posts/<int:post_id>/comments")
@login_required
def create_post_comment(current_user: User, post_id: int):
    post = _get_post_or_404(post_id)
    if isinstance(post, tuple):
        return post

    data = request.get_json(silent=True) or {}
    content = str(data.get("content", "")).strip()
    if not content:
        return _json_error("Comment cannot be empty", 400)

    comment = PostComment(post=post, author=current_user, content=content)
    db.session.add(comment)
    db.session.commit()

    fresh_comment = db.session.execute(
        db.select(PostComment).options(selectinload(PostComment.author)).where(PostComment.id == comment.id)
    ).scalar_one()
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
    conversation.updated_at = message.created_at
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
        extension = Path(original_name).suffix.lower().lstrip(".")
        if not original_name or extension not in ALLOWED_IMAGE_EXTENSIONS:
            return _json_error("Only png, jpg, jpeg, gif, and webp images are allowed", 400)

        stem = secure_filename(Path(original_name).stem) or "image"
        stored_name = f"{uuid4().hex}-{stem}.{extension}"
        file.save(upload_dir / stored_name)
        saved_images.append({"name": stored_name, "url": f"/api/uploads/{stored_name}"})

    return jsonify(message="Images uploaded", images=saved_images), 201


@api_bp.get("/uploads/<path:filename>")
def serve_uploaded_image(filename: str):
    return send_from_directory(current_app.config["UPLOAD_FOLDER"], filename, max_age=3600)


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
