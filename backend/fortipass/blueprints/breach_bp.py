"""Breach detection — demo offline corpus; swap for HIBP k-anonymity API in production."""
from flask import Blueprint, request, jsonify

from fortipass.password_service import check_breach

breach_bp = Blueprint("breach", __name__)


@breach_bp.route("/check", methods=["POST"])
def check():
    data = request.get_json(silent=True) or {}
    password = data.get("password")
    if password is None or not isinstance(password, str):
        return jsonify({"error": "password field required"}), 400
    if len(password) > 512:
        return jsonify({"error": "password too long"}), 400
    result = check_breach(password)
    return jsonify(result)
