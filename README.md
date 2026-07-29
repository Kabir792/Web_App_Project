# Student Management System - Attendance Management Module

**Course**: Web Applications & Internet  
**Student Name**: Shawon Afrin Badhon  
**Student ID**: 2222625  
**Assigned Feature**: Attendance Management Module (Independent Project)  
**Technology Stack**: React.js, Vite, HTML5, CSS3, Python (Flask, Flask-CORS), JSON File Storage (`attendance.json`)

---

## 📁 Directory Architecture

```text
student-management-system-attendance/
├── backend/
│   ├── attendance/
│   │   ├── attendance.json       # Attendance Records Storage
│   │   ├── attendance_service.py # Service Layer (Read/Write/Filter)
│   │   └── attendance_routes.py  # REST APIs (POST, GET, PUT, DELETE, SEARCH)
│   ├── app.py                    # Flask Application Factory
│   ├── requirements.txt          # Dependencies (Flask, Flask-CORS)
│   └── run.py                    # Backend Server Runner (Port 5002)
├── frontend/
│   ├── src/
│   │   ├── modules/
│   │   │   └── attendance/
│   │   │       ├── components/
│   │   │       │   ├── AttendanceCard.jsx  # Metric Cards (Today's, Present, Absent, %)
│   │   │       │   ├── AttendanceForm.jsx  # Form for Marking & Editing Attendance
│   │   │       │   ├── AttendanceTable.jsx # Interactive Directory Table with Actions
│   │   │       │   ├── Navbar.jsx          # Top Navigation Bar with Student Badge
│   │   │       │   └── Sidebar.jsx         # Sidebar Navigation Menu
│   │   │       ├── pages/
│   │   │       │   ├── AttendanceDashboard.jsx # Dashboard Analytics & Logs
│   │   │       │   └── AttendanceManage.jsx    # Complete Attendance Management
│   │   │       ├── services/
│   │   │       │   └── attendanceApi.js        # Fetch API Client (async/await)
│   │   │       └── styles/
│   │   │           └── Attendance.css          # Responsive Modern CSS
│   │   ├── App.jsx               # Main React App Container
│   │   └── main.jsx              # React Entry Point
│   ├── index.html
│   ├── vite.config.js           # Vite Server Config (Port 5175)
│   └── package.json             # Dependencies & Scripts
├── attendance_postman_collection.json # Importable Postman Test Suite
├── package.json                 # Workspace Root Package
├── requirements.txt             # Requirements Mirror
└── README.md                    # Module Documentation & Viva Q&A
```

---

## 🚀 How to Run (Windows 11 / VS Code)

### Step 1: Run Backend Server (Port 5002)
```bash
cd backend
python run.py
```
*Backend Base URL*: `http://127.0.0.1:5002`

### Step 2: Run Frontend Web App (Port 5175)
```bash
cd frontend
npm install
npm run dev
```
*Frontend Base URL*: `http://localhost:5175`

---

## 🧪 REST API Endpoints Guide

### 1. Fetch Attendance Records & Metrics (`GET /api/attendance`)
```bash
curl -X GET http://127.0.0.1:5002/api/attendance
```

### 2. Mark New Attendance (`POST /api/attendance`)
```bash
curl -X POST http://127.0.0.1:5002/api/attendance \
  -H "Content-Type: application/json" \
  -d '{
    "studentId": "2220792",
    "studentName": "Zahid Kabir Utsho",
    "department": "Computer Science & Engineering",
    "date": "2026-07-29",
    "status": "Present"
  }'
```

### 3. Search & Filter Attendance (`GET /api/attendance/search`)
```bash
curl -X GET "http://127.0.0.1:5002/api/attendance/search?query=Zahid"
```

### 4. Edit Attendance (`PUT /api/attendance/1`)
```bash
curl -X PUT http://127.0.0.1:5002/api/attendance/1 \
  -H "Content-Type: application/json" \
  -d '{
    "studentId": "2220792",
    "studentName": "Zahid Kabir Utsho",
    "department": "Computer Science & Engineering",
    "date": "2026-07-29",
    "status": "Late"
  }'
```

### 5. Delete Attendance (`DELETE /api/attendance/1`)
```bash
curl -X DELETE http://127.0.0.1:5002/api/attendance/1
```

---

## 🐙 Version Control Templates

### 1. GitHub Commit Message
```text
feat(attendance): add independent Attendance Management Module for Shawon Afrin Badhon (ID: 2222625)

- Create isolated backend blueprint in backend/attendance/attendance_routes.py
- Add attendance_service.py and attendance.json storage
- Implement REST APIs: GET, POST, PUT, DELETE, and /search
- Build modular React frontend under src/modules/attendance (Dashboard, Manage, Form, Table, Sidebar, Navbar)
- Add metric analytics for Today's Attendance, Present, Absent, and Attendance Percentage
- Zero changes to existing student management code

Student Name: Shawon Afrin Badhon
Student ID: 2222625
Feature: Attendance Management Module
```

### 2. Pull Request Description
```markdown
## Summary of Changes
This PR introduces the independent **Attendance Management Module** developed by **Shawon Afrin Badhon** (ID: **2222625**).

### 🌟 Key Enhancements
1. **Backend (`backend/attendance/`)**:
   - `attendance.json`: Persistent JSON storage for attendance records.
   - `attendance_service.py`: Service layer for CRUD, search filtering, and metric calculation.
   - `attendance_routes.py`: REST APIs (`POST /api/attendance`, `GET`, `PUT`, `DELETE`, `SEARCH`).

2. **Frontend (`src/modules/attendance/`)**:
   - `pages/AttendanceDashboard.jsx`: Metric cards (Today's, Present, Absent, %) and quick logs.
   - `pages/AttendanceManage.jsx`: Search, date/status filters, mark & edit modal.
   - `components/`: Modular AttendanceForm, AttendanceTable, AttendanceCard, Navbar, and Sidebar.

### 🛡️ Non-Destructive Guarantee
Built as a completely independent module with zero file overlaps.

**Author**: Shawon Afrin Badhon (ID: 2222625)
```

---

## 🎓 Viva Voce Questions & Answers (Shawon Afrin Badhon)

### Q1: How does your Attendance module calculate summary metrics (e.g. Attendance Percentage)?
**Answer**: In `AttendanceService.get_summary_metrics()`, we filter all attendance records by current date (`YYYY-MM-DD`). We count total records for today, count status occurrences (`Present`, `Absent`, `Late`), and compute percentage using `(present / totalToday) * 100`.

### Q2: How does search and multi-field filtering work in `GET /api/attendance/search`?
**Answer**: `attendance_service.py` receives query parameters (`query`, `date`, `studentId`, `status`). It filters records case-insensitively across Student ID, Name, Department, and Date.

### Q3: Explain how real-time form submission and table updates are managed in React.
**Answer**: `AttendanceManage.jsx` maintains `records` state. Submitting `AttendanceForm` calls `markAttendanceApi` or `editAttendanceApi`. Upon receiving `{ success: true }`, the parent invokes `performSearch()`, updating React state and re-rendering `AttendanceTable` automatically.

### Q4: What validation is applied when marking attendance?
**Answer**: In accordance with project rules, simple validation enforces that Student ID, Student Name, Date, and Status are non-empty before writing to `attendance.json`.

### Q5: How do you ensure thread safety when reading/writing to `attendance.json`?
**Answer**: Python's `threading.Lock()` is used around file read and write blocks inside `AttendanceService` to prevent race conditions during concurrent API requests.
