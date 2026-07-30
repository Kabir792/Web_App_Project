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
      setErrorMsg('Please enter your User ID and password.');
      return;
    }

    setLoading(true);
    setErrorMsg('');
    const res = await loginUser(userId, password);
    setLoading(false);

    if (res.success) {
      onLoginSuccess(res.user);
    } else {
      setErrorMsg(res.message || 'Invalid User ID or password');
    }
  };

  const handleQuickFillAdmin = () => {
    setUserId('2220792');
    setPassword('admin123');
    setErrorMsg('');
  };

  const handleQuickFillTeacher = () => {
    setUserId('teacher01');
    setPassword('teacher123');
    setErrorMsg('');
  };

  return (
    <div className="form-card" style={{ maxWidth: '460px', margin: '2.5rem auto' }}>
      <div className="form-card-header" style={{ justifyContent: 'center', textAlign: 'center' }}>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.6rem' }}>
          <div className="portal-crest-box" style={{ width: '60px', height: '60px' }}>
            <GraduationCap size={32} />
          </div>
          <div>
            <h2 style={{ fontSize: '1.4rem' }}>SMS Portal Sign In</h2>
            <span style={{ fontSize: '0.78rem', color: 'var(--sms-amber)', fontWeight: 700, textTransform: 'uppercase' }}>
              Admin for registration • Teacher for attendance
            </span>
          </div>
        </div>
      </div>

      {errorMsg && <AlertMessage type="error" message={errorMsg} />}

      <form onSubmit={handleSubmit}>
        <FormInput
          label="User ID"
          name="user_id"
          type="text"
          value={userId}
          onChange={(e) => setUserId(e.target.value)}
          placeholder="Enter admin or teacher ID"
          icon={CreditCard}
        />

        <FormInput
          label="Password"
          name="password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Enter your password"
          icon={Lock}
        />

        <button type="submit" className="btn-submit" disabled={loading}>
          {loading ? (
            <div className="spinner" />
          ) : (
            <>
              <KeyRound size={18} />
              <span>Log In to Portal</span>
            </>
          )}
        </button>
      </form>

      {/* Quick Login Presets */}
      <div style={{ marginTop: '1.5rem', paddingTop: '1.25rem', borderTop: '1px solid var(--border-color)', textAlign: 'center', display: 'grid', gap: '0.7rem' }}>
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
          <span>⚡ Admin Quick Login (ID: 2220792)</span>
        </button>

        <button
          type="button"
          onClick={handleQuickFillTeacher}
          style={{
            width: '100%',
            padding: '0.65rem',
            background: 'rgba(16, 185, 129, 0.12)',
            border: '1px solid rgba(16, 185, 129, 0.4)',
            borderRadius: 'var(--radius-sm)',
            color: '#34d399',
            fontSize: '0.84rem',
            cursor: 'pointer',
            fontWeight: 700,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '0.4rem'
          }}
        >
          <GraduationCap size={16} color="#34d399" />
          <span>⚡ Teacher Quick Login (ID: 2222625)</span>
        </button>
      </div>
    </div>
  );
}
