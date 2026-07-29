import React, { useState } from 'react';
import { CreditCard, Lock, LogIn, AlertCircle } from 'lucide-react';
import { loginApi } from '../services/authApi';

export default function LoginForm({ onLoginSuccess }) {
  const [adminId, setAdminId] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [apiError, setApiError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setApiError('');

    if (!adminId.trim()) {
      setErrors({ adminId: 'Admin ID is required.' });
      return;
    }
    if (!password.trim()) {
      setErrors({ password: 'Password is required.' });
      return;
    }

    setErrors({});
    setLoading(true);

    const result = await loginApi(adminId.trim(), password.trim());
    setLoading(false);

    if (result.success) {
      const sessionData = {
        adminId: result.user.adminId,
        name: result.user.name,
        role: result.user.role,
        token: result.token,
        loginTime: new Date().toISOString()
      };

      localStorage.setItem('authUser', JSON.stringify(sessionData));

      if (onLoginSuccess) {
        onLoginSuccess(sessionData);
      }
    } else {
      setApiError(result.message || 'Invalid Admin ID or Password.');
    }
  };

  const handleQuickFill = () => {
    setAdminId('2222625');
    setPassword('admin123');
    setErrors({});
    setApiError('');
  };

  return (
    <div className="auth-card">
      <div className="auth-header">
        <div className="auth-badge-icon">
          <LogIn size={28} />
        </div>
        <h2>Attendance System Sign In</h2>
        <p>Enter Admin ID (2222625) and Password to access system.</p>
      </div>

      {apiError && (
        <div className="auth-form-group" style={{ padding: '0.75rem', background: 'rgba(239, 68, 68, 0.15)', border: '1px solid rgba(239, 68, 68, 0.3)', color: '#fca5a5', borderRadius: '8px', fontSize: '0.85rem' }}>
          <span>{apiError}</span>
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <div className="auth-form-group">
          <label className="auth-label">Admin ID *</label>
          <div className="auth-input-wrapper">
            <CreditCard className="auth-input-icon" size={18} />
            <input
              type="text"
              className="auth-input"
              placeholder="e.g. 2222625"
              value={adminId}
              onChange={(e) => setAdminId(e.target.value)}
            />
          </div>
          {errors.adminId && <span style={{ color: '#ef4444', fontSize: '0.8rem', marginTop: '0.2rem' }}>{errors.adminId}</span>}
        </div>

        <div className="auth-form-group">
          <label className="auth-label">Password *</label>
          <div className="auth-input-wrapper">
            <Lock className="auth-input-icon" size={18} />
            <input
              type="password"
              className="auth-input"
              placeholder="Enter password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          {errors.password && <span style={{ color: '#ef4444', fontSize: '0.8rem', marginTop: '0.2rem' }}>{errors.password}</span>}
        </div>

        <button type="submit" className="auth-submit-btn" disabled={loading}>
          {loading ? <span>Authenticating...</span> : <><LogIn size={18} /><span>Sign In to System</span></>}
        </button>
      </form>

      <div className="auth-quick-fill">
        <button type="button" className="auth-quick-btn" onClick={handleQuickFill}>
          ⚡ Auto-fill Shawon Afrin Badhon (ID: 2222625)
        </button>
      </div>
    </div>
  );
}
