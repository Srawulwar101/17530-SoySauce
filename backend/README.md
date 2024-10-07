# Hardware-as-a-Service (HaaS) Backend

This is the backend for the Hardware-as-a-Service (HaaS) Proof of Concept (PoC) application, built using Flask and MongoDB. It provides API endpoints for user authentication, project management, and hardware resource check-in/check-out.

## Features
- **User Management**: Sign up and log in with encrypted passwords.
- **Project Management**: Create and retrieve projects associated with users.
- **Resource Management**: Check out and check in hardware resources, managing availability.

## Technologies
- **Flask**: Python web framework used for the backend.
- **MongoDB**: NoSQL database to store user, project, and hardware resource information.
- **PyMongo**: Python library for interacting with MongoDB.
- **Dotenv**: Used for environment variable management.

## Setup

### Prerequisites
- Python 3.x
- MongoDB Atlas account and connection string
- Install dependencies with `pip`

### Installation
1. Clone the repository and navigate to the backend directory:
   ```bash
   git clone <repository_url>
   cd my-haas-app/backend
Set up a virtual environment:

bash
Copy code
python3 -m venv venv
source venv/bin/activate  # On Windows use `venv\Scripts\activate`
Install dependencies:

bash
Copy code
pip install -r requirements.txt
Create a .env file with your MongoDB URI:

plaintext
Copy code
MONGO_URI=mongodb+srv://<username>:<password>@cluster0.mongodb.net/myDatabase?retryWrites=true&w=majority
Running the Server
Start the Flask server with:

bash
Copy code
python app.py
The server should run at http://127.0.0.1:5000/.

API Endpoints
User Authentication
Sign Up: POST /api/auth/signup
Request Body:
json
Copy code
{ "username": "string", "password": "string" }
Response:
json
Copy code
{ "message": "User created successfully", "user_id": "string" }
Login: POST /api/auth/login
Request Body:
json
Copy code
{ "username": "string", "password": "string" }
Response:
json
Copy code
{ "message": "Login successful" }
Project Management
Create Project: POST /api/projects/create_project
Request Body:
json
Copy code
{ "user_id": "string", "project_name": "string", "description": "string", "project_id": "string" }
Response:
json
Copy code
{ "message": "Project created successfully", "project_id": "string" }
Get User Projects: GET /api/projects/get_projects/<user_id>
Response:
json
Copy code
{ "projects": [ { "project_name": "string", "description": "string", ... } ] }
Resource Management
Check Out Resource: POST /api/resources/checkout
Request Body:
json
Copy code
{ "resource_id": "string", "units": "number" }
Response:
json
Copy code
{ "message": "Resource checked out successfully" }
Check In Resource: POST /api/resources/checkin
Request Body:
json
Copy code
{ "resource_id": "string", "units": "number" }
Response:
json
Copy code
{ "message": "Resource checked in successfully" }
Additional Notes
This backend is designed for development purposes. For production deployment, consider using a WSGI server like Gunicorn.
Ensure that IP addresses are whitelisted in MongoDB Atlas to allow external connections.
License
This project is licensed under the MIT License.

yaml
Copy code

---

Just copy and paste the entire block above into your `README.md` file in the backend directory. Let me know if there’s anything more you’d like to add or adjust!