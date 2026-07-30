import React, { useState, useEffect } from 'react';
import LoginForm from './components/LoginForm';
import RegistrationPage from './pages/RegistrationPage';
import Sidebar from './modules/attendance/components/Sidebar';
import Navbar from './modules/attendance/components/Navbar';
import AttendanceDashboard from './modules/attendance/pages/AttendanceDashboard';
import AttendanceManage from './modules/attendance/pages/AttendanceManage';

export default function App() {
  const [currentUser, setCurrentUser] = useState(null);
  const [activeModule, setActiveModule] = useState('registration'); // 'registration' | 'attendance'
  const [attendanceTab, setAttendanceTab] = useState('dashboard'); // 'dashboard' | 'manage'

  const resolveInitialModule = (user) => (user?.role === 'TEACHER' ? 'attendance' : 'registration');

  // Restore session on refresh
  useEffect(() => {
    try {
      const stored = localStorage.getItem('authUser');
      if (stored) {
        const parsedUser = JSON.parse(stored);
        setCurrentUser(parsedUser);
        setActiveModule(resolveInitialModule(parsedUser));
      }
    } catch (e) {
      console.error('Session restore error:', e);
    }
  }, []);

  const handleLoginSuccess = (user) => {
    setCurrentUser(user);
    setActiveModule(resolveInitialModule(user));
    localStorage.setItem('authUser', JSON.stringify(user));
  };

  const handleLogout = () => {
    setCurrentUser(null);
    localStorage.removeItem('authUser');
    setActiveModule('registration');
  };

  // Not logged in -> single shared login screen for both modules
  if (!currentUser) {
    return (
      <div
        style={{
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: 'var(--bg-primary)'
        }}
      >
        <LoginForm onLoginSuccess={handleLoginSuccess} />
      </div>
    );
  }

  // Attendance module
  if (activeModule === 'attendance') {
    return (
      <div className="attendance-app-layout">
        <Sidebar
          activeTab={attendanceTab}
          setActiveTab={setAttendanceTab}
          onSwitchModule={() => setActiveModule('registration')}
        />
        <div className="main-wrapper">
          <Navbar
            title={
              attendanceTab === 'dashboard'
                ? 'Attendance Dashboard & Metrics'
                : 'Attendance Directory & Filter'
            }
            user={currentUser}
            onLogout={handleLogout}
          />
          {attendanceTab === 'dashboard' ? <AttendanceDashboard /> : <AttendanceManage />}
        </div>
      </div>
    );
  }

  // Registration module (default)
  return (
    <RegistrationPage
      user={currentUser}
      onLogout={handleLogout}
      onSwitchModule={() => setActiveModule('attendance')}
    />
  );
}
