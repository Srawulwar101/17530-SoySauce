# models/resource.py
class HardwareResource:
    def __init__(self, db):
        self.collection = db["resources"]

    def add_resource(self, name, total_units):
        resource_data = {
            "name": name,
            "total_units": total_units,
            "available_units": total_units
        }
        return self.collection.insert_one(resource_data).inserted_id

    def checkout_resource(self, resource_id, units):
        resource = self.collection.find_one({"_id": resource_id})
        if resource and resource["available_units"] >= units:
            self.collection.update_one(
                {"_id": resource_id},
                {"$inc": {"available_units": -units}}
            )
            return True
        return False

    def checkin_resource(self, resource_id, units):
        resource = self.collection.find_one({"_id": resource_id})
        if resource and resource["available_units"] + units <= resource["total_units"]:
            self.collection.update_one(
                {"_id": resource_id},
                {"$inc": {"available_units": units}}
            )
            return True
        return False

    def get_resource(self, resource_id):
        return self.collection.find_one({"_id": resource_id})
