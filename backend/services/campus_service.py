import json
import os
from typing import List, Dict, Any

DATA_DIR = os.path.join(os.path.dirname(__file__), "..", "data")
LOCATIONS_FILE = os.path.join(DATA_DIR, "campus_locations.json")
COURSES_FILE = os.path.join(DATA_DIR, "courses.json")
ASSIGNMENTS_FILE = os.path.join(DATA_DIR, "assignments.json")

def _read_json(filepath: str) -> List[Dict[str, Any]]:
    if not os.path.exists(filepath):
        return []
    try:
        with open(filepath, "r", encoding="utf-8") as f:
            return json.load(f)
    except Exception:
        return []

def _write_json(filepath: str, data: List[Dict[str, Any]]) -> None:
    os.makedirs(os.path.dirname(filepath), exist_ok=True)
    with open(filepath, "w", encoding="utf-8") as f:
        json.dump(data, f, indent=2, ensure_ascii=False)

def get_campus_locations() -> List[Dict[str, Any]]:
    return _read_json(LOCATIONS_FILE)

def get_courses() -> List[Dict[str, Any]]:
    return _read_json(COURSES_FILE)

def get_assignments() -> List[Dict[str, Any]]:
    return _read_json(ASSIGNMENTS_FILE)

def save_assignment(assignment: Dict[str, Any]) -> Dict[str, Any]:
    assignments = get_assignments()
    assignment["sync_status"] = "synced"
    
    # Check if existing item
    existing_index = next((i for i, item in enumerate(assignments) if item["id"] == assignment["id"]), None)
    if existing_index is not None:
        assignments[existing_index] = assignment
    else:
        assignments.append(assignment)
        
    _write_json(ASSIGNMENTS_FILE, assignments)
    return assignment

def delete_assignment(assignment_id: str) -> bool:
    assignments = get_assignments()
    new_assignments = [item for item in assignments if item["id"] != assignment_id]
    if len(new_assignments) != len(assignments):
        _write_json(ASSIGNMENTS_FILE, new_assignments)
        return True
    return False

def sync_batch_assignments(batch: List[Dict[str, Any]]) -> List[Dict[str, Any]]:
    assignments = get_assignments()
    assignment_map = {item["id"]: item for item in assignments}
    
    synced_items = []
    for item in batch:
        item_id = item.get("id")
        action = item.get("_action", "upsert")
        
        if action == "delete" and item_id:
            if item_id in assignment_map:
                del assignment_map[item_id]
        else:
            item["sync_status"] = "synced"
            item.pop("_action", None)
            assignment_map[item_id] = item
            synced_items.append(item)
            
    updated_list = list(assignment_map.values())
    _write_json(ASSIGNMENTS_FILE, updated_list)
    return list(assignment_map.values())
