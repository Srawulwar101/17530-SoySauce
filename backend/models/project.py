from bson import ObjectId
import logging


logger = logging.getLogger(__name__)


class Project:
    def __init__(self, db):
        self.collection = db["projects"]


    def create_project(self, user_id, project_name, description, project_id):


        # Check if the project_id already exists
        existing_project = self.collection.find_one({"project_id": project_id})
        if existing_project:
            logger.warning("Project ID %s already exists. Project not created.", project_id)
            return None  # Or raise an exception if preferred


        project_data = {
            "user_id": user_id,
            "project_name": project_name,
            "description": description,
            "project_id": project_id,
            "resources": {},
            "viewers": [user_id],  # Initialize with the creator as a viewer
            "joined_users": []  # Initialize with an empty list for joined users
        }
        result = self.collection.insert_one(project_data)
        return result.inserted_id


    def get_user_projects(self, user_id):
        projects = self.collection.find({"viewers": user_id})
        return list(projects)
   
    def get_project(self, project_id):
        logger.debug("Getting project with ID: %s", project_id)
        try:
            project = None
            if ObjectId.is_valid(project_id):
            # Try to find the project by _id using ObjectId
                try:
                    project_object_id = ObjectId(project_id)
                    project = self.collection.find_one({"_id": project_object_id})
                    logger.debug("Project retrieved by _id: %s", project)
                    return project
                except Exception as e:
                    logger.error("Error converting project_id to ObjectId: %s", str(e))
            logger.debug("This is the value of project_id: %s", project_id)
            project = self.collection.find_one({"_id": project_id})
            logger.debug("Project retrieved1: %s", project)
            if not project:
                # If not found by _id, try finding by project_id as a string
                logger.debug("HEHRHHEHRHEHRHEHRHE")
                project = self.collection.find_one({"project_id": str(project_id)})
           
            logger.debug("Project retrieved2: %s", project)
            return project
        except Exception as e:
            logger.error("Error retrieving project: %s", str(e))
            return None


    def add_resource(self, project_id, resource_id, units):
        logger.debug("Attempting to add resource: resource_id=%s, project_id=%s, units=%d", resource_id, project_id, units)


        # Check if the project exists
        project = self.get_project(project_id)  # This will use the _id field


        if not project:
            logger.warning("Project not found: project_id=%s", project_id)
            return False


        # Use the project_id field from the project document
        actual_project_id = project.get("project_id")
        logger.debug("Using actual project_id from project document: %s", actual_project_id)


        # Update the resources in the project
        result = self.collection.update_one(
            {"project_id": actual_project_id},  # Ensure this matches the field in your database
            {"$inc": {f"resources.{resource_id}": units}}
        )
       
        if result.modified_count > 0:
            logger.debug("Resource %s added to project %s successfully.", resource_id, actual_project_id)
            return True
        else:
            logger.warning("Failed to add resource %s to project %s. No documents modified.", resource_id, actual_project_id)
            return False


    def remove_resource(self, project_id, resource_id, units):
        logger.debug("Attempting to remove resource: resource_id=%s, project_id=%s, units=%d", resource_id, project_id, units)


        # Check if the project exists
        project = self.get_project(project_id)  # This will use the _id field


        if not project:
            logger.warning("Project not found: project_id=%s", project_id)
            return False


        # Use the project_id field from the project document
        actual_project_id = project.get("project_id")
        logger.debug("Using actual project_id from project document: %s", actual_project_id)
       
        if not project or "resources" not in project:
            return False
           
        current_units = project.get("resources", {}).get(str(resource_id), 0)
        if current_units < units:
            return False


        result = self.collection.update_one(
            {"project_id": actual_project_id},
            {"$inc": {f"resources.{resource_id}": -units}}
        )


        if current_units == units:
            self.collection.update_one(
                {"project_id": actual_project_id},
                {"$unset": {f"resources.{resource_id}": ""}}
            )


        return result.modified_count > 0


    def get_project_resources(self, project_id):
        # Check if the project_id is a valid ObjectId
        if not ObjectId.is_valid(project_id):
            raise ValueError("Invalid project ID format")  # Raise an error


        project = self.get_project(ObjectId(project_id))
        return project.get("resources", {}) if project else {}


    def add_viewer(self, project_id, user_id):
        logger.debug("Attempting to add viewer: user_id=%s, project_id=%s", user_id, project_id)
        project = self.get_project(project_id)
        if not project:
            logger.warning("Project not found: project_id=%s", project_id)
            return False


        result = self.collection.update_one(
            {"_id": project.get("_id")},
            {"$addToSet": {"viewers": user_id}}
        )


        if result.modified_count > 0:
            logger.info("Viewer %s added to project %s successfully.", user_id, project_id)
            return True
        else:
            logger.warning("Failed to add viewer %s to project %s. No documents modified.", user_id, project_id)
            return False


    def remove_viewer(self, project_id, user_id):
        result = self.collection.update_one(
            {"project_id": project_id},
            {"$pull": {"viewers": user_id}}
        )
        return result.modified_count > 0


    def checkin_resource(self, resource_id, units, project_id):
        """
        Check in resource units from a project
        """
        logger.debug("Checking in resource: resource_id=%s, units=%d, project_id=%s", resource_id, units, project_id)


        # Get the current project resources
        project_resources = self.get_project_resources(project_id)


        # Check if resource is in the project
        if str(resource_id) not in project_resources or project_resources[str(resource_id)] < units:
            logger.warning("Resource %s not found in project %s or insufficient units for check-in.", resource_id, project_id)
            return False


        # Attempt to remove the resource from the project
        if not self.remove_resource(project_id, str(resource_id), units):
            logger.warning("Failed to remove resource %s from project %s.", resource_id, project_id)
            return False


        # Update the resource's available units
        result = self.collection.update_one(
            {"_id": resource_id},
            {"$inc": {"available_units": units}}
        )


        if result.modified_count > 0:
            logger.info("Resource %s checked in successfully. Added %d units.", resource_id, units)
            return True


        # Rollback if unsuccessful
        logger.warning("Check-in failed for resource %s. Rolling back removal from project %s.", resource_id, project_id)
        self.add_resource(project_id, str(resource_id), units)
        return False


    def is_user_joined(self, project_id, user_id):
        project = self.get_project(project_id)
        return user_id in project.get("joined_users", [])


    def add_user(self, project_id, user_id):
        logger.debug("Adding user %s to project %s", user_id, project_id)
        project = self.get_project(project_id)
        if not project:
            logger.warning("Project not found: project_id=%s", project_id)
            return False


        result = self.collection.update_one(
            {"_id": project.get("_id")},
            {"$addToSet": {"joined_users": user_id}}  # Use $addToSet to avoid duplicates
        )


        if result.modified_count > 0:
            logger.info("User %s added to project %s successfully.", user_id, project_id)
            return True
        else:
            logger.warning("Failed to add user %s to project %s. No documents modified.", user_id, project_id)
            return False


    def remove_user(self, project_id, user_id):
        logger.debug("Removing user %s from project %s", user_id, project_id)
        result = self.collection.update_one(
            {"_id": ObjectId(project_id)},
            {"$pull": {"joined_users": user_id}}  # Use $pull to remove the user
        )
        return result.modified_count > 0
