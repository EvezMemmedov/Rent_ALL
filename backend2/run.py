import os
from app import create_app, db
from flask_migrate import upgrade

app = create_app(os.getenv("FLASK_ENV", "development"))

# Auto-run migrations and seeding on startup (for Render and production)
with app.app_context():
    try:
        upgrade()
        from seed import seed
        seed()
    except Exception as e:
        print(f"Migration/Seed warning: {e}")


if __name__ == "__main__":
    app.run(
        host="0.0.0.0",
        port=int(os.getenv("PORT", 5000)),
        debug=app.config.get("DEBUG", False),
    )