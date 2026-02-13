from flask import Blueprint, request, jsonify
from flask_jwt_extended import (
    create_access_token,
    create_refresh_token,
    jwt_required,
    get_jwt_identity,
)
from app import db, bcrypt
from app.models.user import User

auth_bp = Blueprint("auth", __name__)


@auth_bp.post("/register")
def register():
    data = request.get_json()

    # Validasiya
    required = ["name", "email", "password"]
    for field in required:
        if not data.get(field):
            return jsonify({"message": f"{field} sahəsi tələb olunur."}), 400

    if len(data["password"]) < 6:
        return jsonify({"message": "Şifrə ən azı 6 simvol olmalıdır."}), 400

    # Email unikallıq yoxlaması
    if User.query.filter_by(email=data["email"].lower()).first():
        return jsonify({"message": "Bu email artıq qeydiyyatdan keçib."}), 409

    # İstifadəçi yarat
    password_hash = bcrypt.generate_password_hash(data["password"]).decode("utf-8")
    user = User(
        name=data["name"].strip(),
        email=data["email"].lower().strip(),
        password_hash=password_hash,
        phone=data.get("phone"),
        status="pending",  # Admin təsdiqini gözləyir
        role="user",
    )
    db.session.add(user)
    db.session.commit()

    return jsonify({
        "message": "Qeydiyyat uğurlu oldu. Admin təsdiqini gözləyin.",
        "user": user.to_dict(),
    }), 201


@auth_bp.post("/login")
def login():
    data = request.get_json()

    if not data.get("email") or not data.get("password"):
        return jsonify({"message": "Email və şifrə tələb olunur."}), 400

    user = User.query.filter_by(email=data["email"].lower()).first()

    if not user or not bcrypt.check_password_hash(user.password_hash, data["password"]):
        return jsonify({"message": "Email və ya şifrə yanlışdır."}), 401

    if user.status == "pending":
        return jsonify({
            "message": "Hesabınız hələ admin tərəfindən təsdiqlənməyib.",
            "status": "pending",
        }), 403

    if user.status == "blocked":
        return jsonify({"message": "Hesabınız bloklanmışdır. Admin ilə əlaqə saxlayın."}), 403

    # Token yarat
    access_token = create_access_token(identity=user.id)
    refresh_token = create_refresh_token(identity=user.id)

    return jsonify({
        "message": "Uğurla daxil oldunuz.",
        "accessToken": access_token,
        "refreshToken": refresh_token,
        "user": user.to_dict(),
    }), 200


@auth_bp.get("/me")
@jwt_required()
def me():
    user_id = get_jwt_identity()
    user = User.query.get(user_id)
    if not user:
        return jsonify({"message": "İstifadəçi tapılmadı."}), 404
    return jsonify({"user": user.to_dict()}), 200


@auth_bp.post("/refresh")
@jwt_required(refresh=True)
def refresh():
    user_id = get_jwt_identity()
    access_token = create_access_token(identity=user_id)
    return jsonify({"accessToken": access_token}), 200


@auth_bp.post("/logout")
@jwt_required()
def logout():
    # Client tərəfdə token silinir, serverdə blacklist lazım deyil (sadə versiya)
    return jsonify({"message": "Uğurla çıxdınız."}), 200