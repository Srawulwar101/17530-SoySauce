from flask import Flask
from flask_cors import CORS
from config import Config
from utils.db import initialize_db
from flask_jwt_extended import JWTManager

# Import blueprints
from routes.auth_routes import auth_bp
from routes.project_routes import project_bp
from routes.resource_routes import resource_bp

app = Flask(__name__)
app.config.from_object(Config)

CORS(app)
jwt = JWTManager(app)

initialize_db(app)

# Register Blueprints
app.register_blueprint(auth_bp, url_prefix='/api/auth')
app.register_blueprint(project_bp, url_prefix='/api/projects')
app.register_blueprint(resource_bp, url_prefix='/api/resources')

if __name__ == '__main__':
    app.run(debug=True)
