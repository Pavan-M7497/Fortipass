"""
Password strength, generator, and breach heuristics (mirrors frontend logic for consistent scores).
"""
from __future__ import annotations

import math
import re
import secrets
import string
WEAK_PASSWORDS = frozenset(
    {
        "123456",
        "password",
        "12345678",
        "qwerty",
        "abc123",
        "letmein",
        "iloveyou",
        "monkey",
        "dragon",
    }
)

# Simulated "leaked" set for demo / offline breach API (replace with HIBP k-anonymity in production).
BREACH_SAMPLES = frozenset(
    {"password", "123456", "qwerty", "letmein", "welcome", "admin", "trustno1"}
)


def _charset_pool(password: str) -> int:
    pool = 0
    if re.search(r"[a-z]", password):
        pool += 26
    if re.search(r"[A-Z]", password):
        pool += 26
    if re.search(r"[0-9]", password):
        pool += 10
    if re.search(r"[^A-Za-z0-9]", password):
        pool += 32
    return pool


def entropy_bits(password: str) -> float:
    pool = _charset_pool(password)
    if pool == 0 or not password:
        return 0.0
    return math.log2(pool ** len(password))


def format_crack_time(bits: float) -> str:
    guesses_per_second = 1e10
    seconds = (2**bits) / guesses_per_second
    if seconds < 60:
        return f"{round(seconds)} sec"
    if seconds < 3600:
        return f"{round(seconds / 60)} min"
    if seconds < 86400:
        return f"{round(seconds / 3600)} hr"
    if seconds < 31_536_000:
        return f"{round(seconds / 86400)} days"
    return f"{max(1, round(seconds / 31_536_000))} yrs"


def repeated_pattern_penalty(password: str) -> int:
    """
    Detect simple repetition (e.g. 'aaa', '1212', doubled words) and return 0-25 penalty points.
    """
    if len(password) < 4:
        return 0
    penalty = 0
    # Same character repeated many times
    if re.search(r"(.)\1{3,}", password):
        penalty += 12
    # Short repeating chunk like ababab
    if re.search(r"(.{2,4})\1{2,}", password):
        penalty += 10
    # Sequential digits or letters (weak patterns)
    if re.search(r"(0123|1234|2345|3456|4567|5678|6789|abcd|qwer)", password.lower()):
        penalty += 8
    return min(25, penalty)


def check_breach(password: str) -> dict:
    normalized = password.lower().strip()
    if normalized in BREACH_SAMPLES:
        return {"compromised": True, "count": 8742, "warning": "Found in known breach corpus (demo dataset)."}
    return {"compromised": False, "count": 0, "warning": None}


def analyze_password(password: str) -> dict:
    """
    Full strength analysis for /api/password/analyze.
    """
    ent = entropy_bits(password)
    breach = check_breach(password)
    is_weak = password.lower() in WEAK_PASSWORDS or len(password) < 8
    base_score = min(100, max(0, round((ent / 48) * 100))) if password else 0
    penalty = repeated_pattern_penalty(password)
    strength = min(100, max(0, base_score - penalty))

    if is_weak:
        strength = min(strength, 28)

    if strength < 30:
        label = "Critical"
    elif strength < 60:
        label = "Weak"
    elif strength < 85:
        label = "Strong"
    else:
        label = "Excellent"

    suggestions: list[str] = []
    if len(password) < 12:
        suggestions.append("Use 12+ characters")
    if not re.search(r"[A-Z]", password):
        suggestions.append("Add uppercase letters")
    if not re.search(r"[a-z]", password):
        suggestions.append("Add lowercase letters")
    if not re.search(r"[0-9]", password):
        suggestions.append("Include numbers")
    if not re.search(r"[^A-Za-z0-9]", password):
        suggestions.append("Add symbols")
    if penalty > 0:
        suggestions.append("Avoid repeated or sequential patterns")

    return {
        "entropy": ent,
        "strength": strength,
        "label": label,
        "crackTime": format_crack_time(ent),
        "suggestions": suggestions[:5],
        "isWeak": is_weak,
        "compromised": breach["compromised"],
        "breachCount": breach["count"],
        "repeatedPatternPenalty": penalty,
    }


def generate_password(
    length: int,
    include_lower: bool,
    include_upper: bool,
    include_numbers: bool,
    include_symbols: bool,
) -> str:
    """Cryptographically secure random password."""
    length = max(8, min(64, int(length)))
    chars = ""
    if include_lower:
        chars += string.ascii_lowercase
    if include_upper:
        chars += string.ascii_uppercase
    if include_numbers:
        chars += string.digits
    if include_symbols:
        chars += "!@#$%^&*()-_=+[]{};:<>?/|~"
    if not chars:
        chars = string.ascii_letters + string.digits

    return "".join(secrets.choice(chars) for _ in range(length))


def security_dashboard_stats(rows: list[dict]) -> dict:
    """
    rows: list of dicts with keys strength (int), password_plain (str), compromised (bool)
    """
    total = len(rows)
    if total == 0:
        return {
            "total": 0,
            "weak": 0,
            "strong": 0,
            "reused": 0,
            "securityScore": 0,
        }
    weak = sum(1 for r in rows if r["strength"] < 60)
    strong = sum(1 for r in rows if r["strength"] >= 85)
    passwords = [r["password_plain"] for r in rows]
    counts: dict[str, int] = {}
    for p in passwords:
        counts[p] = counts.get(p, 0) + 1
    reused = sum(1 for c in counts.values() if c > 1)
    base = sum(r["strength"] for r in rows) / total
    penalty = sum(8 for r in rows if r.get("compromised"))
    score = max(12, min(100, round(base - penalty)))
    return {
        "total": total,
        "weak": weak,
        "strong": strong,
        "reused": reused,
        "securityScore": score,
    }
