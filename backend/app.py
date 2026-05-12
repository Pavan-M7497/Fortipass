"""
FortiPass — Flask REST API entry point.

Run locally:
    pip install -r requirements.txt
    python app.py

Environment:
    Copy .env.example to .env and set SECRET_KEY, JWT_SECRET, ENCRYPTION_KEY.

API base: http://127.0.0.1:5000/api/...
"""
from __future__ import annotations

import os

from dotenv import load_dotenv

# Load .env before importing Config-dependent modules
load_dotenv()

from flask import Flask, jsonify
from flask_cors import CORS
from flask_limiter import Limiter
from flask_limiter.util import get_remote_address

from fortipass.config import Config
from fortipass.db import close_db, init_db_schema
from fortipass.blueprints.auth_bp import auth_bp
from fortipass.blueprints.vault_bp import vault_bp
from fortipass.blueprints.password_bp import password_bp
from fortipass.blueprints.breach_bp import breach_bp
from fortipass.blueprints.dashboard_bp import dashboard_bp


def create_app() -> Flask:
    app = Flask(__name__)
    app.config.from_object(Config)

    # SQLite DDL (idempotent) — must run inside app context for paths/config.
    with app.app_context():
        init_db_schema()

    # CORS for Vite dev server / production frontends
    CORS(
        app,
        resources={r"/api/*": {"origins": app.config["CORS_ORIGINS"]}},
        supports_credentials=True,
    )

    # Rate limiting (in-memory; use Redis URI in production if needed)
    limiter = Limiter(
        get_remote_address,
        app=app,
        default_limits=["400 per day", "200 per hour"],
        storage_uri="memory://",
    )

    app.register_blueprint(auth_bp, url_prefix="/api/auth")
    app.register_blueprint(vault_bp, url_prefix="/api/vault")
    app.register_blueprint(password_bp, url_prefix="/api/password")
    app.register_blueprint(breach_bp, url_prefix="/api/breach")
    app.register_blueprint(dashboard_bp, url_prefix="/api/dashboard")

    # Stricter limits on auth (wrap Flask endpoint functions after registration)
    _rate = [
        ("auth.signup", "15/minute"),
        ("auth.login", "30/minute"),
        ("auth.me", "60/minute"),
    ]
    for endpoint, lim in _rate:
        view = app.view_functions.get(endpoint)
        if view is not None:
            app.view_functions[endpoint] = limiter.limit(lim)(view)

    @app.teardown_appcontext
    def _close_db(_exc) -> None:
        close_db()

    @app.errorhandler(404)
    def _not_found(_e):
        return jsonify({"error": "Not found"}), 404

    @app.errorhandler(429)
    def _too_many(_e):
        return jsonify({"error": "Rate limit exceeded"}), 429

    @app.get("/health")
    def health():
        return jsonify({"status": "ok", "service": "fortipass-api"})

    @app.get("/")
    def root():
        return jsonify({"name": "FortiPass API", "docs": "/api/…"})

    return app


app = create_app()

if __name__ == "__main__":
    port = int(os.environ.get("PORT", "5000"))
    app.run(host="0.0.0.0", port=port, debug=os.environ.get("FLASK_DEBUG", "1") == "1")
