"""
Vault CRUD — credential passwords are AES-encrypted at rest; API returns decrypted values over HTTPS only.
"""
import sqlite3
from datetime import datetime, timezone

from flask import Blueprint, request, jsonify, g

from fortipass.db import get_db
from fortipass.decorators import jwt_required
from fortipass.crypto_helpers import encrypt_field, decrypt_field
from fortipass.validators import validate_vault_text_fields, validate_vault_password_secret
from fortipass.password_service import analyze_password

vault_bp = Blueprint("vault", __name__)


def _row_to_item(row: sqlite3.Row) -> dict:
    plain = decrypt_field(row["encrypted_password"])
    return {
        "id": str(row["id"]),
        "owner": str(row["user_id"]),
        "website": row["website"],
        "username": row["username"],
        "password": plain,
        "notes": row["notes"] or "",
        "compromised": bool(row["compromised"]),
        "strength": int(row["strength"]),
        "createdAt": row["created_at"],
        "updatedAt": row["updated_at"],
    }


@vault_bp.route("/items", methods=["GET"])
@jwt_required
def list_items():
    """List all vault entries for the authenticated user (passwords decrypted server-side)."""
    db = get_db()
    cur = db.execute(
        """
        SELECT * FROM vault_entries
        WHERE user_id = ?
        ORDER BY datetime(updated_at) DESC
        """,
        (g.user_id,),
    )
    items = [_row_to_item(r) for r in cur.fetchall()]
    return jsonify({"items": items})


@vault_bp.route("/items", methods=["POST"])
@jwt_required
def create_item():
    """Create a vault entry; encrypts password before INSERT."""
    data = request.get_json(silent=True) or {}
    website = (data.get("website") or "").strip()
    username = (data.get("username") or "").strip()
    notes = data.get("notes")
    if notes is not None:
        notes = str(notes)
    secret = data.get("password", "")

    try:
        validate_vault_text_fields(website, username, notes)
        validate_vault_password_secret(secret)
    except ValueError as e:
        return jsonify({"error": str(e)}), 400

    analysis = analyze_password(secret)
    compromised = bool(data.get("compromised", analysis["compromised"]))
    strength = int(data.get("strength", analysis["strength"]))

    enc = encrypt_field(secret)
    now = datetime.now(timezone.utc).isoformat()
    db = get_db()
    cur = db.execute(
        """
        INSERT INTO vault_entries
        (user_id, website, username, encrypted_password, notes, compromised, strength, created_at, updated_at)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
        """,
        (g.user_id, website, username, enc, notes or "", 1 if compromised else 0, strength, now, now),
    )
    db.commit()
    new_id = cur.lastrowid
    row = db.execute("SELECT * FROM vault_entries WHERE id = ?", (new_id,)).fetchone()
    return jsonify({"item": _row_to_item(row)}), 201


@vault_bp.route("/items/<int:entry_id>", methods=["PUT"])
@jwt_required
def update_item(entry_id: int):
    """Update an existing entry (must belong to current user)."""
    data = request.get_json(silent=True) or {}
    website = (data.get("website") or "").strip()
    username = (data.get("username") or "").strip()
    notes = data.get("notes")
    if notes is not None:
        notes = str(notes)
    secret = data.get("password", "")

    try:
        validate_vault_text_fields(website, username, notes)
        validate_vault_password_secret(secret)
    except ValueError as e:
        return jsonify({"error": str(e)}), 400

    db = get_db()
    row = db.execute(
        "SELECT id FROM vault_entries WHERE id = ? AND user_id = ?",
        (entry_id, g.user_id),
    ).fetchone()
    if row is None:
        return jsonify({"error": "Not found"}), 404

    analysis = analyze_password(secret)
    compromised = bool(data.get("compromised", analysis["compromised"]))
    strength = int(data.get("strength", analysis["strength"]))
    enc = encrypt_field(secret)
    now = datetime.now(timezone.utc).isoformat()

    db.execute(
        """
        UPDATE vault_entries SET
            website = ?, username = ?, encrypted_password = ?, notes = ?,
            compromised = ?, strength = ?, updated_at = ?
        WHERE id = ? AND user_id = ?
        """,
        (website, username, enc, notes or "", 1 if compromised else 0, strength, now, entry_id, g.user_id),
    )
    db.commit()
    row = db.execute("SELECT * FROM vault_entries WHERE id = ?", (entry_id,)).fetchone()
    return jsonify({"item": _row_to_item(row)})


@vault_bp.route("/items/<int:entry_id>", methods=["DELETE"])
@jwt_required
def delete_item(entry_id: int):
    db = get_db()
    cur = db.execute(
        "DELETE FROM vault_entries WHERE id = ? AND user_id = ?",
        (entry_id, g.user_id),
    )
    db.commit()
    if cur.rowcount == 0:
        return jsonify({"error": "Not found"}), 404
    return jsonify({"ok": True})
