import sys
import os

# Ensure backend root is in Python path
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

from app import create_app

app = create_app()

if __name__ == '__main__':
    print("=" * 60)
    print(" Student Management System - Flask Backend API Server")
    print(" Developer: Zahid Kabir Utsho (ID: 2220792)")
    print(" Running on: http://127.0.0.1:5000")
    print(" Endpoint: POST http://127.0.0.1:5000/api/register")
    print("=" * 60)
    app.run(host='0.0.0.0', port=5000, debug=True)
