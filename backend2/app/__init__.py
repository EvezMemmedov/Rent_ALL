import os
from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from flask_migrate import Migrate
from flask_jwt_extended import JWTManager
from flask_cors import CORS
from flask_bcrypt import Bcrypt

from config import config

db = SQLAlchemy()
migrate = Migrate()
jwt = JWTManager()
bcrypt = Bcrypt()


def create_app(config_name=None):
    if config_name is None:
        config_name = os.getenv("FLASK_ENV", "development")

    app = Flask(__name__)
    app.config.from_object(config.get(config_name, config["default"]))

    # Upload qovluğunu yarat
    os.makedirs(app.config["UPLOAD_FOLDER"], exist_ok=True)

    # Extensionları başlat
    db.init_app(app)
    migrate.init_app(app, db)
    jwt.init_app(app)
    bcrypt.init_app(app)

    # CORS - frontend ilə elaqe
    CORS(
        app,
        origins=[app.config["FRONTEND_URL"]],
        supports_credentials=True,
    )

    # Modelleri import et (Alembic ucun lazımdır)
    from app.models import user, item, rental, review  # noqa: F401

    # Blueprint-leri qeydiyyatdan keçir
    from app.routes.auth import auth_bp
    from app.routes.users import users_bp
    from app.routes.items import items_bp
    from app.routes.rentals import rentals_bp
    from app.routes.admin import admin_bp
    from app.routes.uploads import uploads_bp

    app.register_blueprint(auth_bp,    url_prefix="/api/auth")
    app.register_blueprint(users_bp,   url_prefix="/api/users")
    app.register_blueprint(items_bp,   url_prefix="/api/items")
    app.register_blueprint(rentals_bp, url_prefix="/api/rentals")
    app.register_blueprint(admin_bp,   url_prefix="/api/admin")
    app.register_blueprint(uploads_bp, url_prefix="/api/uploads")

    # JWT xeta handler-ları
    from app.middleware.jwt_handlers import register_jwt_handlers
    register_jwt_handlers(jwt)

    # Global xeta handler-ları
    from app.middleware.error_handlers import register_error_handlers
    register_error_handlers(app)

    # Health check
    @app.get("/api/health")
    def health():
        return {"status": "ok", "message": "RentALL API işləyir "}

    return app