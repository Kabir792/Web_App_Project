# Student Management System - Authentication & Full Student CRUD Portal

**Course**: Web Applications & Internet  
**Student Name**: Zahid Kabir Utsho  
**Student ID**: 2220792  
**Assigned Features**: Student Registration, Role-Based Login System (Admin/Student), and Full Student CRUD Operations (Create, Read, Update, Delete)  
**Technology Stack**: React.js, Vite, HTML5, CSS3, Python (Flask, Flask-CORS), JSON File Database (`students.json` & `users.json`)

---

## 📁 Project Architecture & Directory Structure

```text
student-management-system/
├── backend/
│   ├── data/
│   │   ├── students.json         # Student Records Storage
│   │   └── users.json            # Authentication & Roles Storage
│   ├── routes/
│   │   ├── auth_routes.py        # POST /api/auth/login Route
│   │   └── student_routes.py     # GET, POST, PUT, DELETE /api/students Routes
│   ├── services/
│   │   ├── auth_service.py       # User Authentication & Role Verification
│   │   └── student_service.py    # CRUD Operations & JSON File Locking
│   ├── utils/
│   │   └── validator.py          # Field Validation & Regex
│   ├── app.py                    # Flask Factory & CORS Config
│   ├── requirements.txt          # Python Dependencies
│   └── run.py                    # Backend Server Execution
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── AlertMessage.jsx      # Success/Error Notifications
│   │   │   ├── Footer.jsx            # Application Footer
│   │   │   ├── FormInput.jsx         # Accessible Form Inputs
│   │   │   ├── Header.jsx            # Header with Role Badges & Logout
│   │   │   ├── LoginForm.jsx         # Login Screen with Quick Presets
│   │   │   ├── StudentCard.jsx       # Student Profile Card (with Edit & Delete)
│   │   │   ├── StudentEditModal.jsx  # Glassmorphic Profile Edit Modal
│   │   │   └── StudentForm.jsx       # Real-time Validated Registration Form
│   │   ├── pages/
│   │   │   └── RegistrationPage.jsx  # Primary Dashboard Layout & Search
│   │   ├── services/
│   │   │   └── api.js                # REST Client (async/await fetch wrapper)
│   │   ├── styles/
│   │   │   └── main.css              # Glassmorphism Modern Dark System
│   │   ├── App.jsx
│   │   └── main.jsx
│   ├── index.html
│   ├── vite.config.js                # API Reverse Proxy Setup
│   └── package.json                  # NPM Dependencies & Scripts
├── postman_collection.json           # Importable Postman Test Suite
├── package.json                      # Workspace Root Package
└── README.md                         # Project Guide & Viva Voce Q&A
```

---

## 🔐 Credentials & Roles

| Role | Username | Password | Permissions |
| :--- | :--- | :--- | :--- |
| **Admin** | `admin` | `admin123` | Full access: Create, Read, Search, Update/Edit, Delete records |
| **Student** | `student` | `student123` | Read-only access: Search and view registered student profiles |

---

## 🚀 How to Run (Windows 11 / VS Code)

### Step 1: Run Backend Server
```bash
cd backend
python run.py
```
*API Base URL*: `http://127.0.0.1:5000`

### Step 2: Run Frontend App
```bash
cd frontend
npm run dev
```
*Web Application*: `http://localhost:5173`

---

## 🧪 REST API Endpoints Guide

### 1. User Login (`POST /api/auth/login`)
```bash
curl -X POST http://127.0.0.1:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username": "admin", "password": "admin123"}'
```

### 2. Register Student (`POST /api/register`)
```bash
curl -X POST http://127.0.0.1:5000/api/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Zahid Kabir Utsho",
    "student_id": "2220792",
    "department": "Computer Science & Engineering",
    "email": "zahid.utsho@university.edu",
    "phone": "+8801712345678"
  }'
```

### 3. Update Student (`PUT /api/students/2220792`)
```bash
curl -X PUT http://127.0.0.1:5000/api/students/2220792 \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Zahid Kabir Utsho",
    "student_id": "2220792",
    "department": "Software Engineering",
    "email": "zahid.utsho@university.edu",
    "phone": "+8801712345678"
  }'
```

### 4. Delete Student (`DELETE /api/students/2220792`)
```bash
curl -X DELETE http://127.0.0.1:5000/api/students/2220792
```

---

## Assessment 4

This branch contains the Student Registration end-to-end feature implementation.

Issue: #17