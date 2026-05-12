"""
Application configuration loaded from environment variables.
Uses python-dotenv in app.py so values from .env are available via os.environ.
"""
import os


def _split_origins(raw: str | None) -> list[str]:
    if not raw:
        return [
            "http://localhost:5173",
            "http://localhost:4173",
            "http://127.0.0.1:5173",
            "http://127.0.0.1:4173",
        ]
    return [o.strip() for o in raw.split(",") if o.strip()]


class Config:
    """Flask config object — set on app.config.from_object(Config)."""

    SECRET_KEY: str = os.environ.get("SECRET_KEY", "dev-secret-change-me")
    JWT_SECRET: str = os.environ.get("JWT_SECRET", SECRET_KEY)
    JWT_ALGORITHM: str = "HS256"
    # Long-lived token so SPA session feels like "logged in" until expiry
    JWT_EXPIRE_MINUTES: int = int(os.environ.get("JWT_EXPIRE_MINUTES", "1440"))

    # Fernet key material: we derive a valid key from this string in crypto_helpers.
    ENCRYPTION_KEY: str = os.environ.get("ENCRYPTION_KEY", "dev-only-32-byte-pad-string!!")

    BASE_DIR = os.path.abspath(os.path.join(os.path.dirname(__file__), ".."))
    DATABASE_PATH = os.environ.get("DATABASE_PATH", os.path.join(BASE_DIR, "fortipass.db"))

    CORS_ORIGINS: list[str] = _split_origins(os.environ.get("CORS_ORIGINS"))
