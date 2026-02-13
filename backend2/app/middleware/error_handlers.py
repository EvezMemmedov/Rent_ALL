from flask import jsonify
from werkzeug.exceptions import HTTPException


def register_error_handlers(app):

    @app.errorhandler(400)
    def bad_request(e):
        return jsonify({"message": "Yanlış sorğu."}), 400

    @app.errorhandler(403)
    def forbidden(e):
        return jsonify({"message": "Bu əməliyyat üçün icazəniz yoxdur."}), 403

    @app.errorhandler(404)
    def not_found(e):
        return jsonify({"message": "Axtardığınız məlumat tapılmadı."}), 404

    @app.errorhandler(413)
    def request_entity_too_large(e):
        return jsonify({"message": "Fayl həcmi çox böyükdür. Maksimum 5MB."}), 413

    @app.errorhandler(500)
    def internal_server_error(e):
        return jsonify({"message": "Server xətası. Zəhmət olmasa bir az sonra yenidən cəhd edin."}), 500

    @app.errorhandler(HTTPException)
    def handle_http_exception(e):
        return jsonify({"message": e.description}), e.code