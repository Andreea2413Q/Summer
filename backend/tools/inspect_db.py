# Simple DB inspection utility
# Usage (from backend/): .\.venv\Scripts\python.exe tools\inspect_db.py

import os
import sys

THIS_DIR = os.path.dirname(os.path.abspath(__file__))
BACKEND_DIR = os.path.dirname(THIS_DIR)
if BACKEND_DIR not in sys.path:
    sys.path.insert(0, BACKEND_DIR)

from run import create_app
from models import db, User, Alert

app = create_app()
if app is None:
    raise SystemExit("Failed to create Flask app. Check logs above.")

with app.app_context():
    print("\n=== Database Summary ===")
    user_count = db.session.query(User).count()
    alert_count = db.session.query(Alert).count()
    print(f"Users:  {user_count}")
    print(f"Alerts: {alert_count}")

    print("\n-- Admin Users --")
    admins = User.query.filter_by(role='admin').all()
    for u in admins:
        print(f"[ADMIN] id={u.id} name={u.name} email={u.email} active={u.is_active}")

    print("\n-- All Users --")
    for u in User.query.order_by(User.id.asc()).all():
        print(f"id={u.id} role={u.role} email={u.email} name={u.name} active={u.is_active}")

    print("\n-- Recent Alerts (max 20) --")
    for a in Alert.query.order_by(Alert.created_at.desc()).limit(20).all():
        print(f"#{a.id} [{a.status}] {a.type} - {a.title} (user_id={a.user_id}) @ ({a.latitude},{a.longitude})")

    print("\nDone.\n")
