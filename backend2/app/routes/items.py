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
    # Query parametrləri
    search = request.args.get("search", "").strip()
    category = request.args.get("category", "").strip()
    min_price = request.args.get("minPrice", type=float)
    max_price = request.args.get("maxPrice", type=float)
    sort_by = request.args.get("sortBy", "newest")
    page = request.args.get("page", 1, type=int)
    per_page = request.args.get("perPage", 12, type=int)

    query = Item.query.filter_by(status="available")

    # Axtarış
    if search:
        query = query.filter(
            Item.title.ilike(f"%{search}%") | Item.description.ilike(f"%{search}%")
        )

    # Kateqoriya filteri
    if category:
        query = query.filter_by(category=category)

    # Qiymət filteri
    if min_price is not None:
        query = query.filter(Item.price_per_day >= min_price)
    if max_price is not None:
        query = query.filter(Item.price_per_day <= max_price)

    # Sıralama
    if sort_by == "price_asc":
        query = query.order_by(Item.price_per_day.asc())
    elif sort_by == "price_desc":
        query = query.order_by(Item.price_per_day.desc())
    else:  # newest
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
    """Cari istifadəçinin öz əşyaları."""
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

    # Rəylər əlavə et
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
    """Əşyanı sil (yalnız sahibi edə bilər)."""
    user_id = int(get_jwt_identity())
    item = Item.query.get_or_404(item_id)

    if item.owner_id != user_id:
        return jsonify({"message": "Bu əşyani yalnız sahibi silə bilər."}), 403

    db.session.delete(item)
    db.session.commit()
    return jsonify({"message": "Əşya silindi."}), 200