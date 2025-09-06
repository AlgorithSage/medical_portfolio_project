from flask import Flask
from flask_cors import CORS

def create_app():
    """Create and configure an instance of the Flask application."""
    app = Flask(__name__)
    CORS(app)

    with app.app_context():
        # Import parts of our application
        from . import routes

        return app
