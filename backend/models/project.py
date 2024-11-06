from flask import Blueprint, Flask, request, jsonify
from flask_cors import CORS, cross_origin
from pymongo import MongoClient

project_bp = Blueprint('project_bp', __name__)
CORS(project_bp)  # Enable CORS for routes in this blueprint

# MongoDB connection string
client = MongoClient('mongodb+srv://brayden_andrson:svwCCJ8XJiagpg2Z@soysauce.yocab.mongodb.net/?retryWrites=true&w=majority&appName=SoySauce')
db = client['myDatabase']
project_collection = db['projects']

class Project:
    def __init__(self, db):
        self.collection = db["projects"]

    def create_project(self, user_id, project_name, description, project_id):
        project_data = {
            "user_id": user_id,
            "project_name": project_name,
            "description": description,
            "project_id": project_id,
            "resources": {},
            "permissions": [user_id],  # The creator has permission by default
            "users": [user_id]  # The creator is automatically a user
        }
        result = self.collection.insert_one(project_data)
        return result.inserted_id

    def get_user_projects(self, username):
        projects = self.collection.find({"users": username})
        projects_list = list(projects)
        return projects_list

    def add_user_to_project(self, project_id, new_user_id):
        result = self.collection.update_one(
            {"project_id": project_id},
            {"$addToSet": {"users": new_user_id}}
        )
        return result.modified_count > 0

project_instance = Project(db)

@project_bp.route('/createProject', methods=['POST', 'OPTIONS'])
@cross_origin()
def create_project():
    if request.method == 'OPTIONS':
        # Respond to the preflight request
        return jsonify({}), 200
    try:
        data = request.get_json(force=True)
        
        user_id = data.get('user_id')
        project_name = data.get('project_name')
        description = data.get('description')
        project_id = data.get('project_id')
        
        if not all([user_id, project_name, description, project_id]):
            return jsonify({"error": "Missing required fields"}), 400
        
        inserted_id = project_instance.create_project(user_id, project_name, description, project_id)
        return jsonify({"project_id": str(inserted_id)}), 201
    except Exception as e:
        import traceback
        traceback.print_exc()
        return jsonify({"error": "Server error occurred"}), 500

@project_bp.route('/test', methods=['GET'])
def test():
    return 'Test endpoint is working!'

if __name__ == '__main__':
    app = Flask(__name__)
    app.register_blueprint(project_bp, url_prefix='/api/projects')
    app.run(debug=True)
