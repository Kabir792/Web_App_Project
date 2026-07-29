import React, { useState, useEffect } from 'react';
import Sidebar from './modules/attendance/components/Sidebar';
import Navbar from './modules/attendance/components/Navbar';
import AttendanceDashboard from './modules/attendance/pages/AttendanceDashboard';
import AttendanceManage from './modules/attendance/pages/AttendanceManage';
import LoginForm from './auth/components/LoginForm';
import { logoutApi } from './auth/services/authApi';
import './modules/attendance/styles/Attendance.css';
import './auth/styles/Login.css';

export default function App() {
  const [authUser, setAuthUser] = useState(null);
  const [activeTab, setActiveTab] = useState('dashboard');

  // Load authenticated session from LocalStorage on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem('authUser');
      if (stored) {
        setAuthUser(JSON.parse(stored));
      }
    } catch (e) {
      console.error('Session restore error:', e);
    }
  }, []);

  const handleLoginSuccess = (userSession) => {
    setAuthUser(userSession);
    setActiveTab('dashboard');
  };

  const handleLogout = async () => {
    await logoutApi();
    localStorage.removeItem('authUser');
    setAuthUser(null);
  };

  // If user is not logged in, render the Admin Login Page
  if (!authUser) {
    return (
      <div className="auth-container">
        <LoginForm onLoginSuccess={handleLoginSuccess} />
      </div>
    );
  }

  // Once authenticated, render full Attendance Management System
  return (
    <div className="attendance-app-layout">
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />
      <div className="main-wrapper">
        <Navbar
          title={
            activeTab === 'dashboard'
              ? 'Attendance Dashboard & Metrics'
              : 'Attendance Directory & Filter'
          }
          user={authUser}
          onLogout={handleLogout}
        />
        {activeTab === 'dashboard' ? <AttendanceDashboard /> : <AttendanceManage />}
      </div>
    </div>
  );
}
