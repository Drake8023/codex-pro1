import os
from datetime import timedelta
from pathlib import Path

from flask import Flask
from sqlalchemy import inspect, text

from app.api import api_bp
from app.extensions import db
from app.models import DemoCounter

LONGING_COUNTER_ID = 1
ZEN_COUNTER_ID = 2


def _ensure_counter(counter_id: int, default_count: int = 0) -> DemoCounter:
    counter = db.session.get(DemoCounter, counter_id)
    if counter is None:
        counter = DemoCounter(id=counter_id, count=default_count)
        db.session.add(counter)
    return counter


def _ensure_post_comment_schema() -> None:
    inspector = inspect(db.engine)
    if "post_comments" not in inspector.get_table_names():
        return

    columns = {column["name"] for column in inspector.get_columns("post_comments")}
    statements: list[str] = []

    if "parent_comment_id" not in columns:
        statements.append("ALTER TABLE post_comments ADD COLUMN parent_comment_id INTEGER")
    if "reply_to_user_id" not in columns:
        statements.append("ALTER TABLE post_comments ADD COLUMN reply_to_user_id INTEGER")

    for statement in statements:
        db.session.execute(text(statement))

    if statements:
        db.session.commit()


def create_app() -> Flask:
    app = Flask(__name__)

    app.config["SECRET_KEY"] = os.getenv("SECRET_KEY", "codex-dev-session-secret")
    app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False
    app.config["SESSION_COOKIE_HTTPONLY"] = True
    app.config["SESSION_COOKIE_SAMESITE"] = "Lax"
    app.config["SESSION_COOKIE_SECURE"] = os.getenv("SESSION_COOKIE_SECURE", "false").lower() == "true"
    app.config["PERMANENT_SESSION_LIFETIME"] = timedelta(days=7)

    database_url = os.getenv("DATABASE_URL")
    if database_url:
        app.config["SQLALCHEMY_DATABASE_URI"] = database_url
    else:
        db_path = Path(app.root_path).parent / "instance" / "app.db"
        db_path.parent.mkdir(parents=True, exist_ok=True)
        app.config["SQLALCHEMY_DATABASE_URI"] = f"sqlite:///{db_path.as_posix()}"

    upload_dir = Path(os.getenv("UPLOAD_FOLDER", str(Path(app.root_path).parent / "instance" / "uploads")))
    upload_dir.mkdir(parents=True, exist_ok=True)
    app.config["UPLOAD_FOLDER"] = upload_dir.as_posix()
    app.config["REMOTE_UPLOAD_BASE_URL"] = os.getenv("REMOTE_UPLOAD_BASE_URL", "").rstrip("/")

    db.init_app(app)
    app.register_blueprint(api_bp, url_prefix="/api")

    with app.app_context():
        db.create_all()
        _ensure_post_comment_schema()
        _ensure_counter(LONGING_COUNTER_ID, 0)
        _ensure_counter(ZEN_COUNTER_ID, 0)
        db.session.commit()

    return app
