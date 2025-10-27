from flask import Blueprint, request, jsonify
from app import db, bcrypt
from app.models import Owner
from flask_jwt_extended import create_access_token, jwt_required, get_jwt_identity

owner_bp = Blueprint("owner", __name__)

@owner_bp.route("/register", methods=["POST"])
def register():
    data = request.get_json()
    user = Owner(username=data["username"], email=data["email"])
    user.set_password(data["password"])
    db.session.add(user)
    db.session.commit()
    return jsonify({"message": "Owner registered"}), 201


@owner_bp.route("/login", methods=["POST"])
def login():
    data = request.get_json()
    user = Owner.query.filter_by(email=data["email"]).first()
    if user and user.check_password(data["password"]):
        token = create_access_token(identity=user.id)
        return jsonify({"token": token}), 200
    return jsonify({"error": "Invalid credentials"}), 401
@owner_bp.route("/profile", methods=["GET"])
@jwt_required()
def profile():
    owner_id = get_jwt_identity()
    user = Owner.query.get(owner_id)
    if not user:
        return jsonify({"error": "User not found"}), 404

    return jsonify({
        "id": user.id,
        "username": user.username,
        "email": user.email,
        "avatar": user.avatar if hasattr(user, "avatar") else None
    }), 200
