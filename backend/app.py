import sys
import os

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

from flask import Flask
from flask_cors import CORS
from attendance.attendance_routes import attendance_bp

def create_app():
    app = Flask(__name__)
    
    # Enable CORS for all REST routes
    CORS(app, resources={r"/api/*": {"origins": "*"}})

    # Register Attendance Blueprint
    app.register_blueprint(attendance_bp)

    @app.errorhandler(404)
    def not_found(error):
        return {"success": False, "message": "Endpoint not found"}, 404

    @app.errorhandler(500)
    def internal_error(error):
        return {"success": False, "message": "Internal Server Error"}, 500

    return app

if __name__ == '__main__':
    app = create_app()
    app.run(host='0.0.0.0', port=5002, debug=True)
