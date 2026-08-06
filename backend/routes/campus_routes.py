from fastapi import APIRouter, HTTPException
from typing import List, Dict, Any
from services import campus_service

router = APIRouter(prefix="/api/campus", tags=["Smart Campus"])

@router.get("/locations")
def list_locations():
    """Get all pre-seeded campus map locations."""
    return campus_service.get_campus_locations()

@router.get("/courses")
def list_courses():
    """Get student courses."""
    return campus_service.get_courses()

@router.get("/assignments")
def list_assignments():
    """Get student assignments."""
    return campus_service.get_assignments()

@router.post("/assignments")
def create_or_update_assignment(assignment: Dict[str, Any]):
    """Create or update a single assignment."""
    if not assignment.get("id") or not assignment.get("title"):
        raise HTTPException(status_code=400, detail="ID and Title are required")
    return campus_service.save_assignment(assignment)

@router.delete("/assignments/{assignment_id}")
def remove_assignment(assignment_id: str):
    """Delete an assignment."""
    success = campus_service.delete_assignment(assignment_id)
    if not success:
        raise HTTPException(status_code=404, detail="Assignment not found")
    return {"message": "Assignment deleted successfully"}

@router.post("/sync")
def batch_sync(payload: Dict[str, Any]):
    """Batch sync offline changes from client IndexedDB queue."""
    items = payload.get("items", [])
    synced = campus_service.sync_batch_assignments(items)
    return {"status": "success", "count": len(items), "assignments": synced}
