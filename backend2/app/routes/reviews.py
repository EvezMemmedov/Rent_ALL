from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from app import db
from app.models.review import Review
from app.models.rental import Rental
from app.models.item import Item
from app.middleware.decorators import approved_required

reviews_bp = Blueprint("reviews", __name__)

@reviews_bp.post("")
@jwt_required()
@approved_required
def create_review():
    user_id = int(get_jwt_identity())
    data = request.get_json()

    rental_id = data.get("rentalId")
    rating = data.get("rating")
    comment = data.get("comment", "")

    if not rental_id or not rating:
        return jsonify({"message": "rentalId və rating tələb olunur."}), 400

    rental = Rental.query.get_or_404(rental_id)

    # Yalnız renter rəy yaza bilər
    if rental.renter_id != user_id:
        return jsonify({"message": "Yalnız kirayəçi rəy yaza bilər."}), 403

    # Yalnız approved rentallar üçün
    if rental.status != "approved":
        return jsonify({"message": "Yalnız təsdiqlənmiş kirayələr üçün rəy yazıla bilər."}), 400

    # Eyni rental üçün ikinci dəfə rəy yazılmasın
    existing = Review.query.filter_by(rental_id=rental_id, reviewer_id=user_id).first()
    if existing:
        return jsonify({"message": "Bu kirayə üçün artıq rəy yazmısınız."}), 400

    review = Review(
        item_id=rental.item_id,
        reviewer_id=user_id,
        rental_id=rental_id,
        rating=rating,
        comment=comment,
    )
    db.session.add(review)
    db.session.commit()

    return jsonify({"message": "Rəy uğurla əlavə edildi.", "review": review.to_dict()}), 201