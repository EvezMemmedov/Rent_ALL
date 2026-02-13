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
    """Şəkili yüklə, ölçüsünü optimallaşdır və saxla."""
    if not allowed_file(file.filename):
        return None, "Yalnız JPG, PNG, WEBP, GIF faylları qəbul olunur."

    ext = file.filename.rsplit(".", 1)[1].lower()
    filename = f"{uuid.uuid4().hex}.{ext}"

    upload_folder = current_app.config["UPLOAD_FOLDER"]
    subfolder_path = os.path.join(upload_folder, subfolder)
    os.makedirs(subfolder_path, exist_ok=True)

    filepath = os.path.join(subfolder_path, filename)

    # Pillow ilə ölçü optimallaşdırması
    img = Image.open(file)
    img = img.convert("RGB")

    # Maksimum 1200x1200
    max_size = (1200, 1200)
    img.thumbnail(max_size, Image.LANCZOS)
    img.save(filepath, optimize=True, quality=85)

    return f"/api/uploads/{subfolder}/{filename}", None


@uploads_bp.post("/image")
@jwt_required()
def upload_image():
    """Tək şəkil yüklə."""
    if "file" not in request.files:
        return jsonify({"message": "Fayl tapılmadı."}), 400

    file = request.files["file"]
    if file.filename == "":
        return jsonify({"message": "Fayl seçilməyib."}), 400

    subfolder = request.form.get("type", "items")  # "items" | "avatars"
    url, error = save_image(file, subfolder)

    if error:
        return jsonify({"message": error}), 400

    return jsonify({"url": url, "message": "Şəkil yükləndi."}), 201


@uploads_bp.post("/images")
@jwt_required()
def upload_multiple_images():
    """Çox şəkil yüklə (maksimum 10)."""
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


@uploads_bp.get("/<subfolder>/<filename>")
def serve_file(subfolder, filename):
    """Yüklənmiş faylı göstər."""
    upload_folder = current_app.config["UPLOAD_FOLDER"]
    return send_from_directory(os.path.join(upload_folder, subfolder), filename)