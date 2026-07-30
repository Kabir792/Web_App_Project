import React from 'react';
import { Mail, Phone, Building, Calendar, Edit, Trash2 } from 'lucide-react';

export default function StudentCard({ student, userRole, onEdit, onDelete }) {
  const formattedDate = student.created_at
    ? new Date(student.created_at).toLocaleDateString(undefined, {
        month: 'short',
        day: 'numeric',
        year: 'numeric'
      })
    : 'Recently Added';

  const isAdmin = userRole === 'ADMIN';

  return (
    <div className="student-card">
      <div className="student-card-top">
        <div>
          <h3 className="card-name">{student.name}</h3>
          <div className="card-dept" style={{ margin: '0.2rem 0' }}>
            <Building size={13} style={{ display: 'inline', marginRight: '4px', verticalAlign: 'middle' }} />
            {student.department}
          </div>
        </div>
        <span className="card-id-pill">ID: {student.student_id}</span>
      </div>

      <div className="card-details">
        <div className="card-detail-item">
          <Mail size={13} />
          <span>{student.email}</span>
        </div>
        <div className="card-detail-item">
          <Phone size={13} />
          <span>{student.phone}</span>
        </div>
        <div className="card-detail-item" style={{ marginTop: '4px', opacity: 0.7 }}>
          <Calendar size={12} />
          <span>Registered: {formattedDate}</span>
        </div>
      </div>

      {/* Admin CRUD Action Buttons */}
      {isAdmin && (
        <div
          style={{
            display: 'flex',
            justifyContent: 'flex-end',
            gap: '0.5rem',
            marginTop: '0.85rem',
            paddingTop: '0.65rem',
            borderTop: '1px dashed var(--border-color)'
          }}
        >
          <button
            onClick={() => onEdit(student)}
            style={{
              background: 'rgba(99, 102, 241, 0.15)',
              border: '1px solid rgba(99, 102, 241, 0.4)',
              color: '#a5b4fc',
              padding: '0.3rem 0.65rem',
              borderRadius: 'var(--radius-sm)',
              cursor: 'pointer',
              fontSize: '0.78rem',
              display: 'flex',
              alignItems: 'center',
              gap: '0.35rem'
            }}
            title="Edit Student Info"
          >
            <Edit size={13} />
            <span>Edit</span>
          </button>

          <button
            onClick={() => onDelete(student.student_id, student.name)}
            style={{
              background: 'rgba(239, 68, 68, 0.15)',
              border: '1px solid rgba(239, 68, 68, 0.4)',
              color: '#fca5a5',
              padding: '0.3rem 0.65rem',
              borderRadius: 'var(--radius-sm)',
              cursor: 'pointer',
              fontSize: '0.78rem',
              display: 'flex',
              alignItems: 'center',
              gap: '0.35rem'
            }}
            title="Delete Student Record"
          >
            <Trash2 size={13} />
            <span>Delete</span>
          </button>
        </div>
      )}
    </div>
  );
}
