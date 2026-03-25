from flask import Blueprint, jsonify

from app.extensions import db
from app.models import DemoCounter

api_bp = Blueprint("api", __name__)

LONGING_COUNTER_ID = 1
ZEN_COUNTER_ID = 2


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


@api_bp.get("/health")
def health_check():
    return jsonify(status="ok")


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