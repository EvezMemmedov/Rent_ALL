from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from app import db
from app.models.message import Message

messages_bp = Blueprint("messages", __name__)

# Mesaj göndər
@messages_bp.post("/")
@jwt_required()
def send_message():
    current_user_id = get_jwt_identity()
    data = request.get_json()
    
    msg = Message(
        sender_id=current_user_id,
        receiver_id=data["receiver_id"],
        content=data["content"]
    )
    db.session.add(msg)
    db.session.commit()
    return jsonify(msg.to_dict()), 201

# İki user arasındakı mesajları gətir
@messages_bp.get("/<int:user_id>")
@jwt_required()
def get_conversation(user_id):
    current_user_id = int(get_jwt_identity())
    
    messages = Message.query.filter(
        ((Message.sender_id == current_user_id) & (Message.receiver_id == user_id)) |
        ((Message.sender_id == user_id) & (Message.receiver_id == current_user_id))
    ).order_by(Message.created_at.asc()).all()
    
    # Oxunmamış mesajları oxunmuş et
    for msg in messages:
        if msg.receiver_id == current_user_id and not msg.is_read:
            msg.is_read = True
    db.session.commit()
    
    return jsonify([m.to_dict() for m in messages])

# Bütün söhbətləri gətir
@messages_bp.get("/conversations")
@jwt_required()
def get_conversations():
    current_user_id = get_jwt_identity()
    
    messages = Message.query.filter(
        (Message.sender_id == current_user_id) | (Message.receiver_id == current_user_id)
    ).order_by(Message.created_at.desc()).all()
    
    return jsonify([m.to_dict() for m in messages])

# Mesaj sil
@messages_bp.delete("/<int:msg_id>")
@jwt_required()
def delete_message(msg_id):
    current_user_id = int(get_jwt_identity())
    msg = Message.query.get_or_404(msg_id)
    if msg.sender_id != current_user_id:
        return jsonify({"error": "İcazə yoxdur"}), 403
    db.session.delete(msg)
    db.session.commit()
    return jsonify({"success": True})

# Oxunmamış mesaj sayı
@messages_bp.get("/unread-count")
@jwt_required()
def unread_count():
    current_user_id = int(get_jwt_identity())
    count = Message.query.filter_by(receiver_id=current_user_id, is_read=False).count()
    return jsonify({"count": count})