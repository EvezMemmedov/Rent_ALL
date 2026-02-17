import os
import uuid
from flask import Blueprint, request, jsonify, current_app, send_from_directory
from flask_jwt_extended import jwt_required
from PIL import Image

uploads_bp = Blueprint("uploads", __name__)

ALLOWED_EXTENSIONS = {"jpg", "jpeg", "png", "webp", "gif"}


def allowed_file(filename):
    return "." in filename and filename.rsplit(".", 1)[1].lower() in ALLOWED_EXTENSIONS


def save_image(file, subfolder="items"):
    if not allowed_file(file.filename):
        return None, "Yalnız JPG, PNG, WEBP, GIF faylları qəbul olunur."

    ext = file.filename.rsplit(".", 1)[1].lower()
    filename = f"{uuid.uuid4().hex}.{ext}"

    upload_folder = current_app.config["UPLOAD_FOLDER"]
    subfolder_path = os.path.join(upload_folder, subfolder)
    os.makedirs(subfolder_path, exist_ok=True)

    filepath = os.path.join(subfolder_path, filename)

    img = Image.open(file)
    img = img.convert("RGB")
    max_size = (1200, 1200)
    img.thumbnail(max_size, Image.LANCZOS)
    img.save(filepath, optimize=True, quality=85)

    return f"/api/uploads/{subfolder}/{filename}", None


@uploads_bp.post("/image")
@jwt_required()
def upload_image():
    if "file" not in request.files:
        return jsonify({"message": "Fayl tapılmadı."}), 400

    file = request.files["file"]
    if file.filename == "":
        return jsonify({"message": "Fayl seçilməyib."}), 400

    subfolder = request.form.get("type", "items")
    url, error = save_image(file, subfolder)

    if error:
        return jsonify({"message": error}), 400

    return jsonify({"url": url, "message": "Şəkil yükləndi."}), 201


@uploads_bp.post("/images")
@jwt_required()
def upload_multiple_images():
    files = request.files.getlist("files")

    if not files:
        return jsonify({"message": "Fayl tapılmadı."}), 400

    if len(files) > 10:
        return jsonify({"message": "Maksimum 10 fayl yükləyə bilərsiniz."}), 400

    urls = []
    for file in files:
        if file.filename:
            url, error = save_image(file, "items")
            if error:
                return jsonify({"message": error}), 400
            urls.append(url)

    return jsonify({"urls": urls, "message": f"{len(urls)} şəkil yükləndi."}), 201


@uploads_bp.get("/ids/<filename>")
def serve_id_file(filename):
    upload_folder = os.path.abspath(current_app.config["UPLOAD_FOLDER"])
    ids_path = os.path.join(upload_folder, "ids")
    return send_from_directory(ids_path, filename)


@uploads_bp.get("/items/<filename>")
def serve_item_file(filename):
    upload_folder = os.path.abspath(current_app.config["UPLOAD_FOLDER"])
    items_path = os.path.join(upload_folder, "items")
    return send_from_directory(items_path, filename)


@uploads_bp.get("/avatars/<filename>")
def serve_avatar_file(filename):
    upload_folder = os.path.abspath(current_app.config["UPLOAD_FOLDER"])
    avatars_path = os.path.join(upload_folder, "avatars")
    return send_from_directory(avatars_path, filename)