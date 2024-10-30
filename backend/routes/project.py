from flask import Blueprint, request, jsonify
from models.project import Project
from models.resource import HardwareResource
from db import db  # Import db from db.py
from bson import ObjectId
from bson import json_util

project_bp = Blueprint("project_bp", __name__)
project_model = Project(db)

@project_bp.route("/create_project", methods=["POST"])
def create_project():
    data = request.get_json()
    user_id = data.get("user_id")
    project_name = data.get("project_name")
    description = data.get("description")
    project_id = data.get("project_id")
    
    if not user_id or not project_name or not project_id:
        return jsonify({"error": "User ID, project name, and project ID are required"}), 400
    
    new_project_id = project_model.create_project(user_id, project_name, description, project_id)
    return jsonify({"message": "Project created successfully", "project_id": str(new_project_id)}), 201

@project_bp.route("/get_projects/<user_id>", methods=["GET"])
def get_projects(user_id):
    projects = project_model.get_user_projects(user_id)
    return json_util.dumps({"projects": projects}), 200, {'ContentType':'application/json'}

@project_bp.route("/project_resources/<project_id>", methods=["GET"])
def get_project_resources(project_id):
    try:
        project = project_model.get_project(ObjectId(project_id))
        if not project:
            return jsonify({"error": "Project not found"}), 404
        
        resources = project.get("resources", {})
        return jsonify({"resources": resources}), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 400