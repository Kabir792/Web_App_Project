# 🎓 IUB Smart Campus & Student Utility App — Independent University, Bangladesh

[![FastAPI](https://img.shields.io/badge/FastAPI-0.110.0-009688.svg?style=flat&logo=FastAPI)](https://fastapi.tiangolo.com/)
[![React 18](https://img.shields.io/badge/React-18.3.1-61DAFB.svg?style=flat&logo=react)](https://react.dev/)
[![IndexedDB](https://img.shields.io/badge/OfflineDB-Dexie.js-ff69b4.svg)](https://dexie.org/)
[![Leaflet Maps](https://img.shields.io/badge/Maps-Leaflet-199900.svg?style=flat&logo=leaflet)](https://leafletjs.com/)
[![Location](https://img.shields.io/badge/Campus-Bashundhara_R%2FA_Dhaka-blue.svg)](https://www.iub.edu.bd/)

An enterprise-grade **Offline-First Smart Campus & Student Utility Application** tailored for students of **Independent University, Bangladesh (IUB)**. Students can track CSC course assignments, navigate the IUB Bashundhara campus using interactive vector maps, and calculate attendance targets for SETS courses—even without internet connectivity.

---

## 📍 IUB Campus Features

* 🗺️ **Interactive IUB Campus Map**: Pinpoints the Main Academic Building, SETS AI & Robotics Labs, Central Library, Cafeteria Plaza, and Multipurpose Auditorium at Bashundhara R/A (`23.8151° N, 90.4256° E`).
* ⚡ **Offline-First Architecture**: All reads and writes hit local browser IndexedDB instantly. Background sync engine automatically uploads pending operations when connected to internet or IUB Wi-Fi.
* 📋 **SETS CSC Course & Assignment Tracker**: Track CSC401, CSC409, and CSC415 course deadlines with priority badges (High/Medium/Low), countdown timers, and particle confetti upon task completion.
* 📊 **IUB Attendance Goal Calculator**: Compute exactly how many consecutive classes you must attend to satisfy the university's 75% attendance threshold.

---

## 🏗️ System Architecture

```mermaid
graph TD
    subgraph IUB Client App (React 18 + PWA)
        UI[UI Layer - IUB Dashboard / Map / Tracker]
        DexieDB[(Browser IndexedDB - Dexie.js)]
        SyncEngine[Offline Background Sync Queue]
    end

    subgraph Backend Server (FastAPI + Python)
        API[FastAPI REST Router]
        JSONStore[(Persistent IUB Data Store)]
    end

    UI --> DexieDB
    UI --> SyncEngine
    SyncEngine <-->|Auto Sync when Online| API
    API <--> JSONStore
```

---

## 🚀 Quick Setup & Installation

### 1. Backend Setup (FastAPI)

```bash
cd backend
python -m venv venv
# On Windows: venv\Scripts\activate
# On macOS/Linux: source venv/bin/activate
pip install -r requirements.txt
python run.py
```
*Backend runs at `http://127.0.0.1:5000` (Swagger docs available at `/docs`).*

### 2. Frontend Setup (React + Vite)

```bash
cd frontend
npm install
npm run dev
```
*Frontend runs at `http://localhost:5173`.*

---

## 📄 License
This project is open-source under the MIT License.
