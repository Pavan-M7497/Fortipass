"""Password strength analysis and secure generation (stateless endpoints)."""
from flask import Blueprint, request, jsonify

from fortipass.password_service import analyze_password, generate_password

password_bp = Blueprint("password", __name__)


@password_bp.route("/analyze", methods=["POST"])
def analyze():
    """
    Analyze password strength: length, character classes, repeated patterns,
    entropy-based score, crack time estimate, and suggestions.
    """
    data = request.get_json(silent=True) or {}
    password = data.get("password")
    if password is None or not isinstance(password, str):
        return jsonify({"error": "password field required"}), 400
    if len(password) > 512:
        return jsonify({"error": "password too long"}), 400
    result = analyze_password(password)
    return jsonify(result)


@password_bp.route("/generate", methods=["POST"])
def generate():
    """Generate a cryptographically secure random password with requested rules."""
    data = request.get_json(silent=True) or {}
    try:
        length = int(data.get("length", 16))
    except (TypeError, ValueError):
        return jsonify({"error": "invalid length"}), 400
    include_lower = bool(data.get("include_lower", True))
    include_upper = bool(data.get("include_upper", True))
    include_numbers = bool(data.get("include_numbers", True))
    include_symbols = bool(data.get("include_symbols", True))
    pwd = generate_password(length, include_lower, include_upper, include_numbers, include_symbols)
    analysis = analyze_password(pwd)
    return jsonify({"password": pwd, "analysis": analysis})
