import logging
from flask import Flask, request
from flask_cors import CORS
from config import Config
from routes.auth import auth_bp
from routes.project import project_bp
from routes.resource import resource_bp
from db import db

app = Flask(__name__)
app.config.from_object(Config)
CORS(app)  # Enable CORS for all routes

# Set up logging
logging.basicConfig(level=logging.DEBUG)

# Register Blueprints
app.register_blueprint(auth_bp, url_prefix="/api/auth")
app.register_blueprint(project_bp, url_prefix="/api/projects")
app.register_blueprint(resource_bp, url_prefix="/api/resources")

@app.route('/')
def home():
    return "Welcome to the HaaS PoC API!"

if __name__ == "__main__":
    app.run(debug=True)