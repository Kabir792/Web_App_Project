from fastapi import APIRouter, Request
from fastapi.responses import JSONResponse
from grades.grade_service import GradeService

grade_router = APIRouter()
grade_service = GradeService()

@grade_router.get('/api/grades')
async def get_all_grades():
    """GET /api/grades - Return all grade records"""
    grades = grade_service.get_all_grades()
    return JSONResponse(status_code=200, content={"success": True, "count": len(grades), "data": grades})

@grade_router.get('/api/grades/{student_id}')
async def get_student_grades(student_id: str):
    """GET /api/grades/{student_id} - Get grade sheet and GPA for a specific student"""
    summary = grade_service.get_student_gpa_summary(student_id)
    return JSONResponse(status_code=200, content={"success": True, "data": summary})

@grade_router.post('/api/grades')
async def add_grade(request: Request):
    """POST /api/grades - Add new grade record"""
    try:
        data = await request.json()
    except Exception:
        return JSONResponse(status_code=400, content={"success": False, "message": "Content-Type must be application/json"})

    success, response, status_code = grade_service.add_grade(data)
    return JSONResponse(status_code=status_code, content=response)

@grade_router.put('/api/grades/{grade_id}')
async def update_grade(grade_id: str, request: Request):
    """PUT /api/grades/{grade_id} - Update grade record"""
    try:
        data = await request.json()
    except Exception:
        return JSONResponse(status_code=400, content={"success": False, "message": "Content-Type must be application/json"})

    success, response, status_code = grade_service.update_grade(grade_id, data)
    return JSONResponse(status_code=status_code, content=response)

@grade_router.delete('/api/grades/{grade_id}')
async def delete_grade(grade_id: str):
    """DELETE /api/grades/{grade_id} - Delete grade record"""
    success, response, status_code = grade_service.delete_grade(grade_id)
    return JSONResponse(status_code=status_code, content=response)
