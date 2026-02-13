from functools import wraps
from flask import jsonify
from flask_jwt_extended import get_jwt_identity
from app.models.user import User


def admin_required(fn):
    """Yalnız admin roleuna sahib istifadəçilər daxil ola bilər."""
    @wraps(fn)
    def wrapper(*args, **kwargs):
        user_id = get_jwt_identity()
        user = User.query.get(user_id)
        if not user or user.role != "admin":
            return jsonify({"message": "Bu əməliyyat yalnız adminlər üçündür."}), 403
        return fn(*args, **kwargs)
    return wrapper


def approved_required(fn):
    """Yalnız admin tərəfindən təsdiqlənmiş istifadəçilər daxil ola bilər."""
    @wraps(fn)
    def wrapper(*args, **kwargs):
        user_id = get_jwt_identity()
        user = User.query.get(user_id)
        if not user:
            return jsonify({"message": "İstifadəçi tapılmadı."}), 404
        if user.status == "pending":
            return jsonify({"message": "Hesabınız hələ admin tərəfindən təsdiqlənməyib."}), 403
        if user.status == "blocked":
            return jsonify({"message": "Hesabınız bloklanmışdır."}), 403
        return fn(*args, **kwargs)
    return wrapper