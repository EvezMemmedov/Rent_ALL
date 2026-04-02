from datetime import datetime, timezone
from app import db


class Review(db.Model):
    __tablename__ = "reviews"

    id = db.Column(db.Integer, primary_key=True)

    item_id = db.Column(db.Integer, db.ForeignKey("items.id"), nullable=False)
    reviewer_id = db.Column(db.Integer, db.ForeignKey("users.id"), nullable=False)
    rental_id = db.Column(db.Integer, db.ForeignKey("rentals.id"), nullable=True)

    rating = db.Column(db.Integer, nullable=False)
    comment = db.Column(db.Text, nullable=True)

    created_at = db.Column(db.DateTime, default=lambda: datetime.now(timezone.utc))

    # Relations
    item = db.relationship("Item", back_populates="reviews")
    reviewer = db.relationship("User", back_populates="reviews_given",
                               foreign_keys=[reviewer_id])

    def to_dict(self):
        return {
            "id": self.id,
            "itemId": self.item_id,
            "reviewerId": self.reviewer_id,
            "rentalId": self.rental_id,
            "rating": self.rating,
            "comment": self.comment,
            "createdAt": self.created_at.isoformat() + "Z" if self.created_at else None,
            "reviewer": {
                "id": self.reviewer.id,
                "name": self.reviewer.name,
                "avatar": self.reviewer.avatar,
            } if self.reviewer else None,
        }

    def __repr__(self):
        return f"<Review item={self.item_id} rating={self.rating}>"