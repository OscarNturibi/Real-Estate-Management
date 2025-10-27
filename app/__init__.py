#!/usr/bin/python3
"""Application Factory - Initialize Flask App"""

from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from flask_migrate import Migrate
from flask_bcrypt import Bcrypt
from flask_cors import CORS
from flask_jwt_extended import JWTManager

db = SQLAlchemy()
migrate = Migrate()
bcrypt = Bcrypt()
jwt = JWTManager()


def create_app():
    app = Flask(__name__)

    # ✅ Core Settings
    app.config['SECRET_KEY'] = 'RealtyHubapp'
    app.config['JWT_SECRET_KEY'] = 'SuperSecretJWTKey'
    app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///realtyhub.db'
    app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

    # ✅ Initialize Extensions
    db.init_app(app)
    migrate.init_app(app, db)
    bcrypt.init_app(app)
    jwt.init_app(app)
    CORS(app, supports_credentials=True, resources={r"/*": {"origins": "*"}})    
    app.config['CORS_HEADERS'] = 'Content-Type'


    # ✅ Import Models Before Blueprints
    from app.models import Owner, Tenant, Property

    # ✅ Register Blueprints (Correct Paths)
    from app.owner.views import owner_bp
    from app.owner.auth import auth_bp
    from app.property.views import property_bp
    from app.tenant.views import tenant_bp

    app.register_blueprint(auth_bp, url_prefix="/api/auth")
    app.register_blueprint(owner_bp, url_prefix="/api/owner")
    app.register_blueprint(property_bp, url_prefix="/api/property")
    app.register_blueprint(tenant_bp, url_prefix="/api/tenant")
    
    return app
