import React from 'react';
import { ShieldCheck, LogOut } from 'lucide-react';

export default function Navbar({ title = 'Attendance Management', user, onLogout }) {
  return (
    <header className="navbar-container">
      <div className="navbar-title">
        <h1>{title}</h1>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
        <div className="navbar-user-chip">
          <ShieldCheck size={16} color="#10b981" />
          <span>
            Admin: <strong>{user?.name || 'Shawon Afrin Badhon'}</strong> (ID: <strong style={{ color: '#10b981' }}>{user?.adminId || '2222625'}</strong>)
          </span>
        </div>

        {onLogout && (
          <button
            onClick={onLogout}
            style={{
              background: 'rgba(239, 68, 68, 0.15)',
              border: '1px solid rgba(239, 68, 68, 0.3)',
              color: '#fca5a5',
              padding: '0.4rem 0.85rem',
              borderRadius: '9999px',
              fontSize: '0.82rem',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '0.35rem',
              fontWeight: 600
            }}
            title="Logout session"
          >
            <LogOut size={14} />
            <span>Logout</span>
          </button>
        )}
      </div>
    </header>
  );
}
