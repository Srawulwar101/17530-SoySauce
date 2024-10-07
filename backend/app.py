from flask import Flask
from config import Config
from routes.auth import auth_bp
from routes.project import project_bp
from routes.resource import resource_bp  # New import for resources
from db import db

app = Flask(__name__)
app.config.from_object(Config)

# Register Blueprints
app.register_blueprint(auth_bp, url_prefix="/api/auth")
app.register_blueprint(project_bp, url_prefix="/api/projects")
app.register_blueprint(resource_bp, url_prefix="/api/resources")  # Register new blueprint

@app.route('/')
def home():
    return "Welcome to the HaaS PoC API!"

if __name__ == "__main__":
    app.run(debug=True)
