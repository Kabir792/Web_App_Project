import React, { useState } from 'react';
import { Lock, CreditCard, ShieldCheck, KeyRound, GraduationCap } from 'lucide-react';
import FormInput from './FormInput';
import AlertMessage from './AlertMessage';
import { loginUser } from '../services/api';

export default function LoginForm({ onLoginSuccess }) {
  const [userId, setUserId] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!userId || !password) {
      setErrorMsg('Please enter Admin User ID and password.');
      return;
    }

    setLoading(true);
    setErrorMsg('');
    const res = await loginUser(userId, password);
    setLoading(false);

    if (res.success) {
      onLoginSuccess(res.user);
    } else {
      setErrorMsg(res.message || 'Invalid Admin User ID or password');
    }
  };

  const handleQuickFillAdmin = () => {
    setUserId('2220792');
    setPassword('admin123');
  };

  return (
    <div className="form-card" style={{ maxWidth: '460px', margin: '2.5rem auto' }}>
      <div className="form-card-header" style={{ justifyContent: 'center', textAlign: 'center' }}>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.6rem' }}>
          <div className="portal-crest-box" style={{ width: '60px', height: '60px' }}>
            <GraduationCap size={32} />
          </div>
          <div>
            <h2 style={{ fontSize: '1.4rem' }}>Admin Portal Sign In</h2>
            <span style={{ fontSize: '0.78rem', color: 'var(--sms-amber)', fontWeight: 700, textTransform: 'uppercase' }}>
              Student Management System
            </span>
          </div>
        </div>
      </div>

      {errorMsg && <AlertMessage type="error" message={errorMsg} />}

      <form onSubmit={handleSubmit}>
        <FormInput
          label="Admin User ID"
          name="user_id"
          type="text"
          value={userId}
          onChange={(e) => setUserId(e.target.value)}
          placeholder="Enter Admin ID (e.g. 2220792)"
          icon={CreditCard}
        />

        <FormInput
          label="Password"
          name="password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Enter Admin password"
          icon={Lock}
        />

        <button type="submit" className="btn-submit" disabled={loading}>
          {loading ? (
            <div className="spinner" />
          ) : (
            <>
              <KeyRound size={18} />
              <span>Log In as Admin</span>
            </>
          )}
        </button>
      </form>

      {/* Quick Login Preset */}
      <div style={{ marginTop: '1.5rem', paddingTop: '1.25rem', borderTop: '1px solid var(--border-color)', textAlign: 'center' }}>
        <button
          type="button"
          onClick={handleQuickFillAdmin}
          style={{
            width: '100%',
            padding: '0.65rem',
            background: 'rgba(245, 158, 11, 0.12)',
            border: '1px solid var(--sms-amber)',
            borderRadius: 'var(--radius-sm)',
            color: 'var(--sms-amber)',
            fontSize: '0.84rem',
            cursor: 'pointer',
            fontWeight: 700,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '0.4rem'
          }}
        >
          <ShieldCheck size={16} color="#f59e0b" />
          <span>⚡ Auto-fill Admin Credentials (ID: 2220792)</span>
        </button>
      </div>
    </div>
  );
}
