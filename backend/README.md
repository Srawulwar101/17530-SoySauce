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

### Install dependencies with pip

## Installation

1. Clone the repository and navigate to the backend directory:

    ```bash
    git clone <repository_url>
    cd my-haas-app/backend
    ```

2. Set up a virtual environment:

    ```bash
    python3 -m venv venv
    source venv/bin/activate  # On Windows use venv\Scripts\activate
    ```

3. Install dependencies:

    ```bash
    pip install -r requirements.txt
    ```

4. Create a `.env` file with your MongoDB URI:

    ```plaintext
    MONGO_URI=mongodb+srv://<username>:<password>@cluster0.mongodb.net/myDatabase?retryWrites=true&w=majority
    ```

### Running the Server

Start the Flask server with:

```bash
python app.py
