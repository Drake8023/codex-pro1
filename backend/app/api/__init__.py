from __future__ import annotations

from functools import wraps
from pathlib import Path
from uuid import uuid4

from flask import Blueprint, current_app, jsonify, request, send_from_directory, session
from sqlalchemy.orm import selectinload
from werkzeug.security import check_password_hash, generate_password_hash
from werkzeug.utils import secure_filename

from app.extensions import db
from app.models import DemoCounter, Post, PostImage, User

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
    return {
        "id": image.id,
        "url": image.image_url,
        "sortOrder": image.sort_order,
    }


def _serialize_post(post: Post) -> dict[str, object]:
    return {
        "id": post.id,
        "content": post.content,
        "createdAt": post.created_at.isoformat(),
        "updatedAt": post.updated_at.isoformat(),
        "author": _serialize_user(post.author),
        "images": [_serialize_post_image(image) for image in post.images],
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

    user = User(
        email=email,
        password_hash=generate_password_hash(password),
        display_name=display_name,
        avatar_url=avatar_url,
        bio=bio,
    )
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
    posts = db.session.execute(
        db.select(Post)
        .options(selectinload(Post.author), selectinload(Post.images))
        .order_by(Post.created_at.desc())
    ).scalars().all()
    return jsonify(posts=[_serialize_post(post) for post in posts])


@api_bp.get("/posts/<int:post_id>")
def get_post(post_id: int):
    post = db.session.execute(
        db.select(Post)
        .options(selectinload(Post.author), selectinload(Post.images))
        .where(Post.id == post_id)
    ).scalar_one_or_none()
    if post is None:
        return _json_error("Post not found", 404)
    return jsonify(post=_serialize_post(post))


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
        .options(selectinload(Post.author), selectinload(Post.images))
        .where(Post.id == post.id)
    ).scalar_one()
    return jsonify(message="Post created", post=_serialize_post(fresh_post)), 201


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
        saved_images.append({
            "name": stored_name,
            "url": f"/api/uploads/{stored_name}",
        })

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
