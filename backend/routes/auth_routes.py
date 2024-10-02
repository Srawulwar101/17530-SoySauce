# routes/auth_routes.py

from flask import Blueprint, request, jsonify
from flask_bcrypt import Bcrypt
from flask_jwt_extended import create_access_token
from utils.db import mongo

auth_bp = Blueprint('auth_bp', __name__)
bcrypt = Bcrypt()

@auth_bp.route('/register', methods=['POST'])
def register():
    data = request.get_json()
    username = data.get('username')
    password = data.get('password')

    if not username or not password:
        return jsonify({'message': 'Username and password are required.'}), 400

    existing_user = mongo.db.users.find_one({'username': username})
    if existing_user:
        return jsonify({'message': 'User already exists.'}), 409

    hashed_password = bcrypt.generate_password_hash(password).decode('utf-8')
    user_id = mongo.db.users.insert_one({
        'username': username,
        'password': hashed_password
    }).inserted_id

    return jsonify({'message': 'User registered successfully.', 'user_id': str(user_id)}), 201

@auth_bp.route('/login', methods=['POST'])
def login():
    data = request.get_json()
    username = data.get('username')
    password = data.get('password')

    if not username or not password:
        return jsonify({'message': 'Username and password are required.'}), 400

    user = mongo.db.users.find_one({'username': username})
    if user and bcrypt.check_password_hash(user['password'], password):
        access_token = create_access_token(identity=str(user['_id']))
        return jsonify({'token': access_token}), 200
    else:
        return jsonify({'message': 'Invalid username or password.'}), 401
