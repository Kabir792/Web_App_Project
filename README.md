# Student Management System

A full-stack Student Management System with two modules built by a 2-person group:

- **Student Registration** — Zahid Kabir Utsho (ID: 2220792)
- **Attendance Management** — Shawon Afrin Badhon (ID: 2222625)

Both modules now run as **one unified FastAPI backend + one React frontend**, sharing a single admin login.

## Tech Stack

- **Backend**: Python, FastAPI, Uvicorn, Pydantic, JSON file storage
- **Frontend**: React 18, Vite, lucide-react

## Project Structure

```
student-management-system/
├── backend/
│   ├── app.py                 # FastAPI app: registers all routers
│   ├── run.py                 # Entry point (http://127.0.0.1:5000)
│   ├── routes/                # Student + Auth APIRouters
│   ├── services/               # Student + Auth business logic
│   ├── utils/                  # Validators
│   ├── data/                   # students.json, users.json
│   ├── attendance/             # Attendance APIRouter, service, data
│   └── tests/                  # Attendance service tests
├── frontend/
│   ├── src/
│   │   ├── App.jsx             # Login gate + module switcher
│   │   ├── pages/               # RegistrationPage
│   │   ├── components/          # Registration UI components
│   │   └── modules/attendance/  # Attendance UI (components, pages, styles)
│   └── vite.config.js
├── docs/                        # Postman collections
└── requirements.txt
```

## Setup & Run

### 1. Backend

```bash
cd backend
python -m venv venv
source venv/bin/activate        # Windows: venv\Scripts\activate
pip install -r requirements.txt
python run.py
```

Backend runs at `http://127.0.0.1:5000`.

### 2. Frontend

```bash
cd frontend
npm install
npm run dev
```

Frontend runs at `http://127.0.0.1:5173` and proxies `/api` requests to the backend.

### Login

Use the seeded admin account (see `backend/data/users.json`):

- **User ID**: `2220792`
- **Password**: `admin123`

After logging in, use the **Attendance** button (top-right) or **Student Registration** link (sidebar) to switch between modules.

## API Overview

| Method | Endpoint                     | Description                  |
|--------|-------------------------------|-------------------------------|
| POST   | `/api/auth/login`             | Admin login                   |
| POST   | `/api/register`               | Register a new student        |
| GET    | `/api/students`                | List all students             |
| GET    | `/api/students/<id>`           | Get a single student          |
| PUT    | `/api/students/<id>`           | Update a student               |
| DELETE | `/api/students/<id>`           | Delete a student                |
| GET    | `/api/attendance`               | List attendance + metrics       |
| GET    | `/api/attendance/search`         | Search/filter attendance         |
| POST   | `/api/attendance`                | Mark attendance                  |
| PUT    | `/api/attendance/<id>`           | Edit attendance record            |
| DELETE | `/api/attendance/<id>`           | Delete attendance record           |
| POST   | `/api/students/register`          | Register a student for attendance auto-fill |
| GET    | `/api/students/registered`        | List students registered for attendance      |

Postman collections for both modules are in `docs/`.

## Contributors

- Zahid Kabir Utsho (2220792) — Student Registration module
- Shawon Afrin Badhon (2222625) — Attendance Management module
