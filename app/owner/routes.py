from flask import Blueprint, request, jsonify
from flask_jwt_extended import create_access_token, jwt_required, get_jwt_identity
from app.models import Owner, db
from werkzeug.security import generate_password_hash, check_password_hash

owner_bp = Blueprint('owner', __name__)

@owner_bp.route("/api/owner/register", methods=["POST"])
def api_register():
    data = request.get_json()
    errors = {}

    # Basic validation
    if not data.get("email"):
        errors["email"] = "Email is required."
    if not data.get("password"):
        errors["password"] = "Password is required."
    if data.get("password") != data.get("confirm_password"):
        errors["confirm_password"] = "Passwords do not match."

    if errors:
        return jsonify({"errors": errors}), 400

    user = Owner(
        username=data["username"],
        email=data["email"],
        phone=data["phone"],
        location=data["location"],
        password=generate_password_hash(data["password"])
    )
    db.session.add(user)
    db.session.commit()

    return jsonify({"message": "Account created successfully!"}), 201


@owner_bp.route("/api/owner/login", methods=["POST"])
def owner_login():
    data = request.get_json()
    user = Owner.query.filter_by(email=data.get("email")).first()
    
    if user and check_password_hash(user.password, data.get("password")):
        token = create_access_token(identity=user.id)
        return jsonify({"token": token}), 200
    
    return jsonify({"error": "Invalid credentials"}), 401


@owner_bp.route("/api/owner/profile", methods=["GET"])
@jwt_required()
def owner_profile():
    current_user_id = get_jwt_identity()
    user = Owner.query.get(current_user_id)

    if not user:
        return jsonify({"error": "Owner not found"}), 404

    return jsonify({
        "id": user.id,
        "username": user.username,
        "email": user.email
    }), 200
