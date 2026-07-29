from flask import Blueprint, request, jsonify
from attendance.attendance_service import AttendanceService

attendance_bp = Blueprint('attendance_bp', __name__)
attendance_service = AttendanceService()

@attendance_bp.route('/api/attendance', methods=['GET'])
def get_attendance():
    """
    GET /api/attendance
    Returns list of all attendance records & summary metrics.
    """
    records = attendance_service.get_all()
    metrics = attendance_service.get_summary_metrics()
    return jsonify({
        "success": True,
        "count": len(records),
        "metrics": metrics,
        "data": records
    }), 200

@attendance_bp.route('/api/attendance/search', methods=['GET'])
def search_attendance():
    """
    GET /api/attendance/search?query=...&date=...&studentId=...&status=...
    Search and filter attendance records.
    """
    query = request.args.get("query", "")
    date = request.args.get("date", "")
    student_id = request.args.get("studentId", "")
    status = request.args.get("status", "")

    filtered = attendance_service.search_and_filter(
        query=query, date=date, student_id=student_id, status=status
    )
    return jsonify({
        "success": True,
        "count": len(filtered),
        "data": filtered
    }), 200

@attendance_bp.route('/api/attendance', methods=['POST'])
def mark_attendance():
    """
    POST /api/attendance
    Mark new attendance record.
    Body JSON: { "studentId": "2220792", "studentName": "...", "department": "CSE", "date": "2026-07-29", "status": "Present" }
    """
    if not request.is_json:
        return jsonify({
            "success": False,
            "message": "Content-Type must be application/json"
        }), 400

    data = request.get_json()
    success, response, status_code = attendance_service.create_attendance(data)
    return jsonify(response), status_code

@attendance_bp.route('/api/students/register', methods=['POST'])
def register_student():
    """
    POST /api/students/register
    Save a registered student so the attendance form can auto-fill it.
    """
    if not request.is_json:
        return jsonify({
            "success": False,
            "message": "Content-Type must be application/json"
        }), 400

    data = request.get_json()
    success, response, status_code = attendance_service.register_student(data)
    return jsonify(response), status_code


@attendance_bp.route('/api/students/registered', methods=['GET'])
def get_registered_students():
    """
    GET /api/students/registered
    Return all registered students for the attendance UI.
    """
    students = attendance_service.get_registered_students()
    return jsonify({
        "success": True,
        "count": len(students),
        "data": students
    }), 200


@attendance_bp.route('/api/attendance/<id>', methods=['PUT'])
def edit_attendance(id):
    """
    PUT /api/attendance/<id>
    Edit existing attendance record by ID.
    """
    if not request.is_json:
        return jsonify({
            "success": False,
            "message": "Content-Type must be application/json"
        }), 400

    data = request.get_json()
    success, response, status_code = attendance_service.update_attendance(id, data)
    return jsonify(response), status_code

@attendance_bp.route('/api/attendance/<id>', methods=['DELETE'])
def delete_attendance(id):
    """
    DELETE /api/attendance/<id>
    Delete attendance record by ID.
    """
    success, response, status_code = attendance_service.delete_attendance(id)
    return jsonify(response), status_code
