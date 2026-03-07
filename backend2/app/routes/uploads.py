import cloudinary
import cloudinary.uploader
from flask import Blueprint, request, jsonify, current_app
from flask_jwt_extended import jwt_required

uploads_bp = Blueprint("uploads", __name__)

ALLOWED_EXTENSIONS = {"jpg", "jpeg", "png", "webp", "gif"}


def allowed_file(filename):
    return "." in filename and filename.rsplit(".", 1)[1].lower() in ALLOWED_EXTENSIONS


def save_image(file, subfolder="items"):
    if not allowed_file(file.filename):
        return None, "Only JPG, PNG, WEBP, and GIF files are allowed."

    # Cloudinary konfiqurasiyası
    cloudinary.config(
        cloud_name=current_app.config["CLOUDINARY_CLOUD_NAME"],
        api_key=current_app.config["CLOUDINARY_API_KEY"],
        api_secret=current_app.config["CLOUDINARY_API_SECRET"],
        secure=True
    )

    try:
        # Cloudinary-ə yüklə
        upload_result = cloudinary.uploader.upload(
            file,
            folder=f"rentall/{subfolder}",
            resource_type="image"
        )
        return upload_result["secure_url"], None
    except Exception as e:
        print(f"Cloudinary upload error: {e}")
        return None, "Şəkil yüklənərkən xəta baş verdi."


@uploads_bp.post("/image")
@jwt_required()
def upload_image():
    if "file" not in request.files:
        return jsonify({"message": "File not found."}), 400

    file = request.files["file"]
    if file.filename == "":
        return jsonify({"message": "No file selected."}), 400

    subfolder = request.form.get("type", "items")
    url, error = save_image(file, subfolder)

    if error:
        return jsonify({"message": error}), 400

    return jsonify({"url": url, "message": "Image uploaded successfully."}), 201


@uploads_bp.post("/images")
@jwt_required()
def upload_multiple_images():
    files = request.files.getlist("files")

    if not files:
        return jsonify({"message": "File not found."}), 400

    if len(files) > 10:
        return jsonify({"message": "Maximum 10 files can be uploaded."}), 400

    urls = []
    for file in files:
        if file.filename:
            url, error = save_image(file, "items")
            if error:
                return jsonify({"message": error}), 400
            urls.append(url)

    return jsonify({"urls": urls, "message": f"{len(urls)} images uploaded successfully."}), 201


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