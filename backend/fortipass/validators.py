"""Input validation helpers — keep payloads bounded and safe."""
import re
from email_validator import validate_email, EmailNotValidError

MAX_EMAIL_LEN = 255
MAX_DISPLAY_NAME = 120
MAX_WEBSITE = 255
MAX_USERNAME = 255
MAX_NOTES = 4000
MAX_PASSWORD_FIELD = 512  # vault entry password length cap
MIN_SIGNUP_PASSWORD = 8


def normalize_email(email: str) -> str:
    if not email or len(email) > MAX_EMAIL_LEN:
        raise ValueError("Invalid email length")
    email = email.strip().lower()
    try:
        valid = validate_email(email, check_deliverability=False)
        return valid.normalized
    except EmailNotValidError as e:
        raise ValueError(str(e)) from e


def validate_signup_password(password: str) -> None:
    if not password or len(password) < MIN_SIGNUP_PASSWORD:
        raise ValueError(f"Password must be at least {MIN_SIGNUP_PASSWORD} characters")
    if len(password) > 128:
        raise ValueError("Password is too long")


def validate_display_name(name: str | None) -> str:
    if not name:
        return "FortiPass User"
    name = name.strip()
    if len(name) > MAX_DISPLAY_NAME:
        raise ValueError("Display name too long")
    if not re.match(r"^[\w\s\-'.]+$", name, re.UNICODE):
        raise ValueError("Display name contains invalid characters")
    return name or "FortiPass User"


def validate_vault_text_fields(website: str, username: str, notes: str | None) -> None:
    if not website or len(website) > MAX_WEBSITE:
        raise ValueError("Invalid website")
    if not username or len(username) > MAX_USERNAME:
        raise ValueError("Invalid username")
    if notes is not None and len(notes) > MAX_NOTES:
        raise ValueError("Notes too long")


def validate_vault_password_secret(secret: str) -> None:
    if secret is None or len(secret) == 0 or len(secret) > MAX_PASSWORD_FIELD:
        raise ValueError("Invalid credential password")
