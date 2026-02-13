from datetime import datetime, timezone
from app import db


class User(db.Model):
    __tablename__ = "users"

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    email = db.Column(db.String(120), unique=True, nullable=False, index=True)
    password_hash = db.Column(db.String(255), nullable=False)
    phone = db.Column(db.String(20), nullable=True)
    avatar = db.Column(db.String(255), nullable=True)
    bio = db.Column(db.Text, nullable=True)

    # Role: "user" | "admin"
    role = db.Column(db.String(20), nullable=False, default="user")

    # Status: "pending" | "approved" | "blocked"
    status = db.Column(db.String(20), nullable=False, default="pending")

    created_at = db.Column(db.DateTime, default=lambda: datetime.now(timezone.utc))
    updated_at = db.Column(
        db.DateTime,
        default=lambda: datetime.now(timezone.utc),
        onupdate=lambda: datetime.now(timezone.utc),
    )

    # Relations
    items = db.relationship("Item", back_populates="owner", lazy="dynamic",
                            foreign_keys="Item.owner_id")
    rentals_as_renter = db.relationship("Rental", back_populates="renter", lazy="dynamic",
                                        foreign_keys="Rental.renter_id")
    reviews_given = db.relationship("Review", back_populates="reviewer", lazy="dynamic",
                                    foreign_keys="Review.reviewer_id")

    def to_dict(self, include_private=False):
        data = {
            "id": self.id,
            "name": self.name,
            "email": self.email,
            "phone": self.phone,
            "avatar": self.avatar,
            "bio": self.bio,
            "role": self.role,
            "status": self.status,
            "createdAt": self.created_at.isoformat() if self.created_at else None,
        }
        return data

    def __repr__(self):
        return f"<User {self.email}>"