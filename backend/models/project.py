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
    
    def get_project(self, project_id):
        return self.collection.find_one({"project_id": project_id})

    def add_resource(self, project_id, resource_id, units):
        """
        Add or update resource allocation for a project, returns if it was successful
        """
        result = self.collection.update_one(
            {"project_id": project_id},
            {"$inc": {f"resources.{resource_id}": units}}
        )
        return result.modified_count > 0

    def remove_resource(self, project_id, resource_id, units):
        """
        Remove or reduce resource allocation from a project
        """
        # First check if project has enough units
        project = self.get_project(project_id)
        if not project or "resources" not in project:
            return False
            
        current_units = project.get("resources", {}).get(str(resource_id), 0)
        if current_units < units:
            return False

        # Update the resource allocation
        result = self.collection.update_one(
            {"project_id": project_id},
            {"$inc": {f"resources.{resource_id}": -units}}
        )

        # If units become 0, remove the resource entry
        if current_units == units:
            self.collection.update_one(
                {"project_id": project_id},
                {"$unset": {f"resources.{resource_id}": ""}}
            )

        return result.modified_count > 0

    def get_project_resources(self, project_id):
        """
        Get all resources allocated to a project
        """
        project = self.get_project(project_id)
        return project.get("resources", {}) if project else {}
