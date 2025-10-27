#!/usr/bin/python3
"""Tenant API views for React frontend"""
from flask import Blueprint, request, jsonify
from flask_login import login_user, current_user, login_required, logout_user
from app import db, bcrypt
from app.models import Tenant, Property, owner, TenantProperty, PropertyStatus, Rental, Messages

tenant_api = Blueprint("tenant_api", __name__, url_prefix="/api/tenant")

# -------------------------------
# Register Tenant
# -------------------------------
@tenant_api.route("/register", methods=["POST"])
def register():
    data = request.get_json()

    required_fields = ["username", "email", "password"]
    if not all(field in data and data[field] for field in required_fields):
        return jsonify({"error": "Missing required fields"}), 400

    if Tenant.query.filter_by(email=data["email"]).first():
        return jsonify({"error": "Email already exists"}), 400

    hashed_password = bcrypt.generate_password_hash(data["password"]).decode("utf-8")
    tenant = Tenant(
        username=data["username"],
        email=data["email"],
        password=hashed_password,
        phone=data.get("phone", ""),
        location=data.get("location", "")
    )
    db.session.add(tenant)
    db.session.commit()

    return jsonify({"message": "Account created successfully"}), 201


# -------------------------------
# Login Tenant
# -------------------------------
@tenant_api.route("/login", methods=["POST"])
def login():
    data = request.get_json()
    if not data or "email" not in data or "password" not in data:
        return jsonify({"error": "Email and password required"}), 400

    tenant = Tenant.query.filter_by(email=data["email"]).first()
    if tenant and bcrypt.check_password_hash(tenant.password, data["password"]):
        login_user(tenant)
        return jsonify({
            "message": "Login successful",
            "user": {
                "id": tenant.id,
                "username": tenant.username,
                "email": tenant.email,
                "phone": tenant.phone,
                "location": tenant.location
            }
        }), 200
    else:
        return jsonify({"error": "Invalid email or password"}), 401


# -------------------------------
# Logout Tenant
# -------------------------------
@tenant_api.route("/logout", methods=["POST"])
@login_required
def logout():
    """Logs out the current tenant"""
    logout_user()
    return jsonify({"message": "Logout successful"}), 200


# -------------------------------
# Apply for a Property
# -------------------------------
@tenant_api.route("/apply/<int:property_id>", methods=["POST"])
@login_required
def apply_property(property_id):
    if isinstance(current_user, owner):
        return jsonify({"error": "owners cannot apply for properties"}), 403

    prop = Property.query.get_or_404(property_id)

    if prop.property_status == PropertyStatus.RENTED:
        return jsonify({"error": "Property already rented"}), 400
    if prop.property_status == PropertyStatus.SOLD:
        return jsonify({"error": "Property already sold"}), 400

    if TenantProperty.query.filter_by(tenant_id=current_user.id, property_id=prop.id).first():
        return jsonify({"error": "You have already applied for this property"}), 400

    application = TenantProperty(tenant_id=current_user.id, property_id=prop.id)
    db.session.add(application)
    db.session.commit()

    return jsonify({"message": "Application successful"}), 201


# -------------------------------
# Tenant Dashboard
# -------------------------------
@tenant_api.route("/dashboard", methods=["GET"])
@login_required
def dashboard():
    if isinstance(current_user, owner):
        return jsonify({"error": "Unauthorized: Only tenants can access dashboard"}), 403

    rented_properties = (
        db.session.query(Property)
        .join(Rental, Rental.property_id == Property.id)
        .filter(Rental.tenant_id == current_user.id)
        .all()
    )

    messages = Messages.query.filter_by(receiver_id=current_user.id).all()

    rented_data = [{
        "id": prop.id,
        "title": prop.title,
        "price": prop.price,
        "status": prop.property_status.name
    } for prop in rented_properties]

    messages_data = [{
        "id": msg.id,
        "sender_id": msg.sender_id,
        "content": msg.content,
        "timestamp": msg.timestamp.strftime("%Y-%m-%d %H:%M:%S")
    } for msg in messages]

    return jsonify({
        "tenant": {
            "id": current_user.id,
            "username": current_user.username,
            "email": current_user.email
        },
        "rented_properties": rented_data,
        "messages": messages_data
    }), 200
