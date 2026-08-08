import React, { useState, useEffect, Component } from 'react';
import LoginForm from './components/LoginForm';
import RegistrationPage from './pages/RegistrationPage';
import Sidebar from './modules/attendance/components/Sidebar';
import Navbar from './modules/attendance/components/Navbar';
import AttendanceDashboard from './modules/attendance/pages/AttendanceDashboard';
import AttendanceManage from './modules/attendance/pages/AttendanceManage';
import GradeManagement from './modules/grades/GradeManagement';

class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('App ErrorBoundary caught error:', error, errorInfo);
  }

  handleReset = () => {
    try {
      localStorage.clear();
      sessionStorage.clear();
    } catch (e) {
      console.error('Clear storage error:', e);
    }
    this.setState({ hasError: false, error: null });
    window.location.href = window.location.origin + window.location.pathname;
  };

  render() {
    if (this.state.hasError) {
      return (
        <div style={{
          minHeight: '100vh',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          background: '#0a0f1d',
          color: '#f8fafc',
          padding: '2rem',
          textAlign: 'center',
          fontFamily: 'system-ui, sans-serif'
        }}>
          <div style={{
            background: 'rgba(15, 23, 42, 0.95)',
            border: '1px solid rgba(239, 68, 68, 0.4)',
            borderRadius: '16px',
            padding: '2.5rem',
            maxWidth: '560px',
            boxShadow: '0 20px 50px rgba(0,0,0,0.6)'
          }}>
            <h2 style={{ fontSize: '1.6rem', color: '#ef4444', marginBottom: '0.75rem', fontWeight: '800' }}>
              Application Session Reset Needed
            </h2>
            <p style={{ color: '#94a3b8', marginBottom: '1.25rem', fontSize: '0.95rem', lineHeight: '1.6' }}>
              A transient state error occurred. Click the button below to clear cached session data and restore the portal.
            </p>

            {this.state.error && (
              <div style={{
                background: 'rgba(239, 68, 68, 0.1)',
                border: '1px solid rgba(239, 68, 68, 0.25)',
                color: '#fca5a5',
                padding: '0.75rem 1rem',
                borderRadius: '8px',
                fontSize: '0.82rem',
                fontFamily: 'monospace',
                marginBottom: '1.5rem',
                textAlign: 'left',
                wordBreak: 'break-word'
              }}>
                {String(this.state.error.message || this.state.error)}
              </div>
            )}

            <button
              onClick={this.handleReset}
              style={{
                width: '100%',
                padding: '14px',
                background: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
                color: '#000000',
                fontWeight: '800',
                border: 'none',
                borderRadius: '10px',
                cursor: 'pointer',
                fontSize: '1rem',
                boxShadow: '0 4px 15px rgba(245, 158, 11, 0.35)'
              }}
            >
              Reset Session &amp; Reload Portal
            </button>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}

export default function App() {
  const [currentUser, setCurrentUser] = useState(null);
  const [activeModule, setActiveModule] = useState('registration'); // 'registration' | 'attendance' | 'grades'
  const [attendanceTab, setAttendanceTab] = useState('dashboard'); // 'dashboard' | 'manage'

  const resolveInitialModule = (user) => (user?.role === 'TEACHER' ? 'attendance' : 'registration');

  // Restore session on refresh safely
  useEffect(() => {
    try {
      const stored = localStorage.getItem('authUser');
      if (stored) {
        const parsedUser = JSON.parse(stored);
        if (parsedUser && parsedUser.user_id && parsedUser.role) {
          setCurrentUser(parsedUser);
          setActiveModule(resolveInitialModule(parsedUser));
        } else {
          localStorage.removeItem('authUser');
        }
      }
    } catch (e) {
      console.error('Session restore error:', e);
      localStorage.removeItem('authUser');
    }
  }, []);

  const handleLoginSuccess = (user) => {
    if (!user || !user.user_id) return;
    setCurrentUser(user);
    setActiveModule(resolveInitialModule(user));
    localStorage.setItem('authUser', JSON.stringify(user));
  };

  const handleLogout = () => {
    setCurrentUser(null);
    try {
      localStorage.removeItem('authUser');
      sessionStorage.clear();
    } catch (e) {}
    setActiveModule('registration');
  };

  return (
    <ErrorBoundary>
      {!currentUser ? (
        <div
          style={{
            minHeight: '100vh',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: 'var(--bg-primary)',
            padding: '1rem'
          }}
        >
          <LoginForm onLoginSuccess={handleLoginSuccess} />
        </div>
      ) : activeModule === 'grades' ? (
        <GradeManagement
          user={currentUser}
          onLogout={handleLogout}
          onSwitchModule={() => setActiveModule('registration')}
        />
      ) : activeModule === 'attendance' ? (
        <div className="attendance-app-layout">
          <Sidebar
            activeTab={attendanceTab}
            setActiveTab={setAttendanceTab}
            onSwitchModule={() => setActiveModule('registration')}
            onOpenGrades={() => setActiveModule('grades')}
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
      ) : (
        <RegistrationPage
          user={currentUser}
          onLogout={handleLogout}
          onSwitchModule={() => setActiveModule('attendance')}
          onOpenGrades={() => setActiveModule('grades')}
        />
      )}
    </ErrorBoundary>
  );
}
