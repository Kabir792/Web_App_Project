import sys
import os

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from routes.campus_routes import router as campus_router

def create_app() -> FastAPI:
    app = FastAPI(
        title="Smart Campus & Student Utility API",
        description="Standalone Backend for Offline-First Campus Map & Student Utility System",
        version="1.0.0"
    )

    app.add_middleware(
        CORSMiddleware,
        allow_origins=["*"],
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"],
    )

    app.include_router(campus_router)
    return app

app = create_app()

if __name__ == '__main__':
    import uvicorn
    uvicorn.run("app:app", host='0.0.0.0', port=5000, reload=True)
