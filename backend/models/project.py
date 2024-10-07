class Project:
    def __init__(self, db):
        self.collection = db["projects"]

    def create_project(self, user_id, project_name, description, project_id):
        project_data = {
            "user_id": user_id,
            "project_name": project_name,
            "description": description,
            "project_id": project_id
        }
        result = self.collection.insert_one(project_data)
        return result.inserted_id

    def get_user_projects(self, user_id):
        projects = self.collection.find({"user_id": user_id})
        return list(projects)
