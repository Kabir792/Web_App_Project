import sys
import os

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

from app import create_app

app = create_app()

if __name__ == '__main__':
    print("=" * 65)
    print(" Student Management System - Attendance Management Server")
    print(" Developer: Shawon Afrin Badhon (ID: 2222625)")
    print(" Running on: http://127.0.0.1:5002")
    print(" Endpoints: GET/POST http://127.0.0.1:5002/api/attendance")
    print("=" * 65)
    app.run(host='0.0.0.0', port=5002, debug=True)
