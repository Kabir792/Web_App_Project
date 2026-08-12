import sys
import os

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse

from routes.student_routes import student_router
from routes.auth_routes import auth_router
from attendance.attendance_routes import attendance_router
from grades.grade_routes import grade_router
from routes.report_routes import report_router


def create_app() -> FastAPI:
    app = FastAPI(
        title="Student Management System API",
        description="Unified FastAPI Backend for Student Registration, Auth, Attendance Management & Grades",
        version="1.0.0"
    )

    # Enable CORS for all API routes
    app.add_middleware(
        CORSMiddleware,
        allow_origins=["*"],
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"],
    )

    # Include APIRouters
    app.include_router(student_router)
    app.include_router(auth_router)
    app.include_router(attendance_router)
    app.include_router(grade_router)
    app.include_router(report_router)

    @app.get("/")
    async def root():
        return {
            "status": "online",
            "service": "Student Management System API",
            "version": "1.0.0",
            "docs": "/docs"
        }

    @app.get("/health")
    async def health_check():
        return {"status": "healthy"}

    @app.exception_handler(404)
    async def not_found(request: Request, exc):
        return JSONResponse(
            status_code=404,
            content={"success": False, "message": "Endpoint not found"}
        )

    @app.exception_handler(500)
    async def internal_error(request: Request, exc):
        return JSONResponse(
            status_code=500,
            content={"success": False, "message": "Internal Server Error"}
        )

    return app


app = create_app()

if __name__ == '__main__':
    import uvicorn
    uvicorn.run("app:app", host='0.0.0.0', port=5000, reload=True)
