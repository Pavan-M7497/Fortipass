"""Aggregated security metrics for the authenticated user's vault."""
from flask import Blueprint, jsonify, g

from fortipass.db import get_db
from fortipass.decorators import jwt_required
from fortipass.crypto_helpers import decrypt_field
from fortipass.password_service import security_dashboard_stats

dashboard_bp = Blueprint("dashboard", __name__)


@dashboard_bp.route("/stats", methods=["GET"])
@jwt_required
def stats():
    """
    Returns totals aligned with the FortiPass dashboard cards:
    total credentials, weak/strong counts, reused password groups, composite security score.
    """
    db = get_db()
    cur = db.execute(
        """
        SELECT encrypted_password, strength, compromised FROM vault_entries
        WHERE user_id = ?
        """,
        (g.user_id,),
    )
    rows = []
    for r in cur.fetchall():
        plain = decrypt_field(r["encrypted_password"])
        rows.append(
            {
                "strength": int(r["strength"]),
                "compromised": bool(r["compromised"]),
                "password_plain": plain,
            }
        )
    payload = security_dashboard_stats(rows)
    return jsonify(payload)
