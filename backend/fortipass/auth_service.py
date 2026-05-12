"""
JWT creation/validation and bcrypt password hashing.
"""
import bcrypt
import jwt
from datetime import datetime, timedelta, timezone
from flask import current_app


def hash_password(plain: str) -> str:
    """Hash a password for storage using bcrypt."""
    return bcrypt.hashpw(plain.encode("utf-8"), bcrypt.gensalt(rounds=12)).decode("ascii")


def verify_password(plain: str, password_hash: str) -> bool:
    """Constant-time compare against stored bcrypt hash."""
    try:
        return bcrypt.checkpw(plain.encode("utf-8"), password_hash.encode("ascii"))
    except ValueError:
        return False


def create_access_token(user_id: int, email: str, display_name: str | None) -> str:
    """Mint a signed JWT for API authorization."""
    now = datetime.now(timezone.utc)
    expire = now + timedelta(minutes=current_app.config["JWT_EXPIRE_MINUTES"])
    payload = {
        "sub": str(user_id),
        "email": email,
        "name": display_name or "",
        "iat": int(now.timestamp()),
        "exp": int(expire.timestamp()),
    }
    return jwt.encode(
        payload,
        current_app.config["JWT_SECRET"],
        algorithm=current_app.config["JWT_ALGORITHM"],
    )


def decode_token(token: str) -> dict:
    """Validate JWT and return claims; raises jwt exceptions on failure."""
    return jwt.decode(
        token,
        current_app.config["JWT_SECRET"],
        algorithms=[current_app.config["JWT_ALGORITHM"]],
    )
