# routes/project_routes.py

from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from utils.db import mongo
from bson.objectid import ObjectId

project_bp = Blueprint('project_bp', __name__)

@project_bp.route('/', methods=['POST'])
@jwt_required()
def create_project():
    data = request.get_json()
    name = data.get('name')
    description = data.get('description')
    project_id = data.get('project_id')
    user_id = get_jwt_identity()

    if not name or not description or not project_id:
        return jsonify({'message': 'All fields are required.'}), 400

    existing_project = mongo.db.projects.find_one({'project_id': project_id})
    if existing_project:
        return jsonify({'message': 'Project ID already exists.'}), 409

    new_project = {
        'name': name,
        'description': description,
        'project_id': project_id,
        'user_id': ObjectId(user_id)
    }

    mongo.db.projects.insert_one(new_project)
    return jsonify({'message': 'Project created successfully.'}), 201

@project_bp.route('/', methods=['GET'])
@jwt_required()
def get_projects():
    user_id = get_jwt_identity()
    projects = list(mongo.db.projects.find({'user_id': ObjectId(user_id)}))
    for project in projects:
        project['_id'] = str(project['_id'])
        project['user_id'] = str(project['user_id'])
    return jsonify(projects), 200
