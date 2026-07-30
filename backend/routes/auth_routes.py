from flask import Blueprint, request, jsonify
from services.auth_service import AuthService

auth_bp = Blueprint('auth_bp', __name__)
auth_service = AuthService()

@auth_bp.route('/api/auth/login', methods=['POST'])
def login():
    if not request.is_json:
        return jsonify({"success": False, "message": "Content-Type must be application/json"}), 400

    data = request.get_json()
    # Support both user_id and fallback username if provided
    user_id = data.get("user_id") or data.get("username", "")
    password = data.get("password", "")

    if not user_id or not password:
        return jsonify({"success": False, "message": "User ID and Password are required"}), 400

    success, response, status_code = auth_service.login(user_id, password)
    return jsonify(response), status_code
