# db.py
from pymongo import MongoClient
from config import Config

mongo_client = MongoClient(Config.MONGO_URI)
print("Connected to MongoDB")
db = mongo_client["myDatabase"]
