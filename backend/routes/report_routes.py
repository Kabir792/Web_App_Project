import os
import json
from fastapi import APIRouter
from fastapi.responses import JSONResponse

report_router = APIRouter()

BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
STUDENTS_FILE = os.path.join(BASE_DIR, "data", "students.json")
ATTENDANCE_FILE = os.path.join(BASE_DIR, "attendance", "attendance.json")
GRADES_FILE = os.path.join(BASE_DIR, "grades", "grades.json")

def load_json(path):
    if not os.path.exists(path):
        return []
    try:
        with open(path, 'r', encoding='utf-8') as f:
            return json.load(f)
    except Exception:
        return []

@report_router.get('/api/reports/student/{student_id}')
async def get_student_full_report(student_id: str):
    sid = str(student_id).strip().lower()
    
    # 1. Fetch Student Profile
    students = load_json(STUDENTS_FILE)
    student = next((s for s in students if str(s.get('student_id', '')).strip().lower() == sid), None)
    
    # Fallback if student not in students.json
    if not student:
        # Check if present in grades or attendance
        grades = load_json(GRADES_FILE)
        g_item = next((g for g in grades if str(g.get('student_id', '')).strip().lower() == sid), None)
        if g_item:
            student = {
                "student_id": g_item.get("student_id"),
                "name": g_item.get("student_name"),
                "department": "Computer Science & Engineering",
                "email": f"{g_item.get('student_id')}@iub.edu.bd",
                "phone": "N/A"
            }
        else:
            return JSONResponse(status_code=404, content={"success": False, "message": f"Student ID '{student_id}' not found"})

    # 2. Fetch Attendance Records & Calculate Metrics
    all_attendance = load_json(ATTENDANCE_FILE)
    att_records = [
        a for a in all_attendance
        if str(a.get('studentId', '') or a.get('student_id', '')).strip().lower() == sid
    ]
    
    total_att = len(att_records)
    present_att = len([a for a in att_records if str(a.get('status', '')).lower() == 'present'])
    absent_att = len([a for a in att_records if str(a.get('status', '')).lower() == 'absent'])
    late_att = len([a for a in att_records if str(a.get('status', '')).lower() == 'late'])
    att_percentage = round((present_att / total_att * 100), 2) if total_att > 0 else 100.0

    # 3. Fetch Grades & Calculate CGPA
    all_grades = load_json(GRADES_FILE)
    grade_records = [
        g for g in all_grades
        if str(g.get('student_id', '')).strip().lower() == sid
    ]
    
    total_credits = sum([float(g.get('credit_hours', 3)) for g in grade_records])
    weighted_points = sum([float(g.get('grade_point', 0.0)) * float(g.get('credit_hours', 3)) for g in grade_records])
    cgpa = round(weighted_points / total_credits, 2) if total_credits > 0 else 0.00

    return JSONResponse(status_code=200, content={
        "success": True,
        "student": student,
        "attendance": {
            "total_classes": total_att,
            "present": present_att,
            "absent": absent_att,
            "late": late_att,
            "percentage": att_percentage,
            "records": att_records
        },
        "academic": {
            "total_courses": len(grade_records),
            "total_credits": total_credits,
            "cgpa": cgpa,
            "grades": grade_records
        }
    })
