from fastapi import APIRouter, HTTPException
from typing import List, Dict, Any
from services import campus_service
from services import iras_scraper

router = APIRouter(prefix="/api/campus", tags=["Smart Campus"])

@router.post("/auth/login")
def login(payload: Dict[str, Any]):
    identifier = payload.get("student_id") or payload.get("email") or payload.get("identifier")
    password = payload.get("password")
    
    if not identifier or not password:
        raise HTTPException(status_code=400, detail="Student ID / Email and password are required.")
        
    # Real IRAS Live Connection Attempt
    iras_result = iras_scraper.authenticate_and_scrape_iras(identifier, password)
    
    user = campus_service.authenticate_user(identifier, password)
    if not user:
        # Auto-create user profile from real IRAS login session
        user = {
            "id": f"usr-iras-{identifier}",
            "student_id": identifier,
            "full_name": f"IUB Student ({identifier})",
            "email": f"{identifier}@iub.edu.bd",
            "department": "SETS / CSE",
            "role": "STUDENT",
            "iras_synced": True,
            "avatar_url": f"https://api.dicebear.com/7.x/avataaars/svg?seed={identifier}"
        }
        
    return {
        "status": "success",
        "user": user,
        "iras_session": iras_result
    }

@router.post("/auth/register")
def register(user_data: Dict[str, Any]):
    if not user_data.get("student_id") or not user_data.get("email") or not user_data.get("password"):
        raise HTTPException(status_code=400, detail="Student ID, Email, and Password are required.")
        
    try:
        user = campus_service.register_user(user_data)
        return {"status": "success", "user": user}
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))

@router.post("/iras/sync")
def sync_iras(payload: Dict[str, Any]):
    student_id = payload.get("student_id")
    password = payload.get("password", "")
    if not student_id:
        raise HTTPException(status_code=400, detail="Student ID is required for IRAS sync.")
    return iras_scraper.authenticate_and_scrape_iras(student_id, password)

@router.get("/locations")
def list_locations():
    return campus_service.get_campus_locations()

@router.get("/courses")
def list_courses():
    return campus_service.get_courses()

@router.get("/assignments")
def list_assignments():
    return campus_service.get_assignments()

@router.post("/assignments")
def create_or_update_assignment(assignment: Dict[str, Any]):
    if not assignment.get("id") or not assignment.get("title"):
        raise HTTPException(status_code=400, detail="ID and Title are required")
    return campus_service.save_assignment(assignment)

@router.delete("/assignments/{assignment_id}")
def remove_assignment(assignment_id: str):
    success = campus_service.delete_assignment(assignment_id)
    if not success:
        raise HTTPException(status_code=404, detail="Assignment not found")
    return {"message": "Assignment deleted successfully"}

@router.post("/sync")
def batch_sync(payload: Dict[str, Any]):
    items = payload.get("items", [])
    synced = campus_service.sync_batch_assignments(items)
    return {"status": "success", "count": len(items), "assignments": synced}
