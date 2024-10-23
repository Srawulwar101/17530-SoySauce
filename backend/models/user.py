from pymongo import MongoClient
from werkzeug.security import generate_password_hash, check_password_hash
from db import db

class User:
    def __init__(self, username, password=None, _id=None):
        self.username = username
        self.password = password
        self._id = _id
        self.collection = db["users"]

    def save_to_db(self):
        hashed_password = generate_password_hash(self.password)
        user_data = {
            "username": self.username,
            "password": hashed_password
        }
        result = self.collection.insert_one(user_data)
        self._id = result.inserted_id
        return self._id

    @staticmethod
    def find_by_username(username):
        user_data = db["users"].find_one({"username": username})
        if user_data:
            return User(username=user_data['username'], password=user_data['password'], _id=user_data['_id'])
        return None

    def check_password(self, password):
        return check_password_hash(self.password, password)