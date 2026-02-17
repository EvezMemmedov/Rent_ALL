from functools import wraps
from flask import jsonify
from flask_jwt_extended import get_jwt_identity
from app.models.user import User

def admin_required(fn):
    @wraps(fn)
    def wrapper(*args, **kwargs):
        user_id = int(get_jwt_identity())
        user = User.query.get(user_id)
        if not user or user.role != "admin":
            return jsonify({"message": "This operation is for admins only."}), 403
        return fn(*args, **kwargs)
    return wrapper

def approved_required(fn):
    @wraps(fn)
    def wrapper(*args, **kwargs):
        user_id = int(get_jwt_identity())
        user = User.query.get(user_id)
        if not user:
            return jsonify({"message": "User not found."}), 404
        if user.status == "pending":
            return jsonify({"message": "Your account has not been approved by the admin yet."}), 403
        if user.status == "blocked":
            return jsonify({"message": "Your account is blocked."}), 403
        return fn(*args, **kwargs)
    return wrapper