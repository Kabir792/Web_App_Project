from flask import Blueprint, request, jsonify
from utils.validator import validate_student_data
from services.student_service import StudentService

student_bp = Blueprint('student_bp', __name__)
student_service = StudentService()

@student_bp.route('/api/health', methods=['GET'])
def health_check():
    return jsonify({
        "status": "healthy",
        "system": "Student Management System API",
        "developer": "Zahid Kabir Utsho (ID: 2220792)"
    }), 200

@student_bp.route('/api/register', methods=['POST'])
def register_student():
    """POST /api/register - Register a new student"""
    if not request.is_json:
        return jsonify({"success": False, "message": "Content-Type must be application/json"}), 400

    data = request.get_json()
    is_valid, errors = validate_student_data(data)
    if not is_valid:
        return jsonify({"success": False, "message": "Validation Failed", "errors": errors}), 400

    success, response, status_code = student_service.save_student(data)
    return jsonify(response), status_code

@student_bp.route('/api/students', methods=['GET'])
def get_students():
    """GET /api/students - List all students"""
    students = student_service.get_all_students()
    return jsonify({"success": True, "count": len(students), "data": students}), 200

@student_bp.route('/api/students/<student_id>', methods=['GET'])
def get_student_by_id(student_id):
    """GET /api/students/<student_id> - Get single student"""
    student = student_service.get_student_by_id(student_id)
    if not student:
        return jsonify({"success": False, "message": "Student not found"}), 404
    return jsonify({"success": True, "data": student}), 200

@student_bp.route('/api/students/<student_id>', methods=['PUT'])
def update_student(student_id):
    """PUT /api/students/<student_id> - Update existing student"""
    if not request.is_json:
        return jsonify({"success": False, "message": "Content-Type must be application/json"}), 400

    data = request.get_json()
    
    # Preserve original student_id in case body doesn't send it or sends it differently
    data["student_id"] = student_id
    
    is_valid, errors = validate_student_data(data)
    if not is_valid:
        return jsonify({"success": False, "message": "Validation Failed", "errors": errors}), 400

    success, response, status_code = student_service.update_student(student_id, data)
    return jsonify(response), status_code

@student_bp.route('/api/students/<student_id>', methods=['DELETE'])
def delete_student(student_id):
    """DELETE /api/students/<student_id> - Delete student record"""
    success, response, status_code = student_service.delete_student(student_id)
    return jsonify(response), status_code
