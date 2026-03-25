import os
from pathlib import Path

from flask import Flask

from app.api import api_bp
from app.extensions import db


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
        from app.models import DemoCounter

        db.create_all()
        if db.session.get(DemoCounter, 1) is None:
            db.session.add(DemoCounter(id=1, count=0))
            db.session.commit()

    return app