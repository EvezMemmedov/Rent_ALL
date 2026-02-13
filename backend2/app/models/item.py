from datetime import datetime, timezone
from app import db


class Item(db.Model):
    __tablename__ = "items"

    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(200), nullable=False)
    description = db.Column(db.Text, nullable=True)
    price_per_day = db.Column(db.Numeric(10, 2), nullable=False)
    category = db.Column(db.String(100), nullable=False)
    location = db.Column(db.String(200), nullable=True)

    # Status: "available" | "rented" | "unavailable"
    status = db.Column(db.String(20), nullable=False, default="available")

    # JSON string olaraq saxlanır: '["img1.jpg","img2.jpg"]'
    images = db.Column(db.Text, nullable=True)

    owner_id = db.Column(db.Integer, db.ForeignKey("users.id"), nullable=False)

    created_at = db.Column(db.DateTime, default=lambda: datetime.now(timezone.utc))
    updated_at = db.Column(
        db.DateTime,
        default=lambda: datetime.now(timezone.utc),
        onupdate=lambda: datetime.now(timezone.utc),
    )

    # Relations
    owner = db.relationship("User", back_populates="items", foreign_keys=[owner_id])
    rentals = db.relationship("Rental", back_populates="item", lazy="dynamic")
    reviews = db.relationship("Review", back_populates="item", lazy="dynamic")

    def get_images(self):
        import json
        if self.images:
            try:
                return json.loads(self.images)
            except Exception:
                return []
        return []

    def set_images(self, images_list):
        import json
        self.images = json.dumps(images_list)

    def to_dict(self, include_owner=False):
        data = {
            "id": self.id,
            "title": self.title,
            "description": self.description,
            "pricePerDay": float(self.price_per_day),
            "category": self.category,
            "location": self.location,
            "status": self.status,
            "images": self.get_images(),
            "ownerId": self.owner_id,
            "createdAt": self.created_at.isoformat() if self.created_at else None,
        }
        if include_owner and self.owner:
            data["owner"] = {
                "id": self.owner.id,
                "name": self.owner.name,
                "avatar": self.owner.avatar,
            }
        return data

    def __repr__(self):
        return f"<Item {self.title}>"