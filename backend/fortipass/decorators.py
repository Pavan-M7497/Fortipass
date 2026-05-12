"""JWT authentication decorator for protected routes."""
from functools import wraps

import jwt
from flask import request, g, jsonify

from fortipass.auth_service import decode_token


def jwt_required(fn):
    """Require `Authorization: Bearer <token>` and set g.user_id from JWT sub claim."""

    @wraps(fn)
    def wrapper(*args, **kwargs):
        header = request.headers.get("Authorization", "")
        if not header.lower().startswith("bearer "):
            return jsonify({"error": "Authorization Bearer token required"}), 401
        token = header.split(None, 1)[1].strip()
        if not token:
            return jsonify({"error": "Empty token"}), 401
        try:
            claims = decode_token(token)
            g.user_id = int(claims["sub"])
            g.jwt_claims = claims
        except jwt.ExpiredSignatureError:
            return jsonify({"error": "Token expired"}), 401
        except jwt.InvalidTokenError:
            return jsonify({"error": "Invalid token"}), 401
        except (KeyError, ValueError):
            return jsonify({"error": "Malformed token"}), 401
        return fn(*args, **kwargs)

    return wrapper
