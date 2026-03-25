from flask import Blueprint, jsonify

api_bp = Blueprint("api", __name__)

_demo_click_count = 0


@api_bp.get("/health")
def health_check():
    return jsonify(status="ok")


@api_bp.get("/demo-click")
def get_demo_click():
    return jsonify(count=_demo_click_count, message="Ready for click test")


@api_bp.post("/demo-click")
def increment_demo_click():
    global _demo_click_count
    _demo_click_count += 1
    return jsonify(count=_demo_click_count, message="Click recorded")