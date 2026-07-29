import React, { useState, useEffect } from 'react';
import { User, CreditCard, Building2, Mail, PhoneCall, Save, X } from 'lucide-react';
import FormInput from './FormInput';
import AlertMessage from './AlertMessage';
import { updateStudent } from '../services/api';

const DEPARTMENTS = [
  'Computer Science & Engineering',
  'Software Engineering',
  'Electrical & Electronic Engineering',
  'Information Technology',
  'Business Administration',
  'Civil Engineering',
  'Mechanical Engineering'
];

export default function StudentEditModal({ student, onClose, onSaveSuccess }) {
  const [formData, setFormData] = useState({
    name: student.name || '',
    student_id: student.student_id || '',
    department: student.department || '',
    email: student.email || '',
    phone: student.phone || ''
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [apiFeedback, setApiFeedback] = useState(null);

  useEffect(() => {
    setFormData({
      name: student.name || '',
      student_id: student.student_id || '',
      department: student.department || '',
      email: student.email || '',
      phone: student.phone || ''
    });
  }, [student]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setApiFeedback(null);

    const res = await updateStudent(student.student_id, formData);
    setLoading(false);

    if (res.success) {
      onSaveSuccess(res.data);
      onClose();
    } else {
      setApiFeedback({
        type: 'error',
        title: 'Update Failed',
        message: res.message,
        errors: res.errors
      });
      if (res.errors) {
        setErrors(res.errors);
      }
    }
  };

  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.75)',
        backdropFilter: 'blur(8px)',
        zIndex: 1000,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '1.5rem'
      }}
    >
      <div
        className="form-card"
        style={{ width: '100%', maxWidth: '540px', position: 'relative', maxHeight: '90vh', overflowY: 'auto' }}
      >
        <button
          onClick={onClose}
          style={{
            position: 'absolute',
            top: '1.25rem',
            right: '1.25rem',
            background: 'transparent',
            border: 'none',
            color: 'var(--text-muted)',
            cursor: 'pointer'
          }}
        >
          <X size={20} />
        </button>

        <div className="form-card-header">
          <h2>Edit Student Record (ID: {student.student_id})</h2>
        </div>

        {apiFeedback && (
          <AlertMessage
            type={apiFeedback.type}
            title={apiFeedback.title}
            message={apiFeedback.message}
            errors={apiFeedback.errors}
          />
        )}

        <form onSubmit={handleSubmit}>
          <FormInput
            label="Student Full Name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            error={errors.name}
            icon={User}
          />

          <div className="form-group">
            <label className="form-label">Student ID (Read-only)</label>
            <div className="input-wrapper">
              <CreditCard className="input-icon" size={18} />
              <input
                className="form-input"
                value={formData.student_id}
                disabled
                style={{ opacity: 0.6, cursor: 'not-allowed' }}
              />
            </div>
          </div>

          <FormInput
            label="Department"
            name="department"
            type="select"
            options={DEPARTMENTS}
            value={formData.department}
            onChange={handleChange}
            error={errors.department}
            icon={Building2}
          />

          <FormInput
            label="Email Address"
            name="email"
            type="email"
            value={formData.email}
            onChange={handleChange}
            error={errors.email}
            icon={Mail}
          />

          <FormInput
            label="Phone Number"
            name="phone"
            type="tel"
            value={formData.phone}
            onChange={handleChange}
            error={errors.phone}
            icon={PhoneCall}
          />

          <div style={{ display: 'flex', gap: '1rem', marginTop: '1.5rem' }}>
            <button
              type="button"
              onClick={onClose}
              style={{
                flex: 1,
                padding: '0.85rem',
                background: 'transparent',
                border: '1px solid var(--border-color)',
                color: 'var(--text-muted)',
                borderRadius: 'var(--radius-md)',
                cursor: 'pointer',
                fontWeight: 600
              }}
            >
              Cancel
            </button>
            <button type="submit" className="btn-submit" disabled={loading} style={{ flex: 1, marginTop: 0 }}>
              {loading ? (
                <div className="spinner" />
              ) : (
                <>
                  <Save size={18} />
                  <span>Update Record</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
