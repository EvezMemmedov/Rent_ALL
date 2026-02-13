from flask import jsonify


def register_jwt_handlers(jwt):

    @jwt.unauthorized_loader
    def unauthorized_callback(error):
        return jsonify({"message": "Token tapılmadı. Zəhmət olmasa daxil olun."}), 401

    @jwt.invalid_token_loader
    def invalid_token_callback(error):
        return jsonify({"message": "Token etibarsızdır."}), 401

    @jwt.expired_token_loader
    def expired_token_callback(jwt_header, jwt_payload):
        return jsonify({"message": "Token müddəti bitib. Yenidən daxil olun."}), 401

    @jwt.revoked_token_loader
    def revoked_token_callback(jwt_header, jwt_payload):
        return jsonify({"message": "Token ləğv edilib."}), 401