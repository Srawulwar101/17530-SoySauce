# models/resource.py
#import project because resources need to go inside projects
from models.project import Project
import logging

logger = logging.getLogger(__name__)

class HardwareResource:
    def __init__(self, db):
        self.collection = db["resources"]
        self.project_model = Project(db)

    def add_resource(self, name, total_units):
        resource_data = {
            "name": name,
            "total_units": total_units,
            "available_units": total_units
        }
        return self.collection.insert_one(resource_data).inserted_id

    def checkout_resource(self, resource_id, units, project_id):
        resource = self.collection.find_one({"_id": resource_id})
        if not resource:
            logger.error("Resource not found: resource_id=%s", resource_id)
            return False

        available_units = int(resource.get("available_units", 0))
        logger.debug("Checking out resource_id=%s: available_units=%d, requested_units=%d", resource_id, available_units, units)

        if available_units < units:
            logger.warning("Insufficient units available for resource_id=%s: available_units=%d, requested_units=%d", resource_id, available_units, units)
            return False

        # Update the resource's available units
        result = self.collection.update_one(
            {"_id": resource_id, "available_units": {"$gte": units}},
            {"$inc": {"available_units": -units}}
        )

        logger.debug("Update result for resource: %s", result.modified_count)

        if result.modified_count > 0:
            # Check if the project exists before adding the resource
            project = self.project_model.get_project(project_id)
            if not project:
                logger.warning("Project not found: project_id=%s", project_id)
                # Rollback the resource update if project does not exist
                self.collection.update_one(
                    {"_id": resource_id},
                    {"$inc": {"available_units": units}}  # Rollback
                )
                return False

            # Attempt to add the resource to the project
            project_update_success = self.project_model.add_resource(project_id, str(resource_id), units)
            if project_update_success:
                logger.info("Resource added to project successfully: project_id=%s, resource_id=%s, units=%d", project_id, resource_id, units)
                return True
            else:
                # Rollback the resource update if project update fails
                self.collection.update_one(
                    {"_id": resource_id},
                    {"$inc": {"available_units": units}}  # Rollback
                )
                logger.warning("Failed to add resource to project: project_id=%s, resource_id=%s", project_id, resource_id)
                return False
        else:
            logger.warning("Resource update failed for resource_id=%s", resource_id)
            return False

    def checkin_resource(self, resource_id, units, project_id):
        """
        Check in resource units from a project
        """
        logger.debug("Checking in resource: resource_id=%s, units=%d, project_id=%s", resource_id, units, project_id)

        # Get the current project resources
        project_resources = self.project_model.get_project_resources(project_id)

        # Check if resource is in the project
        if str(resource_id) not in project_resources or project_resources[str(resource_id)] < units:
            logger.warning("Resource %s not found in project %s or insufficient units for check-in.", resource_id, project_id)
            return False

        # Attempt to remove the resource from the project
        if not self.project_model.remove_resource(project_id, str(resource_id), units):
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
        self.project_model.add_resource(project_id, str(resource_id), units)
        return False

    def get_resource(self, resource_id):
        return self.collection.find_one({"_id": resource_id})
    
    def get_all_resources(self):
        return list(self.collection.find())