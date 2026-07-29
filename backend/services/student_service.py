import json
import os
from datetime import datetime, timezone
import threading

FILE_LOCK = threading.Lock()

class StudentService:
    def __init__(self, data_file_path=None):
        if data_file_path is None:
            base_dir = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
            self.data_file_path = os.path.join(base_dir, "data", "students.json")
        else:
            self.data_file_path = data_file_path
            
        self._ensure_file_exists()

    def _ensure_file_exists(self):
        os.makedirs(os.path.dirname(self.data_file_path), exist_ok=True)
        if not os.path.exists(self.data_file_path):
            with open(self.data_file_path, 'w', encoding='utf-8') as f:
                json.dump([], f, indent=2)

    def get_all_students(self):
        """Read and return all students from JSON file."""
        with FILE_LOCK:
            try:
                with open(self.data_file_path, 'r', encoding='utf-8') as f:
                    students = json.load(f)
                    return students
            except (json.JSONDecodeError, FileNotFoundError):
                return []

    def get_student_by_id(self, student_id):
        """Get single student by Student ID."""
        students = self.get_all_students()
        target_id = str(student_id).strip().lower()
        for student in students:
            if str(student.get("student_id")).strip().lower() == target_id:
                return student
        return None

    def save_student(self, student_data):
        """CREATE: Saves a new student to JSON file with duplicate checks."""
        student_id = str(student_data.get("student_id")).strip()
        email = str(student_data.get("email")).strip().lower()

        with FILE_LOCK:
            students = []
            if os.path.exists(self.data_file_path):
                try:
                    with open(self.data_file_path, 'r', encoding='utf-8') as f:
                        students = json.load(f)
                except json.JSONDecodeError:
                    students = []

            # Check for duplicate Student ID or Email
            for student in students:
                if str(student.get("student_id")).strip().lower() == student_id.lower():
                    return False, {
                        "success": False,
                        "message": "Registration Failed",
                        "errors": {"student_id": "A student with this Student ID is already registered."}
                    }, 409

                if str(student.get("email")).strip().lower() == email:
                    return False, {
                        "success": False,
                        "message": "Registration Failed",
                        "errors": {"email": "A student with this Email is already registered."}
                    }, 409

            # Build record
            new_student = {
                "student_id": student_id,
                "name": str(student_data.get("name")).strip(),
                "department": str(student_data.get("department")).strip(),
                "email": email,
                "phone": str(student_data.get("phone")).strip(),
                "created_at": datetime.now(timezone.utc).isoformat()
            }

            students.append(new_student)

            with open(self.data_file_path, 'w', encoding='utf-8') as f:
                json.dump(students, f, indent=2, ensure_ascii=False)

            return True, {
                "success": True,
                "message": "Student Registered Successfully",
                "data": new_student
            }, 201

    def update_student(self, target_student_id, updated_data):
        """UPDATE: Updates an existing student record by Student ID."""
        target_id = str(target_student_id).strip().lower()
        new_email = str(updated_data.get("email", "")).strip().lower()

        with FILE_LOCK:
            if not os.path.exists(self.data_file_path):
                return False, {"success": False, "message": "Student database not found"}, 404

            try:
                with open(self.data_file_path, 'r', encoding='utf-8') as f:
                    students = json.load(f)
            except json.JSONDecodeError:
                return False, {"success": False, "message": "Corrupted database file"}, 500

            found_index = -1
            for index, student in enumerate(students):
                sid = str(student.get("student_id")).strip().lower()
                # Check email collision with other students
                if sid != target_id and str(student.get("email")).strip().lower() == new_email:
                    return False, {
                        "success": False,
                        "message": "Update Failed",
                        "errors": {"email": "Another student is already using this email."}
                    }, 409

                if sid == target_id:
                    found_index = index

            if found_index == -1:
                return False, {
                    "success": False,
                    "message": f"Student with ID '{target_student_id}' not found."
                }, 404

            # Update existing record
            current_student = students[found_index]
            current_student["name"] = str(updated_data.get("name", current_student["name"])).strip()
            current_student["department"] = str(updated_data.get("department", current_student["department"])).strip()
            current_student["email"] = new_email or current_student["email"]
            current_student["phone"] = str(updated_data.get("phone", current_student["phone"])).strip()
            current_student["updated_at"] = datetime.now(timezone.utc).isoformat()

            # Save to JSON file
            with open(self.data_file_path, 'w', encoding='utf-8') as f:
                json.dump(students, f, indent=2, ensure_ascii=False)

            return True, {
                "success": True,
                "message": f"Student ID '{target_student_id}' updated successfully",
                "data": current_student
            }, 200

    def delete_student(self, target_student_id):
        """DELETE: Deletes a student record by Student ID."""
        target_id = str(target_student_id).strip().lower()

        with FILE_LOCK:
            if not os.path.exists(self.data_file_path):
                return False, {"success": False, "message": "Student database not found"}, 404

            try:
                with open(self.data_file_path, 'r', encoding='utf-8') as f:
                    students = json.load(f)
            except json.JSONDecodeError:
                return False, {"success": False, "message": "Corrupted database file"}, 500

            initial_length = len(students)
            students = [s for s in students if str(s.get("student_id")).strip().lower() != target_id]

            if len(students) == initial_length:
                return False, {
                    "success": False,
                    "message": f"Student with ID '{target_student_id}' not found."
                }, 404

            # Write updated list
            with open(self.data_file_path, 'w', encoding='utf-8') as f:
                json.dump(students, f, indent=2, ensure_ascii=False)

            return True, {
                "success": True,
                "message": f"Student ID '{target_student_id}' deleted successfully"
            }, 200
