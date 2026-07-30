import os
import tempfile
import threading
import unittest
from pathlib import Path
import sys

sys.path.insert(0, str(Path(__file__).resolve().parents[1]))

from attendance.attendance_service import AttendanceService


class AttendanceServiceTests(unittest.TestCase):
    def test_create_attendance_completes_without_deadlock(self):
        with tempfile.TemporaryDirectory() as tmpdir:
            file_path = os.path.join(tmpdir, 'attendance.json')
            service = AttendanceService(file_path=file_path)
            result = {}

            def run_create():
                success, response, status_code = service.create_attendance({
                    'studentId': '2222625',
                    'studentName': 'Test User',
                    'department': 'Computer Science & Engineering',
                    'date': '2026-07-29',
                    'status': 'Present',
                })
                result['success'] = success
                result['response'] = response
                result['status_code'] = status_code

            thread = threading.Thread(target=run_create, daemon=True)
            thread.start()
            thread.join(timeout=2)

            self.assertFalse(thread.is_alive(), 'create_attendance deadlocked')
            self.assertTrue(result.get('success', False))
            self.assertEqual(result.get('status_code'), 201)
            self.assertEqual(result['response']['success'], True)

    def test_register_student_and_read_latest(self):
        with tempfile.TemporaryDirectory() as tmpdir:
            attendance_file = os.path.join(tmpdir, 'attendance.json')
            student_file = os.path.join(tmpdir, 'students.json')
            service = AttendanceService(file_path=attendance_file, student_file_path=student_file)

            success, response, status_code = service.register_student({
                'studentId': '2220792',
                'studentName': 'Zahid Kabir Utsho',
                'department': 'Computer Science & Engineering',
            })

            self.assertTrue(success)
            self.assertEqual(status_code, 201)
            self.assertEqual(response['success'], True)

            students = service.get_registered_students()
            self.assertEqual(len(students), 1)
            self.assertEqual(students[0]['studentId'], '2220792')
            self.assertEqual(students[0]['studentName'], 'Zahid Kabir Utsho')


if __name__ == '__main__':
    unittest.main()
