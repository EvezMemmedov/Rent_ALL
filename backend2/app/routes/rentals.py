from datetime import date
from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from app import db
from app.models.rental import Rental
from app.models.item import Item
from app.middleware.decorators import approved_required

rentals_bp = Blueprint("rentals", __name__)


@rentals_bp.post("")
@jwt_required()
@approved_required
def create_rental():
    """Send rental request."""
    user_id = int(get_jwt_identity())
    data = request.get_json()

    required = ["itemId", "startDate", "endDate"]
    for field in required:
        if not data.get(field):
            return jsonify({"message": f"{field} field is required."}), 400

    item = Item.query.get_or_404(data["itemId"])

    # Öz əşyasını icarəyə götürə bilməz
    if item.owner_id == user_id:
        return jsonify({"message": "You cannot rent your own item."}), 400

    # Əşyanın mövcudluğunu yoxla
    if item.status != "available":
        return jsonify({"message": "This item is not currently available."}), 400

    # Tarix hesablaması
    try:
        start = date.fromisoformat(data["startDate"])
        end = date.fromisoformat(data["endDate"])
    except ValueError:
        return jsonify({"message": "Invalid date format. Please use YYYY-MM-DD."}), 400

    if start >= end:
        return jsonify({"message": "End date must be after start date."}), 400

    if start < date.today():
        return jsonify({"message": "Start date cannot be in the past."}), 400

    days = (end - start).days
    total_price = float(item.price_per_day) * days

    rental = Rental(
        item_id=item.id,
        renter_id=user_id,
        start_date=start,
        end_date=end,
        total_price=total_price,
        message=data.get("message", ""),
        status="pending",
    )
    db.session.add(rental)
    db.session.commit()

    return jsonify({
        "message": "Rental request sent. Please wait for the owner's response.",
        "rental": rental.to_dict(include_item=True),
    }), 201


@rentals_bp.get("/my")
@jwt_required()
@approved_required
def my_rentals():
    """Mənim icarelerim (renter olaraq)."""
    user_id = int(get_jwt_identity())
    rentals = (
        Rental.query
        .filter_by(renter_id=user_id)
        .order_by(Rental.created_at.desc())
        .all()
    )
    return jsonify({
        "rentals": [r.to_dict(include_item=True) for r in rentals]
    }), 200


@rentals_bp.get("/owner/<int:item_id>")
@jwt_required()
@approved_required
def owner_requests(item_id):
    """Sahibin esyasina gelen icare sorgulari."""
    user_id = int(get_jwt_identity())
    item = Item.query.get_or_404(item_id)

    if item.owner_id != user_id:
        return jsonify({"message": "This item does not belong to you."}), 403

    rentals = (
        Rental.query
        .filter_by(item_id=item_id)
        .order_by(Rental.created_at.desc())
        .all()
    )
    return jsonify({
        "rentals": [r.to_dict(include_renter=True) for r in rentals]
    }), 200


@rentals_bp.patch("/<int:rental_id>/status")
@jwt_required()
@approved_required
def update_rental_status(rental_id):
    """İcare sorğusunun statusunu deyiş (approve/reject/cancel)."""
    user_id = int(get_jwt_identity())
    rental = Rental.query.get_or_404(rental_id)
    data = request.get_json()
    new_status = data.get("status")

    allowed_statuses = ["approved", "rejected", "cancelled", "completed"]
    if new_status not in allowed_statuses:
        return jsonify({"message": "Invalid status."}), 400

    item = Item.query.get(rental.item_id)

    # Approve/Reject — yalnız sahibi edə bilər
    if new_status in ["approved", "rejected"]:
        if item.owner_id != user_id:
            return jsonify({"message": "Only the owner can respond to this rental request."}), 403
        if rental.status != "pending":
            return jsonify({"message": "Only pending requests can be updated."}), 400

        rental.status = new_status
        if new_status == "approved":
            item.status = "rented"

    # Cancel — renter edə bilər
    elif new_status == "cancelled":
        if rental.renter_id != user_id:
            return jsonify({"message": "Only the renter can cancel this rental request."}), 403
        rental.status = "cancelled"
        if item.status == "rented":
            item.status = "available"

    # Complete — sahibi edə bilər
    elif new_status == "completed":
        if item.owner_id != user_id:
            return jsonify({"message": "Only the owner can mark this rental as completed."}), 403
        rental.status = "completed"
        item.status = "available"

    db.session.commit()
    return jsonify({
        "message": f"Rental status updated to '{new_status}'.",
        "rental": rental.to_dict(),
    }), 200

@rentals_bp.get("/booked-dates/<int:item_id>")
@jwt_required()
def get_booked_dates(item_id):
    from datetime import timedelta
    
    rentals = Rental.query.filter(
        Rental.item_id == item_id,
        Rental.status.in_(["pending", "approved"])
    ).all()

    booked_dates = []
    for rental in rentals:
        current = rental.start_date
        while current <= rental.end_date:
            booked_dates.append(current.isoformat())
            current += timedelta(days=1)

    return jsonify({"bookedDates": booked_dates}), 200