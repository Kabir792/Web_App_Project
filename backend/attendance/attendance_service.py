import json
import os
import threading
from datetime import datetime, timezone

FILE_LOCK = threading.Lock()

class AttendanceService:
    def __init__(self, file_path=None, student_file_path=None):
        base_dir = os.path.dirname(os.path.abspath(__file__))
        if file_path is None:
            self.file_path = os.path.join(base_dir, "attendance.json")
        else:
            self.file_path = file_path

        if student_file_path is None:
            self.student_file_path = os.path.join(base_dir, "students.json")
        else:
            self.student_file_path = student_file_path

        self._ensure_file_exists()
        self._ensure_student_file_exists()

    def _ensure_file_exists(self):
        os.makedirs(os.path.dirname(self.file_path), exist_ok=True)
        if not os.path.exists(self.file_path):
            with open(self.file_path, 'w', encoding='utf-8') as f:
                json.dump([], f, indent=2)

    def _ensure_student_file_exists(self):
        os.makedirs(os.path.dirname(self.student_file_path), exist_ok=True)
        if not os.path.exists(self.student_file_path):
            with open(self.student_file_path, 'w', encoding='utf-8') as f:
                json.dump([], f, indent=2)

    def _read_records(self):
        """Read attendance records from disk without acquiring the lock."""
        try:
            with open(self.file_path, 'r', encoding='utf-8') as f:
                return json.load(f)
        except (json.JSONDecodeError, FileNotFoundError):
            return []

    def _read_student_records(self):
        """Read registered students from disk without acquiring the lock."""
        try:
            with open(self.student_file_path, 'r', encoding='utf-8') as f:
                return json.load(f)
        except (json.JSONDecodeError, FileNotFoundError):
            return []

    def get_all(self):
        """Read all attendance records from JSON file."""
        with FILE_LOCK:
            return self._read_records()

    def get_summary_metrics(self):
        """Calculate Today's Attendance, Present, Absent, Late & Percentage."""
        records = self.get_all()
        today_str = datetime.now().strftime("%Y-%m-%d")

        today_records = [r for r in records if r.get("date") == today_str]
        total_today = len(today_records)
        present = sum(1 for r in today_records if r.get("status") == "Present")
        absent = sum(1 for r in today_records if r.get("status") == "Absent")
        late = sum(1 for r in today_records if r.get("status") == "Late")

        percentage = round((present / total_today * 100), 1) if total_today > 0 else 0.0

        return {
            "totalToday": total_today,
            "present": present,
            "absent": absent,
            "late": late,
            "percentage": percentage,
            "totalRecords": len(records)
        }

    def search_and_filter(self, query=None, date=None, student_id=None, status=None):
        """Search and filter attendance records."""
        records = self.get_all()
        filtered = []

        for r in records:
            # Query match (Student ID, Name, Department)
            if query:
                q = str(query).strip().lower()
                id_match = q in str(r.get("studentId", "")).lower()
                name_match = q in str(r.get("studentName", "")).lower()
                dept_match = q in str(r.get("department", "")).lower()
                date_match = q in str(r.get("date", "")).lower()
                if not (id_match or name_match or dept_match or date_match):
                    continue

            # Exact field filters
            if date and str(r.get("date")) != str(date):
                continue
            if student_id and str(r.get("studentId")).strip().lower() != str(student_id).strip().lower():
                continue
            if status and str(r.get("status")).strip().lower() != str(status).strip().lower():
                continue

            filtered.append(r)

        return filtered

    def register_student(self, data):
        """Persist a registered student so the attendance form can auto-fill it later."""
        student_id = str(data.get("studentId", "")).strip()
        student_name = str(data.get("studentName", "")).strip()
        department = str(data.get("department", "")).strip()

        if not student_id or not student_name:
            return False, {
                "success": False,
                "message": "Validation Error: Student ID and Student Name are required."
            }, 400

        with FILE_LOCK:
            students = self._read_student_records()
            student_record = {
                "studentId": student_id,
                "studentName": student_name,
                "department": department or "General",
                "registeredAt": datetime.now(timezone.utc).isoformat()
            }

            existing_index = None
            for idx, item in enumerate(students):
                if str(item.get("studentId", "")).strip().lower() == student_id.lower():
                    existing_index = idx
                    break

            if existing_index is None:
                students.append(student_record)
            else:
                students[existing_index] = student_record

            with open(self.student_file_path, 'w', encoding='utf-8') as f:
                json.dump(students, f, indent=2, ensure_ascii=False)

            return True, {
                "success": True,
                "message": "Student registered successfully",
                "data": student_record
            }, 201

    def get_registered_students(self):
        """Return the latest registered students for the attendance form."""
        with FILE_LOCK:
            return self._read_student_records()

    def create_attendance(self, data):
        """Create new attendance record."""
        student_id = str(data.get("studentId", "")).strip()
        student_name = str(data.get("studentName", "")).strip()
        department = str(data.get("department", "")).strip()
        date = str(data.get("date", "")).strip()
        status = str(data.get("status", "")).strip()

        # Simple validation
        if not student_id or not date or not status or not student_name:
            return False, {
                "success": False,
                "message": "Validation Error: Student ID, Student Name, Date, and Status are required."
            }, 400

        with FILE_LOCK:
            records = self._read_records()

            # Generate auto-increment integer ID
            new_id = 1
            if records:
                max_id = max(r.get("id", 0) for r in records)
                new_id = max_id + 1

            new_record = {
                "id": new_id,
                "studentId": student_id,
                "studentName": student_name,
                "department": department or "General",
                "date": date,
                "status": status,
                "created_at": datetime.now(timezone.utc).isoformat()
            }

            records.insert(0, new_record)

            with open(self.file_path, 'w', encoding='utf-8') as f:
                json.dump(records, f, indent=2, ensure_ascii=False)

            return True, {
                "success": True,
                "message": "Attendance Marked Successfully",
                "data": new_record
            }, 201

    def update_attendance(self, record_id, data):
        """Update existing attendance record by ID."""
        try:
            target_id = int(record_id)
        except ValueError:
            return False, {"success": False, "message": "Invalid Attendance ID format"}, 400

        with FILE_LOCK:
            records = self._read_records()
            found_index = -1

            for idx, r in enumerate(records):
                if r.get("id") == target_id:
                    found_index = idx
                    break

            if found_index == -1:
                return False, {"success": False, "message": f"Attendance record with ID {record_id} not found"}, 404

            r = records[found_index]
            r["studentId"] = str(data.get("studentId", r["studentId"])).strip()
            r["studentName"] = str(data.get("studentName", r["studentName"])).strip()
            r["department"] = str(data.get("department", r["department"])).strip()
            r["date"] = str(data.get("date", r["date"])).strip()
            r["status"] = str(data.get("status", r["status"])).strip()
            r["updated_at"] = datetime.now(timezone.utc).isoformat()

            with open(self.file_path, 'w', encoding='utf-8') as f:
                json.dump(records, f, indent=2, ensure_ascii=False)

            return True, {
                "success": True,
                "message": f"Attendance Record #{target_id} updated successfully",
                "data": r
            }, 200

    def delete_attendance(self, record_id):
        """Delete attendance record by ID."""
        try:
            target_id = int(record_id)
        except ValueError:
            return False, {"success": False, "message": "Invalid Attendance ID format"}, 400

        with FILE_LOCK:
            records = self._read_records()
            initial_len = len(records)
            records = [r for r in records if r.get("id") != target_id]

            if len(records) == initial_len:
                return False, {"success": False, "message": f"Attendance record with ID {record_id} not found"}, 404

            with open(self.file_path, 'w', encoding='utf-8') as f:
                json.dump(records, f, indent=2, ensure_ascii=False)

            return True, {
                "success": True,
                "message": f"Attendance record #{target_id} deleted successfully"
            }, 200
