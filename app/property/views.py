from flask import Blueprint, jsonify
property_bp = Blueprint("property", __name__)

@property_bp.route("/", methods=["GET"])
def get_properties():
    return jsonify([]), 200
