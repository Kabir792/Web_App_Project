import sys
import os
import uvicorn

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

from app import app

if __name__ == '__main__':
    print("=" * 65)
    print(" Student Management System - FastAPI Backend API Server")
    print(" Running on: http://127.0.0.1:5000")
    print("=" * 65)
    uvicorn.run("app:app", host='0.0.0.0', port=5000, reload=True)
