import logging
from flask import Flask, request, send_from_directory
from flask_cors import CORS
from .config import Config
from routes.auth import auth_bp
from routes.project import project_bp
from routes.resource import resource_bp
from db import db
import os

app = Flask(__name__, static_folder = 'build')
app.config.from_object(Config)
CORS(app)  # Enable CORS for all routes

# Set up logging
logging.basicConfig(level=logging.DEBUG)

# Register Blueprints
app.register_blueprint(auth_bp, url_prefix="/api/auth")
app.register_blueprint(project_bp, url_prefix="/api/projects")
app.register_blueprint(resource_bp, url_prefix="/api/resources")

@app.route('/', defaults = {'path' : ''})
@app.route('/<path:path>')
def serve(path):
    if path != "" and os.path.exists(app.static_folder + '/' + path):
        return send_from_directory(app.static_folder, path)
    else:
        return send_from_directory(app.static_folder, 'index.html')
    
def home():
    return "Welcome to the HaaS PoC API!"

if __name__ == "__main__":
    app.run(debug=True)