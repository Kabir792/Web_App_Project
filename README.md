# 🎓 Student Management System & IUB Academic Portal

A full-stack Web Application built with **Python FastAPI** and **React 18 + Vite**, designed for university student registration, attendance tracking, course grade management, and official **1-Page A4 PDF Academic Transcript** generation compliant with **Independent University, Bangladesh (IUB)** academic standards.

---

## 👥 Group Project Contribution & Work Division

| Member Name | Student ID | Designated Modules & Features |
| :--- | :--- | :--- |
| **Zahid Kabir Utsho** | `2220792` | **Module 1**: Student Registration & Profile Directory System<br>**Module 2**: IUB 1-Page Academic Transcript & PDF Generator Engine |
| **Shawon Afrin Badhon** | `2222625` | **Module 3**: Student Attendance Tracking & Management Portal<br>**Module 4**: Academic Course Grade Entry & CGPA Calculation System |

---

## ✨ Key Features

1. **Student Registration & Directory Management**
   - Live Student Directory Feed with multi-field searching (ID, Name, Department, Email).
   - Complete CRUD operations (Register, Update, Delete).
   - Real-time directory metrics and status tracking.

2. **Student Attendance Tracking Portal**
   - Date-wise attendance logging (Present, Absent, Late).
   - Real-time attendance percentage metrics and summary analytics.
   - Date range searching and directory filtering.

3. **Academic Grade & CGPA Management System**
   - Course grade entries (Course Code, Course Title, Credits, Marks, Semester).
   - **IUB Official Grading System Integration** (4.00 Scale):
     - `90% - 100%`: **A** (4.00) &bull; `85% - 89%`: **A-** (3.70) &bull; `80% - 84%`: **B+** (3.30)
     - `75% - 79%`: **B** (3.00) &bull; `70% - 74%`: **B-** (2.70) &bull; `65% - 69%`: **C+** (2.30)
     - `60% - 64%`: **C** (2.00) &bull; `50% - 59%`: **D** (1.00) &bull; `< 50%`: **F** (0.00)
   - Real-time CGPA calculator ($CGPA = \frac{\sum (Credits \times GP)}{\sum Credits}$).

4. **IUB 1-Page Academic Transcript PDF Generator**
   - Official Independent University, Bangladesh (IUB) main logo crest & address header.
   - Consolidates Student Info, Course Grade Sheet, Credit Hours, Marks, Grade Points, and CGPA.
   - **1-Page A4 PDF Layout**: Strict CSS `@page` and `@media print` rules for single-page printing or PDF export.

---

## 🛠️ Tech Stack

- **Backend**: Python 3.10+, FastAPI, Uvicorn, Pydantic, JSON Database storage
- **Frontend**: React 18, Vite 5, Lucide Icons, Vanilla CSS Design Tokens
- **Repo & Versioning**: Git / GitHub (`https://github.com/Kabir792/Web_App_Project.git`)

---

## 📁 Project Structure

```
student-management-system/
├── backend/
│   ├── app.py                 # Unified FastAPI App (APIRouters registration)
│   ├── run.py                 # Backend Entry Point (http://127.0.0.1:5000)
│   ├── routes/                # student_routes, auth_routes, report_routes
│   ├── services/               # Auth, Student & Report services
│   ├── attendance/             # Attendance Router, Service & JSON storage
│   ├── grades/                 # Grade Router, Service & JSON storage
│   └── data/                   # students.json, users.json
├── frontend/
│   ├── public/                 # iub-logo.png
│   ├── src/
│   │   ├── App.jsx             # Main Gate & Router
│   │   ├── pages/               # RegistrationPage
│   │   ├── components/          # StudentForm, StudentCard, StudentTranscriptModal
│   │   └── modules/
│   │       ├── attendance/      # Attendance Portal UI
│   │       └── grades/          # GradeManagement UI & Search
│   └── vite.config.js
└── README.md
```

---

## 🚀 Setup & Execution Guide

### 1. Backend Setup (FastAPI)

```bash
cd backend

# Create & activate virtual environment (optional)
python -m venv venv
# Windows: venv\Scripts\activate
# Mac/Linux: source venv/bin/activate

# Install requirements & start server
pip install -r requirements.txt
python run.py
```
> Backend runs at `http://127.0.0.1:5000`

### 2. Frontend Setup (React + Vite)

```bash
cd frontend
npm install
npm run dev
```
> Frontend runs at `http://localhost:5173`

---

## 🔑 Login Credentials

| Role | User ID / Username | Password |
| :--- | :--- | :--- |
| **Admin** | `2220792` *(or `admin` / `zahid`)* | `admin123` |
| **Teacher** | `2222625` *(or `teacher` / `shawon`)* | `teacher123` |

---

## 🌐 API Overview

| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `POST` | `/api/auth/login` | Multi-alias Admin / Teacher Authentication |
| `GET` | `/api/students` | Fetch all registered students |
| `POST` | `/api/register` | Register a new student |
| `PUT` | `/api/students/{id}` | Update student profile |
| `DELETE` | `/api/students/{id}` | Delete student record |
| `GET` | `/api/attendance` | Fetch attendance records & metrics |
| `POST` | `/api/attendance` | Mark attendance record (Present/Absent/Late) |
| `GET` | `/api/grades` | Fetch all course grade entries |
| `POST` | `/api/grades` | Add course grade entry |
| `GET` | `/api/grades/{student_id}` | Calculate CGPA and fetch grade sheet for student ID |
| `GET` | `/api/reports/student/{student_id}` | Fetch consolidated student report payload for 1-Page PDF Transcript |

---

## 📜 License & Copyright

Developed for **Web Applications & Internet Course** &bull; **Independent University, Bangladesh (IUB)**.
