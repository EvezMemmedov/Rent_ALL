from datetime import datetime, timezone
from app import db


class Rental(db.Model):
    __tablename__ = "rentals"

    id = db.Column(db.Integer, primary_key=True)

    item_id = db.Column(db.Integer, db.ForeignKey("items.id"), nullable=False)
    renter_id = db.Column(db.Integer, db.ForeignKey("users.id"), nullable=False)

    start_date = db.Column(db.Date, nullable=False)
    end_date = db.Column(db.Date, nullable=False)
    total_price = db.Column(db.Numeric(10, 2), nullable=False)

    # Status: "pending" | "approved" | "rejected" | "active" | "completed" | "cancelled"
    status = db.Column(db.String(20), nullable=False, default="pending")

    message = db.Column(db.Text, nullable=True)

    created_at = db.Column(db.DateTime, default=lambda: datetime.now(timezone.utc))
    updated_at = db.Column(
        db.DateTime,
        default=lambda: datetime.now(timezone.utc),
        onupdate=lambda: datetime.now(timezone.utc),
    )

    # Relations
    item = db.relationship("Item", back_populates="rentals")
    renter = db.relationship("User", back_populates="rentals_as_renter",
                             foreign_keys=[renter_id])

    def to_dict(self, include_item=False, include_renter=False):
        data = {
            "id": self.id,
            "itemId": self.item_id,
            "renterId": self.renter_id,
            "startDate": self.start_date.isoformat() if self.start_date else None,
            "endDate": self.end_date.isoformat() if self.end_date else None,
            "totalPrice": float(self.total_price),
            "status": self.status,
            "message": self.message,
            "createdAt": self.created_at.isoformat() if self.created_at else None,
        }
        if include_item and self.item:
            data["item"] = self.item.to_dict()
        if include_renter and self.renter:
            data["renter"] = {
                "id": self.renter.id,
                "name": self.renter.name,
                "avatar": self.renter.avatar,
                "phone": self.renter.phone,
            }
        return data

    def __repr__(self):
        return f"<Rental item={self.item_id} renter={self.renter_id} status={self.status}>"