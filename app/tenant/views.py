#!/usr/bin/python3
"""Tenant API Blueprint"""

from flask import Blueprint, jsonify
from flask_login import login_required, current_user

tenant_bp = Blueprint('tenant_bp', __name__, url_prefix='/api/tenant')

# Example Test Route – We will build full API After app works
@tenant_bp.route('/test', methods=['GET'])
def test_route():
    return jsonify({"message": "Tenant API is working!"}), 200
