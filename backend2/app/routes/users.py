from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from app import db, bcrypt
from app.models.user import User
from app.middleware.decorators import approved_required

users_bp = Blueprint("users", __name__)


@users_bp.get("/profile")
@jwt_required()
def my_profile():
    """Cari istifadecinin oz profili."""
    user_id = get_jwt_identity()
    user = User.query.get_or_404(user_id)
    return jsonify({"user": user.to_dict()}), 200


@users_bp.put("/profile")
@jwt_required()
@approved_required
def update_profile():
    """Profil melimatlarini yenile."""
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
    return jsonify({"message": "Profile updated.", "user": user.to_dict()}), 200


@users_bp.put("/profile/password")
@jwt_required()
def change_password():
    """Şifrə dəyiş."""
    user_id = get_jwt_identity()
    user = User.query.get_or_404(user_id)
    data = request.get_json()

    if not data.get("currentPassword") or not data.get("newPassword"):
        return jsonify({"message": "Current and new password are required."}), 400

    if not bcrypt.check_password_hash(user.password_hash, data["currentPassword"]):
        return jsonify({"message": "Current password is incorrect."}), 401

    if len(data["newPassword"]) < 6:
        return jsonify({"message": "New password must be at least 6 characters long."}), 400

    user.password_hash = bcrypt.generate_password_hash(data["newPassword"]).decode("utf-8")
    db.session.commit()
    return jsonify({"message": "Password changed successfully."}), 200


@users_bp.get("/<int:user_id>")
@jwt_required()
def public_profile(user_id):
    """İstenilen istifadecinin ictimai profili."""
    user = User.query.get_or_404(user_id)
    return jsonify({"user": user.to_dict()}), 200