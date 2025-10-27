#!/usr/bin/python3
"""REST API endpoints for Tenant accounts (Flask backend for React frontend)."""
from flask import jsonify, request, Blueprint
from flask_login import login_user, current_user, logout_user, login_required
from app import db, bcrypt
from app.models import Tenant, Property, Application

tenant_api = Blueprint("tenant_api", __name__, url_prefix="/api/tenant")

# --------------------------------------------
# Register Tenant
# --------------------------------------------
@tenant_api.route("/register", methods=["POST"])
def register_tenant():
    data = request.get_json()
    required = ["username", "email", "password", "phone"]
    if not all(f in data and data[f] for f in required):
        return jsonify({"error": "Missing required fields"}), 400

    if Tenant.query.filter_by(email=data["email"]).first():
        return jsonify({"error": "Email already registered"}), 409

    hashed_pw = bcrypt.generate_password_hash(data["password"]).decode("utf-8")
    tenant = Tenant(
        username=data["username"],
        email=data["email"],
        phone=data["phone"],
        password=hashed_pw,
    )
    db.session.add(tenant)
    db.session.commit()

    return jsonify({"message": "Tenant account created", "tenant_id": tenant.id}), 201


# --------------------------------------------
# Login Tenant
# --------------------------------------------
@tenant_api.route("/login", methods=["POST"])
def login_tenant():
    data = request.get_json()
    email = data.get("email")
    password = data.get("password")

    user = Tenant.query.filter_by(email=email).first()
    if not user or not bcrypt.check_password_hash(user.password, password):
        return jsonify({"error": "Invalid email or password"}), 401

    login_user(user)
    return jsonify({
        "message": "Login successful",
        "tenant": {
            "id": user.id,
            "username": user.username,
            "email": user.email
        }
    }), 200


# --------------------------------------------
# Tenant Dashboard
# --------------------------------------------
@tenant_api.route("/dashboard", methods=["GET"])
@login_required
def tenant_dashboard():
    tenant = current_user
    applications = Application.query.filter_by(tenant_id=tenant.id).all()
    applied_properties = [
        {
            "property_id": app.property_id,
            "status": app.status,
            "property_title": app.property.title if app.property else "N/A",
        }
        for app in applications
    ]
    return jsonify({
        "tenant": {
            "id": tenant.id,
            "username": tenant.username,
            "email": tenant.email,
        },
        "applications": applied_properties,
    }), 200


# --------------------------------------------
# Apply for Property
# --------------------------------------------
@tenant_api.route("/apply/<int:property_id>", methods=["POST"])
@login_required
def apply_property(property_id):
    tenant = current_user
    existing = Application.query.filter_by(tenant_id=tenant.id, property_id=property_id).first()
    if existing:
        return jsonify({"error": "Already applied to this property"}), 400

    property_ = Property.query.get(property_id)
    if not property_:
        return jsonify({"error": "Property not found"}), 404

    app_entry = Application(property_id=property_id, tenant_id=tenant.id, status="Pending")
    db.session.add(app_entry)
    db.session.commit()

    return jsonify({"message": f"Application submitted for property {property_.title}"}), 201


# --------------------------------------------
# Logout Tenant
# --------------------------------------------
@tenant_api.route("/logout", methods=["POST"])
@login_required
def logout_tenant():
    logout_user()
    return jsonify({"message": "Logged out successfully"}), 200
