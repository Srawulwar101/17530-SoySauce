from flask import Blueprint, request, jsonify
from bson import ObjectId
from models.resource import HardwareResource
from db import db

resource_bp = Blueprint("resource_bp", __name__)
resource_model = HardwareResource(db)

@resource_bp.route("/checkout", methods=["POST"])
def checkout():
    data = request.get_json()
    resource_id = data.get("resource_id")
    units = data.get("units")

    if not resource_id or not units:
        return jsonify({"error": "Resource ID and units are required"}), 400

    # Convert resource_id to ObjectId
    resource_id = ObjectId(resource_id)
    success = resource_model.checkout_resource(resource_id, units)
    
    if success:
        return jsonify({"message": "Resource checked out successfully"}), 200
    return jsonify({"error": "Insufficient units available"}), 400

@resource_bp.route("/checkin", methods=["POST"])
def checkin():
    data = request.get_json()
    resource_id = data.get("resource_id")
    units = data.get("units")

    if not resource_id or not units:
        return jsonify({"error": "Resource ID and units are required"}), 400

    # Convert resource_id to ObjectId
    resource_id = ObjectId(resource_id)
    success = resource_model.checkin_resource(resource_id, units)

    if success:
        return jsonify({"message": "Resource checked in successfully"}), 200
    return jsonify({"error": "Unable to check in resource (capacity exceeded)"}), 400
