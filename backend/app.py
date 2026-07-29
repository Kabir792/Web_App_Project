from flask import Flask
from flask_cors import CORS
from routes.student_routes import student_bp
from routes.auth_routes import auth_bp

def create_app():
    app = Flask(__name__)
    
    # Enable CORS for all routes
    CORS(app, resources={r"/api/*": {"origins": "*"}})

    # Register blueprints
    app.register_blueprint(student_bp)
    app.register_blueprint(auth_bp)

    @app.errorhandler(404)
    def not_found(error):
        return {"success": False, "message": "Endpoint not found"}, 404

    @app.errorhandler(500)
    def internal_error(error):
        return {"success": False, "message": "Internal Server Error"}, 500

    return app

if __name__ == '__main__':
    app = create_app()
    app.run(host='0.0.0.0', port=5000, debug=True)
