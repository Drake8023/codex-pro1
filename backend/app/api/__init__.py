from flask import Blueprint, jsonify

from app.extensions import db
from app.models import DemoCounter

api_bp = Blueprint("api", __name__)


@api_bp.get("/health")
def health_check():
    return jsonify(status="ok")


@api_bp.get("/demo-click")
def get_demo_click():
    counter = db.session.get(DemoCounter, 1)
    return jsonify(count=counter.count, message="Loaded from database")


@api_bp.post("/demo-click")
def increment_demo_click():
    counter = db.session.get(DemoCounter, 1)
    counter.count += 1
    db.session.commit()
    return jsonify(count=counter.count, message="Click recorded in database")