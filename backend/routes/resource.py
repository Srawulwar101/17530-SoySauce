import logging
from flask import Blueprint, request, jsonify
from bson import ObjectId
from models.resource import HardwareResource
from db import db
from bson import json_util

# Set up logging
logging.basicConfig(level=logging.DEBUG)
logger = logging.getLogger(__name__)

resource_bp = Blueprint("resource_bp", __name__)
resource_model = HardwareResource(db)

@resource_bp.route("/checkout", methods=["POST"])
def checkout():
    data = request.get_json()
    logger.debug("Checkout request data: %s", data)  # Log the incoming request data
    resource_id = data.get("resource_id")
    project_id = data.get("project_id") 
    units = data.get("units")

    if not all([resource_id, project_id, units]):
        logger.error("Missing parameters: resource_id=%s, project_id=%s, units=%s", resource_id, project_id, units)
        return jsonify({"error": "Resource ID, project ID, and units are required"}), 400

    try:
        resource_id = ObjectId(resource_id)
        units = int(units)  # Convert units to an integer
        
        # Fetch the resource to log its details
        resource = resource_model.get_resource(resource_id)
        if resource:
            logger.debug("Resource details: %s", resource)
            logger.debug("Available units for resource_id=%s: %d", resource_id, resource.get("available_units", 0))
        else:
            logger.error("Resource not found: resource_id=%s", resource_id)
            return jsonify({"error": "Resource not found"}), 404

        success = resource_model.checkout_resource(resource_id, units, project_id)
        
        if success:
            logger.info("Resource checked out successfully: resource_id=%s, project_id=%s, units=%d", resource_id, project_id, units)
            return jsonify({"message": "Resource checked out successfully"}), 200
        logger.warning("Insufficient units available for resource_id=%s", resource_id)
        return jsonify({"error": "Insufficient units available"}), 400
    except ValueError as ve:
        logger.error("Invalid value for units: %s", str(ve))
        return jsonify({"error": "Units must be a valid integer"}), 400
    except Exception as e:
        logger.exception("Error during checkout: %s", str(e))
        return jsonify({"error": str(e)}), 400

@resource_bp.route("/checkin", methods=["POST"])
def checkin():
    data = request.get_json()
    logger.debug("Checkin request data: %s", data)  # Log the incoming request data
    resource_id = data.get("resource_id")
    project_id = data.get("project_id") 
    units = data.get("units")

    if not all([resource_id, project_id, units]):
        logger.error("Missing parameters: resource_id=%s, project_id=%s, units=%s", resource_id, project_id, units)
        return jsonify({"error": "Resource ID, project ID, and units are required"}), 400

    try:
        resource_id = ObjectId(resource_id)
        units = int(units)  # Convert units to an integer
        
        # Fetch the resource to log its details
        resource = resource_model.get_resource(resource_id)
        if resource:
            logger.debug("Resource details: %s", resource)
            logger.debug("Available units for resource_id=%s: %d", resource_id, resource.get("available_units", 0))
        else:
            logger.error("Resource not found: resource_id=%s", resource_id)
            return jsonify({"error": "Resource not found"}), 404

        success = resource_model.checkin_resource(resource_id, units, project_id)

        if success:
            logger.info("Resource checked in successfully: resource_id=%s, project_id=%s, units=%d", resource_id, project_id, units)
            return jsonify({"message": "Resource checked in successfully"}), 200
        logger.warning("Unable to check in resource: resource_id=%s", resource_id)
        return jsonify({"error": "Unable to check in resource"}), 400
    except ValueError as ve:
        logger.error("Invalid value for units: %s", str(ve))
        return jsonify({"error": "Units must be a valid integer"}), 400
    except Exception as e:
        logger.exception("Error during checkin: %s", str(e))
        return jsonify({"error": str(e)}), 400

@resource_bp.route("/create", methods=["POST"])
def create_resource():
    data = request.get_json()
    logger.debug("Create resource request data: %s", data)  # Log the incoming request data
    name = data.get("name")
    total_units = data.get("total_units")

    if not name or not total_units:
        logger.error("Missing parameters: name=%s, total_units=%s", name, total_units)
        return jsonify({"error": "Name and total units are required"}), 400

    resource_id = resource_model.add_resource(name, total_units)
    logger.info("Resource created successfully: resource_id=%s, name=%s, total_units=%d", str(resource_id), name, total_units)
    return jsonify({
        "message": "Resource created successfully",
        "resource_id": str(resource_id)
    }), 201

@resource_bp.route("/all", methods=["GET"])
def get_all_resources():
    resources = resource_model.get_all_resources()
    logger.debug("Retrieved all resources: %s", resources)  # Log the retrieved resources
    return json_util.dumps({"resources": resources}), 200, {'ContentType':'application/json'}

# Test endpoint, not meant to be used in practice
@resource_bp.route("/test", methods=["GET"])
def tester():
    try:
        resource_id = '6721dbf54add846a09814dcc'
        success = resource_model.checkin_resource(
            resource_id=ObjectId(resource_id),
            units=5,
            project_id="proj1"
        )
        
        logger.info("Test completed: resource_id=%s, checkout_success=%s", resource_id, success)
        return jsonify({
            "message": "Test completed",
            "resource_id": str(resource_id),
            "checkout_success": success
        }), 200
    except Exception as e:
        logger.exception("Error during test: %s", str(e))
        return jsonify({"error": str(e)}), 400