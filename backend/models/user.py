from pymongo import MongoClient
from werkzeug.security import generate_password_hash, check_password_hash

class User:
    def __init__(self, db):
        self.collection = db["users"]

    def create_user(self, username, password):
        hashed_password = generate_password_hash(password)
        user_data = {
            "username": username,
            "password": hashed_password
        }
        result = self.collection.insert_one(user_data)
        return result.inserted_id

    def authenticate_user(self, username, password):
        user = self.collection.find_one({"username": username})
        if user and check_password_hash(user["password"], password):
            return True
        return False
