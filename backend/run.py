import sys
import os

# Ensure backend root is in Python path
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

from app import create_app

app = create_app()

if __name__ == '__main__':
    print("=" * 65)
    print(" Student Management System - Flask Backend API Server")
    print(" Modules: Student Registration + Auth + Attendance Management")
    print(" Running on: http://127.0.0.1:5000")
    print(" Endpoints:")
    print("   POST   /api/register              (register student)")
    print("   GET    /api/students               (list students)")
    print("   POST   /api/auth/login             (admin login)")
    print("   GET    /api/attendance             (attendance list + metrics)")
    print("   POST   /api/attendance             (mark attendance)")
    print("=" * 65)
    app.run(host='0.0.0.0', port=5000, debug=True)
