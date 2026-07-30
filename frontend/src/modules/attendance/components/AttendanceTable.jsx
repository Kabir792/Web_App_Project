import React from 'react';
import { Edit2, Trash2, Calendar, Search } from 'lucide-react';

export default function AttendanceTable({
  records = [],
  loading = false,
  onEdit,
  onDelete
}) {
  if (loading) {
    return (
      <div className="att-table-wrapper" style={{ padding: '3rem', textAlign: 'center', color: 'var(--att-text-dim)' }}>
        <div className="att-spinner" style={{ margin: '0 auto 1rem' }} />
        <span>Loading attendance directory...</span>
      </div>
    );
  }

  if (!records || records.length === 0) {
    return (
      <div className="att-table-wrapper" style={{ padding: '3rem', textAlign: 'center', color: 'var(--att-text-dim)' }}>
        <Search size={36} style={{ margin: '0 auto 0.75rem', opacity: 0.5 }} />
        <p>No attendance records found.</p>
      </div>
    );
  }

  return (
    <div className="att-table-wrapper">
      <table className="att-table">
        <thead>
          <tr>
            <th>Student ID</th>
            <th>Student Name</th>
            <th>Department</th>
            <th>Date</th>
            <th>Status</th>
            <th style={{ textAlign: 'right' }}>Actions</th>
          </tr>
        </thead>
        <tbody>
          {records.map((r) => (
            <tr key={r.id || `${r.studentId}-${r.date}`}>
              <td>
                <span style={{ fontFamily: 'monospace', color: '#10b981', fontWeight: 700 }}>
                  {r.studentId}
                </span>
              </td>
              <td style={{ fontWeight: 600, color: '#fff' }}>{r.studentName}</td>
              <td style={{ color: 'var(--att-text-muted)' }}>{r.department}</td>
              <td>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', color: 'var(--att-text-dim)', fontSize: '0.85rem' }}>
                  <Calendar size={13} />
                  <span>{r.date}</span>
                </div>
              </td>
              <td>
                <span className={`status-pill ${r.status}`}>
                  {r.status}
                </span>
              </td>
              <td style={{ textAlign: 'right' }}>
                <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.4rem' }}>
                  <button
                    onClick={() => onEdit(r)}
                    style={{
                      background: 'rgba(59, 130, 246, 0.15)',
                      border: '1px solid rgba(59, 130, 246, 0.3)',
                      color: '#93c5fd',
                      padding: '0.3rem 0.6rem',
                      borderRadius: '6px',
                      cursor: 'pointer',
                      fontSize: '0.8rem',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.3rem'
                    }}
                    title="Edit Record"
                  >
                    <Edit2 size={13} />
                    <span>Edit</span>
                  </button>

                  <button
                    onClick={() => onDelete(r.id, r.studentName)}
                    style={{
                      background: 'rgba(239, 68, 68, 0.15)',
                      border: '1px solid rgba(239, 68, 68, 0.3)',
                      color: '#fca5a5',
                      padding: '0.3rem 0.6rem',
                      borderRadius: '6px',
                      cursor: 'pointer',
                      fontSize: '0.8rem',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.3rem'
                    }}
                    title="Delete Record"
                  >
                    <Trash2 size={13} />
                    <span>Delete</span>
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
