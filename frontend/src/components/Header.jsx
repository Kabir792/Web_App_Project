import React from 'react';
import { ShieldCheck, LogOut, KeyRound, GraduationCap, CalendarCheck } from 'lucide-react';

export default function Header({ user, onLogout, onOpenLoginModal, onSwitchModule, onOpenGrades }) {
  return (
    <header className="header-bar">
      <div className="header-inner">
        <div className="logo-section">
          {/* Portal Crest Badge */}
          <div className="portal-crest-box">
            <GraduationCap size={24} />
          </div>
          <div className="logo-text">
            <h1>Student Management System</h1>
            <span>SMS Portal &bull; Academic Portal v2.0</span>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
          {user ? (
            <>
              {onSwitchModule && (
                <button
                  onClick={onSwitchModule}
                  style={{
                    background: 'rgba(16, 185, 129, 0.15)',
                    border: '1px solid rgba(16, 185, 129, 0.35)',
                    color: '#34d399',
                    padding: '0.45rem 0.85rem',
                    borderRadius: 'var(--radius-pill)',
                    fontSize: '0.82rem',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.35rem',
                    fontWeight: 600
                  }}
                  title="Go to Attendance Module"
                >
                  <CalendarCheck size={14} />
                  <span>Attendance</span>
                </button>
              )}

              {onOpenGrades && (
                <button
                  onClick={onOpenGrades}
                  style={{
                    background: 'rgba(99, 102, 241, 0.15)',
                    border: '1px solid rgba(99, 102, 241, 0.35)',
                    color: '#818cf8',
                    padding: '0.45rem 0.85rem',
                    borderRadius: 'var(--radius-pill)',
                    fontSize: '0.82rem',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.35rem',
                    fontWeight: 600
                  }}
                  title="Go to Academic Grades Module"
                >
                  <GraduationCap size={14} />
                  <span>Grades & GPA</span>
                </button>
              )}

              <div className="student-badge">
                <ShieldCheck size={16} color="#f59e0b" />
                <span>
                  {user?.role === 'TEACHER' ? 'Teacher' : 'Admin'} ID: <strong style={{ color: '#f59e0b' }}>{user?.user_id}</strong> &bull;{' '}
                  <strong>{user?.name || 'Admin'}</strong>
                </span>
              </div>

              <button
                onClick={onLogout}
                style={{
                  background: 'rgba(239, 68, 68, 0.15)',
                  border: '1px solid rgba(239, 68, 68, 0.3)',
                  color: '#fca5a5',
                  padding: '0.45rem 0.85rem',
                  borderRadius: 'var(--radius-pill)',
                  fontSize: '0.82rem',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.35rem',
                  fontWeight: 600
                }}
                title="Logout from session"
              >
                <LogOut size={14} />
                <span>Logout</span>
              </button>
            </>
          ) : (
            <button
              onClick={onOpenLoginModal}
              style={{
                background: 'linear-gradient(135deg, var(--sms-amber), var(--sms-amber-hover))',
                border: 'none',
                color: '#000000',
                padding: '0.5rem 1.1rem',
                borderRadius: 'var(--radius-pill)',
                fontSize: '0.85rem',
                cursor: 'pointer',
                fontWeight: 800,
                display: 'flex',
                alignItems: 'center',
                gap: '0.4rem'
              }}
            >
              <KeyRound size={15} />
              <span>Admin Login</span>
            </button>
          )}
        </div>
      </div>
    </header>
  );
}
