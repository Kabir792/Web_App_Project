from fastapi import APIRouter, Request
from fastapi.responses import JSONResponse
from services.auth_service import AuthService

auth_router = APIRouter()
auth_service = AuthService()

@auth_router.post('/api/auth/login')
async def login(request: Request):
    try:
        data = await request.json()
    except Exception:
        return JSONResponse(status_code=400, content={"success": False, "message": "Content-Type must be application/json"})

    user_id = data.get("user_id") or data.get("username", "")
    password = data.get("password", "")

    if not user_id or not password:
        return JSONResponse(status_code=400, content={"success": False, "message": "User ID and Password are required"})

    success, response, status_code = auth_service.login(user_id, password)
    return JSONResponse(status_code=status_code, content=response)
