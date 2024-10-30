from flask import Blueprint, request, jsonify
from bson import ObjectId
from models.resource import HardwareResource
from db import db
from bson import json_util

resource_bp = Blueprint("resource_bp", __name__)
resource_model = HardwareResource(db)

@resource_bp.route("/checkout", methods=["POST"])
def checkout():
    data = request.get_json()
    resource_id = data.get("resource_id")
    project_id = data.get("project_id") 
    units = data.get("units")

    if not all([resource_id, project_id, units]):
        return jsonify({"error": "Resource ID, project ID, and units are required"}), 400

    try:
        resource_id = ObjectId(resource_id)
        success = resource_model.checkout_resource(resource_id, units, project_id)
        
        if success:
            return jsonify({"message": "Resource checked out successfully"}), 200
        return jsonify({"error": "Insufficient units available"}), 400
    except Exception as e:
        return jsonify({"error": str(e)}), 400

@resource_bp.route("/checkin", methods=["POST"])
def checkin():
    data = request.get_json()
    resource_id = data.get("resource_id")
    project_id = data.get("project_id") 
    units = data.get("units")

    if not all([resource_id, project_id, units]):
        return jsonify({"error": "Resource ID, project ID, and units are required"}), 400

    try:
        resource_id = ObjectId(resource_id)
        success = resource_model.checkin_resource(resource_id, units, project_id)

        if success:
            return jsonify({"message": "Resource checked in successfully"}), 200
        return jsonify({"error": "Unable to check in resource"}), 400
    except Exception as e:
        return jsonify({"error": str(e)}), 400

@resource_bp.route("/create", methods=["POST"])
def create_resource():
    data = request.get_json()
    name = data.get("name")
    total_units = data.get("total_units")

    if not name or not total_units:
        return jsonify({"error": "Name and total units are required"}), 400

    resource_id = resource_model.add_resource(name, total_units)
    return jsonify({
        "message": "Resource created successfully",
        "resource_id": str(resource_id)
    }), 201

@resource_bp.route("/all", methods=["GET"])
def get_all_resources():
    resources = resource_model.get_all_resources()
    return json_util.dumps({"resources": resources}), 200, {'ContentType':'application/json'}




#test endpoint, not meant to be used in practice
@resource_bp.route("/test", methods=["GET"])
def tester():
    try:
        resource_id = '6721dbf54add846a09814dcc'
        success = resource_model.checkin_resource(
            resource_id=ObjectId(resource_id),
            units=5,
            project_id="proj1"
        )
        
        return jsonify({
            "message": "Test completed",
            "resource_id": str(resource_id),
            "checkout_success": success
        }), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 400