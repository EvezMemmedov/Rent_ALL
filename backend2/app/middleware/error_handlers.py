from flask import jsonify
from werkzeug.exceptions import HTTPException


def register_error_handlers(app):

    @app.errorhandler(400)
    def bad_request(e):
        return jsonify({"message": "Bad request."}), 400

    @app.errorhandler(403)
    def forbidden(e):
        return jsonify({"message": "You do not have permission to perform this operation."}), 403

    @app.errorhandler(404)
    def not_found(e):
        return jsonify({"message": "The requested data was not found."}), 404

    @app.errorhandler(413)
    def request_entity_too_large(e):
        return jsonify({"message": "File size is too large. Maximum 5MB."}), 413

    @app.errorhandler(500)
    def internal_server_error(e):
        return jsonify({"message": "Server error. Please try again later."}), 500

    @app.errorhandler(HTTPException)
    def handle_http_exception(e):
        return jsonify({"message": e.description}), e.code