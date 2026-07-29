import re

EMAIL_REGEX = r'^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$'
PHONE_REGEX = r'^\+?[0-9]{7,15}$'
STUDENT_ID_REGEX = r'^[a-zA-Z0-9_-]{4,20}$'
NAME_REGEX = r'^[a-zA-Z\s\.\'-]{2,100}$'

VALID_DEPARTMENTS = [
    "Computer Science & Engineering",
    "Software Engineering",
    "Electrical & Electronic Engineering",
    "Information Technology",
    "Business Administration",
    "Civil Engineering",
    "Mechanical Engineering"
]

def validate_student_data(data):
    """
    Validates incoming student payload.
    Returns (is_valid, errors_dict)
    """
    errors = {}

    if not isinstance(data, dict):
        return False, {"message": "Invalid JSON payload format."}

    # 1. Student Name validation
    name = data.get("name", "").strip() if isinstance(data.get("name"), str) else ""
    if not name:
        errors["name"] = "Student Name is required."
    elif not re.match(NAME_REGEX, name):
        errors["name"] = "Student Name must be 2-100 characters and contain only letters and standard name punctuation."

    # 2. Student ID validation
    student_id = str(data.get("student_id", "")).strip()
    if not student_id:
        errors["student_id"] = "Student ID is required."
    elif not re.match(STUDENT_ID_REGEX, student_id):
        errors["student_id"] = "Student ID must be 4-20 alphanumeric characters."

    # 3. Department validation
    department = data.get("department", "").strip() if isinstance(data.get("department"), str) else ""
    if not department:
        errors["department"] = "Department is required."
    elif len(department) < 2 or len(department) > 100:
        errors["department"] = "Department name must be between 2 and 100 characters."

    # 4. Email validation
    email = data.get("email", "").strip() if isinstance(data.get("email"), str) else ""
    if not email:
        errors["email"] = "Email address is required."
    elif not re.match(EMAIL_REGEX, email):
        errors["email"] = "Please enter a valid email address (e.g. name@domain.com)."

    # 5. Phone validation
    phone = data.get("phone", "").strip() if isinstance(data.get("phone"), str) else ""
    if not phone:
        errors["phone"] = "Phone number is required."
    elif not re.match(PHONE_REGEX, phone):
        errors["phone"] = "Please enter a valid phone number (7-15 digits, optional + prefix)."

    is_valid = len(errors) == 0
    return is_valid, errors
