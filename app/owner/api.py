#!/usr/bin/python3
"""REST API endpoints for Owner accounts (Flask backend for React frontend)."""
import os
import secrets
from PIL import Image
from flask import jsonify, request, Blueprint, current_app
from app import db, bcrypt
from app.models import Owner, Property
from flask_login import login_user, current_user, logout_user, login_required

owner_api = Blueprint("owner_api", __name__, url_prefix="/api/owner")

# --------------------------------------------
# Helper: Save Profile Picture
# --------------------------------------------
def save_picture(form_picture):
    random_hex = secrets.token_hex(8)
    _, f_ext = os.path.splitext(form_picture.filename)
    picture_fn = random_hex + f_ext
    picture_dir = os.path.join(current_app.root_path, "owner", "static", "profile_pics")
    os.makedirs(picture_dir, exist_ok=True)
    picture_path = os.path.join(picture_dir, picture_fn)

    output_size = (200, 200)
    image = Image.open(form_picture)
    image.thumbnail(output_size)
    image.save(picture_path)

    return picture_fn


# --------------------------------------------
# Register Owner
# --------------------------------------------
@owner_api.route("/register", methods=["POST"])
def register_owner():
    data = request.get_json()
    required = ["username", "email", "password", "phone", "location"]
    if not all(f in data and data[f] for f in required):
        return jsonify({"error": "Missing required fields"}), 400

    if Owner.query.filter_by(email=data["email"]).first():
        return jsonify({"error": "Email already registered"}), 409

    hashed_pw = bcrypt.generate_password_hash(data["password"]).decode("utf-8")
    owner = Owner(
        username=data["username"],
        email=data["email"],
        phone=data["phone"],
        location=data["location"],
        password=hashed_pw,
    )
    db.session.add(owner)
    db.session.commit()

    return jsonify({"message": "Account created successfully", "owner_id": owner.id}), 201


# --------------------------------------------
# Login Owner
# --------------------------------------------
@owner_api.route("/login", methods=["POST"])
def login_owner():
    data = request.get_json()
    email = data.get("email")
    password = data.get("password")

    user = Owner.query.filter_by(email=email).first()
    if not user or not bcrypt.check_password_hash(user.password, password):
        return jsonify({"error": "Invalid email or password"}), 401

    login_user(user)
    return jsonify(
        {
            "message": "Login successful",
            "owner": {
                "id": user.id,
                "username": user.username,
                "email": user.email,
            },
        }
    ), 200


# --------------------------------------------
# Logout Owner
# --------------------------------------------
@owner_api.route("/logout", methods=["POST"])
@login_required
def logout_owner():
    logout_user()
    return jsonify({"message": "Logged out successfully"}), 200


# --------------------------------------------
# Get / Update Account
# --------------------------------------------
@owner_api.route("/account", methods=["GET", "PUT"])
@login_required
def account():
    if request.method == "GET":
        user = current_user
        return jsonify(
            {
                "username": user.username,
                "email": user.email,
                "phone": user.phone,
                "location": user.location,
                "image_file": user.image_file,
            }
        )

    data = request.form or request.get_json() or {}
    if "picture" in request.files:
        picture_file = save_picture(request.files["picture"])
        current_user.image_file = picture_file

    current_user.username = data.get("username", current_user.username)
    current_user.email = data.get("email", current_user.email)
    current_user.phone = data.get("phone", current_user.phone)
    current_user.location = data.get("location", current_user.location)

    db.session.commit()
    return jsonify({"message": "Account updated successfully"}), 200


# =================================================================
# ✅PROPERTY MANAGEMENT API ENDPOINTS (Newly Added Below)
# =================================================================

# Fetch all properties of logged-in owner
@owner_api.route("/properties", methods=["GET"])
@login_required
def get_properties():
    if not isinstance(current_user, Owner):
        return jsonify({"error": "Unauthorized"}), 403

    properties = Property.query.filter_by(owner_id=current_user.id).all()
    return jsonify([p.to_dict() for p in properties]), 200


# Create a property
@owner_api.route("/properties", methods=["POST"])
@login_required
def create_property():
    if not isinstance(current_user, Owner):
        return jsonify({"error": "Unauthorized"}), 403

    data = request.get_json() or {}
    
    required = ["title", "description", "location", "price",
                "property_type", "property_status", "bathrooms",
                "bedrooms", "size"]
    if not all(field in data for field in required):
        return jsonify({"error": "Missing required fields"}), 400

    prop = Property(**data, owner_id=current_user.id)
    db.session.add(prop)
    db.session.commit()
    return jsonify({"message": "Property created", "property": prop.to_dict()}), 201


# Update property
@owner_api.route("/properties/<int:property_id>", methods=["PUT"])
@login_required
def update_property(property_id):
    prop = Property.query.get_or_404(property_id)

    if prop.owner_id != current_user.id:
        return jsonify({"error": "Unauthorized"}), 403

    data = request.get_json() or {}
    for key, value in data.items():
        if hasattr(prop, key):
            setattr(prop, key, value)

    db.session.commit()
    return jsonify({"message": "Property updated", "property": prop.to_dict()}), 200


# Delete property
@owner_api.route("/properties/<int:property_id>", methods=["DELETE"])
@login_required
def delete_property(property_id):
    prop = Property.query.get_or_404(property_id)

    if prop.owner_id != current_user.id:
        return jsonify({"error": "Unauthorized"}), 403

    db.session.delete(prop)
    db.session.commit()
    return jsonify({"message": "Property deleted"}), 200
