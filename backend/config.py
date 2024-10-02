import os
from dotenv import load_dotenv

load_dotenv()  # Load environment variables from .env file

class Config:
    SECRET_KEY = os.getenv('SECRET_KEY') or 'your_default_secret_key'
    JWT_SECRET_KEY = os.getenv('JWT_SECRET_KEY') or 'your_jwt_secret_key'
    MONGO_URI = os.getenv('MONGO_URI') or 'your_mongodb_connection_string'
