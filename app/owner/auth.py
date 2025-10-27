from flask import Blueprint, request, jsonify
from flask_jwt_extended import create_access_token
from app import db, bcrypt
from app.models import Owner

auth_bp = Blueprint("auth", __name__)


@auth_bp.route("/register", methods=["POST"])
def register():
    data = request.get_json()

    if not data or not all(key in data for key in ["username", "email", "password"]):
        return jsonify({"message": "Missing fields"}), 400

    if Owner.query.filter_by(email=data["email"]).first():
        return jsonify({"message": "Email already exists"}), 409

    owner = Owner(
        username=data["username"],
        email=data["email"]
    )
    owner.set_password(data["password"])

    db.session.add(owner)
    db.session.commit()

    return jsonify({"message": "Owner registered successfully"}), 201


@auth_bp.route("/login", methods=["POST"])
def login():
    data = request.get_json()

    owner = Owner.query.filter_by(email=data["email"]).first()
    if not owner or not owner.check_password(data["password"]):
        return jsonify({"message": "Invalid email or password"}), 401

    token = create_access_token(identity=owner.id)

    return jsonify({"token": token, "owner_id": owner.id}), 200
