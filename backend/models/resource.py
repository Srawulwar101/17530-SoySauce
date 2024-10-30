# models/resource.py
#import project because resources need to go inside projects
from models.project import Project

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
        """
        Checkout resource units to a project
        """
        resource = self.collection.find_one({"_id": resource_id})
        if not resource or resource.get("available_units", 0) < units:
            return False

        result = self.collection.update_one(
            {"_id": resource_id, "available_units": {"$gte": units}},
            {"$inc": {"available_units": -units}}
        )

        if result.modified_count > 0:
            if self.project_model.add_resource(project_id, str(resource_id), units):
                return True
            
            self.collection.update_one(
                {"_id": resource_id},
                {"$inc": {"available_units": units}}
            )
        
        return False

    def checkin_resource(self, resource_id, units, project_id):
        """
        Check in resource units from a project
        """
        project_resources = self.project_model.get_project_resources(project_id)
        
        #Check if resource is in the project
        if str(resource_id) not in project_resources or project_resources[str(resource_id)] < units:
            return False

        
        if not self.project_model.remove_resource(project_id, str(resource_id), units):
            return False

        result = self.collection.update_one(
            {"_id": resource_id},
            {"$inc": {"available_units": units}}
        )

        if result.modified_count > 0:
            return True

        #Roll it back if unsucessful
        self.project_model.add_resource(project_id, str(resource_id), units)
        return False

    def get_resource(self, resource_id):
        return self.collection.find_one({"_id": resource_id})
    
    def get_all_resources(self):
        return list(self.collection.find())