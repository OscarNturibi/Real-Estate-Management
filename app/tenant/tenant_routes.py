from flask import Blueprint, request, jsonify
from app import db
from flask_login import login_user, current_user, login_required
from werkzeug.security import generate_password_hash, check_password_hash
from models.tenant import Tenant
from models.property import Property
from models.application import Application  # Only if this exists

tenant_bp = Blueprint("tenant", __name__, url_prefix="/api/tenant")


@tenant_bp.route("/register", methods=["POST"])
def register_tenant():
    data = request.json
    username = data.get("username")
    email = data.get("email")
    password = data.get("password")

    if Tenant.query.filter_by(email=email).first():
        return jsonify({"error": "Email already exists"}), 400

    hashed_pw = generate_password_hash(password)
    tenant = Tenant(username=username, email=email, password=hashed_pw)
    db.session.add(tenant)
    db.session.commit()

    return jsonify({"message": "Tenant registered successfully"}), 201


@tenant_bp.route("/login", methods=["POST"])
def login_tenant():
    data = request.json
    email = data.get("email")
    password = data.get("password")

    tenant = Tenant.query.filter_by(email=email).first()
    if not tenant or not check_password_hash(tenant.password, password):
        return jsonify({"error": "Invalid email or password"}), 401

    login_user(tenant)
    return jsonify({
        "message": "Login successful",
        "user": {"id": tenant.id, "role": "tenant"}
    }), 200


@tenant_bp.route("/dashboard", methods=["GET"])
@login_required
def tenant_dashboard():
    if current_user.role != "tenant":
        return jsonify({"error": "Unauthorized"}), 403

    return jsonify({
        "message": "Welcome tenant!",
        "user": {
            "id": current_user.id,
            "username": current_user.username,
            "email": current_user.email
        }
    }), 200


@tenant_bp.route("/apply/<int:property_id>", methods=["POST"])
@login_required
def apply_for_property(property_id):
    if current_user.role != "tenant":
        return jsonify({"error": "Unauthorized"}), 403

    property_item = Property.query.get(property_id)
    if not property_item:
        return jsonify({"error": "Property not found"}), 404

    # Check if already applied
    existing = Application.query.filter_by(
        tenant_id=current_user.id,
        property_id=property_id
    ).first()

    if existing:
        return jsonify({"message": "Already applied"}), 400

    application = Application(
        tenant_id=current_user.id,
        property_id=property_id,
        status="Pending"
    )
    db.session.add(application)
    db.session.commit()

    return jsonify({"message": "Application submitted successfully"}), 201
