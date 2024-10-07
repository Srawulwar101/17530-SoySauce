from flask import Blueprint, request, jsonify
from models.user import User
from db import db  # Import db from db.py

auth_bp = Blueprint("auth_bp", __name__)
user_model = User(db)

@auth_bp.route("/signup", methods=["POST"])
def signup():
    data = request.get_json()
    username = data.get("username")
    password = data.get("password")
    
    if not username or not password:
        return jsonify({"error": "Username and password are required"}), 400
    
    user_id = user_model.create_user(username, password)
    return jsonify({"message": "User created successfully", "user_id": str(user_id)}), 201

@auth_bp.route("/login", methods=["POST"])
def login():
    data = request.get_json()
    username = data.get("username")
    password = data.get("password")
    
    if user_model.authenticate_user(username, password):
        return jsonify({"message": "Login successful"}), 200
    return jsonify({"error": "Invalid credentials"}), 401
