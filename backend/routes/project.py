from flask import Blueprint, request, jsonify
from models.project import Project
from models.resource import HardwareResource
from db import db  # Import db from db.py
from bson import ObjectId
from bson import json_util
import logging


project_bp = Blueprint("project_bp", __name__)
project_model = Project(db)


@project_bp.route("/create_project", methods=["POST"])
def create_project():
    logging.debug("Received request to create project")
    data = request.get_json()
    logging.debug(f"Request data: {data}")
   
    if data is None:
        logging.error("No data received")
        return jsonify({"error": "No data provided"}), 400


    user_id = data.get("user_id")
    project_name = data.get("project_name")
    description = data.get("description")
    project_id = data.get("project_id")
   
    if not user_id or not project_name or not project_id:
        logging.error("Missing required fields")
        return jsonify({"error": "User ID, project name, and project ID are required"}), 400
   
    try:
        new_project_id = project_model.create_project(user_id, project_name, description, project_id)
        if new_project_id is None:
            return jsonify({"error": "ProjectID already exists"}), 400
        logging.debug(f"Project created with ID: {new_project_id}")
        return jsonify({"message": "Project created successfully", "project_id": str(new_project_id)}), 201
    except Exception as e:
        logging.error(f"Error creating project: {str(e)}")
        return jsonify({"error": "Failed to create project"}), 500


@project_bp.route("/get_projects/<user_id>", methods=["GET"])
def get_projects(user_id):
    projects = project_model.get_user_projects(user_id)
    return json_util.dumps({"projects": projects}), 200, {'ContentType':'application/json'}


@project_bp.route("/add_viewer", methods=["POST"])
def add_viewer():
    data = request.get_json()
    logging.debug("Received request to add viewer: %s", data)
   
    # Extract project_id and user_id
    project_id = data.get("project_id")
    user_id = data.get("user_id")


    # Check if project_id is an object with $oid
    if isinstance(project_id, dict) and "$oid" in project_id:
        project_id = project_id["$oid"]  # Extract the actual ObjectId string


    if not project_id or not user_id:
        logging.error("Missing project_id or user_id")
        return jsonify({"error": "Project ID and User ID are required"}), 400


    success = project_model.add_viewer(project_id, user_id)
    if success:
        logging.info("Viewer %s added to project %s successfully.", user_id, project_id)
        return jsonify({"message": "Viewer added successfully"}), 200
    logging.error("Failed to add viewer %s to project %s", user_id, project_id)
    return jsonify({"error": "Failed to add viewer"}), 400


@project_bp.route("/remove_viewer", methods=["POST"])
def remove_viewer():
    data = request.get_json()
    project_id = data.get("project_id")
    user_id = data.get("user_id")


    if not project_id or not user_id:
        return jsonify({"error": "Project ID and User ID are required"}), 400


    success = project_model.remove_viewer(project_id, user_id)
    if success:
        return jsonify({"message": "Viewer removed successfully"}), 200
    return jsonify({"error": "Failed to remove viewer"}), 400


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


@project_bp.route("/join", methods=["POST"])
def join_project():
    data = request.get_json()
    project_id = data.get("project_id")
    user_id = data.get("user_id")


    if not project_id or not user_id:
        return jsonify({"error": "Project ID and User ID are required"}), 400


    # Check if project_id is in the format {'$oid': '...'}
    if isinstance(project_id, dict) and "$oid" in project_id:
        project_id = project_id["$oid"]  # Extract the actual ObjectId string


    success = project_model.add_user(project_id, user_id)
    if success:
        return jsonify({"message": "Successfully joined the project"}), 200
    return jsonify({"error": "Failed to join the project"}), 500


@project_bp.route("/leave", methods=["POST"])
def leave_project():
    data = request.get_json()
    project_id = data.get("project_id")
    user_id = data.get("user_id")


    if not project_id or not user_id:
        return jsonify({"error": "Project ID and User ID are required"}), 400


    # Check if project_id is in the format {'$oid': '...'}
    if isinstance(project_id, dict) and "$oid" in project_id:
        project_id = project_id["$oid"]  # Extract the actual ObjectId string


    success = project_model.remove_user(project_id, user_id)
    if success:
        return jsonify({"message": "Successfully left the project"}), 200
    return jsonify({"error": "Failed to leave the project"}), 500