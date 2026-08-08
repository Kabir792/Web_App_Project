from fastapi import APIRouter, Request
from fastapi.responses import JSONResponse
from utils.validator import validate_student_data
from services.student_service import StudentService

student_router = APIRouter()
student_service = StudentService()

@student_router.get('/api/health')
async def health_check():
    return JSONResponse(status_code=200, content={
        "status": "healthy",
        "system": "Student Management System API",
        "developer": "Zahid Kabir Utsho (ID: 2220792)"
    })

@student_router.post('/api/register')
async def register_student(request: Request):
    """POST /api/register - Register a new student"""
    try:
        data = await request.json()
    except Exception:
        return JSONResponse(status_code=400, content={"success": False, "message": "Content-Type must be application/json"})

    is_valid, errors = validate_student_data(data)
    if not is_valid:
        return JSONResponse(status_code=400, content={"success": False, "message": "Validation Failed", "errors": errors})

    success, response, status_code = student_service.save_student(data)
    return JSONResponse(status_code=status_code, content=response)

@student_router.get('/api/students')
async def get_students():
    """GET /api/students - List all students"""
    students = student_service.get_all_students()
    return JSONResponse(status_code=200, content={"success": True, "count": len(students), "data": students})

@student_router.get('/api/students/{student_id}')
async def get_student_by_id(student_id: str):
    """GET /api/students/{student_id} - Get single student"""
    student = student_service.get_student_by_id(student_id)
    if not student:
        return JSONResponse(status_code=404, content={"success": False, "message": "Student not found"})
    return JSONResponse(status_code=200, content={"success": True, "data": student})

@student_router.put('/api/students/{student_id}')
async def update_student(student_id: str, request: Request):
    """PUT /api/students/{student_id} - Update existing student"""
    try:
        data = await request.json()
    except Exception:
        return JSONResponse(status_code=400, content={"success": False, "message": "Content-Type must be application/json"})

    data["student_id"] = student_id
    
    is_valid, errors = validate_student_data(data)
    if not is_valid:
        return JSONResponse(status_code=400, content={"success": False, "message": "Validation Failed", "errors": errors})

    success, response, status_code = student_service.update_student(student_id, data)
    return JSONResponse(status_code=status_code, content=response)

@student_router.delete('/api/students/{student_id}')
async def delete_student(student_id: str):
    """DELETE /api/students/{student_id} - Delete student record"""
    success, response, status_code = student_service.delete_student(student_id)
    return JSONResponse(status_code=status_code, content=response)
