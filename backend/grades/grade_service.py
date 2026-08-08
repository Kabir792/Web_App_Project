import os
import json
import uuid

class GradeService:
    def __init__(self, file_path=None):
        if file_path is None:
            base_dir = os.path.dirname(os.path.abspath(__file__))
            file_path = os.path.join(base_dir, 'grades.json')
        self.file_path = file_path
        self._ensure_file_exists()

    def _ensure_file_exists(self):
        if not os.path.exists(self.file_path):
            os.makedirs(os.path.dirname(self.file_path), exist_ok=True)
            with open(self.file_path, 'w', encoding='utf-8') as f:
                json.dump([], f)

    def _load_grades(self):
        try:
            with open(self.file_path, 'r', encoding='utf-8') as f:
                return json.load(f)
        except Exception:
            return []

    def _save_grades(self, grades):
        with open(self.file_path, 'w', encoding='utf-8') as f:
            json.dump(grades, f, indent=2, ensure_ascii=False)

    @staticmethod
    def calculate_grade_letter_and_point(marks):
        try:
            m = float(marks)
        except (ValueError, TypeError):
            m = 0.0

        if m >= 90:
            return "A", 4.00
        elif m >= 85:
            return "A-", 3.70
        elif m >= 80:
            return "B+", 3.30
        elif m >= 75:
            return "B", 3.00
        elif m >= 70:
            return "B-", 2.70
        elif m >= 65:
            return "C+", 2.30
        elif m >= 60:
            return "C", 2.00
        elif m >= 50:
            return "D", 1.00
        else:
            return "F", 0.00

    def get_all_grades(self):
        return self._load_grades()

    def get_student_grades(self, student_id):
        grades = self._load_grades()
        return [g for g in grades if str(g.get("student_id")).lower() == str(student_id).lower()]

    def get_student_gpa_summary(self, student_id):
        student_grades = self.get_student_grades(student_id)
        if not student_grades:
            return {
                "student_id": student_id,
                "total_courses": 0,
                "total_credits": 0,
                "gpa": 0.00,
                "grades": []
            }

        total_points = 0.0
        total_credits = 0

        for g in student_grades:
            credits = int(g.get("credit_hours", 3))
            gp = float(g.get("grade_point", 0.0))
            total_points += (gp * credits)
            total_credits += credits

        cgpa = round(total_points / total_credits, 2) if total_credits > 0 else 0.00

        return {
            "student_id": student_id,
            "student_name": student_grades[0].get("student_name", "N/A") if student_grades else "N/A",
            "total_courses": len(student_grades),
            "total_credits": total_credits,
            "cgpa": cgpa,
            "grades": student_grades
        }

    def add_grade(self, data):
        student_id = data.get("student_id") or data.get("studentId")
        course_code = data.get("course_code") or data.get("courseCode")
        marks = data.get("marks", 0)

        if not student_id or not course_code:
            return False, {"success": False, "message": "student_id and course_code are required"}, 400

        letter, point = self.calculate_grade_letter_and_point(marks)

        new_record = {
            "id": f"grd-{uuid.uuid4().hex[:6]}",
            "student_id": str(student_id),
            "student_name": data.get("student_name") or data.get("studentName", "Student"),
            "course_code": str(course_code).upper(),
            "course_title": data.get("course_title") or data.get("courseTitle", "Course Title"),
            "credit_hours": int(data.get("credit_hours") or data.get("creditHours", 3)),
            "marks": float(marks),
            "grade_letter": letter,
            "grade_point": point,
            "semester": data.get("semester", "Spring 2026")
        }

        grades = self._load_grades()
        grades.append(new_record)
        self._save_grades(grades)

        return True, {"success": True, "message": "Grade record added successfully", "data": new_record}, 201

    def update_grade(self, grade_id, data):
        grades = self._load_grades()
        found = False

        for i, g in enumerate(grades):
            if g.get("id") == grade_id:
                found = True
                marks = data.get("marks", g.get("marks"))
                letter, point = self.calculate_grade_letter_and_point(marks)

                g["marks"] = float(marks)
                g["grade_letter"] = letter
                g["grade_point"] = point
                if "course_code" in data or "courseCode" in data:
                    g["course_code"] = (data.get("course_code") or data.get("courseCode")).upper()
                if "course_title" in data or "courseTitle" in data:
                    g["course_title"] = data.get("course_title") or data.get("courseTitle")
                if "credit_hours" in data or "creditHours" in data:
                    g["credit_hours"] = int(data.get("credit_hours") or data.get("creditHours"))
                if "semester" in data:
                    g["semester"] = data.get("semester")
                break

        if not found:
            return False, {"success": False, "message": "Grade record not found"}, 404

        self._save_grades(grades)
        return True, {"success": True, "message": "Grade record updated successfully"}, 200

    def delete_grade(self, grade_id):
        grades = self._load_grades()
        new_grades = [g for g in grades if g.get("id") != grade_id]

        if len(new_grades) == len(grades):
            return False, {"success": False, "message": "Grade record not found"}, 404

        self._save_grades(new_grades)
        return True, {"success": True, "message": "Grade record deleted successfully"}, 200
