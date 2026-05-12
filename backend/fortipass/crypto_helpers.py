"""
AES symmetric encryption for vault credential passwords at rest (Fernet — AES-128-CBC + HMAC).
The application master password is never stored; only per-entry secrets are encrypted with a server key.
"""
import base64
import hashlib

from cryptography.fernet import Fernet, InvalidToken
from flask import current_app


def _fernet() -> Fernet:
    # Derive a URL-safe 32-byte key from configured secret (stable across restarts).
    raw = current_app.config["ENCRYPTION_KEY"].encode("utf-8")
    digest = hashlib.sha256(raw).digest()
    key = base64.urlsafe_b64encode(digest)
    return Fernet(key)


def encrypt_field(plaintext: str) -> str:
    """Encrypt a vault password; store returned string in DB."""
    if plaintext is None:
        raise ValueError("Cannot encrypt empty credential")
    token = _fernet().encrypt(plaintext.encode("utf-8"))
    return token.decode("ascii")


def decrypt_field(ciphertext: str) -> str:
    """Decrypt ciphertext from DB back to plaintext for authorized API responses."""
    try:
        return _fernet().decrypt(ciphertext.encode("ascii")).decode("utf-8")
    except InvalidToken as exc:
        raise ValueError("Corrupt or tampered ciphertext") from exc
