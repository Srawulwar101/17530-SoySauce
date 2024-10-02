# routes/resource_routes.py

from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required
from utils.db import mongo

resource_bp = Blueprint('resource_bp', __name__)

@resource_bp.route('/', methods=['GET'])
def get_resources():
    resources = mongo.db.resources.find_one({})
    if not resources:
        resources = {
            'HWSet1': {'capacity': 10, 'available': 10},
            'HWSet2': {'capacity': 20, 'available': 20}
        }
        mongo.db.resources.insert_one(resources)
    else:
        resources['_id'] = str(resources['_id'])
    return jsonify(resources), 200

@resource_bp.route('/checkout', methods=['POST'])
@jwt_required()
def checkout_resources():
    data = request.get_json()
    hwset1_qty = data.get('HWSet1', 0)
    hwset2_qty = data.get('HWSet2', 0)

    resources = mongo.db.resources.find_one({})
    if resources['HWSet1']['available'] >= hwset1_qty and resources['HWSet2']['available'] >= hwset2_qty:
        mongo.db.resources.update_one({}, {'$inc': {
            'HWSet1.available': -hwset1_qty,
            'HWSet2.available': -hwset2_qty
        }})
        return jsonify({'message': 'Resources checked out successfully.'}), 200
    else:
        return jsonify({'message': 'Not enough resources available.'}), 400

@resource_bp.route('/checkin', methods=['POST'])
@jwt_required()
def checkin_resources():
    data = request.get_json()
    hwset1_qty = data.get('HWSet1', 0)
    hwset2_qty = data.get('HWSet2', 0)

    resources = mongo.db.resources.find_one({})
    mongo.db.resources.update_one({}, {'$inc': {
        'HWSet1.available': hwset1_qty,
        'HWSet2.available': hwset2_qty
    }})
    return jsonify({'message': 'Resources checked in successfully.'}), 200
