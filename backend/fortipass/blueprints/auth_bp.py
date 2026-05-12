"""
Authentication routes: signup, login, and session introspection.
"""
import sqlite3

from flask import Blueprint, request, jsonify

from fortipass.db import get_db
from fortipass.auth_service import hash_password, verify_password, create_access_token, decode_token
from fortipass.validators import normalize_email, validate_signup_password, validate_display_name

auth_bp = Blueprint("auth", __name__)


def _user_row_by_email(conn: sqlite3.Connection, email: str) -> sqlite3.Row | None:
    cur = conn.execute("SELECT * FROM users WHERE email = ? AND is_active = 1", (email,))
    return cur.fetchone()


@auth_bp.route("/signup", methods=["POST"])
def signup():
    """Register a new user; stores bcrypt hash only."""
    data = request.get_json(silent=True) or {}
    try:
        email = normalize_email(data.get("email", ""))
        validate_signup_password(data.get("password", ""))
        display_name = validate_display_name(
            data.get("display_name") or data.get("displayName") or data.get("name")
        )
    except ValueError as e:
        return jsonify({"error": str(e)}), 400

    password_hash = hash_password(data["password"])
    db = get_db()
    try:
        cur = db.execute(
            """
            INSERT INTO users (email, password_hash, display_name)
            VALUES (?, ?, ?)
            """,
            (email, password_hash, display_name),
        )
        db.commit()
        user_id = cur.lastrowid
    except sqlite3.IntegrityError:
        db.rollback()
        return jsonify({"error": "Email already registered"}), 409

    token = create_access_token(user_id, email, display_name)
    return (
        jsonify(
            {
                "access_token": token,
                "token_type": "bearer",
                "user": {"uid": str(user_id), "email": email, "displayName": display_name},
            }
        ),
        201,
    )


@auth_bp.route("/login", methods=["POST"])
def login():
    """Verify email/password and return JWT."""
    data = request.get_json(silent=True) or {}
    try:
        email = normalize_email(data.get("email", ""))
    except ValueError as e:
        return jsonify({"error": str(e)}), 400
    password = data.get("password", "")

    db = get_db()
    row = _user_row_by_email(db, email)
    if row is None or not verify_password(password, row["password_hash"]):
        # Same message avoids user enumeration
        return jsonify({"error": "Invalid email or password"}), 401

    token = create_access_token(row["id"], row["email"], row["display_name"])
    return jsonify(
        {
            "access_token": token,
            "token_type": "bearer",
            "user": {
                "uid": str(row["id"]),
                "email": row["email"],
                "displayName": row["display_name"],
            },
        }
    )


@auth_bp.route("/me", methods=["GET"])
def me():
    """Return current user from Bearer token (used by SPA on refresh)."""
    header = request.headers.get("Authorization", "")
    if not header.lower().startswith("bearer "):
        return jsonify({"error": "Authorization required"}), 401
    token = header.split(None, 1)[1].strip()
    try:
        claims = decode_token(token)
        user_id = int(claims["sub"])
    except Exception:
        return jsonify({"error": "Invalid token"}), 401

    db = get_db()
    row = db.execute("SELECT id, email, display_name FROM users WHERE id = ? AND is_active = 1", (user_id,)).fetchone()
    if row is None:
        return jsonify({"error": "User not found"}), 404

    return jsonify(
        {
            "user": {
                "uid": str(row["id"]),
                "email": row["email"],
                "displayName": row["display_name"],
            }
        }
    )
