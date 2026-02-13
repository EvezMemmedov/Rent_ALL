from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from app import db, bcrypt
from app.models.user import User
from app.middleware.decorators import approved_required

users_bp = Blueprint("users", __name__)


@users_bp.get("/profile")
@jwt_required()
def my_profile():
    """Cari istifadəçinin öz profili."""
    user_id = get_jwt_identity()
    user = User.query.get_or_404(user_id)
    return jsonify({"user": user.to_dict()}), 200


@users_bp.put("/profile")
@jwt_required()
@approved_required
def update_profile():
    """Profil məlumatlarını yenilə."""
    user_id = get_jwt_identity()
    user = User.query.get_or_404(user_id)
    data = request.get_json()

    if "name" in data and data["name"].strip():
        user.name = data["name"].strip()
    if "phone" in data:
        user.phone = data["phone"]
    if "bio" in data:
        user.bio = data["bio"]

    db.session.commit()
    return jsonify({"message": "Profil yeniləndi.", "user": user.to_dict()}), 200


@users_bp.put("/profile/password")
@jwt_required()
def change_password():
    """Şifrə dəyiş."""
    user_id = get_jwt_identity()
    user = User.query.get_or_404(user_id)
    data = request.get_json()

    if not data.get("currentPassword") or not data.get("newPassword"):
        return jsonify({"message": "Cari və yeni şifrə tələb olunur."}), 400

    if not bcrypt.check_password_hash(user.password_hash, data["currentPassword"]):
        return jsonify({"message": "Cari şifrə yanlışdır."}), 401

    if len(data["newPassword"]) < 6:
        return jsonify({"message": "Yeni şifrə ən azı 6 simvol olmalıdır."}), 400

    user.password_hash = bcrypt.generate_password_hash(data["newPassword"]).decode("utf-8")
    db.session.commit()
    return jsonify({"message": "Şifrə uğurla dəyişdirildi."}), 200


@users_bp.get("/<int:user_id>")
@jwt_required()
def public_profile(user_id):
    """İstənilən istifadəçinin ictimai profili."""
    user = User.query.get_or_404(user_id)
    return jsonify({"user": user.to_dict()}), 200