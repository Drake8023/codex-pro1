import os
from pathlib import Path

from flask import Flask

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


def create_app() -> Flask:
    app = Flask(__name__)

    database_url = os.getenv("DATABASE_URL")
    if database_url:
        app.config["SQLALCHEMY_DATABASE_URI"] = database_url
    else:
        db_path = Path(app.root_path).parent / "instance" / "app.db"
        db_path.parent.mkdir(parents=True, exist_ok=True)
        app.config["SQLALCHEMY_DATABASE_URI"] = f"sqlite:///{db_path.as_posix()}"

    app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False

    db.init_app(app)
    app.register_blueprint(api_bp, url_prefix="/api")

    with app.app_context():
        db.create_all()
        _ensure_counter(LONGING_COUNTER_ID, 0)
        _ensure_counter(ZEN_COUNTER_ID, 0)
        db.session.commit()

    return app