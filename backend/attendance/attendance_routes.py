from fastapi import APIRouter, Request
from fastapi.responses import JSONResponse
from attendance.attendance_service import AttendanceService

attendance_router = APIRouter()
attendance_service = AttendanceService()

@attendance_router.get('/api/attendance')
async def get_attendance():
    records = attendance_service.get_all()
    metrics = attendance_service.get_summary_metrics()
    return JSONResponse(status_code=200, content={
        "success": True,
        "count": len(records),
        "metrics": metrics,
        "data": records
    })

@attendance_router.get('/api/attendance/search')
async def search_attendance(query: str = "", date: str = "", studentId: str = "", status: str = ""):
    filtered = attendance_service.search_and_filter(
        query=query, date=date, student_id=studentId, status=status
    )
    return JSONResponse(status_code=200, content={
        "success": True,
        "count": len(filtered),
        "data": filtered
    })

@attendance_router.post('/api/attendance')
async def mark_attendance(request: Request):
    try:
        data = await request.json()
    except Exception:
        return JSONResponse(status_code=400, content={"success": False, "message": "Content-Type must be application/json"})

    success, response, status_code = attendance_service.create_attendance(data)
    return JSONResponse(status_code=status_code, content=response)

@attendance_router.post('/api/students/register')
async def register_student(request: Request):
    try:
        data = await request.json()
    except Exception:
        return JSONResponse(status_code=400, content={"success": False, "message": "Content-Type must be application/json"})

    success, response, status_code = attendance_service.register_student(data)
    return JSONResponse(status_code=status_code, content=response)

@attendance_router.get('/api/students/registered')
async def get_registered_students():
    students = attendance_service.get_registered_students()
    return JSONResponse(status_code=200, content={
        "success": True,
        "count": len(students),
        "data": students
    })

@attendance_router.put('/api/attendance/{id}')
async def edit_attendance(id: str, request: Request):
    try:
        data = await request.json()
    except Exception:
        return JSONResponse(status_code=400, content={"success": False, "message": "Content-Type must be application/json"})

    success, response, status_code = attendance_service.update_attendance(id, data)
    return JSONResponse(status_code=status_code, content=response)

@attendance_router.delete('/api/attendance/{id}')
async def delete_attendance(id: str):
    success, response, status_code = attendance_service.delete_attendance(id)
    return JSONResponse(status_code=status_code, content=response)
