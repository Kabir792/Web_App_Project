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

## 🎓 Viva Voce Questions & Answers

### Q1: How did you implement Role-Based Access Control (RBAC)?
**Answer**: Users are authenticated via `POST /api/auth/login` checking credentials in `backend/data/users.json`. The user role (`ADMIN` or `STUDENT`) is returned and stored in frontend state. Admin role unlocks full CRUD capabilities (Registration Form, Edit Modal, Delete Buttons), whereas Student role restricts access to view-only directory search.

### Q2: Explain the Update (`PUT`) operation flow in your application.
**Answer**: When an Admin clicks Edit on a student card, `StudentEditModal.jsx` opens with pre-filled student details. Submitting the modal triggers `updateStudent()` API calling `PUT /api/students/<student_id>`. The backend validates the inputs, updates the corresponding student object in `students.json`, and updates the frontend state reactively.

### Q3: Explain the Delete (`DELETE`) operation flow.
**Answer**: Clicking Delete triggers a safety confirmation prompt. Upon user confirmation, `deleteStudent()` API sends a `DELETE /api/students/<student_id>` request. The backend filters out the record from `students.json` inside a thread-safe `FILE_LOCK` context and returns a success response. The frontend updates state to remove the student card smoothly.
