from flask import Blueprint, jsonify, request
from flask_login import login_required, current_user
from app.models import Messages, Property, Users
from app import db

messages = Blueprint('messages', __name__, url_prefix='/messages')


@messages.route('/', methods=['GET'])
@login_required
def get_messages():
    """Return all messages received by the logged-in user."""
    received = Messages.query.filter_by(receiver_id=current_user.id).all()
    
    messages_data = []
    for m in received:
        messages_data.append({
            "id": m.id,
            "sender": m.sender.username if m.sender else "Unknown",
            "property_title": m.property_re.title if m.property_re else "N/A",
            "message": m.message,
            "read": m.read,
            "timestamp": m.timestamp.strftime('%Y-%m-%d %H:%M:%S')
        })
    
    return jsonify({
        "unread_count": Messages.query.filter_by(receiver_id=current_user.id, read=False).count(),
        "messages": messages_data
    })


@messages.route('/<int:message_id>', methods=['GET'])
@login_required
def get_single_message(message_id):
    """Get one message and its conversation."""
    message = Messages.query.get_or_404(message_id)

    if message.receiver_id != current_user.id and message.sender_id != current_user.id:
        return jsonify({"error": "Unauthorized"}), 403

    conversation = Messages.query.filter(
        (Messages.sender_id == message.sender_id) & 
        (Messages.receiver_id == message.receiver_id)
    ).order_by(Messages.timestamp.asc()).all()

    convo_data = [{
        "id": m.id,
        "sender_id": m.sender_id,
        "receiver_id": m.receiver_id,
        "message": m.message,
        "timestamp": m.timestamp.strftime('%Y-%m-%d %H:%M:%S')
    } for m in conversation]

    # Mark as read
    if not message.read and message.receiver_id == current_user.id:
        message.read = True
        db.session.commit()

    return jsonify({
        "message_id": message.id,
        "sender": message.sender.username if message.sender else None,
        "property": message.property_re.title if message.property_re else None,
        "conversation": convo_data
    })


@messages.route('/reply/<int:message_id>', methods=['POST'])
@login_required
def reply_to_message(message_id):
    """Reply to a specific message (from React form)."""
    data = request.get_json()
    text = data.get('message')

    if not text:
        return jsonify({"error": "Message text required"}), 400

    original = Messages.query.get_or_404(message_id)
    reply = Messages(
        sender_id=current_user.id,
        receiver_id=original.sender_id,
        message=text,
        property_id=original.property_id
    )

    db.session.add(reply)
    db.session.commit()

    return jsonify({
        "success": True,
        "reply": {
            "id": reply.id,
            "message": reply.message,
            "timestamp": reply.timestamp.strftime('%Y-%m-%d %H:%M:%S')
        }
    })
