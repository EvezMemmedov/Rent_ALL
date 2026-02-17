from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required
from app import db
from app.models.user import User
from app.models.item import Item
from app.models.rental import Rental
from app.middleware.decorators import admin_required

admin_bp = Blueprint("admin", __name__)


@admin_bp.get("/pending-users")
@jwt_required()
@admin_required
def pending_users():
    """Təsdiq gözləyən istifadəçilər."""
    users = User.query.filter_by(status="pending", role="user").order_by(User.created_at.desc()).all()
    return jsonify({"users": [u.to_dict() for u in users], "total": len(users)}), 200


@admin_bp.get("/users")
@jwt_required()
@admin_required
def all_users():
    """Bütün istifadəçilər."""
    status = request.args.get("status")
    page = request.args.get("page", 1, type=int)
    per_page = request.args.get("perPage", 20, type=int)

    query = User.query.filter(User.role != "admin")
    if status:
        query = query.filter_by(status=status)

    pagination = query.order_by(User.created_at.desc()).paginate(
        page=page, per_page=per_page, error_out=False
    )
    return jsonify({
        "users": [u.to_dict() for u in pagination.items],
        "total": pagination.total,
        "page": page,
        "pages": pagination.pages,
    }), 200


@admin_bp.get("/users/<int:user_id>")
@jwt_required()
@admin_required
def get_user(user_id):
    """İstifadəçi detalları."""
    user = User.query.get_or_404(user_id)
    return jsonify({"user": user.to_dict()}), 200


@admin_bp.patch("/users/<int:user_id>/verify")
@jwt_required()
@admin_required
def verify_user(user_id):
    """İstifadəçini təsdiqlə."""
    user = User.query.get_or_404(user_id)
    data = request.get_json()
    action = data.get("action")

    if action == "approve":
        user.status = "approved"
        message = "User verified."
    elif action == "reject":
        user.status = "blocked"
        message = "User rejected."
    elif action == "block":
        user.status = "blocked"
        message = "User blocked."
    elif action == "unblock":
        user.status = "approved"
        message = "User unblocked."
    else:
        return jsonify({"message": "Invalid action."}), 400

    db.session.commit()
    return jsonify({"message": message, "user": user.to_dict()}), 200


@admin_bp.get("/reports")
@jwt_required()
@admin_required
def reports():
    """Admin statistics report."""
    from sqlalchemy import func

    total_users = User.query.filter(User.role != "admin").count()
    pending_users = User.query.filter_by(status="pending").count()
    approved_users = User.query.filter_by(status="approved").count()
    blocked_users = User.query.filter_by(status="blocked").count()

    total_items = Item.query.count()
    available_items = Item.query.filter_by(status="available").count()
    rented_items = Item.query.filter_by(status="rented").count()

    total_rentals = Rental.query.count()
    pending_rentals = Rental.query.filter_by(status="pending").count()
    active_rentals = Rental.query.filter_by(status="active").count()
    completed_rentals = Rental.query.filter_by(status="completed").count()

    total_revenue = db.session.query(
        func.sum(Rental.total_price)
    ).filter_by(status="completed").scalar() or 0

    return jsonify({
        "users": {
            "total": total_users,
            "pending": pending_users,
            "approved": approved_users,
            "blocked": blocked_users,
        },
        "items": {
            "total": total_items,
            "available": available_items,
            "rented": rented_items,
        },
        "rentals": {
            "total": total_rentals,
            "pending": pending_rentals,
            "active": active_rentals,
            "completed": completed_rentals,
        },
        "revenue": {
            "total": float(total_revenue),
        },
    }), 200