from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from app import db
from app.models.item import Item
from app.models.user import User
from app.middleware.decorators import approved_required

items_bp = Blueprint("items", __name__)


@items_bp.get("")
@jwt_required()
@approved_required
def browse_items():
    """Bütün əşyaları gəz — axtarış, filtr, sort dəstəyi ilə."""
    search = request.args.get("search", "").strip()
    category = request.args.get("category", "").strip()
    min_price = request.args.get("minPrice", type=float)
    max_price = request.args.get("maxPrice", type=float)
    sort_by = request.args.get("sortBy", "newest")
    page = request.args.get("page", 1, type=int)
    per_page = request.args.get("perPage", 12, type=int)

    query = Item.query.filter_by(status="available", is_hidden=False)

    if search:
        query = query.filter(
            Item.title.ilike(f"%{search}%") | Item.description.ilike(f"%{search}%")
        )

    if category:
        query = query.filter_by(category=category)

    if min_price is not None:
        query = query.filter(Item.price_per_day >= min_price)
    if max_price is not None:
        query = query.filter(Item.price_per_day <= max_price)

    if sort_by == "price_asc":
        query = query.order_by(Item.price_per_day.asc())
    elif sort_by == "price_desc":
        query = query.order_by(Item.price_per_day.desc())
    else:
        query = query.order_by(Item.created_at.desc())

    pagination = query.paginate(page=page, per_page=per_page, error_out=False)

    return jsonify({
        "items": [item.to_dict(include_owner=True) for item in pagination.items],
        "total": pagination.total,
        "page": page,
        "perPage": per_page,
        "pages": pagination.pages,
    }), 200


@items_bp.get("/my")
@jwt_required()
@approved_required
def my_items():
    """Cari istifadəçinin öz əşyaları — gizli olanlar da görünsün."""
    user_id = int(get_jwt_identity())
    items = Item.query.filter_by(owner_id=user_id).order_by(Item.created_at.desc()).all()
    return jsonify({"items": [item.to_dict() for item in items]}), 200


@items_bp.get("/<int:item_id>")
@jwt_required()
@approved_required
def get_item(item_id):
    """Əşya detalları."""
    item = Item.query.get_or_404(item_id)
    data = item.to_dict(include_owner=True)

    reviews = [r.to_dict() for r in item.reviews.order_by(None).all()]
    data["reviews"] = reviews
    data["avgRating"] = (
        round(sum(r["rating"] for r in reviews) / len(reviews), 1) if reviews else None
    )
    return jsonify({"item": data}), 200


@items_bp.post("")
@jwt_required()
@approved_required
def create_item():
    """Yeni əşya əlavə et."""
    user_id = int(get_jwt_identity())
    data = request.get_json()

    required = ["title", "pricePerDay", "category"]
    for field in required:
        if not data.get(field):
            return jsonify({"message": f"{field} sahəsi tələb olunur."}), 400

    import json
    item = Item(
        title=data["title"].strip(),
        description=data.get("description", ""),
        price_per_day=data["pricePerDay"],
        category=data["category"],
        location=data.get("location", ""),
        owner_id=user_id,
        status="available",
        images=json.dumps(data.get("images", [])),
    )
    db.session.add(item)
    db.session.commit()

    return jsonify({"message": "Əşya uğurla əlavə edildi.", "item": item.to_dict()}), 201


@items_bp.put("/<int:item_id>")
@jwt_required()
@approved_required
def update_item(item_id):
    """Əşyanı yenilə (yalnız sahibi edə bilər)."""
    user_id = int(get_jwt_identity())
    item = Item.query.get_or_404(item_id)

    if item.owner_id != user_id:
        return jsonify({"message": "Bu əşyani yalnız sahibi dəyişə bilər."}), 403

    data = request.get_json()
    import json

    if "title" in data:
        item.title = data["title"].strip()
    if "description" in data:
        item.description = data["description"]
    if "pricePerDay" in data:
        item.price_per_day = data["pricePerDay"]
    if "category" in data:
        item.category = data["category"]
    if "location" in data:
        item.location = data["location"]
    if "status" in data:
        item.status = data["status"]
    if "images" in data:
        item.images = json.dumps(data["images"])

    db.session.commit()
    return jsonify({"message": "Əşya yeniləndi.", "item": item.to_dict()}), 200


@items_bp.delete("/<int:item_id>")
@jwt_required()
@approved_required
def delete_item(item_id):
    """Delete item (only the owner can do this)."""
    user_id = int(get_jwt_identity())
    item = Item.query.get_or_404(item_id)

    if item.owner_id != user_id:
        return jsonify({"message": "This item can only be deleted by its owner."}), 403

    db.session.delete(item)
    db.session.commit()
    return jsonify({"message": "Item deleted successfully."}), 200


@items_bp.patch("/<int:item_id>/hide")
@jwt_required()
@approved_required
def toggle_hide_listing(item_id):
    """Listing-i gizlət və ya göstər (yalnız sahibi edə bilər)."""
    user_id = int(get_jwt_identity())
    item = Item.query.get_or_404(item_id)

    if item.owner_id != user_id:
        return jsonify({"message": "Bu əşyanı yalnız sahibi dəyişə bilər."}), 403

    item.is_hidden = not item.is_hidden
    db.session.commit()

    status = "hidden" if item.is_hidden else "visible"
    return jsonify({
        "success": True,
        "isHidden": item.is_hidden,
        "message": f"Listing {status} edildi."
    }), 200

@items_bp.post("/<int:item_id>/reviews")
@jwt_required()
@approved_required
def create_review(item_id):
    """Məhsula rəy yaz (yalnız completed rental olanlar)."""
    user_id = int(get_jwt_identity())
    data = request.get_json()
    
    from app.models.rental import Rental
    rental = Rental.query.filter_by(
        item_id=item_id,
        renter_id=user_id,
        status='completed'
    ).first()
    
    if not rental:
        return jsonify({"message": "Bu məhsula rəy yazmaq üçün əvvəlcə icarəni tamamlamalısınız."}), 403
    
    from app.models.review import Review
    existing = Review.query.filter_by(rental_id=rental.id).first()
    if existing:
        return jsonify({"message": "Bu icarə üçün artıq rəy yazmısınız."}), 400
    
    rating = data.get("rating")
    if not rating or not (1 <= rating <= 5):
        return jsonify({"message": "Rating 1-5 arasında olmalıdır."}), 400
    
    review = Review(
        item_id=item_id,
        reviewer_id=user_id,
        rental_id=rental.id,
        rating=rating,
        comment=data.get("comment", "")
    )
    db.session.add(review)
    db.session.commit()
    
    return jsonify({"message": "Rəy əlavə edildi.", "review": review.to_dict()}), 201