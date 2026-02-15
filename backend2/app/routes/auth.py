from flask import Blueprint, request, jsonify
from flask_jwt_extended import (
    create_access_token,
    create_refresh_token,
    jwt_required,
    get_jwt_identity,
)
from app import db, bcrypt
from app.models.user import User

auth_bp = Blueprint("auth", __name__)


@auth_bp.post("/register")
def register():
    # FormData ilə işlə
    name = request.form.get('name') or request.json.get('name') if request.is_json else request.form.get('name')
    email = request.form.get('email') or (request.json.get('email') if request.is_json else None)
    password = request.form.get('password') or (request.json.get('password') if request.is_json else None)

    if request.is_json:
        data = request.get_json()
        name = data.get('name')
        email = data.get('email')
        password = data.get('password')

    if not name or not email or not password:
        return jsonify({"message": "name, email və password tələb olunur."}), 400

    if len(password) < 6:
        return jsonify({"message": "Şifrə ən azı 6 simvol olmalıdır."}), 400

    if User.query.filter_by(email=email.lower()).first():
        return jsonify({"message": "Bu email artıq qeydiyyatdan keçib."}), 409

    password_hash = bcrypt.generate_password_hash(password).decode("utf-8")
    user = User(
        name=name.strip(),
        email=email.lower().strip(),
        password_hash=password_hash,
        status="pending",
        role="user",
    )
    db.session.add(user)
    db.session.flush()

    # ID şəkillərini yüklə
    from app.routes.uploads import save_image
    if 'idCardFront' in request.files:
        url, _ = save_image(request.files['idCardFront'], 'ids')
        if url:
            user.id_card_front = url
    if 'idCardBack' in request.files:
        url, _ = save_image(request.files['idCardBack'], 'ids')
        if url:
            user.id_card_back = url

    db.session.commit()

    return jsonify({
        "message": "Qeydiyyat uğurlu oldu. Admin təsdiqini gözləyin.",
        "user": user.to_dict(),
    }), 201


@auth_bp.post("/login")
def login():
    data = request.get_json()

    if not data.get("email") or not data.get("password"):
        return jsonify({"message": "Email və şifrə tələb olunur."}), 400

    user = User.query.filter_by(email=data["email"].lower()).first()

    if not user or not bcrypt.check_password_hash(user.password_hash, data["password"]):
        return jsonify({"message": "Email və ya şifrə yanlışdır."}), 401

    if user.status == "pending":
        return jsonify({
            "message": "Hesabınız hələ admin tərəfindən təsdiqlənməyib.",
            "status": "pending",
        }), 403

    if user.status == "blocked":
        return jsonify({"message": "Hesabınız bloklanmışdır. Admin ilə əlaqə saxlayın."}), 403

    # Token yarat
    access_token = create_access_token(identity=str(user.id))
    refresh_token = create_refresh_token(identity=str(user.id))

    return jsonify({
        "message": "Uğurla daxil oldunuz.",
        "accessToken": access_token,
        "refreshToken": refresh_token,
        "user": user.to_dict(),
    }), 200


@auth_bp.get("/me")
@jwt_required()
def me():
    user_id = get_jwt_identity()
    user = User.query.get(user_id)
    if not user:
        return jsonify({"message": "İstifadəçi tapılmadı."}), 404
    return jsonify({"user": user.to_dict()}), 200


@auth_bp.post("/refresh")
@jwt_required(refresh=True)
def refresh():
    user_id = get_jwt_identity()
    access_token = create_access_token(identity=user_id)
    return jsonify({"accessToken": access_token}), 200


@auth_bp.post("/logout")
@jwt_required()
def logout():
    # Client tərəfdə token silinir, serverdə blacklist lazım deyil (sadə versiya)
    return jsonify({"message": "Uğurla çıxdınız."}), 200