"""
SQLite access layer — parameterized queries only (SQL injection safe).
"""
import sqlite3
from contextlib import contextmanager
from pathlib import Path

from flask import current_app, g


def get_db_path() -> str:
    return current_app.config["DATABASE_PATH"]


def _connect(path: str) -> sqlite3.Connection:
    conn = sqlite3.connect(path, detect_types=sqlite3.PARSE_DECLTYPES)
    conn.row_factory = sqlite3.Row
    # Enforce FK constraints (required for ON DELETE CASCADE).
    conn.execute("PRAGMA foreign_keys = ON;")
    return conn


@contextmanager
def db_connection():
    """Standalone connection (e.g. init script)."""
    path = Path(__file__).resolve().parent.parent / "fortipass.db"
    conn = _connect(str(path))
    try:
        yield conn
        conn.commit()
    finally:
        conn.close()


def get_db() -> sqlite3.Connection:
    """One connection per Flask request (stored on g)."""
    if "db" not in g:
        g.db = _connect(get_db_path())
    return g.db


def close_db(_e=None) -> None:
    conn = g.pop("db", None)
    if conn is not None:
        conn.close()


def init_db_schema() -> None:
    """Create tables if missing (idempotent)."""
    schema_file = Path(__file__).resolve().parent.parent / "schema.sql"
    sql = schema_file.read_text(encoding="utf-8")
    path = Path(current_app.config["DATABASE_PATH"])
    path.parent.mkdir(parents=True, exist_ok=True)
    conn = _connect(str(path))
    try:
        conn.executescript(sql)
        conn.commit()
    finally:
        conn.close()
