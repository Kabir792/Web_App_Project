import React, { useState, useEffect } from 'react';
import { CalendarCheck, Save, X, AlertCircle } from 'lucide-react';
import { getRegisteredStudentsApi } from '../services/attendanceApi';

const DEPARTMENTS = [
  'Computer Science & Engineering',
  'Software Engineering',
  'Electrical & Electronic Engineering',
  'Information Technology',
  'Business Administration'
];

export default function AttendanceForm({ initialData = null, onSubmit, onCancel }) {
  const todayStr = new Date().toISOString().split('T')[0];

  const [formData, setFormData] = useState({
    studentId: '',
    studentName: '',
    department: 'Computer Science & Engineering',
    date: todayStr,
    status: 'Present'
  });

  const [errorMsg, setErrorMsg] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (initialData) {
      setFormData({
        studentId: initialData.studentId || '',
        studentName: initialData.studentName || '',
        department: initialData.department || 'Computer Science & Engineering',
        date: initialData.date || todayStr,
        status: initialData.status || 'Present'
      });
      return;
    }

    const loadRegisteredStudent = async () => {
      try {
        const res = await getRegisteredStudentsApi();
        if (res.success) {
          const students = res.data || [];
          const latest = students[students.length - 1];
          if (latest) {
            setFormData((prev) => ({
              ...prev,
              studentId: prev.studentId || latest.studentId || '',
              studentName: prev.studentName || latest.studentName || '',
              department: prev.department || latest.department || 'Computer Science & Engineering'
            }));
          }
        }
      } catch (err) {
        console.error('Failed to load registered students:', err);
      }
    };

    loadRegisteredStudent();
  }, [initialData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    if (e) e.preventDefault();
    setErrorMsg('');

    // Field Validation
    if (!formData.studentId || !formData.studentId.trim()) {
      setErrorMsg('Student ID cannot be empty.');
      return;
    }
    if (!formData.studentName || !formData.studentName.trim()) {
      setErrorMsg('Student Name is required.');
      return;
    }
    if (!formData.date || !formData.date.trim()) {
      setErrorMsg('Date cannot be empty.');
      return;
    }
    if (!formData.status || !formData.status.trim()) {
      setErrorMsg('Status must be selected.');
      return;
    }

    try {
      setIsSubmitting(true);
      await onSubmit(formData);
    } catch (err) {
      console.error('Submit Error:', err);
      setErrorMsg('An unexpected error occurred while submitting.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleQuickFill = () => {
    setFormData({
      studentId: '2222625',
      studentName: 'Shawon Afrin Badhon',
      department: 'Computer Science & Engineering',
      date: todayStr,
      status: 'Present'
    });
    setErrorMsg('');
  };

  return (
    <div className="att-form-card">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
        <h3 style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: '1.2rem', color: '#fff', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <CalendarCheck color="#10b981" size={22} />
          <span>{initialData ? `Edit Attendance #${initialData.id}` : 'Mark Student Attendance'}</span>
        </h3>
        {onCancel && (
          <button onClick={onCancel} style={{ background: 'transparent', border: 'none', color: '#94a3b8', cursor: 'pointer' }}>
            <X size={20} />
          </button>
        )}
      </div>

      {errorMsg && (
        <div style={{ padding: '0.75rem 1rem', background: 'rgba(239, 68, 68, 0.12)', border: '1px solid rgba(239, 68, 68, 0.3)', color: '#fca5a5', borderRadius: '8px', marginBottom: '1.25rem', fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
          <AlertCircle size={16} />
          <span>{errorMsg}</span>
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <div className="att-form-grid">
          {/* Student ID */}
          <div className="att-input-group">
            <label className="att-label">Student ID *</label>
            <input
              type="text"
              name="studentId"
              className="att-input"
              placeholder="e.g. 2220792"
              value={formData.studentId}
              onChange={handleChange}
              required
            />
          </div>

          {/* Student Name */}
          <div className="att-input-group">
            <label className="att-label">Student Name *</label>
            <input
              type="text"
              name="studentName"
              className="att-input"
              placeholder="e.g. Zahid Kabir Utsho"
              value={formData.studentName}
              onChange={handleChange}
              required
            />
          </div>

          {/* Department */}
          <div className="att-input-group">
            <label className="att-label">Department *</label>
            <select
              name="department"
              className="att-select"
              value={formData.department}
              onChange={handleChange}
            >
              {DEPARTMENTS.map((dept) => (
                <option key={dept} value={dept}>{dept}</option>
              ))}
            </select>
          </div>

          {/* Date */}
          <div className="att-input-group">
            <label className="att-label">Date *</label>
            <input
              type="date"
              name="date"
              className="att-input"
              value={formData.date}
              onChange={handleChange}
              required
            />
          </div>

          {/* Status */}
          <div className="att-input-group">
            <label className="att-label">Status *</label>
            <select
              name="status"
              className="att-select"
              value={formData.status}
              onChange={handleChange}
            >
              <option value="Present">Present</option>
              <option value="Absent">Absent</option>
              <option value="Late">Late</option>
            </select>
          </div>
        </div>

        <div style={{ display: 'flex', gap: '1rem', marginTop: '1.5rem', justifyContent: 'space-between', alignItems: 'center' }}>
          <button
            type="button"
            onClick={handleQuickFill}
            style={{ padding: '0.6rem 0.9rem', background: 'rgba(16, 185, 129, 0.12)', border: '1px solid rgba(16, 185, 129, 0.3)', color: '#6ee7b7', borderRadius: '8px', cursor: 'pointer', fontSize: '0.8rem', fontWeight: 600 }}
          >
            ⚡ Auto-fill Demo Sample
          </button>

          <div style={{ display: 'flex', gap: '1rem' }}>
            {onCancel && (
              <button type="button" onClick={onCancel} style={{ padding: '0.85rem 1.25rem', background: 'transparent', border: '1px solid var(--att-border)', color: '#94a3b8', borderRadius: '12px', cursor: 'pointer', fontWeight: 600 }}>
                Cancel
              </button>
            )}
            <button
              type="submit"
              className="btn-mark-submit"
              disabled={isSubmitting}
              style={{ opacity: isSubmitting ? 0.7 : 1 }}
            >
              {isSubmitting ? (
                <span>Saving...</span>
              ) : (
                <>
                  <Save size={18} />
                  <span>{initialData ? 'Update Attendance' : 'Submit Attendance'}</span>
                </>
              )}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}
