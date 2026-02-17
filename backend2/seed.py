"""
Verilenler bazasina başlanğic data elave et.
İstifadə: python seed.py
"""
import os
from app import create_app, db, bcrypt
from app.models.user import User
from app.models.item import Item
import json

app = create_app(os.getenv("FLASK_ENV", "development"))


def seed():
    with app.app_context():
        print("🌱 Seeding started...")

        # Admin istifadəçi
        if not User.query.filter_by(email="admin@rentall.az").first():
            admin = User(
                name="Admin",
                email="admin@rentall.az",
                password_hash=bcrypt.generate_password_hash("admin123").decode("utf-8"),
                role="admin",
                status="approved",
            )
            db.session.add(admin)
            print("Admin created: admin@rentall.az / admin123")

        # Test istifadəçi
        test_user = User.query.filter_by(email="test@rentall.az").first()
        if not test_user:
            test_user = User(
                name="Test User",
                email="test@rentall.az",
                password_hash=bcrypt.generate_password_hash("test123").decode("utf-8"),
                role="user",
                status="approved",
                phone="+994501234567",
                bio="Test account",
            )
            db.session.add(test_user)
            db.session.flush()
            print("Test user created: test@rentall.az / test123")

            # Test əşyalar
            items = [
                Item(
                    title="Kamera Canon EOS 5D",
                    description="Professional fotokamera, bütün aksessuarlar daxil",
                    price_per_day=50.00,
                    category="Electronics",
                    location="Bakı, Nəsimi",
                    owner_id=test_user.id,
                    images=json.dumps([]),
                ),
                Item(
                    title="Dağ velosipedi",
                    description="21 sürətli, yaxşı vəziyyətdə",
                    price_per_day=20.00,
                    category="Sports",
                    location="Bakı, Yasamal",
                    owner_id=test_user.id,
                    images=json.dumps([]),
                ),
                Item(
                    title="Elektrik drel",
                    description="Bosch, 18V, şarjla birlikdə",
                    price_per_day=15.00,
                    category="Tools",
                    location="Bakı, Sabunçu",
                    owner_id=test_user.id,
                    images=json.dumps([]),
                ),
            ]
            for item in items:
                db.session.add(item)
            print(f"✅ {len(items)} test əşya yaradıldı")

        db.session.commit()
        print("Seed tamamlandı!")


if __name__ == "__main__":
    seed()